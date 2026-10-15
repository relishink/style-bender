// Rule 3 as a machine check: components may only use token-backed values.
//
// Flags, in src/components/ui/*.tsx:
//   - Tailwind arbitrary values such as bg-[#f00], p-[13px], text-[0.8rem]
//     (arbitrary *variants* such as data-[slot=card]: or [&_svg]: are fine: they select, they don't style)
//   - raw colors: #hex, rgb(), hsl(), oklch()
//   - raw lengths such as 12px or 0.8rem
//
// npm run check:tokens  ->  exit code 1 if anything is found.
import { readdirSync, readFileSync } from 'node:fs'

const DIR = new URL('../src/components/ui/', import.meta.url)
const RAW = [
  [/#[0-9a-fA-F]{3,8}\b/, 'raw hex color'],
  [/\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/, 'raw color function'],
  [/\b\d+(\.\d+)?(px|rem|em)\b/, 'raw length'],
]

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
    const code = line.replace(/\/\/.*$/, '') // ignore line comments
    for (const [re, why] of RAW) if (re.test(code)) problems.push(`${file}:${i + 1}  ${why}: ${code.trim()}`)
    for (const literal of code.match(/"[^"]*"|'[^']*'|`[^`]*`/g) ?? []) {
      for (const cls of literal.slice(1, -1).split(/\s+/)) {
        const utility = splitVariants(cls).at(-1)
        if (utility.includes('[')) problems.push(`${file}:${i + 1}  arbitrary value "${utility}" in "${cls}"`)
      }
    }
  })
}

if (problems.length) {
  console.log(`✘ ${problems.length} hard-coded value(s). Use a token-backed class instead:\n`)
  for (const p of problems) console.log('  ' + p)
  process.exitCode = 1
} else {
  console.log('✔ No hard-coded values in src/components/ui.')
}
