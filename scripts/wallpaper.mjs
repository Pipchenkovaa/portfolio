// Готовит обои рабочего стола из исходника: обрезка рамки, AVIF/WebP/JPEG в нескольких ширинах + портретный кроп для телефона.
// Запуск: node scripts/wallpaper.mjs <исходник>
import sharp from 'sharp';

const src = process.argv[2];
if (!src) throw new Error('usage: node scripts/wallpaper.mjs <source image>');
const out = new URL('../public/wallpaper/', import.meta.url).pathname;

const base = sharp(src).removeAlpha();
const { width, height } = await base.metadata();
// Без рамки; снизу у исходника шов склейки — срезаем полосу.
const bottomCut = Number(process.env.BOTTOM_CUT ?? 36);
const crop = { left: 0, top: 0, width, height: height - bottomCut };

for (const w of [1280, 1600, 2048]) {
  const img = sharp(src).removeAlpha().extract(crop).resize({ width: w });
  await img.clone().avif({ quality: 52, effort: 6 }).toFile(`${out}desktop-${w}.avif`);
  await img.clone().webp({ quality: 74 }).toFile(`${out}desktop-${w}.webp`);
  if (w === 1600) await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${out}desktop-${w}.jpg`);
}

// Телефон. Исходник горизонтальный: простой портретный кроп даёт лицо на весь экран.
// Поэтому берём кадр пошире (лицо смещено вправо) и надстраиваем сверху «стену» из фактуры левого края
// с мягким переходом — лицо уходит в нижнюю правую часть, сетка иконок лежит на чистой стене.
const FACE_X = Number(process.env.FACE_X ?? 0.45); // центр лица в исходнике, доля ширины
const FACE_IN_CROP = Number(process.env.FACE_IN_CROP ?? 0.62); // где лицо окажется по ширине экрана
const cw = 900;
const ext = 560; // сколько стены добавить сверху
const blend = 160; // зона перехода
const ch = crop.height;
const cx = Math.max(0, Math.min(width - cw, Math.round(width * FACE_X - cw * FACE_IN_CROP)));
const half = cw / 2;
const patch = await sharp(src).removeAlpha().extract({ left: 0, top: 0, width: half, height: ext + blend }).toBuffer();
const patchFlop = await sharp(patch).flop().toBuffer();
const fade = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ext + blend}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="${ext / (ext + blend)}" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);
const wall = await sharp({ create: { width: cw, height: ext + blend, channels: 3, background: '#e8e4dc' } })
  .composite([
    { input: patch, left: 0, top: 0 },
    { input: patchFlop, left: half, top: 0 },
  ])
  .png()
  .toBuffer();
const wallFaded = await sharp(wall).ensureAlpha().composite([{ input: fade, blend: 'dest-in' }]).png().toBuffer();
const photo = await sharp(src).removeAlpha().extract({ left: cx, top: 0, width: cw, height: ch }).toBuffer();
const tall = await sharp({ create: { width: cw, height: ch + ext, channels: 3, background: '#e8e4dc' } })
  .composite([
    { input: photo, left: 0, top: ext },
    { input: wallFaded, left: 0, top: 0 },
  ])
  .png()
  .toBuffer();
for (const w of [640, 900]) {
  const img = sharp(tall).resize({ width: w });
  await img.clone().avif({ quality: 52, effort: 4 }).toFile(`${out}mobile-${w}.avif`);
  await img.clone().webp({ quality: 74 }).toFile(`${out}mobile-${w}.webp`);
}
console.log('done', { width, height, mobile: { cx, cw, h: ch + ext } });
