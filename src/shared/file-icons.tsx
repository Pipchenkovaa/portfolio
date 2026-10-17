/** Векторная иконка-документ для кейсов, у которых ещё нет ни превью, ни своей иконки. */
import { useId } from 'react';

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

