/**
 * Иконки «файлов» рабочего стола в духе macOS: документ с загнутым углом, PDF с превью первой страницы,
 * текстовая папка. Всё — собственная векторная отрисовка, без чужих ассетов.
 */
import { useId } from 'react';

export function TextFileIcon({ size = 64 }: { size?: number }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 80" width={size} height={(size * 80) / 64} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef0f3" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9dde3" />
        </linearGradient>
      </defs>
      <path
        d="M6 2h38l16 16v56a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z"
        fill={`url(#${id}p)`}
        stroke="#c9ced6"
        strokeWidth="1"
      />
      <path d="M44 2v12a4 4 0 0 0 4 4h12" fill={`url(#${id}f)`} stroke="#c9ced6" strokeWidth="1" />
      {[26, 32, 38, 44, 50].map((y, i) => (
        <rect key={y} x="11" y={y} width={i === 4 ? 24 : 40} height="2.2" rx="1.1" fill="#b9bfc8" />
      ))}
      <text
        x="32"
        y="70"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill="#8a919c"
        fontFamily="-apple-system, system-ui, sans-serif"
      >
        TXT
      </text>
    </svg>
  );
}

export function PdfFileIcon({ size = 64, preview }: { size?: number; preview: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 80" width={size} height={(size * 80) / 64} aria-hidden="true">
      <defs>
        <clipPath id={`${id}c`}>
          <path d="M6 2h38l16 16v56a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" />
        </clipPath>
      </defs>
      <path d="M6 2h38l16 16v56a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" fill="#fff" />
      <image
        href={preview}
        x="2"
        y="2"
        width="58"
        height="76"
        preserveAspectRatio="xMidYMin slice"
        clipPath={`url(#${id}c)`}
      />
      <path
        d="M6 2h38l16 16v56a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z"
        fill="none"
        stroke="#c9ced6"
        strokeWidth="1"
      />
      <path d="M44 2v12a4 4 0 0 0 4 4h12Z" fill="#e8ebef" stroke="#c9ced6" strokeWidth="1" />
      <rect x="6" y="60" width="26" height="12" rx="3" fill="#e5332a" />
      <text
        x="19"
        y="69"
        textAnchor="middle"
        fontSize="8"
        fontWeight="800"
        fill="#fff"
        fontFamily="-apple-system, system-ui, sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

/** Документ без превью — для кейсов, у которых ещё нет скриншотов. */
export function GenericFileIcon({
  size = 64,
  from,
  to,
  glyph,
}: {
  size?: number;
  from: string;
  to: string;
  glyph: string;
}) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 80" width={size} height={(size * 80) / 64} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M6 2h38l16 16v56a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z"
        fill="#fff"
        stroke="#c9ced6"
        strokeWidth="1"
      />
      <path d="M44 2v12a4 4 0 0 0 4 4h12" fill="#e8ebef" stroke="#c9ced6" strokeWidth="1" />
      <rect x="12" y="26" width="40" height="40" rx="9" fill={`url(#${id}g)`} />
      <text
        x="32"
        y="52"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="#fff"
        fontFamily="-apple-system, system-ui, sans-serif"
      >
        {glyph}
      </text>
    </svg>
  );
}

/** Папка «чёрный пуховик»: стёганые секции с бликами. */
export function PufferFolderIcon({ size = 76 }: { size?: number }) {
  const id = useId();
  const bands = [30, 42, 54, 66];
  return (
    <svg viewBox="0 0 96 80" width={size} height={(size * 80) / 96} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}back`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a2c" />
          <stop offset="1" stopColor="#0c0c0d" />
        </linearGradient>
        <linearGradient id={`${id}band`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a4e" />
          <stop offset="0.35" stopColor="#1b1b1d" />
          <stop offset="0.8" stopColor="#0a0a0b" />
          <stop offset="1" stopColor="#222225" />
        </linearGradient>
        <radialGradient id={`${id}shine`} cx="0.35" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}front`}>
          <rect x="4" y="24" width="88" height="54" rx="9" />
        </clipPath>
      </defs>
      <path d="M8 10a6 6 0 0 1 6-6h20l7 7h41a6 6 0 0 1 6 6v10H8Z" fill={`url(#${id}back)`} />
      <rect x="12" y="16" width="72" height="14" rx="2" fill="#f4f4f2" />
      <g clipPath={`url(#${id}front)`}>
        <rect x="4" y="24" width="88" height="54" fill="#0b0b0c" />
        {bands.map((y) => (
          <g key={y}>
            <rect x="2" y={y - 6} width="92" height="13" rx="6.5" fill={`url(#${id}band)`} />
            <ellipse cx="34" cy={y - 2.5} rx="22" ry="3.2" fill={`url(#${id}shine)`} />
            <ellipse cx="74" cy={y - 2} rx="12" ry="2.4" fill={`url(#${id}shine)`} opacity="0.6" />
          </g>
        ))}
        <rect x="46.5" y="24" width="1" height="54" fill="#000" opacity="0.6" />
      </g>
      <rect x="4" y="24" width="88" height="54" rx="9" fill="none" stroke="#000" strokeOpacity="0.5" />
    </svg>
  );
}
