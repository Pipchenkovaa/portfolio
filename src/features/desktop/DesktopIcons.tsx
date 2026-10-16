'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent as RPointerEvent } from 'react';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import type { Project } from '@/content/schema';
import type { Locale } from '@/i18n/config';
import { NotesAppIcon, ProjectAppIcon, ResumeAppIcon } from '@/shared/app-icons';
import { GenericFileIcon, PdfFileIcon, PufferFolderIcon, TextFileIcon } from '@/shared/file-icons';
import { useI18n } from '@/shared/i18n-context';
import { useIsMobile } from '@/shared/viewport';
import { useOpen } from './useOpen';

type Item =
  | { key: string; kind: 'project'; project: Project; x: number; y: number }
  | { key: 'early' | 'about' | 'resume'; kind: 'early' | 'about' | 'resume'; x: number; y: number };

/** Позиции файлов: x — центр иконки, y — верх, в процентах экрана. */
const ITEMS: Item[] = [
  ...projects
    .filter((p) => p.group === 'main')
    .map((p) => ({ key: p.slug, kind: 'project' as const, project: p, x: p.desktop.x, y: p.desktop.y })),
  { key: 'early', kind: 'early', x: 34.8, y: 71 },
  { key: 'about', kind: 'about', x: 68.5, y: 59 },
  { key: 'resume', kind: 'resume', x: 81.8, y: 69 },
];

type Pos = { left: number; top: number };
type Marquee = { x0: number; y0: number; x1: number; y1: number };

const ICON_W = 104;

export function DesktopIcons() {
  const { locale, dict } = useI18n();
  const isMobile = useIsMobile();
  const open = useOpen();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pos, setPos] = useState<Record<string, Pos>>({});
  const [marquee, setMarquee] = useState<Marquee | null>(null);
  const els = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(new Set());
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'a' &&
        !(e.target as HTMLElement).closest('input, textarea')
      ) {
        e.preventDefault();
        setSelected(new Set(ITEMS.map((i) => i.key)));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const launch = (it: Item, el: Element | null) => {
    if (it.kind === 'project') open('project', { slug: it.project.slug, from: el });
    else open(it.kind, { from: el });
  };

  /* ---- рамка выделения по пустому месту рабочего стола ---- */
  const onSurfaceDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (isMobile || e.button !== 0) return;
    const additive = e.shiftKey || e.metaKey;
    const base = additive ? new Set(selected) : new Set<string>();
    if (!additive) setSelected(base);
    const x0 = e.clientX;
    const y0 = e.clientY;
    const surface = e.currentTarget;
    surface.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const m = { x0, y0, x1: ev.clientX, y1: ev.clientY };
      setMarquee(m);
      const l = Math.min(m.x0, m.x1);
      const r = Math.max(m.x0, m.x1);
      const t = Math.min(m.y0, m.y1);
      const b = Math.max(m.y0, m.y1);
      const next = new Set(base);
      els.current.forEach((el, key) => {
        const rect = el.querySelector('.icon-art')!.getBoundingClientRect();
        if (rect.right > l && rect.left < r && rect.bottom > t && rect.top < b) next.add(key);
      });
      setSelected(next);
    };
    const onUp = () => {
      setMarquee(null);
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerup', onUp);
    };
    surface.addEventListener('pointermove', onMove);
    surface.addEventListener('pointerup', onUp);
  };

  /* ---- клик / перетаскивание иконки (и всей выделенной группы) ---- */
  const onIconDown = (it: Item, e: RPointerEvent<HTMLAnchorElement>) => {
    if (isMobile || e.button !== 0) return;
    e.preventDefault();
    const toggle = e.metaKey || e.ctrlKey || e.shiftKey;
    let group = selected;
    if (toggle) {
      group = new Set(selected);
      if (group.has(it.key)) group.delete(it.key);
      else group.add(it.key);
      setSelected(group);
      return;
    }
    if (!selected.has(it.key)) {
      group = new Set([it.key]);
      setSelected(group);
    }
    const starts = new Map<string, Pos>();
    group.forEach((key) => {
      const el = els.current.get(key);
      if (!el) return;
      const r = el.getBoundingClientRect(); // визуальная позиция, с учётом translateX(-50%) у неперемещённых иконок
      starts.set(key, { left: r.left, top: r.top });
    });
    const sx = e.clientX;
    const sy = e.clientY;
    const target = e.currentTarget;
    let dragged = false;
    target.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!dragged && Math.hypot(dx, dy) < 4) return;
      dragged = true;
      const next: Record<string, Pos> = {};
      starts.forEach((p, key) => {
        next[key] = {
          left: Math.max(0, Math.min(window.innerWidth - ICON_W, p.left + dx)),
          top: Math.max(34, Math.min(window.innerHeight - 110, p.top + dy)),
        };
      });
      setPos((prev) => ({ ...prev, ...next }));
    };
    const onUp = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      if (!dragged) launch(it, target.querySelector('.icon-art'));
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
  };

  const onIconClick = (it: Item, e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button === 1) return; // средняя кнопка — открыть в новой вкладке как обычную ссылку
    if (it.kind === 'resume' && isMobile) return; // iOS показывает PDF в iframe только первой страницей
    e.preventDefault();
    // Телефон и клавиатура (Enter) — открываем по click; мышь на десктопе обработана в pointerup.
    if (isMobile || e.detail === 0) launch(it, e.currentTarget.querySelector('.icon-art'));
  };

  return (
    <>
      <div className="desk-surface" aria-hidden="true" onPointerDown={onSurfaceDown} />
      <nav className="icons" aria-label={dict.menubar.projects}>
        {ITEMS.map((it) => (
          <a
            key={it.key}
            ref={(el) => {
              if (el) els.current.set(it.key, el);
              else els.current.delete(it.key);
            }}
            href={hrefFor(it, locale)}
            className={clsx(
              'icon',
              `icon-${it.kind}`,
              selected.has(it.key) && 'selected',
              pos[it.key] && 'moved',
            )}
            style={
              pos[it.key]
                ? { left: pos[it.key]!.left, top: pos[it.key]!.top }
                : { left: `${it.x}%`, top: `${it.y}%` }
            }
            draggable={false}
            onPointerDown={(e) => onIconDown(it, e)}
            onClick={(e) => onIconClick(it, e)}
            {...(it.kind === 'resume' ? { target: '_blank', rel: 'noopener' } : {})}
          >
            <span className="icon-art">
              <span className="only-desk">
                <DeskArt it={it} />
              </span>
              <span className="only-phone">
                <PhoneArt it={it} />
              </span>
            </span>
            <span className="label">{labelFor(it, dict.earlyWorks)}</span>
          </a>
        ))}
      </nav>
      {marquee && (
        <div
          className="marquee"
          style={{
            left: Math.min(marquee.x0, marquee.x1),
            top: Math.min(marquee.y0, marquee.y1),
            width: Math.abs(marquee.x1 - marquee.x0),
            height: Math.abs(marquee.y1 - marquee.y0),
          }}
        />
      )}
    </>
  );
}

