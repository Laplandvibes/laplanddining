import type { Restaurant } from '../data/restaurants';
import { useLocale } from '../i18n/useLocale';
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
  const { locale } = useLocale();

  // Suomenkielinen kävijä saa ravintolan suomenkielisen listan; kaikki muut
  // englanninkielisen jos sellainen on. Yksikään näistä ravintoloista ei julkaise
  // saksaksi tai japaniksi, joten englanti on paras saatavilla oleva muille.
  //
  // Vesa 2026-08-10: 25/42 linkistä vei suomenkieliselle sivulle, vaikka 15:llä
  // oli englanninkielinen vastine. Englanninkielinen ETUSIVU ei kelpaa
  // vastineeksi — se toistaisi juuri sen vian jota tämä nappi korjaa.
  const useEn = locale !== 'fi' && Boolean(restaurant.menuUrlEn);
  const url = useEn ? restaurant.menuUrlEn : restaurant.menuUrl;
  const kind = useEn ? restaurant.menuKindEn : restaurant.menuKind;

  if (!url) return null;
  return (
    <a
      href={withReferral(url, campaign)}
      target="_blank"
      rel="nofollow noopener"
      className="inline-flex items-center gap-1 text-amber-deep hover:text-spice text-xs font-bold uppercase tracking-wider transition-colors no-underline"
    >
      {kind === 'pdf' ? labelPdf : label} →
    </a>
  );
}
