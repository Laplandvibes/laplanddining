// scripts/prerender.mjs  (laplanddining)
//
// Non-invasive, react-snap–style post-build prerender. After `vite build`:
//   1. serves dist/ via vite preview,
//   2. drives system Chrome (puppeteer-core, no Chromium download) over every
//      route × locale,
//   3. waits for React mount + canonical <link> + <footer>,
//   4. snapshots document.documentElement.outerHTML,
//   5. writes dist/<prefix>/<route>/index.html.
//
// SPA untouched (main.tsx still createRoot().render()s into #root → no
// hydrateRoot, no hydration mismatch; static HTML is a crawler/first-paint
// payload). SAFE: if Chrome missing or preview fails, aborts WITHOUT touching
// dist. `npm run build:nossg` is the always-available no-prerender escape hatch.

import { spawn } from 'node:child_process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const PORT = Number(process.env.PRERENDER_PORT || 4321)
const ORIGIN = `http://localhost:${PORT}`

// ---- Locale prefixes (must match src/App.tsx PREFIXES) ---------------------
const LOCALE_PREFIXES = ['', '/fi', '/de', '/ja', '/es', '/br', '/cn', '/kr', '/fr', '/it', '/nl']

// ---- Routes (must match PAGES in src/App.tsx) ------------------------------
const ROUTES = [
  '',
  '/restaurants',
  '/fine-dining',
  '/midnight-sun-dining',
  '/food-history',
  '/local-food',
  '/about',
  '/privacy',
  '/terms',
  '/cookie-policy',
]

function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]
  for (const c of candidates) if (existsSync(c)) return c
  return null
}

function urlPathFor(prefix, route) {
  if (route === '') return prefix === '' ? '/' : prefix
  return `${prefix}${route}`
}

function distFileFor(prefix, route) {
  const segs = []
  if (prefix) segs.push(prefix.replace(/^\//, ''))
  if (route) segs.push(route.replace(/^\//, ''))
  return join(DIST, ...segs, 'index.html')
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitForPreview(maxMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(ORIGIN + '/')
      if (res.ok) return true
    } catch {
      /* not up yet */
    }
    await sleep(250)
  }
  return false
}

async function main() {
  if (!existsSync(DIST) || !existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html not found — run `vite build` first.')
    process.exit(1)
  }

  const chromePath = findChrome()
  if (!chromePath) {
    console.error(
      '[prerender] BLOCKER: no system Chrome/Edge found. Set PUPPETEER_EXECUTABLE_PATH ' +
        'and re-run, or use `npm run build:nossg`. Prerender aborted (dist unchanged).',
    )
    process.exit(2)
  }
  console.log(`[prerender] using browser: ${chromePath}`)

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const preview = spawn(
    npmCmd,
    ['run', 'preview', '--', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' },
  )
  preview.stdout.on('data', () => {})
  preview.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`))

  const ok = await waitForPreview()
  if (!ok) {
    preview.kill()
    console.error('[prerender] BLOCKER: vite preview did not come up on ' + ORIGIN)
    process.exit(3)
  }
  console.log(`[prerender] preview live at ${ORIGIN}`)

  let browser
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
  } catch (err) {
    preview.kill()
    console.error('[prerender] BLOCKER: could not launch headless Chrome:', err.message)
    process.exit(4)
  }

  let written = 0
  let failed = 0
  const total = LOCALE_PREFIXES.length * ROUTES.length
  console.log(`[prerender] ${ROUTES.length} routes × ${LOCALE_PREFIXES.length} locales = ${total} pages`)

  for (const prefix of LOCALE_PREFIXES) {
    for (const route of ROUTES) {
      const urlPath = urlPathFor(prefix, route)
      const outFile = distFileFor(prefix, route)
      const page = await browser.newPage()
      try {
        await page.evaluateOnNewDocument(() => {
          try {
            localStorage.setItem('lv_locale_choice', 'en')
          } catch {
            /* ignore */
          }
        })

        await page.goto(ORIGIN + urlPath, { waitUntil: 'networkidle0', timeout: 45000 })

        await page.waitForFunction(
          () => {
            const root = document.getElementById('root')
            const hasBody = !!root && root.innerText.trim().length > 200
            const hasCanonical = !!document.head.querySelector('link[rel="canonical"]')
            const hasFooter = !!document.querySelector('footer')
            return hasBody && hasCanonical && hasFooter
          },
          { timeout: 45000, polling: 200 },
        )

        const html = '<!doctype html>\n' + (await page.evaluate(() => document.documentElement.outerHTML))

        await mkdir(dirname(outFile), { recursive: true })
        await writeFile(outFile, html, 'utf8')
        written++
        console.log(`[prerender] ✓ ${urlPath.padEnd(24)} -> ${outFile.replace(DIST, 'dist')}`)
      } catch (err) {
        failed++
        console.error(`[prerender] ✗ ${urlPath} — ${err.message}`)
      } finally {
        await page.close()
      }
    }
  }

  await browser.close()
  preview.kill()
  if (preview.pid && process.platform === 'win32') {
    try {
      spawn('taskkill', ['/pid', String(preview.pid), '/T', '/F'])
    } catch {
      /* best effort */
    }
  }

  console.log(`\n[prerender] done: ${written}/${total} written, ${failed} failed.`)
  if (failed > total * 0.1) {
    console.error(`[prerender] ABORT: ${failed} failures exceed 10% threshold.`)
    process.exit(5)
  }
}

main().catch((err) => {
  console.error('[prerender] fatal:', err)
  process.exit(1)
})
