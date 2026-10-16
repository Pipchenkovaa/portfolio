'use client';

import { useUnit } from 'effector-react';
import { getProject, projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { pick } from '@/i18n/config';
import { AskView } from '@/features/apps/AskView';
import { MailCompose } from '@/features/apps/MailCompose';
import { ProjectView } from '@/features/apps/ProjectView';
import { TerminalView } from '@/features/apps/TerminalView';
import { topWindow, type WindowState } from '@/features/windows/logic';
import { $windows } from '@/features/windows/model';
import { Window } from '@/features/windows/Window';
import { GenericFileIcon } from '@/shared/file-icons';
import { useI18n } from '@/shared/i18n-context';
import { useOpen } from './useOpen';
import { useMailAction } from './useMailAction';

export function Windows() {
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
          <FinderView group="main" />
        </Window>
      );
    case 'early':
      return (
        <Window win={win} isTop={isTop} title={dict.earlyWorks}>
          <p className="finder-note">{dict.earlyWorksNote}</p>
          <FinderView group="early" />
        </Window>
      );
    case 'about':
      return (
        <Window win={win} isTop={isTop} title="about.txt">
          <div className="textedit">{pick(profile.about, locale)}</div>
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
    case 'mail':
      return (
        <Window win={win} isTop={isTop} title={dict.mail.title}>
          <MailCompose />
        </Window>
      );
    case 'resume':
      return (
        <Window win={win} isTop={isTop} title={dict.resume.title}>
          <div className="flex h-full flex-col">
            <div className="win-toolbar">
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
              className="min-h-0 w-full flex-1 bg-neutral-400"
            />
          </div>
        </Window>
      );
  }
}

function FinderView({ group }: { group: 'main' | 'early' }) {
  const { locale } = useI18n();
  const open = useOpen();
  return (
    <div className="finder">
      {projects
        .filter((p) => p.group === group)
        .map((p) => (
          <a
            key={p.slug}
            className="finder-item"
            href={`/${locale}/work/${p.slug}/`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) return;
              e.preventDefault();
              open('project', { slug: p.slug, from: e.currentTarget.querySelector('.finder-art') });
            }}
          >
            <span className="finder-art">
              {p.cover.thumb ? (
                <span className="file-thumb">
                  <img src={p.cover.thumb} alt="" />
                </span>
              ) : (
                <GenericFileIcon from={p.cover.from} to={p.cover.to} glyph={p.cover.glyph} size={56} />
              )}
            </span>
            <span className="finder-label">{p.title}</span>
          </a>
        ))}
    </div>
  );
}
