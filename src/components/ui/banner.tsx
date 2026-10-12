import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

// Reworked from shadcn's Alert. Mirrors the Figma "Banner" component set:
// Type=Info|Success|Warning|Error, an optional description and an optional action.
const bannerVariants = cva(
  "flex w-full items-start gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm",
  {
    variants: {
      variant: {
        info: "text-info",
        success: "text-success",
        warning: "text-warning",
        error: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const icons = { info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleAlert }

type BannerProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof bannerVariants> & {
    title: React.ReactNode
    description?: React.ReactNode
    /** A small action, usually a <Button size="xs" variant="outline">. */
    action?: React.ReactNode
  }

function Banner({ className, variant = "info", title, description, action, ...props }: BannerProps) {
  const kind = variant ?? "info"
  const Icon = icons[kind]
  return (
    <div
      data-slot="banner"
      // Errors and warnings interrupt screen readers; info and success are announced politely.
      role={kind === "error" || kind === "warning" ? "alert" : "status"}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div data-slot="banner-title" className="font-medium">{title}</div>
        {description && <div data-slot="banner-description">{description}</div>}
      </div>
      {action && <div data-slot="banner-action" className="shrink-0">{action}</div>}
    </div>
  )
}

export { Banner, bannerVariants }
