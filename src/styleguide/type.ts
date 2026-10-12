import type { CSSProperties } from 'react'

// Applies a typography token (from tokens/typography.tokens.json) as inline style,
// e.g. text('paragraph-small-normal') -> font: var(--type-paragraph-small-normal).
export const text = (name: string): CSSProperties => ({
  font: `var(--type-${name})`,
  letterSpacing: `var(--type-${name}-letter-spacing)`,
})
