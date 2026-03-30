import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Briefcase, Users, TrendingUp } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import JobBoard from './JobBoard'

export const revalidate = 300 // aggiorna ogni 5 minuti

export const metadata: Metadata = {
  title: 'Offerte di Lavoro Edilizia — Trova Lavoro come Elettricista, Idraulico, Muratore | Maestranze',
  description:
    'Sfoglia le offerte di lavoro nel settore edile: elettricisti, idraulici, muratori, installatori fotovoltaico, ristrutturatori. Dipendente, subappalto o progetto.',
  alternates: { canonical: `${SITE_URL}/lavoro` },
  keywords: [
    'offerte lavoro edilizia',
    'lavoro elettricista',
    'lavoro idraulico',
    'lavoro muratore',
    'installatore fotovoltaico lavoro',
    'cantiere dipendente',
  ],
}

export default async function LavoroPage() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('job_listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-5">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Bacheca Lavoro Edilizia
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
              Trova lavoro nel
              <span className="text-orange-400"> settore edile</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Elettricisti, idraulici, muratori, installatori fotovoltaico e operai specializzati.
              Offerte di lavoro da imprese verificate in tutta Italia.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Briefcase, value: '120+', label: 'Offerte attive' },
                { icon: Users, value: '800+', label: 'Imprese che assumono' },
                { icon: TrendingUp, value: '107', label: 'Province coperte' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-orange-400" />
                  <span>
                    <span className="font-extrabold text-white text-lg">{value}</span>{' '}
                    <span className="text-slate-400 text-sm">{label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIE RAPIDE ──────────────────────────────────── */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">Cerca per:</span>
            {[
              { label: 'Elettricista', href: '/lavoro?categoria=elettricista' },
              { label: 'Idraulico', href: '/lavoro?categoria=idraulico' },
              { label: 'Fotovoltaico', href: '/lavoro?categoria=fotovoltaico' },
              { label: 'Muratore', href: '/lavoro?categoria=muratore' },
              { label: 'Ristrutturazione', href: '/lavoro?categoria=ristrutturazione' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap text-xs font-medium px-3.5 py-2 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 rounded-full transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/pubblica-offerta"
              className="whitespace-nowrap ml-auto text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 flex-shrink-0"
            >
              + Pubblica offerta <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── JOB BOARD ─────────────────────────────────────────── */}
      <JobBoard initialJobs={jobs ?? []} />

      {/* ── CTA MOBILE pubblica offerta ───────────────────────── */}
      <section className="lg:hidden bg-slate-900 text-white py-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-extrabold text-xl mb-3">Cerchi personale qualificato?</h2>
          <p className="text-slate-400 text-sm mb-5">
            Pubblica un annuncio e raggiungi migliaia di professionisti del settore.
          </p>
          <Link
            href="/pubblica-offerta"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Pubblica un&apos;Offerta Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
