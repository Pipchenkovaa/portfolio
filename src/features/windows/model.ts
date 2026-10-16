import { createEffect, createEvent, createStore, sample } from 'effector';
import type { Locale } from '@/i18n/config';
import {
  closeWindow,
  emptyState,
  focusWindow,
  measureWindow,
  minimizeWindow,
  openWindow,
  routeFor,
  setRect,
  toggleZoom,
  type AppKind,
  type Rect,
  type Viewport,
  type WindowsState,
} from './logic';

export const $locale = createStore<Locale>('en');
export const $windows = createStore<WindowsState>(emptyState);

export const windowOpened = createEvent<{ app: AppKind; slug?: string; vp: Viewport }>();
export const windowClosed = createEvent<string>();
export const windowFocused = createEvent<string>();
export const windowMinimized = createEvent<string>();
export const windowRectChanged = createEvent<{ id: string; rect: Rect; vp: Viewport }>();
export const windowMeasured = createEvent<{ id: string; rect: Rect }>();
export const windowZoomToggled = createEvent<{ id: string; vp: Viewport }>();
/** Пользователь нажал «назад/вперёд» в браузере — состояние меняем без записи в историю. */
export const routeRestored = createEvent<{ open: { app: AppKind; slug?: string } | null; vp: Viewport }>();

$windows
  .on(windowOpened, (s, { app, slug, vp }) => openWindow(s, slug ? { app, slug } : { app }, vp))
  .on(windowClosed, closeWindow)
  .on(windowFocused, focusWindow)
  .on(windowMinimized, minimizeWindow)
  .on(windowRectChanged, (s, { id, rect, vp }) => setRect(s, id, rect, vp))
  .on(windowMeasured, (s, { id, rect }) => measureWindow(s, id, rect))
  .on(windowZoomToggled, (s, { id, vp }) => toggleZoom(s, id, vp))
  .on(routeRestored, (s, { open, vp }) => {
    if (open) return openWindow(s, open, vp);
    // Вернулись на «/»: закрываем окно, которое держало адрес.
    const routed = s.windows.filter((w) => w.app === 'project' || w.app === 'about');
    return routed.reduce((acc, w) => closeWindow(acc, w.id), s);
  });

export const $route = $windows.map(routeFor);

type HistoryMode = 'push' | 'replace' | 'none';
const $historyMode = createStore<HistoryMode>('none')
  // Новая запись в истории — только для окон со своим адресом (кейс, about); чат или Finder её не создают.
  .on(windowOpened, (_, { app }) => (app === 'project' || app === 'about' ? 'push' : 'replace'))
  .on([windowClosed, windowFocused, windowMinimized], () => 'replace')
  .on(routeRestored, () => 'none');

const writeUrlFx = createEffect(({ url, mode }: { url: string; mode: HistoryMode }) => {
  if (typeof window === 'undefined' || mode === 'none') return;
  if (window.location.pathname === url) return;
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
});

sample({
  clock: $route.updates,
  source: { mode: $historyMode, locale: $locale },
  fn: ({ mode, locale }, route) => ({ mode, url: `/${locale}${route}` }),
  target: writeUrlFx,
});
