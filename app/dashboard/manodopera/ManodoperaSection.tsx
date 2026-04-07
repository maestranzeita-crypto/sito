'use client'

import { useState, useTransition } from 'react'
import { HardHat, Wrench, Plus, Phone, Mail, Trash2, Loader2, CheckCircle2, MapPin, Calendar, Banknote, AlertCircle } from 'lucide-react'
import type { Professional, ManodoperaRequest, ManodoperaAvailability } from '@/lib/database.types'
import {
  publishManodoperaRequest,
  publishManodoperaAvailability,
  deleteManodoperaRequest,
  deleteManodoperaAvailability,
} from '@/app/dashboard/actions'

const SPECIALIZZAZIONI = ['Elettricista', 'Idraulico', 'Muratore', 'Cartongessista', 'Piastrellista', 'Imbianchino', 'Installatore FV', 'Altro']
const COMPENSI = ['€100-150/giorno', '€150-200/giorno', '€200-250/giorno', 'Oltre €250/giorno', 'Da concordare']
const TARIFFE = ['€100-150/giorno', '€150-200/giorno', '€200-250/giorno', 'Oltre €250', 'Non specificata']
const TIPI_INGAGGIO = ['Giornata', 'Settimana', 'Progetto', 'Valuto assunzione']
const TIPI_COLLAB = ['Giornata', 'Settimana', 'Progetto']
const REQUISITI = ['DURC', 'Patentino', 'Attrezzatura propria', 'Certificazione sicurezza']

const field = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
const label = 'block text-sm font-medium text-slate-700 mb-1.5'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
}

function TagBadge({ children }: { children: React.ReactNode }) {
  return <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{children}</span>
}

// ── Card artigiano disponibile ────────────────────────────────────────────────
function ArtigianoCard({ a }: { a: ManodoperaAvailability }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-slate-900 text-sm">{a.nome}</span>
            <TagBadge>{a.specializzazione}</TagBadge>
            {a.durc_valido && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">DURC ✓</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <MapPin className="w-3 h-3" />{a.zona_operativa}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.disponibile_da)} → {formatDate(a.disponibile_a)}</span>
            <span className="flex items-center gap-1"><Banknote className="w-3 h-3" />{a.tariffa}</span>
          </div>
          {a.tipo_collaborazione?.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {a.tipo_collaborazione.map((t) => <TagBadge key={t}>{t}</TagBadge>)}
              {a.attrezzatura_propria && <TagBadge>Attrezzatura propria</TagBadge>}
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex-shrink-0 text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-3 py-2 rounded-xl hover:bg-orange-100 transition-colors"
        >
          {open ? 'Chiudi' : 'Contatta'}
        </button>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <a href={`tel:${a.telefono}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Phone className="w-4 h-4 text-orange-500" />{a.telefono}
          </a>
          <a href={`mailto:${a.email}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Mail className="w-4 h-4 text-orange-500" />{a.email}
          </a>
        </div>
      )}
    </div>
  )
}

// ── Card richiesta aperta ─────────────────────────────────────────────────────
function RichiestaCard({ r }: { r: ManodoperaRequest }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-orange-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-slate-900 text-sm">{r.nome}</span>
            <TagBadge>{r.specializzazione}</TagBadge>
            <TagBadge>{r.tipo_ingaggio}</TagBadge>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <MapPin className="w-3 h-3" />{r.zona_cantiere}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(r.periodo_da)} → {formatDate(r.periodo_a)}</span>
            <span className="flex items-center gap-1"><Banknote className="w-3 h-3" />{r.compenso}</span>
          </div>
          {r.requisiti?.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {r.requisiti.map((req) => <TagBadge key={req}>{req}</TagBadge>)}
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex-shrink-0 text-xs font-semibold bg-slate-800 text-white px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors"
        >
          {open ? 'Chiudi' : 'Candidati'}
        </button>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <a href={`tel:${r.telefono}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Phone className="w-4 h-4 text-slate-700" />{r.telefono}
          </a>
          <a href={`mailto:${r.email}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Mail className="w-4 h-4 text-slate-700" />{r.email}
          </a>
        </div>
      )}
    </div>
  )
}

