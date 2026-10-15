import { batch1 } from './batch1'
import type { LibraryEntry } from './LibraryPage'

// Library-level components, alphabetical. Each batch file adds its entries here.
export const libraryEntries: LibraryEntry[] = [...batch1].sort((a, b) => a.name.localeCompare(b.name))
