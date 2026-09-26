import { use } from 'react';
import { Link } from 'react-router-dom';
import { useLang, useLocalePath } from '../i18n/useLang';
import { ARTICLES, loadAllTexts, loadUi } from './registry';
import NewsCard from './NewsCard';
import { SITE } from './site';

/**
 * Etusivun nosto "Uusimmat lentouutiset" — kaksi uusinta juttua + linkki osioon.
 * Ladataan laiskasti (Home.tsx: lazy + Suspense varatulla korkeudella), joten
 * etusivun nippu ei kanna uutisosion koodia eikä tekstejä.
 */
export default function LatestNews() {
  const lang = useLang();
  const to = useLocalePath();
  const ui = use(loadUi(lang));
  const texts = use(loadAllTexts(lang));
  const items = ARTICLES.slice(0, 2);
  if (!items.length) return null;
  return (
    <section className="nw-teaser" id="news">
      <div className="wrap">
        <div className="sechead">
          <span className="eyebrow">{ui.section}</span>
          <h2 className="serif">{ui.ui.latest}</h2>
        </div>
        {items.length === 1 ? (
          <NewsCard meta={items[0]} text={texts[items[0].slug]} ui={ui} surface="home" wide level={3} />
        ) : (
          <div className="nw-grid nw-grid-2">
            {items.map((a) => <NewsCard key={a.slug} meta={a} text={texts[a.slug]} ui={ui} surface="home" level={3} />)}
          </div>
        )}
        <p className="nw-more">
          <Link to={to(SITE.path)} className="nw-inlink" data-umami-event="news_open" data-umami-event-surface="home_all">{ui.ui.allNews} →</Link>
        </p>
      </div>
    </section>
  );
}
