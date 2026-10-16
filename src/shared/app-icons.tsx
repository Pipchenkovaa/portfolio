/**
 * Иконки приложений в духе Liquid Glass (macOS / iOS 26–27): сквиркл с градиентом,
 * стеклянный блик сверху (CSS .app-icon::after) и белый глиф. Глифы нарисованы с нуля.
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

const glyph = { width: '62%', height: '62%' };

export const ProjectsAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(180deg, #ffffff 0%, #e4ebf5 100%)">
    <svg viewBox="0 0 48 48" style={glyph} aria-hidden="true">
      <defs>
        <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cb6ff" />
          <stop offset="1" stopColor="#1f7aff" />
        </linearGradient>
      </defs>
      <path d="M5 13a4 4 0 0 1 4-4h9l4 4h17a4 4 0 0 1 4 4v3H5Z" fill="#3d8ef0" />
      <rect x="5" y="17" width="38" height="23" rx="4" fill="url(#pf)" />
      <rect x="5" y="17" width="38" height="3" rx="1.5" fill="#fff" opacity="0.35" />
    </svg>
  </Squircle>
);

export const AskAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(160deg, #b79bff 0%, #6a5cff 55%, #3f6dff 100%)">
    <svg viewBox="0 0 48 48" style={glyph} aria-hidden="true">
      <path
        d="M24 8c-9.4 0-17 6.1-17 13.7 0 4.2 2.4 8 6.1 10.5L12 39l7.5-3.9c1.4.3 2.9.5 4.5.5 9.4 0 17-6.1 17-13.8S33.4 8 24 8Z"
        fill="#fff"
      />
      <path d="M24 14.5l1.7 4.6 4.6 1.7-4.6 1.7-1.7 4.6-1.7-4.6-4.6-1.7 4.6-1.7Z" fill="#6a5cff" />
      <path d="M31.5 24.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" fill="#6a5cff" opacity="0.7" />
    </svg>
  </Squircle>
);

export const MailAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(180deg, #6fd3ff 0%, #1b8cff 100%)">
    <svg viewBox="0 0 48 48" style={glyph} aria-hidden="true">
      <rect x="6" y="12" width="36" height="25" rx="4" fill="#fff" />
      <path
        d="M7.5 14 24 26.5 40.5 14"
        fill="none"
        stroke="#1b8cff"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  </Squircle>
);

export const TelegramAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(180deg, #45c2f5 0%, #1c93d6 100%)">
    <svg viewBox="0 0 24 24" style={{ width: '56%', height: '56%', marginRight: '6%' }} aria-hidden="true">
      <path
        fill="#fff"
        d="M21.9 4.3 18.7 19.4c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96 9.03-8.16c.39-.35-.09-.54-.6-.2L6.37 13.08l-4.8-1.5c-1.04-.33-1.06-1.04.22-1.54l18.77-7.23c.87-.32 1.63.2 1.34 1.5Z"
      />
    </svg>
  </Squircle>
);

export const GitHubAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(180deg, #3a3d42 0%, #0d1117 100%)">
    <svg viewBox="0 0 24 24" style={{ width: '58%', height: '58%' }} aria-hidden="true">
      <path
        fill="#fff"
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    </svg>
  </Squircle>
);

/** Мобильные «приложения» для about.txt и резюме. */
export const NotesAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(180deg, #ffffff 0%, #f3f1ea 100%)">
    <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <rect x="0" y="0" width="48" height="13" fill="#ffd34d" />
      {[20, 26, 32, 38].map((y) => (
        <rect key={y} x="9" y={y} width="30" height="1.3" fill="#d8d3c4" />
      ))}
    </svg>
  </Squircle>
);

export const ResumeAppIcon = (p: Props) => (
  <Squircle {...p} bg="linear-gradient(180deg, #ff6b5f 0%, #e5332a 100%)">
    <svg viewBox="0 0 48 48" style={glyph} aria-hidden="true">
      <path d="M13 6h15l9 9v25a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" fill="#fff" />
      <path d="M28 6v7a2 2 0 0 0 2 2h7" fill="#ffd7d3" />
      <text
        x="23.5"
        y="33"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="800"
        fill="#e5332a"
        fontFamily="-apple-system, system-ui, sans-serif"
      >
        CV
      </text>
    </svg>
  </Squircle>
);

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
