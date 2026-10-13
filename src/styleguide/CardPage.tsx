import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, ComponentPage, Contrast, Mono, Rules, Section, Table } from './ComponentPage'
import { contrast, figmaColor, mappingFor } from './tokens'
import { text } from './type'

const card = mappingFor('Card')!

// The Figma component's sample content, so the two renders can be compared directly.
function ConfirmationCard() {
  return (
    <Card className="w-100">
      <CardHeader>
        <CardTitle>Confirmation</CardTitle>
        <CardDescription>Secondary description</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Figma's "paragraph small" style has 14px paragraph spacing: space-y-3.5 */}
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
  )
}

const guidelines = (
  <>
    <Section title="When to use">
      <Rules items={[
        'Group a short piece of content with the actions that belong to it, such as a confirmation or a settings block.',
        'Keep one primary action in the footer, on the right; secondary actions go to its left.',
        'Do not nest cards inside cards.',
      ]} />
    </Section>
    <Section title="Anatomy">
      <Table head={['Part', 'Code']} rows={Object.entries(card.parts ?? {}).map(([f, c]) => [f, c])} />
    </Section>
  </>
)

const specifications = (
  <>
    <Section title="Figma and code, side by side">
      <div className="flex flex-wrap gap-8">
        <div>
          <p className="mb-2 text-muted-foreground" style={text('paragraph-small-medium')}>Figma: {card.figma.componentSet}</p>
          <img src="figma/card-confirmation.png" alt="Figma Card" width={400} height={260} />
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={text('paragraph-small-medium')}>Code</p>
          <ConfirmationCard />
        </div>
      </div>
    </Section>
    <Section title="Measurements">
      <Table
        head={['Part', 'Figma', 'Code']}
        rows={[
          ['Card', '400 wide, radius-xl (14px), --card, 1px --border inside stroke', <Mono>w-100 rounded-xl bg-card inset-ring-border</Mono>],
          ['Header', '16px padding · title paragraph/bold · description paragraph small, --muted-foreground', <Mono>p-4 · text-base font-semibold · text-sm text-muted-foreground</Mono>],
          ['Body', '16px padding · 8px gap · 1px --border bottom stroke', <Mono>p-4 gap-2 inset-border-b</Mono>],
          ['Footer', '16px padding · 8px gap · --muted · buttons right', <Mono>p-4 gap-2 bg-muted justify-end</Mono>],
        ]}
      />
    </Section>
  </>
)

const code = (
  <>
    <Section title="Import">
      <Code>{`import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"`}</Code>
    </Section>
    <Section title="Example">
      <div className="mb-4"><ConfirmationCard /></div>
      <Code>{`<Card className="w-100">
  <CardHeader>
    <CardTitle>Confirmation</CardTitle>
    <CardDescription>Secondary description</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>`}</Code>
    </Section>
  </>
)

const accessibility = (
  <>
    <Section title="Structure">
      <Rules items={[
        'A card is a plain container. If the title is a real heading in your page, pass a heading element: <CardTitle><h2>…</h2></CardTitle>.',
        'Footer buttons follow the Button guidance: a clear verb, and Tab order from left to right.',
      ]} />
    </Section>
    <Section title="Contrast">
      <Table
        head={['Text', 'Light', 'Dark']}
        rows={[
          ['Title and body on --card', '--foreground', '--card'],
          ['Description on --card', '--muted-foreground', '--card'],
        ].map(([label, fg, bg]) => [
          label,
          <Contrast ratio={contrast(figmaColor(fg, 'light')!.hex, figmaColor(bg, 'light')!.hex)} />,
          <Contrast ratio={contrast(figmaColor(fg, 'dark')!.hex, figmaColor(bg, 'dark')!.hex)} />,
        ])}
      />
    </Section>
  </>
)

export function CardPage() {
  return (
    <ComponentPage
      title="Card"
      lead="Cards group related content with its actions. Designed in Figma first, then brought to code: the Phase 4 walkthrough."
      tabs={{ Guidelines: guidelines, Specifications: specifications, Code: code, Accessibility: accessibility }}
    />
  )
}
