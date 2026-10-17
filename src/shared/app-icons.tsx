/**
 * Иконки приложений: растровые (исходники Алины, scripts/icons.mjs) и сквиркл-заглушка
 * для кейсов без своей иконки — градиент с глифом и стеклянным бликом (CSS .app-icon::after).
 */
import type { CSSProperties, ReactNode } from 'react';

type Props = { size?: number; className?: string };

function Squircle({ bg, children, size = 52, className }: Props & { bg: string; children: ReactNode }) {
  return (
    <span
      className={`app-icon ${className ?? ''}`}
      style={{ '--icon-bg': bg, '--icon-size': `${size}px` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** Иконка-приложение кейса для телефона: превью-скриншот в сквиркле или градиент с глифом. */
export function ProjectAppIcon({
  thumb,
  from,
  to,
  glyph: g,
  size = 60,
}: {
  thumb?: string;
  from: string;
  to: string;
  glyph: string;
  size?: number;
}) {
  return (
    <Squircle
      size={size}
      bg={thumb ? `center / cover no-repeat url(${thumb}), #fff` : `linear-gradient(135deg, ${from}, ${to})`}
    >
      {!thumb && <span className="app-icon-glyph">{g}</span>}
    </Squircle>
  );
}

/** Растровая иконка приложения (исходники Алины, scripts/icons.mjs): name → /icons/<name>-64|128|192.webp. */
export function ImageAppIcon({ name, size = 54 }: { name: string; size?: number }) {
  return (
    <img
      className="app-img"
      src={`/icons/${name}-128.webp`}
      srcSet={`/icons/${name}-64.webp 1x, /icons/${name}-128.webp 2x, /icons/${name}-192.webp 3x`}
      width={size}
      height={size}
      alt=""
      draggable={false}
      decoding="async"
    />
  );
}

/** Документ или объект (папка, кубик) по высоте: base → <base>@1x/@2x/@3x.webp. */
export function ImageDocIcon({ base, height }: { base: string; height: number }) {
  return (
    <img
      className="doc-img"
      src={`${base}@2x.webp`}
      srcSet={`${base}@1x.webp 1x, ${base}@2x.webp 2x, ${base}@3x.webp 3x`}
      height={height}
      alt=""
      draggable={false}
      decoding="async"
    />
  );
}

/** На телефоне документ/объект становится «приложением»: светлый сквиркл с картинкой внутри. */
export function DocAppIcon({ base, size = 60 }: { base: string; size?: number }) {
  return (
    <Squircle size={size} bg="linear-gradient(180deg, #ffffff 0%, #eceef2 100%)">
      <img
        src={`${base}@2x.webp`}
        srcSet={`${base}@1x.webp 1x, ${base}@2x.webp 2x, ${base}@3x.webp 3x`}
        alt=""
        draggable={false}
        style={{ position: 'relative', zIndex: 1, height: Math.round(size * 0.74), width: 'auto' }}
      />
    </Squircle>
  );
}
