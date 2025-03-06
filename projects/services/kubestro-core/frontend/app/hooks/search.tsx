import { createContext, use, useEffect, useMemo, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { CommandMenu } from '~/features/dashboard/_components/command-menu'

interface SearchContextValue {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContextValue | null>(null)

interface SearchProviderProps {
  readonly children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    document.addEventListener('keydown', (event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(op => !op)
      }
    }, { signal: controller.signal })

    return () => {
      controller.abort()
    }
  }, [])

  const values = useMemo(() => ({
    open,
    setOpen
  }), [open, setOpen])

  return (
    <SearchContext.Provider value={values}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const searchContext = use(SearchContext)

  if (!searchContext) {
    throw new Error('useSearch must be used within a SearchProvider.')
  }

  return searchContext
}
