// Run with the Figma MCP `use_figma` tool (read-only). Paste the returned JSON into
// parity/figma-snapshot.json, then run `npm run parity`.
//
// Exports every Figma variable that has WEB code syntax (its CSS variable name),
// resolved to a final value per theme, every local text style, and the variant
// options of each component set in figma-map.json.
//
// Keep this list in sync with the nodeIds in figma-map.json (npm run parity tells you if one is missing).
const COMPONENT_SET_IDS = ['1953:29720', '1953:30428', '1953:32858', '5021:12383']
const hex = (c) =>
  '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const themeOf = (modeName) => (/dark/i.test(modeName) ? 'dark' : 'light')

// Follows aliases. Inside the same collection the current mode is kept; in a
// collection with other modes, its default mode is used.
async function resolve(value, col, modeId) {
  while (value && value.type === 'VARIABLE_ALIAS') {
    const target = await figma.variables.getVariableByIdAsync(value.id)
    if (target.variableCollectionId !== col.id) {
      col = collections.find((c) => c.id === target.variableCollectionId)
      modeId = col.defaultModeId
    }
    value = target.valuesByMode[modeId]
  }
  if (value && typeof value === 'object' && 'r' in value) {
    return { hex: hex(value), alpha: Math.round((value.a ?? 1) * 1000) / 1000 }
  }
  return value
}

const variables = {}
for (const col of collections) {
  for (const id of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id)
    // Plain var(--name) is keyed by the CSS variable; calc(var(--spacing) * n) by the whole expression.
    const web = v.codeSyntax?.WEB
    const css = web?.match(/^var\((--[\w-]+)\)$/)?.[1] ?? (web?.startsWith('calc(') ? web : null)
    if (!css) continue
    const entry = { figma: v.name }
    for (const mode of col.modes) {
      const val = await resolve(v.valuesByMode[mode.modeId], col, mode.modeId)
      if (col.modes.length === 1) { entry.light = val; entry.dark = val }
      else entry[themeOf(mode.name)] = val
    }
    variables[css] = entry
  }
}

const textStyles = {}
for (const s of await figma.getLocalTextStylesAsync()) {
  textStyles[s.name] = {
    fontFamily: s.fontName.family,
    fontStyle: s.fontName.style,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight.unit === 'PIXELS' ? Math.round(s.lineHeight.value * 100) / 100 : s.lineHeight,
    letterSpacing: s.letterSpacing.unit === 'PIXELS' ? s.letterSpacing.value : s.letterSpacing,
  }
}

const components = {}
for (const id of COMPONENT_SET_IDS) {
  const set = await figma.getNodeByIdAsync(id)
  if (!set || (set.type !== 'COMPONENT_SET' && set.type !== 'COMPONENT')) { components[id] = null; continue }
  const options = {}
  for (const [key, def] of Object.entries(set.componentPropertyDefinitions)) {
    if (def.type === 'VARIANT') options[key] = def.variantOptions
  }
  // Size and corner radius of the default variant (or the single component), for the spec check.
  const base = set.type === 'COMPONENT_SET' ? set.defaultVariant : set
  const radiusVar = base.boundVariables?.topLeftRadius && (await figma.variables.getVariableByIdAsync(base.boundVariables.topLeftRadius.id))
  const radius = { px: base.topLeftRadius, token: radiusVar?.codeSyntax?.WEB?.match(/var\((--[\w-]+)\)/)?.[1] ?? null }
  components[id] = { name: set.name, variantCount: set.type === 'COMPONENT_SET' ? set.children.length : 1, options, size: [base.width, base.height], radius }
}

return { exportedAt: new Date().toISOString(), variables, textStyles, components }
