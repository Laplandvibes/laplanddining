import { use } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLang, useLocalePath } from '../i18n/useLang';
import { ARTICLE_BY_SLUG, ARTICLES, loadAllTexts, loadText, loadUi } from './registry';
import { formatDate } from './format';
import Prose from './Prose';
import NewsCard from './NewsCard';
import { NewsAds, NewsChrome, NotFoundPage, SITE, useNewsHead } from './site';
import type { NewsMeta } from './types';

export default function NewsArticle() {
  const { slug = '' } = useParams();
  const meta = ARTICLE_BY_SLUG[slug];
  if (!meta) return <NotFoundPage />;
  return <ArticleView key={meta.slug} meta={meta} />;
}

function ArticleView({ meta }: { meta: NewsMeta }) {
  const lang = useLang();
  const to = useLocalePath();
  const text = use(loadText(meta.slug, lang));
  const ui = use(loadUi(lang));
  const all = use(loadAllTexts(lang));
  const others = ARTICLES.filter((a) => a.slug !== meta.slug).slice(0, 3);
  const path = `${SITE.path}/${meta.slug}`;
  const canonical = `${SITE.origin}${to(path)}/`;
  const image = `${SITE.origin}${meta.hero.src}`;
  const credit = meta.hero.credit;

  const head = useNewsHead({
    title: text.seoTitle ?? text.title,
    description: text.description,
    path,
    image,
    breadcrumbs: [
      { name: ui.ui.home, path: to('/') },
      { name: ui.section, path: to(SITE.path) },
      { name: text.title, path: to(path) },
    ],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: text.title,
      description: text.description,
      image: [image],
      datePublished: meta.date,
      dateModified: meta.updated ?? meta.date,
      author: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
      publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.origin}/favicon.svg` } },
      mainEntityOfPage: canonical,
      citation: meta.sources.map((s) => s.localized?.[lang]?.url ?? s.url),
    }],
  });

  const publishers = [...new Set(meta.sources.map((s) => s.publisher))];

  return (
    <NewsChrome current={path}>
      {head}
      {/* Sama hero kuin laplandflightsissa 23.9.2026 alkaen (Vesa: "uutiset-osion hero-osio on
          ihan kamala"): kuva koko leveydelle, otsikko + ingressi kuvan päällä alareunan
          liukuvärin varassa, kirjoittaja- ja kuvatiedot kuvan alla. Kuvatiedostoa ei rajata —
          16:9-kehys on näyttörajaus ja object-position pitää kohteen kuvassa. */}
      <header className="nw-art">
        <img
          className="nw-art-img"
          src={meta.hero.src}
          srcSet={`${meta.hero.srcSmall} 800w, ${meta.hero.src} 1600w`}
          sizes="100vw"
          width={meta.hero.width}
          height={meta.hero.height}
          alt={text.heroAlt}
          fetchPriority="high"
          decoding="async"
          style={meta.hero.position ? { objectPosition: meta.hero.position } : undefined}
        />
        <div className="nw-art-scrim" aria-hidden="true" />
        <div className="wrap nw-narrow nw-art-body">
          <nav className="crumbs" aria-label="Breadcrumb">
            <span><Link to={to('/')}>{ui.ui.home}</Link></span>
            <span><span className="sep" aria-hidden="true">›</span><Link to={to(SITE.path)}>{ui.section}</Link></span>
          </nav>
          <p className="nw-kicker">
            <span>{ui.section}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={meta.date}>{formatDate(meta.date, lang)}</time>
          </p>
          <h1 className="serif nw-h1">{text.title}</h1>
          <p className="nw-dek">{text.dek}</p>
        </div>
      </header>
      <div className="wrap nw-narrow nw-art-meta">
        <p className="nw-byline">
          <span>{ui.ui.byline}</span>
          <span aria-hidden="true"> · </span>
          <span>{ui.ui.published} <time dateTime={meta.date}>{formatDate(meta.date, lang)}</time></span>
          {meta.updated && (
            <>
              <span aria-hidden="true"> · </span>
              <span>{ui.ui.updated} <time dateTime={meta.updated}>{formatDate(meta.updated, lang)}</time></span>
            </>
          )}
          <span aria-hidden="true"> · </span>
          <span>{ui.ui.sources}: {publishers.join(', ')}</span>
        </p>
        <p className="nw-art-cap">
          {text.heroCaption && <span>{text.heroCaption} </span>}
          <span className="nw-credit">
            {ui.ui.photo}: <a href={credit.sourceUrl} target="_blank" rel="noopener">{credit.author} / {credit.sourceName}</a>,{' '}
            <a href={credit.licenseUrl} target="_blank" rel="noopener license">{credit.license}</a>
          </span>
        </p>
      </div>

      <article className="nw-sheet">
        <Prose blocks={text.body} meta={meta} />
        <section className="nw-sources" aria-labelledby="nw-sources-h">
          <h2 id="nw-sources-h" className="nw-sources-h">{ui.ui.sources}</h2>
          <ol>
            {meta.sources.map((s, i) => {
              const loc = s.localized?.[lang];
              const when = s.date ? formatDate(s.date, lang) : s.read ? `${ui.ui.read} ${formatDate(s.read, lang)}` : '';
              return (
                <li key={i}>
                  <span className="nw-src-pub">{s.publisher}</span>
                  {when && <span className="nw-src-date"> · {when}</span>}
                  <br />
                  <a href={loc?.url ?? s.url} target="_blank" rel="noopener">{loc?.title ?? s.title}</a>
                </li>
              );
            })}
          </ol>
        </section>
      </article>

      {others.length > 0 && (
        <section className="nw-related">
          <div className="wrap">
            <div className="nw-related-head">
              <h2 className="serif">{ui.ui.moreNews}</h2>
              <Link to={to(SITE.path)} className="nw-inlink" data-umami-event="news_open" data-umami-event-surface="related_all">{ui.ui.allNews} →</Link>
            </div>
            {others.length === 1 ? (
              <NewsCard meta={others[0]} text={all[others[0].slug]} ui={ui} surface="related" wide />
            ) : (
              <div className={`nw-grid nw-grid-${others.length === 3 ? 3 : 2}`}>
                {others.map((o) => <NewsCard key={o.slug} meta={o} text={all[o.slug]} ui={ui} surface="related" />)}
              </div>
            )}
          </div>
        </section>
      )}

      <NewsAds meta={meta} />
    </NewsChrome>
  );
}
