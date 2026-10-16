/**
 * Откуда «выросло» окно: прямоугольник иконки, по которой кликнули.
 * Это не состояние приложения, а разовая подсказка для анимации открытия/закрытия, поэтому живёт вне стора.
 */
export type OriginRect = { x: number; y: number; w: number; h: number };

const origins = new Map<string, OriginRect>();

export function setOrigin(id: string, el: Element | null | undefined) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  origins.set(id, { x: r.left, y: r.top, w: r.width, h: r.height });
}

export function getOrigin(id: string): OriginRect | undefined {
  return origins.get(id);
}
