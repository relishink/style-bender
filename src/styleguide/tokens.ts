// Reads the design tokens and the Figma snapshot so the style guide documents
// exactly what the parity check compares. Nothing here is hand-copied.
import primitives from '../../tokens/primitives.tokens.json'
import typography from '../../tokens/typography.tokens.json'
import light from '../../tokens/light.tokens.json'
import snapshot from '../../parity/figma-snapshot.json'

type Json = { [key: string]: unknown }
type Token = { $type?: string; $value: unknown; $description?: string }

function flatten(node: Json, path: string[] = [], type?: string, out: Record<string, Token> = {}) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || typeof value !== 'object' || value === null) continue
    const v = value as Json
    const t = (v.$type as string | undefined) ?? type
    if ('$value' in v) out[[...path, key].join('.')] = { ...(v as Token), $type: t }
    else flatten(v, [...path, key], t, out)
  }
  return out
}

// Same naming rule as terrazzo.config.ts
export const cssName = (id: string) => '--' + id.replace(/^(primitive|semantic)\./, '').replace(/\./g, '-')

const figmaVariables = snapshot.variables as Record<string, { figma: string; light: unknown; dark: unknown }>
export const snapshotDate = snapshot.exportedAt

export type FigmaColor = { hex: string; alpha: number }
export type ColorToken = { css: string; figma?: string; light?: FigmaColor; dark?: FigmaColor }

function colorRow(id: string): ColorToken {
  const css = cssName(id)
  const f = figmaVariables[css]
  return { css, figma: f?.figma, light: f?.light as FigmaColor, dark: f?.dark as FigmaColor }
}

const semanticIds = Object.entries(flatten(light as Json))
  .filter(([, t]) => t.$type === 'color')
  .map(([id]) => id)

const group = (pred: (css: string) => boolean) => semanticIds.map(colorRow).filter((t) => pred(t.css))
const isPair = (css: string) => /^--(background|foreground|card|popover|primary|secondary|muted|accent|destructive)/.test(css)

export const colorGroups: { title: string; description: string; tokens: ColorToken[] }[] = [
  { title: 'Surfaces and text', description: 'Each surface has a matching foreground for text and icons on it.', tokens: group(isPair) },
  { title: 'Borders and focus', description: 'Lines, form fields and the focus ring.', tokens: group((c) => ['--border', '--input', '--ring'].includes(c)) },
  { title: 'Sidebar', description: 'Used only by the sidebar.', tokens: group((c) => c.startsWith('--sidebar')) },
  { title: 'Charts', description: 'Data series, in order.', tokens: group((c) => c.startsWith('--chart')) },
  { title: 'Brand', description: 'The Style Bender logo and brand moments only, never component states.', tokens: group((c) => c.startsWith('--brand')) },
]
export const brandColors = colorGroups.find((g) => g.title === 'Brand')!.tokens

export const primitiveColors = Object.entries(flatten(primitives as Json))
  .filter(([id, t]) => t.$type === 'color' && !id.includes('white-alpha'))
  .map(([id]) => colorRow(id))

// Typography
const typeTokens = flatten(typography as Json)
const resolve = (v: unknown): unknown => {
  while (typeof v === 'string' && v.startsWith('{')) v = typeTokens[v.slice(1, -1)].$value
  return v
}
type Dim = { value: number; unit: string }
const figmaStyleNames = Object.keys(snapshot.textStyles)

export type TypeStyle = {
  id: string
  css: string
  figma?: string
  family: string
  weight: number
  size: number
  lineHeight: number
  letterSpacing: number
}

export const typeStyles: TypeStyle[] = Object.entries(typeTokens)
  .filter(([id]) => id.startsWith('type.'))
  .map(([id, t]) => {
    const v = t.$value as { fontFamily: string; fontWeight: string; fontSize: Dim; lineHeight: number; letterSpacing: Dim }
    return {
      id,
      css: cssName(id),
      figma: figmaStyleNames.find((s) => 'type.' + s.replace('/', ' ').replace(/ /g, '-') === id),
      family: (resolve(v.fontFamily) as string[])[0],
      weight: resolve(v.fontWeight) as number,
      size: v.fontSize.value,
      lineHeight: Math.round(v.lineHeight * v.fontSize.value * 100) / 100,
      letterSpacing: v.letterSpacing.value,
    }
  })

// Figma <-> code mapping
import figmaMap from '../../figma-map.json'
export type ComponentMapping = (typeof figmaMap.components)[number]
export const mappingFor = (name: string) => figmaMap.components.find((c) => c.name === name)

// Colors as they resolve in Figma (from the snapshot), for contrast checks.
export const figmaColor = (css: string, theme: 'light' | 'dark') => figmaVariables[css]?.[theme] as FigmaColor | undefined

// WCAG 2.x contrast ratio between two opaque sRGB hex colors.
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100
}

// Reads the cva() variants from a component's source so the Specifications tab lists the
// tokens each variant actually uses (bg-primary -> --primary).
const TOKEN_UTILITY = /(?:^|:)(bg|text|border|ring|outline)-([a-z]+(?:-[a-z]+)*)(?:\/(\d+))?$/
export function variantTokens(source: string, prop: string) {
  const start = source.indexOf('variants: {')
  const block = source.slice(start, source.indexOf('defaultVariants', start))
  const propStart = block.indexOf(`${prop}: {`)
  const propBlock = block.slice(propStart, block.indexOf('\n      },', propStart))
  const out: Record<string, string[]> = {}
  for (const m of propBlock.matchAll(/\n\s+"?([\w-]+)"?:\s*"([^"]*)"/g)) {
    const tokens = new Set<string>()
    for (const cls of m[2].split(/\s+/)) {
      const t = TOKEN_UTILITY.exec(cls)
      if (!t || !(`--${t[2]}` in figmaVariables)) continue
      tokens.add(`--${t[2]}${t[3] ? ` @ ${t[3]}%` : ''}`)
    }
    out[m[1]] = [...tokens]
  }
  return out
}
