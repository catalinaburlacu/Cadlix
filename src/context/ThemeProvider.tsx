import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Theme, ThemeContextType, ChildrenProps } from '@/types'
import { ThemeContext } from './ThemeContext'

const THEME_STORAGE_KEY = 'cadlix_theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
  } catch {
    // Ignore localStorage errors and fallback to system preference.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: ChildrenProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore localStorage write errors.
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
