import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_STORAGE_KEY = 'portfolio-theme-mode'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const persistedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (persistedTheme === 'light' || persistedTheme === 'dark') {
    return persistedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(THEME_STORAGE_KEY, theme)

    const rootElement = window.document.documentElement
    rootElement.setAttribute('data-theme', theme)
    rootElement.classList.toggle('dark-theme', theme === 'dark')
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.')
  }

  return context
}
