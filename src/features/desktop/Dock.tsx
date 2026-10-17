'use client';

import clsx from 'clsx';
import { useUnit } from 'effector-react';
import type { ReactNode } from 'react';
import { getProject } from '@/content/projects';
import { profile } from '@/content/profile';
import type { AppKind } from '@/features/windows/logic';
import { $windows, windowFocused } from '@/features/windows/model';
import { ImageAppIcon } from '@/shared/app-icons';
import { useI18n } from '@/shared/i18n-context';
import { useOpen } from './useOpen';

export function Dock() {
  const { dict } = useI18n();
  const state = useUnit($windows);
  const focus = useUnit(windowFocused);
  const open = useOpen();
  const running = new Set(state.windows.map((w) => w.app));
  const minimized = state.windows.filter((w) => w.minimized && w.app === 'project');

  const launch = (app: AppKind, el: Element) => {
    const existing = state.windows.find((w) => w.app === app);
    if (existing) focus(existing.id);
    else open(app, { from: el });
  };

  return (
    <nav className="dock glass" aria-label="Dock">
      <DockButton
        label={dict.dock.projects}
        running={running.has('finder')}
        className="desktop-only"
        onClick={(el) => launch('finder', el)}
      >
        <ImageAppIcon name="projects" />
      </DockButton>
      <DockButton
        label={dict.dock.code}
        running={running.has('code')}
        className="desktop-only"
        onClick={(el) => launch('code', el)}
      >
        <ImageAppIcon name="vscode" />
      </DockButton>
      <DockButton label={dict.dock.ask} running={running.has('ask')} onClick={(el) => launch('ask', el)}>
        <ImageAppIcon name="ask" />
      </DockButton>
      <span className="dock-sep" aria-hidden="true" />
      <DockButton label={dict.dock.mail} running={running.has('mail')} onClick={(el) => launch('mail', el)}>
        <ImageAppIcon name="mail" />
      </DockButton>
      <a className="dock-item" href={profile.telegram} target="_blank" rel="noopener noreferrer">
        <ImageAppIcon name="telegram" />
        <span className="tip glass">{dict.dock.telegram}</span>
        <span className="sr-only">{dict.dock.telegram}</span>
      </a>
      <a className="dock-item" href={profile.github} target="_blank" rel="noopener noreferrer">
        <ImageAppIcon name="github" />
        <span className="tip glass">{dict.dock.github}</span>
        <span className="sr-only">{dict.dock.github}</span>
      </a>
      {minimized.length > 0 && <span className="dock-sep" aria-hidden="true" />}
      {minimized.map((w) => {
        const p = w.slug ? getProject(w.slug) : undefined;
        return (
          <button key={w.id} type="button" className="dock-item dock-mini" onClick={() => focus(w.id)}>
            {p?.cover.thumb ? (
              <img src={p.cover.thumb} alt="" />
            ) : (
              <span
                style={{ background: p ? `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` : '#888' }}
              />
            )}
            <span className="tip glass">{p?.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DockButton({
  label,
  running,
  className,
  onClick,
  children,
}: {
  label: string;
  running: boolean;
  className?: string;
  onClick: (el: Element) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={clsx('dock-item', running && 'running', className)}
      onClick={(e) => onClick(e.currentTarget)}
    >
      {children}
      <span className="tip glass">{label}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}
