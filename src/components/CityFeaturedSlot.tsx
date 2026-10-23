import PartnerSlot, { type Partner } from '../shared/PartnerSlot';
import { adLocaleEnabled } from '../shared/adSlotsCopy';
import { AD_SLOTS } from '../data/partners';

/** fi/en/sv copy for the sellable per-city featured partner slot (KKV: ad-marked). */
function featuredCopy(locale: string) {
  const l = (locale || 'en').toLowerCase();
  if (l.startsWith('fi')) return { ad: 'Mainos', featured: 'Esittelykumppani' };
  if (l.startsWith('sv')) return { ad: 'Annons', featured: 'Utvald partner' };
  return { ad: 'Advertisement', featured: 'Featured partner' };
}

/**
 * Sellable per-city "featured partner" surface (PARTNERS.cityFeatured[city]). Renders at the top
 * of each city's section on /restaurants and, when sold, on that city's own /city/:slug page
 * (23.10.2026, Visit Inari: the slot was promised on the Inari page). When empty it renders the
 * canonical LIGHT house-ad from shared/PartnerSlot ("Varaa mainospaikka →"). fi/en/sv-gated like
 * every other LV Media ad unit. Never auto-promotes a real restaurant.
 */
export default function CityFeaturedSlot({ city, slug, partner, locale }: { city: string; slug: string; partner: Partner | null; locale: string }) {
  if (!adLocaleEnabled(locale)) return null;
  const fc = featuredCopy(locale);
  if (partner) {
    return (
      <div className="mb-8" data-city-featured={slug}>
        <p className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
          <span className="inline-flex items-center rounded-full bg-vibe-pink/90 px-2 py-0.5 text-white">{fc.ad}</span>
          <span>{fc.featured} · {city}</span>
        </p>
        {/* Myyty paikka isona korttina (kuva, kuvaus, CTA, juttulinkki). Banneri näytti maksavasta
            kumppanista vain pikkukuvan ja otsikon (23.10.2026, Visit Inari). Tyhjä pysyy bannerina. */}
        <PartnerSlot variant="card" layout="wide" partner={partner} locale={locale} surface="dark" />
      </div>
    );
  }
  return (
    <div className="mb-8" data-city-featured={slug}>
      <PartnerSlot
        variant="banner"
        partner={null}
        locale={locale}
        surface="dark"
        placeholder={{ siteSlug: AD_SLOTS.siteSlug, slotId: `restaurants_featured_${slug}`, level: 'premium', label: `${fc.featured} · ${city}` }}
      />
    </div>
  );
}
