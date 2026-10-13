export type Route = { path: string; label: string; section: 'Foundations' | 'Components'; ready: boolean }

export const routes: Route[] = [
  { path: 'color', label: 'Color', section: 'Foundations', ready: true },
  { path: 'typography', label: 'Typography', section: 'Foundations', ready: true },
  { path: 'button', label: 'Button', section: 'Components', ready: true },
  { path: 'banner', label: 'Banner', section: 'Components', ready: true },
  { path: 'card', label: 'Card', section: 'Components', ready: true },
]
