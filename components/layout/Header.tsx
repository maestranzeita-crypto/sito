'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Maestranze"
              width={195}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/chi-siamo" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Chi siamo
            </Link>
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Dashboard
            </Link>
            <Link href="/calcolatore" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Calcolatori
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Guide
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/accedi">
              <Button variant="ghost" size="sm">Accedi</Button>
            </Link>
            <Link href="/registrati">
              <Button size="sm">Registrati</Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          <div className="space-y-2">
            <Link href="/chi-siamo" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Chi siamo</Link>
            <Link href="/dashboard" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link href="/calcolatore" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Calcolatori</Link>
            <Link href="/blog" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Guide</Link>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2">
            <Link href="/accedi" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Accedi</Button>
            </Link>
            <Link href="/registrati" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Registrati</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
