'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/** Applica il tema al mount e ascolta i cambiamenti da altri toggle nella stessa pagina */
function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('maestranze-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Anti-FOUC provider — non renderizza nulla, applica solo la classe dark all'html */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getInitialTheme()
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])
  return <>{children}</>
}

/** Bottone toggle autonomo — ogni istanza si sincronizza tramite localStorage + custom event */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Legge stato iniziale
    setDark(getInitialTheme() === 'dark')

    // Ascolta cambiamenti da altre istanze del toggle nella stessa pagina
    function onThemeChange(e: Event) {
      setDark((e as CustomEvent<boolean>).detail)
    }
    window.addEventListener('maestranze-theme-change', onThemeChange)
    return () => window.removeEventListener('maestranze-theme-change', onThemeChange)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    localStorage.setItem('maestranze-theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
    // Notifica le altre istanze
    window.dispatchEvent(new CustomEvent('maestranze-theme-change', { detail: next }))
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
      className={`p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
