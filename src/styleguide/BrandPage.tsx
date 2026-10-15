import { Logo, LogoMark } from '@/components/ui/logo'
import { ColorTable } from './ColorPage'
import { Code, Rules, Section, Table } from './ComponentPage'
import { PageHeader } from './Layout'
import { brandColors } from './tokens'
import { text } from './type'

// The logo on its brand surface. The dark panel sits in a `.dark` wrapper, so the same tokens
// resolve to their dark values: one component, two looks, no second file.
function Panel({ dark, children }: { dark?: boolean; children: React.ReactNode }) {
  return (
    <div className={dark ? 'dark' : undefined}>
      <div className="flex h-56 items-center justify-center rounded-xl bg-brand-surface px-10">{children}</div>
    </div>
  )
}

export function BrandPage() {
  return (
    <>
      <PageHeader
        title="Brand"
        lead="The Style Bender logo: a symbol and a wordmark, designed in Claude Design, built as components in Figma and drawn here from the same shapes and brand tokens."
      />

      <Section title="Logo">
        <div className="grid grid-cols-2 gap-4">
          <Panel><Logo className="h-14" /></Panel>
          <Panel dark><Logo className="h-14" /></Panel>
        </div>
        <p className="mt-4 text-muted-foreground" style={text('paragraph-small-normal')}>
          Light and dark are the same component. The colors are tokens, so the logo follows the theme by itself.
        </p>
      </Section>

      <Section title="Symbol">
        <div className="grid grid-cols-2 gap-4">
          {[false, true].map((dark) => (
            <Panel key={String(dark)} dark={dark}>
              <div className="flex items-end gap-10">
                <LogoMark className="size-32" />
                <LogoMark className="size-16" />
                <LogoMark className="size-8" />
                <LogoMark className="size-4" />
              </div>
            </Panel>
          ))}
        </div>
        <p className="mt-4 text-muted-foreground" style={text('paragraph-small-normal')}>
          128, 64, 32 and 16 pixels. The symbol is the favicon and app icon; use it where the full logo does not fit.
        </p>
      </Section>

      <Section title="Usage">
        <Rules
          items={[
            'Keep clear space around the logo equal to the height of the symbol’s small square handle.',
            'Use the full logo at 24px tall or more; below that, use the symbol alone.',
            'Place it on the brand surface, the page background, or a photo with enough contrast. Never on violet.',
            'Do not recolor, outline, stretch, rotate or add effects. Do not retype the wordmark: it is outlined Bricolage Grotesque ExtraBold.',
            'Brand colors are for the logo and brand moments only. Components keep the neutral shadcn theme.',
          ]}
        />
      </Section>

      <Section title="Colors">
        <p className="mb-4 text-muted-foreground" style={text('paragraph-normal')}>
          Exact values from the logo, as tokens in tokens/ (violet and ink primitives, brand-* roles). The same names are
          Figma variables under shadcn colors / brand, and npm run parity checks them.
        </p>
        <ColorTable tokens={brandColors} />
      </Section>

      <Section title="Figma and code">
        <Table
          head={['Figma (page “Brand (style-bender)”)', 'Code', 'Colors']}
          rows={[
            ['Symbol', 'LogoMark', '--brand, --brand-accent, --brand-foreground'],
            ['Logo', 'Logo', 'Symbol + --brand-ink (Style), --brand-wordmark (Bender)'],
          ]}
        />
      </Section>

      <Section title="Code">
        <Code>{'import { Logo, LogoMark } from "@/components/ui/logo"\n\n<Logo className="h-8" />\n<LogoMark className="size-6" />'}</Code>
        <p className="mt-4 text-muted-foreground" style={text('paragraph-small-normal')}>
          Both render role="img" with the name “Style Bender”. Inside a link, the link needs its own accessible name.
        </p>
      </Section>
    </>
  )
}
