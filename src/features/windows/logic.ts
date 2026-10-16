/**
 * Чистая логика оконного менеджера: без DOM и без Effector, поэтому покрывается юнит-тестами.
 * Effector-модель (model.ts) только связывает эти функции с событиями.
 */

export type AppKind = 'project' | 'finder' | 'early' | 'about' | 'ask' | 'terminal' | 'resume' | 'mail';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowState {
  id: string;
  app: AppKind;
  slug?: string;
  z: number;
  /** null — окно ещё не измерено (отрендерено на сервере по центру); задаётся после монтирования. */
  rect: Rect | null;
  minimized: boolean;
  /** Прямоугольник до разворота зелёной кнопкой; null — окно не развёрнуто. */
  restoreRect: Rect | null;
}

export interface WindowsState {
  windows: WindowState[];
  zTop: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export const MENUBAR_H = 30;
export const DOCK_RESERVE = 96;
export const MIN_W = 340;
export const MIN_H = 220;

export const DEFAULT_SIZE: Record<AppKind, { w: number; h: number }> = {
  project: { w: 820, h: 660 },
  finder: { w: 660, h: 400 },
  early: { w: 620, h: 360 },
  about: { w: 540, h: 440 },
  ask: { w: 460, h: 560 },
  terminal: { w: 620, h: 400 },
  resume: { w: 760, h: 760 },
  mail: { w: 600, h: 500 },
};

export const emptyState: WindowsState = { windows: [], zTop: 0 };

export function windowId(app: AppKind, slug?: string): string {
  return slug ? `${app}:${slug}` : app;
}

export function workArea(vp: Viewport): Rect {
  return { x: 8, y: MENUBAR_H + 8, w: vp.width - 16, h: vp.height - MENUBAR_H - 8 - DOCK_RESERVE };
}

/** Держим окно так, чтобы заголовок всегда можно было схватить мышью. */
export function clampRect(r: Rect, vp: Viewport): Rect {
  const w = Math.max(MIN_W, Math.min(r.w, vp.width));
  const h = Math.max(MIN_H, Math.min(r.h, vp.height - MENUBAR_H));
  const x = Math.min(Math.max(r.x, -w + 120), vp.width - 120);
  const y = Math.min(Math.max(r.y, MENUBAR_H), vp.height - 60);
  return { x, y, w, h };
}

/** Новое окно — по центру рабочей области; следующие чуть смещаются, чтобы не лечь ровно друг на друга. */
function cascadeRect(app: AppKind, index: number, vp: Viewport): Rect {
  const size = DEFAULT_SIZE[app];
  const area = workArea(vp);
  const w = Math.min(size.w, area.w);
  const h = Math.min(size.h, area.h);
  const offset = (index % 5) * 24;
  const x = Math.round(area.x + (area.w - w) / 2 + offset);
  const y = Math.round(area.y + (area.h - h) / 2 + offset);
  return clampRect({ x, y, w, h }, vp);
}

function update(state: WindowsState, id: string, fn: (w: WindowState) => WindowState): WindowsState {
  return { ...state, windows: state.windows.map((w) => (w.id === id ? fn(w) : w)) };
}

export function focusWindow(state: WindowsState, id: string): WindowsState {
  const target = state.windows.find((w) => w.id === id);
  if (!target) return state;
  if (target.z === state.zTop && !target.minimized) return state;
  const zTop = state.zTop + 1;
  return update({ ...state, zTop }, id, (w) => ({ ...w, z: zTop, minimized: false }));
}

export function openWindow(
  state: WindowsState,
  input: { app: AppKind; slug?: string },
  vp: Viewport | null,
): WindowsState {
  const id = windowId(input.app, input.slug);
  if (state.windows.some((w) => w.id === id)) return focusWindow(state, id);
  const zTop = state.zTop + 1;
  const win: WindowState = {
    id,
    app: input.app,
    ...(input.slug ? { slug: input.slug } : {}),
    z: zTop,
    rect: vp ? cascadeRect(input.app, state.windows.length, vp) : null,
    minimized: false,
    restoreRect: null,
  };
  return { windows: [...state.windows, win], zTop };
}

export function closeWindow(state: WindowsState, id: string): WindowsState {
  return { ...state, windows: state.windows.filter((w) => w.id !== id) };
}

export function minimizeWindow(state: WindowsState, id: string): WindowsState {
  return update(state, id, (w) => ({ ...w, minimized: true }));
}

export function setRect(state: WindowsState, id: string, rect: Rect, vp: Viewport): WindowsState {
  // Ручное перемещение/ресайз отменяет «развёрнутость», как в macOS.
  return update(state, id, (w) => ({ ...w, rect: clampRect(rect, vp), restoreRect: null }));
}

/** Первое измерение окна, отрендеренного без координат (SSR). Не трогает уже размещённые окна. */
export function measureWindow(state: WindowsState, id: string, rect: Rect): WindowsState {
  return update(state, id, (w) => (w.rect ? w : { ...w, rect }));
}

export function toggleZoom(state: WindowsState, id: string, vp: Viewport): WindowsState {
  return update(state, id, (w) => {
    if (w.restoreRect) return { ...w, rect: w.restoreRect, restoreRect: null };
    const current = w.rect ?? cascadeRect(w.app, 0, vp);
    return { ...w, rect: workArea(vp), restoreRect: current };
  });
}

/** Верхнее видимое окно — именно оно определяет адрес страницы. */
export function topWindow(state: WindowsState): WindowState | undefined {
  return state.windows
    .filter((w) => !w.minimized)
    .reduce<WindowState | undefined>((top, w) => (!top || w.z > top.z ? w : top), undefined);
}

/** Путь (без локали) для текущего состояния: /work/<slug>/, /about/ или /. */
export function routeFor(state: WindowsState): string {
  const top = topWindow(state);
  if (top?.app === 'project' && top.slug) return `/work/${top.slug}/`;
  if (top?.app === 'about') return '/about/';
  return '/';
}

export function parseRoute(pathWithoutLocale: string): { app: AppKind; slug?: string } | null {
  const work = /^\/work\/([a-z0-9-]+)\/?$/.exec(pathWithoutLocale);
  if (work?.[1]) return { app: 'project', slug: work[1] };
  if (/^\/about\/?$/.test(pathWithoutLocale)) return { app: 'about' };
  return null;
}
