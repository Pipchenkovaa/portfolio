'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useUnit } from 'effector-react';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { useI18n } from '@/shared/i18n-context';
import { getViewport } from '@/shared/viewport';
import { windowOpened } from '@/features/windows/model';

type Line = { id: number; node: ReactNode };

export function TerminalView({ onMail }: { onMail: () => void }) {
  const { dict } = useI18n();
  const open = useUnit(windowOpened);
  const [lines, setLines] = useState<Line[]>([{ id: 0, node: dict.terminal.hint }]);
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const seq = useRef(1);

  useEffect(() => input.current?.focus(), []);
  useEffect(() => box.current?.scrollTo({ top: box.current.scrollHeight }), [lines]);

  const print = (...nodes: ReactNode[]) =>
    setLines((l) => [...l, ...nodes.map((node) => ({ id: seq.current++, node }))]);

  const run = (raw: string) => {
    const [cmd = '', ...args] = raw.trim().split(/\s+/);
    const arg = args.join(' ');
    print(
      <>
        <span className="text-[#7aa2ff]">alina@portfolio ~ %</span> {raw}
      </>,
    );
    switch (cmd) {
      case '':
        return;
      case 'help':
        return print('ls · open <project> · whoami · stack · contact · clear');
      case 'ls':
        return print(
          <>
            {projects.map((p) => (
              <span key={p.slug} className="mr-3 text-[#ffd479]">
                {p.slug}/
              </span>
            ))}
            about.txt Resume.pdf
          </>,
        );
      case 'whoami':
        return print(`${profile.name.en} — ${profile.role.en}`);
      case 'stack':
        return print(profile.skills.join('  '));
      case 'contact':
        print('Opening mail…');
        return onMail();
      case 'open': {
        const p = projects.find((x) => x.slug === arg);
        if (!p) return print(`open: ${arg || '?'}: no such project. Try ls`);
        print(`Opening ${p.title}…`);
        return open({ app: 'project', slug: p.slug, vp: getViewport() });
      }
      case 'clear':
        return setLines([]);
      case 'sudo':
        return print(arg === 'hire-me' ? '✅ Permission granted. Try `contact`.' : 'sudo: nice try');
      default:
        return print(`zsh: command not found: ${cmd}`);
    }
  };

  return (
    <div
      ref={box}
      className="h-full overflow-auto bg-[#0f1115] p-3.5 font-mono text-[13px] leading-relaxed text-[#c8f7c5]"
      onClick={() => input.current?.focus()}
    >
      {lines.map((l) => (
        <div key={l.id} className="whitespace-pre-wrap">
          {l.node}
        </div>
      ))}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue('');
        }}
      >
        <span className="text-[#7aa2ff]">alina@portfolio ~ %</span>
        <input
          ref={input}
          aria-label="Terminal input"
          spellCheck={false}
          autoCapitalize="off"
          className="flex-1 bg-transparent outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </div>
  );
}
