import { projectSchema, type Project } from './schema';

/**
 * Кейсы портфолио. Источник — резюме (Frontend Product / Frontend AI) и репозитории на GitHub.
 * Схема проверяется на этапе сборки: опечатка в поле ломает build, а не прод.
 * Порядок = порядок в режиме рекрутера.
 */
const raw = [
  {
    slug: 'atlas-ir',
    title: 'Atlas IR',
    year: 2025,
    tagline: {
      en: 'IR platform and services marketplace for companies going public',
      ru: 'IR-платформа и маркетплейс услуг для компаний, выходящих на IPO',
    },
    role: {
      en: 'Frontend developer in a team of 8 · Aug 2024 – Dec 2025',
      ru: 'Фронтенд-разработчик в команде из 8 человек · авг 2024 – дек 2025',
    },
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Effector',
      'Patronum',
      'Tailwind',
      'shadcn/ui',
      'Radix UI',
      'GSAP',
    ],
    problem: {
      en: 'A platform that grows screen by screen needs one visual language and a predictable way to build new pages.',
      ru: 'Платформе, которая растёт экран за экраном, нужен единый визуальный язык и предсказуемый способ собирать новые страницы.',
    },
    solution: {
      en: 'Designed the UI kit from scratch and built it in React + TypeScript: 100+ reusable components, shared tokens and typography. One adaptive grid and component behaviour across 7 breakpoints. Client–server layer: REST API contracts and DTOs, typed responses, error and loading states. Also ran the process: task breakdown, release planning, acceptance.',
      ru: 'Спроектировала UI-Kit с нуля и реализовала на React + TypeScript: 100+ переиспользуемых компонентов, единые токены и типографика. Единая адаптивная сетка и поведение компонентов на 7 брейкпоинтах. Клиент-серверный слой: контракты REST API и DTO, типизация ответов, обработка ошибок и состояний загрузки. Вела процесс: декомпозиция задач, планирование релизов, приёмка.',
    },
    result: {
      en: 'New screens are assembled from ready-made blocks. Regression-tested the platform before 3 releases.',
      ru: 'Новые экраны собираются из готовых блоков. Провела регрессионное тестирование перед 3 релизами.',
    },
    links: { live: 'https://atlas-ir.com' },
    cover: { from: '#0b1f4d', to: '#4f7bff', glyph: 'IR' },
    desktop: { x: 12, y: 16 },
  },
  {
    slug: 'brainstorming',
    title: 'Brainstorming',
    year: 2025,
    tagline: {
      en: 'Iterative AI image generation: from an idea to concepts to images',
      ru: 'Итеративная AI-генерация изображений: от идеи к концептам и картинкам',
    },
    role: {
      en: 'Freelance frontend developer · standalone product, planned as part of Atlas IR',
      ru: 'Фронтенд-разработчик, фриланс · отдельный продукт, задуманный как часть Atlas IR',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Cerebras API', 'OpenAI', 'Krea'],
    problem: {
      en: 'Generation takes from seconds to minutes, and people want to launch several runs in a row without losing track of any.',
      ru: 'Генерация идёт от секунд до минут, а человек хочет запустить несколько подряд и не потерять ни одну.',
    },
    solution: {
      en: 'Async integration with the Cerebras API and generative services (Krea, OpenAI, Google). Session logic, a queue of async jobs and a generation state machine: every run shows its own status. Results are cached in IndexedDB so images survive a reload.',
      ru: 'Асинхронная интеграция с Cerebras API и генеративными сервисами (Krea, OpenAI, Google). Логика сессий, очередь асинхронных задач и машина состояний генерации: у каждого запуска свой статус. Результаты кешируются в IndexedDB и переживают перезагрузку.',
    },
    result: null,
    note: {
      en: 'The live demo opens, but generation is off: the product owner has paused the API subscription.',
      ru: 'Живое демо открывается, но генерация выключена: владелец продукта приостановил подписку на API.',
    },
    links: { live: 'https://brainstorming-beryl.vercel.app' },
    cover: { from: '#ff5f6d', to: '#ffc371', glyph: 'Bs' },
    desktop: { x: 72, y: 14 },
  },
  {
    slug: 'sdm-metall-prom',
    title: 'SDM Metall Prom',
    year: 2026,
    tagline: {
      en: 'Corporate website for a steel structures manufacturer',
      ru: 'Корпоративный сайт производителя металлоконструкций',
    },
    role: {
      en: 'Freelance, solo: design, frontend, deployment',
      ru: 'Фриланс, в одиночку: дизайн, фронтенд, деплой',
    },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    problem: {
      en: 'A B2B manufacturer needed a site that proves real experience — real projects, not renders.',
      ru: 'B2B-производителю нужен был сайт, который доказывает реальный опыт — реальные объекты, а не рендеры.',
    },
    solution: {
      en: 'Multi-page site: home, a catalogue of completed projects and a page per project, all generated from one data file. Lead form that delivers to Telegram or email with a mailto fallback. Domain and hosting setup.',
      ru: 'Многостраничный сайт: главная, каталог реализованных объектов и страница каждого проекта — всё собирается из одного файла с данными. Форма заявки с отправкой в Telegram или на почту и запасным mailto. Настройка домена и хостинга.',
    },
    result: {
      en: 'From design to production in 1 month. The second version is in progress.',
      ru: 'От макета до продакшна за 1 месяц. Сейчас развиваю вторую версию.',
    },
    links: { live: 'https://sdm-mp.ru', code: 'https://github.com/Pipchenkovaa/sdm-mp_v2' },
    cover: { from: '#2b2d31', to: '#9aa3ad', glyph: 'SD' },
    desktop: { x: 22, y: 36 },
  },
  {
    slug: 'fsk-lab',
    title: 'FSK LAB',
    year: 2024,
    tagline: { en: '7-page landing with 3D for GK FSK', ru: '7-страничный лендинг с 3D для ГК ФСК' },
    role: { en: 'Frontend intern · Oct 2024 – Jan 2025', ru: 'Фронтенд-стажёр · окт 2024 – янв 2025' },
    stack: ['React', 'TypeScript', 'Three.js', 'React Three Fiber', 'GSAP', 'Storybook', 'Figma'],
    problem: {
      en: 'The FSK LAB landing had to be designed and shipped in one week.',
      ru: 'Лендинг ФСК ЛАБ нужно было спроектировать и выпустить за одну неделю.',
    },
    solution: {
      en: 'Designed the layout and built 7 pages with Three.js / React Three Fiber scenes and GSAP animations. In parallel extended the corporate portal design system with 14 new UI-kit components, documented in Storybook.',
      ru: 'Спроектировала макет и собрала 7 страниц со сценами на Three.js / React Three Fiber и анимациями на GSAP. Параллельно доработала дизайн-систему корпоративного портала: 14 новых компонентов UI-Kit с документацией в Storybook.',
    },
    result: {
      en: 'Shipped in 1 week. The components are used by the GK FSK development team.',
      ru: 'Выпущено за 1 неделю. Компоненты используются отделом разработки ГК ФСК.',
    },
    links: {},
    cover: { from: '#0a0a0a', to: '#e30613', glyph: '3D' },
    desktop: { x: 82, y: 34 },
  },
  {
    slug: 'linkspace',
    title: 'LinkSpace',
    year: 2026,
    tagline: {
      en: 'Personal link library: collections, tags, search',
      ru: 'Личная библиотека ссылок: коллекции, теги, поиск',
    },
    role: {
      en: "Solo full-stack · master's course project",
      ru: 'Full-stack в одиночку · проект магистратуры',
    },
    stack: ['FastAPI', 'Python', 'Next.js', 'TypeScript', 'GitHub Actions', 'Nginx', 'systemd'],
    problem: {
      en: 'Useful links get lost in dozens of open tabs and chats.',
      ru: 'Полезные ссылки теряются в десятках вкладок и чатов.',
    },
    solution: {
      en: 'FastAPI backend and Next.js frontend: collections, tags, favourites, filtered search and duplicate protection. Tests and CI on GitHub Actions. Production setup: Ubuntu, systemd services, Nginx reverse proxy with HTTPS.',
      ru: 'Бэкенд на FastAPI и фронт на Next.js: коллекции, теги, избранное, поиск с фильтрами и защита от дублей. Тесты и CI на GitHub Actions. Прод: Ubuntu, сервисы systemd, Nginx как reverse proxy с HTTPS.',
    },
    result: null,
    links: { code: 'https://github.com/Pipchenkovaa/linkspace' },
    cover: { from: '#00a86b', to: '#b9f6ca', glyph: 'LS' },
    desktop: { x: 10, y: 56 },
  },

  /* ---------- Early works (папка на рабочем столе) ---------- */
  {
    slug: 'parallax',
    title: 'Parallax webpage',
    year: 2024,
    group: 'early',
    tagline: {
      en: 'Parallax page with smooth scroll and depth',
      ru: 'Страница с параллаксом, плавным скроллом и глубиной',
    },
    role: { en: 'Study project', ru: 'Учебный проект' },
    stack: ['JavaScript', 'GSAP', 'SCSS', 'Photoshop'],
    problem: { en: 'Practice scroll-driven motion.', ru: 'Практика анимаций на скролле.' },
    solution: {
      en: 'Multi-layer background cut in Photoshop, smooth scrolling and depth with GSAP, responsive layout.',
      ru: 'Многослойный фон из Photoshop, плавный скролл и глубина на GSAP, адаптивная вёрстка.',
    },
    result: null,
    links: { code: 'https://github.com/Pipchenkovaa/Webpage-With-A-Parallax-Effect' },
    cover: { from: '#1d3b2a', to: '#8fd694', glyph: 'Px' },
    desktop: { x: 0, y: 0 },
  },
  {
    slug: 'vacancies',
    title: 'Vacancies landing',
    year: 2024,
    group: 'early',
    tagline: { en: 'Two-page job listings site', ru: 'Двухстраничный сайт с вакансиями' },
    role: { en: 'Study project', ru: 'Учебный проект' },
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    problem: {
      en: 'Practice component structure in React + TS.',
      ru: 'Практика компонентной структуры на React + TS.',
    },
    solution: {
      en: 'Vacancy list and detail pages driven by typed data.',
      ru: 'Список вакансий и детальные страницы на типизированных данных.',
    },
    result: null,
    links: { code: 'https://github.com/Pipchenkovaa/Vacancies-lending' },
    cover: { from: '#2a2a72', to: '#009ffd', glyph: 'Va' },
    desktop: { x: 0, y: 0 },
  },
  {
    slug: 'webpage-builder',
    title: 'Webpage builder',
    year: 2024,
    group: 'early',
    tagline: {
      en: 'Build text blocks on a page in real time',
      ru: 'Конструктор текстовых блоков в реальном времени',
    },
    role: { en: 'Study project', ru: 'Учебный проект' },
    stack: ['JavaScript', 'Tailwind'],
    problem: { en: 'Practice DOM and classes in vanilla JS.', ru: 'Практика DOM и классов на чистом JS.' },
    solution: {
      en: 'Create blocks and apply custom styles to them on the fly.',
      ru: 'Создание блоков и применение к ним своих стилей на лету.',
    },
    result: null,
    links: { code: 'https://github.com/Pipchenkovaa/Webpage-Builder' },
    cover: { from: '#f7971e', to: '#ffd200', glyph: 'Wb' },
    desktop: { x: 0, y: 0 },
  },
] satisfies unknown[];

export const projects: Project[] = raw.map((p) => projectSchema.parse(p));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
