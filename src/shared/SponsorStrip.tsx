/**
 * SponsorStrip — pääkumppanin ohut "Presented by" -nauha navigaation alla.
 *
 * Uusi mainosmalli (Vesa 2026-07-12): pääkumppani EI ole iso banneri vaan
 * ohut nauha (~36 px) JOKA SIVULLA — sivuston näkyvin tuote (1 990–4 900 €/
 * sesonki), mobiilissa täysin samanarvoinen kuin desktopissa. Kaupanpäällisenä
 * pääkumppani saa hubin vasemman sivurailin (oikea raili = LV:n omat
 * affiliate-nostot).
 *
 * Tilat:
 *   partner asetettu → nauha joka sivulla (mount App-tasolla navin alle)
 *   partner null     → EI nauhaa alasivuilla; etusivulla voi näyttää
 *                      house-tilan (showHouseAd) joka myy paikkaa portaaliin
 *
 * KSL: maksetussa tilassa Kumppani-badge on nauhan sisällä.
 */

import type { Partner } from './PartnerSlot';
import { adSlotsCopy, adLocaleEnabled, mediaSiteUrl, fireAdvertiseHereClick } from './adSlotsCopy';

export type SponsorStripProps = {
  partner: Partner | null;
  /** LV Median sivuslug house-linkkiä varten */
  siteSlug: string;
  locale?: string;
  surface?: 'dark' | 'light';
  /** Näytä "paikka vapaana" -house-tila kun partner === null (vain etusivulle) */
  showHouseAd?: boolean;
  className?: string;
};

export default function SponsorStrip({ partner, siteSlug, locale, surface = 'dark', showHouseAd, className }: SponsorStripProps) {
  // Mainospaikat vain fi/en (Vesa 2026-07-13) — muilla kielillä ei nauhaa lainkaan.
  if (!adLocaleEnabled(locale)) return null;

  const t = adSlotsCopy(locale);
  const light = surface === 'light';

  if (partner === null && !showHouseAd) return null;

  const base = [
    'flex items-center justify-center gap-2.5 px-4 py-1.5 text-[13px] leading-none',
    light ? 'bg-[#EDF2F9] text-gray-700' : 'bg-white/[0.06] text-[#F9FAFB]/80',
    'border-b',
    light ? 'border-black/10' : 'border-white/10',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Myyty: pääkumppanin nauha
  if (partner !== null) {
    return (
      <a
        data-sponsor-strip="partner"
        href={partner.url}
        target="_blank"
        rel="sponsored nofollow noopener"
        className={base + ' hover:opacity-90 transition-opacity'}
        aria-label={`${t.mainPartnerOne}: ${partner.name}`}
      >
        <span className={['text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap', light ? 'text-gray-500' : 'text-[#F9FAFB]/50'].join(' ')}>
          {t.mainPartnerOne}
        </span>
        {partner.imageSrc ? (
          <img src={partner.imageSrc} alt={partner.name} className="h-4 w-auto" />
        ) : (
          <span className="font-semibold whitespace-nowrap">{partner.name}</span>
        )}
        <span className="shrink-0 inline-flex items-center rounded-full bg-[#EC4899]/90 px-1.5 py-px text-[9px] font-semibold uppercase tracking-widest text-white">
          {t.badge}
        </span>
      </a>
    );
  }

  // Vapaa (vain showHouseAd): hillitty myyntinauha → portaali
  return (
    <a
      data-sponsor-strip="house"
      href={mediaSiteUrl(siteSlug, locale)}
      onClick={() => fireAdvertiseHereClick(siteSlug, 'sponsor_strip')}
      className={base + ' hover:opacity-90 transition-opacity'}
      aria-label={t.wantYourAd}
    >
      <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-[#EC4899]/70" />
      <span className={['text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap', light ? 'text-gray-500' : 'text-[#F9FAFB]/50'].join(' ')}>
        {t.mainPartnerOne} · {t.slotOpen}
      </span>
      <span className="text-[#EC4899] text-xs font-semibold whitespace-nowrap">{t.bookShort}</span>
    </a>
  );
}
