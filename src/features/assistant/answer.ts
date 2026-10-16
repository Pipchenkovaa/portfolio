import type { Locale } from '@/i18n/config';

/**
 * Интерфейс ассистента. Сейчас — локальные заготовки по ключевым словам.
 * Когда подключим LLM (YandexGPT через Cloud Function), заменится только реализация этой функции.
 */
export type Answerer = (question: string, locale: Locale) => Promise<string>;

const KB: Array<{ re: RegExp; en: string; ru: string }> = [
  {
    re: /three|3d|webgl|shader|шейдер|три/i,
    en: "I've used Three.js for interactive scenes and hero sections — see the 3D Lab folder. Shaders are still my playground rather than production.",
    ru: 'Делала на Three.js интерактивные сцены и hero-блоки — загляни в папку 3D Lab. Шейдеры пока скорее песочница, чем прод.',
  },
  {
    re: /stack|react|next|typescript|tech|стек|технолог/i,
    en: 'Main stack: React + Next.js + TypeScript, Effector for state, Tailwind for styling, GSAP for motion. Deploy via Docker or static CDN.',
    ru: 'Основной стек: React + Next.js + TypeScript, Effector для состояния, Tailwind для стилей, GSAP для анимаций. Деплой — Docker или статика на CDN.',
  },
  {
    re: /\bai\b|rag|llm|agent|ml|ии|нейро|агент/i,
    en: "That's where I'm heading: AI agents, RAG systems and the interfaces around them. This chat is the first step — the full version will answer from my CV and case studies.",
    ru: 'Именно туда я и иду: AI-агенты, RAG-системы и интерфейсы вокруг них. Этот чат — первый шаг: полная версия будет отвечать по моему резюме и кейсам.',
  },
  {
    re: /hire|available|job|work|vacan|contact|работ|ваканс|ищешь|связ/i,
    en: 'Open to frontend roles, ideally on AI-product teams. The fastest way to reach me is the Mail icon in the dock.',
    ru: 'Открыта к фронтенд-позициям, в идеале в командах AI-продуктов. Быстрее всего — через иконку почты в доке.',
  },
  {
    re: /design|figma|ux|дизайн/i,
    en: 'I design in Figma and build what I design, so nothing gets lost in handoff.',
    ru: 'Проектирую в Figma и сама же верстаю — ничего не теряется при передаче макета.',
  },
  {
    re: /education|hse|study|universit|учеб|образован|вшэ/i,
    en: "HSE Graduate School of Business (Business Management) with CS minors in programming and ML. Now doing a master's.",
    ru: 'Высшая школа бизнеса ВШЭ (менеджмент) с майнорами ФКН по программированию и ML. Сейчас — магистратура.',
  },
];

const FALLBACK = {
  en: 'The demo only knows about my stack, projects, AI direction, design and availability. The full version will answer anything from my CV.',
  ru: 'Демо знает только про стек, проекты, AI, дизайн и поиск работы. Полная версия ответит на любой вопрос по резюме.',
};

export const answerLocally: Answerer = async (question, locale) => {
  const hit = KB.find(({ re }) => re.test(question));
  return (hit ?? FALLBACK)[locale];
};
