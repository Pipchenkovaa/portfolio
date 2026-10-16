import type { Locale } from '@/i18n/config';

/**
 * Интерфейс ассистента. Сейчас — локальные заготовки по ключевым словам.
 * Когда подключим LLM (YandexGPT через Cloud Function), заменится только реализация этой функции.
 */
export type Answerer = (question: string, locale: Locale) => Promise<string>;

const KB: Array<{ re: RegExp; en: string; ru: string }> = [
  {
    re: /experience|years|опыт|лет|сколько/i,
    en: 'About 2 years of commercial frontend experience: Atlas IR (team of 8), an internship at GK FSK, and freelance projects since December 2025.',
    ru: 'Около 2 лет коммерческого опыта во фронтенде: Atlas IR (команда из 8 человек), стажировка в ГК ФСК и фриланс-проекты с декабря 2025.',
  },
  {
    re: /three|3d|webgl|r3f|шейдер|три/i,
    en: 'Yes — at GK FSK I designed and built a 7-page landing with Three.js / React Three Fiber scenes in one week. See the FSK LAB case.',
    ru: 'Да — в ГК ФСК за неделю спроектировала и собрала 7-страничный лендинг со сценами на Three.js / React Three Fiber. Смотри кейс FSK LAB.',
  },
  {
    re: /stack|react|next|typescript|tech|стек|технолог/i,
    en: 'TypeScript, React, Next.js, Effector, Tailwind, GSAP, Three.js / R3F, Storybook, Figma. On the infra side — Docker, Vercel, GitHub Actions; basic Python and FastAPI.',
    ru: 'TypeScript, React, Next.js, Effector, Tailwind, GSAP, Three.js / R3F, Storybook, Figma. Из инфраструктуры — Docker, Vercel, GitHub Actions; Python и FastAPI на базовом уровне.',
  },
  {
    re: /design system|ui.?kit|storybook|компонент|дизайн-систем/i,
    en: 'At Atlas IR I designed and built a UI kit of 100+ components with shared tokens, across 7 breakpoints. At GK FSK — 14 design-system components documented in Storybook.',
    ru: 'В Atlas IR спроектировала и собрала UI-Kit на 100+ компонентов с общими токенами и 7 брейкпоинтами. В ГК ФСК — 14 компонентов дизайн-системы с документацией в Storybook.',
  },
  {
    re: /\bai\b|rag|llm|agent|ml|ии|нейро|агент|генерац/i,
    en: "I build interfaces for AI products: async work with generative APIs, job queues, long-running states — see Brainstorming. I'm doing a master's in Applied Neural Network Technologies and moving towards AI agents and RAG.",
    ru: 'Делаю интерфейсы для AI-продуктов: асинхронная работа с генеративными API, очереди задач, состояния долгих операций — смотри Brainstorming. Учусь в магистратуре «Прикладные нейросетевые технологии» и иду в сторону AI-агентов и RAG.',
  },
  {
    re: /hire|available|job|work|vacan|contact|remote|office|работ|ваканс|ищешь|связ|удал|офис/i,
    en: 'Open to frontend roles, ideally on AI-product teams. Remote or hybrid. The fastest way to reach me is the Mail icon in the dock or Telegram @pip_ch.',
    ru: 'Открыта к фронтенд-позициям, в идеале в командах AI-продуктов. Удалённо или гибрид. Быстрее всего — иконка почты в доке или Telegram @pip_ch.',
  },
  {
    re: /design|figma|ux|дизайн/i,
    en: 'I like owning the whole product: thinking through UX/UI, designing the interface, building it and taking it to production.',
    ru: 'Люблю работать над продуктом целиком: продумать UX/UI, спроектировать интерфейс, реализовать и довести до продакшна.',
  },
  {
    re: /education|hse|study|universit|учеб|образован|вшэ|магистр/i,
    en: "Master's at HSE Faculty of Computer Science (Applied Neural Network Technologies), since 2026. Bachelor's in Business Management at HSE Graduate School of Business, plus CS minors in algorithms and machine learning.",
    ru: 'Магистратура ФКН НИУ ВШЭ «Прикладные нейросетевые технологии» с 2026 года. До этого — бакалавриат ВШБ НИУ ВШЭ по управлению бизнесом и майноры ФКН по алгоритмам и машинному обучению.',
  },
];

const FALLBACK = {
  en: 'The demo knows about my experience, stack, design systems, 3D, AI direction, education and availability. The full version will answer anything from my CV.',
  ru: 'Демо знает про опыт, стек, дизайн-системы, 3D, AI, образование и поиск работы. Полная версия ответит на любой вопрос по резюме.',
};

export const answerLocally: Answerer = async (question, locale) => {
  const hit = KB.find(({ re }) => re.test(question));
  return (hit ?? FALLBACK)[locale];
};
