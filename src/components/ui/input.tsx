import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

// shadcn's Input plus a hover state (border darkens to --ring, not on error or disabled).
// Mirrors the Figma component "Input" (State = Default, Hover, Focus, Error, Disabled), which was
// generated from this file. Text is 16px below the md breakpoint so iOS does not zoom on focus,
// 14px (paragraph small) from md up: Figma shows the md+ size. The fill is --background (not transparent)
// so Figma can draw the focus/error ring outside the box; dark mode uses the same tokens, no extra tints.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-1 text-base transition-colors outline-none not-aria-invalid:hover:border-ring file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-ring-error md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
