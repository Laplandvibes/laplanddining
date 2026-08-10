/**
 * Hakee ravintoloiden OMAT kuvat niiden omilta sivuilta (og:image) ja kirjoittaa
 * sivuston kuvaparit + rekisterin.
 *
 * Miksi: katalogin 81 kuvaa on tähän asti ladattu Google Place Photos -rajapinnasta
 * ja tallennettu repoon. Places API:n käytännöt kieltävät sisällön tallentamisen
 * (vain place_id saa säilöä) ja vaativat kuvaajan tekijämerkinnän. Kumppanin oma
 * og:image on julkaistavaksi tarkoitettu kuva, ja se on myös laadultaan parempi.
 *
 * Lähde: scripts/_partner-image-coverage.json (aja `_measure-partner-images.mjs` ensin).
 * Portit: HTTP 200 · content-type image/* · sharp jäsentää · leveys >= 400 px.
 * Jos portti pettää, rivi ohitetaan — vanhaa ei korvata rikkinäisellä.
 *
 * Tuotokset:
 *   public/images/restaurants/<slug>.{webp,avif}   (leveys 800)
 *   src/data/generated/restaurant-images.json      (rekisteri: lähde + tekijämerkintä)
 *
 * Aja: node scripts/_fetch-partner-images.mjs
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const COVERAGE = argv.includes('--coverage') ? argv[argv.indexOf('--coverage') + 1] : 'scripts/_partner-image-coverage.json'
const OUT_DIR = 'public/images/restaurants'
const REGISTRY = 'src/data/generated/restaurant-images.json'
const WIDTH = 800
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const cov = JSON.parse(fs.readFileSync(COVERAGE, 'utf8'))
const jobs = cov.rows.filter((r) => r.status === 'OK' && r.imageUrl)
console.log(`Haetaan ${jobs.length} kumppanikuvaa (leveys ${WIDTH}, webp + avif)\n`)

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(path.dirname(REGISTRY), { recursive: true })

const registry = fs.existsSync(REGISTRY) ? JSON.parse(fs.readFileSync(REGISTRY, 'utf8')) : {}
let ok = 0
let failed = 0

for (const j of jobs) {
  try {
    const res = await fetch(j.imageUrl, {
      headers: { 'user-agent': UA, accept: 'image/*,*/*' },
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) throw new Error(`content-type ${ct.slice(0, 30)}`)

    const buf = Buffer.from(await res.arrayBuffer())
    const meta = await sharp(buf).metadata()
    if (!meta.width || meta.width < 400) throw new Error(`liian kapea ${meta.width}px`)

    // Alpha litistetään korttitaustan väriin, muuten avif renderöi mustan.
    const base = sharp(buf)
      .flatten({ background: '#0F172A' })
      .resize({ width: WIDTH, withoutEnlargement: true })
    await base.clone().webp({ quality: 82 }).toFile(path.join(OUT_DIR, `${j.slug}.webp`))
    await base.clone().avif({ quality: 55 }).toFile(path.join(OUT_DIR, `${j.slug}.avif`))
    const out = await sharp(path.join(OUT_DIR, `${j.slug}.webp`)).metadata()

    registry[j.slug] = {
      src: `/images/restaurants/${j.slug}.webp`,
      kind: 'partner',
      credit: new URL(j.finalUrl || j.website).hostname.replace(/^www\./, ''),
      sourceUrl: j.finalUrl || j.website,
      imageUrl: j.imageUrl,
      width: out.width,
      height: out.height,
      fetchedAt: new Date().toISOString().slice(0, 10),
    }
    ok++
    console.log(`✅ ${j.slug.padEnd(42)} ${out.width}x${out.height}  ${registry[j.slug].credit}`)
  } catch (e) {
    failed++
    console.log(`   ${j.slug.padEnd(42)} OHITETTU — ${e.message}`)
  }
}

fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 1) + '\n')
console.log(`\nValmis: ${ok} haettu, ${failed} ohitettu. Rekisteri: ${REGISTRY}`)
