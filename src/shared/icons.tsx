import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const MailIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...p}>
    <rect x="3" y="6" width="18" height="12.5" rx="2" fill="#fff" />
    <path
      d="M3.6 7.2 12 13.4l8.4-6.2"
      fill="none"
      stroke="#1a74f0"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const TelegramIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true" {...p}>
    <path d="M21.9 4.3 18.7 19.4c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96 9.03-8.16c.39-.35-.09-.54-.6-.2L6.37 13.08l-4.8-1.5c-1.04-.33-1.06-1.04.22-1.54l18.77-7.23c.87-.32 1.63.2 1.34 1.5Z" />
  </svg>
);

export const GitHubIcon = (p: P) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export const FolderIcon = (p: P) => (
  <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true" {...p}>
    <path d="M5 12a3 3 0 0 1 3-3h10l4 4h18a3 3 0 0 1 3 3v3H5z" fill="#3d8ef0" />
    <rect x="5" y="16" width="38" height="24" rx="3" fill="#62a8ff" />
  </svg>
);

export const ChatIcon = (p: P) => (
  <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true" {...p}>
    <path
      d="M24 8c-9.4 0-17 6.3-17 14 0 4.3 2.4 8.2 6.1 10.7L12 40l7.6-4.3c1.4.3 2.9.5 4.4.5 9.4 0 17-6.3 17-14S33.4 8 24 8Z"
      fill="#fff"
    />
    <circle cx="17" cy="22" r="2.2" fill="#22b35e" />
    <circle cx="24" cy="22" r="2.2" fill="#22b35e" />
    <circle cx="31" cy="22" r="2.2" fill="#22b35e" />
  </svg>
);

export const CloseGlyph = () => (
  <svg viewBox="0 0 8 8" aria-hidden="true">
    <path d="M1.5 1.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
export const MinGlyph = () => (
  <svg viewBox="0 0 8 8" aria-hidden="true">
    <path d="M1.2 4h5.6" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
export const ZoomGlyph = () => (
  <svg viewBox="0 0 8 8" aria-hidden="true">
    <path d="M2 2h3.2L2 5.2zM6 6H2.8L6 2.8z" fill="currentColor" />
  </svg>
);
