import type { Locale } from './config';

const en = {
  meta: {
    title: 'Alina Pipchenkova — Frontend developer & UI/UX designer',
    description:
      'Frontend developer and UI/UX designer from Moscow. I take products from a blank Figma file to a fast, animated, production-ready interface.',
  },
  menubar: {
    tagline: 'Frontend · UI/UX · AI interfaces',
    search: 'Search',
    recruiter: 'Recruiter mode',
    language: 'Language',
  },
  dock: { projects: 'Projects', ask: 'Ask Alina (AI)', mail: 'Mail', telegram: 'Telegram', github: 'GitHub' },
  window: { close: 'Close', minimize: 'Minimize', zoom: 'Zoom' },
  project: {
    role: 'Role',
    problem: 'Problem',
    solution: 'What I did',
    result: 'Result',
    live: 'Live site',
    code: 'Source code',
    allProjects: 'All projects',
    loopPlaceholder: 'Interface loop goes here',
  },
  cv: {
    back: 'Back to desktop',
    download: 'Download PDF',
    email: 'Email',
    skills: 'Skills',
    projects: 'Projects',
    contacts: 'Contacts',
  },
  resume: { title: 'Resume.pdf — Preview', download: 'Download', open: 'Open in new tab' },
  spotlight: {
    placeholder: 'Search projects, skills, apps…',
    ask: 'Ask AI',
    hidden: 'Hidden app',
    app: 'App',
    file: 'File',
    view: 'View',
  },
  notify: {
    mailCopiedTitle: 'Email copied',
    mailCopiedBody: 'is in your clipboard — paste it if your mail app did not open.',
  },
  ask: {
    title: 'Ask Alina — AI',
    greeting: "Hi! I'm Alina's portfolio assistant. Ask about her projects, stack or what she's looking for.",
    placeholder: 'Ask anything about my work…',
    send: 'Send',
    demoNote:
      'Demo: answers are prepared in advance. The full version will answer from my CV and case studies.',
    suggestions: ["What's your stack?", 'Have you done 3D?', 'Why AI?', 'Are you open to work?'],
  },
  terminal: { title: 'alina — zsh', hint: 'Type help to see commands.' },
  mobileHint: 'Tap an app',
  earlyWorks: 'Early works',
  earlyWorksNote: 'Study and pet projects from 2024 — kept to show the path.',
} as const;

type Shape<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : Shape<T[K]>;
};
export type Dictionary = Shape<typeof en>;

const ru: Dictionary = {
  meta: {
    title: 'Алина Пипченкова — фронтенд-разработчик и UI/UX-дизайнер',
    description:
      'Фронтенд-разработчик и UI/UX-дизайнер из Москвы. Довожу продукт от пустого файла в Figma до быстрого анимированного интерфейса в проде.',
  },
  menubar: {
    tagline: 'Frontend · UI/UX · AI-интерфейсы',
    search: 'Поиск',
    recruiter: 'Режим рекрутера',
    language: 'Язык',
  },
  dock: {
    projects: 'Проекты',
    ask: 'Спросить Алину (AI)',
    mail: 'Почта',
    telegram: 'Telegram',
    github: 'GitHub',
  },
  window: { close: 'Закрыть', minimize: 'Свернуть', zoom: 'Развернуть' },
  project: {
    role: 'Роль',
    problem: 'Задача',
    solution: 'Что я сделала',
    result: 'Результат',
    live: 'Сайт',
    code: 'Исходный код',
    allProjects: 'Все проекты',
    loopPlaceholder: 'Здесь будет видео интерфейса',
  },
  cv: {
    back: 'На рабочий стол',
    download: 'Скачать PDF',
    email: 'Почта',
    skills: 'Навыки',
    projects: 'Проекты',
    contacts: 'Контакты',
  },
  resume: { title: 'Resume.pdf — Просмотр', download: 'Скачать', open: 'Открыть в новой вкладке' },
  spotlight: {
    placeholder: 'Поиск по проектам, навыкам, приложениям…',
    ask: 'Спросить AI',
    hidden: 'Скрытое приложение',
    app: 'Приложение',
    file: 'Файл',
    view: 'Режим',
  },
  notify: {
    mailCopiedTitle: 'Почта скопирована',
    mailCopiedBody: 'в буфере обмена — вставь адрес, если почтовая программа не открылась.',
  },
  ask: {
    title: 'Спросить Алину — AI',
    greeting: 'Привет! Я ассистент портфолио Алины. Спроси про проекты, стек или какую работу она ищет.',
    placeholder: 'Спроси что-нибудь о моей работе…',
    send: 'Отправить',
    demoNote: 'Демо: ответы заготовлены заранее. Полная версия будет отвечать по резюме и кейсам.',
    suggestions: ['Какой у тебя стек?', 'Делала 3D?', 'Почему AI?', 'Ищешь работу?'],
  },
  terminal: { title: 'alina — zsh', hint: 'Введи help, чтобы увидеть команды.' },
  mobileHint: 'Нажми на приложение',
  earlyWorks: 'Ранние работы',
  earlyWorksNote: 'Учебные и пет-проекты 2024 года — оставлены, чтобы был виден путь.',
};

const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
