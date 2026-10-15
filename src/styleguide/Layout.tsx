import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { routes } from './routes'
import { text } from './type'

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  const toggleTheme = () => document.documentElement.classList.toggle('dark')
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <nav className="w-60 shrink-0 border-r border-border bg-sidebar p-6 text-sidebar-foreground">
        <a href="#brand" className="block" aria-label="Style Bender style guide, brand page"><Logo className="h-7" /></a>
        {(['Foundations', 'Components', 'Library'] as const).map((section) => (
          <div key={section} className="mt-8">
            <p className="text-muted-foreground" style={text('caption')}>{section}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {routes.filter((r) => r.section === section).map((r) => (
                <li key={r.path}>
                  {r.ready ? (
                    <a
                      href={`#${r.path}`}
                      aria-current={current === r.path ? 'page' : undefined}
                      className="block rounded-md px-2 py-1 hover:bg-sidebar-accent aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground"
                      style={text('paragraph-small-medium')}
                    >
                      {r.label}
                    </a>
                  ) : (
                    <span className="block px-2 py-1 text-muted-foreground" style={text('paragraph-small-normal')}>
                      {r.label} · Phase 3
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="flex-1">
        <header className="flex justify-end border-b border-border px-10 py-4">
          <Button variant="outline" size="sm" onClick={toggleTheme}>Toggle dark mode</Button>
        </header>
        <main className="max-w-5xl px-10 py-10">{children}</main>
      </div>
    </div>
  )
}

export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-10">
      <h1 style={text('heading-1')}>{title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground" style={text('paragraph-large-normal')}>{lead}</p>
    </div>
  )
}
