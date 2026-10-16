'use client';

import { useUnit } from 'effector-react';
import { useState } from 'react';
import { profile } from '@/content/profile';
import { pick } from '@/i18n/config';
import { notified } from '@/features/notifications/model';
import { useI18n } from '@/shared/i18n-context';

/**
 * Окно «Новое сообщение» как в Почте. Сайт ничего не отправляет и не хранит:
 * кнопка собирает mailto: и письмо открывается в почтовой программе посетителя.
 * Поэтому персональные данные через сайт не проходят — регистрироваться оператором ПДн не нужно.
 */
export function MailCompose({ onSent }: { onSent?: () => void }) {
  const { locale, dict } = useI18n();
  const t = dict.mail;
  const notify = useUnit(notified);
  const [subject, setSubject] = useState<string>(t.subjectDefault);
  const [body, setBody] = useState('');

  const send = () => {
    navigator.clipboard?.writeText(profile.email).catch(() => {});
    const q = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20');
    window.location.href = `mailto:${profile.email}?${q}`;
    notify({ app: dict.dock.mail, icon: 'mail', title: t.openedTitle, body: t.openedBody });
    onSent?.();
  };

  const copy = () => {
    navigator.clipboard?.writeText(profile.email).catch(() => {});
    notify({ app: dict.dock.mail, icon: 'mail', title: dict.notify.mailCopiedTitle, body: profile.email });
  };

  return (
    <form
      className="mail"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <div className="mail-toolbar">
        <button type="submit" className="mail-send" aria-label={t.send}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path
              d="M2.5 9.2 17 2.8c.5-.2 1 .3.8.8L11.4 18c-.2.5-.9.5-1.1 0l-2-5.4-5.4-2c-.5-.2-.5-.9 0-1.1Z"
              fill="currentColor"
            />
          </svg>
          {t.send}
        </button>
        <button type="button" className="mail-copy" onClick={copy}>
          {t.copy}
        </button>
      </div>
      <div className="mail-row">
        <span>{t.to}:</span>
        <span className="mail-chip">
          {pick(profile.name, locale)} <small>&lt;{profile.email}&gt;</small>
        </span>
      </div>
      <label className="mail-row">
        <span>{t.subject}:</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <textarea
        aria-label={t.body}
        placeholder={t.body}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <p className="mail-privacy">{t.privacy}</p>
    </form>
  );
}
