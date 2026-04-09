'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/profili', label: 'Profili', icon: '◉' },
  { href: '/admin/lead', label: 'Lead', icon: '≡' },
]

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()
  return (
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <span className="font-bold text-gray-900 text-sm tracking-tight">Maestranze</span>
        <span className="ml-2 text-[10px] font-semibold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">ADMIN</span>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 truncate">{email}</p>
      </div>
    </aside>
  )
}
