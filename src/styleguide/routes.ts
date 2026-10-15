import { libraryEntries } from './library'

export type Route = { path: string; label: string; section: 'Foundations' | 'Components' | 'Library'; ready: boolean }

export const routes: Route[] = [
  { path: 'color', label: 'Color', section: 'Foundations', ready: true },
  { path: 'typography', label: 'Typography', section: 'Foundations', ready: true },
  { path: 'button', label: 'Button', section: 'Components', ready: true },
  { path: 'banner', label: 'Banner', section: 'Components', ready: true },
  { path: 'card', label: 'Card', section: 'Components', ready: true },
  { path: 'input', label: 'Input', section: 'Components', ready: true },
  { path: 'pagination', label: 'Pagination', section: 'Components', ready: true },
  ...libraryEntries.map((e) => ({ path: e.path, label: e.name, section: 'Library' as const, ready: true })),
]
