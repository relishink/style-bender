import { Banner } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// Not in the navigation: a bare page for scripts/visual-diff.mjs. Each [data-visual] element is
// screenshotted and compared with the Figma export of the same name in public/figma/.
// Content matches what the Figma components show ("Label", "Title", the Card's sample text).
const buttons = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const figmaButtonName: Record<string, string> = { default: 'primary' }
const banners = ['info', 'success', 'warning', 'error'] as const

export function VisualPage() {
  return (
    <div className="flex flex-col items-start gap-8 bg-background p-8">
      {buttons.map((v) => (
        <div key={v} data-visual={`button-${figmaButtonName[v] ?? v}`} data-scale="2" className="inline-flex">
          <Button variant={v}>Label</Button>
        </div>
      ))}
      {banners.map((k) => (
        <div key={k} data-visual={`banner-${k}`} data-scale="1" className="w-100">
          <Banner variant={k} title="Title" />
        </div>
      ))}
      <div data-visual="card-confirmation" data-scale="1" className="inline-flex">
        <Card className="w-100">
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>Secondary description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5">
              <p>Lorem ipsum dolor sit amet, consectetur.</p>
              <p>Adipiscing elit, sed do eiusmod tempor.</p>
              <p>Incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
