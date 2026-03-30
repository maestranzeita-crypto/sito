'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Briefcase, ChevronDown, Search, ArrowRight, Building2 } from 'lucide-react'
import { CATEGORIES, CITIES } from '@/lib/categories'
import type { JobListing } from '@/lib/database.types'

const TIPO_OPTIONS = ['Tutti', 'Dipendente', 'Subappalto', 'Progetto'] as const

const TIPO_COLORS: Record<string, string> = {
  Dipendente: 'bg-blue-100 text-blue-700',
  Subappalto: 'bg-purple-100 text-purple-700',
  Progetto: 'bg-green-100 text-green-700',
}

function daysLabel(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime()
  const n = Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)))
  if (n === 1) return 'Oggi'
  return `${n} giorni fa`
}

function getCityDisplay(citta: string): { name: string; province: string } {
  const city = CITIES.find((c) => c.slug === citta)
  return city ? { name: city.name, province: city.province } : { name: citta, province: '' }
}

export default function JobBoard({ initialJobs }: { initialJobs: JobListing[] }) {
  const [searchText, setSearchText] = useState('')
  const [filterCat, setFilterCat] = useState('tutte')
  const [filterTipo, setFilterTipo] = useState<string>('Tutti')

  const filtered = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchCat = filterCat === 'tutte' || job.categoria === filterCat
      const matchTipo = filterTipo === 'Tutti' || job.tipo_contratto === filterTipo
      const { name: cityName } = getCityDisplay(job.citta)
      const matchSearch =
        searchText === '' ||
        job.titolo.toLowerCase().includes(searchText.toLowerCase()) ||
        cityName.toLowerCase().includes(searchText.toLowerCase()) ||
        job.ragione_sociale.toLowerCase().includes(searchText.toLowerCase())
      return matchCat && matchTipo && matchSearch
    })
  }, [searchText, filterCat, filterTipo, initialJobs])

  return (
    <div>
      {/* ── FILTRI ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca per ruolo, azienda o città..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div className="relative">
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="tutte">Tutte le categorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.nameShort}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Tipo contratto */}
            <div className="relative">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white cursor-pointer"
              >
                {TIPO_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t === 'Tutti' ? 'Tipo contratto' : t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── LISTA OFFERTE ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Colonna offerte (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-900">{filtered.length}</strong> offerte trovate
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nessuna offerta trovata</p>
                <p className="text-sm mt-1">
                  {initialJobs.length === 0
                    ? 'Nessuna offerta attiva al momento. Torna presto!'
                    : 'Prova a modificare i filtri'}
                </p>
              </div>
            ) : (
              filtered.map((job) => {
                const cat = CATEGORIES.find((c) => c.slug === job.categoria)
                const { name: cityName, province } = getCityDisplay(job.citta)
                return (
                  <article
                    key={job.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                          {job.titolo}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{job.ragione_sociale}</span>
                        </div>
                      </div>
                      {cat && <cat.icon className="w-7 h-7 flex-shrink-0 text-slate-400" />}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TIPO_COLORS[job.tipo_contratto]}`}>
                        {job.tipo_contratto}
                      </span>
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {cat?.nameShort ?? job.categoria}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {cityName}{province ? ` (${province})` : ''}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {daysLabel(job.created_at)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {job.descrizione}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      {job.retribuzione ? (
                        <span className="text-sm font-semibold text-slate-900">{job.retribuzione}</span>
                      ) : (
                        <span />
                      )}
                      <Link
                        href={`/lavoro/${job.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Candidati <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                )
              })
            )}
          </div>

          {/* Sidebar (1/3) */}
          <aside className="hidden lg:block space-y-5 sticky top-32">
            {/* CTA pubblica offerta */}
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-2">Cerchi personale?</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Pubblica un&apos;offerta di lavoro e raggiungi migliaia di professionisti qualificati
                nel settore edile.
              </p>
              <Link
                href="/pubblica-offerta"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors w-full"
              >
                Pubblica un&apos;Offerta <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-slate-500 text-center mt-2">Gratuito per i primi 3 annunci</p>
            </div>

            {/* Alert nuove offerte */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Ricevi nuove offerte via email</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Inserisci la tua email e ti avvisiamo quando escono annunci per la tua specializzazione.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="La tua email..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
                  Attiva Avvisi
                </button>
              </div>
            </div>

            {/* Registrati come pro */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Sei un professionista?</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Crea il tuo profilo e ricevi anche richieste dirette dai clienti.
              </p>
              <Link
                href="/registrati"
                className="flex items-center justify-center gap-2 border border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all w-full"
              >
                Crea profilo gratis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
