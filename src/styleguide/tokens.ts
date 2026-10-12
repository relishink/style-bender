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
]

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
