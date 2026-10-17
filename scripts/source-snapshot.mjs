// Снимок исходников для окна VS Code («Исходник этого сайта»): подсветка shiki на этапе сборки,
// по файлу на запрос — окно грузит только то, что открыли. Выход: public/source/ (в git не хранится).
// Запускается автоматически перед dev и build.
import { codeToHtml } from 'shiki';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = new URL('../', import.meta.url).pathname;
const out = `${root}public/source/`;

/** Что показываем: файлы, по которым видно, как устроен сайт. note — подсказка в проводнике. */
const FILES = [
  { path: 'src/features/windows/Window.tsx', note: { ru: 'Окно: перетаскивание, ресайз, анимация из иконки', en: 'Window: drag, resize, open-from-icon animation' } },
  { path: 'src/features/windows/logic.ts', note: { ru: 'Чистая логика оконного менеджера (покрыта тестами)', en: 'Pure window-manager logic (unit-tested)' } },
  { path: 'src/features/windows/model.ts', note: { ru: 'Effector-модель и синхронизация с URL', en: 'Effector model and URL sync' } },
  { path: 'src/features/windows/logic.test.ts', note: { ru: 'Юнит-тесты оконного менеджера', en: 'Window-manager unit tests' } },
  { path: 'src/features/desktop/DesktopIcons.tsx', note: { ru: 'Иконки: выделение рамкой и групповое перетаскивание', en: 'Icons: marquee select and group drag' } },
  { path: 'src/features/desktop/IosFolder.tsx', note: { ru: 'Папка в стиле iOS на телефоне', en: 'iOS-style folder on phones' } },
  { path: 'src/features/desktop/Dock.tsx', note: { ru: 'Док', en: 'Dock' } },
  { path: 'src/features/apps/CodeView.tsx', note: { ru: 'Это окно', en: 'This window' } },
  { path: 'src/content/schema.ts', note: { ru: 'Схема контента кейсов (zod)', en: 'Case content schema (zod)' } },
  { path: 'src/app/globals.css', note: { ru: 'Стили: Liquid Glass, окна, док', en: 'Styles: Liquid Glass, windows, dock' } },
  { path: 'scripts/wallpaper.mjs', note: { ru: 'Обои: кроп и форматы под экраны', en: 'Wallpaper: crops and formats' } },
  { path: 'e2e/desktop.spec.ts', note: { ru: 'E2E-тесты Playwright', en: 'Playwright e2e tests' } },
  { path: 'next.config.ts', note: { ru: 'Статический экспорт Next.js', en: 'Next.js static export' } },
];

const LANG = { ts: 'ts', tsx: 'tsx', css: 'css', mjs: 'js', js: 'js' };

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let commit = null;
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
} catch {
  /* сборка вне git — без хеша */
}

const index = [];
for (const f of FILES) {
  const code = readFileSync(`${root}${f.path}`, 'utf8').replace(/\s+$/, '');
  const ext = f.path.split('.').pop();
  const lang = LANG[ext] ?? 'text';
  const html = await codeToHtml(code, { lang, theme: 'light-plus' });
  const id = f.path.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  writeFileSync(`${out}${id}.html`, html);
  index.push({ id, path: f.path, lang, lines: code.split('\n').length, note: f.note });
}
writeFileSync(`${out}index.json`, JSON.stringify({ commit, files: index }));
console.log(`source snapshot: ${index.length} files${commit ? ` @ ${commit}` : ''}`);
