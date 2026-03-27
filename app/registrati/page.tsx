import type { Metadata } from 'next'
import { CheckCircle2, TrendingUp, Users, Star, Zap } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Registrati come Professionista — Maestranze',
  description:
    'Crea il tuo profilo gratuito su Maestranze. Ricevi richieste di preventivo da clienti verificati nella tua zona. Profilo attivo in 24 ore.',
  alternates: { canonical: `${SITE_URL}/registrati` },
}

const BENEFITS = [
  {
    icon: Users,
    title: 'Clienti qualificati',
    desc: 'Ricevi richieste da clienti reali nella tua zona, già filtrate per tipo di lavoro.',
  },
  {
    icon: TrendingUp,
    title: 'Fai crescere il business',
    desc: 'Profilo sempre visibile su Google. Più lavori, più recensioni, più visibilità.',
  },
  {
    icon: Star,
    title: 'Badge di qualità',
    desc: 'I professionisti con ottime recensioni ottengono il badge "Top Rated" e priorità nei risultati.',
  },
  {
    icon: Zap,
    title: 'Zero commissioni',
    desc: 'Nessuna commissione sui lavori. Paghi solo se vuoi più visibilità con i piani premium.',
  },
]

export default function RegistratiPage({
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
        ✓ Registrazione gratuita &nbsp;·&nbsp; ✓ Profilo attivo in 24h &nbsp;·&nbsp; ✓ Zero commissioni sui lavori
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── FORM (3/5) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  Crea il tuo profilo professionale
                </h1>
                <p className="text-slate-500 text-sm">
                  Ci vogliono 3 minuti. Il tuo profilo verrà verificato e attivato entro 24 ore.
                </p>
              </div>
              <RegisterForm defaultCategory={defaultCategory} defaultCity={defaultCity} />
            </div>
          </div>

          {/* ── SIDEBAR (2/5) ── */}
          <aside className="lg:col-span-2 space-y-5">
            {/* Benefici */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Cosa ottieni con Maestranze</h2>
              <ul className="space-y-4">
                {BENEFITS.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500 leading-snug mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonianza professionista */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                &ldquo;Da quando mi sono iscritto a Maestranze ho triplicato i contatti mensili.
                I clienti arrivano già informati e motivati. È diventata la mia fonte principale di lavoro.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  R
                </div>
                <div>
                  <p className="text-sm font-semibold">Roberto V.</p>
                  <p className="text-xs text-slate-400">Elettricista · Torino · Top Rated</p>
                </div>
              </div>
            </div>

            {/* Processo di verifica */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Come funziona la verifica</h3>
              <ul className="space-y-2.5">
                {[
                  'Controllo P.IVA e visura camerale',
                  'Verifica certificazioni di settore',
                  'Attivazione profilo pubblico',
                  'Prima richiesta di preventivo',
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-400 mt-3">Tempo medio di attivazione: 24–48 ore</p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
