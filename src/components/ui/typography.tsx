import * as React from "react"
import { typeStyle } from "@/lib/type-style"
import { cn } from "@/lib/utils"

// Heading and Text only expose the named text styles from tokens/typography.tokens.json,
// which are the Figma kit's text styles (heading 1-4, paragraph sizes and weights).
// There is no way to pass a raw font size.

type HeadingProps = React.ComponentProps<"h1"> & {
  /** Figma text style "heading 1" to "heading 4". */
  level: 1 | 2 | 3 | 4
  /** Render a different element than h1-h4, e.g. to keep the document outline correct. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
}

function Heading({ level, as, className, style, ...props }: HeadingProps) {
  const Tag = as ?? (`h${level}` as const)
  return <Tag data-slot="heading" className={cn(className)} style={{ ...typeStyle(`heading-${level}`), ...style }} {...props} />
}

type TextProps = React.ComponentProps<"p"> & {
  /** Figma "paragraph large", "paragraph", "paragraph small", "paragraph mini", or "caption". */
  size?: "large" | "default" | "small" | "mini" | "caption"
  /** Figma "normal", "medium" or "bold". Ignored for caption. */
  weight?: "normal" | "medium" | "bold"
  as?: "p" | "span" | "div"
}

function Text({ size = "default", weight = "normal", as = "p", className, style, ...props }: TextProps) {
  const Tag = as as "p"
  const name = size === "caption" ? "caption" : `paragraph${size === "default" ? "" : `-${size}`}-${weight}`
  return <Tag data-slot="text" className={cn(className)} style={{ ...typeStyle(name), ...style }} {...props} />
}

export { Heading, Text }
