import { UtensilsCrossed } from 'lucide-react';
import type { CSSProperties } from 'react';

// Sanamerkin leveys 1 px:n fontilla (Bebas Neue + tracking-wide). Puhelin- ja tablettinavissa koko lasketaan
// tästä ja vapaasta tilasta (index.css LV-NAV-SANAMERKKI): 24 px (tabletilla 30 px), pienempi vain kun ei mahdu.
const WM_STYLE = { '--lv-wm-k': 6.6, '--lv-wm-max-md': '30px' } as CSSProperties;

/**
 * LaplandDining logo — LV canonical hashtag pattern with the site's warm
 * amber identity preserved on the brand word. Per CLAUDE.md hard rule:
 *   <span text-vibe-pink>#</span><span text-snow>LAPLAND</span><span amber>DINING</span>
 *
 * The dining-fork glyph stays as a small leading mark — keeps the food-niche
 * recognisability while the wordmark itself follows the network template.
 */
export default function Logo({
  className = '',
  showIcon = true,
  nav = false,
}: {
  className?: string;
  showIcon?: boolean;
  /** Navin sanamerkki: koko puhelin- ja tablettinavissa vapaan tilan mukaan (index.css LV-NAV-SANAMERKKI). */
  nav?: boolean;
}) {
  return (
    <span
      className={`font-heading tracking-wide select-none inline-flex items-center gap-2 ${nav ? ' lv-wm max-xl:gap-[0.33em]' : ''} ${className}`}
      data-lv-sanamerkki={nav ? '' : undefined}
      style={nav ? WM_STYLE : undefined}
    >
      {/* Navissa alle xl:n kuvake ja väli em-yksiköissä: koko sanamerkki skaalautuu samassa suhteessa (k sisältää ne). */}
      {showIcon && <UtensilsCrossed size={18} className={`text-amber shrink-0 ${nav ? ' max-xl:w-[0.75em] max-xl:h-[0.75em]' : ''}`} />}
      <span>
        <span className="text-vibe-pink">#</span>
        <span className="text-snow">LAPLAND</span>
        <span className="text-amber">DINING</span>
      </span>
    </span>
  );
}
