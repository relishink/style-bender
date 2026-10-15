import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { LibraryEntry } from './LibraryPage'

const row = 'flex flex-wrap items-center gap-4'

export const batch1: LibraryEntry[] = [
  {
    path: 'avatar', name: 'Avatar',
    lead: 'A person or team, shown as a picture or initials.',
    use: ['Identify people in lists, comments and headers.', 'Fall back to initials when there is no picture.', 'Use the small size in dense lists and the large size in profile headers.'],
    examples: <div className={row}><Avatar size="sm"><AvatarFallback>DR</AvatarFallback></Avatar><Avatar><AvatarFallback>DR</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>DR</AvatarFallback></Avatar></div>,
    importLine: 'import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"',
    code: '<Avatar size="lg">\n  <AvatarImage src="/david.png" alt="David" />\n  <AvatarFallback>DR</AvatarFallback>\n</Avatar>',
    props: [['size', '"sm" | "default" | "lg"', 'Size=Small / Default / Large']],
    a11y: ['Give AvatarImage an alt text with the person’s name.', 'If the name is shown next to the avatar, use alt="" so it is not read twice.'],
  },
  {
    path: 'badge', name: 'Badge',
    lead: 'A short label for a status, count or category.',
    use: ['Mark a status (“New”, “Beta”) or a count next to something.', 'Keep it to one or two words.', 'Use Destructive only for problems that need attention.'],
    examples: <div className={row}><Badge>Primary</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Badge variant="ghost">Ghost</Badge><Badge variant="destructive">Destructive</Badge></div>,
    importLine: 'import { Badge } from "@/components/ui/badge"',
    code: '<Badge variant="secondary">Beta</Badge>',
    props: [['variant', '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', 'Variant']],
    a11y: ['A badge is plain text to screen readers; make sure the words make sense on their own.', 'Do not rely on the color: “Error” says more than a red dot.'],
  },
  {
    path: 'checkbox', name: 'Checkbox',
    lead: 'Turns one option on or off, or picks several from a list.',
    use: ['Use for independent on/off choices and multi-select lists.', 'Use a Switch instead when the change applies immediately.', 'Indeterminate shows that only some items below are selected.'],
    examples: <div className={row}><Label className="flex items-center gap-2"><Checkbox /> Default</Label><Label className="flex items-center gap-2"><Checkbox defaultChecked /> Checked</Label><Label className="flex items-center gap-2"><Checkbox indeterminate /> Indeterminate</Label><Label className="flex items-center gap-2"><Checkbox disabled /> Disabled</Label></div>,
    importLine: 'import { Checkbox } from "@/components/ui/checkbox"',
    code: '<Label>\n  <Checkbox defaultChecked /> Email me updates\n</Label>',
    props: [['checked / defaultChecked', 'boolean', 'Checked?=True / False'], ['indeterminate', 'boolean', 'Checked?=Indeterminate'], ['disabled', 'boolean', 'State=Disabled'], ['aria-invalid', 'boolean', 'State=Error Focus']],
    a11y: ['Wrap it in a Label (or use htmlFor) so clicking the text toggles it.', 'Space toggles it; Tab moves between checkboxes.'],
  },
  {
    path: 'kbd', name: 'Kbd',
    lead: 'A keyboard key or shortcut.',
    use: ['Show keyboard shortcuts in menus, tooltips and help text.', 'Group combinations with KbdGroup.'],
    examples: <div className={row}><Kbd>Esc</Kbd><KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup></div>,
    importLine: 'import { Kbd, KbdGroup } from "@/components/ui/kbd"',
    code: '<KbdGroup>\n  <Kbd>⌘</Kbd>\n  <Kbd>K</Kbd>\n</KbdGroup>',
    props: [],
    a11y: ['Renders a <kbd> element, which screen readers announce as keyboard input.', 'Spell out symbols in nearby text when the shortcut matters (“Command K”).'],
  },
  {
    path: 'label', name: 'Label',
    lead: 'The visible name of a form field.',
    use: ['Every form field needs a label.', 'Keep it short; put help text below the field instead.'],
    examples: <div className="flex flex-col gap-2"><Label htmlFor="lib-label-demo">Full name</Label><Textarea id="lib-label-demo" placeholder="Type here" className="w-80" /></div>,
    importLine: 'import { Label } from "@/components/ui/label"',
    code: '<Label htmlFor="name">Full name</Label>\n<Input id="name" />',
    props: [['htmlFor', 'string', '—']],
    a11y: ['Connect it with htmlFor (or by wrapping the field) so screen readers read it and clicks focus the field.'],
  },
  {
    path: 'progress', name: 'Progress',
    lead: 'Shows how far a task has come.',
    use: ['Use when the amount of work is known (uploads, multi-step setup).', 'Use a Spinner when it is not.'],
    examples: <div className="flex w-96 flex-col gap-4"><Progress value={25} /><Progress value={66} /></div>,
    importLine: 'import { Progress } from "@/components/ui/progress"',
    code: '<Progress value={66} />',
    props: [['value', 'number (0–100)', 'Progress=0 … 100']],
    a11y: ['Renders role="progressbar" with the current value.', 'Give it a visible label or aria-label saying what is progressing.'],
  },
  {
    path: 'radio-group', name: 'Radio Group', mapping: 'Radio',
    lead: 'Picks exactly one option from a short list.',
    use: ['Use for 2–5 options that should all be visible.', 'Use a Select for longer lists.', 'Pre-select the most likely option when there is one.'],
    examples: <RadioGroup defaultValue="email" className="flex flex-col gap-3"><Label className="flex items-center gap-2"><RadioGroupItem value="email" /> Email</Label><Label className="flex items-center gap-2"><RadioGroupItem value="sms" /> Text message</Label><Label className="flex items-center gap-2"><RadioGroupItem value="none" disabled /> None (disabled)</Label></RadioGroup>,
    importLine: 'import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"',
    code: '<RadioGroup defaultValue="email">\n  <Label><RadioGroupItem value="email" /> Email</Label>\n  <Label><RadioGroupItem value="sms" /> Text message</Label>\n</RadioGroup>',
    props: [['value / defaultValue', 'string', 'Checked?=True on that item'], ['disabled', 'boolean', 'State=Disabled']],
    a11y: ['Arrow keys move between options; Tab leaves the group.', 'Give the group a visible heading or aria-label.'],
  },
  {
    path: 'separator', name: 'Separator',
    lead: 'A thin line between groups of content.',
    use: ['Separate groups in menus, toolbars and long forms.', 'Prefer spacing first; add a line only when groups still blur together.'],
    examples: <div className="flex w-80 flex-col gap-3"><span>Account</span><Separator /><span>Billing</span><div className="flex h-6 items-center gap-3"><span>Docs</span><Separator orientation="vertical" /><span>Support</span></div></div>,
    importLine: 'import { Separator } from "@/components/ui/separator"',
    code: '<Separator />\n<Separator orientation="vertical" />',
    props: [['orientation', '"horizontal" | "vertical"', 'Direction=Default / Vertical']],
    a11y: ['Renders role="separator"; screen readers announce it as a divider.'],
  },
  {
    path: 'skeleton', name: 'Skeleton',
    lead: 'A placeholder shape while content loads.',
    use: ['Mirror the shape of the content that is coming, so the page does not jump.', 'Use it for loads longer than a moment; not for instant ones.'],
    examples: <div className="flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="flex flex-col gap-2"><Skeleton className="h-4 w-64" /><Skeleton className="h-4 w-48" /></div></div>,
    importLine: 'import { Skeleton } from "@/components/ui/skeleton"',
    code: '<Skeleton className="h-4 w-64" />',
    props: [],
    a11y: ['Mark the loading region with aria-busy="true" and announce when content arrives.'],
  },
  {
    path: 'spinner', name: 'Spinner',
    lead: 'Shows that something is loading, when we cannot say how long.',
    use: ['Use for short, unknown waits, often inside a Button.', 'Use Progress when you can show how far along it is.'],
    examples: <div className={row}><Spinner className="size-3" /><Spinner /></div>,
    importLine: 'import { Spinner } from "@/components/ui/spinner"',
    code: '<Spinner />',
    props: [],
    a11y: ['Renders role="status" with aria-label="Loading".', 'Change the label when it says more (“Saving”).'],
  },
  {
    path: 'switch', name: 'Switch',
    lead: 'Turns a setting on or off, with immediate effect.',
    use: ['Use for settings that apply at once.', 'Use a Checkbox inside forms that are saved with a button.'],
    examples: <div className={row}><Label className="flex items-center gap-2"><Switch /> Off</Label><Label className="flex items-center gap-2"><Switch defaultChecked /> On</Label><Label className="flex items-center gap-2"><Switch size="sm" defaultChecked /> Small</Label><Label className="flex items-center gap-2"><Switch disabled /> Disabled</Label></div>,
    importLine: 'import { Switch } from "@/components/ui/switch"',
    code: '<Label>\n  <Switch defaultChecked /> Dark mode\n</Label>',
    props: [['checked / defaultChecked', 'boolean', 'State=Checked / Unchecked'], ['size', '"default" | "sm"', 'Size=Default / Small'], ['disabled', 'boolean', 'State=… disabled']],
    a11y: ['Renders role="switch" with aria-checked; Space toggles it.', 'Always pair it with a label that names the setting.'],
  },
  {
    path: 'textarea', name: 'Textarea',
    lead: 'Takes longer, multi-line text.',
    use: ['Use for comments, descriptions and messages.', 'Use an Input for single-line text.'],
    examples: <div className="flex w-80 flex-col gap-4"><Textarea placeholder="Tell us more" /><Textarea placeholder="Error" aria-invalid /><Textarea placeholder="Disabled" disabled /></div>,
    importLine: 'import { Textarea } from "@/components/ui/textarea"',
    code: '<Textarea placeholder="Tell us more" />',
    props: [['aria-invalid', 'boolean', 'State=Error'], ['disabled', 'boolean', 'State=Disabled']],
    a11y: ['Needs a Label, like any field.', 'Link error messages with aria-describedby.'],
  },
]
