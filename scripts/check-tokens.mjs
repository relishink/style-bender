// Rule 3 as a machine check: components may only use token-backed design values.
//
// In src/components/ui/*.tsx this flags:
//   - raw colors anywhere: #hex, rgb(), hsl(), oklch()
//   - arbitrary values on DESIGN utilities (color, text size, spacing, sizing, radius, ring, border,
//     shadow, inset) unless the value is built only from tokens, e.g. max-w-[calc(100%-var(--spacing)*8)].
//     So bg-[#f00], p-[13px], text-[0.8rem], ring-[3px] and rounded-[min(…,10px)] all fail.
//   - raw lengths (12px, 0.8rem) in code outside class names (e.g. style objects)
//
// Allowed: arbitrary selector variants (data-[slot=card]:, [&_svg]:) and motion/layout mechanics that
// are not design values: grid templates, transitions, easing, durations, transforms, z-index and
// CSS custom-property plumbing ([--x:…]), as used by shadcn's Drawer.
//
// npm run check:tokens  ->  exit code 1 if anything is found.
import { readdirSync, readFileSync } from 'node:fs'

const DIR = new URL('../src/components/ui/', import.meta.url)
const RAW_COLOR = [/#[0-9a-fA-F]{3,8}\b/, /\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/]
const RAW_LENGTH = /\b\d+(\.\d+)?(px|rem|em)\b/
const DESIGN = /^-?(bg|text|border|ring|outline|fill|stroke|shadow|rounded|p[trblxyse]?|m[trblxyse]?|gap|space-[xy]|w|h|size|min-w|min-h|max-w|max-h|inset|top|right|bottom|left|leading|tracking|font)-\[/

// Split a class on ':' that sit outside [...], so variants can be separated from the utility.
function splitVariants(cls) {
  const parts = []
  let depth = 0, current = ''
  for (const ch of cls) {
    if (ch === '[') depth++
    if (ch === ']') depth--
    if (ch === ':' && depth === 0) { parts.push(current); current = '' } else current += ch
  }
  parts.push(current)
  return parts
}

const problems = []
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.tsx'))) {
  const lines = readFileSync(new URL(file, DIR), 'utf8').split('\n')
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '')
    for (const re of RAW_COLOR) if (re.test(code)) problems.push(`${file}:${i + 1}  raw color: ${code.trim().slice(0, 120)}`)
    let rest = code
    for (const literal of code.match(/"[^"]*"|'[^']*'|`[^`]*`/g) ?? []) {
      rest = rest.replace(literal, '""')
      for (const cls of literal.slice(1, -1).split(/\s+/)) {
        const utility = splitVariants(cls).at(-1)
        if (!utility.includes('[')) continue
        if (DESIGN.test(utility) && (RAW_LENGTH.test(utility) || /\d\]$/.test(utility)))
          problems.push(`${file}:${i + 1}  hard-coded "${utility}" in "${cls}"`)
      }
    }
    if (RAW_LENGTH.test(rest)) problems.push(`${file}:${i + 1}  raw length outside class names: ${rest.trim().slice(0, 120)}`)
  })
}

if (problems.length) {
  console.log(`✘ ${problems.length} hard-coded value(s). Use a token-backed class instead:\n`)
  for (const p of problems) console.log('  ' + p)
  process.exitCode = 1
} else {
  console.log('✔ No hard-coded design values in src/components/ui.')
}
