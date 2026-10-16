import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/content/projects';
import { isLocale, locales, pick } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { ProjectView } from '@/features/apps/ProjectView';
import { CvShell } from '@/features/recruiter/CvShell';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLocale(locale)) return {};
  // Канонический адрес кейса — версия на рабочем столе.
  return {
    title: p.title,
    description: pick(p.tagline, locale),
    alternates: { canonical: `/${locale}/work/${slug}/` },
  };
}

export default async function CvCase({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!isLocale(locale) || !p) notFound();
  const dict = getDictionary(locale);
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length]!;
  const next = projects[(i + 1) % projects.length]!;
  return (
    <CvShell locale={locale} dict={dict} back={{ href: `/${locale}/cv/`, label: dict.project.allProjects }}>
      <div className="cv-case">
        <ProjectView project={p} locale={locale} dict={dict} level={1} />
      </div>
      <nav className="mt-10 flex justify-between gap-4 border-t border-black/10 pt-6 text-lg font-medium text-accent">
        <Link href={`/${locale}/cv/${prev.slug}/`}>← {prev.title}</Link>
        <Link href={`/${locale}/cv/${next.slug}/`}>{next.title} →</Link>
      </nav>
    </CvShell>
  );
}
