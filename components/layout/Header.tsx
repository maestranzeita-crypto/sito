'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Button from '@/components/ui/Button'

interface ProProfile {
  ragione_sociale: string
  citta: string
  foto_url: string | null
}

function UserMenu({ user, profile }: { user: SupabaseUser; profile: ProProfile | null }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const name = profile?.ragione_sociale ?? user.email?.split('@')[0] ?? 'Utente'
  const initial = name.charAt(0).toUpperCase()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors"
        aria-label="Menu utente"
      >
        {profile?.foto_url ? (
          <Image
            src={profile.foto_url}
            alt={name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-orange-400 flex-shrink-0"
            unoptimized
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm border-2 border-orange-400 flex-shrink-0">
            {initial}
          </div>
        )}
        <span className="text-sm font-semibold text-slate-800 max-w-[120px] truncate">{name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
          {/* Info utente */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            {profile?.citta && (
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.citta.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </p>
            )}
          </div>

          {/* Azioni */}
          <div className="py-1">
            <Link
              href="/dashboard/profilo"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <User className="w-4 h-4" />
              Il mio profilo
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          <div className="border-t border-slate-100 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Esci
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const pathname = usePathname() ?? ''
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<ProProfile | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user?.email) {
        supabase
          .from('professionals')
          .select('ragione_sociale, citta, foto_url')
          .eq('email', user.email)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data as ProProfile)
          })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/accedi') ||
    pathname.startsWith('/admin')
  ) return null

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

          {/* CTA / Avatar */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {user ? (
              <UserMenu user={user} profile={profile} />
            ) : (
              <>
                <Link href="/accedi">
                  <Button variant="ghost" size="sm">Accedi</Button>
                </Link>
                <Link href="/registrati">
                  <Button size="sm">Registrati</Button>
                </Link>
              </>
            )}
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
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  {profile?.foto_url ? (
                    <Image src={profile.foto_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" unoptimized />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {(profile?.ragione_sociale ?? user.email ?? 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{profile?.ragione_sociale ?? user.email?.split('@')[0]}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/dashboard/profilo" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Il mio profilo</Button>
                </Link>
                <button
                  onClick={async () => { const s = createClient(); await s.auth.signOut(); window.location.href = '/' }}
                  className="w-full text-sm font-semibold text-red-500 border border-red-200 rounded-xl py-2 hover:bg-red-50 transition-colors"
                >
                  Esci
                </button>
              </>
            ) : (
              <>
                <Link href="/accedi" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Accedi</Button>
                </Link>
                <Link href="/registrati" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Registrati</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
