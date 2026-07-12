import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { useLocale } from '../i18n/useLocale';

/**
 * LaplandVibes affiliate CTA. All affiliate clicks are funnelled through
 * https://go.laplandvibes.com — the Cloudflare Worker handles CJ tracking,
 * GYG partner_id injection, and per-domain Website ID attribution.
 *
 * Synced 2026-05-03 from laplandbars-new/src/components/AffiliateCTA.tsx
 * (which mirrors the canonical laplandvibes/src/components/AffiliateCTA.tsx).
 *
 * NOTE: GetYourGuide deep-links should NOT use partner='activities' — the
 * worker collapses GYG slugs to the homepage. Use lib/gyg.ts gygDeepLink()
 * for direct GYG product links instead. See bug_go_lv_worker_gyg_dropped.md.
 */

export type AffiliatePartner =
  | 'hotels'
  | 'hotels-seasonal'
  | 'hotels-budget'
  | 'cars'
  | 'activities';

export interface AffiliateCTAProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> {
  partner: AffiliatePartner;
  /** Placement tag, e.g. 'hero_cta', 'inline_paragraph', 'restaurant_card_rovaniemi'. a-z, 0-9, underscore. Max 50 chars. */
  sid: string;
  /**
   * For hotels/cars: search query passed as `?ss=...` (or partner-specific param).
   * For activities: GYG slug appended to the path (e.g. 'rovaniemi-l2653').
   */
  destination?: string;
  /** Extra query params (checkin, pickup_date, currency, …). Merged after sid + ss. */
  query?: Record<string, string>;
  children: ReactNode;
}

const REDIRECT_HOST = 'https://go.laplandvibes.com';

type _Lang = "en" | "fi" | "de" | "ja" | "es" | "pt-BR" | "zh-CN" | "ko" | "fr" | "it" | "nl";
const HOTELS_LOCALE: Record<_Lang, string> = {
  en: "en_US",
  fi: "fi_FI",
  de: "de_DE",
  ja: "ja_JP",
  es: "es_ES",
  "pt-BR": "pt_BR",
  "zh-CN": "zh_CN",
  ko: "ko_KR",
  fr: "fr_FR",
  it: "it_IT",
  nl: "nl_NL",
};
const CARS_LANG: Record<_Lang, string> = {
  en: "en",
  fi: "fi",
  de: "de",
  ja: "ja",
  es: "es",
  "pt-BR": "pt",
  "zh-CN": "zh",
  ko: "ko",
  fr: "fr",
  it: "it",
  nl: "nl",
};
const GYG_DOMAIN: Record<_Lang, string> = {
  en: "https://www.getyourguide.com",
  fi: "https://www.getyourguide.com",
  de: "https://www.getyourguide.de",
  ja: "https://www.getyourguide.com",
  es: "https://www.getyourguide.es",
  "pt-BR": "https://www.getyourguide.com.br",
  "zh-CN": "https://www.getyourguide.com",
  ko: "https://www.getyourguide.com",
  fr: "https://www.getyourguide.fr",
  it: "https://www.getyourguide.it",
  nl: "https://www.getyourguide.nl",
};

const GYG_PARTNER_ID = 'VRMKD7N';
const SITE_ID = 'laplanddining';

export function buildAffiliateHref({
  partner,
  sid,
  destination,
  query,
  lang = "en",
}: Pick<AffiliateCTAProps, 'partner' | 'sid' | 'destination' | 'query'> & { lang?: _Lang }): string {
  if (partner === 'activities') {
    const path = (destination ?? '').replace(/^\/+/, '').replace(/\/+$/, '');
    const url = new URL(path ? `${GYG_DOMAIN[lang]}/${path}/` : `${GYG_DOMAIN[lang]}/`);
    url.searchParams.set('partner_id', GYG_PARTNER_ID);
    url.searchParams.set('cmp', `lv_${SITE_ID}_${sid}`);
    if (query) for (const [k, v] of Object.entries(query)) if (v) url.searchParams.set(k, v);
    return url.toString();
  }
  const params = new URLSearchParams({ sid, ...(query || {}) });
  if (destination) params.set('ss', anchorHotelsSs(partner, destination));
  if (partner === "hotels" || partner === "hotels-seasonal" || partner === "hotels-budget") {
    params.set("locale", HOTELS_LOCALE[lang]);
  } else if (partner === "cars") {
    params.set("lang", CARS_LANG[lang]);
  }
  return `${REDIRECT_HOST}/go/${partner}?${params.toString()}`;
}

export default function AffiliateCTA({
  partner,
  sid,
  destination,
  query,
  children,
  ...rest
}: AffiliateCTAProps) {
  const { locale: lang } = useLocale();
  return (
    <a
      {...rest}
      href={buildAffiliateHref({ partner, sid, destination, query, lang })}
      target="_blank"
      rel="sponsored nofollow noopener"
    >
      {children}
    </a>
  );
}

/**
 * Anchor any hotels search to Finnish Lapland. A bare "Lapland"/"Levi"/etc.
 * makes Hotels.com geocode to *Lapland, Indiana, USA* — a real revenue/trust
 * bug (Vesa 2026-07-08). Force ", Finland" onto every hotels query that does
 * not already name the country; leave cars/activities queries untouched.
 * Callers cannot re-introduce the bug.
 */
function anchorHotelsSs(partner: string, destination: string): string {
  const isHotels = partner === "hotels" || partner === "hotels-seasonal" || partner === "hotels-budget";
  if (!isHotels) return destination;
  return /finland|suomi/i.test(destination) ? destination : `${destination.replace(/[\s,]+$/, "")}, Finland`;
}
