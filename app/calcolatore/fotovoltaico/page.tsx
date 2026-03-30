import type { Metadata } from 'next'
import Link from 'next/link'
import { Sun } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import CalcolatoreClient from './CalcolatoreClient'

export const metadata: Metadata = {
  title: 'Calcolatore Fotovoltaico — Stima Risparmio e Costo Impianto | Maestranze',
  description:
    'Calcola gratis il costo di un impianto fotovoltaico, il risparmio annuo in bolletta e il tempo di ammortamento. Configura kWp, batterie e zona geografica.',
  alternates: { canonical: `${SITE_URL}/calcolatore/fotovoltaico` },
  keywords: [
    'calcolatore fotovoltaico',
    'calcolo risparmio fotovoltaico',
    'costo impianto fotovoltaico',
    'preventivo fotovoltaico',
    'ammortamento fotovoltaico',
    'fotovoltaico quanto si risparmia',
  ],
}

// Schema FAQ per rich snippet
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quanto si risparmia con il fotovoltaico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Con un impianto fotovoltaico da 4,5 kWp si risparmia mediamente tra 600€ e 900€ all\'anno in bolletta, a seconda della zona geografica e dei consumi.',
      },
    },
    {
      '@type': 'Question',
      name: 'In quanti anni si ammortizza un impianto fotovoltaico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Considerando il risparmio in bolletta e la detrazione IRPEF del 50% in 10 anni, un impianto fotovoltaico si ammortizza in media in 7–10 anni.',
      },
    },
    {
      '@type': 'Question',
      name: 'Conviene aggiungere le batterie di accumulo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le batterie aumentano l\'autoconsumo fino all\'80–90% dell\'energia prodotta, ma hanno un costo aggiuntivo di 3.500€–9.000€. Convengono di più se si consuma anche la sera.',
      },
    },
  ],
}

export default function CalcolatoreFotovoltaicoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href="/fotovoltaico" className="hover:text-white transition-colors">Fotovoltaico</Link>
            <span>›</span>
            <span className="text-white">Calcolatore</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-12 h-12 text-orange-400 flex-shrink-0" />
            <div>
              <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Strumento gratuito</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                Calcolatore Fotovoltaico
              </h1>
            </div>
          </div>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            Stima in pochi secondi il costo dell'impianto, il risparmio annuo in bolletta e il tempo di ammortamento.
            Configura potenza, batterie e zona geografica.
          </p>
        </div>
      </section>

      {/* ── CALCOLATORE ───────────────────────────────────────── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalcolatoreClient />
        </div>
      </section>

      {/* ── GUIDA RAPIDA ──────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8">
            Domande frequenti sul fotovoltaico
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Quanto si risparmia con il fotovoltaico?',
                a: 'Con un impianto da 4,5 kWp si risparmia mediamente tra 600€ e 900€ all\'anno in bolletta, a seconda della zona geografica e dei consumi domestici. Al Sud il risparmio è maggiore grazie a più ore di sole.',
              },
              {
                q: 'In quanti anni si ammortizza un impianto fotovoltaico?',
                a: 'Considerando il risparmio in bolletta e la detrazione IRPEF del 50% in 10 anni (50€ ogni 1.000€ investiti), l\'ammortamento avviene mediamente in 7–10 anni. Dopo il recupero dell\'investimento l\'energia è praticamente gratuita per altri 15+ anni.',
              },
              {
                q: 'Conviene aggiungere le batterie di accumulo?',
                a: 'Le batterie consentono di immagazzinare l\'energia prodotta di giorno per usarla la sera. Aumentano l\'autoconsumo fino all\'80–90%, ma hanno un costo aggiuntivo di 3.500€–9.000€. Convengono di più se i consumi serali sono elevati e il costo dell\'energia è alto.',
              },
              {
                q: 'Quanta superficie serve per il fotovoltaico?',
                a: 'Ogni kWp di impianto richiede circa 6–8 m² di superficie di tetto. Un impianto da 4,5 kWp occupa quindi circa 27–36 m², mentre uno da 6 kWp circa 36–48 m².',
              },
              {
                q: 'Quali incentivi ci sono per il fotovoltaico nel 2025?',
                a: 'Per le abitazioni private è disponibile la detrazione IRPEF del 50% in 10 anni (Bonus Ristrutturazioni). È inoltre possibile accedere allo Scambio sul Posto (SSP) per cedere alla rete l\'energia in eccesso.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-bold text-slate-900 mb-2">{q}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
