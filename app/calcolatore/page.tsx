import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sun, Zap, Droplets, Home } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Calcolatori Preventivi — Fotovoltaico, Elettricista, Idraulico | Maestranze',
  description:
    'Strumenti gratuiti per stimare il costo dei lavori di casa: calcolatore fotovoltaico, impianti elettrici, idraulici e ristrutturazioni. Ottieni poi un preventivo reale.',
  alternates: { canonical: `${SITE_URL}/calcolatore` },
}

const TOOLS = [
  {
    icon: Sun,
    href: '/calcolatore/fotovoltaico',
    title: 'Calcolatore Fotovoltaico',
    desc: 'Stima costo, risparmio annuo e ammortamento del tuo impianto solare. Configura kWp, batterie e zona geografica.',
    badge: 'Disponibile',
    badgeColor: 'bg-green-100 text-green-700',
    color: 'from-amber-50 to-orange-50 border-amber-200',
  },
  {
    icon: Zap,
    href: '/calcolatore/fotovoltaico',
    title: 'Calcolatore Impianto Elettrico',
    desc: 'Stima il costo di rifacimento o ampliamento dell\'impianto elettrico in base ai mq e al tipo di abitazione.',
    badge: 'Presto disponibile',
    badgeColor: 'bg-slate-100 text-slate-500',
    color: 'from-yellow-50 to-amber-50 border-yellow-200',
    disabled: true,
  },
  {
    icon: Droplets,
    href: '/calcolatore/fotovoltaico',
    title: 'Calcolatore Impianto Idraulico',
    desc: 'Calcola il preventivo per installazione o sostituzione caldaia, impianto di riscaldamento o ristrutturazione bagno.',
    badge: 'Presto disponibile',
    badgeColor: 'bg-slate-100 text-slate-500',
    color: 'from-blue-50 to-cyan-50 border-blue-200',
    disabled: true,
  },
  {
    icon: Home,
    href: '/calcolatore/ristrutturazione',
    title: 'Calcolatore Ristrutturazione',
    desc: 'Ottieni una stima del costo di ristrutturazione per mq: appartamento, bagno, cucina o singola stanza.',
    badge: 'Disponibile',
    badgeColor: 'bg-green-100 text-green-700',
    color: 'from-green-50 to-emerald-50 border-green-200',
  },
]

export default function CalcolatoriPage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white">Calcolatori</span>
          </nav>
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Strumenti gratuiti</span>
            <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Calcolatori Preventivi
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Stima il costo dei tuoi lavori di casa in pochi secondi. Poi richiedi un preventivo reale da professionisti verificati.
            </p>
          </div>
        </div>
      </section>

      {/* ── GRIGLIA STRUMENTI ─────────────────────────────────── */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TOOLS.map(({ icon: Icon, href, title, desc, badge, badgeColor, color, disabled }) => (
              <div
                key={title}
                className={`bg-gradient-to-br ${color} border rounded-2xl p-6 flex flex-col ${disabled ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="w-10 h-10 text-slate-600" />
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{desc}</p>
                {disabled ? (
                  <span className="inline-flex items-center gap-2 bg-white/70 text-slate-400 font-semibold text-sm px-5 py-2.5 rounded-xl cursor-not-allowed w-fit">
                    Presto disponibile
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors w-fit"
                  >
                    Apri calcolatore <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
