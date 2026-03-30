import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, User, LogOut, Bell, HardHat } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Professional } from '@/lib/database.types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  // Recupera il profilo professionale legato all'email dell'utente loggato
  const { data: proData } = await supabase
    .from('professionals')
    .select('ragione_sociale, status, is_top_rated')
    .eq('email', user.email!)
    .single()
  const pro = proData as Pick<Professional, 'ragione_sociale' | 'status' | 'is_top_rated'> | null

  const name = pro?.ragione_sociale ?? user.email?.split('@')[0] ?? 'Professionista'

  async function logout() {
    'use server'
    const { createClient: createSrv } = await import('@/lib/supabase/server')
    const srv = await createSrv()
    await srv.auth.signOut()
    redirect('/accedi')
  }

  const NAV = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/profilo', icon: User, label: 'Il mio profilo' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── SIDEBAR ───────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/" className="block mb-1">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Maest<span className="text-orange-500">ranze</span>
            </span>
          </Link>
          <span className="text-xs text-slate-400">Dashboard Professionista</span>
        </div>

        {/* Pro info */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600 text-sm flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 text-sm truncate">{name}</div>
              <div className="flex items-center gap-1.5">
                {pro?.is_top_rated ? (
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Top Rated</span>
                ) : pro?.status === 'active' ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Attivo</span>
                ) : (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">In revisione</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors w-full"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Esci
            </button>
          </form>
        </div>
      </aside>

      {/* ── CONTENUTO ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <span className="text-lg font-extrabold text-slate-900">
              Maest<span className="text-orange-500">ranze</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <HardHat className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-700 truncate max-w-28">{name}</span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
