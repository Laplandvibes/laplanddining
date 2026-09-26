import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useLocalePath } from '../i18n/useLang';
import type { NewsBlock, NewsMeta } from './types';
import { renderEmbed } from './site';

/**
 * Jutun runko lohkoista. Ei HTML:ää eikä markdownia tekstin sisällä: teksti renderöidään
 * sellaisenaan, joten kielitiedosto ei voi rikkoa sivua eikä tuoda skriptiä.
 * Väliotsikot Bebas Neuella (≥ 28 px), pienet otsikot DM Sansilla (CLAUDE.md, flights).
 */
export default function Prose({ blocks, meta }: { blocks: NewsBlock[]; meta: NewsMeta }) {
  const to = useLocalePath();
  return (
    <div className="nw-prose">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return <p key={i}>{b.text}</p>;
          case 'h2':
            return <h2 key={i} className="serif">{b.text}</h2>;
          case 'ul':
            return <ul key={i}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
          case 'note':
            return <p key={i} className="nw-note">{b.text}</p>;
          case 'link':
            return (
              <p key={i} className="nw-linkp">
                {b.text}{' '}
                <Link to={to(b.href)} className="nw-inlink">{b.label} →</Link>
              </p>
            );
          case 'embed':
            return <Fragment key={i}>{renderEmbed(b, meta)}</Fragment>;
          default:
            return null;
        }
      })}
    </div>
  );
}
