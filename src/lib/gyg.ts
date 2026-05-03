/**
 * GetYourGuide deep-link helper for laplanddining.com.
 *
 * 2026-05-02: the `go.laplandvibes.com/go/activities/*` Cloudflare Worker
 * collapses every slug to `getyourguide.com/` (homepage). To preserve user
 * intent AND affiliate attribution we build the direct GYG product URL with
 * our `partner_id` baked into the query string. GYG's affiliate system reads
 * `partner_id` from query params — same attribution path, no worker hop.
 *
 * The `cmp` parameter is GYG's analog of our `sid` — it shows up in the
 * GYG partner dashboard so we can see which page/restaurant drove the click.
 *
 * For Hotels.com / EconomyBookings the worker is still the right route
 * because CJ attribution flows through `Referer`, not query string.
 */

const GYG_PARTNER_ID = 'VRMKD7N';
const SITE_TAG = 'laplanddining';

/**
 * Build a deep link to a specific GYG product (food tour, cooking class,
 * brewery tour with food, etc.).
 *
 * @param productPath  Full path component after `getyourguide.com/`.
 *                     Format: `{city-slug}-l{cityId}/{product-slug}-t{productId}`.
 *                     Example: `rovaniemi-l662/lapland-cuisine-cooking-class-t423842`.
 * @param sid          Per-placement campaign tag, e.g. `dining_rovaniemi_food_tours`.
 */
export function gygDeepLink(productPath: string, sid: string): string {
  const path = productPath.replace(/^\/+/, '');
  const url = new URL(`https://www.getyourguide.com/${path}/`);
  url.searchParams.set('partner_id', GYG_PARTNER_ID);
  url.searchParams.set('cmp', `lv_${SITE_TAG}_${sid}`);
  return url.toString();
}

/**
 * Build a deep link to a category-level GYG search page (e.g. all food tours
 * in a city). Useful when we don't want to lock to a single product.
 *
 * @param citySlug   GYG city slug + ID, e.g. `lapland-l662`, `rovaniemi-l2653`.
 * @param category   Category path segment, e.g. `food-tours`, `cooking-classes`,
 *                   `wine-tastings`, `food-and-drink`.
 * @param sid        Per-placement campaign tag.
 */
export function gygCategoryLink(citySlug: string, category: string, sid: string): string {
  const url = new URL(`https://www.getyourguide.com/${citySlug}/${category}/`);
  url.searchParams.set('partner_id', GYG_PARTNER_ID);
  url.searchParams.set('cmp', `lv_${SITE_TAG}_${sid}`);
  return url.toString();
}
