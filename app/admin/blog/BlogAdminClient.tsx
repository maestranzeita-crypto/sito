'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2, Plus, X } from 'lucide-react'
import type { SimilarityAlert } from '@/lib/blog-similarity'

interface PublishedPost {
  slug: string
  title: string
  category: string
  tags: string[]
  published_at: string
}

interface PlannedTopic {
  id: string
  title: string
  category: string
  keywords: string[]
  notes: string | null
  status: string
  created_at: string
}

interface Props {
  published: PublishedPost[]
  planned: PlannedTopic[]
  alerts: SimilarityAlert[]
  tableExists: boolean
}

const CATEGORIES = [
  'fotovoltaico', 'elettricista', 'idraulico',
  'ristrutturazione', 'muratore', 'generale',
]

export default function BlogAdminClient({ published, planned: initialPlanned, alerts, tableExists }: Props) {
  const [planned, setPlanned] = useState(initialPlanned)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    category: 'generale',
    keywords: '',
    notes: '',
  })

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/blog/planned-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
          notes: form.notes || null,
        }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error)
      setPlanned((prev) => [data.topic, ...prev])
      setForm({ title: '', category: 'generale', keywords: '', notes: '' })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore salvataggio')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Eliminare questo argomento pianificato?')) return
    try {
      await fetch('/api/blog/planned-topics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setPlanned((prev) => prev.filter((t) => t.id !== id))
    } catch { /* silent */ }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      <div>
        <h1 className="text-xl font-bold text-gray-900">Blog</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gestione articoli e pianificazione argomenti</p>
      </div>

      {/* Alert similarità */}
      {alerts.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-widest">
              Argomenti troppo simili ({alerts.length})
            </h2>
          </div>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-amber-800 font-medium">"{a.titleA}"</p>
                    <p className="text-amber-600 mt-0.5">simile a: "{a.titleB}"</p>
                  </div>
                  <span className="shrink-0 bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {Math.round(a.score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Argomenti pianificati */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Pianificati
            </h2>
            {!tableExists && (
              <p className="text-xs text-amber-600 mt-1">
                Tabella <code className="bg-amber-50 px-1 rounded">blog_planned_topics</code> non trovata su Supabase.
                Crea la tabella per abilitare questa funzione.
              </p>
            )}
          </div>
          {tableExists && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annulla' : 'Aggiungi'}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-5 mb-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Titolo *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Es: Come scegliere le finestre per una ristrutturazione"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Keywords (separate da virgola)</label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                  placeholder="finestre, ristrutturazione, costi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Note (opzionale)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Referenza, priorità, note interne…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? 'Salvataggio…' : 'Salva argomento'}
            </button>
          </form>
        )}

        {planned.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-6 text-center">
            {tableExists ? 'Nessun argomento pianificato.' : 'Crea la tabella Supabase per iniziare.'}
          </p>
        ) : (
          <div className="space-y-2">
            {planned.map((t) => (
              <div key={t.id} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t.category}</span>
                    {t.keywords?.slice(0, 3).map((k: string) => (
                      <span key={k} className="text-xs text-gray-400">{k}</span>
                    ))}
                    {t.notes && <span className="text-xs text-gray-400 italic">· {t.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={t.status} />
                  {t.status === 'planned' && (
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Articoli pubblicati */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Pubblicati ({published.length})
        </h2>
        {published.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-6 text-center">
            Nessun articolo pubblicato.
          </p>
        ) : (
          <div className="space-y-1">
            {published.map((p) => (
              <div key={p.slug} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.category}</span>
                    {p.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(p.published_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 hover:underline"
                  >
                    Leggi →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    planned:     { label: 'Pianificato',   cls: 'bg-blue-50 text-blue-600' },
    in_progress: { label: 'In corso',      cls: 'bg-yellow-50 text-yellow-600' },
    published:   { label: 'Pubblicato',    cls: 'bg-green-50 text-green-600' },
    skipped:     { label: 'Saltato',       cls: 'bg-gray-100 text-gray-500' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}
