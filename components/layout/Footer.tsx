'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'
import { SITE_NAME } from '@/lib/utils'

export default function Footer() {
  const pathname = usePathname() ?? ''
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/accedi') ||
    pathname.startsWith('/admin')
  ) return null

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-white.svg"
                alt="Maestranze"
                width={195}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Il marketplace di riferimento per il settore edile e impiantistico italiano.
            </p>
          </div>

          {/* Servizi */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Servizi</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-sm hover:text-white transition-colors">
                    {cat.nameShort}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Per i professionisti */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Per i Professionisti</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/registrati" className="hover:text-white transition-colors">Registrati Gratis</Link></li>
              <li><Link href="/calcolatore/fotovoltaico" className="hover:text-white transition-colors">Calcolatore Fotovoltaico</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Guide e Risorse</Link></li>
            </ul>
          </div>

          {/* Azienda */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Azienda</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chi-siamo" className="hover:text-white transition-colors">Chi Siamo</Link></li>
              <li><Link href="/contatti" className="hover:text-white transition-colors">Contatti</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/termini" className="hover:text-white transition-colors">Termini di Servizio</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {SITE_NAME}.com — Tutti i diritti riservati
        </div>
      </div>
    </footer>
  )
}
