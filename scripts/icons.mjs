// Иконки дока и рабочего стола из исходников PNG (присылает Алина).
// Иконки приложений обрезаются по телу сквиркла (без встроенной тени и полей) — тень и радиус даёт CSS,
// документы и папки — по видимому контуру. Выход: WebP @1x/@2x/@3x в public/icons.
// Запуск: node scripts/icons.mjs [папка с исходниками=assets-src/icons]
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const dir = process.argv[2] ?? 'assets-src/icons';
const out = new URL('../public/icons/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

/** Границы непрозрачной части (alpha > threshold). */
async function bounds(file, threshold) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] > threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

// kind: app — квадратный сквиркл; doc — документ/папка/объект, сохраняем пропорции по высоте.
const ICONS = [
  { src: 'projects_list.png', name: 'projects', kind: 'app' },
  { src: 'chat.png', name: 'ask', kind: 'app' },
  { src: 'mail.png', name: 'mail', kind: 'app' },
  { src: 'tg.png', name: 'telegram', kind: 'app' },
  { src: 'github.png', name: 'github', kind: 'app' },
  { src: 'vscode.png', name: 'vscode', kind: 'app' },
  { src: 'about_txt.png', name: 'about-txt', kind: 'doc', h: 80 },
  { src: 'pdf.png', name: 'pdf', kind: 'doc', h: 80 },
  { src: 'folder_for_early_proj.png', name: 'folder-early', kind: 'doc', h: 72 },
  { src: 'atlas-ir_1.png', name: 'atlas-ir-1', kind: 'doc', h: 84 },
  { src: 'atlas-ir_2.png', name: 'atlas-ir-2', kind: 'doc', h: 84 },
];

const report = {};
for (const icon of ICONS) {
  const file = `${dir}/${icon.src}`;
  // Для приложений режем по плотной части (тело сквиркла), для документов — по любому видимому пикселю.
  const box = await bounds(file, icon.kind === 'app' ? 120 : 8);
  const base = sharp(file).ensureAlpha().extract(box);
  if (icon.kind === 'app') {
    const side = Math.max(box.width, box.height);
    for (const px of [64, 128, 192]) {
      await base.clone().resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 90, alphaQuality: 100 }).toFile(`${out}${icon.name}-${px}.webp`);
    }
    report[icon.name] = { box, side };
  } else {
    for (const scale of [1, 2, 3]) {
      await base.clone().resize({ height: icon.h * scale })
        .webp({ quality: 90, alphaQuality: 100 }).toFile(`${out}${icon.name}@${scale}x.webp`);
    }
    report[icon.name] = { box, ratio: +(box.width / box.height).toFixed(3) };
  }
}
console.log(report);
