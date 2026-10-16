'use client';

import { useEffect, useRef, useState } from 'react';
import { useUnit } from 'effector-react';
import { answerLocally } from '@/features/assistant/answer';
import { $pendingQuestion, questionConsumed } from '@/features/assistant/model';
import { useI18n } from '@/shared/i18n-context';

type Msg = { id: number; from: 'me' | 'bot'; text: string; typing?: boolean };

export function AskView() {
  const { locale, dict } = useI18n();
  const t = dict.ask;
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: 'bot', text: t.greeting }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const seq = useRef(1);
  const { pending, consume } = useUnit({ pending: $pendingQuestion, consume: questionConsumed });

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [msgs]);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || busy) return;
    setBusy(true);
    const botId = seq.current + 1;
    setMsgs((m) => [
      ...m,
      { id: seq.current, from: 'me', text: question },
      { id: botId, from: 'bot', text: '', typing: true },
    ]);
    seq.current += 2;
    const answer = await answerLocally(question, locale);
    await new Promise((r) => setTimeout(r, 500));
    // Печатаем ответ по символам — так же будет выглядеть стриминг от настоящей модели.
    for (let i = 1; i <= answer.length; i += 2) {
      const text = answer.slice(0, i);
      setMsgs((m) => m.map((x) => (x.id === botId ? { ...x, text, typing: false } : x)));
      await new Promise((r) => setTimeout(r, 12));
    }
    setMsgs((m) => m.map((x) => (x.id === botId ? { ...x, text: answer, typing: false } : x)));
    setBusy(false);
  };

  useEffect(() => {
    if (!pending) return;
    const t = window.setTimeout(() => {
      consume();
      void ask(pending);
    }, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- реагируем только на новый вопрос
  }, [pending]);

  return (
    <div className="flex h-full flex-col">
      <div ref={list} className="flex flex-1 flex-col gap-2.5 overflow-auto p-4" aria-live="polite">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={
              m.from === 'me'
                ? 'max-w-[82%] self-end rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-[15px] text-white'
                : 'max-w-[82%] rounded-2xl rounded-bl-sm bg-[var(--chip)] px-3.5 py-2 text-[15px]'
            }
          >
            {m.typing ? (
              <span aria-label="…" className="animate-pulse">
                •••
              </span>
            ) : (
              m.text
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 px-4 pb-2">
        {t.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[13.5px]"
            onClick={() => ask(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="px-4 pb-2 text-[11.5px] text-[var(--muted)]">{t.demoNote}</p>
      <form
        className="flex gap-2 border-t border-[var(--line)] p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
          setInput('');
        }}
      >
        <input
          className="flex-1 rounded-lg border border-[var(--line)] bg-transparent px-3 py-2 text-[15px] outline-none focus:border-accent"
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn" type="submit" aria-label={t.send} disabled={busy}>
          →
        </button>
      </form>
    </div>
  );
}
