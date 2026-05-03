#!/usr/bin/env node
// Sync restaurant catalog from Google Places API (New) for 18 Lapland cities.
// Reads GOOGLE_MAPS_API_KEY from .env.local.
// Writes:
//   - data/maps-cache.json  (raw API response, gitignored)
//   - src/data/generated/restaurants-from-maps.json  (committable shaped data)
//   - public/images/restaurants/{slug}.jpg  (top-pick + featured photos, committable)
//
// Cost: ~$0.60 for full run (Text Search × 18 + Place Photos × 30-40). Safe under
// the $200/month Maps free credit.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Load API key from .env.local ─────────────────────────────────────────
async function loadApiKey() {
  try {
    const envText = await fs.readFile(path.join(ROOT, '.env.local'), 'utf-8');
    const m = envText.match(/^GOOGLE_MAPS_API_KEY\s*=\s*(.+?)\s*$/m);
    if (!m) throw new Error('GOOGLE_MAPS_API_KEY not in .env.local');
    return m[1].replace(/^["']|["']$/g, '');
  } catch (e) {
    console.error('Could not load API key:', e.message);
    process.exit(1);
  }
}

// ── 18 Lapland cities to sync ────────────────────────────────────────────
const CITIES = [
  { name: 'Rovaniemi',         country: 'Finland', region: 'Lapland', tier: 1 },
  { name: 'Levi',              country: 'Finland', region: 'Kittilä, Lapland', tier: 1 },
  { name: 'Kittilä',           country: 'Finland', region: 'Lapland', tier: 2 },
  { name: 'Inari',             country: 'Finland', region: 'Lapland', tier: 1 },
  { name: 'Saariselkä',        country: 'Finland', region: 'Inari, Lapland', tier: 1 },
  { name: 'Kemi',              country: 'Finland', region: 'Lapland', tier: 1 },
  { name: 'Ylläs',             country: 'Finland', region: 'Kolari, Lapland', tier: 1 },
  { name: 'Tornio',            country: 'Finland', region: 'Lapland', tier: 2 },
  { name: 'Haparanda',         country: 'Sweden',  region: 'Norrbotten', tier: 2 },
  { name: 'Sodankylä',         country: 'Finland', region: 'Lapland', tier: 2 },
  { name: 'Pyhätunturi',       country: 'Finland', region: 'Pelkosenniemi, Lapland', tier: 2 },
  { name: 'Luosto',            country: 'Finland', region: 'Sodankylä, Lapland', tier: 2 },
  { name: 'Muonio',            country: 'Finland', region: 'Lapland', tier: 2 },
  { name: 'Hetta',             country: 'Finland', region: 'Enontekiö, Lapland', tier: 2 },
  { name: 'Kuusamo',           country: 'Finland', region: 'North Ostrobothnia', tier: 2 },
  { name: 'Kemijärvi',         country: 'Finland', region: 'Lapland', tier: 2 },
  { name: 'Salla',             country: 'Finland', region: 'Lapland', tier: 3 },
  { name: 'Posio',             country: 'Finland', region: 'Lapland', tier: 3 },
];

// Chains / fast food to filter out (case-insensitive name contains)
const CHAIN_BLOCKLIST = [
  'mcdonald', 'hesburger', 'subway', 'burger king', 'kotipizza',
  'kfc', 'taco bell', 'pizza hut', "domino's", 'starbucks',
  'shell ', 'neste ', 'abc ', 'st1 ', 'teboil',
  'r-kioski', 'siwa', 'k-market', 'k-supermarket', 's-market',
  'lidl', 'prisma', 'citymarket', 'alepa', 'sale ',
];

const isChain = (name) => {
  const n = name.toLowerCase();
  return CHAIN_BLOCKLIST.some((b) => n.includes(b));
};

// ── Places API helpers ───────────────────────────────────────────────────
const PLACES_BASE = 'https://places.googleapis.com/v1';

async function textSearch(apiKey, city) {
  const query = `best restaurants in ${city.name}, ${city.region}, ${city.country}`;
  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.rating',
    'places.userRatingCount',
    'places.priceLevel',
    'places.types',
    'places.primaryType',
    'places.websiteUri',
    'places.googleMapsUri',
    'places.regularOpeningHours.weekdayDescriptions',
    'places.photos',
    'places.editorialSummary',
    'places.location',
    'places.shortFormattedAddress',
    'places.businessStatus',
  ].join(',');

  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'en',
      maxResultCount: 10,
      includedType: 'restaurant',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Text Search failed for ${city.name}: ${res.status} ${err.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.places || [];
}

/**
 * Fetch up to 5 most-helpful reviews for a place. We extract 1-2 short, vivid
 * quotes per restaurant so the card has a real human voice even when Google's
 * editorialSummary is empty.
 */
async function placeDetailsReviews(apiKey, placeId) {
  const fieldMask = 'reviews,reviewSummary';
  const res = await fetch(`${PLACES_BASE}/places/${placeId}?languageCode=en`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask,
    },
  });
  if (!res.ok) return { reviews: [], reviewSummary: null };
  const data = await res.json();
  return {
    reviews: data.reviews || [],
    reviewSummary: data.reviewSummary?.text?.text || null,
  };
}

