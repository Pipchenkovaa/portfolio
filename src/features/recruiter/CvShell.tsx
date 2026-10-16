import Link from 'next/link';
import type { ReactNode } from 'react';
import { profile } from '@/content/profile';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { MailCopyLink } from './MailCopyLink';

/** Режим рекрутера: обычная быстрая HTML-страница без оконного менеджера. */
export function CvShell({
  locale,
  dict,
  back,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  back: { href: string; label: string };
  children: ReactNode;
}) {
  const other: Locale = locale === 'en' ? 'ru' : 'en';
  return (
    <div className="min-h-dvh bg-[#fafafa] text-[#111]" data-cv>
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href={back.href} className="btn btn-ghost !border-black/10">
            ← {back.label}
          </Link>
          <Link
            href={`/${other}/cv/`}
            hrefLang={other}
            className="text-sm uppercase opacity-60 hover:opacity-100"
          >
            {other}
          </Link>
        </div>
        {children}
        <footer className="mt-12 flex flex-wrap gap-2 border-t border-black/5 pt-6">
          <a className="btn" href={profile.resumePdf} download>
            {dict.cv.download}
          </a>
          <MailCopyLink
            email={profile.email}
            label={dict.cv.email}
            className="btn btn-ghost !border-black/10"
          />
          <a
            className="btn btn-ghost !border-black/10"
            href={profile.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          <a
            className="btn btn-ghost !border-black/10"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}
