import PartnerSlot, { type Partner } from '../shared/PartnerSlot';
import { adLocaleEnabled, normalizeAdLocale, type AdLocale } from '../shared/adSlotsCopy';
import { AD_SLOTS } from '../data/partners';

/**
 * Mainosmerkintä (KKV) jokaisella sivuston kielellä. Myyty kumppanikortti näkyy kaikilla 12 kielellä
 * (Partner.i18n kantaa käännökset, kuten HomeAdSlotsin myydyt kortit); vain tyhjä house-ad on fi/en/sv
 * (Vesa 2026-07-13). 23.10.2026: tämä komponentti piilotti myös myydyn kortin 9 kieleltä.
 */
const MARKER: Record<AdLocale, { ad: string; featured: string }> = {
  fi: { ad: 'Mainos', featured: 'Esittelykumppani' },
  en: { ad: 'Advertisement', featured: 'Featured partner' },
  sv: { ad: 'Annons', featured: 'Utvald partner' },
  de: { ad: 'Anzeige', featured: 'Vorgestellter Partner' },
  fr: { ad: 'Publicité', featured: 'Partenaire à la une' },
  it: { ad: 'Pubblicità', featured: 'Partner in evidenza' },
  es: { ad: 'Anuncio', featured: 'Socio destacado' },
  nl: { ad: 'Advertentie', featured: 'Uitgelichte partner' },
  pt: { ad: 'Anúncio', featured: 'Parceiro em destaque' },
  ja: { ad: '広告', featured: '注目のパートナー' },
  ko: { ad: '광고', featured: '추천 파트너' },
  zh: { ad: '广告', featured: '精选合作伙伴' },
}

function featuredCopy(locale: string) {
  return MARKER[normalizeAdLocale(locale)];
}

/**
 * Sellable per-city "featured partner" surface (PARTNERS.cityFeatured[city]). Renders at the top
 * of each city's section on /restaurants and, when sold, on that city's own /city/:slug page
 * (23.10.2026, Visit Inari: the slot was promised on the Inari page). When empty it renders the
 * canonical LIGHT house-ad from shared/PartnerSlot ("Varaa mainospaikka →"). fi/en/sv-gated like
 * every other LV Media house-ad; a SOLD card renders on all 12 locales. Never auto-promotes a real restaurant.
 */
export default function CityFeaturedSlot({ city, slug, partner, locale }: { city: string; slug: string; partner: Partner | null; locale: string }) {
  // Myyty kortti kaikilla 12 kielellä, tyhjä house-ad vain fi/en/sv (Vesa 2026-07-13).
  if (!partner && !adLocaleEnabled(locale)) return null;
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
        {/* Vaalea kortti tummalla sivulla (Vesa 23.10.: tumma tausta "tunkkasen näköinen"). */}
        <PartnerSlot variant="card" layout="wide" partner={partner} locale={locale} surface="light" />
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
