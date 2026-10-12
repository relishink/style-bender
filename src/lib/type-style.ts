import type { CSSProperties } from "react"

// Applies a typography token as inline style:
// typeStyle("paragraph-small-normal") -> font: var(--type-paragraph-small-normal), plus its letter spacing.
export const typeStyle = (name: string): CSSProperties => ({
  font: `var(--type-${name})`,
  letterSpacing: `var(--type-${name}-letter-spacing)`,
})
