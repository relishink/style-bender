import { colorGroups, primitiveColors, snapshotDate, type ColorToken, type FigmaColor } from './tokens'
import { PageHeader } from './Layout'
import { text } from './type'

const hex = (c?: FigmaColor) => (c ? c.hex + (c.alpha < 1 ? ` ${Math.round(c.alpha * 100)}%` : '') : '—')

// The dark swatch sits inside a `.dark` wrapper, so the same CSS variable resolves to its dark value.
function Swatch({ css, dark }: { css: string; dark?: boolean }) {
  return (
    <div className={dark ? 'dark rounded-md bg-background p-1' : 'rounded-md bg-background p-1'}>
      <div className="h-10 w-16 rounded-sm border border-border" style={{ backgroundColor: `var(${css})` }} />
    </div>
  )
}

function ColorTable({ tokens }: { tokens: ColorToken[] }) {
  return (
    <table className="w-full border-collapse text-left" style={text('paragraph-small-normal')}>
      <thead className="text-muted-foreground" style={text('paragraph-mini-medium')}>
        <tr className="border-b border-border">
          <th className="py-2 pr-4 font-medium">Light</th>
          <th className="py-2 pr-4 font-medium">Dark</th>
          <th className="py-2 pr-4 font-medium">CSS variable</th>
          <th className="py-2 pr-4 font-medium">Figma variable</th>
          <th className="py-2 font-medium">Value (light / dark)</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => (
          <tr key={t.css} className="border-b border-border">
            <td className="py-2 pr-4"><Swatch css={t.css} /></td>
            <td className="py-2 pr-4"><Swatch css={t.css} dark /></td>
            <td className="py-2 pr-4" style={text('monospace-small-normal')}>{t.css}</td>
            <td className="py-2 pr-4 text-muted-foreground">{t.figma ?? 'Not in Figma'}</td>
            <td className="py-2" style={text('monospace-mini-normal')}>{hex(t.light)} / {hex(t.dark)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function ColorPage() {
  return (
    <>
      <PageHeader
        title="Color"
        lead="Colors are design tokens in tokens/, built into CSS variables. Every token below is linked to a Figma variable with the same CSS name, and the parity check proves the values match."
      />
      <p className="mb-10 text-muted-foreground" style={text('paragraph-small-normal')}>
        Figma values from the snapshot taken {new Date(snapshotDate).toLocaleString()}. Run <code>npm run parity</code> to recheck.
      </p>
      {colorGroups.map((g) => (
        <section key={g.title} className="mb-12">
          <h2 style={text('heading-3')}>{g.title}</h2>
          <p className="mt-2 mb-4 text-muted-foreground" style={text('paragraph-normal')}>{g.description}</p>
          <ColorTable tokens={g.tokens} />
        </section>
      ))}
      <section className="mb-12">
        <h2 style={text('heading-3')}>Primitives</h2>
        <p className="mt-2 mb-4 text-muted-foreground" style={text('paragraph-normal')}>
          The raw palette. Semantic tokens point at these; components never use them directly.
        </p>
        <ColorTable tokens={primitiveColors} />
      </section>
    </>
  )
}
