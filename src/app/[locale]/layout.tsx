import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../globals.css';
import { profile } from '@/content/profile';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: d.meta.title, template: `%s — ${profile.name[locale]}` },
    description: d.meta.description,
    alternates: { languages: { en: '/en/', ru: '/ru/' } },
    openGraph: {
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      siteName: profile.name[locale],
    },
    icons: { icon: '/favicon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: '#f4f2ee',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// До первой отрисовки ставим обои по времени суток посетителя — без мигания.
const todScript = `(function(){var h=new Date().getHours();document.documentElement.dataset.tod=h>=6&&h<11?'morning':h>=11&&h<18?'day':h>=18&&h<22?'evening':'night'})()`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: todScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
