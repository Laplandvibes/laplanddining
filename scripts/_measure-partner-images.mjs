/**
 * MITTAUS, EI KIRJOITUS. Selvittaa kuinka moni katalogin ravintola tarjoaa omalla
 * sivullaan kelvollisen kuvan (og:image / twitter:image / JSON-LD image), joka lapaisee
 * samat laatuportit kuin LaplandGiftsin kumppanikuvaputki.
 *
 * Miksi: laplanddining.com nayttaa tallä hetkellä 81 ravintolakuvaa jotka on ladattu
 * Google Place Photos -rajapinnasta ja tallennettu repoon. Places API:n kaytannot
 * kieltavat sisallon tallentamisen (vain place_id saa sailoa) ja vaativat tekijamerkinnan.
 * Kumppanin oma og:image on seka laillinen etta parempi — mutta vasta tama mittaus
 * kertoo kuinka monelle se on saatavilla.
 *
 * Portit (samat kuin _fetch-partner-images.mjs:ssa):
 *   HTTP 200 · content-type: image/* · sharp jasentaa · leveys >= 400 px
 *
 * Aja: node scripts/_measure-partner-images.mjs
 * Kirjoittaa vain raportin: scripts/_partner-image-coverage.json
 */
import sharp from 'sharp'
import fs from 'node:fs'
const argv = process.argv.slice(2)
const SOURCE = argv.includes('--source') ? argv[argv.indexOf('--source') + 1] : 'src/data/generated/restaurants-from-maps.json'
const mapsData = JSON.parse(fs.readFileSync(SOURCE, 'utf8'))

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const MIN_WIDTH = 400
const CONCURRENCY = 6
const TIMEOUT_MS = 20000

function withTimeout(ms) {
  const c = new AbortController()
  const t = setTimeout(() => c.abort(), ms)
  return { signal: c.signal, done: () => clearTimeout(t) }
}

/** Poimi kuvan URL sivun HTML:sta. Jarjestys = laatujarjestys. */
function extractImageUrl(html, baseUrl) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[1]) return { url: new URL(m[1], baseUrl).href, source: 'og:image' }
  }
  // JSON-LD image -kentta viimeisena
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const found = findImage(JSON.parse(m[1]))
      if (found) return { url: new URL(found, baseUrl).href, source: 'json-ld' }
    } catch {
      /* rikkinainen JSON-LD on yleista, ohita */
    }
  }
  return null
}

function findImage(node) {
  if (!node) return null
  if (typeof node === 'string') return null
  if (Array.isArray(node)) {
    for (const n of node) {
      const r = findImage(n)
      if (r) return r
    }
    return null
  }
  if (typeof node === 'object') {
    const img = node.image
    if (typeof img === 'string') return img
    if (Array.isArray(img) && typeof img[0] === 'string') return img[0]
    if (img && typeof img === 'object' && typeof img.url === 'string') return img.url
    for (const v of Object.values(node)) {
      const r = findImage(v)
      if (r) return r
    }
  }
  return null
}

async function check(r) {
  const row = { slug: r.slug, name: r.name, city: r.city, website: r.website || null }
  if (!r.website) {
    row.status = 'ei-verkkosivua'
    return row
  }
  let t = withTimeout(TIMEOUT_MS)
  let html
  try {
    const res = await fetch(r.website, {
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
      redirect: 'follow',
      signal: t.signal,
    })
    if (!res.ok) {
      row.status = `sivu HTTP ${res.status}`
      return row
    }
    row.finalUrl = res.url
    html = await res.text()
  } catch (e) {
    row.status = `sivu ei vastaa (${e.name === 'AbortError' ? 'timeout' : e.message.slice(0, 60)})`
    return row
  } finally {
    t.done()
  }

  const found = extractImageUrl(html, row.finalUrl || r.website)
  if (!found) {
    row.status = 'ei og:image-kuvaa'
    return row
  }
  row.imageUrl = found.url
  row.imageSource = found.source

  t = withTimeout(TIMEOUT_MS)
  try {
    const res = await fetch(found.url, {
      headers: { 'user-agent': UA, accept: 'image/*,*/*' },
      redirect: 'follow',
      signal: t.signal,
    })
    if (!res.ok) {
      row.status = `kuva HTTP ${res.status}`
      return row
    }
    const ct = res.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) {
      row.status = `vaara content-type (${ct.slice(0, 40)})`
      return row
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const meta = await sharp(buf).metadata()
    row.width = meta.width
    row.height = meta.height
    row.bytes = buf.length
    row.status = meta.width >= MIN_WIDTH ? 'OK' : `liian kapea (${meta.width}px)`
  } catch (e) {
    row.status = `kuva ei kelpaa (${e.name === 'AbortError' ? 'timeout' : e.message.slice(0, 60)})`
  } finally {
    t.done()
  }
  return row
}

const list = Array.isArray(mapsData) ? mapsData : mapsData.restaurants
console.log(`Mittaus: ${list.length} ravintolaa, portit: 200 + image/* + sharp + >=${MIN_WIDTH}px\n`)

const rows = []
let i = 0
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (i < list.length) {
      const r = list[i++]
      const row = await check(r)
      rows.push(row)
      const mark = row.status === 'OK' ? '✅' : '  '
      console.log(
        `${mark} ${String(rows.length).padStart(3)}/${list.length}  ${row.name.slice(0, 34).padEnd(34)} ${row.status}${row.width ? ` ${row.width}x${row.height}` : ''}`,
      )
    }
  }),
)

const ok = rows.filter((r) => r.status === 'OK')
const byReason = {}
for (const r of rows) if (r.status !== 'OK') byReason[r.status.replace(/\(.*\)/, '').trim()] = (byReason[r.status.replace(/\(.*\)/, '').trim()] || 0) + 1

console.log('\n' + '='.repeat(60))
console.log(`KELPAA:      ${ok.length}/${rows.length}  (${Math.round((ok.length / rows.length) * 100)} %)`)
console.log('EI KELPAA:')
for (const [reason, n] of Object.entries(byReason).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(n).padStart(3)}  ${reason}`)

fs.writeFileSync(
  argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : 'scripts/_partner-image-coverage.json',
  JSON.stringify({ measuredAt: new Date().toISOString(), total: rows.length, ok: ok.length, rows }, null, 1),
)
console.log('\nRaportti: scripts/_partner-image-coverage.json')
