'use client';

import { useUnit } from 'effector-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent as RPointerEvent,
} from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { projects, getProject } from '@/content/projects';
import { profile } from '@/content/profile';
import type { Project } from '@/content/schema';
import { pick, type Locale } from '@/i18n/config';
import { AskView } from '@/features/apps/AskView';
import { ProjectView } from '@/features/apps/ProjectView';
import { TerminalView } from '@/features/apps/TerminalView';
import { $notices, noticeDismissed } from '@/features/notifications/model';
import { questionQueued } from '@/features/assistant/model';
import { $spotlightOpen, spotlightClosed, spotlightToggled } from '@/features/spotlight/model';
import { parseRoute, topWindow, type AppKind, type WindowState } from '@/features/windows/logic';
import { $route, $windows, routeRestored, windowFocused, windowOpened } from '@/features/windows/model';
import { Window } from '@/features/windows/Window';
import { ChatIcon, FolderIcon, GitHubIcon, MailIcon, TelegramIcon } from '@/shared/icons';
import { useI18n } from '@/shared/i18n-context';
import { getViewport, useIsMobile } from '@/shared/viewport';
import { useMailAction } from './useMailAction';

const TODS = ['morning', 'day', 'evening', 'night'] as const;

export function Desktop() {
  const { locale } = useI18n();
  const { toggleSpotlight, closeSpotlight, restore } = useUnit({
    toggleSpotlight: spotlightToggled,
    closeSpotlight: spotlightClosed,
    restore: routeRestored,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleSpotlight();
      }
      if (e.key === 'Escape') closeSpotlight();
    };
    const onPop = () => {
      const path = window.location.pathname.replace(new RegExp(`^/${locale}`), '') || '/';
      restore({ open: parseRoute(path), vp: getViewport() });
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
    };
  }, [locale, toggleSpotlight, closeSpotlight, restore]);

  return (
    <div className="desktop">
      <div className="silhouette" aria-hidden="true">
        <i className="s-body" />
        <i className="s-head" />
        <i className="s-cap" />
      </div>
      <div className="bigname" aria-hidden="true" data-text="PIPCHENKOVA" />
      <MenuBar />
      <main>
        <h1 className="sr-only">
          {pick(profile.name, locale)} — {pick(profile.role, locale)}
        </h1>
        <DesktopIcons />
        <Windows />
      </main>
      <Dock />
      <Spotlight />
      <Notices />
    </div>
  );
}

/* ---------------- menu bar ---------------- */

function MenuBar() {
  const { locale, dict } = useI18n();
  const route = useUnit($route);
  const toggleSpotlight = useUnit(spotlightToggled);
  const time = useClock(locale);
  const other: Locale = locale === 'en' ? 'ru' : 'en';

  const cycleTod = () => {
    const el = document.documentElement;
    const i = TODS.indexOf((el.dataset.tod ?? 'day') as (typeof TODS)[number]);
    el.dataset.tod = TODS[(i + 1) % TODS.length];
  };

  return (
    <header className="menubar">
      <span className="font-bold whitespace-nowrap">{pick(profile.name, locale)}</span>
      <span className="desktop-only opacity-70">{dict.menubar.tagline}</span>
      <span className="flex-1" />
      <a href={`/${other}${route}`} hrefLang={other} className="uppercase">
        <span className="sr-only">{dict.menubar.language}: </span>
        {other}
      </a>
      <button type="button" className="desktop-only" onClick={() => toggleSpotlight()}>
        {dict.menubar.search}
        <span className="kbd">⌘K</span>
      </button>
      <Link href={`/${locale}/cv/`} className="!bg-accent font-semibold whitespace-nowrap text-white">
        <span className="desktop-only">{dict.menubar.recruiter}</span>
        <span className="mobile-only">CV</span>
      </Link>
      <button
        type="button"
        onClick={cycleTod}
        className="tabular-nums whitespace-nowrap"
        suppressHydrationWarning
      >
        {time}
      </button>
    </header>
  );
}

function subscribeClock(cb: () => void) {
  const t = window.setInterval(cb, 15_000);
  return () => window.clearInterval(t);
}
/** Часы без рассинхрона гидрации: на сервере пусто, в браузере — локальное время посетителя. */
function useClock(locale: Locale) {
  return useSyncExternalStore(
    subscribeClock,
    () =>
      new Date().toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    () => '',
  );
}

/* ---------------- desktop icons ---------------- */

