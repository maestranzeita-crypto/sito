'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

function useHideChrome() {
  const pathname = usePathname() ?? ''
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/accedi') ||
    pathname.startsWith('/admin')
  )
}

export function ChromeHeader() {
  if (useHideChrome()) return null
  return <Header />
}

export function ChromeFooter() {
  if (useHideChrome()) return null
  return <Footer />
}
