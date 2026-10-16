'use client';

import { useUnit } from 'effector-react';
import { profile } from '@/content/profile';
import { notified } from '@/features/notifications/model';
import { useI18n } from '@/shared/i18n-context';

/** Почта: открываем mailto и копируем адрес — у многих почтовый клиент не настроен, и mailto молча ничего не делает. */
export function useMailAction() {
  const { dict } = useI18n();
  const notify = useUnit(notified);
  return () => {
    navigator.clipboard?.writeText(profile.email).catch(() => {});
    notify({
      app: 'Mail',
      icon: 'mail',
      title: dict.notify.mailCopiedTitle,
      body: `${profile.email} ${dict.notify.mailCopiedBody}`,
    });
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Hi Alina')}`;
  };
}
