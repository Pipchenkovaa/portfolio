import { profileSchema } from './schema';

/** ВРЕМЕННЫЕ контакты — заменить реальными перед запуском. */
export const profile = profileSchema.parse({
  name: { en: 'Alina Pipchenkova', ru: 'Алина Пипченкова' },
  role: { en: 'Frontend developer & UI/UX designer', ru: 'Фронтенд-разработчик и UI/UX-дизайнер' },
  location: { en: 'Moscow', ru: 'Москва' },
  about: {
    en: "Hi, I'm Alina — frontend developer & UI/UX designer from Moscow.\n\nI take products from a blank Figma file to a fast, animated, production-ready interface.\n\nNow: master's student, moving towards AI products — agents, RAG and the interfaces people use to talk to them.\n\nBackground: HSE Graduate School of Business (Business Management) + CS minors in programming and ML.",
    ru: 'Привет, я Алина — фронтенд-разработчик и UI/UX-дизайнер из Москвы.\n\nДовожу продукт от пустого файла в Figma до быстрого анимированного интерфейса в проде.\n\nСейчас учусь в магистратуре и иду в AI-продукты — агенты, RAG и интерфейсы, через которые люди с ними общаются.\n\nОбразование: Высшая школа бизнеса НИУ ВШЭ (менеджмент) + майноры ФКН по программированию и ML.',
  },
  email: 'hello@example.com',
  telegram: 'https://t.me/username',
  github: 'https://github.com/pipchenkovaa',
  resumePdf: '/resume.pdf',
  skills: ['React', 'Next.js', 'TypeScript', 'Effector', 'Tailwind', 'GSAP', 'Three.js', 'Docker', 'Figma'],
  siteUrl: 'https://example.com',
});
