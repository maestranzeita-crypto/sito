'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Inbox, User, Settings, HardHat } from 'lucide-react'

const NAV = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Home'        },
  { href: '/dashboard/richieste',    icon: Inbox,           label: 'Richieste'   },
  { href: '/dashboard/manodopera',   icon: HardHat,         label: 'Manodopera'  },
  { href: '/dashboard/profilo',      icon: User,            label: 'Profilo'     },
  { href: '/dashboard/impostazioni', icon: Settings,        label: 'Impostazioni'},
]

/** Sidebar links — desktop */
export function SidebarNavLinks() {
  const pathname = usePathname()
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              active
                ? 'bg-orange-500/10 text-orange-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

/** Bottom tab bar — mobile only */
export function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors min-h-[56px] ${
              active ? 'text-orange-500' : 'text-slate-400'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