// ── Form pubblica richiesta ───────────────────────────────────────────────────
function FormRichiesta({ specializzazioni, onDone }: { specializzazioni: string[]; onDone: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [requisiti, setRequisiti] = useState<string[]>([])

  function toggleReq(r: string) {
    setRequisiti((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startTransition(async () => {
      try {
        await publishManodoperaRequest({
          specializzazione: fd.get('specializzazione') as string,
          zona_cantiere: fd.get('zona_cantiere') as string,
          periodo_da: fd.get('periodo_da') as string,
          periodo_a: fd.get('periodo_a') as string,
          tipo_ingaggio: fd.get('tipo_ingaggio') as string,
          compenso: fd.get('compenso') as string,
          requisiti,
        })
        onDone()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Specializzazione *</label>
          <select name="specializzazione" required className={field} defaultValue={specializzazioni[0] ?? ''}>
            <option value="">Seleziona...</option>
            {SPECIALIZZAZIONI.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Zona cantiere *</label>
          <input name="zona_cantiere" required placeholder="es. Milano Nord..." className={field} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Da *</label>
          <input name="periodo_da" type="date" required className={field} />
        </div>
        <div>
          <label className={label}>A *</label>
          <input name="periodo_a" type="date" required className={field} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Tipo ingaggio *</label>
          <select name="tipo_ingaggio" required className={field}>
            <option value="">Seleziona...</option>
            {TIPI_INGAGGIO.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Compenso offerto *</label>
          <select name="compenso" required className={field}>
            <option value="">Seleziona...</option>
            {COMPENSI.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Requisiti richiesti</label>
        <div className="flex flex-wrap gap-3">
          {REQUISITI.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={requisiti.includes(r)} onChange={() => toggleReq(r)} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-slate-700">{r}</span>
            </label>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
      <button type="submit" disabled={pending} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Pubblica richiesta
      </button>
    </form>
  )
}

// ── Form disponibilità artigiano ──────────────────────────────────────────────
function FormDisponibilita({ specializzazioni, onDone }: { specializzazioni: string[]; onDone: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [tipoCollab, setTipoCollab] = useState<string[]>([])
  const [attrezzatura, setAttrezzatura] = useState(false)
  const [durc, setDurc] = useState(false)

  function toggleCollab(t: string) {
    setTipoCollab((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startTransition(async () => {
      try {
        await publishManodoperaAvailability({
          specializzazione: fd.get('specializzazione') as string,
          zona_operativa: fd.get('zona_operativa') as string,
          disponibile_da: fd.get('disponibile_da') as string,
          disponibile_a: fd.get('disponibile_a') as string,
          tipo_collaborazione: tipoCollab,
          tariffa: fd.get('tariffa') as string,
          attrezzatura_propria: attrezzatura,
          durc_valido: durc,
        })
        onDone()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Specializzazione *</label>
          <select name="specializzazione" required className={field} defaultValue={specializzazioni[0] ?? ''}>
            <option value="">Seleziona...</option>
            {SPECIALIZZAZIONI.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Zona operativa *</label>
          <input name="zona_operativa" required placeholder="es. Torino e provincia..." className={field} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Disponibile da *</label>
          <input name="disponibile_da" type="date" required className={field} />
        </div>
        <div>
          <label className={label}>Disponibile fino a *</label>
          <input name="disponibile_a" type="date" required className={field} />
        </div>
      </div>
      <div>
        <label className={label}>Tariffa indicativa *</label>
        <select name="tariffa" required className={field}>
          <option value="">Seleziona...</option>
          {TARIFFE.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>Tipo collaborazione</label>
        <div className="flex flex-wrap gap-3">
          {TIPI_COLLAB.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={tipoCollab.includes(t)} onChange={() => toggleCollab(t)} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-slate-700">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={attrezzatura} onChange={(e) => setAttrezzatura(e.target.checked)} className="w-4 h-4 accent-orange-500" />
          <span className="text-sm text-slate-700">Attrezzatura propria</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={durc} onChange={(e) => setDurc(e.target.checked)} className="w-4 h-4 accent-orange-500" />
          <span className="text-sm text-slate-700">DURC in corso di validità</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}
      <button type="submit" disabled={pending} className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Segnala disponibilità
      </button>
    </form>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ManodoperaSection({
  pro,
  specializzazioni,
  artigianiDisponibili,
  richiesteAperte,
  mieRichieste,
  miaDisponibilita,
}: {
  pro: Professional
  specializzazioni: string[]
  artigianiDisponibili: ManodoperaAvailability[]
  richiesteAperte: ManodoperaRequest[]
  mieRichieste: ManodoperaRequest[]
  miaDisponibilita: ManodoperaAvailability[]
}) {
  const [tab, setTab] = useState<'artigiani' | 'lavoro'>('artigiani')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showAvailForm, setShowAvailForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Local state per aggiornamenti ottimistici
  const [localRichieste, setLocalRichieste] = useState(mieRichieste)
  const [localDisp, setLocalDisp] = useState(miaDisponibilita)

  function handleDeleteRichiesta(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteManodoperaRequest(id)
      setLocalRichieste((prev) => prev.filter((r) => r.id !== id))
      setDeletingId(null)
    })
  }

  function handleDeleteDisp(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteManodoperaAvailability(id)
      setLocalDisp((prev) => prev.filter((d) => d.id !== id))
      setDeletingId(null)
    })
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Manodopera</h1>
        <p className="text-slate-500 text-sm mt-0.5">Trova artigiani o opportunità di lavoro nella tua zona</p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-slate-100 rounded-2xl p-1 w-fit">
        <button
          onClick={() => setTab('artigiani')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'artigiani' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <HardHat className="w-4 h-4" /> Cerco artigiani
          {artigianiDisponibili.length > 0 && (
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {artigianiDisponibili.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('lavoro')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'lavoro' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Wrench className="w-4 h-4" /> Trovo lavoro
          {richiesteAperte.length > 0 && (
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {richiesteAperte.length}
            </span>
          )}
        </button>
      </div>

      {/* ── TAB: CERCO ARTIGIANI ── */}
      {tab === 'artigiani' && (
        <div className="space-y-6">
          {/* Artigiani disponibili */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">
                Artigiani disponibili
                <span className="ml-2 text-sm font-normal text-slate-400">({artigianiDisponibili.length})</span>
              </h2>
            </div>
            {artigianiDisponibili.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                Nessun artigiano disponibile nelle tue specializzazioni al momento.
              </div>
            ) : (
              <div className="space-y-3">
                {artigianiDisponibili.map((a) => <ArtigianoCard key={a.id} a={a} />)}
              </div>
            )}
          </section>

          {/* Le mie richieste */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">Le mie richieste pubblicate</h2>
              <button
                onClick={() => setShowRequestForm(!showRequestForm)}
                className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> Nuova richiesta
              </button>
            </div>

            {showRequestForm && (
              <div className="bg-white border border-orange-200 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Pubblica una richiesta</h3>
                  <button onClick={() => setShowRequestForm(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                </div>
                <FormRichiesta
                  specializzazioni={specializzazioni}
                  onDone={() => {
                    setShowRequestForm(false)
                    window.location.reload()
                  }}
                />
              </div>
            )}

            {localRichieste.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                Non hai ancora pubblicato nessuna richiesta.
              </div>
            ) : (
              <div className="space-y-3">
                {localRichieste.map((r) => (
                  <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <TagBadge>{r.specializzazione}</TagBadge>
                          <TagBadge>{r.tipo_ingaggio}</TagBadge>
                          <span className="text-xs flex items-center gap-1 text-slate-400"><Banknote className="w-3 h-3" />{r.compenso}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{r.zona_cantiere}
                          <span className="mx-1">·</span>
                          <Calendar className="w-3 h-3" />{formatDate(r.periodo_da)} → {formatDate(r.periodo_a)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteRichiesta(r.id)}
                        disabled={pending && deletingId === r.id}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {deletingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── TAB: TROVO LAVORO ── */}
      {tab === 'lavoro' && (
        <div className="space-y-6">
          {/* Richieste aperte */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">
                Richieste aperte
                <span className="ml-2 text-sm font-normal text-slate-400">({richiesteAperte.length})</span>
              </h2>
            </div>
            {richiesteAperte.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                Nessuna richiesta aperta per le tue specializzazioni al momento.
              </div>
            ) : (
              <div className="space-y-3">
                {richiesteAperte.map((r) => <RichiestaCard key={r.id} r={r} />)}
              </div>
            )}
          </section>

          {/* La mia disponibilità */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800">La mia disponibilità</h2>
              <button
                onClick={() => setShowAvailForm(!showAvailForm)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4" /> Aggiungi disponibilità
              </button>
            </div>

            {showAvailForm && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Segnala la tua disponibilità</h3>
                  <button onClick={() => setShowAvailForm(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                </div>
                <FormDisponibilita
                  specializzazioni={specializzazioni}
                  onDone={() => {
                    setShowAvailForm(false)
                    window.location.reload()
                  }}
                />
              </div>
            )}

            {localDisp.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                Non hai segnalato nessuna disponibilità attiva.
              </div>
            ) : (
              <div className="space-y-3">
                {localDisp.map((d) => (
                  <div key={d.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Attiva
                          </span>
                          <TagBadge>{d.specializzazione}</TagBadge>
                          <TagBadge>{d.tariffa}</TagBadge>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{d.zona_operativa}
                          <span className="mx-1">·</span>
                          <Calendar className="w-3 h-3" />{formatDate(d.disponibile_da)} → {formatDate(d.disponibile_a)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDisp(d.id)}
                        disabled={pending && deletingId === d.id}
                        className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {deletingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
