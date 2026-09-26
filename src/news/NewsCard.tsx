import { Link } from 'react-router-dom';
import { useLang, useLocalePath } from '../i18n/useLang';
import { formatDate } from './format';
import { SITE } from './site';
import type { NewsMeta, NewsText, NewsUi } from './types';

/**
 * Juttukortti: kuva 16:9, päivä + päälähde, otsikko, ingressi.
 * `wide` = kuva vasemmalla ja teksti oikealla (yksin jäävä kortti ei näytä tyhjältä rivin puolikkaalta).
 * `level` = otsikkotaso sivun rakenteessa (listaussivulla h2, etusivun osiossa h3).
 *
 * Mittaus (06-mittaus): sisäinen linkki, ei lomake ⇒ vain data-umami-event-attribuutti,
 * pinta dataan. Ei JS:ää, ei vaikutusta linkin toimintaan.
 */
export default function NewsCard({ meta, text, ui, surface, wide = false, level = 2 }: {
  meta: NewsMeta; text: NewsText; ui: NewsUi; surface: string; wide?: boolean; level?: 2 | 3;
}) {
  const lang = useLang();
  const to = useLocalePath();
  const href = to(`${SITE.path}/${meta.slug}`);
  const H = level === 2 ? 'h2' : 'h3';
  const track = { 'data-umami-event': 'news_open', 'data-umami-event-surface': surface, 'data-umami-event-slug': meta.slug };
  return (
    <article className={'nw-card' + (wide ? ' nw-card-wide' : '')}>
      <Link to={href} className="nw-card-img" tabIndex={-1} aria-hidden="true" {...track}>
        <img
          src={meta.hero.srcSmall}
          srcSet={`${meta.hero.srcSmall} 800w, ${meta.hero.src} 1600w`}
          sizes={wide ? '(min-width: 900px) 620px, 100vw' : '(min-width: 900px) 540px, 100vw'}
          width={800}
          height={Math.round((800 * meta.hero.height) / meta.hero.width)}
          loading="lazy"
          decoding="async"
          alt=""
          style={meta.hero.position ? { objectPosition: meta.hero.position } : undefined}
        />
      </Link>
      <div className="nw-card-body">
        <p className="nw-card-meta">
          <time dateTime={meta.date}>{formatDate(meta.date, lang)}</time>
          <span aria-hidden="true"> · </span>
          <span>{ui.ui.source}: {meta.sources[0]?.publisher}</span>
        </p>
        <H className="serif nw-card-title"><Link to={href} {...track}>{text.title}</Link></H>
        <p className="nw-card-dek">{text.dek}</p>
        <Link to={href} className="nw-card-more" tabIndex={-1} aria-hidden="true" {...track}>{ui.ui.readMore} →</Link>
      </div>
    </article>
  );
}
