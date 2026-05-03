import type { ReactNode, AnchorHTMLAttributes } from 'react';

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

export function buildAffiliateHref({
  partner,
  sid,
  destination,
  query,
}: Pick<AffiliateCTAProps, 'partner' | 'sid' | 'destination' | 'query'>): string {
  const params = new URLSearchParams({ sid, ...(query || {}) });

  if (destination && partner !== 'activities') {
    params.set('ss', destination);
  }

  const pathname =
    partner === 'activities' && destination ? `/go/activities/${destination}` : `/go/${partner}`;

  return `${REDIRECT_HOST}${pathname}?${params.toString()}`;
}

export default function AffiliateCTA({
  partner,
  sid,
  destination,
  query,
  children,
  ...rest
}: AffiliateCTAProps) {
  return (
    <a
      {...rest}
      href={buildAffiliateHref({ partner, sid, destination, query })}
      target="_blank"
      rel="sponsored nofollow noopener"
    >
      {children}
    </a>
  );
}
