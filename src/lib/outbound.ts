/**
 * outbound.ts — UTM-referral-tagit ulos vieviin yrityslinkkeihin (Vesa 2026-07-24).
 *
 * Jokainen ravintolan/yrityksen OMALLE sivustolle osoittava linkki saa
 * utm_source/medium/campaign-parametrit, jotta kumppani näkee LaplandVibes-
 * referraalit omassa analytiikassaan. Data-tiedostot pysyvät puhtaina
 * kanonisina URL:eina — tagit lisätään vasta renderöinnissä tällä helperillä.
 *
 * EI koske: Google Maps -linkkejä, affiliate-linkkejä (go.laplandvibes.com),
 * GYG-linkkejä eikä verkoston sisäisiä linkkejä.
 */

/**
 * Palauttaa URL:n, johon on lisätty
 * `utm_source=laplandvibes&utm_medium=referral&utm_campaign=<campaign>`.
 * Kunnioittaa olemassa olevaa query-stringiä ja fragmenttia; jos URL on
 * epäkelpo, palauttaa sen sellaisenaan.
 *
 * @param url      Yrityksen kanoninen URL (data-tiedostosta).
 * @param campaign Koko kampanjatunnus, esim. `dining_restaurants`.
 */
export function withReferral(url: string, campaign: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'laplandvibes');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch {
    return url;
  }
}
