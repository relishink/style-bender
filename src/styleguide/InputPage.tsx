import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/typography'
import { Code, ComponentPage, Contrast, Mono, Rules, Section, Table } from './ComponentPage'
import { contrast, figmaColor, mappingFor } from './tokens'
import { text } from './type'

const input = mappingFor('Input')!
const states = Object.entries(input.states!.values) // [Figma State, CSS state]
const figmaImage: Record<string, { src: string; w: number; h: number }> = {
  Default: { src: 'figma/input-default.png', w: 320, h: 32 },
  Hover: { src: 'figma/input-hover.png', w: 320, h: 32 },
  Focus: { src: 'figma/input-focus.png', w: 326, h: 38 },
  Error: { src: 'figma/input-error.png', w: 320, h: 32 },
  Disabled: { src: 'figma/input-disabled.png', w: 320, h: 32 },
}
const live: Record<string, React.ReactNode> = {
  Default: <Input placeholder="Placeholder" />,
  Hover: <Input placeholder="Hover over me" />,
  Focus: <Input placeholder="Click or Tab into me" />,
  Error: <Input placeholder="Placeholder" aria-invalid />,
  Disabled: <Input placeholder="Placeholder" disabled />,
}

function EmailField({ error }: { error?: boolean }) {
  return (
    <div className="flex w-80 flex-col gap-2">
      <label htmlFor={error ? 'email-error' : 'email'}>
        <Text as="span" size="small" weight="medium">Email</Text>
      </label>
      <Input
        id={error ? 'email-error' : 'email'}
        type="email"
        placeholder="you@example.com"
        defaultValue={error ? 'david@' : undefined}
        aria-invalid={error || undefined}
        aria-describedby={error ? 'email-error-message' : undefined}
      />
      {error && (
        <Text id="email-error-message" size="small" className="text-destructive">Enter a full email address, like you@example.com.</Text>
      )}
    </div>
  )
}

const guidelines = (
  <>
    <Section title="When to use">
      <Rules items={[
        'Use an input for short, single-line text: names, emails, search terms.',
        'Always pair it with a visible label; a placeholder is a hint, not a label.',
        'Show errors after the person leaves the field or submits, with a message that says how to fix it.',
      ]} />
    </Section>
    <Section title="Label and error message">
      <div className="flex flex-wrap gap-12">
        <EmailField />
        <EmailField error />
      </div>
    </Section>
  </>
)

const specifications = (
  <>
    <Section title="Figma and code, side by side">
      <p className="mb-4 text-muted-foreground" style={text('paragraph-normal')}>
        The Figma component was generated from this code. Hover and Focus need a mouse or keyboard: try them on the live inputs.
      </p>
      <Table
        head={['Figma state', 'Figma render', 'Code render', 'In code']}
        rows={states.map(([figma, css]) => [
          figma,
          <img className="max-w-none" src={figmaImage[figma].src} alt={`Figma Input, State=${figma}`} width={figmaImage[figma].w} height={figmaImage[figma].h} />,
          <div className="w-80">{live[figma]}</div>,
          <Mono>{css}</Mono>,
        ])}
      />
    </Section>
    <Section title="Measurements and tokens">
      <Table
        head={['Part', 'Value', 'Token or class']}
        rows={[
          ['Box', '32px high, 10px side padding, radius 10px', <Mono>h-8 px-2.5 rounded-lg</Mono>],
          ['Fill', 'Page background', <Mono>--background</Mono>],
          ['Border', '1px inside; hover and focus darker', <Mono>--input · --ring</Mono>],
          ['Focus ring', '3px, --ring at 50%', <Mono>--ring-focus</Mono>],
          ['Error', 'Border and 3px ring', <Mono>--destructive · --ring-error</Mono>],
          ['Text', 'paragraph small (16px below md)', <Mono>text-base md:text-sm</Mono>],
          ['Disabled', '50% opacity, --input at 50% fill', <Mono>disabled:opacity-50</Mono>],
        ]}
      />
    </Section>
  </>
)

const code = (
  <>
    <Section title="Import">
      <Code>{`import { Input } from "@/components/ui/input"`}</Code>
    </Section>
    <Section title="Props">
      <Table
        head={['Prop', 'Type', 'Figma']}
        rows={[
          ['placeholder', <Mono>string</Mono>, 'Placeholder (text property)'],
          ['aria-invalid', <Mono>boolean</Mono>, 'State=Error'],
          ['disabled', <Mono>boolean</Mono>, 'State=Disabled'],
          ['…', <Mono>all &lt;input&gt; props</Mono>, '—'],
        ]}
      />
    </Section>
    <Section title="Example with label and error">
      <div className="mb-4"><EmailField error /></div>
      <Code>{`<label htmlFor="email">Email</label>
<Input
  id="email"
  type="email"
  aria-invalid
  aria-describedby="email-error"
/>
<p id="email-error">Enter a full email address, like you@example.com.</p>`}</Code>
    </Section>
  </>
)

const accessibility = (
  <>
    <Section title="Labels, errors and keyboard">
      <Rules items={[
        'Every input needs a <label> (or aria-label). Placeholder text disappears as soon as someone types.',
        'Mark errors with aria-invalid and link the message with aria-describedby, so screen readers read it.',
        'The error is shown by the border and the message text, never by color alone.',
        'Focus shows a 3px ring; Tab moves between fields.',
        'Text is 16px on small screens so iOS does not zoom in on focus.',
      ]} />
    </Section>
    <Section title="Contrast">
      <Table
        head={['Text', 'Light', 'Dark']}
        rows={[
          ['Placeholder (--muted-foreground) on --background', ...(['light', 'dark'] as const).map((t) => <Contrast ratio={contrast(figmaColor('--muted-foreground', t)!.hex, figmaColor('--background', t)!.hex)} />)],
          ['Typed text (--foreground) on --background', ...(['light', 'dark'] as const).map((t) => <Contrast ratio={contrast(figmaColor('--foreground', t)!.hex, figmaColor('--background', t)!.hex)} />)],
          ['Error message (--destructive) on --background', ...(['light', 'dark'] as const).map((t) => <Contrast ratio={contrast(figmaColor('--destructive', t)!.hex, figmaColor('--background', t)!.hex)} />)],
        ]}
      />
    </Section>
  </>
)

export function InputPage() {
  return (
    <ComponentPage
      title="Input"
      lead="Inputs take short text. Built in code first, then generated in Figma from the code: matched 1:1 across Default, Hover, Focus, Error and Disabled."
      tabs={{ Guidelines: guidelines, Specifications: specifications, Code: code, Accessibility: accessibility }}
    />
  )
}
