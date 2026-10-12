import { useState, type ReactNode } from 'react'
import { PageHeader } from './Layout'
import { text } from './type'

const TABS = ['Guidelines', 'Specifications', 'Code', 'Accessibility'] as const
export type Tab = (typeof TABS)[number]

// Carbon-style component page: one header, four tabs.
export function ComponentPage({ title, lead, tabs }: { title: string; lead: string; tabs: Record<Tab, ReactNode> }) {
  const [tab, setTab] = useState<Tab>('Guidelines')
  return (
    <>
      <PageHeader title={title} lead={lead} />
      <div role="tablist" aria-label={`${title} documentation`} className="mb-10 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className="-mb-px border-b-2 border-transparent px-3 py-2 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-selected:border-foreground aria-selected:text-foreground"
            style={text('paragraph-small-medium')}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>{tabs[tab]}</div>
    </>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4" style={text('heading-3')}>{title}</h2>
      {children}
    </section>
  )
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <table className="w-full border-collapse text-left" style={text('paragraph-small-normal')}>
      <thead className="text-muted-foreground" style={text('paragraph-mini-medium')}>
        <tr className="border-b border-border">{head.map((h) => <th key={h} className="py-2 pr-4 font-medium">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-border align-middle">
            {r.map((c, j) => <td key={j} className="py-3 pr-4">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const Mono = ({ children }: { children: ReactNode }) => <span style={text('monospace-mini-normal')}>{children}</span>

export function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4" style={text('monospace-small-normal')}>
      <code>{children}</code>
    </pre>
  )
}

export function Rules({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5" style={text('paragraph-normal')}>
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  )
}

export function Contrast({ ratio }: { ratio: number }) {
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large only' : 'Fails'
  return <Mono>{ratio.toFixed(2)}:1 · {level}</Mono>
}
