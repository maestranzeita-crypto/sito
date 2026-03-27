import type { Metadata } from 'next'
import { Shield, Star, Clock } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import QuoteForm from './QuoteForm'

export const metadata: Metadata = {
  title: 'Richiedi Preventivo Gratis — Maestranze',
  description:
    'Descrivi il tuo lavoro e ricevi fino a 3 preventivi gratuiti da professionisti verificati nella tua zona entro 24 ore.',
  alternates: { canonical: `${SITE_URL}/richiedi-preventivo` },
  robots: { index: false, follow: false },
}

const TRUST_ITEMS = [
  { icon: Shield, text: 'Solo professionisti con P.IVA e certificazioni verificate' },
  { icon: Star, text: 'Recensioni reali di altri clienti come te' },
  { icon: Clock, text: 'Risposta entro 24 ore, nessun obbligo' },
]

export default function RichiediPreventivoPage({
  searchParams,
}: {
  searchParams: { categoria?: string; citta?: string }
}) {
  const defaultCategory = searchParams.categoria ?? ''
  const defaultCity = searchParams.citta
    ? searchParams.citta.charAt(0).toUpperCase() + searchParams.citta.slice(1).replace(/-/g, ' ')
    : ''

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-orange-500 text-white text-center py-2.5 text-sm font-medium">
        ✓ Gratuito per i clienti &nbsp;·&nbsp; ✓ Nessun obbligo &nbsp;·&nbsp; ✓ Preventivi in 24h
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── FORM (3/5) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  Richiedi un preventivo gratuito
                </h1>
                <p className="text-slate-500 text-sm">
                  Ci vogliono 2 minuti. Riceverai fino a 3 offerte da professionisti verificati.
                </p>
              </div>
              <QuoteForm defaultCategory={defaultCategory} defaultCity={defaultCity} />
            </div>
          </div>

          {/* ── SIDEBAR (2/5) ── */}
          <aside className="lg:col-span-2 space-y-5">
            {/* Perché Maestranze */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Perché usare Maestranze</h2>
              <ul className="space-y-4">
                {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-sm text-slate-600 leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonianza */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                &ldquo;Ho trovato un ottimo installatore fotovoltaico in meno di 24 ore.
                Tre preventivi chiari, ho scelto il migliore e sono rimasto molto soddisfatto.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  G
                </div>
                <div>
                  <p className="text-sm font-semibold">Giuseppe M.</p>
                  <p className="text-xs text-slate-400">Milano</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { value: '2.400+', label: 'Professionisti' },
                  { value: '107', label: 'Province coperte' },
                  { value: '18.000+', label: 'Lavori completati' },
                  { value: '4.8/5', label: 'Valutazione media' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-xl font-extrabold text-orange-600">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
