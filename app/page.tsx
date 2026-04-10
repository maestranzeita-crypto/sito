import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  BarChart3,
  Bell,
  Star,
  ShieldCheck,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { SITE_DESCRIPTION } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Maestranze — Trova artigiani qualificati per il tuo cantiere',
  description:
    'La piattaforma italiana per imprese edili. Trova elettricisti, idraulici, muratori e installatori fotovoltaico verificati. Profili completi, disponibilità in tempo reale.',
  alternates: { canonical: 'https://maestranze.com' },
}

// Schema.org JSON-LD
function HomeJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Maestranze',
          url: 'https://maestranze.com',
          description: SITE_DESCRIPTION,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://maestranze.com/cerca?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  )
}

const PROBLEM_CARDS = [
  'Trovare personale qualificato in fretta è quasi impossibile.',
  'Il passaparola non basta. Le agenzie costano e ci vogliono settimane.',
  "L'artigiano giusto esiste. Mancava il posto dove trovarlo.",
]

const STEPS = [
  {
    n: '01',
    title: 'Cerca',
    desc: 'Filtra per specializzazione, zona e disponibilità. Vedi subito chi c\'è.',
  },
  {
    n: '02',
    title: 'Valuta',
    desc: 'Leggi il profilo completo: certificazioni, foto lavori, recensioni di altre imprese.',
  },
  {
    n: '03',
    title: 'Contatta',
    desc: 'Scrivi direttamente all\'artigiano. Nessun intermediario.',
  },
]

const PROFILE_FEATURES = [
  'Foto e descrizione del professionista',
  'Specializzazioni e zone coperte',
  'Certificazioni verificate — DM 37/08, DURC, polizza RC',
  'Foto dei lavori eseguiti',
  'Recensioni di altre imprese che lo hanno già ingaggiato',
  'Disponibilità aggiornata in tempo reale',
  'Tariffa indicativa',
]

const BADGE_CARDS = [
  {
    title: 'Profilo Base',
    badge: null,
    items: [
      'Aperto a tutti',
      'Foto, specializzazione, esperienza',
      'Senza P.IVA',
    ],
    note: 'Per chi cerca lavoro come dipendente o collaboratore',
  },
  {
    title: 'P.IVA Verificata',
    badge: { label: 'P.IVA', color: 'bg-slate-400' },
    items: [
      'Partita IVA attiva e verificata',
      'Lavora in autonomia',
    ],
    note: 'Per artigiani che lavorano in proprio',
  },
  {
    title: 'Maestranze Verificato',
    badge: { label: 'Verificato', color: 'bg-orange-500' },
    items: [
      'DURC in corso di validità',
      'Certificazioni di settore',
      'Polizza RC professionale',
      'Controllo manuale',
    ],
    note: 'La nostra garanzia di qualità',
  },
]

