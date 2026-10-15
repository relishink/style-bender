import { useState } from 'react'
import { BadgeCheckIcon, CalendarIcon, ChevronRightIcon, FolderOpenIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { LibraryEntry } from './LibraryPage'
import { text } from '../type'

const row = 'flex flex-wrap items-center gap-4'
const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango']

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border border-border" />
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date>()
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-56 justify-start" />}>
        <CalendarIcon />
        {date ? date.toLocaleDateString(undefined, { dateStyle: 'medium' }) : <span className="text-muted-foreground">Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
    </Popover>
  )
}

function ComboboxDemo() {
  return (
    <Combobox items={fruits}>
      <ComboboxInput placeholder="Pick a fruit" className="w-64" />
      <ComboboxContent>
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function MultiComboboxDemo() {
  const anchor = useComboboxAnchor()
  return (
    <Combobox items={fruits} multiple defaultValue={['Apple', 'Mango']}>
      <ComboboxChips ref={anchor} className="w-80">
        <ComboboxValue>{(values: string[]) => values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}</ComboboxValue>
        <ComboboxChipsInput placeholder="Add fruit" />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export const batch4: LibraryEntry[] = [
  {
    path: 'calendar', name: 'Calendar',
    lead: 'A month grid for picking a date or a range.',
    use: ['Show it inline when the date is the main task (booking).', 'Inside forms, use a Date Picker so the calendar only opens when needed.', 'Use mode="range" for a start and end date.'],
    examples: <CalendarDemo />,
    importLine: 'import { Calendar } from "@/components/ui/calendar"',
    code: 'const [date, setDate] = useState<Date>()\n\n<Calendar mode="single" selected={date} onSelect={setDate} />',
    props: [['mode', '"single" | "multiple" | "range"', '—'], ['numberOfMonths', 'number', 'Months=1 / 2 / 3 Months'], ['--cell-radius', 'radius-md', 'Day and weekday cells (radius-md)']],
    a11y: ['Renders a grid; arrow keys move between days, Page Up and Page Down change month.', 'Each day has a full date label for screen readers.'],
  },
  {
    path: 'combobox', name: 'Combobox',
    lead: 'A text field with a filtered list of options to pick from.',
    use: ['Use instead of a Select when there are many options and typing helps find one.', 'Use the chips version to pick several.', 'Always say what happens when nothing matches.'],
    examples: <div className="flex flex-col items-start gap-6"><ComboboxDemo /><MultiComboboxDemo /></div>,
    importLine: 'import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "@/components/ui/combobox"',
    code: '<Combobox items={fruits}>\n  <ComboboxInput placeholder="Pick a fruit" />\n  <ComboboxContent>\n    <ComboboxEmpty>No fruit found.</ComboboxEmpty>\n    <ComboboxList>\n      {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}\n    </ComboboxList>\n  </ComboboxContent>\n</Combobox>',
    props: [['multiple', 'boolean', 'Multi Combobox - Nova (chips); single uses Select & Combobox - Nova'], ['ComboboxChip', 'component', 'Multi Combobox Tag (radius-sm)']],
    a11y: ['Renders role="combobox" with a listbox; arrow keys move through options, Enter picks one.', 'Chips can be removed with Backspace from the input.'],
  },
  {
    path: 'date-picker', name: 'Date Picker',
    lead: 'A button that opens a Calendar in a Popover.',
    use: ['Use in forms for a single date.', 'For dates far in the past (a birthday), an Input with a date format is faster than paging months.'],
    examples: <DatePickerDemo />,
    importLine: 'import { Calendar } from "@/components/ui/calendar"\nimport { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"',
    code: '<Popover>\n  <PopoverTrigger render={<Button variant="outline" />}>\n    <CalendarIcon /> {date ? format(date) : "Pick a date"}\n  </PopoverTrigger>\n  <PopoverContent className="w-auto p-0">\n    <Calendar mode="single" selected={date} onSelect={setDate} />\n  </PopoverContent>\n</Popover>',
    props: [],
    a11y: ['The trigger is a button; give it a label that includes the chosen date.', 'Focus moves into the calendar when it opens and back to the button on Escape.'],
  },
  {
    path: 'field', name: 'Field',
    lead: 'Puts a label, a control, help text and an error together.',
    use: ['Wrap every form control in a Field so spacing and errors are consistent.', 'Group related fields in a FieldSet with a FieldLegend.', 'Use orientation="horizontal" for checkboxes and switches.'],
    examples: (
      <FieldSet className="w-96">
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field><FieldLabel htmlFor="lib-field-name">Full name</FieldLabel><Input id="lib-field-name" placeholder="David" /><FieldDescription>As it appears on your invoices.</FieldDescription></Field>
          <Field data-invalid><FieldLabel htmlFor="lib-field-email">Email</FieldLabel><Input id="lib-field-email" defaultValue="david@" aria-invalid /><FieldError>Enter a complete email address.</FieldError></Field>
          <Field orientation="horizontal"><Checkbox id="lib-field-news" /><FieldLabel htmlFor="lib-field-news">Send me product news</FieldLabel></Field>
        </FieldGroup>
      </FieldSet>
    ),
    importLine: 'import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field"',
    code: '<Field data-invalid>\n  <FieldLabel htmlFor="email">Email</FieldLabel>\n  <Input id="email" aria-invalid />\n  <FieldError>Enter a complete email address.</FieldError>\n</Field>',
    props: [['orientation', '"vertical" | "horizontal" | "responsive"', 'Vertical Field / Horizontal Field sets'], ['data-invalid', 'boolean', 'State=Error']],
    a11y: ['FieldLabel is a real <label>: connect it with htmlFor.', 'FieldError renders role="alert"; link it to the control with aria-describedby when you need it read on focus.'],
  },
  {
    path: 'input-group', name: 'Input Group',
    lead: 'An Input with icons, text or buttons attached.',
    use: ['Add a search icon, a unit (“kg”), a prefix (“https://”) or an inline button.', 'Keep addons short; the input should stay the main thing.'],
    examples: (
      <div className="flex w-80 flex-col gap-4">
        <InputGroup><InputGroupInput placeholder="Search" /><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupAddon align="inline-end"><InputGroupText>12 results</InputGroupText></InputGroupAddon></InputGroup>
        <InputGroup><InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon><InputGroupInput placeholder="style-bender.dev" /></InputGroup>
        <InputGroup><InputGroupInput placeholder="Invalid" aria-invalid /></InputGroup>
      </div>
    ),
    importLine: 'import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText, InputGroupButton } from "@/components/ui/input-group"',
    code: '<InputGroup>\n  <InputGroupInput placeholder="Search" />\n  <InputGroupAddon>\n    <SearchIcon />\n  </InputGroupAddon>\n</InputGroup>',
    props: [['align (InputGroupAddon)', '"inline-start" | "inline-end" | "block-start" | "block-end"', 'Position=Left / Right (Input - Nova)']],
    a11y: ['Icons are decorative; the input still needs a label.', 'Text addons such as units should also be in the label or aria-describedby.'],
  },
  {
    path: 'input-otp', name: 'Input OTP',
    lead: 'One box per character for one-time codes.',
    use: ['Use for verification codes sent by email or text.', 'Paste must work: people copy codes.', 'Split long codes into groups with a separator.'],
    examples: (
      <InputOTP maxLength={6}>
        <InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup>
      </InputOTP>
    ),
    importLine: 'import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"',
    code: '<InputOTP maxLength={6}>\n  <InputOTPGroup>\n    <InputOTPSlot index={0} />\n    <InputOTPSlot index={1} />\n    <InputOTPSlot index={2} />\n  </InputOTPGroup>\n</InputOTP>',
    props: [['maxLength', 'number', 'number of slots'], ['aria-invalid', 'boolean', 'State=Error'], ['disabled', 'boolean', 'State=Disabled']],
    a11y: ['It is one real input underneath, so screen readers and password managers see a single field.', 'Use autoComplete="one-time-code" so phones can fill it from a text message.'],
  },
  {
    path: 'native-select', name: 'Native Select',
    lead: 'The browser’s own select, styled like ours.',
    use: ['Use on mobile-heavy forms, where the system picker is easier to use.', 'Use Select for custom option content, and Combobox for long lists.'],
    examples: (
      <div className={row}>
        <NativeSelect defaultValue="apple">{fruits.map((f) => <NativeSelectOption key={f} value={f.toLowerCase()}>{f}</NativeSelectOption>)}</NativeSelect>
        <NativeSelect size="sm" defaultValue="banana">{fruits.map((f) => <NativeSelectOption key={f} value={f.toLowerCase()}>{f}</NativeSelectOption>)}</NativeSelect>
        <NativeSelect aria-invalid defaultValue="apple">{fruits.map((f) => <NativeSelectOption key={f} value={f.toLowerCase()}>{f}</NativeSelectOption>)}</NativeSelect>
      </div>
    ),
    importLine: 'import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"',
    code: '<NativeSelect defaultValue="apple">\n  <NativeSelectOption value="apple">Apple</NativeSelectOption>\n  <NativeSelectOption value="banana">Banana</NativeSelectOption>\n</NativeSelect>',
    props: [['size', '"default" | "sm"', 'Size=Default / Small (Select & Combobox - Nova)'], ['aria-invalid', 'boolean', 'State=Error']],
    a11y: ['A real <select>: keyboard, screen readers and mobile pickers all work out of the box.', 'Needs a label like any field.'],
  },  {
    path: 'carousel', name: 'Carousel',
    lead: 'A row of slides with previous and next buttons.',
    use: ['Use for galleries and optional, browsable content.', 'Never hide important content in later slides: most people only see the first one.'],
    examples: (
      <div className="px-12">
        <Carousel className="w-64">
          <CarouselContent>
            {[1, 2, 3, 4, 5].map((n) => <CarouselItem key={n}><div className="flex aspect-square items-center justify-center rounded-xl bg-muted" style={text('heading-2')}>{n}</div></CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious /><CarouselNext />
        </Carousel>
      </div>
    ),
    importLine: 'import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"',
    code: '<Carousel>\n  <CarouselContent>\n    <CarouselItem>…</CarouselItem>\n    <CarouselItem>…</CarouselItem>\n  </CarouselContent>\n  <CarouselPrevious />\n  <CarouselNext />\n</Carousel>',
    props: [['orientation', '"horizontal" | "vertical"', 'Carousel (Horizontal) / (Vertical) - Nova'], ['opts', 'Embla options', '—']],
    a11y: ['Renders role="region" with aria-roledescription="carousel"; each slide is a group.', 'Left and Right arrow keys move between slides; the buttons have labels.'],
  },
  {
    path: 'empty', name: 'Empty',
    lead: 'What to show when there is nothing to show yet.',
    use: ['Say what would be here and how to add it.', 'Offer the one action that fixes it.', 'Use the outline or background look inside cards and tables.'],
    examples: (
      <Empty className="w-[min(100%,calc(var(--spacing)*120))] border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Create your first project to start comparing Figma and code.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button>Create project</Button></EmptyContent>
      </Empty>
    ),
    importLine: 'import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"',
    code: '<Empty className="border border-dashed">\n  <EmptyHeader>\n    <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>\n    <EmptyTitle>No projects yet</EmptyTitle>\n  </EmptyHeader>\n  <EmptyContent><Button>Create project</Button></EmptyContent>\n</Empty>',
    props: [['className border / border-dashed / bg-muted', 'look', 'Variant=Outline / Outline dashed / Background'], ['variant (EmptyMedia)', '"default" | "icon"', '—']],
    a11y: ['The title is plain text; if the empty state replaces a list, keep the list’s heading so people know where they are.'],
  },
  {
    path: 'item', name: 'Item',
    lead: 'A row with media, a title, a description and actions.',
    use: ['Build lists of people, files, settings or notifications.', 'Keep one main action per row; put the rest in a menu.'],
    examples: (
      <div className="flex w-96 flex-col gap-4">
        <Item variant="outline"><ItemContent><ItemTitle>Basic item</ItemTitle><ItemDescription>A title and a short description.</ItemDescription></ItemContent><ItemActions><Button variant="outline" size="sm">Action</Button></ItemActions></Item>
        <Item variant="muted" size="sm" render={<a href="#item" />}><ItemMedia><BadgeCheckIcon /></ItemMedia><ItemContent><ItemTitle>Your profile is verified</ItemTitle></ItemContent><ItemActions><ChevronRightIcon /></ItemActions></Item>
      </div>
    ),
    importLine: 'import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item"',
    code: '<Item variant="outline">\n  <ItemContent>\n    <ItemTitle>Basic item</ItemTitle>\n    <ItemDescription>A short description.</ItemDescription>\n  </ItemContent>\n  <ItemActions>\n    <Button size="sm">Action</Button>\n  </ItemActions>\n</Item>',
    props: [['variant', '"default" | "outline" | "muted"', 'Variant=Default / Outline / Muted'], ['size', '"default" | "sm" | "xs"', 'Size=Default / Small / Extra Small'], ['render', 'element', 'Interaction=Default / Hover (a link or button)']],
    a11y: ['A plain Item is a <div>; render it as a link or button when the whole row is clickable.', 'Do not nest buttons inside a clickable row.'],
  },
  {
    path: 'resizable', name: 'Resizable',
    lead: 'Panels that people can resize by dragging the handle between them.',
    use: ['Use in tool-like layouts: editors, mail clients, side-by-side views.', 'Set sensible minimum sizes so panels never collapse to nothing by accident.'],
    examples: (
      <ResizablePanelGroup orientation="horizontal" className="max-w-md rounded-lg border border-border" style={{ height: 'calc(var(--spacing) * 48)' }}>
        <ResizablePanel defaultSize="40%"><div className="flex h-full items-center justify-center">Sidebar</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="60%"><div className="flex h-full items-center justify-center">Content</div></ResizablePanel>
      </ResizablePanelGroup>
    ),
    importLine: 'import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"',
    code: '<ResizablePanelGroup orientation="horizontal">\n  <ResizablePanel defaultSize="40%">Sidebar</ResizablePanel>\n  <ResizableHandle withHandle />\n  <ResizablePanel defaultSize="60%">Content</ResizablePanel>\n</ResizablePanelGroup>',
    props: [['orientation (group)', '"horizontal" | "vertical"', 'Orientation (the grip turns with it)'], ['withHandle', 'boolean', 'shows the grip (radius-lg)'], ['defaultSize / minSize', '"40%" or pixels', '—']],
    a11y: ['The handle is a focusable separator; arrow keys resize, Home and End jump to the limits.'],
  },
  {
    path: 'scroll-area', name: 'Scroll Area',
    lead: 'A scrolling region with a slim, consistent scrollbar.',
    use: ['Use for fixed-height lists inside cards, menus and panels.', 'Let the page itself scroll normally; do not wrap whole pages in it.'],
    examples: (
      <ScrollArea className="h-48 w-56 rounded-lg border border-border">
        <div className="p-4">
          <p className="mb-3" style={text('paragraph-small-medium')}>Tokens</p>
          {['background', 'foreground', 'primary', 'secondary', 'muted', 'accent', 'destructive', 'border', 'input', 'ring', 'brand', 'brand-accent'].map((t, i) => (
            <div key={t}>{i > 0 && <Separator className="my-2" />}<span style={text('monospace-small-normal')}>--{t}</span></div>
          ))}
        </div>
      </ScrollArea>
    ),
    importLine: 'import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"',
    code: '<ScrollArea className="h-48 w-56 rounded-lg border">\n  …long content…\n</ScrollArea>',
    props: [['orientation (ScrollBar)', '"vertical" | "horizontal"', 'Type=Vertical / Horizontal']],
    a11y: ['The viewport is focusable so keyboard users can scroll it with arrow keys.', 'Give the region a label when its content is not obvious.'],
  },
]
