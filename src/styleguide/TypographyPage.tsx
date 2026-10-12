import { typeStyles } from './tokens'
import { PageHeader } from './Layout'
import { text } from './type'

export function TypographyPage() {
  return (
    <>
      <PageHeader
        title="Typography"
        lead="Text styles are typography tokens named after the Figma text styles. Each specimen below is rendered from its token, and the parity check compares family, weight, size, line height and letter spacing with Figma."
      />
      <div className="flex flex-col">
        {typeStyles.map((s) => (
          <section key={s.id} className="grid grid-cols-[1fr_16rem] gap-8 border-b border-border py-6">
            <p style={text(s.css.replace('--type-', ''))}>The quick brown fox jumps over the lazy dog</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground" style={text('paragraph-mini-normal')}>
              <dt>Figma</dt><dd className="text-foreground">{s.figma ?? 'Not in Figma'}</dd>
              <dt>CSS</dt><dd style={text('monospace-mini-normal')}>{s.css}</dd>
              <dt>Font</dt><dd>{s.family} {s.weight}</dd>
              <dt>Size</dt><dd>{s.size}px / {s.lineHeight}px</dd>
              <dt>Tracking</dt><dd>{s.letterSpacing}px</dd>
            </dl>
          </section>
        ))}
      </div>
    </>
  )
}