function hrefFor(it: Item, locale: Locale) {
  if (it.kind === 'project') return `/${locale}/work/${it.project.slug}/`;
  if (it.kind === 'about') return `/${locale}/about/`;
  if (it.kind === 'early') return `/${locale}/cv/#early-works`;
  return profile.resumePdf;
}

function labelFor(it: Item, early: string) {
  if (it.kind === 'project') return it.project.title;
  if (it.kind === 'about') return 'about.txt';
  if (it.kind === 'early') return early;
  return 'Resume.pdf';
}

function DeskArt({ it }: { it: Item }) {
  switch (it.kind) {
    case 'project': {
      const c = it.project.cover;
      return c.thumb ? (
        <span className="file-thumb">
          <img src={c.thumb} alt="" width={160} height={120} decoding="async" draggable={false} />
        </span>
      ) : (
        <GenericFileIcon from={c.from} to={c.to} glyph={c.glyph} />
      );
    }
    case 'early':
      return <PufferFolderIcon size={84} />;
    case 'about':
      return <TextFileIcon />;
    case 'resume':
      return <PdfFileIcon preview="/media/resume-thumb.webp" />;
  }
}

function PhoneArt({ it }: { it: Item }) {
  switch (it.kind) {
    case 'project': {
      const c = it.project.cover;
      return (
        <ProjectAppIcon {...(c.thumb ? { thumb: c.thumb } : {})} from={c.from} to={c.to} glyph={c.glyph} />
      );
    }
    case 'early':
      return (
        <span className="ios-folder">
          {projects
            .filter((p) => p.group === 'early')
            .slice(0, 4)
            .map((p) => (
              <i
                key={p.slug}
                style={{ background: `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` }}
              />
            ))}
        </span>
      );
    case 'about':
      return <NotesAppIcon size={60} />;
    case 'resume':
      return <ResumeAppIcon size={60} />;
  }
}
