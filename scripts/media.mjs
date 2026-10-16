// Готовит скриншоты кейса для сайта: AVIF + WebP в 2 ширинах, hero-кроп 16:7 из первого кадра.
// Запуск: node scripts/media.mjs <slug> [--crop x,y,w,h] <file...> [--crop …] <file...>
// Печатает JSON для поля gallery в src/content/projects.ts.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const [slug, ...rest] = process.argv.slice(2);
let crop = null;
const files = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--crop') {
    const [left, top, width, height] = rest[++i].split(',').map(Number);
    crop = { left, top, width, height };
  } else files.push({ path: rest[i], crop }); // --crop действует на файлы после него
}
if (!slug || !files.length)
  throw new Error('usage: node scripts/media.mjs <slug> [--crop x,y,w,h] <file...>');
const out = new URL(`../public/media/${slug}/`, import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const prepare = async ({ path, crop }) => {
  let img = sharp(path);
  const meta = await img.metadata();
  if (crop) {
    const c = { ...crop, height: Math.min(crop.height, meta.height - crop.top) };
    img = sharp(await img.extract(c).toBuffer());
  }
  // Прозрачный фон макетов из Figma — на цвет окна.
  return sharp(await img.flatten({ background: '#fbfbfa' }).toBuffer());
};

const gallery = [];
for (const [i, file] of files.entries()) {
  const base = await prepare(file);
  const { width, height } = await base.metadata();
  for (const w of [800, 1600]) {
    const r = base.clone().resize({ width: Math.min(w, width) });
    await r
      .clone()
      .avif({ quality: 55, effort: 6 })
      .toFile(`${out}${i + 1}-${w}.avif`);
    await r
      .clone()
      .webp({ quality: 80 })
      .toFile(`${out}${i + 1}-${w}.webp`);
  }
  gallery.push({ src: `/media/${slug}/${i + 1}`, width, height });
  if (i === 0) {
    const hh = Math.round((width * 7) / 16);
    const hero = base
      .clone()
      .extract({ left: 0, top: 0, width, height: Math.min(hh, height) })
      .resize({ width: 1600 });
    await hero.clone().avif({ quality: 55, effort: 6 }).toFile(`${out}hero.avif`);
    await hero.clone().webp({ quality: 80 }).toFile(`${out}hero.webp`);
  }
}
console.log(JSON.stringify(gallery));
