import { Bold, ChevronsUpDown, Italic, Underline } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { LibraryEntry } from './LibraryPage'

const row = 'flex flex-wrap items-center gap-4'
const fruits = [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }, { label: 'Cherry', value: 'cherry' }]

export const batch2: LibraryEntry[] = [
  {
    path: 'accordion', name: 'Accordion',
    lead: 'Stacked sections that open one at a time to show more.',
    use: ['Use for FAQs and long settings pages where people scan headings first.', 'Do not hide content everyone needs to read.'],
    examples: (
      <Accordion className="w-96" defaultValue={['shipping']}>
        <AccordionItem value="shipping"><AccordionTrigger>Shipping</AccordionTrigger><AccordionContent>Orders ship within 2 business days.</AccordionContent></AccordionItem>
        <AccordionItem value="returns"><AccordionTrigger>Returns</AccordionTrigger><AccordionContent>Return anything within 30 days.</AccordionContent></AccordionItem>
      </Accordion>
    ),
    importLine: 'import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"',
    code: '<Accordion>\n  <AccordionItem value="shipping">\n    <AccordionTrigger>Shipping</AccordionTrigger>\n    <AccordionContent>Orders ship within 2 business days.</AccordionContent>\n  </AccordionItem>\n</Accordion>',
    props: [['defaultValue / value', 'string[]', 'State=Open on those items'], ['disabled (item)', 'boolean', 'State=Disabled']],
    a11y: ['Triggers are buttons with aria-expanded; Enter and Space open them.', 'Use real headings around triggers when the sections are part of the page outline.'],
  },
  {
    path: 'aspect-ratio', name: 'Aspect Ratio',
    lead: 'Keeps media at a fixed shape while it resizes.',
    use: ['Wrap images, video and maps so the layout does not jump while they load.'],
    examples: <div className="w-80"><AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted"><div className="flex size-full items-center justify-center text-muted-foreground">16:9</div></AspectRatio></div>,
    importLine: 'import { AspectRatio } from "@/components/ui/aspect-ratio"',
    code: '<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">\n  <img src="/photo.jpg" alt="…" className="size-full object-cover" />\n</AspectRatio>',
    props: [['ratio', 'number', 'Aspect=16:9 / 1:1 / 9:16 / 21:9']],
    a11y: ['It is only a box; give the media inside it alt text or captions.'],
  },
  {
    path: 'breadcrumb', name: 'Breadcrumb',
    lead: 'Shows where a page sits and links back up the hierarchy.',
    use: ['Use on pages more than two levels deep.', 'The last item is the current page and is not a link.'],
    examples: (
      <Breadcrumb><BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#breadcrumb">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#breadcrumb">Components</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList></Breadcrumb>
    ),
    importLine: 'import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"',
    code: '<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>',
    props: [],
    a11y: ['Renders a <nav aria-label="breadcrumb">; the current page has aria-current="page".', 'Separators are hidden from screen readers.'],
  },
  {
    path: 'button-group', name: 'Button Group',
    lead: 'Joins related Buttons into one control.',
    use: ['Group actions on the same object (Undo / Redo, zoom in / out).', 'Do not group unrelated actions just to save space.'],
    examples: <ButtonGroup><Button variant="outline">Day</Button><Button variant="outline">Week</Button><Button variant="outline">Month</Button></ButtonGroup>,
    importLine: 'import { ButtonGroup } from "@/components/ui/button-group"',
    code: '<ButtonGroup>\n  <Button variant="outline">Day</Button>\n  <Button variant="outline">Week</Button>\n</ButtonGroup>',
    props: [['orientation', '"horizontal" | "vertical"', 'Position=Top / Bottom (vertical)']],
    a11y: ['Renders role="group"; add aria-label to say what the group is for.', 'Each Button keeps its own label and focus.'],
  },
  {
    path: 'collapsible', name: 'Collapsible',
    lead: 'A single section that shows or hides its content.',
    use: ['Use for one optional detail (“Show advanced options”).', 'Use an Accordion for a list of sections.', 'The free Figma kit has no Collapsible, so this one is code only.'],
    examples: (
      <Collapsible className="flex w-80 flex-col gap-2">
        <CollapsibleTrigger render={<Button variant="ghost" className="justify-between" />}>Advanced options <ChevronsUpDown /></CollapsibleTrigger>
        <CollapsibleContent className="text-muted-foreground">Proxy, timeouts and retries live here.</CollapsibleContent>
      </Collapsible>
    ),
    importLine: 'import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"',
    code: '<Collapsible>\n  <CollapsibleTrigger>Advanced options</CollapsibleTrigger>\n  <CollapsibleContent>…</CollapsibleContent>\n</Collapsible>',
    props: [['open / defaultOpen', 'boolean', '— (no Figma component)']],
    a11y: ['The trigger is a button with aria-expanded.'],
  },
  {
    path: 'select', name: 'Select',
    lead: 'Picks one option from a list that opens on demand.',
    use: ['Use for 5 or more options, or when space is tight.', 'Use a Radio Group when people should see every option at once.'],
    examples: (
      <div className={row}>
        <Select items={fruits} defaultValue="apple"><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{fruits.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent></Select>
        <Select items={fruits} defaultValue="banana"><SelectTrigger size="sm" className="w-48"><SelectValue /></SelectTrigger><SelectContent>{fruits.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent></Select>
      </div>
    ),
    importLine: 'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"',
    code: '<Select items={fruits} defaultValue="apple">\n  <SelectTrigger><SelectValue /></SelectTrigger>\n  <SelectContent>\n    <SelectItem value="apple">Apple</SelectItem>\n  </SelectContent>\n</Select>',
    props: [['size (SelectTrigger)', '"default" | "sm"', 'Size=Default / Small'], ['aria-invalid', 'boolean', 'State=Error'], ['disabled', 'boolean', 'State=Disabled']],
    a11y: ['Keyboard: arrows move through options, Enter picks one, Esc closes.', 'Give the trigger a Label like any field.'],
  },
  {
    path: 'slider', name: 'Slider',
    lead: 'Picks a value or a range by dragging.',
    use: ['Use when an approximate value is fine (volume, price range).', 'Use an Input when people need an exact number.'],
    examples: <div className="flex w-80 flex-col gap-6"><Slider defaultValue={[40]} /><Slider defaultValue={[25, 75]} /><Slider defaultValue={[50]} disabled /></div>,
    importLine: 'import { Slider } from "@/components/ui/slider"',
    code: '<Slider defaultValue={[25, 75]} />',
    props: [['defaultValue / value', 'number[]', 'Type=Default (one value) / Range (two)'], ['disabled', 'boolean', 'State=Disabled']],
    a11y: ['Each thumb is role="slider"; arrow keys change the value.', 'Label it and show the current value as text.'],
  },
  {
    path: 'table', name: 'Table',
    lead: 'Rows and columns of data.',
    use: ['Use for data people compare across rows.', 'Right-align numbers so they line up.'],
    examples: (
      <Table className="w-96">
        <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
        <TableBody>
          <TableRow><TableCell>INV001</TableCell><TableCell>Paid</TableCell><TableCell className="text-right">$250.00</TableCell></TableRow>
          <TableRow><TableCell>INV002</TableCell><TableCell>Pending</TableCell><TableCell className="text-right">$150.00</TableCell></TableRow>
        </TableBody>
      </Table>
    ),
    importLine: 'import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"',
    code: '<Table>\n  <TableHeader><TableRow><TableHead>Invoice</TableHead></TableRow></TableHeader>\n  <TableBody><TableRow><TableCell>INV001</TableCell></TableRow></TableBody>\n</Table>',
    props: [],
    a11y: ['Uses real <table>, <th> and <td>, so screen readers announce headers with each cell.', 'Add a TableCaption that says what the table is.'],
  },
  {
    path: 'tabs', name: 'Tabs',
    lead: 'Switches between views of the same content.',
    use: ['Use for 2–6 related views on one page.', 'Do not use tabs for steps in a process.'],
    examples: (
      <Tabs defaultValue="account" className="w-96">
        <TabsList><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="password">Password</TabsTrigger></TabsList>
        <TabsContent value="account">Change your name and email.</TabsContent>
        <TabsContent value="password">Change your password.</TabsContent>
      </Tabs>
    ),
    importLine: 'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"',
    code: '<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">…</TabsContent>\n</Tabs>',
    props: [['variant (TabsList)', '"default" | "line"', 'segmented = default'], ['defaultValue / value', 'string', 'State=Active on that tab']],
    a11y: ['Uses the tablist / tab / tabpanel roles; arrow keys move between tabs.'],
  },
  {
    path: 'toggle', name: 'Toggle',
    lead: 'A button that stays on or off. Toggle Group joins several.',
    use: ['Use for formatting and view options (Bold, Grid view).', 'Use a Switch for settings.'],
    examples: (
      <div className={row}>
        <Toggle aria-label="Bold"><Bold /></Toggle>
        <Toggle variant="outline" aria-label="Italic"><Italic /></Toggle>
        <ToggleGroup variant="outline" defaultValue={['bold']} multiple>
          <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    importLine: 'import { Toggle } from "@/components/ui/toggle"\nimport { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"',
    code: '<Toggle aria-label="Bold"><Bold /></Toggle>\n\n<ToggleGroup variant="outline" multiple>\n  <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>\n</ToggleGroup>',
    props: [['variant', '"default" | "outline"', 'Skin=Ghost / Outline'], ['size', '"sm" | "default" | "lg"', 'Size=Small / Default / Large'], ['pressed / defaultPressed', 'boolean', 'Active?=Yes / No']],
    a11y: ['Renders aria-pressed so screen readers say “on” or “off”.', 'Icon-only toggles need an aria-label.'],
  },
  {
    path: 'tooltip', name: 'Tooltip',
    lead: 'A short hint that appears on hover or focus.',
    use: ['Name icon-only buttons and show shortcuts.', 'Never put essential information only in a tooltip.'],
    examples: (
      <TooltipProvider>
        <Tooltip><TooltipTrigger render={<Button variant="outline" />}>Hover or focus me</TooltipTrigger><TooltipContent>Adds the item to your library</TooltipContent></Tooltip>
      </TooltipProvider>
    ),
    importLine: 'import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"',
    code: '<TooltipProvider>\n  <Tooltip>\n    <TooltipTrigger render={<Button variant="outline" />}>Save</TooltipTrigger>\n    <TooltipContent side="top">Saves a copy</TooltipContent>\n  </Tooltip>\n</TooltipProvider>',
    props: [['side (TooltipContent)', '"top" | "bottom" | "left" | "right"', 'Side']],
    a11y: ['Opens on keyboard focus as well as hover, and closes with Esc.', 'The content describes the trigger (aria-describedby).'],
  },
]
