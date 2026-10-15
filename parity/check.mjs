// Parity check: compares the design tokens in Git with a snapshot of the Figma library.
//
//   1. Run parity/figma-snapshot.figma.js in Figma (through use_figma) and save the
//      result as parity/figma-snapshot.json.
//   2. npm run parity
//
// Colors are compared as sRGB hex (what Figma stores), sizes in px. Exit code 1 on any difference.
import { readFileSync } from 'node:fs'
import Color from 'colorjs.io'

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)))
const snapshot = read('./figma-snapshot.json')
const files = {
  base: [read('../tokens/primitives.tokens.json'), read('../tokens/typography.tokens.json')],
  light: read('../tokens/light.tokens.json'),
  dark: read('../tokens/dark.tokens.json'),
}

// Code-only tokens with no Figma variable on purpose (Figma stores these as raw values).
// --spacing is checked through the Figma spacing variables (calc(var(--spacing) * n)) below.
const CODE_ONLY = ['--white-alpha-10', '--white-alpha-15', '--radius-base', '--spacing']

// Flatten DTCG groups into { "primitive.neutral.500": token }, inheriting $type.
function flatten(node, path = [], type, out = {}) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    const t = value.$type ?? type
    if ('$value' in value) out[[...path, key].join('.')] = { ...value, $type: t }
    else flatten(value, [...path, key], t, out)
  }
  return out
}
// Same naming rule as terrazzo.config.ts
const cssName = (id) => '--' + id.replace(/^(primitive|semantic)\./, '').replace(/\./g, '-')

function resolve(tokens, value) {
  while (typeof value === 'string' && value.startsWith('{')) value = tokens[value.slice(1, -1)].$value
  return value
}
function toFigmaColor(v) {
  const c = new Color(v.colorSpace, v.components, v.alpha ?? 1).to('srgb').toGamut({ space: 'srgb' })
  return { hex: c.toString({ format: 'hex', collapse: false }).slice(0, 7), alpha: Math.round((v.alpha ?? 1) * 1000) / 1000 }
}
const px = (d) => (d.unit === 'rem' ? d.value * 16 : d.value)
const sameColor = (a, b) =>
  a.alpha === b.alpha && [1, 3, 5].every((i) => Math.abs(parseInt(a.hex.slice(i, i + 2), 16) - parseInt(b.hex.slice(i, i + 2), 16)) <= 1)
const fmt = (v) => (v && typeof v === 'object' ? v.hex + (v.alpha < 1 ? ` @ ${v.alpha * 100}%` : '') : String(v))

// Radius steps are derived in src/index.css (e.g. --radius-sm: calc(var(--radius) * 0.6)).
const indexCss = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const radiusSteps = Object.fromEntries(
  [...indexCss.matchAll(/(--radius-\w+):\s*calc\(var\(--radius\)\s*\*\s*([\d.]+)\)/g)].map((m) => [m[1], Number(m[2])]),
)

const problems = []
let checked = 0
for (const theme of ['light', 'dark']) {
  const tokens = Object.assign({}, ...files.base.map((f) => flatten(f)), flatten(files[theme]))
  const code = {}
  for (const [id, t] of Object.entries(tokens)) {
    if (t.$type === 'color') code[cssName(id)] = toFigmaColor(resolve(tokens, t.$value))
    if (t.$type === 'dimension') code[cssName(id)] = px(resolve(tokens, t.$value))
  }
  for (const [name, k] of Object.entries(radiusSteps)) code[name] = Math.round(code['--radius'] * k * 100) / 100

  for (const [name, value] of Object.entries(code)) {
    if (CODE_ONLY.includes(name)) continue
    const figma = snapshot.variables[name]
    if (!figma) { problems.push([theme, name, fmt(value), 'missing in Figma']); continue }
    checked++
    const ok = typeof value === 'number' ? value === figma[theme] : sameColor(value, figma[theme])
    if (!ok) problems.push([theme, name, fmt(value), fmt(figma[theme])])
  }
  // Spacing: a Figma variable with code syntax calc(var(--spacing) * n) must equal n x --spacing.
  for (const [name, figma] of Object.entries(snapshot.variables)) {
    const m = /^calc\(var\(--spacing\) \* ([\d.]+)\)$/.exec(name)
    if (!m) continue
    checked++
    const expected = Math.round(Number(m[1]) * code['--spacing'] * 100) / 100
    if (expected !== figma[theme]) problems.push([theme, `${figma.figma} (${name})`, `${expected}px`, `${figma[theme]}px`])
  }
  for (const name of Object.keys(snapshot.variables))
    if (!(name in code) && !name.startsWith('calc(')) problems.push([theme, name, 'missing in code', fmt(snapshot.variables[name][theme])])
}

