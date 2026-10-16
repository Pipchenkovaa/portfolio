import { projectSchema, type Project } from './schema';

/**
 * Контент проектов. ВРЕМЕННЫЕ данные из прототипа — заменить реальными.
 * Схема проверяется на этапе сборки: опечатка в поле сломает build, а не прод.
 */
const raw = [
  {
    slug: 'travly',
    title: 'Travly',
    year: 2026,
    tagline: {
      en: 'Travel & visa concierge — brand and landing',
      ru: 'Тревел- и визовый консьерж — бренд и лендинг',
    },
    role: { en: 'Design + Frontend', ru: 'Дизайн + фронтенд' },
    stack: ['Next.js', 'TypeScript', 'GSAP', 'Tailwind'],
    problem: {
      en: 'Visa paperwork feels scary; the site had to make it feel calm and premium.',
      ru: 'Оформление визы пугает — сайт должен был сделать процесс спокойным и премиальным.',
    },
    solution: {
      en: 'Scroll-driven storytelling with GSAP, a 3-step application flow and a lead form.',
      ru: 'Сторителлинг на скролле (GSAP), заявка в 3 шага и форма лидов.',
    },
    result: null,
    links: {},
    cover: { from: '#ff7a59', to: '#ffb86b', glyph: 'Tr' },
    desktop: { x: 14, y: 20 },
    placeholder: true,
  },
  {
    slug: 'my-fume',
    title: 'My Fume',
    year: 2026,
    tagline: { en: 'Cigar rating web app', ru: 'Веб-приложение для оценки сигар' },
    role: { en: 'Product design + Frontend', ru: 'Продуктовый дизайн + фронтенд' },
    stack: ['React', 'Effector', 'TypeScript'],
    problem: {
      en: 'Enthusiasts track tasting notes in notebooks and chats.',
      ru: 'Ценители ведут заметки о дегустациях в блокнотах и чатах.',
    },
    solution: {
      en: 'Rating cards, flavor-wheel input and a personal humidor collection.',
      ru: 'Карточки оценок, ввод вкусов через колесо ароматов и личная коллекция-хьюмидор.',
    },
    result: null,
    links: {},
    cover: { from: '#5b3a29', to: '#c8925e', glyph: 'MF' },
    desktop: { x: 26, y: 40 },
    placeholder: true,
  },
  {
    slug: 'frontier',
    title: 'Frontier',
    year: 2026,
    tagline: {
      en: 'Markowitz portfolio optimizer with efficient frontier',
      ru: 'Оптимизатор портфеля по Марковицу с эффективной границей',
    },
    role: { en: 'Frontend + Data', ru: 'Фронтенд + данные' },
    stack: ['Next.js', 'Python', 'D3'],
    problem: {
      en: 'Retail investors have no intuitive way to see the risk/return trade-off.',
      ru: 'У частного инвестора нет наглядного способа увидеть компромисс риска и доходности.',
    },
    solution: {
      en: 'Interactive efficient frontier: drag a point to get rebalancing suggestions.',
      ru: 'Интерактивная эффективная граница: тянешь точку — получаешь советы по ребалансировке.',
    },
    result: null,
    links: {},
    cover: { from: '#1e3cff', to: '#7ad7ff', glyph: 'σ' },
    desktop: { x: 70, y: 22 },
    placeholder: true,
  },
  {
    slug: 'certforge',
    title: 'CertForge',
    year: 2026,
    tagline: {
      en: 'Bulk certificate generator from a template + CSV',
      ru: 'Массовая генерация сертификатов из шаблона и CSV',
    },
    role: { en: 'Concept + UI', ru: 'Концепция + интерфейс' },
    stack: ['React', 'Canvas', 'Node.js'],
    problem: {
      en: 'Event organisers make hundreds of certificates by hand.',
      ru: 'Организаторы мероприятий делают сотни сертификатов вручную.',
    },
    solution: {
      en: 'Visual template editor, CSV field mapping, one-click PDF batch.',
      ru: 'Визуальный редактор шаблона, сопоставление полей CSV, пакетный PDF в один клик.',
    },
    result: null,
    links: {},
    cover: { from: '#0f9d76', to: '#b6f5c9', glyph: 'CF' },
    desktop: { x: 62, y: 48 },
    placeholder: true,
  },
  {
    slug: '3d-lab',
    title: '3D Lab',
    year: 2025,
    tagline: { en: 'Shader & WebGL experiments', ru: 'Эксперименты с шейдерами и WebGL' },
    role: { en: 'Creative development', ru: 'Креативная разработка' },
    stack: ['Three.js', 'GLSL'],
    problem: { en: 'A playground for motion and 3D ideas.', ru: 'Песочница для идей с движением и 3D.' },
    solution: { en: 'A collection of small interactive scenes.', ru: 'Набор небольших интерактивных сцен.' },
    result: null,
    links: {},
    cover: { from: '#111111', to: '#8a5cff', glyph: '3D' },
    desktop: { x: 40, y: 16 },
    placeholder: true,
  },
  {
    slug: 'business-card-v1',
    title: 'Business card v1',
    year: 2025,
    tagline: { en: 'Previous portfolio — kept for history', ru: 'Прошлое портфолио — оставлено для истории' },
    role: { en: 'Design + Frontend', ru: 'Дизайн + фронтенд' },
    stack: ['React', 'TypeScript', 'Vite'],
    problem: { en: 'A first personal site.', ru: 'Первый личный сайт.' },
    solution: { en: 'Single-page card with motion.', ru: 'Одностраничная визитка с анимацией.' },
    result: null,
    links: { live: 'https://pipchenkovaa.github.io/businessCard/' },
    cover: { from: '#e5e5e5', to: '#9e9e9e', glyph: 'v1' },
    desktop: { x: 18, y: 60 },
    placeholder: false,
  },
] satisfies unknown[];

export const projects: Project[] = raw.map((p) => projectSchema.parse(p));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
