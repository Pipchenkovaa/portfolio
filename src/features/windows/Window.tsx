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
import { clampRect, MIN_H, MIN_W, type Rect, type WindowState } from './logic';
import {
  windowClosed,
  windowFocused,
  windowMeasured,
  windowMinimized,
  windowRectChanged,
  windowZoomToggled,
} from './model';

const DIRS = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type Dir = (typeof DIRS)[number];

export function Window({
  win,
  isTop,
  title,
  children,
}: {
  win: WindowState;
  isTop: boolean;
  title: string;
  children: ReactNode;
}) {
  const { dict } = useI18n();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const headingId = `${win.id.replace(':', '-')}-title`;
  const [phase, setPhase] = useState<'open' | 'closing' | 'minimizing'>('open');
  const [animating, setAnimating] = useState(false);
  const [gesture, setGesture] = useState<'drag' | 'resize' | null>(null);
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
    // offset* не учитывают transform — меряем настоящий размер, а не кадр анимации появления.
    const el = ref.current;
    api.measured({
      id: win.id,
      rect: { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight },
    });
  }, [win.rect, win.id, api]);

  // Фокус в новое окно — для клавиатуры и скринридеров.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(`#${CSS.escape(headingId)}`)?.focus({ preventScroll: true });
  }, [headingId]);

  if (win.minimized && phase !== 'minimizing') return null;

  const startGesture = (e: RPointerEvent, kind: 'drag' | 'resize', dir?: Dir) => {
    if (isMobile || e.button !== 0 || !ref.current || !win.rect) return;
    if (kind === 'drag' && (e.target as HTMLElement).closest('button, a')) return;
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
          y = Math.max(30, start.y + start.h - h);
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
    setAnimating(true);
    api.zoom({ id: win.id, vp: getViewport() });
    window.setTimeout(() => setAnimating(false), 340);
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
        closing: phase === 'closing',
        minimizing: phase === 'minimizing',
        animating,
        dragging: gesture === 'drag',
        resizing: gesture === 'resize',
      })}
      style={style}
      onPointerDownCapture={() => !isTop && api.focus(win.id)}
      onAnimationEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (phase === 'closing') api.close(win.id);
        if (phase === 'minimizing') {
          setPhase('open');
          api.minimize(win.id);
        }
      }}
    >
      <div
        className="titlebar"
        onPointerDown={(e) => startGesture(e, 'drag')}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest('button') && toggleZoom()}
      >
        <div className="lights">
          <button
            type="button"
            className="l-close"
            aria-label={dict.window.close}
            onClick={() => setPhase('closing')}
          >
            <CloseGlyph />
          </button>
          <button
            type="button"
            className="l-min"
            aria-label={dict.window.minimize}
            onClick={() => setPhase('minimizing')}
          >
            <MinGlyph />
          </button>
          <button type="button" className="l-zoom" aria-label={dict.window.zoom} onClick={toggleZoom}>
            <ZoomGlyph />
          </button>
        </div>
        <div id={headingId} tabIndex={-1} className="win-title">
          {title}
        </div>
        <button
          type="button"
          className="close-mobile"
          aria-label={dict.window.close}
          onClick={() => setPhase('closing')}
        >
          ✕
        </button>
      </div>
      <div className="win-body">{children}</div>
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
