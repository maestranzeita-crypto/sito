import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Professional } from '@/lib/database.types'
import { SidebarNavLinks, MobileBottomNav } from './NavLinks'
import { ThemeProvider, ThemeToggle } from './ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  const { data: proData } = await supabase
    .from('professionals')
    .select('id, ragione_sociale, status, is_top_rated')
    .eq('email', user.email!)
    .single()
  const pro = proData as Pick<Professional, 'id' | 'ragione_sociale' | 'status' | 'is_top_rated'> | null

  const name = pro?.ragione_sociale ?? user.email?.split('@')[0] ?? 'Professionista'

  async function logout() {
    'use server'
    const { createClient: createSrv } = await import('@/lib/supabase/server')
    const srv = await createSrv()
    await srv.auth.signOut()
    redirect('/accedi')
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">

        {/* ── SIDEBAR (desktop) ─────────────────────────────────── */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden md:flex">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
            <Link href="/" className="block mb-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Maest<span className="text-orange-500">ranze</span>
              </span>
            </Link>
            <span className="text-xs text-slate-400 dark:text-slate-500">Dashboard Professionista</span>
          </div>

          {/* Pro info */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center font-bold text-orange-600 text-sm flex-shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{name}</div>
                <div className="flex items-center gap-1.5">
                  {pro?.is_top_rated ? (
                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">Top Rated</span>
                  ) : pro?.status === 'active' ? (
                    <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">Attivo</span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">In revisione</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <SidebarNavLinks />

          {/* Anteprima + Tema + Logout */}
          <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
            {pro?.id && (
              <Link
                href={`/professionisti/${pro.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                Vedi profilo pubblico
              </Link>
            )}
            <div className="flex items-center gap-1 px-3 py-2.5">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex-1">Tema</span>
              <ThemeToggle />
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors w-full"
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
          <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <Link href="/">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                Maest<span className="text-orange-500">ranze</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              {pro?.id && (
                <Link
                  href={`/professionisti/${pro.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40"
                  aria-label="Vedi profilo pubblico"
                >
                  <Eye className="w-5 h-5" />
                </Link>
              )}
              <ThemeToggle />
              <form action={logout}>
                <button
                  type="submit"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                  aria-label="Esci"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </header>

          {/* Extra padding-bottom on mobile to clear the bottom nav */}
          <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
            {children}
          </main>
        </div>

        {/* ── BOTTOM NAV (mobile) ───────────────────────────────── */}
        <MobileBottomNav />
      </div>
    </ThemeProvider>
  )
}