const DASHBOARD_CARDS = [
  {
    icon: Building2,
    title: 'Gestione Cantieri',
    desc: 'Crea un cantiere, aggiungi le figure che ti servono e tieni traccia di chi hai trovato e chi manca ancora.',
  },
  {
    icon: Users,
    title: 'Squadra Fidata',
    desc: 'Salva gli artigiani con cui hai lavorato bene. Vedi in tempo reale se sono disponibili e contattali in un click.',
  },
  {
    icon: BarChart3,
    title: 'Storico e Statistiche',
    desc: 'Quanti artigiani hai ingaggiato, per quale ruolo, a quale costo medio. Tutto tracciato, tutto misurabile.',
  },
  {
    icon: Bell,
    title: 'Notifiche Intelligenti',
    desc: 'Ti avvisiamo quando un artigiano della tua Squadra Fidata torna disponibile nella tua zona.',
  },
]

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />

      {/* ─── 1. HERO ──────────────────────────────────────────── */}
      <section className="relative text-white overflow-hidden">
        {/* Sfondo fotografico */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
        {/* Contenuto */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
              Per Imprese Edili
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5">
              Trova l&apos;artigiano giusto per il tuo cantiere.{' '}
              <span className="text-orange-400">In 48 ore.</span>
            </h1>
            <p className="text-white/85 text-lg leading-relaxed mb-8">
              Hai accesso al profilo completo di ogni professionista — specializzazioni,
              certificazioni, recensioni reali e disponibilità aggiornata. Scegli chi
              vuoi, contattalo direttamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/manodopera">
                <Button size="lg">Cerca un artigiano</Button>
              </Link>
              <Link href="/registrati">
                <button className="px-8 py-3.5 text-lg font-semibold border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors">
                  Registra la tua impresa
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {['DURC verificato', 'Profili completi', 'Zero commissioni'].map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-full"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. IL PROBLEMA ───────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-10">
            Chi lavora in edilizia lo sa già.
          </h2>
          <div className="flex flex-col gap-4">
            {PROBLEM_CARDS.map((text) => (
              <div
                key={text}
                className="border-l-4 border-orange-500 pl-5 py-4 bg-slate-50 rounded-r-xl"
              >
                <p className="text-slate-700 font-medium text-base md:text-lg">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. COME FUNZIONA ─────────────────────────────────── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-12">
            Semplice come cercare su LinkedIn.{' '}
            <span className="text-orange-500">Ma per l&apos;edilizia.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-extrabold shadow-md">
                  {n}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. I PROFILI ─────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Ogni artigiano ha un profilo completo.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Non una semplice scheda. Uno strumento per scegliere con criterio.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lista features */}
            <ul className="space-y-4">
              {PROFILE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{f}</span>
                </li>
              ))}
            </ul>

            {/* Mock card profilo */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm max-w-sm mx-auto w-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-xl">
                  MR
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">Marco R.</p>
                  <p className="text-sm text-slate-500">Elettricista</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">4.9 (23 rec.)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verificato
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
                  DM 37/08
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
                  DURC valido
                </span>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
                  Polizza RC
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Roma, Milano, Napoli &nbsp;·&nbsp; Disponibile da subito
              </p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                Contatta
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. BADGE E VERIFICA ──────────────────────────────── */}
      <section className="relative text-white py-16 overflow-hidden">
        {/* Sfondo fotografico */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay navy */}
        <div className="absolute inset-0 bg-slate-900/85" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Scegli in base a quello che ti serve.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Su Maestranze trovi tre tipi di professionisti.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {BADGE_CARDS.map(({ title, badge, items, note }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-white text-base">{title}</h3>
                  {badge && (
                    <span
                      className={`${badge.color} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}
                    >
                      {badge.label}
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 italic">{note}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400">
            I risultati mostrano prima i profili Verificati, poi P.IVA, poi Base.
            Puoi sempre espandere la ricerca.
          </p>
        </div>
      </section>

      {/* ─── 6. DASHBOARD PRO ─────────────────────────────────── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wider">
              Dashboard Pro — Per Imprese
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Uno strumento di gestione, non solo una rubrica.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Con il piano Pro hai tutto quello che ti serve per gestire la manodopera
              dei tuoi cantieri in un unico posto.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {DASHBOARD_CARDS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/registrati">
              <Button size="lg">
                Scopri il piano Pro <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 7. PER I PRIVATI ─────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Sei un privato e cerchi un professionista per casa?
          </p>
          <p className="text-slate-600 mb-6">
            Preventivi gratuiti da professionisti verificati nella tua zona.
          </p>
          <Link href="/preventivo">
            <button className="px-8 py-3 font-semibold border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
              Richiedi un preventivo
            </button>
          </Link>
        </div>
      </section>

      {/* ─── 8. CTA FINALE ────────────────────────────────────── */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
            Inizia oggi. È gratuito.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/manodopera">
              <button className="w-full sm:w-auto bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-base shadow-md">
                Sono un&apos;impresa
              </button>
            </Link>
            <Link href="/registrati">
              <button className="w-full sm:w-auto border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base">
                Sono un artigiano
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
