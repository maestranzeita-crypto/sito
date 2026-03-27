import type { Metadata } from 'next'
import { CheckCircle2, Users, Zap, Target, Clock } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import JobPostForm from './JobPostForm'

export const metadata: Metadata = {
  title: 'Pubblica un\'Offerta di Lavoro Edilizia — Gratis | Maestranze',
  description:
    'Pubblica gratis la tua offerta di lavoro per elettricisti, idraulici, muratori e altri professionisti edili. Raggiungi migliaia di candidati qualificati in tutta Italia.',
  alternates: { canonical: `${SITE_URL}/pubblica-offerta` },
  robots: { index: false, follow: false },
}

const BENEFITS = [
  {
    icon: Users,
    title: 'Candidati qualificati',
    desc: 'Raggiungi professionisti con esperienza nel settore edile, già iscritti alla piattaforma.',
  },
  {
    icon: Target,
    title: 'Targetizzazione geografica',
    desc: 'Il tuo annuncio è visibile solo ai candidati nella zona che hai indicato.',
  },
  {
    icon: Zap,
    title: 'Online in 24 ore',
    desc: 'Dopo una breve revisione, il tuo annuncio è pubblicato sulla bacheca.',
  },
  {
    icon: Clock,
    title: 'Gestisci in autonomia',
    desc: 'Puoi modificare, mettere in pausa o chiudere l\'annuncio in qualsiasi momento.',
  },
]

const PRICING = [
  {
    name: 'Gratuito',
    price: '0€',
    desc: 'Per iniziare',
    features: ['Fino a 3 annunci attivi', 'Visibilità standard', 'Contatti diretti dai candidati', 'Durata 30 giorni per annuncio'],
    cta: 'Pubblica gratis',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '29€',
    desc: 'Per annuncio',
    features: ['Annunci illimitati', 'In evidenza nei risultati', 'Badge "Azienda Verificata"', 'Durata 60 giorni', 'Notifica ai candidati pertinenti'],
    cta: 'Scegli Premium',
    highlight: true,
  },
]

export default function PubblicaOffertaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-slate-900 text-white text-center py-2.5 text-sm font-medium">
        ✓ Gratuito per i primi 3 annunci &nbsp;·&nbsp; ✓ Online in 24 ore &nbsp;·&nbsp; ✓ Candidati verificati
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── FORM (3/5) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  Pubblica un&apos;offerta di lavoro
                </h1>
                <p className="text-slate-500 text-sm">
                  Ci vogliono 3 minuti. L&apos;annuncio sarà visibile sulla bacheca entro 24 ore.
                </p>
              </div>
              <JobPostForm />
            </div>
          </div>

          {/* ── SIDEBAR (2/5) ── */}
          <aside className="lg:col-span-2 space-y-5">
            {/* Benefici */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Perché pubblicare su Maestranze</h2>
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

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 mb-4">Piani disponibili</h2>
              <div className="space-y-3">
                {PRICING.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-4 ${
                      plan.highlight
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <span className={`font-bold text-sm ${plan.highlight ? 'text-orange-700' : 'text-slate-800'}`}>
                        {plan.name}
                      </span>
                      <div className="text-right">
                        <span className={`text-xl font-extrabold ${plan.highlight ? 'text-orange-600' : 'text-slate-900'}`}>
                          {plan.price}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">{plan.desc}</span>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${plan.highlight ? 'text-orange-500' : 'text-green-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Il piano Premium è selezionabile dopo la registrazione
              </p>
            </div>

            {/* Stats */}
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <h3 className="font-bold mb-3 text-sm">La bacheca in numeri</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '4.200+', label: 'Professionisti iscritti' },
                  { value: '107', label: 'Province coperte' },
                  { value: '72h', label: 'Tempo medio primo contatto' },
                  { value: '89%', label: 'Annunci con risposta' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center bg-white/5 rounded-lg p-3">
                    <p className="text-lg font-extrabold text-orange-400">{value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{label}</p>
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
