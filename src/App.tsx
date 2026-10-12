import { useEffect, useState } from 'react'
import { ColorPage } from './styleguide/ColorPage'
import { Layout } from './styleguide/Layout'
import { TypographyPage } from './styleguide/TypographyPage'

const pages: Record<string, () => React.JSX.Element> = { color: ColorPage, typography: TypographyPage }
const currentPath = () => window.location.hash.slice(1) || 'color'

function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onHash = () => setPath(currentPath())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const Page = pages[path] ?? ColorPage
  return (
    <Layout current={path}>
      <Page />
    </Layout>
  )
}

export default App
