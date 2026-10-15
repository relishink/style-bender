import { useState } from 'react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from '@tanstack/react-table'
import { ArrowUpDownIcon, FileIcon, HomeIcon, InboxIcon, SettingsIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider } from '@/components/ui/sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { LibraryEntry } from './LibraryPage'

// Chart colors are the chart-1…5 tokens; ChartContainer turns each config key into --color-<key>.
const chartConfig = {
  figma: { label: 'Figma', color: 'var(--chart-1)' },
  code: { label: 'Code', color: 'var(--chart-2)' },
} satisfies ChartConfig
const chartData = [
  { month: 'May', figma: 12, code: 9 },
  { month: 'Jun', figma: 18, code: 15 },
  { month: 'Jul', figma: 22, code: 22 },
  { month: 'Aug', figma: 30, code: 28 },
  { month: 'Sep', figma: 41, code: 41 },
  { month: 'Oct', figma: 72, code: 72 },
]

function ChartDemo() {
  return (
    <div className="flex flex-col gap-8">
      <ChartContainer config={chartConfig} className="h-56 w-xl">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="figma" fill="var(--color-figma)" />
          <Bar dataKey="code" fill="var(--color-code)" />
        </BarChart>
      </ChartContainer>
      <ChartContainer config={chartConfig} className="h-48 w-xl">
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line dataKey="figma" type="natural" stroke="var(--color-figma)" strokeWidth={2} dot={false} />
          <Line dataKey="code" type="step" stroke="var(--color-code)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

// collapsible="none" renders the sidebar in place, so it can sit inside a docs page.
function SidebarDemo() {
  return (
    <SidebarProvider className="min-h-0 w-auto">
      <Sidebar collapsible="none" className="h-96 rounded-xl border border-border">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton isActive><HomeIcon /><span>Home</span></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><InboxIcon /><span>Inbox</span></SidebarMenuButton><SidebarMenuBadge>12</SidebarMenuBadge></SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton><FileIcon /><span>Docs</span></SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem><SidebarMenuSubButton isActive href="#sidebar">Foundations</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton href="#sidebar">Components</SidebarMenuSubButton></SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><SettingsIcon /><span>Settings</span></SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

type Check = { component: string; mappings: number; status: 'match' | 'fixed' | 'code only' }
const checks: Check[] = [
  { component: 'Button', mappings: 10, status: 'match' },
  { component: 'Calendar', mappings: 3, status: 'fixed' },
  { component: 'Collapsible', mappings: 0, status: 'code only' },
  { component: 'Dialog', mappings: 4, status: 'fixed' },
  { component: 'Input', mappings: 5, status: 'match' },
  { component: 'Popover', mappings: 0, status: 'code only' },
  { component: 'Tabs', mappings: 1, status: 'fixed' },
]
const columns: ColumnDef<Check>[] = [
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} indeterminate={table.getIsSomeRowsSelected()} onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label={`Select ${row.original.component}`} />,
  },
  {
    accessorKey: 'component',
    header: ({ column }) => <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Component <ArrowUpDownIcon /></Button>,
  },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'mappings', header: () => <div className="text-right">Mappings</div>, cell: ({ getValue }) => <div className="text-right">{getValue<number>()}</div> },
]

function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filter, setFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  // TanStack Table returns functions the React Compiler cannot memoize; that is expected here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: checks, columns,
    state: { sorting, globalFilter: filter, rowSelection },
    onSortingChange: setSorting, onGlobalFilterChange: setFilter, onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(),
  })
  return (
    <div className="flex w-xl flex-col gap-3">
      <Input placeholder="Filter components" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-64" />
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((g) => <TableRow key={g.id}>{g.headers.map((h) => <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>)}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map((r) => (
              <TableRow key={r.id} data-state={r.getIsSelected() ? 'selected' : undefined}>
                {r.getVisibleCells().map((c) => <TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>)}
              </TableRow>
            )) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground">{table.getSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected</p>
    </div>
  )
}

