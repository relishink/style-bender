import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import source from '@/components/ui/button.tsx?raw'
import { Code, ComponentPage, Contrast, Mono, Rules, Section, Table } from './ComponentPage'
import { contrast, figmaColor, mappingFor, variantTokens } from './tokens'
import { text } from './type'

const button = mappingFor('Button')!
const variants = Object.entries(button.props.variant.values) // [Figma name, code value]
const sizes = Object.entries(button.props.size!.values)
const tokens = variantTokens(source, 'variant')
const figmaImage: Record<string, string> = {
  default: 'primary', secondary: 'secondary', outline: 'outline', ghost: 'ghost', destructive: 'destructive', link: 'link',
}
// Measured from the Figma component set (Primary, State=Default); code values come from button.tsx classes.
const sizeSpec: Record<string, string> = {
  xs: '24px high · 8px side padding · 12px text · radius-md',
  sm: '28px high · 10px side padding · 14px text · radius-md',
  default: '32px high · 10px side padding · 14px text · radius',
  lg: '36px high · 10px side padding · 14px text · radius',
}
const usage: Record<string, string> = {
  default: 'The main action in a view. Use one per area.',
  secondary: 'Actions that support the main action.',
  outline: 'Less important actions, or many actions side by side.',
  ghost: 'Low-emphasis actions in toolbars and dense layouts.',
  destructive: 'Actions that delete or cannot be undone.',
  link: 'Navigation that should look like a link.',
}

const guidelines = (
  <>
    <Section title="When to use">
      <Table head={['Variant', 'Use for']} rows={variants.map(([, v]) => [<Button variant={v as never}>{v}</Button>, usage[v]])} />
    </Section>
    <Section title="Sizes">
      <div className="flex items-center gap-3">{sizes.map(([, s]) => <Button key={s} size={s as never}>Size {s}</Button>)}</div>
    </Section>
    <Section title="Content">
      <Rules items={[
        'Start with a verb that says what happens: "Save changes", not "OK".',
        'Use sentence case and keep it to one to three words.',
        'Put one default (primary) button in a group; the rest are secondary, outline or ghost.',
        'Use destructive only for the action that actually destroys something, not for "Cancel".',
      ]} />
    </Section>
  </>
)

const specifications = (
  <>
    <Section title="Figma and code, side by side">
      <p className="mb-4 text-muted-foreground" style={text('paragraph-normal')}>
        Left: the Figma component ({button.figma.componentSet}, State=Default), exported from the library. Right: the live component.
      </p>
      <Table
        head={['Figma variant', 'Figma render', 'Code render', 'Code', 'Tokens used']}
        rows={variants.map(([figma, v]) => [
          figma,
          <img src={`figma/button-${figmaImage[v]}.png`} alt={`Figma ${figma} button`} width={57} height={32} />,
          <Button variant={v as never}>Label</Button>,
          <Mono>variant="{v}"</Mono>,
          <Mono>{tokens[v]?.join(', ') || '—'}</Mono>,
        ])}
      />
    </Section>
    <Section title="Sizes">
      <Table head={['Figma size', 'Code', 'Spec']} rows={sizes.map(([figma, s]) => [figma, <Mono>size="{s}"</Mono>, sizeSpec[s]])} />
    </Section>
    <Section title="States">
      <Table
        head={['Figma state', 'In code']}
        rows={Object.entries(button.states!.values).map(([figma, css]) => [figma, <Mono>{css}</Mono>])}
      />
    </Section>
  </>
)

const code = (
  <>
    <Section title="Import">
      <Code>{`import { Button } from "@/components/ui/button"`}</Code>
    </Section>
    <Section title="Props">
      <Table
        head={['Prop', 'Values', 'Default', 'Figma property']}
        rows={[
          ['variant', <Mono>{variants.map(([, v]) => v).join(' | ')}</Mono>, <Mono>default</Mono>, 'Variant'],
          ['size', <Mono>{[...sizes.map(([, s]) => s), ...(button.props.size!.codeOnly ?? [])].join(' | ')}</Mono>, <Mono>default</Mono>, 'Size (icon sizes: Icon Button)'],
          ['disabled', <Mono>boolean</Mono>, <Mono>false</Mono>, 'State=Disabled'],
        ]}
      />
    </Section>
    <Section title="Examples">
      <div className="mb-4 flex items-center gap-3">
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="outline" size="icon" aria-label="Add item"><Plus /></Button>
        <Button disabled>Disabled</Button>
      </div>
      <Code>{`<Button>Save changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="outline" size="icon" aria-label="Add item"><Plus /></Button>
<Button disabled>Disabled</Button>`}</Code>
    </Section>
  </>
)

const pairs: [string, string, string][] = [
  ['default', '--primary-foreground', '--primary'],
  ['secondary', '--secondary-foreground', '--secondary'],
  ['outline', '--foreground', '--background'],
  ['ghost', '--foreground', '--background'],
  ['destructive', '--destructive', '--background'],
]
const accessibility = (
  <>
    <Section title="Keyboard">
      <Rules items={[
        'Tab moves focus to the button; Enter and Space activate it.',
        'Focus shows a 3px ring in --ring at 50%, matching Figma State=Focus.',
        'Disabled buttons cannot be focused or activated.',
      ]} />
    </Section>
    <Section title="Labels">
      <Rules items={[
        'The visible text is the accessible name, so make it describe the action.',
        'Icon-only buttons (size="icon…") need an aria-label.',
      ]} />
    </Section>
    <Section title="Contrast (text on its background)">
      <Table
        head={['Variant', 'Light', 'Dark']}
        rows={pairs.map(([v, fg, bg]) => [
          v,
          <Contrast ratio={contrast(figmaColor(fg, 'light')!.hex, figmaColor(bg, 'light')!.hex)} />,
          <Contrast ratio={contrast(figmaColor(fg, 'dark')!.hex, figmaColor(bg, 'dark')!.hex)} />,
        ])}
      />
      <p className="mt-3 text-muted-foreground" style={text('paragraph-small-normal')}>
        Computed from the Figma values in the parity snapshot. Destructive uses a 10% tint of --destructive behind the text, so the real ratio is a little lower.
      </p>
    </Section>
  </>
)

export function ButtonPage() {
  return (
    <ComponentPage
      title="Button"
      lead="Buttons trigger actions. Six variants and four sizes, matched 1:1 with the Figma Button component."
      tabs={{ Guidelines: guidelines, Specifications: specifications, Code: code, Accessibility: accessibility }}
    />
  )
}
