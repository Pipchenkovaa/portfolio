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
    <div className="cv min-h-dvh bg-[#fafafa] text-[17px] leading-relaxed text-[#111]" data-cv>
      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
        <div className="sticky top-0 z-10 -mx-5 mb-8 flex items-center justify-between bg-[#fafafa]/85 px-5 py-3 backdrop-blur-md">
          <Link href={back.href} className="btn btn-ghost btn-lg">
            ← {back.label}
          </Link>
          <Link
            href={`/${other}/cv/`}
            hrefLang={other}
            className="btn btn-ghost btn-lg uppercase"
          >
            {other}
          </Link>
        </div>
        {children}
        <footer className="mt-14 flex flex-wrap gap-2.5 border-t border-black/10 pt-7">
          <a className="btn btn-lg" href={profile.resumePdf} download>
            {dict.cv.download}
          </a>
          <MailCopyLink
            email={profile.email}
            label={dict.cv.email}
            className="btn btn-ghost btn-lg"
          />
          <a
            className="btn btn-ghost btn-lg"
            href={profile.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
          <a
            className="btn btn-ghost btn-lg"
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
