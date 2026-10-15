import { useEffect, useState } from 'react'
import { BrandPage } from './styleguide/BrandPage'
import { BannerPage } from './styleguide/BannerPage'
import { ButtonPage } from './styleguide/ButtonPage'
import { CardPage } from './styleguide/CardPage'
import { ColorPage } from './styleguide/ColorPage'
import { Layout } from './styleguide/Layout'
import { InputPage } from './styleguide/InputPage'
import { PaginationPage } from './styleguide/PaginationPage'
import { TypographyPage } from './styleguide/TypographyPage'
import { VisualPage } from './styleguide/VisualPage'
import { libraryEntries } from './styleguide/library'
import { LibraryPage } from './styleguide/library/LibraryPage'

const pages: Record<string, () => React.JSX.Element> = { brand: BrandPage, color: ColorPage, typography: TypographyPage, button: ButtonPage, banner: BannerPage, card: CardPage, pagination: PaginationPage, input: InputPage }
const currentPath = () => window.location.hash.slice(1) || 'color'

function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => setPath(currentPath())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (path === 'visual') return <VisualPage />
  const entry = libraryEntries.find((e) => e.path === path)
  if (entry) return <Layout current={path}><LibraryPage key={path} entry={entry} /></Layout>
  const Page = pages[path] ?? ColorPage
  return (
    <Layout current={path}>
      <Page />
    </Layout>
  )
}

export default App
