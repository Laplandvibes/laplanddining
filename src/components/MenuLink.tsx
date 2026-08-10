import type { Restaurant } from '../data/restaurants';
import { withReferral } from '../lib/outbound';

interface Props {
  restaurant: Restaurant;
  /** Lokalisoitu "Ruokalista". Nuoli tulee tästä komponentista, ei käännöksestä. */
  label: string;
  /** Lokalisoitu "Ruokalista (PDF)". PDF käyttäytyy mobiilissa eri tavalla. */
  labelPdf: string;
  /** utm_campaign, esim. 'dining_menu_restaurants'. */
  campaign: string;
}

/**
 * Linkki ravintolan omaan ruokalistaan.
 *
 * Ei renderöi mitään jos linkkiä ei ole, jottei korttiin jää kuollutta nappia:
 * 42/87 ravintolalla on ruokalista, lopuilla rekisterissä on kirjattu syy.
 *
 * Nämä eivät ole affiliate-linkkejä: ei rel="sponsored" eikä reititystä
 * go.laplandvibes.com-Workerin kautta. `withReferral` lisää vain UTM-parametrit,
 * jotta kumppani näkee mistä kävijä tuli.
 */
export default function MenuLink({ restaurant, label, labelPdf, campaign }: Props) {
  if (!restaurant.menuUrl) return null;
  return (
    <a
      href={withReferral(restaurant.menuUrl, campaign)}
      target="_blank"
      rel="nofollow noopener"
      className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
    >
      {restaurant.menuKind === 'pdf' ? labelPdf : label} →
    </a>
  );
}
