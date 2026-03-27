import { useEffect } from 'react'
import useAppStore from '../store/appStore'

/**
 * Custom hook for theme management.
 *
 * - Reads the current theme from the Zustand store.
 * - Synchronises the `dark` class on `<html>` whenever the theme changes.
 * - Returns a convenient API for components to consume.
 */
export default function useTheme() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const isDark = theme === 'dark'

  // Keep document.documentElement in sync whenever the theme value changes.
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return { theme, toggleTheme, isDark }
}
