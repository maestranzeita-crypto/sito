import type { Metadata } from 'next'
import Link from 'next/link'
import { Sun, Zap, Droplets, Hammer, LayoutDashboard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manodopera Edile per Imprese e Artigiani — Maestranze',
  description:
    'Maestranze connette imprese con cantieri aperti ad artigiani qualificati disponibili. Senza agenzie, senza intermediari. Installatori FV, elettricisti, idraulici, muratori e molto altro.',
}

const STEPS_IMPRESE = [
  {
    n: '01',
    title: 'Registrati e pubblica la tua richiesta',
    desc: 'Indica la specializzazione cercata, la zona del cantiere, il periodo e il compenso.',
  },
  {
    n: '02',
    title: 'Ricevi profili di artigiani disponibili nella tua zona',
    desc: 'Ti mostriamo professionisti verificati con DURC valido e certificazioni in regola.',
  },
  {
    n: '03',
    title: 'Contatta direttamente e accordati',
    desc: 'Nessun intermediario. Parli direttamente con l\'artigiano e definisci i termini.',
  },
]

const STEPS_ARTIGIANI = [
  {
    n: '01',
    title: 'Registrati e imposta la tua disponibilità',
    desc: 'Carica la tua specializzazione, la zona operativa e le date in cui sei disponibile.',
  },
  {
    n: '02',
    title: 'Ricevi proposte da imprese nella tua zona',
    desc: 'Le imprese che cercano il tuo profilo ti contattano direttamente sulla piattaforma.',
  },
  {
    n: '03',
    title: 'Scegli quelle che ti interessano e lavora',
    desc: 'Valuta le proposte, accetta solo quelle giuste per te e gestisci tutto dalla dashboard.',
  },
]

const CATEGORIE = [
  {
    Icon: Sun,
    title: 'Installatori FV',
    desc: 'Professionisti abilitati per impianti fotovoltaici residenziali e industriali.',
  },
  {
    Icon: Zap,
    title: 'Elettricisti',
    desc: 'Installatori certificati DM 37/08 per impianti civili e industriali.',
  },
  {
    Icon: Droplets,
    title: 'Idraulici',
    desc: 'Specialisti di impianti idro-sanitari, termici e a gas.',
  },
  {
    Icon: Hammer,
    title: 'Muratori',
    desc: 'Edili esperti in costruzioni, ristrutturazioni e opere civili.',
  },
]

export default function ManodoperaPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center text-white h-[400px] md:h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wider">
            Per Imprese e Artigiani
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Maestranze per le Imprese e gli Artigiani
          </h1>
          <p className="text-white/85 text-base md:text-lg leading-relaxed">
            La piattaforma che risolve il problema numero uno dell&apos;edilizia italiana: trovare manodopera qualificata quando serve.
          </p>
        </div>
      </section>

      {/* ─── COME FUNZIONA — IMPRESE ───────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Per le imprese</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900">
              Come funziona per le imprese
            </h2>
          </div>
          <ol className="space-y-8">
            {STEPS_IMPRESE.map(({ n, title, desc }) => (
              <li key={n} className="flex gap-5">
                <span className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-lg font-extrabold shadow-md">
                  {n}
                </span>
                <div className="pt-1">
                  <p className="font-bold text-slate-900 text-lg mb-1">{title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── COME FUNZIONA — ARTIGIANI ─────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Per gli artigiani</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900">
              Come funziona per gli artigiani
            </h2>
          </div>
          <ol className="space-y-8">
            {STEPS_ARTIGIANI.map(({ n, title, desc }) => (
              <li key={n} className="flex gap-5">
                <span className="flex-shrink-0 w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center text-lg font-extrabold shadow-md">
                  {n}
                </span>
                <div className="pt-1">
                  <p className="font-bold text-slate-900 text-lg mb-1">{title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── COSA TROVI SU MAESTRANZE ──────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Cosa trovi su Maestranze
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
              Professionisti verificati, con DURC in regola e certificazioni di settore.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIE.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:border-orange-300 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TUTTO NELLA TUA DASHBOARD ─────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            Tutto nella tua dashboard
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Una volta registrato, gestisci tutto dalla tua dashboard personale: disponibilità, proposte ricevute, storico collaborazioni e recensioni.
          </p>
          <Link href="/registrati">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg">
              Registrati Gratis
            </button>
          </Link>
        </div>
      </section>

      {/* ─── DISCLAIMER LEGALE ─────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed text-center">
            Maestranze è una piattaforma di matching che facilita il contatto tra professionisti e imprese.
            Il rapporto contrattuale è esclusivamente tra le parti. Maestranze non è un&apos;agenzia per il lavoro
            ai sensi del D.Lgs. 276/2003 e non svolge attività di somministrazione, intermediazione o ricerca
            e selezione del personale.
          </p>
        </div>
      </footer>
    </div>
  )
}
