import type { NextConfig } from 'next';

const config: NextConfig = {
  // Полностью статический сайт: отдаётся с CDN без сервера — быстро и не зависит от блокировок хостинга.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
