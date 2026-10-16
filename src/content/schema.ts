import { z } from 'zod';

const localized = z.object({ en: z.string().min(1), ru: z.string().min(1) });
const hex = z.string().regex(/^#[0-9a-f]{6}$/i);
const percent = z.number().min(0).max(100);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  tagline: localized,
  year: z.number().int().min(2015).max(2100),
  role: localized,
  stack: z.array(z.string()).min(1),
  problem: localized,
  solution: localized,
  /** null — результат ещё не заполнен, на сайте покажется как черновик (только в dev). */
  result: localized.nullable(),
  links: z.object({ live: z.url().optional(), code: z.url().optional() }),
  cover: z.object({
    from: hex,
    to: hex,
    glyph: z.string().max(3),
    /** /media/<slug>/cover.avif — когда появятся реальные обложки */
    image: z.string().startsWith('/').optional(),
    /** /media/<slug>/loop.mp4 — короткий луп интерфейса для окна кейса */
    loop: z.string().startsWith('/').optional(),
    /** /media/<slug>/hero — база имени, файлы hero.avif/hero.webp готовит scripts/media.mjs */
    hero: z.string().startsWith('/').optional(),
  }),
  /** Экраны кейса: src — база имени (<src>-800/-1600 .avif/.webp), размеры исходника — от них зависит соотношение сторон. */
  gallery: z
    .array(
      z.object({
        src: z.string().startsWith('/'),
        width: z.number().int(),
        height: z.number().int(),
        alt: localized,
      }),
    )
    .default([]),
  /** Позиция иконки на рабочем столе, в процентах от экрана. */
  desktop: z.object({ x: percent, y: percent }),
  /** main — иконка на рабочем столе; early — внутри папки «Early works». */
  group: z.enum(['main', 'early']).default('main'),
  /** Честная пометка в кейсе: например, что живое демо работает не полностью. */
  note: localized.optional(),
  placeholder: z.boolean().default(false),
});

export const profileSchema = z.object({
  name: localized,
  role: localized,
  location: localized,
  about: localized,
  email: z.email(),
  telegram: z.url(),
  github: z.url(),
  resumePdf: z.string().startsWith('/'),
  skills: z.array(z.string()).min(1),
  siteUrl: z.url(),
});

export type Project = z.infer<typeof projectSchema>;
export type Profile = z.infer<typeof profileSchema>;
