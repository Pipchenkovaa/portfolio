import { createEffect, createEvent, createStore, sample } from 'effector';

export interface Notice {
  id: number;
  app: string;
  icon: 'mail' | 'pdf' | 'info';
  title: string;
  body: string;
}

let seq = 0;
export const notified = createEvent<Omit<Notice, 'id'>>();
export const noticeDismissed = createEvent<number>();
const noticeAdded = createEvent<Notice>();

export const $notices = createStore<Notice[]>([])
  .on(noticeAdded, (list, n) => [n, ...list].slice(0, 4))
  .on(noticeDismissed, (list, id) => list.filter((n) => n.id !== id));

const autoDismissFx = createEffect(
  (id: number) => new Promise<number>((resolve) => setTimeout(() => resolve(id), 4500)),
);

sample({ clock: notified, fn: (n): Notice => ({ ...n, id: ++seq }), target: noticeAdded });
sample({ clock: noticeAdded, fn: (n) => n.id, target: autoDismissFx });
sample({ clock: autoDismissFx.doneData, target: noticeDismissed });
