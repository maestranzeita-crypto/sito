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
    photo: 'https://images.pexels.com/photos/9875445/pexels-photo-9875445.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
  },
  {
    icon: Zap,
    href: '#',
    title: 'Calcolatore Impianto Elettrico',
    desc: 'Stima il costo di rifacimento o ampliamento dell\'impianto elettrico in base ai mq e al tipo di abitazione.',
    badge: 'Presto disponibile',
    photo: 'https://images.pexels.com/photos/2898199/pexels-photo-2898199.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    disabled: true,
  },
  {
    icon: Droplets,
    href: '#',
    title: 'Calcolatore Impianto Idraulico',
    desc: 'Calcola il preventivo per installazione o sostituzione caldaia, impianto di riscaldamento o ristrutturazione bagno.',
    badge: 'Presto disponibile',
    photo: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
    disabled: true,
  },
  {
    icon: Home,
    href: '/calcolatore/ristrutturazione',
    title: 'Calcolatore Ristrutturazione',
    desc: 'Ottieni una stima del costo di ristrutturazione per mq: appartamento, bagno, cucina o singola stanza.',
    badge: 'Disponibile',
    photo: 'https://images.pexels.com/photos/3990359/pexels-photo-3990359.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1',
  },
]

export default function CalcolatoriPage() {
  return (
    <>
      {/* ── HERO con foto Pexels ───────────────────────────────── */}
      <section
        className="relative text-white py-14 md:py-28 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1920&h=900&dpr=1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* overlay scuro */}
        <div className="absolute inset-0 bg-slate-900/75" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {TOOLS.map(({ icon: Icon, href, title, desc, badge, photo, disabled }) => (
              <div
                key={title}
                className={`relative overflow-hidden rounded-2xl flex flex-col min-h-[240px] ${disabled ? 'opacity-80' : 'group'}`}
              >
                {/* Foto di sfondo */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${photo})` }}
                />
                {/* Overlay scuro sfumato */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30" />

                {/* Contenuto */}
                <div className="relative p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-auto">
                    <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      disabled
                        ? 'bg-white/20 text-white/70'
                        : 'bg-green-400/20 text-green-300 border border-green-400/30'
                    }`}>
                      {badge}
                    </span>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-lg font-extrabold text-white mb-2">{title}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed mb-5">{desc}</p>
                    {disabled ? (
                      <span className="inline-flex items-center gap-2 bg-white/10 text-white/50 font-semibold text-sm px-5 py-2.5 rounded-xl cursor-not-allowed w-fit border border-white/10">
                        Presto disponibile
                      </span>
                    ) : (
                      <Link
                        href={href}
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors w-fit shadow-lg"
                      >
                        Apri calcolatore <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
