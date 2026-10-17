import { profileSchema } from './schema';

/** Профиль и контакты. Тексты about — из анкеты контента. */
export const profile = profileSchema.parse({
  name: { en: 'Alina Pipchenkova', ru: 'Алина Пипченкова' },
  role: {
    en: 'Frontend developer · interfaces for AI products',
    ru: 'Фронтенд-разработчик · интерфейсы для AI-продуктов',
  },
  location: { en: 'Moscow', ru: 'Москва' },
  about: {
    en: "Hi, I'm Alina — a frontend developer and UI/UX designer from Moscow. I like building products end to end: from the idea and first screens in Figma to a fast, animated interface in production.\n\nI'm doing a master's at HSE (Applied Neural Network Technologies) and moving towards AI products: AI agents, RAG, LLM integrations and the interfaces people use to work with models.\n\nBefore that: bachelor's in Business Management at HSE Graduate School of Business, plus two CS minors — programming and machine learning.",
    ru: 'Привет, я Алина — фронтенд-разработчик и UI/UX-дизайнер из Москвы. Мне нравится собирать продукты целиком: от идеи и первых экранов в Figma до работающего, быстрого и анимированного интерфейса в проде.\n\nСейчас учусь в магистратуре НИУ ВШЭ по направлению «Прикладные нейросетевые технологии» и постепенно смещаюсь в сторону AI-продуктов. Особенно интересны AI-агенты, RAG, LLM-интеграции и интерфейсы, через которые человек взаимодействует с моделями.\n\nДо этого окончила бакалавриат Высшей школы бизнеса НИУ ВШЭ по менеджменту и прошла два майнора ФКН — по программированию и машинному обучению.',
  },
  email: 'pipchenkova0701@gmail.com',
  telegram: 'https://t.me/pip_ch',
  github: 'https://github.com/Pipchenkovaa',
  /** Репозиторий этого сайта — на него ведёт окно VS Code. */
  repo: 'https://github.com/Pipchenkovaa/portfolio',
  resumePdf: '/resume.pdf',
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Effector',
    'Tailwind',
    'GSAP',
    'Three.js / R3F',
    'Storybook',
    'Figma',
    'Docker',
    'Generative APIs',
  ],
  siteUrl: 'https://example.com',
});
