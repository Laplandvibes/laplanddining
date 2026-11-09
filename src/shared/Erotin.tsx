import { Fragment, type CSSProperties, type ReactNode } from 'react';
import './erotin.css';

/**
 * Rows of short items that used to be joined with " · " (Vesa 9.11.2026, the hub's network card:
 * "tuo piste ihan irallaan ja tuo on jokaisessa näissä cta mainoksessa").
 *
 * CANONICAL in lv-ops shared/ (copied from the hub's src/components/Erotin.tsx, 9.11.2026), vendored byte for byte
 * into every site's src/shared/. The CSS lives next to it in erotin.css and is imported here, so a shared component
 * (Footer, Legal/*) that uses the row does not depend on the site's own index.css.
 *
 * A typed " · " lets the browser break the line wherever there is a space: the dot ends a line, starts one,
 * or sits mid-line with the next phrase cut in two ("OMA HUSKYSAFARISIVUSTO · OSA / #LAPLANDVIBES-VERKOSTOA").
 * Whether a row fits depends on the width AND the language, so "it fits from 640 px" is a guess (it was, on
 * 8.11., and it was wrong). Two shapes instead:
 *
 * - `Erotinrivi` — a LEFT-ALIGNED row. Each item is a flex item, so a line only breaks between items, and the
 *   dot is drawn by CSS (`.lv-erotin` in erotin.css) in the gap before every item but the first. When an item
 *   wraps to the start of a new line, its dot falls outside the row's box and is clipped. The dot shows only
 *   between two items on the same line. Not for centred rows: there the first item on a line is not at the
 *   box edge and its dot would show. For a row centred below 1024 px pass `pino` (stacked there, no dots).
 * - `Pinorivi` — a CENTRED line (eyebrow, kicker, heading). Below `lg` every part is its own line and no dot is
 *   drawn; from `lg` one line with dots. Use only where the one-line form is measured to fit in all locales
 *   (lv-ops `scripts/audit_valipiste.mjs`, gate:valipiste).
 *
 * Splitting happens on " · " only (any whitespace on both sides). ja/zh write their own separators (・、) and come
 * through whole, which is what natiivikäännös rule 19 wants: code never injects Western punctuation into those locales.
 */
// Any whitespace around the dot counts (laplandtours puts a no-break space on each side). A dot with no space on
// either side is part of a name (zh 乌尔霍·凯科宁), and the katakana dot ・ is another character: neither is split.
export const erotinOsat = (text: string): string[] => text.split(/\s+·\s+/).map((s) => s.trim()).filter((s) => s.length > 0);

export function Erotinrivi({ osat, className = '', as: Tag = 'p', pino = false, style }: {
  osat: ReactNode[];
  className?: string;
  as?: 'p' | 'div' | 'span';
  /** Inline style for the row (colour, letter-spacing). Do not set display, flex-wrap, gap or overflow here. */
  style?: CSSProperties;
  /** The row is centred below 1024 px: stack the items there, no dots (`.lv-erotin-pino`). */
  pino?: boolean;
}) {
  // The spaces between the items are not laid out (white space between flex items is dropped), but they keep
  // the words apart in the text a screen reader or a copy-paste gets ("250 arvostelua 5 h", not "arvostelua5 h").
  return (
    <Tag className={`lv-erotin${pino ? ' lv-erotin-pino' : ''} ${className}`.trim()} style={style}>
      {osat.filter((osa) => osa !== null && osa !== undefined && osa !== false && osa !== '').map((osa, k) => (
        <Fragment key={k}>{k > 0 && ' '}<span>{osa}</span></Fragment>
      ))}
    </Tag>
  );
}

export function Pinorivi({ text }: { text: string }) {
  const parts = erotinOsat(text);
  return (
    <>
      {parts.map((part, k) => (
        <span key={k}>
          {k > 0 && <span className="hidden lg:inline" aria-hidden="true"> · </span>}
          <span className="block lg:inline">{part}</span>
        </span>
      ))}
    </>
  );
}
