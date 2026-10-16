import type { Project } from '@/content/schema';
import { pick, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { LazyLoop } from './LazyLoop';
import { ScreensStrip } from './ScreensStrip';

/** Длинное «что сделала» читается легче списком: делим по предложениям. */
function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-ZА-ЯЁ])/u).filter(Boolean);
}

/** Содержимое кейса. Рендерится и на сервере (SEO, режим рекрутера), и в окне. */
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
  const solution = sentences(pick(p.solution, locale));
  const showResult = p.result || process.env.NODE_ENV !== 'production';

  return (
    <article className="case">
      <div
        className="case-hero"
        style={{ background: `linear-gradient(135deg, ${p.cover.from}, ${p.cover.to})` }}
      >
        {p.cover.loop ? (
          <LazyLoop src={p.cover.loop} poster={p.cover.hero ? `${p.cover.hero}.webp` : ''} label={p.title} />
        ) : p.cover.hero ? (
          <picture>
            <source type="image/avif" srcSet={`${p.cover.hero}.avif`} />
            <img src={`${p.cover.hero}.webp`} alt="" decoding="async" />
          </picture>
        ) : (
          <span className="case-hero-glyph" aria-hidden="true">
            {p.cover.glyph}
          </span>
        )}
      </div>

      <header className="case-head">
        <div>
          <Title id={headingId} className="case-title">
            {p.title}
          </Title>
          <p className="case-tagline">{pick(p.tagline, locale)}</p>
        </div>
        {(p.links.live || p.links.code) && (
          <div className="case-actions">
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
      </header>

      {p.note && <p className="case-note">{pick(p.note, locale)}</p>}

      <dl className="case-facts">
        <div>
          <dt>{t.role}</dt>
          <dd>{pick(p.role, locale)}</dd>
        </div>
        <div>
          <dt>{t.year}</dt>
          <dd>{p.year}</dd>
        </div>
        <div className="wide">
          <dt>{t.stack}</dt>
          <dd className="chips">
            {p.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="case-text">
        <section>
          <Sub className="case-sub">{t.problem}</Sub>
          <p>{pick(p.problem, locale)}</p>
        </section>
        <section className="case-solution">
          <Sub className="case-sub">{t.solution}</Sub>
          {solution.length > 1 ? (
            <ul>
              {solution.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : (
            <p>{solution[0]}</p>
          )}
        </section>
        {showResult && (
          <section>
            <Sub className="case-sub">{t.result}</Sub>
            <p>{p.result ? pick(p.result, locale) : <span className="draft">TODO: result / metric</span>}</p>
          </section>
        )}
      </div>

      {p.gallery.length > 0 && (
        <section className="case-screens">
          <Sub className="case-sub">
            {t.screens} <small>{p.gallery.length}</small>
          </Sub>
          <ScreensStrip shots={p.gallery} locale={locale} dict={dict} />
        </section>
      )}
    </article>
  );
}
