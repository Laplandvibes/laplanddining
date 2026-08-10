/**
 * Generoi kuvituskuvat niille ravintoloille joille ei saatu kumppanin omaa kuvaa.
 *
 * Kuva EI väitä esittävänsä kyseistä ravintolaa: kortin kuvakaistan alareunaan
 * renderöityy merkintä "Kuvituskuva" (photoCaption, 12 kieltä). Vesan päätös
 * 2026-08-09: kuvituskuva on parempi kuin tyhjä kortti, kunhan se on merkitty.
 *
 * Vaihtelu: kohtaus, vuodenaika ja kuvakulma kiertävät slugin indeksin mukaan,
 * jotta kaksi korttia ei näytä samalta. Kaupunki menee promptiin mukaan.
 *
 * Malli gpt-image-2 (Vesan ohje 28.7.: halvempi, 1824x1024 riittää 350x200
 * korttikaistalle; gemini 4K = ~68 cr/kuva eli hukkaa tähän).
 *
 * Resumoituva: valmiit ohitetaan, joten keskeytyksen jälkeen aja uudelleen.
 *
 * Aja: node scripts/_gen-illustrations.mjs [--limit N] [--concurrency N]
 */
import { exec as execCb } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const exec = promisify(execCb)
/** gen-ai on Windowsilla .cmd-shim → komento on ajettava kuorella merkkijonona.
 *  Lainausmerkit riisutaan promptista, muuten ne katkaisevat komennon. */
const q = (s) => `"${String(s).replace(/["\\]/g, '').replace(/\r?\n/g, ' ')}"`
const OUT_DIR = 'public/images/restaurants'
const REGISTRY = 'src/data/generated/restaurant-images.json'
const WIDTH = 800
const NEGATIVE = 'text, letters, words, signage, logo, watermark, caption, menu text, brand name, poster'

const args = process.argv.slice(2)
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity
const concurrency = args.includes('--concurrency') ? Number(args[args.indexOf('--concurrency') + 1]) : 3

const SOURCE = args.includes('--source') ? args[args.indexOf('--source') + 1] : 'src/data/generated/restaurants-from-maps.json'
const maps = JSON.parse(fs.readFileSync(SOURCE, 'utf8'))
const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'))
const have = new Set(Object.entries(registry).filter(([, v]) => v.kind === 'partner' || v.kind === 'illustration').map(([s]) => s))

/** Kohtaukset kiertävät, jotta 54 korttia eivät ole toistensa kopioita. */
const SCENES = [
  'a candlelit log-walled dining room at blue hour, snow banked against the window',
  'a plated Arctic main course photographed from above on a dark ceramic plate, linen and cutlery around it',
  'a timber terrace with reindeer hides over the chairs, late summer evening light over pine forest',
  'an open fire inside a traditional Lappish kota hut, cast-iron pan over the flames',
  'a bright modern dining room with floor-to-ceiling windows onto a frozen lake',
  'a rustic wooden table with a shared platter of smoked fish, rye bread and berries',
  'a bar counter with brass taps and warm pendant lights, autumn ruska colours through the window',
  'a snowy exterior at dusk with warm light spilling from the restaurant windows',
  'a chef plating a dish at a pass, shallow depth of field, hands only',
  'a corner table set for two, birch logs stacked by the wall, midnight sun outside',
]

const BY_TYPE = {
  pizza_restaurant: 'a wood-fired pizza just out of the oven on a wooden peel, flour dusted counter',
  coffee_shop: 'a small Nordic café counter with cinnamon buns and filter coffee, morning light',
  fine_dining_restaurant: 'a refined Nordic tasting-menu course, tweezer-plated, dark moody backdrop',
  hamburger_restaurant: 'a smash burger and fries on a metal tray in a casual northern diner',
  fast_food_restaurant: 'a casual counter-service meal on a tray, bright informal interior',
  chinese_restaurant: 'an Asian restaurant interior in a small northern Finnish town, steaming dishes on a round table',
  korean_restaurant: 'Korean dishes with side banchan on a dark table, warm interior lighting',
  gastropub: 'a gastropub interior with beer taps, dark wood and low warm lighting',
  bistro: 'a small bistro dining room, bentwood chairs, evening light',
  family_restaurant: 'a relaxed family dining room with long wooden tables and warm lighting',
  hotel: 'a hotel restaurant dining room with a snowy Lapland view through large windows',
  lodging: 'a lodge dining area with a fireplace and reindeer hides, wilderness outside',
  store: 'a small deli counter with local Lappish produce, warm shop lighting',
}

function buildPrompt(r, i) {
  const scene = BY_TYPE[r.primaryType] || SCENES[i % SCENES.length]
  const season = ['deep winter', 'late winter with long blue shadows', 'summer midnight sun', 'autumn ruska colours'][i % 4]
  return (
    `Photorealistic editorial food-travel photograph in ${r.city}, Finnish Lapland, ${season}. ` +
    `${scene}. Natural light mixed with warm interior lamps, shallow depth of field, ` +
    `authentic and understated — not a stock photo. No people facing the camera, no recognisable faces.`
  )
}

const todo = maps.filter((r) => !have.has(r.slug)).slice(0, limit)
console.log(`Generoidaan ${todo.length} kuvituskuvaa, rinnakkaisuus ${concurrency}, malli gpt-image-2\n`)

let done = 0
let failed = 0
let i = 0

async function worker() {
  while (i < todo.length) {
    const idx = i++
    const r = todo[idx]
    const webp = path.join(OUT_DIR, `${r.slug}.webp`)
    try {
      const cmd =
        `gen-ai image --model gpt-image-2 --prompt ${q(buildPrompt(r, idx))} ` +
        `--aspect-ratio 16:9 --negative-prompt ${q(NEGATIVE)} ` +
        `--save-to-drive --folder laplandvibes --json`
      const { stdout } = await exec(cmd, { maxBuffer: 8 * 1024 * 1024, timeout: 420000 })
      const url = JSON.parse(stdout.slice(stdout.indexOf('{'), stdout.lastIndexOf('}') + 1)).url
      if (!url) throw new Error('ei URLia vastauksessa')

      const res = await fetch(url, { signal: AbortSignal.timeout(60000) })
      if (!res.ok) throw new Error(`lataus HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())

      const base = sharp(buf).resize({ width: WIDTH, withoutEnlargement: true })
      await base.clone().webp({ quality: 82 }).toFile(webp)
      await base.clone().avif({ quality: 55 }).toFile(path.join(OUT_DIR, `${r.slug}.avif`))
      const meta = await sharp(webp).metadata()

      registry[r.slug] = {
        src: `/images/restaurants/${r.slug}.webp`,
        kind: 'illustration',
        model: 'gpt-image-2',
        width: meta.width,
        height: meta.height,
        generatedAt: new Date().toISOString().slice(0, 10),
      }
      fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 1) + '\n')
      done++
      console.log(`✅ ${String(done + failed).padStart(2)}/${todo.length}  ${r.slug.slice(0, 44).padEnd(46)} ${meta.width}x${meta.height}`)
    } catch (e) {
      failed++
      console.log(`❌ ${String(done + failed).padStart(2)}/${todo.length}  ${r.slug.slice(0, 44).padEnd(46)} ${String(e.message).slice(0, 70)}`)
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
console.log(`\nValmis: ${done} generoitu, ${failed} epaonnistui. Rekisteri: ${REGISTRY}`)
