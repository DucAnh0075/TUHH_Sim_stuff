#!/usr/bin/env node
/**
 * Builds public/figures/<exam>/<name>.png from the report PDFs in pdfs/.
 *
 *   npm run figures              extract everything listed in figures.manifest.json
 *   npm run figures -- --inspect dump every page and every embedded image so the
 *                                manifest entries can be narrowed down
 *
 * Needs poppler-utils (pdftoppm, pdfimages), which ships with most distributions.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(readFileSync(join(root, 'figures.manifest.json'), 'utf8'))
const inspect = process.argv.includes('--inspect')
const outRoot = join(root, 'public', 'figures')

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

function requireTools() {
  for (const tool of ['pdftoppm', 'pdfimages']) {
    try {
      run('which', [tool])
    } catch {
      console.error(`Fehlt: ${tool}. Unter Debian/Ubuntu: sudo apt install poppler-utils`)
      process.exit(1)
    }
  }
}

/** Renders one page (optionally a fractional rectangle of it) to `target`. */
function renderPage(pdf, page, target, rect) {
  const args = ['-png', '-r', String(manifest.dpi ?? 150), '-f', String(page), '-l', String(page)]

  if (rect) {
    // pdftoppm crops in pixels of the rendered page, so the page size is needed.
    const info = run('pdfinfo', ['-f', String(page), '-l', String(page), pdf])
    const size = /Page\s+\d+\s+size:\s+([\d.]+) x ([\d.]+)/.exec(info)
    const dpi = manifest.dpi ?? 150
    const width = Math.round((Number(size?.[1] ?? 595) / 72) * dpi)
    const height = Math.round((Number(size?.[2] ?? 842) / 72) * dpi)
    const [x, y, w, h] = rect
    args.push(
      '-x', String(Math.round(x * width)),
      '-y', String(Math.round(y * height)),
      '-W', String(Math.round(w * width)),
      '-H', String(Math.round(h * height)),
    )
  }

  const prefix = `${target}.tmp`
  run('pdftoppm', [...args, pdf, prefix])
  // pdftoppm appends the page number; find whatever it wrote and rename it.
  const dir = dirname(target)
  const base = `${prefix.split('/').pop()}`
  const written = readdirSync(dir).find((f) => f.startsWith(base))
  if (!written) throw new Error(`pdftoppm hat nichts geschrieben für ${target}`)
  renameSync(join(dir, written), target)
}

/**
 * Extracts the n-th real embedded image of a page. Besides the diagrams the reports
 * embed 1x1 fillers, the white card backgrounds (about 1076x868) and sometimes a
 * full-page scan, so only images between 100 and 700 pixels in both directions count
 * - that is the size range of the arrival curve plots in every report.
 */
function extractEmbedded(pdf, page, index, target) {
  const listing = run('pdfimages', ['-list', '-f', String(page), '-l', String(page), pdf])
  const sizes = listing
    .split('\n')
    .slice(2)
    .map((line) => line.trim().split(/\s+/))
    .filter((cols) => cols.length > 4 && /^\d+$/.test(cols[3]))
    .map((cols) => ({ width: Number(cols[3]), height: Number(cols[4]) }))

  const wantedPosition = sizes
    .map((size, i) => ({ ...size, i }))
    .filter((s) => s.width >= 100 && s.width <= 700 && s.height >= 100 && s.height <= 700)[index]

  if (!wantedPosition) return false

  const dir = dirname(target)
  const prefix = join(dir, `${target.split('/').pop()}.raw`)
  run('pdfimages', ['-all', '-f', String(page), '-l', String(page), pdf, prefix])
  const base = prefix.split('/').pop()
  const found = readdirSync(dir)
    .filter((f) => f.startsWith(base))
    .sort()

  if (found.length === 0) return false

  const wanted = found[Math.min(wantedPosition.i, found.length - 1)]
  renameSync(join(dir, wanted), target)
  for (const leftover of found) rmSync(join(dir, leftover), { force: true })
  return true
}

function doInspect() {
  const dir = join(outRoot, '_inspect')
  mkdirSync(dir, { recursive: true })
  for (const [exam, rel] of Object.entries(manifest.pdfs)) {
    const pdf = join(root, rel)
    if (!existsSync(pdf)) {
      console.log(`· ${exam}: ${rel} fehlt, übersprungen`)
      continue
    }
    const examDir = join(dir, exam)
    mkdirSync(examDir, { recursive: true })
    run('pdftoppm', ['-png', '-r', '110', pdf, join(examDir, 'page')])
    run('pdfimages', ['-all', '-p', pdf, join(examDir, 'img')])
    const files = readdirSync(examDir)
    console.log(
      `· ${exam}: ${files.filter((f) => f.startsWith('page')).length} Seiten, ` +
        `${files.filter((f) => f.startsWith('img')).length} eingebettete Bilder → ${examDir}`,
    )
  }
  console.log('\nBilder ansehen, dann in figures.manifest.json "image" oder "rect" ergänzen.')
}

function build() {
  let written = 0
  let skipped = 0

  for (const [id, spec] of Object.entries(manifest.figures)) {
    const [exam, name] = id.split('/')
    const pdf = join(root, manifest.pdfs[exam] ?? '')
    if (!existsSync(pdf)) {
      skipped++
      continue
    }

    const dir = join(outRoot, exam)
    mkdirSync(dir, { recursive: true })
    const target = join(dir, `${name}.png`)

    try {
      if (spec.image !== undefined && extractEmbedded(pdf, spec.page, spec.image, target)) {
        written++
        continue
      }
      renderPage(pdf, spec.page, target, spec.rect)
      written++
    } catch (error) {
      console.error(`! ${id}: ${error.message}`)
    }
  }

  console.log(`${written} Abbildungen geschrieben, ${skipped} übersprungen (PDF fehlt).`)
  if (skipped > 0) {
    console.log('PDFs nach pdfs/ legen: ' + Object.values(manifest.pdfs).join(', '))
  }
}

requireTools()
mkdirSync(outRoot, { recursive: true })
if (inspect) doInspect()
else build()
