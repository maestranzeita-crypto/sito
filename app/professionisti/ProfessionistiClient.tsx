'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Shield, Search } from 'lucide-react'
import type { Professional } from '@/lib/database.types'
import type { Category } from '@/lib/categories'

type ProWithCats = Professional & { categoryLabels: string[] }

interface Props {
  professionals: ProWithCats[]
  categories: Category[]
  cities: string[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
    </div>
  )
}

export default function ProfessionistiClient({ professionals, categories, cities }: Props) {
  const [servizio, setServizio] = useState('')
  const [citta, setCitta] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return professionals.filter((pro) => {
      if (servizio && !pro.categorie.includes(servizio)) return false
      if (citta && pro.citta !== citta) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !pro.ragione_sociale.toLowerCase().includes(q) &&
          !pro.citta.toLowerCase().includes(q) &&
          !pro.categoryLabels.some((l) => l.toLowerCase().includes(q))
        ) return false
      }
      return true
    })
  }, [professionals, servizio, citta, search])

  return (
    <>
      {/* Filtri */}
      <div className="bg-white border-b border-slate-200 py-5 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca per nome o servizio…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50"
              />
            </div>
            <select
              value={servizio}
              onChange={(e) => setServizio(e.target.value)}
              className="sm:w-52 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 text-slate-700"
            >
              <option value="">Tutti i servizi</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.nameShort}</option>
              ))}
            </select>
            <select
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              className="sm:w-52 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-50 text-slate-700"
            >
              <option value="">Tutte le città</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Griglia */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-slate-500 mb-6">
          {filtered.length} professionista{filtered.length !== 1 ? 'i' : ''} trovato{filtered.length !== 1 ? 'i' : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">Nessun professionista trovato</p>
            <p className="text-sm mt-1">Prova a modificare i filtri di ricerca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((pro) => {
              const cityLabel = pro.citta.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              return (
                <Link
                  key={pro.id}
                  href={`/professionisti/${pro.id}`}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Foto profilo */}
                  <div className="relative h-36 bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0">
                    {pro.foto_url ? (
                      <Image
                        src={pro.foto_url}
                        alt={pro.ragione_sociale}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-white/80">
                        {pro.ragione_sociale.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {pro.is_top_rated && (
                      <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 bg-orange-500 text-white rounded-full shadow">
                        Top Rated
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                        {pro.ragione_sociale}
                      </h2>
                      {pro.verified_at && (
                        <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" title="Verificato Maestranze" />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mb-2 line-clamp-1">
                      {pro.categoryLabels.join(' · ')}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                      {cityLabel}
                    </div>

                    <div className="mt-auto flex items-center gap-2">
                      {pro.rating_avg !== null ? (
                        <>
                          <StarRating rating={pro.rating_avg} />
                          <span className="text-xs font-semibold text-slate-700">{pro.rating_avg.toFixed(1)}</span>
                          <span className="text-xs text-slate-400">({pro.review_count})</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Nessuna recensione</span>
                      )}
                    </div>

                    {pro.verified_at && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full w-fit">
                        <Shield className="w-3 h-3" />
                        Verificato Maestranze
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
