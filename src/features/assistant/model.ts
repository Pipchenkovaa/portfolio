import { createEvent, createStore } from 'effector';

/** Вопрос, пришедший извне окна чата (из Spotlight). AskView забирает его и отвечает. */
export const questionQueued = createEvent<string>();
export const questionConsumed = createEvent();
export const $pendingQuestion = createStore<string | null>(null)
  .on(questionQueued, (_, q) => q)
  .on(questionConsumed, () => null);
