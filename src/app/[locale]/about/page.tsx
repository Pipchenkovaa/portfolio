import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { DesktopApp } from '@/features/desktop/DesktopApp';

export const metadata: Metadata = { title: 'about.txt' };

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DesktopApp locale={locale} dict={getDictionary(locale)} initial={{ app: 'about' }} />;
}
