import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from '@/components/ui/command'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@/components/ui/menubar'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import type { LibraryEntry } from './LibraryPage'

const row = 'flex flex-wrap items-center gap-4'

export const batch3: LibraryEntry[] = [
  {
    path: 'alert-dialog', name: 'Alert Dialog',
    lead: 'Interrupts to confirm an action that is hard to undo.',
    use: ['Use only for destructive or costly actions (“Delete project?”).', 'Name the action on the button (“Delete”), not “OK”.', 'Use a Dialog for everything else.'],
    examples: (
      <div className={row}>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>Delete project</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete this project?</AlertDialogTitle><AlertDialogDescription>This removes all of its files. You cannot undo it.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive">Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>Small</AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader><AlertDialogTitle>Sign out?</AlertDialogTitle><AlertDialogDescription>You can sign back in at any time.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Sign out</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
    importLine: 'import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"',
    code: '<AlertDialog>\n  <AlertDialogTrigger render={<Button variant="outline" />}>Delete project</AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Delete this project?</AlertDialogTitle>\n      <AlertDialogDescription>You cannot undo it.</AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>',
    props: [['size (AlertDialogContent)', '"default" | "sm"', 'Size=Regular / Small'], ['variant (AlertDialogAction)', 'Button variant', 'Variant=Destructive / Regular']],
    a11y: ['Renders role="alertdialog"; focus moves into it and stays there until it closes.', 'Escape and Cancel close it without acting.', 'The title and description are read when it opens.'],
  },
  {
    path: 'command', name: 'Command',
    lead: 'A searchable list of actions, often opened with ⌘K.',
    use: ['Use for quick navigation and actions in apps with many commands.', 'Group items and show their shortcuts.', 'Wrap it in CommandDialog to open it as a palette.'],
    examples: (
      <Command className="w-96 ring-1 ring-foreground/10">
        <CommandInput placeholder="Type a command or search" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Suggestions"><CommandItem>Calendar</CommandItem><CommandItem>Search emoji</CommandItem></CommandGroup>
          <CommandGroup heading="Settings"><CommandItem>Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem><CommandItem>Billing<CommandShortcut>⌘B</CommandShortcut></CommandItem></CommandGroup>
        </CommandList>
      </Command>
    ),
    importLine: 'import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "@/components/ui/command"',
    code: '<Command>\n  <CommandInput placeholder="Type a command or search" />\n  <CommandList>\n    <CommandEmpty>No results.</CommandEmpty>\n    <CommandGroup heading="Settings">\n      <CommandItem>Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>',
    props: [],
    a11y: ['Arrow keys move through items, Enter runs one; typing filters the list.', 'Renders a combobox with a listbox, so screen readers announce the active item.'],
  },
  {
    path: 'context-menu', name: 'Context Menu',
    lead: 'A menu that opens on right-click (or long-press).',
    use: ['Use for shortcuts to actions that are also available elsewhere.', 'Never put the only way to do something in a context menu: it is hard to discover.'],
    examples: (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-80 items-center justify-center rounded-lg border border-dashed text-muted-foreground">Right-click here</ContextMenuTrigger>
        <ContextMenuContent><ContextMenuItem>Back</ContextMenuItem><ContextMenuItem>Reload</ContextMenuItem><ContextMenuSeparator /><ContextMenuItem variant="destructive">Delete</ContextMenuItem></ContextMenuContent>
      </ContextMenu>
    ),
    importLine: 'import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"',
    code: '<ContextMenu>\n  <ContextMenuTrigger>Right-click here</ContextMenuTrigger>\n  <ContextMenuContent>\n    <ContextMenuItem>Reload</ContextMenuItem>\n    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>',
    props: [['variant (item)', '"default" | "destructive"', 'Dropdown Menu item variants']],
    a11y: ['Shift+F10 or the Menu key opens it from the keyboard.', 'Arrow keys move through items; Escape closes it.'],
  },
  {
    path: 'dialog', name: 'Dialog',
    lead: 'A window on top of the page for a focused task.',
    use: ['Use for short tasks that need focus: editing a name, sharing a link.', 'Keep long flows on a page instead.', 'Use an Alert Dialog to confirm destructive actions.'],
    examples: (
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Changes are saved when you press Save.</DialogDescription></DialogHeader>
          <DialogFooter><DialogClose render={<Button variant="outline" />}>Cancel</DialogClose><Button>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    importLine: 'import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"',
    code: '<Dialog>\n  <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Edit profile</DialogTitle>\n      <DialogDescription>Changes are saved when you press Save.</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <Button>Save</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>',
    props: [['showCloseButton (DialogContent)', 'boolean', '—'], ['className max-w-*', 'width', 'Type=Desktop / Mobile']],
    a11y: ['Renders role="dialog" with its title as the name; focus is trapped inside.', 'Escape closes it and focus returns to the trigger.'],
  },
  {
    path: 'drawer', name: 'Drawer',
    lead: 'A panel that slides up from the bottom edge, mostly on mobile.',
    use: ['Use on small screens for short tasks and option lists.', 'Use a Dialog or Sheet on desktop.'],
    examples: (
      <Drawer>
        <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>Move goal</DrawerTitle><DrawerDescription>Set your daily activity goal.</DrawerDescription></DrawerHeader>
          <DrawerFooter><Button>Submit</Button><DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose></DrawerFooter>
        </DrawerContent>
      </Drawer>
    ),
    importLine: 'import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"',
    code: '<Drawer>\n  <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>\n  <DrawerContent>\n    <DrawerHeader>\n      <DrawerTitle>Move goal</DrawerTitle>\n    </DrawerHeader>\n  </DrawerContent>\n</Drawer>',
    props: [['swipeDirection', '"down" | "up" | "left" | "right"', 'Figma shows "down" (bottom drawer)']],
    a11y: ['Works like a Dialog: focus is trapped and Escape closes it.', 'Swiping is never the only way to close it; keep a Close button.'],
  },
  {
    path: 'dropdown-menu', name: 'Dropdown Menu',
    lead: 'A list of actions that opens from a button.',
    use: ['Use for secondary actions that do not fit on the page (“More”).', 'Group related items and separate destructive ones.'],
    examples: (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup><DropdownMenuLabel>My account</DropdownMenuLabel><DropdownMenuItem>Profile</DropdownMenuItem><DropdownMenuItem>Settings</DropdownMenuItem></DropdownMenuGroup>
          <DropdownMenuSeparator /><DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    importLine: 'import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"',
    code: '<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Profile</DropdownMenuItem>\n    <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>',
    props: [['variant (item)', '"default" | "destructive"', 'item variants'], ['align / side (content)', 'placement', '—']],
    a11y: ['Renders role="menu"; Enter, Space or Arrow Down opens it.', 'Arrow keys move through items; typing jumps to a match; Escape closes it.'],
  },
  {
    path: 'hover-card', name: 'Hover Card',
    lead: 'A preview that appears when pointing at a link.',
    use: ['Use to preview a person or page behind a link.', 'Never put actions or required information in it: touch screens cannot hover.'],
    examples: (
      <HoverCard>
        <HoverCardTrigger render={<Button variant="link" />}>@style-bender</HoverCardTrigger>
        <HoverCardContent><p className="font-medium">style-bender</p><p className="text-muted-foreground">Figma and code, 1:1.</p></HoverCardContent>
      </HoverCard>
    ),
    importLine: 'import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"',
    code: '<HoverCard>\n  <HoverCardTrigger render={<a href="/profile" />}>@style-bender</HoverCardTrigger>\n  <HoverCardContent>Figma and code, 1:1.</HoverCardContent>\n</HoverCard>',
    props: [],
    a11y: ['Opens on hover and keyboard focus; screen readers skip it, so the link must make sense alone.'],
  },
  {
    path: 'menubar', name: 'Menubar',
    lead: 'A row of menus, like the one at the top of a desktop app.',
    use: ['Use in tool-like apps (editors) with many commands.', 'Most web apps do not need one; prefer a Dropdown Menu.'],
    examples: (
      <Menubar>
        <MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New tab<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem><MenubarItem>New window</MenubarItem><MenubarSeparator /><MenubarItem>Print</MenubarItem></MenubarContent></MenubarMenu>
        <MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem><MenubarItem>Redo</MenubarItem></MenubarContent></MenubarMenu>
      </Menubar>
    ),
    importLine: 'import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar"',
    code: '<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>File</MenubarTrigger>\n    <MenubarContent>\n      <MenubarItem>New tab</MenubarItem>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>',
    props: [],
    a11y: ['Renders role="menubar"; Left and Right move between menus, Down opens one.'],
  },
  {
    path: 'navigation-menu', name: 'Navigation Menu',
    lead: 'Site navigation with optional panels of links.',
    use: ['Use for the main navigation of a marketing or docs site.', 'Keep panels to links; do not hide forms in them.'],
    examples: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Foundations</NavigationMenuTrigger>
            <NavigationMenuContent><ul className="flex w-64 flex-col gap-1"><li><NavigationMenuLink href="#/foundations/color">Color</NavigationMenuLink></li><li><NavigationMenuLink href="#/foundations/typography">Typography</NavigationMenuLink></li></ul></NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem><NavigationMenuLink href="#/components/button">Components</NavigationMenuLink></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
    importLine: 'import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu"',
    code: '<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>Foundations</NavigationMenuTrigger>\n      <NavigationMenuContent>\n        <NavigationMenuLink href="/color">Color</NavigationMenuLink>\n      </NavigationMenuContent>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>',
    props: [],
    a11y: ['Renders a <nav>; give it an aria-label when the page has more than one.', 'Triggers open with Enter or Space; Tab moves into the panel.'],
  },
  {
    path: 'popover', name: 'Popover',
    lead: 'Rich content in a floating panel, opened by a button.',
    use: ['Use for small forms and details tied to a button (filters, a share link).', 'Use a Tooltip for a short hint and a Dialog for a bigger task.'],
    examples: (
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
        <PopoverContent><PopoverHeader><PopoverTitle>Dimensions</PopoverTitle><PopoverDescription>Set the size of the layer.</PopoverDescription></PopoverHeader></PopoverContent>
      </Popover>
    ),
    importLine: 'import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "@/components/ui/popover"',
    code: '<Popover>\n  <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>\n  <PopoverContent>\n    <PopoverHeader>\n      <PopoverTitle>Dimensions</PopoverTitle>\n    </PopoverHeader>\n  </PopoverContent>\n</Popover>',
    props: [['align / side (content)', 'placement', '—']],
    a11y: ['The trigger gets aria-expanded; focus moves into the popover and Escape returns it.'],
  },
  {
    path: 'sheet', name: 'Sheet',
    lead: 'A panel that slides in from the side of the screen.',
    use: ['Use for secondary tasks that keep the page in view: filters, details, settings.', 'Default to the right side; use the others sparingly.'],
    examples: (
      <div className={row}>
        {(['right', 'left', 'bottom'] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger render={<Button variant="outline" />}>Open {side}</SheetTrigger>
            <SheetContent side={side}><SheetHeader><SheetTitle>Filters</SheetTitle><SheetDescription>Narrow down the list.</SheetDescription></SheetHeader></SheetContent>
          </Sheet>
        ))}
      </div>
    ),
    importLine: 'import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"',
    code: '<Sheet>\n  <SheetTrigger render={<Button variant="outline" />}>Filters</SheetTrigger>\n  <SheetContent side="right">\n    <SheetHeader>\n      <SheetTitle>Filters</SheetTitle>\n    </SheetHeader>\n  </SheetContent>\n</Sheet>',
    props: [['side (SheetContent)', '"top" | "right" | "bottom" | "left"', 'code only: Figma shows the right side'], ['showCloseButton', 'boolean', '—']],
    a11y: ['Works like a Dialog: role="dialog", focus trapped, Escape closes it.'],
  },
  {
    path: 'sonner', name: 'Sonner', mapping: 'Sonner',
    lead: 'Brief messages (toasts) that confirm what just happened.',
    use: ['Use to confirm an action (“Saved”) or report a background result.', 'Keep them short; they disappear on their own.', 'Put anything people must act on in a Banner or Dialog instead.'],
    examples: (
      <div className={row}>
        <Toaster />
        <Button variant="outline" onClick={() => toast('Event created', { description: 'Monday at 9:00' })}>Show toast</Button>
        <Button variant="outline" onClick={() => toast.success('Saved')}>Success</Button>
        <Button variant="outline" onClick={() => toast.error('Could not save')}>Error</Button>
      </div>
    ),
    importLine: 'import { Toaster } from "@/components/ui/sonner"\nimport { toast } from "sonner"',
    code: '// once, near the root of the app\n<Toaster />\n\n// anywhere\ntoast.success("Saved")',
    props: [['toast(), toast.success(), toast.error()', 'function', 'Type (Figma only)']],
    a11y: ['Toasts are announced through a live region without moving focus.', 'They pause while hovered or focused; never put the only copy of important information in one.'],
  },
]
