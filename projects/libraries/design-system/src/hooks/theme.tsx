import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeProviderProps {
  readonly children: React.ReactNode
  readonly defaultTheme?: Theme
  readonly storageKey?: string
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeContextValue = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeContextValue>(initialState)

// You would need to implement this function
function isValidTheme(value: string): value is Theme {
  // Check if value is one of your valid theme values
  return ['light', 'dark', 'system'].includes(value)
}

function getStoredTheme(storageKey: string, defaultTheme: Theme) {
  const storedTheme = localStorage.getItem(storageKey)
  if (!storedTheme) {
    return defaultTheme
  }

  if (isValidTheme(storedTheme)) {
    return storedTheme
  }

  return defaultTheme
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'kubestro-theme',
  ...props
}: ThemeProviderProps) {
  const [theme_, setTheme_] = useState<Theme>(
    () => getStoredTheme(storageKey, defaultTheme)
  )

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (t: Theme) => {
      // Remove existing theme attributes
      root.removeAttribute('data-theme')
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      const effectiveTheme = t === 'system' ? systemTheme : t
      // Add the new theme attribute
      root.setAttribute('data-theme', effectiveTheme)
    }

    applyTheme(theme_)

    const controller = new AbortController()
    mediaQuery.addEventListener('change', () => {
      if (theme_ === 'system') {
        applyTheme('system')
      }
    }, { signal: controller.signal })

    return () => { controller.abort() }
  }, [theme_])

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(storageKey, t)
    setTheme_(t)
  }, [storageKey])

  const value = useMemo(() => ({
    theme: theme_,
    setTheme
  }), [theme_, setTheme])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeProviderContext)
}
