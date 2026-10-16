'use client';

import { fork } from 'effector';
import { Provider } from 'effector-react';
import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { I18nProvider } from '@/shared/i18n-context';
import { emptyState, openWindow, type AppKind } from '@/features/windows/logic';
import { $locale, $windows } from '@/features/windows/model';
import { Desktop } from './Desktop';

/**
 * Корень рабочего стола. Свой scope Effector на страницу: окно из адреса (/work/travly)
 * кладётся в стор ещё до рендера, поэтому оно приходит в HTML с сервера — его видят поисковики и
 * пользователи без JS.
 */
export function DesktopApp({
  locale,
  dict,
  initial,
}: {
  locale: Locale;
  dict: Dictionary;
  initial?: { app: AppKind; slug?: string };
}) {
  const [scope] = useState(() =>
    fork({
      values: [
        [$locale, locale],
        [$windows, initial ? openWindow(emptyState, initial, null) : emptyState],
      ],
    }),
  );
  return (
    <Provider value={scope}>
      <I18nProvider locale={locale} dict={dict}>
        <Desktop />
      </I18nProvider>
    </Provider>
  );
}
