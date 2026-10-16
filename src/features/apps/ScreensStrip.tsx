'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '@/content/schema';
import { pick, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { LazyLoop } from './LazyLoop';

type Shot = Project['gallery'][number];

/** Лента экранов кейса + просмотр как в Quick Look: стрелки, Esc, счётчик. */
export function ScreensStrip({ shots, locale, dict }: { shots: Shot[]; locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, close, step]);

  if (!shots.length) return null;
  const cur = open === null ? null : shots[open];

  return (
    <>
      <ul className="strip">
        {shots.map((g, i) => (
          <li key={g.src}>
            <button
              type="button"
              className="strip-item"
              onClick={() => setOpen(i)}
              aria-label={pick(g.alt, locale)}
            >
              <img
                src={g.video ? `${g.src}-poster.webp` : `${g.src}-800.webp`}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: `${Math.min(g.width / g.height, 1.9)}` }}
              />
              {g.video && (
                <span className="strip-play" aria-hidden="true">
                  ▶
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {cur &&
        createPortal(
          <div
            className="quicklook"
            role="dialog"
            aria-label={pick(cur.alt, locale)}
            onPointerDown={(e) => e.target === e.currentTarget && close()}
          >
            <div className="ql-frame glass">
              <div className="ql-bar">
                <button type="button" onClick={close} aria-label={dict.window.close}>
                  ✕
                </button>
                <span>
                  {open! + 1} {dict.project.of} {shots.length} · {pick(cur.alt, locale)}
                </span>
                <span className="ql-nav">
                  <button type="button" onClick={() => step(-1)} aria-label="←">
                    ‹
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="→">
                    ›
                  </button>
                </span>
              </div>
              <div className="ql-media">
                {cur.video ? (
                  <LazyLoop
                    src={`${cur.src}.mp4`}
                    poster={`${cur.src}-poster.webp`}
                    label={pick(cur.alt, locale)}
                  />
                ) : (
                  <picture>
                    <source type="image/avif" srcSet={`${cur.src}-1600.avif`} />
                    <img
                      src={`${cur.src}-1600.webp`}
                      alt={pick(cur.alt, locale)}
                      width={cur.width}
                      height={cur.height}
                    />
                  </picture>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
