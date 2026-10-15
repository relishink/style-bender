import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Code, ComponentPage, Contrast, Mono, Rules, Section, Table } from './ComponentPage'
import { contrast, figmaColor, mappingFor } from './tokens'
import { text } from './type'

const pagination = mappingFor('Pagination')!
const numberButton = mappingFor('Pagination Number Button')!

// The Figma component's default content, so the two renders can be compared directly.
function Example({ page = 1, last = 10, disabledPrevious = false }: { page?: number; last?: number; disabledPrevious?: boolean }) {
  const pages = last <= 4 ? Array.from({ length: last }, (_, i) => i + 1) : [1, 2, 3, 4]
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" disabled={disabledPrevious} /></PaginationItem>
        {pages.map((p) => (
          <PaginationItem key={p}><PaginationLink href="#" isActive={p === page}>{p}</PaginationLink></PaginationItem>
        ))}
        {last > 4 && (
          <>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive={page === last}>{last}</PaginationLink></PaginationItem>
          </>
        )}
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const guidelines = (
  <>
    <Section title="When to use">
      <Rules items={[
        'Split a long list or table into pages when people need to jump to a specific page.',
        'For feeds people scroll through, prefer "Load more" or infinite scroll instead.',
        'Show the first and last page, the current page and its neighbours; use the ellipsis for the gaps.',
      ]} />
    </Section>
    <Section title="Examples">
      <div className="flex flex-col gap-4">
        <Example />
        <Example page={2} last={3} />
        <Example last={1} disabledPrevious />
      </div>
    </Section>
  </>
)

const specifications = (
  <>
    <Section title="Figma and code, side by side">
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-muted-foreground" style={text('paragraph-small-medium')}>Figma: {pagination.figma.componentSet}</p>
          <img src="figma/pagination.png" alt="Figma Pagination" width={377} height={32} />
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={text('paragraph-small-medium')}>Code</p>
          <Example />
        </div>
      </div>
    </Section>
    <Section title="Anatomy">
      <Table head={['Figma part', 'Code']} rows={Object.entries(pagination.parts ?? {}).map(([f, c]) => [f, c])} />
    </Section>
    <Section title="Measurements">
      <Table
        head={['Part', 'Figma', 'Code']}
        rows={[
          ['Row', '8px gap (spacing xs)', <Mono>gap-2</Mono>],
          ['Previous / Next', 'Button, Ghost, Default size, no icons', <Mono>Button variant="ghost" size="default"</Mono>],
          ['Page number', `32 × 32 · Active=On: Outline · Active=Off: Ghost`, <Mono>size="icon" · isActive</Mono>],
          ['Ellipsis', '32 × 32 ghost Icon Button, Lucide ellipsis', <Mono>size-8 · MoreHorizontalIcon</Mono>],
        ]}
      />
    </Section>
  </>
)

const code = (
  <>
    <Section title="Import">
      <Code>{`import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"`}</Code>
    </Section>
    <Section title="Props">
      <Table
        head={['Component', 'Prop', 'Figma property']}
        rows={[
          ['PaginationLink', <Mono>isActive?: boolean</Mono>, `${numberButton.figma.componentSet}: Active=On / Off`],
          ['PaginationLink, PaginationPrevious, PaginationNext', <Mono>disabled?: boolean</Mono>, 'Button State=Disabled'],
          ['PaginationPrevious, PaginationNext', <Mono>text?: string</Mono>, 'Button label'],
        ]}
      />
    </Section>
    <Section title="Example">
      <div className="mb-4"><Example /></div>
      <Code>{`<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`}</Code>
    </Section>
  </>
)

const accessibility = (
  <>
    <Section title="Screen readers and keyboard">
      <Rules items={[
        'The row is a <nav> labelled "pagination", so it shows up as a landmark.',
        'The current page carries aria-current="page".',
        'Previous and Next have labels ("Go to previous page") as well as their visible text.',
        'A disabled link gets aria-disabled and is removed from the Tab order.',
        'The ellipsis is decorative and hidden from screen readers.',
      ]} />
    </Section>
    <Section title="Contrast">
      <Table
        head={['Text', 'Light', 'Dark']}
        rows={[[
          'Page numbers and labels on --background',
          <Contrast ratio={contrast(figmaColor('--foreground', 'light')!.hex, figmaColor('--background', 'light')!.hex)} />,
          <Contrast ratio={contrast(figmaColor('--foreground', 'dark')!.hex, figmaColor('--background', 'dark')!.hex)} />,
        ]]}
      />
    </Section>
  </>
)

export function PaginationPage() {
  return (
    <ComponentPage
      title="Pagination"
      lead="Pagination moves between pages of a long list. Built from our own Buttons, matched 1:1 with the Figma Pagination component."
      tabs={{ Guidelines: guidelines, Specifications: specifications, Code: code, Accessibility: accessibility }}
    />
  )
}
