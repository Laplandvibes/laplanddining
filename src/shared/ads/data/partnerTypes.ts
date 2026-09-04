// GENEROITU TIEDOSTO — älä muokkaa käsin (scripts/sync_partner_feeds.mjs).

export interface PartnerPick {
  sku: string
  name: string
  /** Shop-language name, present only when the feed speaks a different
   *  language than the shop (Suomikauppa: English feed, Finnish pages). */
  localName?: string
  shelf: string
  category: string
  brand: string
  price: number
  currency: string
  url: string
  image: string
}

export interface PartnerSnapshot {
  _comment: string
  advertiser: string
  programme: { network: string; programId: number; commission: string; cookieDays: number }
  route: string
  fetchedAt: string
  products: PartnerPick[]
}
