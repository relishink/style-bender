import { Banner } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
import source from '@/components/ui/banner.tsx?raw'
import { Code, ComponentPage, Contrast, Mono, Rules, Section, Table } from './ComponentPage'
import { contrast, figmaColor, mappingFor, variantTokens } from './tokens'
import { text } from './type'

const banner = mappingFor('Banner')!
const kinds = Object.entries(banner.props.variant!.values) // [Figma Type, code value]
const tokens = variantTokens(source, 'variant')
const usage: Record<string, string> = {
  info: 'Neutral information that helps, such as a tip or a change in the product.',
  success: 'Confirms that something worked.',
  warning: 'Something needs attention before it becomes a problem.',
  error: 'Something failed or is blocking the user.',
}
const colorToken: Record<string, string> = { info: '--info', success: '--success', warning: '--warning', error: '--destructive' }

const guidelines = (
  <>
    <Section title="When to use">
      <Table head={['Kind', 'Use for']} rows={kinds.map(([, k]) => [<Mono>{k}</Mono>, usage[k]])} />
    </Section>
    <Section title="Content">
      <Rules items={[
        'Lead with the outcome in the title; put detail in the description.',
        'Keep the title to one line.',
        'Offer at most one action, and make it the next step ("Retry", "View details").',
      ]} />
    </Section>
  </>
)

const specifications = (
  <>
    <Section title="Figma and code, side by side">
      <p className="mb-4 text-muted-foreground" style={text('paragraph-normal')}>
        Top: the Figma component ({banner.figma.componentSet}), exported from the library. Bottom: the live component.
      </p>
      <div className="flex flex-col gap-6">
        {kinds.map(([figma, k]) => (
          <div key={k} className="grid grid-cols-[8rem_1fr] items-center gap-4">
            <Mono>Type={figma}</Mono>
            <div className="flex flex-col gap-2">
              <img src={`figma/banner-${k}.png`} alt={`Figma ${figma} banner`} width={400} height={36} />
              <div className="w-100"><Banner variant={k as never} title="Title" /></div>
            </div>
          </div>
        ))}
      </div>
    </Section>
    <Section title="Tokens">
      <Table head={['Kind', 'Code', 'Tokens used']} rows={kinds.map(([, k]) => [k, <Mono>variant="{k}"</Mono>, <Mono>{tokens[k]?.join(', ')}</Mono>])} />
      <p className="mt-3 text-muted-foreground" style={text('paragraph-small-normal')}>
        All kinds: --card background, --border, radius, 12px × 8px padding, 12px gap, paragraph small text.
      </p>
    </Section>
    <Section title="Figma properties">
      <Table head={['Figma property', 'In code']} rows={Object.entries(banner.otherProperties ?? {}).map(([f, c]) => [f, c])} />
    </Section>
  </>
)

const code = (
  <>
    <Section title="Import">
      <Code>{`import { Banner } from "@/components/ui/banner"`}</Code>
    </Section>
    <Section title="Props">
      <Table
        head={['Prop', 'Type', 'Figma property']}
        rows={[
          ['variant', <Mono>{kinds.map(([, k]) => k).join(' | ')}</Mono>, 'Type'],
          ['title', <Mono>ReactNode</Mono>, 'Title'],
          ['description', <Mono>ReactNode (optional)</Mono>, 'Description + Show Description'],
          ['action', <Mono>ReactNode (optional)</Mono>, 'Show Button'],
        ]}
      />
    </Section>
    <Section title="Example">
      <div className="mb-4 flex flex-col gap-3">
        <Banner variant="success" title="Changes saved" description="Your profile is up to date." />
        <Banner variant="error" title="Upload failed" description="The file is larger than 10 MB." action={<Button size="xs" variant="outline">Retry</Button>} />
      </div>
      <Code>{`<Banner variant="success" title="Changes saved" description="Your profile is up to date." />
<Banner
  variant="error"
  title="Upload failed"
  description="The file is larger than 10 MB."
  action={<Button size="xs" variant="outline">Retry</Button>}
/>`}</Code>
    </Section>
  </>
)

const accessibility = (
  <>
    <Section title="Screen readers">
      <Rules items={[
        'error and warning render with role="alert", so they are announced immediately.',
        'info and success render with role="status", so they are announced politely.',
        'The icon is decorative (aria-hidden); the title carries the meaning, so never rely on color alone.',
      ]} />
    </Section>
    <Section title="Contrast (text on --card)">
      <Table
        head={['Kind', 'Light', 'Dark']}
        rows={kinds.map(([, k]) => [
          k,
          <Contrast ratio={contrast(figmaColor(colorToken[k], 'light')!.hex, figmaColor('--card', 'light')!.hex)} />,
          <Contrast ratio={contrast(figmaColor(colorToken[k], 'dark')!.hex, figmaColor('--card', 'dark')!.hex)} />,
        ])}
      />
      <p className="mt-3 text-muted-foreground" style={text('paragraph-small-normal')}>
        Success and warning use the 700 shade in light mode because green-600 and amber-600 are only 3.2:1 on white.
      </p>
    </Section>
  </>
)

export function BannerPage() {
  return (
    <ComponentPage
      title="Banner"
      lead="Banners show a short status message in the page. Reworked from shadcn's Alert into four kinds, matched 1:1 with the Figma Banner component."
      tabs={{ Guidelines: guidelines, Specifications: specifications, Code: code, Accessibility: accessibility }}
    />
  )
}
