'use client';

import { useUnit } from 'effector-react';
import { windowId, type AppKind } from '@/features/windows/logic';
import { windowOpened } from '@/features/windows/model';
import { setOrigin } from '@/features/windows/origin';
import { getViewport } from '@/shared/viewport';

/** Открыть окно; если передан элемент (иконка), окно «вырастет» из него. */
export function useOpen() {
  const open = useUnit(windowOpened);
  return (app: AppKind, opts: { slug?: string; from?: Element | null } = {}) => {
    if (opts.from) setOrigin(windowId(app, opts.slug), opts.from);
    open({ app, ...(opts.slug ? { slug: opts.slug } : {}), vp: getViewport() });
  };
}
