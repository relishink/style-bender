import * as React from "react"
import { cn } from "@/lib/utils"

// Restyled from shadcn's Card to match the Figma component "Card - Nova - Confirmation":
// three stacked sections with 16px padding, one divider under the body, a solid muted footer.
// Borders are inset (like Figma's inside strokes) so sizes match Figma exactly.

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-card text-sm text-foreground inset-ring inset-ring-border",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col p-4", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  // Figma text style "paragraph/bold"
  return <div data-slot="card-title" className={cn("text-base font-semibold", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  // Figma text style "paragraph small/normal", muted foreground
  return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-1 flex-col gap-2 p-4 inset-border-b", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center justify-end gap-2 bg-muted p-4", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
