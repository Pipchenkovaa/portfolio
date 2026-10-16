import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { isLocale, pick } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { CvShell } from '@/features/recruiter/CvShell';

export const metadata: Metadata = { title: 'CV' };

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <CvShell locale={locale} dict={dict} back={{ href: `/${locale}/`, label: dict.cv.back }}>
      <h1 className="text-4xl font-bold tracking-tight">{pick(profile.name, locale)}</h1>
      <p className="mt-1.5 mb-5 text-lg text-black/60">
        {pick(profile.role, locale)} · {pick(profile.location, locale)}
      </p>
      <h2 className="sr-only">{dict.cv.skills}</h2>
      <ul className="chips mb-8">
        {profile.skills.map((s) => (
          <li key={s}>
            <span className="!border-black/10">{s}</span>
          </li>
        ))}
      </ul>
      <h2 className="sr-only">{dict.cv.projects}</h2>
      <ul>
        {projects
          .filter((p) => p.group === 'main')
          .map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${locale}/cv/${p.slug}/`}
                className="group flex items-center gap-4 border-b border-black/5 py-4"
              >
                <span
                  className="size-14 flex-none rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` }}
                />
                <span className="flex-1">
                  <b className="underline decoration-black/20 underline-offset-4 group-hover:decoration-black">
                    {p.title}
                  </b>{' '}
                  — {pick(p.tagline, locale)}
                  <span className="block text-sm text-black/55">
                    {pick(p.role, locale)} · {p.stack.join(', ')}
                  </span>
                </span>
                <span className="text-xl text-black/30" aria-hidden="true">
                  ›
                </span>
              </Link>
            </li>
          ))}
      </ul>
      <h2 id="early-works" className="mt-10 mb-1 text-sm font-semibold tracking-wide text-black/50 uppercase">
        {dict.earlyWorks}
      </h2>
      <p className="mb-2 text-sm text-black/50">{dict.earlyWorksNote}</p>
      <ul className="text-sm">
        {projects
          .filter((p) => p.group === 'early')
          .map((p) => (
            <li key={p.slug} className="flex gap-2 border-b border-black/5 py-2.5">
              <Link
                href={`/${locale}/cv/${p.slug}/`}
                className="font-medium underline decoration-black/20 underline-offset-4"
              >
                {p.title}
              </Link>
              <span className="text-black/55">
                — {pick(p.tagline, locale)} · {p.stack.join(', ')}
              </span>
            </li>
          ))}
      </ul>
    </CvShell>
  );
}