/**
 * Pull a punchy short quote (40–140 chars) from the reviews. Skip ALL-CAPS,
 * skip ones full of emoji, skip generic ("Great food!"), prefer ones that
 * mention a specific dish, ingredient, or atmosphere word.
 */
function pickReviewQuote(reviews) {
  const SPECIFIC_WORDS = [
    'reindeer', 'salmon', 'cloudberry', 'kota', 'fire', 'arctic', 'sami', 'sámi',
    'fish', 'soup', 'menu', 'pizza', 'burger', 'dessert', 'view', 'fell',
    'aurora', 'snow', 'log', 'wooden', 'fireplace', 'tasting', 'wine', 'beer',
    'service', 'staff', 'cosy', 'cozy', 'atmosphere', 'cabin', 'wilderness',
    'lake', 'river', 'igloo', 'sauna', 'lappish', 'finnish', 'nordic',
  ];

  const candidates = (reviews || [])
    .map((r) => (r.text?.text || r.originalText?.text || '').trim())
    .filter((t) => t)
    // Split into individual sentences — quotes are punchier than full reviews
    .flatMap((t) => t.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim().replace(/^["'""'']|["'""'']$/g, '').trim())
    .filter((s) => s.length >= 40 && s.length <= 180)
    .filter((s) => !/^[A-Z\s!.]+$/.test(s)) // no ALL CAPS
    .filter((s) => (s.match(/[\p{Emoji}]/gu) || []).length < 3) // not emoji-heavy
    .filter((s) => !/^(great|good|amazing|nice|excellent|love\s|loved\s|the best|highly recommend)\.?$/i.test(s))
    .filter((s) => s.split(/\s+/).length >= 7); // at least 7 words

  // Score by specific-word matches
  candidates.sort((a, b) => {
    const sa = SPECIFIC_WORDS.reduce((n, w) => n + (a.toLowerCase().includes(w) ? 1 : 0), 0);
    const sb = SPECIFIC_WORDS.reduce((n, w) => n + (b.toLowerCase().includes(w) ? 1 : 0), 0);
    return sb - sa;
  });
  return candidates[0] || null;
}

async function downloadPhoto(apiKey, photoName, outPath, maxW = 1600) {
  // Place Photos API (New): GET /v1/{photoName}/media?...
  // photoName looks like "places/ChIJ.../photos/AeyglH..."
  const url = `${PLACES_BASE}/${photoName}/media?maxWidthPx=${maxW}&key=${apiKey}`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Photo fetch failed: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return buf.length;
}

// ── Scoring ──────────────────────────────────────────────────────────────
function score(p) {
  const rating = p.rating || 0;
  const count = p.userRatingCount || 0;
  if (rating < 4.0 || count < 30) return -1; // disqualified
  // Bayesian-ish: rating × log10(reviews+1)
  return rating * Math.log10(count + 1);
}

function priceLevelToText(pl) {
  // Places API New uses: PRICE_LEVEL_FREE | INEXPENSIVE | MODERATE | EXPENSIVE | VERY_EXPENSIVE
  switch (pl) {
    case 'PRICE_LEVEL_FREE': return '€';
    case 'PRICE_LEVEL_INEXPENSIVE': return '€';
    case 'PRICE_LEVEL_MODERATE': return '€€';
    case 'PRICE_LEVEL_EXPENSIVE': return '€€€';
    case 'PRICE_LEVEL_VERY_EXPENSIVE': return '€€€€';
    default: return undefined;
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Main ─────────────────────────────────────────────────────────────────
async function main() {
  const apiKey = await loadApiKey();
  console.log(`✓ Loaded API key (${apiKey.slice(0, 6)}…${apiKey.slice(-4)})`);

  const cacheDir = path.join(ROOT, 'data');
  await fs.mkdir(cacheDir, { recursive: true });
  const generatedDir = path.join(ROOT, 'src/data/generated');
  await fs.mkdir(generatedDir, { recursive: true });
  const photoDir = path.join(ROOT, 'public/images/restaurants');
  await fs.mkdir(photoDir, { recursive: true });

  const rawByCity = {};
  const shaped = [];
  const seenPlaceIds = new Set(); // dedupe across cities
  let photosFetched = 0;

  for (const city of CITIES) {
    process.stdout.write(`  ${city.name.padEnd(15)} `);
    let places;
    try {
      places = await textSearch(apiKey, city);
    } catch (e) {
      console.log(`✗ ${e.message}`);
      continue;
    }
    rawByCity[city.name] = places;

    // Filter + score + sort, then dedupe (skip restaurants already taken by an earlier city —
    // text search bleeds across municipal boundaries; Levi search returns Kittilä results, etc.)
    const ranked = places
      .filter((p) => p.displayName?.text && !isChain(p.displayName.text))
      .filter((p) => p.types?.includes('restaurant') || p.primaryType === 'restaurant')
      .filter((p) => !seenPlaceIds.has(p.id))
      .map((p) => ({ ...p, _score: score(p) }))
      .filter((p) => p._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 5);

    if (ranked.length === 0) {
      console.log(`✗ no NEW qualifying restaurants`);
      continue;
    }

    console.log(`✓ ${places.length} found, ${ranked.length} qualify (deduped)`);

    for (let i = 0; i < ranked.length; i++) {
      const p = ranked[i];
      seenPlaceIds.add(p.id);
      const isTop = i === 0;
      const restaurantSlug = `${slugify(city.name)}-${slugify(p.displayName.text)}`;
      let photoLocalPath;

      // Top picks get the largest hero crop (1600px), supporting cards get a
      // smaller thumbnail (800px) since they render at smaller sizes.
      if (p.photos?.length) {
        try {
          const out = path.join(photoDir, `${restaurantSlug}.jpg`);
          const targetW = isTop ? 1600 : 800;
          const sz = await downloadPhoto(apiKey, p.photos[0].name, out, targetW);
          photoLocalPath = `/images/restaurants/${restaurantSlug}.jpg`;
          photosFetched++;
          process.stdout.write(`     📸 ${(sz/1024).toFixed(0).padStart(4)} KB  ${isTop ? '★ ' : '  '}${p.displayName.text}\n`);
        } catch (e) {
          process.stdout.write(`     ⚠️  photo fetch failed for ${p.displayName.text}: ${e.message}\n`);
        }
      }

      // Fetch reviews for ALL synced restaurants (top + supporting) — quotes
      // give every card a real human voice when Google has no editorialSummary.
      let reviewQuote = null;
      let reviewSummary = null;
      try {
        const details = await placeDetailsReviews(apiKey, p.id);
        reviewQuote = pickReviewQuote(details.reviews);
        reviewSummary = details.reviewSummary;
      } catch {
        // ignore — quote fallback is optional
      }

      shaped.push({
        name: p.displayName.text,
        city: city.name,
        country: city.country,
        topPick: isTop,
        partnership: 'editorial',
        rating: p.rating,
        reviewCount: p.userRatingCount,
        priceRange: priceLevelToText(p.priceLevel),
        priceLevelRaw: p.priceLevel,
        types: p.types,
        primaryType: p.primaryType,
        editorialSummary: p.editorialSummary?.text,
        reviewSummary,
        reviewQuote,
        website: p.websiteUri,
        googleMapsUrl: p.googleMapsUri,
        googlePlaceId: p.id,
        address: p.formattedAddress,
        shortAddress: p.shortFormattedAddress,
        location: p.location,
        openingHours: p.regularOpeningHours?.weekdayDescriptions,
        photo: photoLocalPath,
        photosAvailable: p.photos?.length || 0,
        slug: restaurantSlug,
        lastVerified: new Date().toISOString().slice(0, 10),
      });
    }

    // Brief pause between cities to be polite to the API
    await new Promise((r) => setTimeout(r, 250));
  }

  // Persist outputs
  await fs.writeFile(
    path.join(cacheDir, 'maps-cache.json'),
    JSON.stringify(rawByCity, null, 2),
  );
  await fs.writeFile(
    path.join(generatedDir, 'restaurants-from-maps.json'),
    JSON.stringify(shaped, null, 2),
  );

  console.log('');
  console.log(`✓ ${shaped.length} restaurants synced across ${Object.keys(rawByCity).length} cities`);
  console.log(`✓ ${shaped.filter((r) => r.topPick).length} top picks (one per city)`);
  console.log(`✓ ${photosFetched} photos downloaded → public/images/restaurants/`);
  console.log(`✓ wrote data/maps-cache.json + src/data/generated/restaurants-from-maps.json`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