type IconItem = { kind: 'project'; project: Project } | { kind: 'about' } | { kind: 'resume' };

const FILE_POS = { about: { x: 44, y: 64 }, resume: { x: 52, y: 74 } };

function DesktopIcons() {
  const { locale } = useI18n();
  const items: IconItem[] = useMemo(
    () => [
      ...projects.map((p) => ({ kind: 'project', project: p }) as const),
      { kind: 'about' },
      { kind: 'resume' },
    ],
    [],
  );
  return (
    <nav className="icons" aria-label="Projects">
      {items.map((it) => (
        <DesktopIcon key={it.kind === 'project' ? it.project.slug : it.kind} item={it} locale={locale} />
      ))}
    </nav>
  );
}

function DesktopIcon({ item, locale }: { item: IconItem; locale: Locale }) {
  const open = useUnit(windowOpened);
  const isMobile = useIsMobile();
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const dragged = useRef(false);

  const href =
    item.kind === 'project'
      ? `/${locale}/work/${item.project.slug}/`
      : item.kind === 'about'
        ? `/${locale}/about/`
        : profile.resumePdf;
  const label =
    item.kind === 'project' ? item.project.title : item.kind === 'about' ? 'about.txt' : 'Resume.pdf';
  const percent = item.kind === 'project' ? item.project.desktop : FILE_POS[item.kind];

  const onPointerDown = (e: RPointerEvent<HTMLAnchorElement>) => {
    dragged.current = false;
    if (isMobile || e.button !== 0) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!dragged.current && Math.hypot(dx, dy) < 4) return;
      if (!dragged.current) el.setPointerCapture(e.pointerId);
      dragged.current = true;
      el.classList.add('dragging');
      setPos({
        left: Math.max(0, Math.min(window.innerWidth - 96, r.left + dx)),
        top: Math.max(30, Math.min(window.innerHeight - 90, r.top + dy)),
      });
    };
    const onUp = () => {
      el.classList.remove('dragging');
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // открыть в новой вкладке — как обычная ссылка
    if (dragged.current) {
      e.preventDefault();
      return;
    }
    if (item.kind === 'resume' && isMobile) return; // iOS показывает PDF в iframe только первой страницей
    e.preventDefault();
    const vp = getViewport();
    if (item.kind === 'project') open({ app: 'project', slug: item.project.slug, vp });
    else open({ app: item.kind, vp });
  };

  const style = pos ? { left: pos.left, top: pos.top } : { left: `${percent.x}%`, top: `${percent.y}%` };
  const cover =
    item.kind === 'project' ? (
      <span
        className="cover"
        style={{
          background: `linear-gradient(135deg, ${item.project.cover.from}, ${item.project.cover.to})`,
        }}
      >
        <span className="glyph">{item.project.cover.glyph}</span>
        <span className="bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
    ) : (
      <span className="cover">
        <span className="glyph">{item.kind === 'about' ? 'TXT' : 'PDF'}</span>
      </span>
    );

  return (
    <a
      href={href}
      className={clsx('icon', item.kind !== 'project' && 'file')}
      style={style}
      draggable={false}
      onPointerDown={onPointerDown}
      onClick={onClick}
      {...(item.kind === 'resume' ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {cover}
      <span className="label">{label}</span>
    </a>
  );
}

/* ---------------- windows ---------------- */

function Windows() {
  const state = useUnit($windows);
  const top = topWindow(state);
  return (
    <div className="windows-layer">
      {state.windows.map((w) => (
        <WindowFor key={w.id} win={w} isTop={top?.id === w.id} />
      ))}
    </div>
  );
}

function WindowFor({ win, isTop }: { win: WindowState; isTop: boolean }) {
  const { locale, dict } = useI18n();
  const mail = useMailAction();
  const headingId = `${win.id.replace(':', '-')}-content`;

  switch (win.app) {
    case 'project': {
      const p = win.slug ? getProject(win.slug) : undefined;
      if (!p) return null;
      return (
        <Window win={win} isTop={isTop} title={p.title}>
          <ProjectView project={p} locale={locale} dict={dict} headingId={headingId} />
        </Window>
      );
    }
    case 'finder':
      return (
        <Window win={win} isTop={isTop} title={dict.dock.projects}>
          <FinderView />
        </Window>
      );
    case 'about':
      return (
        <Window win={win} isTop={isTop} title="about.txt">
          <pre className="p-5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
            {pick(profile.about, locale)}
          </pre>
        </Window>
      );
    case 'ask':
      return (
        <Window win={win} isTop={isTop} title={dict.ask.title}>
          <AskView />
        </Window>
      );
    case 'terminal':
      return (
        <Window win={win} isTop={isTop} title={dict.terminal.title}>
          <TerminalView onMail={mail} />
        </Window>
      );
    case 'resume':
      return (
        <Window win={win} isTop={isTop} title={dict.resume.title}>
          <div className="flex h-full flex-col">
            <div className="flex gap-2 border-b border-[var(--line)] px-3 py-2">
              <a className="btn" href={profile.resumePdf} download>
                {dict.resume.download}
              </a>
              <a className="btn btn-ghost" href={profile.resumePdf} target="_blank" rel="noopener">
                {dict.resume.open} ↗
              </a>
            </div>
            <iframe
              title="Resume"
              src={`${profile.resumePdf}#view=FitH`}
              className="min-h-0 w-full flex-1 bg-neutral-500"
            />
          </div>
        </Window>
      );
  }
}

function FinderView() {
  const { locale } = useI18n();
  const open = useUnit(windowOpened);
  return (
    <div className="in-finder grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-4 p-5">
      {projects.map((p) => (
        <a
          key={p.slug}
          className="icon"
          href={`/${locale}/work/${p.slug}/`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey) return;
            e.preventDefault();
            open({ app: 'project', slug: p.slug, vp: getViewport() });
          }}
        >
          <span
            className="cover"
            style={{ background: `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` }}
          >
            <span className="glyph">{p.cover.glyph}</span>
          </span>
          <span className="label">{p.title}</span>
        </a>
      ))}
    </div>
  );
}

