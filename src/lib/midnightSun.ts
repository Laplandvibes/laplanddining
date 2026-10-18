/**
 * Hotellihaun päivät seuraavalle keskiyön auringon jaksolle (15.–18.6.).
 *
 * 18.10.2026: haku oli kovakoodattu '2026-06-15', joten heinäkuusta lähtien
 * "Etsi kesäkuun yöpaikat" haki jo menneitä öitä. Nyt vuosi vaihtuu itse, kun
 * kuluvan vuoden 15.6. on ohi.
 */
export function midsummerStay(now: Date = new Date()): { checkin: string; checkout: string } {
  const past = now.getMonth() > 5 || (now.getMonth() === 5 && now.getDate() >= 15);
  const y = past ? now.getFullYear() + 1 : now.getFullYear();
  return { checkin: `${y}-06-15`, checkout: `${y}-06-18` };
}
