'use client';

import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import { profile } from '@/content/profile';
import { pick } from '@/i18n/config';
import { spotlightClosed, spotlightToggled } from '@/features/spotlight/model';
import { parseRoute } from '@/features/windows/logic';
import { routeRestored } from '@/features/windows/model';
import { useI18n } from '@/shared/i18n-context';
import { getViewport } from '@/shared/viewport';
import { DesktopIcons } from './DesktopIcons';
import { Dock } from './Dock';
import { MenuBar } from './MenuBar';
import { Notices } from './Notices';
import { Spotlight } from './Spotlight';
import { Wallpaper } from './Wallpaper';
import { Windows } from './Windows';

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
    document.documentElement.dataset.ready = '1'; // сигнал для e2e: обработчики навешены
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
    };
  }, [locale, toggleSpotlight, closeSpotlight, restore]);

  return (
    <div className="desktop">
      <Wallpaper />
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
