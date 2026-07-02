// Throwaway: download Google Drive images, optimize to webp in public/images/drive/
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT = join(process.cwd(), 'public', 'images', 'drive');

// key -> Drive FILE_ID  (key = images.ts key, also used for inline heroFoodStory)
const MAP = {
  heroInterior: '1p7HW7MOdgCXMtGRBu4rCHAUw8yrsqJHa',
  fineDining: '1GbpqKdolAHM5X9uZjb01wYahIuerNEn1',
  foodCloseup: '14UtGzLhuG_G209L7GwrlkF_-4TXN6bCh',
  foodMoody: '1a5Niot9yqwdfV8TkQS5T6B49a1mI7Ppu',
  kotaInside: '1gSVqhh-1kHs_CqPDMiGw9duHbSiBrr9l',
  kotaFire: '1HU36180AmZukxByMRoDJsyaXM7VOp4rg',
  ingredients: '1GrxCvJywO8CGLuy9SMh-exaxBn90UiaX',
  ingredientsAlt: '1fcernJ22p498YS_hsL5Esn3PnodE_pSy',
  exterior: '16vrw8ikETu3OV4ip3h9VJiZPSNLSROyC',
  exteriorAlt: '1OGNik9xgwza369dt4vj1wXJLO7RJydC2',
  auroraRestaurant: '1TTHcB3fLeWd8I9KjE9taSDowlx9I4wa0',
  snowVillage: '1fSRRrPhEQNNyIf1J9OU0zWI7fyo043ha',
  rovaniemiCenter: '1OjgcY72TVOViQrD-jHyglEWzqXZKTVPo',
  iceRestaurant: '1NhJ-hWbzMmRBjbcZwtu_6IRmFVGaodRk',
  featKingCrab: '1m1QSTYfLT1gMr97ez3ZplUHhcAt71ZJ_',
  featNili: '1mc_01jQCQ7hJbStxkUtsoZcb1pdz_Sl3',
  featKammi: '1xr4R0otuvZeanmkeM4khjg8BGpbEWkie',
  featAanaar: '1NdW7-plcsGKiq1wV_fN2-wXMsf_eBCjK',
  featGustav: '1wLZPpjp6P6Qej20VE3PpDDnOgCh-qKh6',
  featStarArctic: '1PWojTdyDH6I9_XomAj0wWDRmwRYdRGIn',
  featSnowRestaurant: '1G4qbCyJhcSj5Y5QE6Ear-Y0PFsqCjeU9',
  heroFoodStory: '12JaYlv_GRvbFwyN95-n0lJdQMK7mCMWS',
  heroLocalFood: '1fS_a6LtyfWGoUkr4UB6u74mAzIGK9-lb',
};

await mkdir(OUT, { recursive: true });

const failures = [];
let okCount = 0;
let totalBytes = 0;

for (const [key, id] of Object.entries(MAP)) {
  const url = `https://lh3.googleusercontent.com/d/${id}=w1600-rw`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      failures.push(`${key} (${id}): HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) {
      failures.push(`${key} (${id}): too small (${buf.length}b)`);
      continue;
    }
    const isHero = key.startsWith('hero');
    const maxW = isHero ? 1600 : 1100;
    const quality = isHero ? 80 : 76;
    const out = await sharp(buf)
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();
    const dest = join(OUT, `${key}.webp`);
    await writeFile(dest, out);
    const sz = (await stat(dest)).size;
    totalBytes += sz;
    okCount++;
    console.log(`OK ${key}.webp  ${(sz / 1024).toFixed(0)}KB`);
  } catch (e) {
    failures.push(`${key} (${id}): ${e.message}`);
  }
}

console.log('---');
console.log(`Localized: ${okCount}/${Object.keys(MAP).length}`);
console.log(`Total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
if (failures.length) {
  console.log('FAILURES:');
  for (const f of failures) console.log('  ' + f);
}
