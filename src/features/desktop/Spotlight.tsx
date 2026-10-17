'use client';

import { useUnit } from 'effector-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { projects } from '@/content/projects';
import { questionQueued } from '@/features/assistant/model';
import { $spotlightOpen, spotlightClosed } from '@/features/spotlight/model';
import { windowOpened } from '@/features/windows/model';
import { useI18n } from '@/shared/i18n-context';
import { getViewport } from '@/shared/viewport';

/* ---------------- spotlight ---------------- */

type Hit = { key: string; label: string; hint: string; run: () => void; text: string };

export function Spotlight() {
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
      {
        key: 'mail',
        label: dict.dock.mail,
        hint: s.app,
        text: 'mail email почта contact',
        run: () => open({ app: 'mail', vp: vp() }),
      },
      {
        key: 'code',
        label: dict.dock.code,
        hint: s.app,
        text: 'vs code vscode source код исходник github ide',
        run: () => open({ app: 'code', vp: vp() }),
      },
      {
        key: 'terminal',
        label: 'Terminal',
        hint: s.hidden,
        text: 'terminal zsh cli терминал',
        run: () => open({ app: 'terminal', vp: vp() }),
      },
    ];
  }, [dict, locale, open, router]);

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
      <div className="spotlight glass" role="dialog" aria-label={dict.menubar.search}>
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
