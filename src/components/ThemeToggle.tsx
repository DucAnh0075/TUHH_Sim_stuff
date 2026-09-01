import { useState } from 'react'
import { getTheme, toggleTheme } from '../lib/theme'

/** Minimalist sun/moon button, fixed in the top-right corner of every screen. */
export function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme)
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(toggleTheme())}
      aria-label="Theme umschalten"
      title="Theme umschalten"
      className="fixed top-3 right-3 z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    >
      {dark ? (
        // Moon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        // Sun
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  )
}
