import { describe, expect, it } from 'vitest';
import {
  closeWindow,
  emptyState,
  focusWindow,
  measureWindow,
  minimizeWindow,
  MIN_W,
  openWindow,
  parseRoute,
  routeFor,
  setRect,
  toggleZoom,
  topWindow,
  workArea,
} from './logic';

const vp = { width: 1440, height: 900 };

describe('window manager', () => {
  it('opens a window on top and reuses it on the second open', () => {
    let s = openWindow(emptyState, { app: 'project', slug: 'travly' }, vp);
    s = openWindow(s, { app: 'finder' }, vp);
    expect(topWindow(s)?.id).toBe('finder');
    s = openWindow(s, { app: 'project', slug: 'travly' }, vp);
    expect(s.windows).toHaveLength(2);
    expect(topWindow(s)?.id).toBe('project:travly');
  });

  it('cascades new windows instead of stacking them exactly', () => {
    let s = openWindow(emptyState, { app: 'project', slug: 'a' }, vp);
    s = openWindow(s, { app: 'project', slug: 'b' }, vp);
    expect(s.windows[0]?.rect?.x).not.toBe(s.windows[1]?.rect?.x);
  });

  it('restores a minimized window on focus', () => {
    let s = openWindow(emptyState, { app: 'ask' }, vp);
    s = minimizeWindow(s, 'ask');
    expect(topWindow(s)).toBeUndefined();
    s = focusWindow(s, 'ask');
    expect(topWindow(s)?.id).toBe('ask');
  });

  it('zoom fills the work area and toggles back to the previous rect', () => {
    let s = openWindow(emptyState, { app: 'project', slug: 'travly' }, vp);
    const before = s.windows[0]?.rect;
    s = toggleZoom(s, 'project:travly', vp);
    expect(s.windows[0]?.rect).toEqual(workArea(vp));
    s = toggleZoom(s, 'project:travly', vp);
    expect(s.windows[0]?.rect).toEqual(before);
  });

  it('manual resize clears the zoomed state and respects min size', () => {
    let s = openWindow(emptyState, { app: 'about' }, vp);
    s = toggleZoom(s, 'about', vp);
    s = setRect(s, 'about', { x: 100, y: 100, w: 10, h: 10 }, vp);
    expect(s.windows[0]?.restoreRect).toBeNull();
    expect(s.windows[0]?.rect?.w).toBe(MIN_W);
  });

  it('keeps the title bar reachable when dragged off-screen', () => {
    let s = openWindow(emptyState, { app: 'about' }, vp);
    s = setRect(s, 'about', { x: 5000, y: -500, w: 500, h: 400 }, vp);
    expect(s.windows[0]?.rect?.x).toBeLessThanOrEqual(vp.width - 120);
    expect(s.windows[0]?.rect?.y).toBeGreaterThanOrEqual(30);
  });

  it('measures SSR windows once and never overrides a placed window', () => {
    let s = openWindow(emptyState, { app: 'project', slug: 'x' }, null);
    expect(s.windows[0]?.rect).toBeNull();
    s = measureWindow(s, 'project:x', { x: 1, y: 2, w: 3, h: 4 });
    s = measureWindow(s, 'project:x', { x: 9, y: 9, w: 9, h: 9 });
    expect(s.windows[0]?.rect).toEqual({ x: 1, y: 2, w: 3, h: 4 });
  });

  it('derives the URL from the top window', () => {
    let s = openWindow(emptyState, { app: 'project', slug: 'travly' }, vp);
    expect(routeFor(s)).toBe('/work/travly/');
    s = openWindow(s, { app: 'ask' }, vp);
    expect(routeFor(s)).toBe('/');
    s = closeWindow(s, 'ask');
    expect(routeFor(s)).toBe('/work/travly/');
  });

  it('parses routes', () => {
    expect(parseRoute('/work/my-fume/')).toEqual({ app: 'project', slug: 'my-fume' });
    expect(parseRoute('/about')).toEqual({ app: 'about' });
    expect(parseRoute('/nope')).toBeNull();
  });
});
