'use client';

import { useUnit } from 'effector-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import { CloseGlyph, MinGlyph, ZoomGlyph } from '@/shared/icons';
import { useI18n } from '@/shared/i18n-context';
import { getViewport, useIsMobile } from '@/shared/viewport';
import { clampRect, MENUBAR_H, MIN_H, MIN_W, type Rect, type WindowState } from './logic';
import {
  windowClosed,
  windowFocused,
  windowMeasured,
  windowMinimized,
  windowRectChanged,
  windowZoomToggled,
} from './model';
import { getOrigin, type OriginRect } from './origin';

const DIRS = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type Dir = (typeof DIRS)[number];

/** Мягкий выход без «пружины» и плавное ускорение на закрытии — как у окон macOS. */
export const EASE_OPEN = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const EASE_CLOSE = 'cubic-bezier(0.5, 0, 0.75, 0.4)';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** transform, который «сжимает» окно в прямоугольник-источник (иконку или док). */
export function toOrigin(el: HTMLElement, o: OriginRect): string {
  const r = el.getBoundingClientRect();
  const sx = Math.max(o.w / r.width, 0.04);
  const sy = Math.max(o.h / r.height, 0.04);
  const dx = o.x + o.w / 2 - (r.left + r.width / 2);
  const dy = o.y + o.h / 2 - (r.top + r.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
}

function dockOrigin(): OriginRect | undefined {
  const dock = document.querySelector('.dock')?.getBoundingClientRect();
  return dock ? { x: dock.left + dock.width / 2 - 24, y: dock.top, w: 48, h: 48 } : undefined;
}

export function Window({
  win,
  isTop,
  title,
  children,
  bodyClassName,
}: {
  win: WindowState;
  isTop: boolean;
  title: string;
  children: ReactNode;
  bodyClassName?: string;
}) {
  const { dict } = useI18n();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const headingId = `${win.id.replace(':', '-')}-title`;
  const [animatingRect, setAnimatingRect] = useState(false);
  const [gesture, setGesture] = useState<'drag' | 'resize' | null>(null);
  const busy = useRef(false);
  const fromDock = useRef(false);
  const api = useUnit({
    close: windowClosed,
    focus: windowFocused,
    minimize: windowMinimized,
    measured: windowMeasured,
    rectChanged: windowRectChanged,
    zoom: windowZoomToggled,
  });

  // Окно пришло с сервера без координат — меряем его и дальше управляем в пикселях.
  useLayoutEffect(() => {
    if (win.rect || !ref.current) return;
    const el = ref.current;
    api.measured({
      id: win.id,
      rect: { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight },
    });
  }, [win.rect, win.id, api]);

  // Появление: как в macOS — окно вырастает из иконки, по которой кликнули (или из дока после сворачивания).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || win.minimized) return;
    if (reducedMotion()) return;
    const origin = isMobile ? undefined : fromDock.current ? dockOrigin() : getOrigin(win.id);
    fromDock.current = false;
    const anim = origin
      ? el.animate(
          [
            { transform: toOrigin(el, origin), opacity: 0.4 },
            { transform: 'none', opacity: 1 },
          ],
          {
            duration: 520,
            easing: EASE_OPEN,
          },
        )
      : el.animate(
          isMobile
            ? [{ transform: 'translateY(100%)' }, { transform: 'none' }]
            : [
                { transform: 'scale(0.94)', opacity: 0 },
                { transform: 'none', opacity: 1 },
              ],
          { duration: isMobile ? 460 : 320, easing: EASE_OPEN },
        );
    return () => anim.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- анимация только при появлении/разворачивании из дока
  }, [win.minimized]);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(`#${CSS.escape(headingId)}`)?.focus({ preventScroll: true });
  }, [headingId]);

  if (win.minimized) return null;

  const animateOut = (target: 'origin' | 'dock', done: () => void) => {
    const el = ref.current;
    if (!el || busy.current) return;
    if (reducedMotion()) return done();
    busy.current = true;
    const origin = isMobile ? undefined : target === 'dock' ? dockOrigin() : getOrigin(win.id);
    const frames = isMobile
      ? [{ transform: 'none' }, { transform: 'translateY(100%)' }]
      : origin
        ? [
            { transform: 'none', opacity: 1 },
            { transform: toOrigin(el, origin), opacity: target === 'dock' ? 0.6 : 0 },
          ]
        : [
            { transform: 'none', opacity: 1 },
            { transform: 'scale(0.94)', opacity: 0 },
          ];
    const anim = el.animate(frames, {
      duration: isMobile ? 320 : target === 'dock' ? 440 : 340,
      easing: EASE_CLOSE,
      fill: 'forwards',
    });
    anim.onfinish = () => {
      busy.current = false;
      done();
    };
  };

  const close = () => animateOut('origin', () => api.close(win.id));
  const minimize = () =>
    animateOut('dock', () => {
      fromDock.current = true;
      api.minimize(win.id);
    });

  const startGesture = (e: RPointerEvent, kind: 'drag' | 'resize', dir?: Dir) => {
    if (isMobile || e.button !== 0 || !ref.current || !win.rect) return;
    if (kind === 'drag' && (e.target as HTMLElement).closest('button, a, input')) return;
    e.preventDefault();
    const el = ref.current;
    const start = win.rect;
    const sx = e.clientX;
    const sy = e.clientY;
    let next: Rect = start;
    let moved = false;
    setGesture(kind);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 3) return;
      moved = true;
      if (kind === 'drag') {
        next = { ...start, x: start.x + dx, y: start.y + dy };
      } else if (dir) {
        let { x, y, w, h } = start;
        if (dir.includes('e')) w = Math.max(MIN_W, start.w + dx);
        if (dir.includes('s')) h = Math.max(MIN_H, start.h + dy);
        if (dir.includes('w')) {
          w = Math.max(MIN_W, start.w - dx);
          x = start.x + start.w - w;
        }
        if (dir.includes('n')) {
          h = Math.max(MIN_H, start.h - dy);
          y = Math.max(MENUBAR_H, start.y + start.h - h);
          h = start.y + start.h - y;
        }
        next = { x, y, w, h };
      }
      // Во время жеста двигаем DOM напрямую: стор обновится один раз в конце, без лишних ререндеров.
      const c = clampRect(next, getViewport());
      Object.assign(el.style, { left: `${c.x}px`, top: `${c.y}px`, width: `${c.w}px`, height: `${c.h}px` });
    };
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      setGesture(null);
      if (moved) api.rectChanged({ id: win.id, rect: next, vp: getViewport() });
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  };

  const toggleZoom = () => {
    if (isMobile) return;
    setAnimatingRect(true);
    api.zoom({ id: win.id, vp: getViewport() });
    window.setTimeout(() => setAnimatingRect(false), 460);
  };

  const style = win.rect
    ? { left: win.rect.x, top: win.rect.y, width: win.rect.w, height: win.rect.h, zIndex: win.z }
    : { zIndex: win.z };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={headingId}
      data-window={win.id}
      data-unplaced={win.rect ? undefined : ''}
      className={clsx('win', {
        'is-top': isTop,
        animating: animatingRect,
        dragging: gesture === 'drag',
        resizing: gesture === 'resize',
      })}
      style={style}
      onPointerDownCapture={() => !isTop && api.focus(win.id)}
    >
      <div
        className="titlebar"
        onPointerDown={(e) => startGesture(e, 'drag')}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest('button') && toggleZoom()}
      >
        <div className="lights">
          <button type="button" className="l-close" aria-label={dict.window.close} onClick={close}>
            <CloseGlyph />
          </button>
          <button type="button" className="l-min" aria-label={dict.window.minimize} onClick={minimize}>
            <MinGlyph />
          </button>
          <button type="button" className="l-zoom" aria-label={dict.window.zoom} onClick={toggleZoom}>
            <ZoomGlyph />
          </button>
        </div>
        <div id={headingId} tabIndex={-1} className="win-title">
          {title}
        </div>
        <button type="button" className="close-mobile" aria-label={dict.window.close} onClick={close}>
          <CloseGlyph />
        </button>
      </div>
      <div className={clsx('win-body', bodyClassName)}>{children}</div>
      {!isMobile &&
        win.rect &&
        DIRS.map((d) => (
          <div
            key={d}
            className={`rh rh-${d}`}
            aria-hidden="true"
            onPointerDown={(e) => startGesture(e, 'resize', d)}
          />
        ))}
    </div>
  );
}
