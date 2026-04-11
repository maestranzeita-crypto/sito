import type { Metadata } from 'next'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import CalcolatoreRistrutturazioneClient from './CalcolatoreRistrutturazioneClient'

export const metadata: Metadata = {
  title: 'Calcolatore Ristrutturazione — Stima Costi per mq | Maestranze',
  description:
    'Calcola gratis il costo della tua ristrutturazione per metro quadro. Configura ambiente, tipo di intervento, qualità delle finiture e zona geografica.',
  alternates: { canonical: `${SITE_URL}/calcolatore/ristrutturazione` },
  keywords: [
    'calcolatore ristrutturazione',
    'costo ristrutturazione appartamento',
    'preventivo ristrutturazione',
    'costo ristrutturazione al mq',
    'quanto costa ristrutturare casa',
    'bonus ristrutturazioni 2025',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quanto costa ristrutturare un appartamento al mq?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il costo di ristrutturazione varia tra 300 e 1.200 €/mq a seconda del tipo di intervento (leggero, medio o completo), della qualità delle finiture e della zona geografica. Una ristrutturazione completa di un appartamento di 80 mq con finiture standard al Nord può costare tra 48.000€ e 96.000€.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quali incentivi fiscali ci sono per le ristrutturazioni nel 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per le ristrutturazioni ordinarie è disponibile il Bonus Ristrutturazioni con detrazione IRPEF del 50% in 10 anni, fino a un massimo di 96.000€ per unità immobiliare.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo ci vuole per ristrutturare un appartamento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I tempi dipendono dall\'entità dei lavori. Una ristrutturazione leggera richiede 2-4 settimane, una media 4-10 settimane, mentre una ristrutturazione completa può richiedere da 10 a 20 settimane per un appartamento di medie dimensioni.',
      },
    },
  ],
}

export default function CalcolatoreRistruttarazionePage() {
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
            <Link href="/calcolatore" className="hover:text-white transition-colors">Calcolatori</Link>
            <span>›</span>
            <span className="text-white">Ristrutturazione</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <Home className="w-12 h-12 text-orange-400 flex-shrink-0" />
            <div>
              <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Strumento gratuito</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                Calcolatore Ristrutturazione
              </h1>
            </div>
          </div>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            Stima in pochi secondi il costo della tua ristrutturazione per metro quadro.
            Configura ambiente, tipo di intervento e qualità delle finiture.
          </p>
        </div>
      </section>

      {/* ── CALCOLATORE ───────────────────────────────────────── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalcolatoreRistrutturazioneClient />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8">
            Domande frequenti sui costi di ristrutturazione
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Quanto costa ristrutturare un appartamento al mq?',
                a: 'Il costo varia tra 150 e 1.800 €/mq a seconda del tipo di intervento e delle finiture. Una ristrutturazione leggera (tinteggiatura, piccole riparazioni) parte da 150 €/mq, una media (pavimenti, impianti parziali) costa 300–600 €/mq, una completa (demolizione totale e ricostruzione) può arrivare a 600–1.200 €/mq per un appartamento.',
              },
              {
                q: 'Quali incentivi fiscali ci sono per le ristrutturazioni nel 2025?',
                a: 'Il Bonus Ristrutturazioni prevede una detrazione IRPEF del 50% in 10 anni sulle spese di ristrutturazione, fino a un massimo di 96.000€ per unità immobiliare. Per interventi di efficienza energetica è disponibile l\'Ecobonus con detrazioni variabili dal 50% al 65%.',
              },
              {
                q: 'Conviene fare tutto insieme o a lotti?',
                a: 'Fare tutti i lavori in una volta è generalmente più conveniente: si evitano costi di cantiere ripetuti, si ottimizza la sequenza delle lavorazioni (prima le demolizioni, poi gli impianti, poi le finiture) e si ottiene uno sconto maggiore dalle imprese. Dividere i lavori in più fasi ha senso solo per ragioni di budget.',
              },
              {
                q: 'Come si calcola la superficie per la ristrutturazione?',
                a: 'Si usa la superficie utile calpestabile (SUC), escludendo muri e tramezzi. Per un appartamento, considera la somma di tutti i vani abitabili. Per bagno e cucina considera la superficie del singolo locale.',
              },
              {
                q: 'Quanto tempo ci vuole per ristrutturare?',
                a: 'I tempi dipendono dal tipo di intervento. Una ristrutturazione leggera richiede 2-4 settimane, una media 4-10 settimane, una completa 10-20 settimane per un appartamento standard. I tempi si allungano in presenza di problemi strutturali o ritardi nelle forniture.',
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
