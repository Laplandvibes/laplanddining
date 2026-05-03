import type { Restaurant } from './restaurants';

/**
 * Editorial overrides keyed by Google Place ID. Each override is optional and
 * merged on top of the Maps-sourced data in `generated/restaurants-from-maps.json`.
 *
 * Use this file to:
 *   - Upgrade a restaurant's partnership tier (B2B billing flow)
 *   - Move a topPick to a different restaurant in the same city (editorial choice)
 *   - Add a curated `curatedDescription` written in our voice (vs Google's)
 *   - Surface hand-picked `menuHighlights` (dish + price)
 *   - Tag dietary options + reservation policy
 *
 * The Maps sync NEVER touches this file. Re-running the sync only updates
 * generated/restaurants-from-maps.json.
 */

type Override = Partial<Pick<Restaurant,
  | 'topPick'
  | 'partnership'
  | 'curatedDescription'
  | 'highlights'
  | 'cuisine'
  | 'type'
  | 'menuHighlights'
  | 'dietary'
  | 'reservationPolicy'
>>;

export const restaurantOverrides: Record<string, Override> = {
  // Nili Restaurant — Rovaniemi (Place ID: ChIJvySHpvNLK0QRY-dnGYTVum4)
  'ChIJvySHpvNLK0QRY-dnGYTVum4': {
    cuisine: 'Traditional Lappish — reindeer, salmon, game, cloudberry',
    type: 'Fine Dining / Traditional Lappish',
    curatedDescription:
      "Step inside a wilderness cabin in the heart of Rovaniemi. Nili has been serving authentic Lappish flavours for over two decades — sautéed reindeer, Arctic char, and cloudberry desserts. The four-course surprise menu is the best way to experience it all.",
    highlights: ['Sautéed reindeer', 'Surprise menu', 'Wilderness cabin interior'],
  },
};
