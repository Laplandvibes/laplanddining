/**
 * Jutun tietokortit ja pylväät (11.11.2026).
 *
 * Vesa 11.11.2026, opasjutut puhelimella: "paljon päiviä ja numeroita, eikö tuo ole aika sekamelska",
 * "voisi olla oma laatikko, visualisoitu näitä" ja "artikkelikohdassa voisi olla väriä, vähän eloa".
 * Luettelo, jonka jokainen rivi on muotoa "nimi: tieto", ei ole leipätekstiä vaan taulukko, ja se
 * piirretään korttina: nimi omalla rivillään värillä, tieto sen alla.
 *
 * Rungon `{ t: 'embed', id, items }` + meta.jsonin `embeds[id].kind`:
 *   - `facts`  tietokortti "nimi: tieto" -riveistä. Rivi ilman nimeä piirretään sellaisenaan.
 *   - `bars`   sama kortti, ja rivin alle pylväät luvuista. cfg: { unit, max, values: [[a, b] | null, …],
 *              legend: { <kieli>: [nimi, nimi] } }. Luvut ovat samat kuin rivin tekstissä: pylväs
 *              näyttää ne, teksti kertoo ne.
 * Tekstit ovat kielitiedostossa, joten scripts/news-prerender.mjs tarkistaa ne kuten muunkin rungon.
 */
import type { ReactNode } from 'react'
import { useLang } from '../i18n/useLang'
import type { NewsBlock, NewsMeta } from './types'

type EmbedBlock = Extract<NewsBlock, { t: 'embed' }>

/** "Hinta: maksuton." → ["Hinta", "maksuton."]. Latinalainen kaksoispiste vaatii perään välilyönnin
 *  (kellonaika 10:00 ei katkea), CJK:n täysleveä ： ei. */
function splitLabel(s: string): [string, string] | null {
  const m = /^(.{1,60}?)\s*(?::\s|：)\s*(.+)$/su.exec(s)
  return m ? [m[1], m[2]] : null
}

function Bars({ pair, max, unit }: { pair: [number, number]; max: number; unit: string }) {
  return (
    <div className="nw-bars" aria-hidden="true">
      {pair.map((v, i) => (
        <div key={i} className={`nw-bar nw-bar-${i + 1}`}>
          <i style={{ width: `${Math.max(2, Math.min(100, (v / max) * 100))}%` }} />
          <span>{v} {unit}</span>
        </div>
      ))}
    </div>
  )
}

function Facts({ block, cfg }: { block: EmbedBlock; cfg: Record<string, unknown> }) {
  const lang = useLang()
  const items = block.items ?? []
  if (items.length === 0) return null
  const bars = cfg.kind === 'bars'
  const values = bars && Array.isArray(cfg.values) ? (cfg.values as unknown[]) : []
  const max = typeof cfg.max === 'number' && cfg.max > 0 ? cfg.max : 100
  const unit = typeof cfg.unit === 'string' ? cfg.unit : ''
  const legendAll = (cfg.legend ?? {}) as Record<string, unknown>
  const legend = Array.isArray(legendAll[lang]) ? (legendAll[lang] as string[]) : null
  return (
    <aside className={`nw-facts${bars ? ' nw-facts-bars' : ''}`}>
      {block.title && <p className="nw-facts-title">{block.title}</p>}
      {bars && legend && legend.length === 2 && (
        <p className="nw-bars-legend">
          <span className="nw-key nw-key-1">{legend[0]}</span>
          <span className="nw-key nw-key-2">{legend[1]}</span>
        </p>
      )}
      <dl className="nw-facts-rows">
        {items.map((it, i) => {
          const kv = splitLabel(it)
          const v = values[i]
          const pair = Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number') ? (v as [number, number]) : null
          return (
            <div key={i} className="nw-fact">
              {kv && <dt>{kv[0]}</dt>}
              <dd>{kv ? kv[1] : it}</dd>
              {pair && <Bars pair={pair} max={max} unit={unit} />}
            </div>
          )
        })}
      </dl>
      {block.text && <p className="nw-facts-note">{block.text}</p>}
    </aside>
  )
}

export function renderFactsEmbed(block: EmbedBlock, meta: NewsMeta): ReactNode {
  const cfg = meta.embeds?.[block.id]
  if (!cfg || (cfg.kind !== 'facts' && cfg.kind !== 'bars')) return null
  return <Facts block={block} cfg={cfg} />
}
