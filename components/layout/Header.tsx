'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'
import Button from '@/components/ui/Button'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Maest<span className="text-orange-500">ranze</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium text-sm"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                Servizi <ChevronDown className="w-4 h-4" />
              </button>
              {servicesOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <cat.icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      {cat.nameShort}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/calcolatore" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Calcolatori
            </Link>
            <Link href="/lavoro" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Trova Lavoro
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Guide
            </Link>
            <Link href="/come-funziona" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
              Come Funziona
            </Link>
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/accedi">
              <Button variant="ghost" size="sm">Accedi</Button>
            </Link>
            <Link href="/registrati">
              <Button size="sm">Registrati Gratis</Button>
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
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1">Servizi</p>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex items-center gap-3 px-2 py-2.5 text-sm text-slate-700 hover:bg-orange-50 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              <cat.icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              {cat.nameShort}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
            <Link href="/calcolatore" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Calcolatori</Link>
            <Link href="/lavoro" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Trova Lavoro</Link>
            <Link href="/blog" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Guide</Link>
            <Link href="/come-funziona" className="block px-2 py-2 text-sm text-slate-700" onClick={() => setMobileOpen(false)}>Come Funziona</Link>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2">
            <Link href="/accedi" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Accedi</Button>
            </Link>
            <Link href="/registrati" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">Registrati Gratis</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
