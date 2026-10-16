import type { Project } from '@/content/schema';
import { pick, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/** Содержимое кейса. Без хуков — рендерится и на сервере (SEO, режим рекрутера), и в окне. */
export function ProjectView({
  project: p,
  locale,
  dict,
  headingId,
  level = 2,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  headingId?: string;
  /** Уровень заголовка кейса: 2 — внутри окна на рабочем столе, 1 — отдельная страница. */
  level?: 1 | 2;
}) {
  const t = dict.project;
  const Title = level === 1 ? 'h1' : 'h2';
  const Sub = level === 1 ? 'h2' : 'h3';
  return (
    <article className="prose-case">
      <div className="hero" style={{ background: `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` }}>
        {p.cover.loop ? (
          <video
            src={p.cover.loop}
            poster={p.cover.hero && `${p.cover.hero}.webp`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : p.cover.hero ? (
          <picture>
            <source type="image/avif" srcSet={`${p.cover.hero}.avif`} />
            { }
            <img src={`${p.cover.hero}.webp`} alt="" decoding="async" />
          </picture>
        ) : (
          <span className="hero-note">▶ {t.loopPlaceholder}</span>
        )}
      </div>
      <Title id={headingId} className="case-title">
        {p.title}
      </Title>
      <p style={{ color: 'var(--muted)', margin: '2px 0 12px' }}>
        {pick(p.tagline, locale)} · {p.year}
      </p>
      {p.note && <p className="case-note">{pick(p.note, locale)}</p>}
      <div className="chips">
        {p.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <Sub className="case-sub">{t.role}</Sub>
      <p>{pick(p.role, locale)}</p>
      <Sub className="case-sub">{t.problem}</Sub>
      <p>{pick(p.problem, locale)}</p>
      <Sub className="case-sub">{t.solution}</Sub>
      <p>{pick(p.solution, locale)}</p>
      {p.result ? (
        <>
          <Sub className="case-sub">{t.result}</Sub>
          <p>{pick(p.result, locale)}</p>
        </>
      ) : process.env.NODE_ENV !== 'production' ? (
        <>
          <Sub className="case-sub">{t.result}</Sub>
          <p>
            <span className="draft">TODO: result / metric</span>
          </p>
        </>
      ) : null}
      {p.gallery.length > 0 && (
        <>
          <Sub className="case-sub">{t.screens}</Sub>
          <div className="case-gallery">
            {p.gallery.map((g) => (
              <figure key={g.src}>
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${g.src}-800.avif 800w, ${g.src}-1600.avif 1600w`}
                    sizes="(max-width: 820px) 100vw, 780px"
                  />
                  { }
                  <img
                    src={`${g.src}-800.webp`}
                    srcSet={`${g.src}-800.webp 800w, ${g.src}-1600.webp 1600w`}
                    sizes="(max-width: 820px) 100vw, 780px"
                    width={g.width}
                    height={g.height}
                    alt={pick(g.alt, locale)}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <figcaption>{pick(g.alt, locale)}</figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
      {(p.links.live || p.links.code) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          {p.links.live && (
            <a className="btn" href={p.links.live} target="_blank" rel="noopener noreferrer">
              {t.live} ↗
            </a>
          )}
          {p.links.code && (
            <a className="btn btn-ghost" href={p.links.code} target="_blank" rel="noopener noreferrer">
              {t.code}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
