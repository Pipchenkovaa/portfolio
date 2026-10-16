'use client';

import { useSyncExternalStore } from 'react';
import type { Viewport } from '@/features/windows/logic';

export function getViewport(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight };
}

export const MOBILE_QUERY = '(max-width: 720px)';

function subscribe(cb: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/** На сервере считаем, что это десктоп; раскладку для телефона всё равно делает CSS. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
