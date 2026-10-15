import { useEffect, useState } from 'react'
import { BannerPage } from './styleguide/BannerPage'
import { ButtonPage } from './styleguide/ButtonPage'
import { CardPage } from './styleguide/CardPage'
import { ColorPage } from './styleguide/ColorPage'
import { Layout } from './styleguide/Layout'
import { PaginationPage } from './styleguide/PaginationPage'
import { TypographyPage } from './styleguide/TypographyPage'
import { VisualPage } from './styleguide/VisualPage'

const pages: Record<string, () => React.JSX.Element> = { color: ColorPage, typography: TypographyPage, button: ButtonPage, banner: BannerPage, card: CardPage, pagination: PaginationPage }
const currentPath = () => window.location.hash.slice(1) || 'color'

function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => setPath(currentPath())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (path === 'visual') return <VisualPage />
  const Page = pages[path] ?? ColorPage
  return (
    <Layout current={path}>
      <Page />
    </Layout>
  )
}

export default App
