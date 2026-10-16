import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { DesktopApp } from '@/features/desktop/DesktopApp';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DesktopApp locale={locale} dict={getDictionary(locale)} />;
}
