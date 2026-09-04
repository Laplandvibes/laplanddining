/**
 * PremiumSpotGrid — etusivun 6 kohdekohtaista premium-mainospaikkaa.
 *
 * LV Media -tuotekartan TASO 2 (display 149–590 €/kk): jokainen paikka on
 * sidottu yhteen pääkohteeseen ("osta Levin premium-paikka LaplandStaysilla").
 * Oletuskohteet: Rovaniemi, Levi, Ylläs, Saariselkä, Kittilä, Inari — mutta
 * jaottelu mukautuu sivun luonteeseen (laplandflights = lentokentät jne.),
 * määrä pysyy kuudessa.
 *
 * Tilat per solu:
 *   partner asetettu → kumppanikortti (nimi + tagline + kohde-chip + badge,
 *                      KSL-badge pakollinen maksetussa paikassa)
 *   partner null     → hillitty house-ad ("Mainospaikka vapaana" + Varaa →)
 *                      joka linkittää LV Media -portaaliin + GA4-event
 *
 * Mobiili (feedback_mobile_first_speed): 2 saraketta × 3 riviä kompakteja
 * kortteja — koko gridi mahtuu reilusti yhteen 375px-ruutuun, ei tornia.
 * Desktop: 3 × 2.
 */

import type { Partner } from './PartnerSlot';
import { adSlotsCopy, adLocaleEnabled, mediaSiteUrl, fireAdvertiseHereClick } from './adSlotsCopy';

export type PremiumSpot = {
  /** Vakaa avain + GA4-tunniste, esim. 'levi' */
  key: string;
  /** Näkyvä kohdenimi (erisnimi, sama kaikilla kielillä), esim. 'Levi' */
  label: string;
  partner: Partner | null;
};

/** Oletuskohdejako — käytä ellei sivun luonne vaadi muuta (flights: kentät). */
export const DEFAULT_PREMIUM_SPOTS: PremiumSpot[] = [
  { key: 'rovaniemi', label: 'Rovaniemi', partner: null },
  { key: 'levi', label: 'Levi', partner: null },
  { key: 'yllas', label: 'Ylläs', partner: null },
  { key: 'saariselka', label: 'Saariselkä', partner: null },
  { key: 'kittila', label: 'Kittilä', partner: null },
  { key: 'inari', label: 'Inari', partner: null },
];

export type PremiumSpotGridProps = {
  spots: PremiumSpot[];
  /** LV Median sivuslug (lv_sites.slug) house-ad-linkkejä varten */
  siteSlug: string;
  locale?: string;
  surface?: 'dark' | 'light';
  className?: string;
};

export default function PremiumSpotGrid({ spots, siteSlug, locale, surface = 'dark', className }: PremiumSpotGridProps) {
  // Mainospaikat vain fi/en (Vesa 2026-07-13).
  if (!adLocaleEnabled(locale)) return null;
  // 🔴 Vesa 2026-09-04: six dashed "Mainospaikka vapaana" tiles on twelve
  // listing pages, none sold, is not inventory on display — it is a page that
  // looks unfinished. The grid renders only once at least one spot is sold;
  // a sold spot still shows its unsold neighbours as open, so the upsell is
  // intact where there is a buyer to see it.
  if (!spots.some((s) => s.partner)) return null;

  const t = adSlotsCopy(locale);
  const light = surface === 'light';

  return (
    <div
      data-premium-spot-grid
      className={['grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4', className].filter(Boolean).join(' ')}
    >
      {spots.map((spot) => {
        const chip = (
          <span
            className={[
              'text-[10px] font-semibold uppercase tracking-widest truncate',
              spot.partner
                ? (light ? 'text-[#0891B2]' : 'text-[#22D3EE]')
                : light
                  ? 'text-gray-500'
                  : 'text-[#F9FAFB]/45',
            ].join(' ')}
          >
            {spot.label}
          </span>
        );

        if (spot.partner) {
          const p = spot.partner;
          return (
            <a
              key={spot.key}
              data-partner-slot="premium-spot"
              href={p.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              className={[
                'group relative flex flex-col gap-1 rounded-xl border p-3.5 sm:p-4 min-h-[6.25rem]',
                'transition-colors duration-300',
                light
                  ? 'border-black/10 bg-black/[0.03] hover:border-[#EC4899]/40'
                  : 'border-white/12 bg-white/5 hover:border-[#EC4899]/40',
              ].join(' ')}
              aria-label={`${t.badge}: ${p.name}: ${spot.label}`}
            >
              <div className="flex items-center justify-between gap-2">
                {chip}
                <span className="shrink-0 inline-flex items-center rounded-full bg-[#EC4899]/90 px-1.5 py-px text-[9px] font-semibold uppercase tracking-widest text-white shadow-sm">
                  {p.badgeLabel || t.badge}
                </span>
              </div>
              <p
                className={[
                  'font-heading text-base sm:text-lg tracking-wide leading-tight truncate transition-colors',
                  light ? 'text-gray-900 group-hover:text-[#EC4899]' : 'text-[#F9FAFB] group-hover:text-[#EC4899]',
                ].join(' ')}
              >
                {p.name}
              </p>
              {p.tagline && (
                <p
                  className={[
                    'text-xs leading-snug overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]',
                    light ? 'text-gray-600' : 'text-[#F9FAFB]/60',
                  ].join(' ')}
                >
                  {p.tagline}
                </p>
              )}
            </a>
          );
        }

        // Tyhjä paikka → hillitty house-ad
        return (
          <a
            key={spot.key}
            data-partner-slot="premium-spot-open"
            href={mediaSiteUrl(siteSlug, locale)}
            onClick={() => fireAdvertiseHereClick(siteSlug, `spot_${spot.key}`)}
            className={[
              'group relative flex flex-col justify-between gap-2 rounded-xl border border-dashed p-3.5 sm:p-4 min-h-[6.25rem]',
              'transition-colors duration-300',
              light
                ? 'border-black/15 hover:border-[#EC4899]/40'
                : 'border-white/15 hover:border-[#EC4899]/40',
            ].join(' ')}
            aria-label={`${t.premiumOpen}: ${spot.label}`}
          >
            <div className="flex items-center justify-between gap-2">
              {chip}
              <span
                aria-hidden="true"
                className={['inline-block w-1.5 h-1.5 rounded-full', light ? 'bg-black/20' : 'bg-white/25'].join(' ')}
              />
            </div>
            <div className="flex items-end justify-between gap-2">
              <span className={['text-xs leading-snug', light ? 'text-gray-500' : 'text-[#F9FAFB]/50'].join(' ')}>
                {t.premiumOpen}
              </span>
              <span className="shrink-0 text-xs font-semibold text-[#EC4899] group-hover:translate-x-0.5 transition-transform duration-200">
                {t.bookShort}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
