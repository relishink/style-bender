// Rendering parity: screenshot each component in the browser and compare it pixel by pixel
// with its Figma export in public/figma/.
//
//   npm run visual   ->  table of mismatched pixels; diff images in parity/visual/
//
// Both images are put on white first (Figma exports are transparent outside the shape).
// Sizes must match exactly. Pixels may differ a little: Figma, Chrome on macOS and Chrome on
// Linux (CI) each anti-alias text differently. The text-heavy Card measures ~1% on a Mac and
// ~4% in CI, so THRESHOLD is 5%. Real drift shows up as a size mismatch or far above that.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import pixelmatch from 'pixelmatch'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import { createServer } from 'vite'

const THRESHOLD = 0.05 // 5% of pixels may differ
const OUT = new URL('../parity/visual/', import.meta.url)
mkdirSync(OUT, { recursive: true })

function onWhite(png) {
  const out = new PNG({ width: png.width, height: png.height })
  for (let i = 0; i < png.data.length; i += 4) {
    const a = png.data[i + 3] / 255
    for (let c = 0; c < 3; c++) out.data[i + c] = Math.round(png.data[i + c] * a + 255 * (1 - a))
    out.data[i + 3] = 255
  }
  return out
}

const server = await createServer({ server: { port: 5199, strictPort: true }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch()
const results = []
try {
  for (const scale of [1, 2]) {
    const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: 900, height: 1400 } })
    await page.goto('http://localhost:5199/#visual')
    await page.evaluate(() => document.fonts.ready)
    for (const el of await page.locator(`[data-visual][data-scale="${scale}"]`).all()) {
      const name = await el.getAttribute('data-visual')
      const code = onWhite(PNG.sync.read(await el.screenshot()))
      const figma = onWhite(PNG.sync.read(readFileSync(new URL(`../public/figma/${name}.png`, import.meta.url))))
      const sizeOk = code.width === figma.width && code.height === figma.height
      const w = Math.max(code.width, figma.width), h = Math.max(code.height, figma.height)
      const pad = (img) => { const p = new PNG({ width: w, height: h, fill: true }); p.data.fill(255); PNG.bitblt(img, p, 0, 0, img.width, img.height, 0, 0); return p }
      const a = pad(code), b = pad(figma), diff = new PNG({ width: w, height: h })
      const mismatched = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.15 })
      writeFileSync(new URL(`${name}-diff.png`, OUT), PNG.sync.write(diff))
      const share = mismatched / (w * h)
      results.push({ component: name, code: `${code.width}×${code.height}`, figma: `${figma.width}×${figma.height}`, mismatch: (share * 100).toFixed(2) + '%', result: sizeOk && share <= THRESHOLD ? '✔' : '✘' })
    }
    await page.close()
  }
} finally {
  await browser.close()
  await server.close()
}
console.table(results)
const failed = results.filter((r) => r.result === '✘')
console.log(failed.length ? `✘ ${failed.length} component(s) differ from Figma. See parity/visual/*-diff.png` : '✔ Every component renders like its Figma export.')
if (failed.length) process.exitCode = 1
