'use client'

import { useState, useMemo, useTransition } from 'react'
import type { LeadRequest, Professional } from '@/lib/database.types'
import { assignLeadManually, updateLeadStatus } from '../actions'

type Pro = Pick<Professional, 'id' | 'ragione_sociale' | 'citta' | 'categorie' | 'status' | 'email' | 'telefono' | 'telegram_username'>
type SortKey = 'newest' | 'oldest'
type StatusFilter = 'all' | 'pending' | 'contacted' | 'closed'
type AssignedFilter = 'all' | 'assigned' | 'unassigned'

const STATUS_LABELS: Record<string, string> = {
  pending:   'Non assegnato',
  contacted: 'In lavorazione',
  closed:    'Chiuso',
}
const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed:    'bg-green-100 text-green-700',
}
const URGENZA_LABELS: Record<string, string> = {
  urgente:  '🔴 Urgente',
  settimana: '🟡 Entro settimana',
  mese:     '🟢 Entro mese',
  nessuna:  '⚪ Nessuna',
}
const SOURCE_LABELS: Record<string, string> = {
  quote_form:  'Form preventivo',
  contact_pro: 'Contatto diretto',
  calculator:  'Calcolatore',
}

function fmt(iso: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('it-IT', opts ?? { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function LeadClient({ leads, professionals }: { leads: LeadRequest[]; professionals: Pro[] }) {
  const [query, setQuery]             = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [assignedFilter, setAssignedFilter] = useState<AssignedFilter>('all')
  const [category, setCategory]       = useState('')
  const [sort, setSort]               = useState<SortKey>('newest')
  const [expandedId, setExpandedId]   = useState<string | null>(null)
  const [assignModal, setAssignModal] = useState<LeadRequest | null>(null)

  const proMap = useMemo(() => Object.fromEntries(professionals.map(p => [p.id, p])), [professionals])

  const categories = useMemo(() => {
    const set = new Set(leads.map(l => l.categoria))
    return Array.from(set).sort()
  }, [leads])

  const filtered = useMemo(() => {
    let list = [...leads]

    if (statusFilter !== 'all')   list = list.filter(l => l.status === statusFilter)
    if (category)                 list = list.filter(l => l.categoria === category)
    if (assignedFilter === 'assigned')   list = list.filter(l => !!l.assigned_professional_id)
    if (assignedFilter === 'unassigned') list = list.filter(l => !l.assigned_professional_id)

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(l =>
        l.nome.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.citta.toLowerCase().includes(q) ||
        l.categoria.toLowerCase().includes(q) ||
        l.telefono.includes(q)
      )
    }

    list.sort((a, b) =>
      sort === 'oldest'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return list
  }, [leads, statusFilter, category, assignedFilter, query, sort])

  /* Contatori per le tab */
  const counts = useMemo(() => ({
    all:       leads.length,
    pending:   leads.filter(l => l.status === 'pending').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed:    leads.filter(l => l.status === 'closed').length,
  }), [leads])

  return (
    <>
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
              placeholder="Cerca per nome, email, città, categoria, telefono…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Filtri */}
          <div className="flex flex-wrap gap-2">

            {/* Status tabs */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
              {(['all', 'pending', 'contacted', 'closed'] as StatusFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5 ${
                    statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s === 'all' ? 'Tutti' : STATUS_LABELS[s]}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    statusFilter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {counts[s]}
                  </span>
                </button>
              ))}
            </div>

            {/* Assegnazione */}
            <select
              value={assignedFilter}
              onChange={e => setAssignedFilter(e.target.value as AssignedFilter)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              <option value="all">Tutti (assegnati e no)</option>
              <option value="unassigned">Solo non assegnati</option>
              <option value="assigned">Solo assegnati</option>
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
              <option value="newest">Più recenti</option>
              <option value="oldest">Più antichi</option>
            </select>

            {/* Reset */}
            {(query || statusFilter !== 'all' || category || assignedFilter !== 'all' || sort !== 'newest') && (
              <button
                onClick={() => { setQuery(''); setStatusFilter('all'); setCategory(''); setAssignedFilter('all'); setSort('newest') }}
                className="text-sm text-gray-400 hover:text-gray-600 px-2 underline"
              >
                Reimposta
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400">{filtered.length} risultati</p>
        </div>

        {/* Tabella */}
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-xl p-8 text-center">
            Nessun lead trovato.
          </p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Servizio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Città</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sorgente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data richiesta</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data assegnam.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assegnato a</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stato</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(lead => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    pro={lead.assigned_professional_id ? proMap[lead.assigned_professional_id] : null}
                    expanded={expandedId === lead.id}
                    onToggleExpand={() => setExpandedId(v => v === lead.id ? null : lead.id)}
                    onAssign={() => setAssignModal(lead)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal assegnazione */}
      {assignModal && (
        <AssignModal
          lead={assignModal}
          professionals={professionals}
          onClose={() => setAssignModal(null)}
        />
      )}
    </>
  )
}

/* ─── Lead Row ─── */

function LeadRow({
  lead,
  pro,
  expanded,
  onToggleExpand,
  onAssign,
}: {
  lead: LeadRequest
  pro: Pro | null | undefined
  expanded: boolean
  onToggleExpand: () => void
  onAssign: () => void
}) {
  const [, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  function changeStatus(status: 'pending' | 'contacted' | 'closed') {
    setLoading(true)
    startTransition(async () => {
      await updateLeadStatus(lead.id, status)
      setLoading(false)
    })
  }

  const source = SOURCE_LABELS[lead.request_type] ?? lead.request_type ?? '—'

  return (
    <>
      <tr className={`hover:bg-gray-50 ${expanded ? 'bg-orange-50/30' : ''}`}>
        {/* Cliente */}
        <td className="px-4 py-3">
          <div className="font-semibold text-gray-900 whitespace-nowrap">{lead.nome}</div>
          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline text-xs block">{lead.email}</a>
          <a href={`tel:${lead.telefono}`} className="text-blue-600 hover:underline text-xs block">{lead.telefono}</a>
        </td>

        {/* Servizio + urgenza */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="font-medium text-gray-800">{lead.categoria}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{URGENZA_LABELS[lead.urgenza] ?? lead.urgenza}</div>
        </td>

        {/* Città */}
        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.citta}</td>

        {/* Sorgente */}
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{source}</span>
        </td>

        {/* Data richiesta */}
        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
          {fmt(lead.created_at)}
        </td>

        {/* Data assegnamento */}
        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
          {fmt(lead.contacted_at)}
        </td>

        {/* Assegnato a */}
        <td className="px-4 py-3 whitespace-nowrap">
          {pro ? (
            <div>
              <div className="font-medium text-gray-800 text-xs">{pro.ragione_sociale}</div>
              <div className="text-[10px] text-gray-400">{pro.citta}</div>
            </div>
          ) : (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </td>

        {/* Stato — dropdown inline */}
        <td className="px-4 py-3 whitespace-nowrap">
          <select
            value={lead.status}
            onChange={e => changeStatus(e.target.value as 'pending' | 'contacted' | 'closed')}
            disabled={loading}
            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 ${STATUS_STYLES[lead.status] ?? 'bg-gray-100 text-gray-600'}`}
          >
            <option value="pending">Non assegnato</option>
            <option value="contacted">In lavorazione</option>
            <option value="closed">Chiuso</option>
          </select>
        </td>

        {/* Azioni */}
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={onToggleExpand}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg"
              title="Dettagli"
            >
              {expanded ? '▲' : '▼'}
            </button>
            {!lead.assigned_professional_id && (
              <button
                onClick={onAssign}
                className="px-2 py-1 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg"
              >
                Assegna
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Riga espansa con dettagli */}
      {expanded && (
        <tr className="bg-orange-50/20">
          <td colSpan={9} className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

              {/* Descrizione */}
              {lead.descrizione && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Descrizione</div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{lead.descrizione}</p>
                </div>
              )}

              {/* Job details */}
              {lead.job_details && Object.keys(lead.job_details).length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Dettagli lavoro</div>
                  <dl className="space-y-0.5">
                    {Object.entries(lead.job_details).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="text-gray-400 capitalize shrink-0">{k}:</dt>
                        <dd className="text-gray-700 font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Note admin */}
              {lead.notes && (
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Note</div>
                  <p className="text-gray-700 text-sm">{lead.notes}</p>
                </div>
              )}

              {/* Meta */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Info</div>
                <dl className="space-y-0.5 text-xs">
                  <div className="flex gap-2">
                    <dt className="text-gray-400">ID:</dt>
                    <dd className="font-mono text-gray-600">{lead.id}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-400">Sbloccato:</dt>
                    <dd className="text-gray-700">{lead.unlocked ? 'Sì' : 'No'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/* ─── Assign Modal ─── */

function AssignModal({
  lead,
  professionals,
  onClose,
}: {
  lead: LeadRequest
  professionals: Pro[]
  onClose: () => void
}) {
  const [selectedProId, setSelectedProId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const compatible = professionals.filter(p =>
    p.categorie.some(c => c.toLowerCase() === lead.categoria.toLowerCase())
  )

  function handleAssign() {
    if (!selectedProId) return
    setError(null)
    startTransition(async () => {
      try {
        await assignLeadManually(lead.id, selectedProId)
        onClose()
      } catch {
        setError("Errore durante l'assegnazione. Riprova.")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Assegna lead</h3>
        <p className="text-sm text-gray-500 mb-5">
          <strong>{lead.nome}</strong> &middot; {lead.categoria} &middot; {lead.citta}
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Professionista {compatible.length > 0 ? `(${compatible.length} compatibili)` : ''}
        </label>

        {compatible.length === 0 ? (
          <p className="text-sm text-red-500 mb-4">
            Nessun professionista attivo per &ldquo;{lead.categoria}&rdquo;.
          </p>
        ) : (
          <select
            value={selectedProId}
            onChange={e => setSelectedProId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">— Seleziona professionista —</option>
            {compatible.map(p => (
              <option key={p.id} value={p.id}>
                {p.ragione_sociale} · {p.citta}
              </option>
            ))}
          </select>
        )}

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            onClick={handleAssign}
            disabled={isPending || !selectedProId}
            className="px-4 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
          >
            {isPending ? 'Assegnando…' : 'Conferma'}
          </button>
        </div>
      </div>
    </div>
  )
}
