import { batch1 } from './batch1'
import { batch2 } from './batch2'
import { batch3 } from './batch3'
import { batch4 } from './batch4'
import type { LibraryEntry } from './LibraryPage'

// Library-level components, alphabetical. Each batch file adds its entries here.
export const libraryEntries: LibraryEntry[] = [...batch1, ...batch2, ...batch3, ...batch4].sort((a, b) => a.name.localeCompare(b.name))
