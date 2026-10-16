import { createEvent, createStore } from 'effector';

export const spotlightToggled = createEvent();
export const spotlightClosed = createEvent();
export const $spotlightOpen = createStore(false)
  .on(spotlightToggled, (v) => !v)
  .on(spotlightClosed, () => false);
