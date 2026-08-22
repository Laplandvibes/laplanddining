/**
 * SubpageAd — alasivun oma kiinteä mainospaikka HETI heron alla.
 *
 * Uusi malli (Vesa 2026-07-12): jokaisella alasivulla on YKSI täysleveä
 * banneri heron alla, joka pysyy sivulla koko sesongin (ei kierrä, ei katoa
 * scrollissa). Myydään sivu kerrallaan, hinta GA4-liikenteen mukaan
 * ("osta Levi-sivu"). Tyhjänä näkyy house-ad VAIN top-liikenteen sivuilla
 * (showHouseAd) — muut alasivut jäävät tyhjiksi ettei 60 katkoviivalaatikkoa
 * roskaa verkostoa.
 */

import PartnerSlot, { type Partner } from './PartnerSlot';
import { adSlotsCopy, adLocaleEnabled } from './adSlotsCopy';

export type SubpageAdProps = {
  partner: Partner | null;
  siteSlug: string;
  /** GA4-tunniste, esim. 'restaurants' tai kohde-slug */
  slotId: string;
  locale?: string;
  surface?: 'dark' | 'light';
  /** Näytä house-ad tyhjänä (vain GA4-top-sivuille) */
  showHouseAd?: boolean;
  className?: string;
};

export default function SubpageAd({ partner, siteSlug, slotId, locale, surface = 'dark', showHouseAd, className }: SubpageAdProps) {
  // Mainospaikat vain fi/en (Vesa 2026-07-13).
  if (!adLocaleEnabled(locale)) return null;
  if (partner === null && !showHouseAd) return null;
  const t = adSlotsCopy(locale);
  return (
    <section data-lv-subpage-ad className={['px-6 md:px-12 lg:px-20 py-4', className].filter(Boolean).join(' ')}>
      <div className="max-w-6xl mx-auto">
        <PartnerSlot
          variant="banner"
          partner={partner}
          locale={locale}
          surface={surface}
          placeholder={{ siteSlug, slotId, level: 'premium', label: `${t.subpageOpen}` }}
        />
      </div>
    </section>
  );
}
