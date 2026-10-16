'use client';

import { useUnit } from 'effector-react';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { pick, type Locale } from '@/i18n/config';
import { spotlightToggled } from '@/features/spotlight/model';
import { $route } from '@/features/windows/model';
import { useI18n } from '@/shared/i18n-context';
import { useOpen } from './useOpen';
import { useMailAction } from './useMailAction';

function subscribeClock(cb: () => void) {
  const t = window.setInterval(cb, 15_000);
  return () => window.clearInterval(t);
}

/** «Пт 17 окт. 23:27» / «Fri 17 Oct 23:27» — как часы в строке меню macOS. */
function formatClock(locale: Locale) {
  const d = new Date();
  const tag = locale === 'ru' ? 'ru-RU' : 'en-GB';
  const wd = d.toLocaleDateString(tag, { weekday: 'short' }).replace('.', '');
  const date = d.toLocaleDateString(tag, { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(tag, { hour: '2-digit', minute: '2-digit' });
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} ${date} ${time}`;
}

function useClock(locale: Locale) {
  return useSyncExternalStore(
    subscribeClock,
    () => formatClock(locale),
    () => '',
  );
}

type MenuItem = { label: string; run?: () => void; href?: string; external?: boolean } | 'sep';

export function MenuBar() {
  const { locale, dict } = useI18n();
  const route = useUnit($route);
  const toggleSpotlight = useUnit(spotlightToggled);
  const open = useOpen();
  const mail = useMailAction();
  const time = useClock(locale);
  const other: Locale = locale === 'en' ? 'ru' : 'en';
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => !bar.current?.contains(e.target as Node) && setActive(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  const menus: Array<{ id: string; label: string; items: MenuItem[] }> = [
    {
      id: 'projects',
      label: dict.menubar.projects,
      items: [
        ...projects
          .filter((p) => p.group === 'main')
          .map((p) => ({ label: p.title, run: () => open('project', { slug: p.slug }) })),
        'sep',
        { label: dict.earlyWorks, run: () => open('early') },
        { label: dict.menubar.allProjects, run: () => open('finder') },
      ],
    },
    {
      id: 'about',
      label: dict.menubar.about,
      items: [
        { label: 'about.txt', run: () => open('about') },
        { label: 'Resume.pdf', run: () => open('resume') },
        'sep',
        { label: dict.menubar.recruiter, href: `/${locale}/cv/` },
      ],
    },
    {
      id: 'contacts',
      label: dict.menubar.contacts,
      items: [
        { label: dict.dock.mail, run: () => open('mail') },
        { label: 'Telegram', href: profile.telegram, external: true },
        { label: 'GitHub', href: profile.github, external: true },
        'sep',
        { label: dict.mail.copy, run: mail },
      ],
    },
  ];

  return (
    <header className="menubar" ref={bar}>
      <span className="mb-name">{pick(profile.name, locale)}</span>
      <nav className="mb-menus desktop-only" aria-label="Menu">
        {menus.map((m) => (
          <div key={m.id} className="mb-menu">
            <button
              type="button"
              className="mb-item"
              aria-haspopup="menu"
              aria-expanded={active === m.id}
              data-active={active === m.id || undefined}
              onClick={() => setActive(active === m.id ? null : m.id)}
              onPointerEnter={() => active && setActive(m.id)}
            >
              {m.label}
            </button>
            {active === m.id && (
              <div className="mb-dropdown glass" role="menu">
                {m.items.map((it, i) =>
                  it === 'sep' ? (
                    <hr key={`sep-${i}`} />
                  ) : (
                    <MenuEntry key={it.label} item={it} onDone={() => setActive(null)} />
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
      <span className="flex-1" />
      <button
        type="button"
        className="mb-item desktop-only"
        onClick={() => toggleSpotlight()}
        aria-label={dict.menubar.search}
      >
        <SearchGlyph />
      </button>
      <a className="mb-item mb-lang" href={`/${other}${route}`} hrefLang={other}>
        <span className="sr-only">{dict.menubar.language}: </span>
        {other.toUpperCase()}
      </a>
      <Link href={`/${locale}/cv/`} className="mb-item">
        <span className="desktop-only">{dict.menubar.recruiter}</span>
        <span className="mobile-only">CV</span>
      </Link>
      <span className="mb-item mb-clock" suppressHydrationWarning>
        {time}
      </span>
    </header>
  );
}

function MenuEntry({ item, onDone }: { item: Exclude<MenuItem, 'sep'>; onDone: () => void }) {
  const content: ReactNode = (
    <>
      {item.label}
      {item.external && <span aria-hidden="true">↗</span>}
    </>
  );
  if (item.href) {
    return item.external ? (
      <a role="menuitem" href={item.href} target="_blank" rel="noopener noreferrer" onClick={onDone}>
        {content}
      </a>
    ) : (
      <Link role="menuitem" href={item.href} onClick={onDone}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onDone();
        item.run?.();
      }}
    >
      {content}
    </button>
  );
}

const SearchGlyph = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <circle cx="6.8" cy="6.8" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
