// Готовит обои рабочего стола из исходника: обрезка рамки, AVIF/WebP/JPEG в нескольких ширинах + портретный кроп для телефона.
// Запуск: node scripts/wallpaper.mjs <исходник>
import sharp from 'sharp';

const src = process.argv[2];
if (!src) throw new Error('usage: node scripts/wallpaper.mjs <source image>');
const out = new URL('../public/wallpaper/', import.meta.url).pathname;

const base = sharp(src).removeAlpha();
const { width, height } = await base.metadata();
const inset = 8; // тонкая чёрная рамка по краю исходника
const crop = { left: inset, top: inset, width: width - inset * 2, height: height - inset * 2 };

for (const w of [1280, 1920, 2560, 3200]) {
  const img = sharp(src).removeAlpha().extract(crop).resize({ width: w });
  await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${out}desktop-${w}.avif`);
  await img.clone().webp({ quality: 74 }).toFile(`${out}desktop-${w}.webp`);
  if (w === 1920) await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${out}desktop-${w}.jpg`);
}

// Телефон: портрет 1:2 вокруг лица (лицо ~49% по ширине кадра).
const ch = crop.height;
const cw = Math.round(ch * 0.5);
const cx = Math.round(crop.left + crop.width * 0.49 - cw / 2);
for (const w of [780, 1170]) {
  const img = sharp(src)
    .removeAlpha()
    .extract({ left: cx, top: crop.top, width: cw, height: ch })
    .resize({ width: w });
  await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${out}mobile-${w}.avif`);
  await img.clone().webp({ quality: 74 }).toFile(`${out}mobile-${w}.webp`);
}
console.log('done', { width, height, mobileCrop: { cx, cw, ch } });
