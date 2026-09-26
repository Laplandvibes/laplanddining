import { use } from 'react';
import { Link } from 'react-router-dom';
import { useLang, useLocalePath } from '../i18n/useLang';
import { ARTICLES, loadAllTexts, loadUi } from './registry';
import NewsCard from './NewsCard';
import { NewsChrome, SITE, useNewsHead } from './site';
import type { NewsMeta } from './types';

/**
 * Osion etusivu /news. Vesa 18.9.2026: *"katso että myös itse artikkelit osiosta tulee siisti"*
 * — listauksen pitää näyttää valmiilta jo kahdella jutulla. Asettelu valitaan jutun
 * määrästä, ettei ruudukkoon jää koskaan tyhjää paikkaa:
 *   1 juttu      yksi leveä kortti
 *   2 juttua     kaksi rinnakkain
 *   3+ juttua    uusin leveänä, loput kahteen tai kolmeen sarakkeeseen sen mukaan
 *                kumpi täyttää rivit (jäännös 0 kolmella ⇒ 3, muuten 2)
 */
export function layoutFor(n: number): { featured: boolean; cols: 2 | 3 } {
  if (n <= 1) return { featured: true, cols: 2 };
  if (n === 2) return { featured: false, cols: 2 };
  const rest = n - 1;
  return { featured: true, cols: rest % 3 === 0 ? 3 : 2 };
}

export default function NewsIndex() {
  const lang = useLang();
  const to = useLocalePath();
  const ui = use(loadUi(lang));
  const texts = use(loadAllTexts(lang));
  const { featured, cols } = layoutFor(ARTICLES.length);
  const [first, ...rest] = ARTICLES;
  const listed: NewsMeta[] = featured ? rest : ARTICLES;

  const head = useNewsHead({
    title: ui.index.seoTitle,
    description: ui.index.description,
    path: SITE.path,
    breadcrumbs: [
      { name: ui.ui.home, path: to('/') },
      { name: ui.section, path: to(SITE.path) },
    ],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: ui.index.h1,
      description: ui.index.description,
      url: `${SITE.origin}${to(SITE.path)}/`.replace(/\/+$/, '/'),
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: ARTICLES.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE.origin}${to(`${SITE.path}/${a.slug}`)}/`,
          name: texts[a.slug]?.title,
        })),
      },
    }],
  });

  return (
    <NewsChrome current={SITE.path}>
      {head}
      <header className="nw-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <span><Link to={to('/')}>{ui.ui.home}</Link></span>
            <span><span className="sep" aria-hidden="true">›</span><span aria-current="page">{ui.section}</span></span>
          </nav>
          <span className="eyebrow">{ui.section}</span>
          <h1 className="serif nw-h1">{ui.index.h1}</h1>
          <p className="nw-lead">{ui.index.lead}</p>
        </div>
      </header>

      <section className="nw-listing" aria-label={ui.section}>
        <div className="wrap">
          {featured && first && (
            <NewsCard meta={first} text={texts[first.slug]} ui={ui} surface="index" wide />
          )}
          {listed.length > 0 && (
            <div className={`nw-grid nw-grid-${cols}`}>
              {listed.map((a) => (
                <NewsCard key={a.slug} meta={a} text={texts[a.slug]} ui={ui} surface="index" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="nw-about">
        <div className="wrap nw-about-in">
          <h2 className="nw-about-h">{ui.index.aboutTitle}</h2>
          <p>{ui.index.aboutText}</p>
          <Link to={to('/restaurants')} className="nw-inlink">{ui.index.allRoutes} →</Link>
        </div>
      </section>
    </NewsChrome>
  );
}
