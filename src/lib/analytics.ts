// Google Analytics 4 — laplanddining
// Property: G-YBTJJJDJTV

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_ID = 'G-YBTJJJDJTV';

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

// ─── Page view ────────────────────────────────────────────────────────────────

export function trackPageView(path: string, title?: string) {
  gtag('config', GA_ID, {
    page_path: path,
    page_title: title ?? document.title,
  });
}

// ─── Affiliate / booking intent ───────────────────────────────────────────────

export function trackAffiliateClick(partner: string, type: string, url: string) {
  gtag('event', 'affiliate_click', {
    event_category: 'monetisation',
    event_label: partner,
    affiliate_type: type,
    outbound_url: url,
  });
}

export function trackBookingIntent(itemName: string, itemCategory: string) {
  gtag('event', 'booking_intent', {
    event_category: 'conversion',
    event_label: itemName,
    item_category: itemCategory,
  });
}

// ─── Hub navigation (spoke → hub) ─────────────────────────────────────────────

export function trackHubClick(destination: string) {
  gtag('event', 'hub_click', {
    event_category: 'navigation',
    event_label: destination,
  });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export function trackNewsletterSignup(source: string) {
  gtag('event', 'newsletter_signup', {
    event_category: 'engagement',
    event_label: source,
  });
  gtag('event', 'generate_lead', { lead_source: 'newsletter', page_source: source });
}
