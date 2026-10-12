// Run with the Figma MCP `use_figma` tool (read-only). Paste the returned JSON into
// parity/figma-snapshot.json, then run `npm run parity`.
//
// Exports every Figma variable that has WEB code syntax (its CSS variable name),
// resolved to a final value per theme, plus every local text style.
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
    const css = v.codeSyntax?.WEB?.match(/var\((--[\w-]+)\)/)?.[1]
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

return { exportedAt: new Date().toISOString(), variables, textStyles }
