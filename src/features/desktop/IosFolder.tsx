'use client';

import { useUnit } from 'effector-react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { projects } from '@/content/projects';
import type { WindowState } from '@/features/windows/logic';
import { windowClosed } from '@/features/windows/model';
import { getOrigin } from '@/features/windows/origin';
import { EASE_CLOSE, EASE_OPEN, toOrigin } from '@/features/windows/Window';
import { ProjectAppIcon } from '@/shared/app-icons';
import { useI18n } from '@/shared/i18n-context';
import { useOpen } from './useOpen';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Папка на домашнем экране iPhone: фон размывается, панель вырастает из иконки папки,
 * внутри — сетка приложений. Тап мимо панели закрывает папку.
 */
export function IosFolder({ win }: { win: WindowState }) {
  const { locale, dict } = useI18n();
  const close = useUnit(windowClosed);
  const open = useOpen();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const titleId = 'ios-folder-title';
  const items = projects.filter((p) => p.group === 'early');

  useLayoutEffect(() => {
    const el = panel.current;
    const bg = root.current;
    if (!el || !bg || reducedMotion()) return;
    const o = getOrigin(win.id);
    const a = el.animate(
      [
        { transform: o ? toOrigin(el, o) : 'scale(0.6)', opacity: o ? 0.6 : 0, borderRadius: '40px' },
        { transform: 'none', opacity: 1, borderRadius: '38px' },
      ],
      { duration: 480, easing: EASE_OPEN },
    );
    const b = bg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
    return () => {
      a.cancel();
      b.cancel();
    };
  }, [win.id]);

  const dismiss = () => {
    const el = panel.current;
    const bg = root.current;
    if (busy.current) return;
    if (!el || !bg || reducedMotion()) return close(win.id);
    busy.current = true;
    const o = getOrigin(win.id);
    el.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: o ? toOrigin(el, o) : 'scale(0.6)', opacity: 0 },
      ],
      { duration: 340, easing: EASE_CLOSE, fill: 'forwards' },
    );
    bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 340, easing: 'ease-in', fill: 'forwards' }).onfinish =
      () => close(win.id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
    window.addEventListener('keydown', onKey);
    root.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- подписка на время жизни папки
  }, []);

  return (
    <div
      ref={root}
      className="iosf"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <h2 id={titleId} className="iosf-title">
        {dict.earlyWorks}
      </h2>
      <div ref={panel} className="iosf-panel">
        {items.map((p) => (
          <a
            key={p.slug}
            className="iosf-app"
            href={`/${locale}/work/${p.slug}/`}
            onClick={(e) => {
              e.preventDefault();
              open('project', { slug: p.slug, from: e.currentTarget.firstElementChild });
            }}
          >
            <ProjectAppIcon
              {...(p.cover.thumb ? { thumb: p.cover.thumb } : {})}
              from={p.cover.from}
              to={p.cover.to}
              glyph={p.cover.glyph}
              size={64}
            />
            <span>{p.title}</span>
          </a>
        ))}
      </div>
      <p className="iosf-note">{dict.earlyWorksNote}</p>
    </div>
  );
}
