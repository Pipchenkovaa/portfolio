import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/content/projects';
import { isLocale, locales, pick } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { DesktopApp } from '@/features/desktop/DesktopApp';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLocale(locale)) return {};
  return {
    title: p.title,
    description: pick(p.tagline, locale),
    alternates: {
      canonical: `/${locale}/work/${slug}/`,
      languages: { en: `/en/work/${slug}/`, ru: `/ru/work/${slug}/` },
    },
  };
}

export default async function WorkPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !getProject(slug)) notFound();
  return <DesktopApp locale={locale} dict={getDictionary(locale)} initial={{ app: 'project', slug }} />;
}
