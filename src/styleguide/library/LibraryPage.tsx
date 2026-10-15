import type { ReactNode } from 'react'
import { Code, ComponentPage, Mono, Rules, Section, Table } from '../ComponentPage'
import { mappingFor } from '../tokens'
import { text } from '../type'

// One docs page for a library-level component: shadcn code, mapped to the Figma kit and checked by
// npm run parity (variants and props both ways, radius token). No Figma render or pixel diff.
export type LibraryEntry = {
  path: string
  name: string
  /** Name in figma-map.json, if different from `name` */
  mapping?: string
  lead: string
  use: string[]
  examples: ReactNode
  importLine: string
  code: string
  props: [string, string, string][]
  a11y: string[]
}

type Axis = { figmaProperty: string; values: Record<string, unknown>; kind?: string; codeOnly?: string[] }

export function LibraryPage({ entry }: { entry: LibraryEntry }) {
  const found = mappingFor(entry.mapping ?? entry.name)
  const m = (found ?? { figma: null, code: null, props: {} }) as unknown as {
    figma: { componentSet: string; page: string; nodeId: string } | null
    code: { file: string; export: string } | null
    props: Record<string, Axis>
    states?: Axis
    figmaOnly?: Record<string, string>
  }
  const rows: ReactNode[][] = []
  for (const [prop, axis] of Object.entries(m.props ?? {}))
    for (const [figma, value] of Object.entries(axis.values))
      rows.push([`${axis.figmaProperty}=${figma}`, <Mono>{prop}={JSON.stringify(value)}</Mono>])
  for (const [figma, css] of Object.entries(m.states?.values ?? {}))
    rows.push([`${m.states!.figmaProperty}=${figma}`, <Mono>{String(css)}</Mono>])
  for (const [figmaProp, how] of Object.entries(m.figmaOnly ?? {})) rows.push([`${figmaProp} (Figma only)`, how])

  return (
    <ComponentPage
      title={entry.name}
      lead={entry.lead}
      tabs={{
        Guidelines: (
          <>
            <Section title="When to use"><Rules items={entry.use} /></Section>
            <Section title="Examples"><div className="flex flex-col items-start gap-6">{entry.examples}</div></Section>
          </>
        ),
        Specifications: (
          <>
            <Section title="Figma and code">
              {!m.figma ? <p style={text('paragraph-normal')}>The free Figma kit has no {entry.name} component, so this one is code only and not part of the parity check.</p> : <>
              <p className="mb-4 text-muted-foreground" style={text('paragraph-normal')}>
                Figma: “{m.figma.componentSet}” on the “{m.figma.page}” page of the kit. Code: {m.code!.file}. npm run parity checks
                this mapping in both directions and compares the corner radius token.
              </p>
              {rows.length > 0 ? <Table head={['Figma', 'Code']} rows={rows} /> : <p style={text('paragraph-normal')}>No variants to map.</p>}
              </>}
            </Section>
          </>
        ),
        Code: (
          <>
            <Section title="Import"><Code>{entry.importLine}</Code></Section>
            {entry.props.length > 0 && <Section title="Props"><Table head={['Prop', 'Type', 'Figma']} rows={entry.props.map(([p, t, f]) => [p, <Mono>{t}</Mono>, f])} /></Section>}
            <Section title="Example"><Code>{entry.code}</Code></Section>
          </>
        ),
        Accessibility: <Section title="Accessibility"><Rules items={entry.a11y} /></Section>,
      }}
    />
  )
}