// Text styles: Figma "paragraph small/bold" <-> token type.paragraph-small-bold
const weights = { Regular: 400, Medium: 500, SemiBold: 600, 'Semi Bold': 600 }
const typeTokens = Object.assign({}, ...files.base.map((f) => flatten(f)))
for (const [style, f] of Object.entries(snapshot.textStyles)) {
  const id = 'type.' + style.replace('/', ' ').replace(/ /g, '-')
  const t = typeTokens[id]
  if (!t) { problems.push(['type', style, 'missing in code', '']); continue }
  checked++
  const v = t.$value
  const code = {
    fontFamily: resolve(typeTokens, v.fontFamily)[0],
    fontWeight: resolve(typeTokens, v.fontWeight),
    fontSize: px(v.fontSize),
    lineHeight: Math.round(v.lineHeight * px(v.fontSize) * 100) / 100,
    letterSpacing: px(v.letterSpacing),
  }
  const fig = { fontFamily: f.fontFamily, fontWeight: weights[f.fontStyle], fontSize: f.fontSize, lineHeight: f.lineHeight, letterSpacing: f.letterSpacing }
  for (const key of Object.keys(code)) if (code[key] !== fig[key]) problems.push(['type', `${style} ${key}`, String(code[key]), String(fig[key])])
}
for (const id of Object.keys(typeTokens).filter((k) => k.startsWith('type.')))
  if (!Object.keys(snapshot.textStyles).some((s) => 'type.' + s.replace('/', ' ').replace(/ /g, '-') === id))
    problems.push(['type', id, 'present', 'missing in Figma'])

// Components: every Figma variant option maps to a code prop value, and every code value maps back
// (or is listed as codeOnly). Code values are read from the cva() variants in the component file.
const map = read('../figma-map.json')
function cvaValues(file, prop) {
  const src = readFileSync(new URL('../' + file, import.meta.url), 'utf8')
  const start = src.indexOf('variants: {')
  const m = new RegExp(`\\n(\\s+)${prop}: \\{`).exec(src.slice(start))
  if (start < 0 || !m) return null
  const indent = m[1] + '  '
  const body = src.slice(start + m.index + m[0].length)
  const end = body.search(new RegExp(`\\n${m[1]}\\}`))
  return [...body.slice(0, end).matchAll(new RegExp(`\\n${indent}"?([\\w-]+)"?:`, 'g'))].map((x) => x[1])
}
// Corner radius: the first rounded-* class in the component file is its root radius.
// Tailwind's rounded-lg is var(--radius); rounded-sm/md/xl/... are var(--radius-sm/md/xl/...).
function codeRadiusToken(file) {
  const m = /\brounded-(sm|md|lg|xl|2xl|3xl|4xl)\b/.exec(readFileSync(new URL('../' + file, import.meta.url), 'utf8'))
  return m ? (m[1] === 'lg' ? '--radius' : `--radius-${m[1]}`) : null
}
let componentCount = 0
for (const c of map.components) {
  const fig = snapshot.components?.[c.figma.nodeId]
  if (!fig) { problems.push(['component', c.name, c.figma.nodeId, 'not in snapshot: add its nodeId to COMPONENT_SET_IDS']); continue }
  componentCount++
  if (fig.radius) {
    const code = codeRadiusToken(c.code.file)
    if (!fig.radius.token && fig.radius.px === 0 && !code) { /* square in both: nothing to compare */ }
    else if (!fig.radius.token) problems.push(['component', `${c.name} radius`, code ?? 'none', `${fig.radius.px}px, not bound to a variable`])
    else if (code !== fig.radius.token) problems.push(['component', `${c.name} radius`, code ?? 'none', fig.radius.token])
  }
  const axes = [...Object.entries(c.props ?? {}).map(([prop, p]) => ({ prop, ...p })), ...(c.states ? [{ prop: null, ...c.states }] : [])]
  for (const axis of axes) {
    const figmaOptions = fig.options[axis.figmaProperty] ?? []
    for (const o of figmaOptions)
      if (!(o in axis.values)) problems.push(['component', `${c.name} ${axis.figmaProperty}=${o}`, 'no mapping', 'in Figma'])
    for (const o of Object.keys(axis.values))
      if (!figmaOptions.includes(o)) problems.push(['component', `${c.name} ${axis.figmaProperty}=${o}`, 'mapped', 'missing in Figma'])
    if (!axis.prop) continue
    // A Figma variant can map to a true/false prop, e.g. Active=On|Off <-> isActive.
    if (axis.kind === 'boolean') {
      const src = readFileSync(new URL('../' + c.code.file, import.meta.url), 'utf8')
      if (!new RegExp(`\\b${axis.prop}\\?:\\s*boolean`).test(src)) problems.push(['component', `${c.name}.${axis.prop}`, 'no boolean prop in ' + c.code.file, 'in Figma'])
      const vals = Object.values(axis.values)
      if (!(vals.includes(true) && vals.includes(false))) problems.push(['component', `${c.name}.${axis.prop}`, 'needs one option for true and one for false', ''])
      continue
    }
    const codeValues = cvaValues(c.code.file, axis.prop)
    if (!codeValues) { problems.push(['component', `${c.name}.${axis.prop}`, 'not found in ' + c.code.file, '']); continue }
    for (const v of Object.values(axis.values))
      if (!codeValues.includes(v)) problems.push(['component', `${c.name} ${axis.prop}="${v}"`, 'missing in code', 'in Figma'])
    for (const v of codeValues)
      if (!Object.values(axis.values).includes(v) && !(axis.codeOnly ?? []).includes(v))
        problems.push(['component', `${c.name} ${axis.prop}="${v}"`, 'in code', 'missing in Figma'])
  }
}

console.log(`Figma snapshot: ${snapshot.exportedAt}`)
console.log(`Checked ${checked} values (colors, radius and spacing in light + dark, ${Object.keys(snapshot.textStyles).length} text styles) and ${componentCount} component APIs.`)
if (problems.length === 0) {
  console.log('✔ 1:1 — Git tokens and Figma match.')
} else {
  console.log(`✘ ${problems.length} difference(s):\n`)
  console.table(problems.map(([theme, token, code, figma]) => ({ theme, token, code, figma })))
  process.exitCode = 1
}