export const batch4c: LibraryEntry[] = [
  {
    path: 'chart', name: 'Chart',
    lead: 'Bar, line and area charts drawn with Recharts and colored by the chart tokens.',
    use: ['Pick the chart for the question: bars to compare, lines for change over time.', 'Use the chart-1…5 tokens in order; never pick colors by hand.', 'Always label the axes or add a legend.'],
    examples: <ChartDemo />,
    importLine: 'import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart"\nimport { Bar, BarChart, XAxis } from "recharts"',
    code: 'const config = {\n  figma: { label: "Figma", color: "var(--chart-1)" },\n} satisfies ChartConfig\n\n<ChartContainer config={config} className="h-56">\n  <BarChart data={data}>\n    <XAxis dataKey="month" />\n    <ChartTooltip content={<ChartTooltipContent />} />\n    <Bar dataKey="figma" fill="var(--color-figma)" />\n  </BarChart>\n</ChartContainer>',
    props: [['config', 'ChartConfig', 'series labels and colors (chart-1…5)'], ['<LineChart> / <AreaChart> / <BarChart>', 'Recharts', 'Line / Area / Bar chart sets, Type (Figma only)'], ['ChartLegendContent', 'component', 'Legend (swatch radius-2xs)']],
    a11y: ['accessibilityLayer adds keyboard focus and announces values.', 'Colors alone do not tell series apart for everyone: keep the legend and tooltip labels.', 'Give the chart a heading or aria-label that says what it shows.'],
  },
  {
    path: 'data-table', name: 'Data Table', mapping: 'Data Table Cell',
    lead: 'A Table with sorting, filtering and row selection, powered by TanStack Table.',
    use: ['Use for lists people need to search, sort or act on in bulk.', 'Keep a plain Table for small, read-only data.', 'Right-align numbers.'],
    examples: <DataTableDemo />,
    importLine: 'import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"\nimport { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"',
    code: 'const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })\n\n<Table>\n  <TableBody>\n    {table.getRowModel().rows.map((row) => (\n      <TableRow key={row.id}>\n        {row.getVisibleCells().map((cell) => (\n          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>\n        ))}\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>',
    props: [['columns', 'ColumnDef[]', 'Table Header Content=Text / Sortable / Checkbox'], ['data-state="selected" (row)', 'string', 'State=Active'], ['text-right', 'class', 'Alignment=Right']],
    a11y: ['Sort buttons are real buttons inside the header cells; consider aria-sort on the sorted column.', 'Every row checkbox needs an aria-label naming the row.'],
  },
  {
    path: 'sidebar', name: 'Sidebar', mapping: 'Sidebar Menu Button',
    lead: 'The app’s main navigation: groups of menu buttons that can collapse to icons.',
    use: ['Use for apps with several sections people move between.', 'Mark the current page with isActive.', 'Collapse to icons (collapsible="icon") on narrow screens; on mobile it becomes a Sheet.'],
    examples: <SidebarDemo />,
    importLine: 'import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"',
    code: '<SidebarProvider>\n  <Sidebar collapsible="icon">\n    <SidebarContent>\n      <SidebarGroup>\n        <SidebarGroupLabel>Workspace</SidebarGroupLabel>\n        <SidebarMenu>\n          <SidebarMenuItem>\n            <SidebarMenuButton isActive><HomeIcon /> Home</SidebarMenuButton>\n          </SidebarMenuItem>\n        </SidebarMenu>\n      </SidebarGroup>\n    </SidebarContent>\n  </Sidebar>\n  <SidebarInset>…page…</SidebarInset>\n</SidebarProvider>',
    props: [['isActive', 'boolean', 'State=Active (1st level, 2nd level, collapsed)'], ['collapsible', '"offcanvas" | "icon" | "none"', 'Sidebar - With Children / Sidebar - Collapsed'], ['SidebarMenuBadge / SidebarGroupLabel / SidebarMenuSubButton', 'parts', 'Badge, Group Label, 2nd Level (all radius-md)']],
    a11y: ['Wrap it in a <nav> landmark with a label (“Main”).', 'isActive only styles the button: also set aria-current="page" on the current link.', 'Ctrl/⌘ B toggles it; SidebarTrigger is a labelled button.'],
  },
]
