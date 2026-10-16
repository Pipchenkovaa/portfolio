import next from 'eslint-config-next/core-web-vitals';
import ts from 'eslint-config-next/typescript';

const config = [
  ...next,
  ...ts,
  // Статический экспорт: картинки заранее готовит scripts/*.mjs (AVIF/WebP, нужные размеры), next/image здесь не работает.
  { rules: { '@next/next/no-img-element': 'off' } },
  { ignores: ['out/**', '.next/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts'] },
];

export default config;