/* ---------------- dock ---------------- */

function Dock() {
  const { dict } = useI18n();
  const state = useUnit($windows);
  const { open, focus } = useUnit({ open: windowOpened, focus: windowFocused });
  const mail = useMailAction();
  const running = new Set(state.windows.map((w) => w.app));
  const minimized = state.windows.filter((w) => w.minimized && w.app === 'project');

  const launch = (app: AppKind) => {
    const existing = state.windows.find((w) => w.app === app);
    if (existing) focus(existing.id);
    else open({ app, vp: getViewport() });
  };

  return (
    <nav className="dock" aria-label="Dock">
      <button
        type="button"
        className={clsx('dock-item desktop-only bg-[#e9f0ff]', running.has('finder') && 'running')}
        onClick={() => launch('finder')}
      >
        <FolderIcon />
        <span className="tip">{dict.dock.projects}</span>
        <span className="sr-only">{dict.dock.projects}</span>
      </button>
      <button
        type="button"
        className={clsx(
          'dock-item bg-gradient-to-b from-[#5ee08f] to-[#1fae57]',
          running.has('ask') && 'running',
        )}
        onClick={() => launch('ask')}
      >
        <ChatIcon />
        <span className="tip">{dict.dock.ask}</span>
        <span className="sr-only">{dict.dock.ask}</span>
      </button>
      <span className="dock-sep" aria-hidden="true" />
      <button type="button" className="dock-item bg-gradient-to-b from-[#5fc8ff] to-[#1a74f0]" onClick={mail}>
        <MailIcon />
        <span className="tip">{dict.dock.mail}</span>
        <span className="sr-only">{dict.dock.mail}</span>
      </button>
      <a
        className="dock-item bg-gradient-to-b from-[#37bbfe] to-[#007dbb]"
        href={profile.telegram}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TelegramIcon />
        <span className="tip">{dict.dock.telegram} ↗</span>
        <span className="sr-only">{dict.dock.telegram}</span>
      </a>
      <a className="dock-item bg-[#24292f]" href={profile.github} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
        <span className="tip">{dict.dock.github} ↗</span>
        <span className="sr-only">{dict.dock.github}</span>
      </a>
      {minimized.length > 0 && <span className="dock-sep" aria-hidden="true" />}
      {minimized.map((w) => {
        const p = w.slug ? getProject(w.slug) : undefined;
        return (
          <button
            key={w.id}
            type="button"
            className="dock-mini"
            style={{ background: p ? `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` : '#888' }}
            onClick={() => focus(w.id)}
          >
            {p?.title}
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------- spotlight ---------------- */

type Hit = { key: string; label: string; hint: string; run: () => void; text: string };

function Spotlight() {
  const isOpen = useUnit($spotlightOpen);
  // Панель монтируется заново при каждом открытии — поиск всегда начинается с пустой строки.
  return isOpen ? <SpotlightPanel /> : null;
}

function SpotlightPanel() {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const { close, open, queue } = useUnit({
    close: spotlightClosed,
    open: windowOpened,
    queue: questionQueued,
  });
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const mail = useMailAction();

  const all: Hit[] = useMemo(() => {
    const vp = () => getViewport();
    const s = dict.spotlight;
    return [
      ...projects.map((p) => ({
        key: p.slug,
        label: p.title,
        hint: p.stack.join(', '),
        text: `${p.title} ${p.tagline.en} ${p.tagline.ru} ${p.stack.join(' ')}`.toLowerCase(),
        run: () => open({ app: 'project', slug: p.slug, vp: vp() }),
      })),
      {
        key: 'finder',
        label: dict.dock.projects,
        hint: s.app,
        text: 'projects проекты finder',
        run: () => open({ app: 'finder', vp: vp() }),
      },
      {
        key: 'ask',
        label: dict.dock.ask,
        hint: s.app,
        text: 'ask ai chat спросить',
        run: () => open({ app: 'ask', vp: vp() }),
      },
      {
        key: 'about',
        label: 'about.txt',
        hint: s.file,
        text: 'about me обо мне bio',
        run: () => open({ app: 'about', vp: vp() }),
      },
      {
        key: 'resume',
        label: 'Resume.pdf',
        hint: s.file,
        text: 'resume cv pdf резюме',
        run: () => open({ app: 'resume', vp: vp() }),
      },
      {
        key: 'cv',
        label: dict.menubar.recruiter,
        hint: s.view,
        text: 'recruiter hr рекрутер',
        run: () => router.push(`/${locale}/cv/`),
      },
      { key: 'mail', label: dict.dock.mail, hint: s.app, text: 'mail email почта contact', run: mail },
      {
        key: 'terminal',
        label: 'Terminal',
        hint: s.hidden,
        text: 'terminal zsh cli терминал',
        run: () => open({ app: 'terminal', vp: vp() }),
      },
    ];
  }, [dict, locale, open, mail, router]);

  const query = q.trim().toLowerCase();
  const hits = query
    ? all.filter((h) => h.text.includes(query) || h.label.toLowerCase().includes(query))
    : all.slice(0, 8);
  const results: Hit[] = hits.length
    ? hits
    : [
        {
          key: 'ask-ai',
          label: `${dict.spotlight.ask}: “${q}”`,
          hint: dict.dock.ask,
          text: '',
          run: () => {
            queue(q);
            open({ app: 'ask', vp: getViewport() });
          },
        },
      ];
  const current = Math.min(sel, results.length - 1);

  const run = (h: Hit | undefined) => {
    if (!h) return;
    close();
    h.run();
  };

  return (
    <div className="spotlight-backdrop" onPointerDown={(e) => e.target === e.currentTarget && close()}>
      <div className="spotlight" role="dialog" aria-label={dict.menubar.search}>
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls="spotlight-results"
          aria-activedescendant={`sp-${results[current]?.key}`}
          placeholder={dict.spotlight.placeholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSel(Math.min(current + 1, results.length - 1));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSel(Math.max(current - 1, 0));
            }
            if (e.key === 'Enter') run(results[current]);
          }}
        />
        <div id="spotlight-results" role="listbox" className="max-h-80 overflow-auto p-1.5">
          {results.map((h, i) => (
            <div
              key={h.key}
              id={`sp-${h.key}`}
              role="option"
              aria-selected={i === current}
              onPointerEnter={() => setSel(i)}
              onClick={() => run(h)}
            >
              {h.label}
              <small>{h.hint}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- notifications ---------------- */

function Notices() {
  const { notices, dismiss } = useUnit({ notices: $notices, dismiss: noticeDismissed });
  return (
    <div className="notices" aria-live="polite">
      {notices.map((n) => (
        <button key={n.id} type="button" className="notice" onClick={() => dismiss(n.id)}>
          <span className="n-icon bg-gradient-to-b from-[#5fc8ff] to-[#1a74f0]">
            <MailIcon width={24} height={24} />
          </span>
          <span className="flex-1">
            <span className="n-head">
              <span>{n.app.toUpperCase()}</span>
              <span>now</span>
            </span>
            <b className="block font-semibold">{n.title}</b>
            <span className="block opacity-80">{n.body}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
