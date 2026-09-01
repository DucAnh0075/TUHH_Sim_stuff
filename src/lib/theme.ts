export type Theme = 'light' | 'dark'

const KEY = 'es-exam-trainer:theme'

/** The active theme, reading the `.dark` class that index.html sets before paint. */
export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Reflects `theme` on <html> and remembers the choice. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Private windows and blocked site data: the choice is simply not remembered.
  }
}

/** Flips the theme and returns the new value. */
export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}
