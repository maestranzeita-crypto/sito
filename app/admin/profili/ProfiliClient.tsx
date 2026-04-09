'use client'

import { useState, useMemo, useTransition } from 'react'
import type { Professional } from '@/lib/database.types'
import { suspendProfessional, reactivateProfessional, resendPasswordEmail } from '../actions'

type SortKey = 'newest' | 'oldest' | 'rating' | 'reputation' | 'reviews'
type StatusFilter = 'active' | 'suspended' | 'rejected' | 'all'

const STATUS_LABELS: Record<string, string> = {
  active: 'Attivo',
  suspended: 'Sospeso',
  rejected: 'Rifiutato',
}

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  suspended: 'bg-gray-100 text-gray-600',
  rejected:  'bg-red-100 text-red-600',
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest',     label: 'Più recenti' },
  { value: 'oldest',     label: 'Più antichi' },
  { value: 'rating',     label: 'Più votati' },
  { value: 'reputation', label: 'Reputazione' },
  { value: 'reviews',    label: 'Più recensioni' },
]

export default function ProfiliClient({ professionals }: { professionals: Professional[] }) {
  const [query, setQuery]         = useState('')
  const [status, setStatus]       = useState<StatusFilter>('active')
  const [city, setCity]           = useState('')
  const [category, setCategory]   = useState('')
  const [sort, setSort]           = useState<SortKey>('newest')
  const [, startTransition]       = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  /* Opzioni dropdown dinamiche dai dati */
  const cities = useMemo(() => {
    const set = new Set(professionals.map(p => p.citta).filter(Boolean))
    return Array.from(set).sort()
  }, [professionals])

  const categories = useMemo(() => {
    const set = new Set(professionals.flatMap(p => p.categorie))
    return Array.from(set).sort()
  }, [professionals])

  /* Filtro + ordinamento */
  const filtered = useMemo(() => {
    let list = [...professionals]

    if (status !== 'all') list = list.filter(p => p.status === status)
    if (city)             list = list.filter(p => p.citta === city)
    if (category)         list = list.filter(p => p.categorie.includes(category))

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.ragione_sociale.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.citta.toLowerCase().includes(q) ||
        p.piva.includes(q)
      )
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'oldest':     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'rating':     return (b.rating_avg ?? 0) - (a.rating_avg ?? 0)
        case 'reputation': return b.reputation_points - a.reputation_points
        case 'reviews':    return b.review_count - a.review_count
        default:           return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return list
  }, [professionals, status, city, category, query, sort])

  function handleAction(id: string, action: () => Promise<void>) {
    setLoadingId(id)
    startTransition(async () => {
      await action()
      setLoadingId(null)
    })
  }

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">

        {/* Ricerca */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cerca per nome, email, città, P.IVA…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Filtri */}
        <div className="flex flex-wrap gap-2">

          {/* Status */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {(['all', 'active', 'suspended', 'rejected'] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  status === s
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'Tutti' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Città */}
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Tutte le città</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Categoria */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="">Tutte le categorie</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Ordinamento */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Reset */}
          {(query || city || category || status !== 'active' || sort !== 'newest') && (
            <button
              onClick={() => { setQuery(''); setCity(''); setCategory(''); setStatus('active'); setSort('newest') }}
              className="text-sm text-gray-400 hover:text-gray-600 px-2 underline"
            >
              Reimposta
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">{filtered.length} risultati</p>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-xl p-8 text-center">
          Nessun profilo trovato.
        </p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Profilo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contatti</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Città</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Servizi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Iscritto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stato</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(pro => (
                <ProRow
                  key={pro.id}
                  pro={pro}
                  loading={loadingId === pro.id}
                  onSuspend={() => handleAction(pro.id, () => suspendProfessional(pro.id))}
                  onReactivate={() => handleAction(pro.id, () => reactivateProfessional(pro.id))}
                  onResend={() => handleAction(pro.id, () => resendPasswordEmail(pro.email, pro.ragione_sociale))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProRow({
  pro,
  loading,
  onSuspend,
  onReactivate,
  onResend,
}: {
  pro: Professional
  loading: boolean
  onSuspend: () => void
  onReactivate: () => void
  onResend: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr className="hover:bg-gray-50">
        {/* Profilo */}
        <td className="px-4 py-3">
          <div className="font-semibold text-gray-900 whitespace-nowrap">{pro.ragione_sociale}</div>
          <div className="text-xs text-gray-400">{pro.forma_giuridica} · P.IVA {pro.piva}</div>
          {pro.plan_type && pro.plan_type !== 'free' && (
            <span className="inline-block mt-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase">
              {pro.plan_type}
            </span>
          )}
        </td>

        {/* Contatti */}
        <td className="px-4 py-3">
          <a href={`mailto:${pro.email}`} className="text-blue-600 hover:underline text-xs block">{pro.email}</a>
          <a href={`tel:${pro.telefono}`} className="text-blue-600 hover:underline text-xs block">{pro.telefono}</a>
        </td>

        {/* Città */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-gray-700">{pro.citta}</div>
          <div className="text-xs text-gray-400">Raggio {pro.raggio_km} km</div>
        </td>

        {/* Servizi */}
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {pro.categorie.slice(0, 2).map(c => (
              <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{c}</span>
            ))}
            {pro.categorie.length > 2 && (
              <span className="text-[10px] text-gray-400">+{pro.categorie.length - 2}</span>
            )}
          </div>
        </td>

        {/* Rating */}
        <td className="px-4 py-3 whitespace-nowrap">
          {pro.rating_avg != null ? (
            <div>
              <span className="font-semibold text-gray-900">{pro.rating_avg.toFixed(1)}</span>
              <span className="text-yellow-400 ml-0.5">★</span>
              <div className="text-xs text-gray-400">{pro.review_count} rec.</div>
            </div>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </td>

        {/* Iscritto */}
        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
          {new Date(pro.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
          {pro.anni_esperienza && (
            <div className="text-gray-400">{pro.anni_esperienza} anni esp.</div>
          )}
        </td>

        {/* Stato */}
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[pro.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {STATUS_LABELS[pro.status] ?? pro.status}
          </span>
          {pro.is_top_rated && (
            <div className="text-[10px] text-orange-500 font-semibold mt-0.5">Top Rated</div>
          )}
        </td>

        {/* Azioni */}
        <td className="px-4 py-3 whitespace-nowrap text-right">
          <div className="flex items-center gap-1 justify-end">
            <a
              href={`/professionisti/${pro.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg"
              title="Vedi profilo pubblico"
            >
              ↗
            </a>
            <button
              onClick={() => setOpen(v => !v)}
              disabled={loading}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg"
              title="Altre azioni"
            >
              {loading ? '…' : '⋯'}
            </button>
          </div>

          {/* Dropdown azioni */}
          {open && !loading && (
            <div className="absolute right-4 mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px] text-left">
              <button
                onClick={() => { onResend(); setOpen(false) }}
                className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 text-left"
              >
                Reinvia email password
              </button>
              {pro.status === 'active' && (
                <button
                  onClick={() => { onSuspend(); setOpen(false) }}
                  className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                >
                  Sospendi profilo
                </button>
              )}
              {(pro.status === 'suspended' || pro.status === 'rejected') && (
                <button
                  onClick={() => { onReactivate(); setOpen(false) }}
                  className="w-full px-4 py-2 text-xs text-green-600 hover:bg-green-50 text-left"
                >
                  Riattiva profilo
                </button>
              )}
            </div>
          )}
        </td>
      </tr>
    </>
  )
}
