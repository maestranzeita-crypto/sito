'use client'

import { useState, useTransition } from 'react'
import {
  MessageSquare, Clock, CheckCircle2, X, Loader2,
  MapPin, Calendar, Inbox, ArrowLeftRight, Star,
} from 'lucide-react'
import { respondToLead, fetchColleagues, transferLead } from './actions'
import type { ColleagueInfo } from './actions'
import type { LeadRequest } from '@/lib/database.types'
import { getCategoryBySlug } from '@/lib/categories'

type DisplayStatus = 'nuovo' | 'risposto' | 'confermato' | 'scaduto'

function getDisplayStatus(lead: LeadRequest): DisplayStatus {
  if (lead.status === 'closed') return 'confermato'
  if (lead.status === 'contacted') return 'risposto'
  const ageMs = Date.now() - new Date(lead.created_at).getTime()
  return ageMs > 48 * 60 * 60 * 1000 ? 'scaduto' : 'nuovo'
}

const STATUS_CONFIG: Record<DisplayStatus, { label: string; badge: string }> = {
  nuovo:      { label: 'Nuovo',      badge: 'bg-orange-100 text-orange-700' },
  risposto:   { label: 'Risposto',   badge: 'bg-blue-100 text-blue-700'     },
  confermato: { label: 'Confermato', badge: 'bg-green-100 text-green-700'   },
  scaduto:    { label: 'Scaduto',    badge: 'bg-slate-100 text-slate-400'   },
}

const URGENZA_LABEL: Record<string, string> = {
  urgente:  'Urgente',
  settimana:'Entro la settimana',
  mese:     'Entro il mese',
  nessuna:  'Senza fretta',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function LeadsSection({ leads }: { leads: LeadRequest[] }) {
  const [modalLead, setModalLead] = useState<LeadRequest | null>(null)
  const [response, setResponse] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [cediLead, setCediLead] = useState<LeadRequest | null>(null)
  const [colleagues, setColleagues] = useState<ColleagueInfo[]>([])
  const [loadingColleagues, setLoadingColleagues] = useState(false)
  const [selectedColleague, setSelectedColleague] = useState<string | null>(null)
  const [isCediPending, startCediTransition] = useTransition()
  const [cediError, setCediError] = useState('')
  const [cediSuccess, setCediSuccess] = useState(false)

  function openModal(lead: LeadRequest) { setModalLead(lead); setResponse(''); setError('') }
  function closeModal() { if (isPending) return; setModalLead(null) }

  function handleSubmit() {
    if (!modalLead || !response.trim()) { setError('Scrivi il tuo preventivo prima di inviare.'); return }
    setError('')
    startTransition(async () => {
      try { await respondToLead(modalLead.id, response); setModalLead(null) }
      catch { setError("Errore durante l'invio. Riprova.") }
    })
  }

  async function openCediModal(lead: LeadRequest) {
    setCediLead(lead); setSelectedColleague(null); setCediError(''); setCediSuccess(false); setLoadingColleagues(true)
    try { setColleagues(await fetchColleagues(lead.categoria, lead.citta)) }
    catch { setCediError('Errore nel caricamento dei colleghi.') }
    finally { setLoadingColleagues(false) }
  }

  function closeCediModal() { if (isCediPending) return; setCediLead(null) }

  function handleTransfer() {
    if (!cediLead || !selectedColleague) { setCediError('Seleziona un collega prima di cedere.'); return }
    setCediError('')
    startCediTransition(async () => {
      try { await transferLead(cediLead.id, selectedColleague); setCediSuccess(true); setTimeout(() => setCediLead(null), 1800) }
      catch (e) { setCediError(e instanceof Error ? e.message : 'Errore durante la cessione. Riprova.') }
    })
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-4">Richieste ricevute</h2>

      {leads.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-10 text-center">
          <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Nessuna richiesta ancora nella tua zona.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const status = getDisplayStatus(lead)
            const cat = getCategoryBySlug(lead.categoria)
            const { label, badge } = STATUS_CONFIG[status]
            return (
              <div
                key={lead.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 ${
                  status === 'nuovo' ? 'border-orange-200 shadow-sm' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {cat && <cat.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                    <span className="font-semibold text-slate-800 text-sm">{cat?.nameShort ?? lead.categoria}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge}`}>{label}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                    <Calendar className="w-3 h-3" />{formatDate(lead.created_at)}
                  </span>
                </div>

                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 mb-3 line-clamp-3">
                  {lead.descrizione}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.citta}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{URGENZA_LABEL[lead.urgenza] ?? lead.urgenza}</span>
                </div>

                {status === 'nuovo' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => openModal(lead)}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors min-h-[44px]"
                    >
                      <MessageSquare className="w-4 h-4" />Rispondi
                    </button>
                    <button
                      onClick={() => openCediModal(lead)}
                      className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-semibold text-sm px-4 py-3 rounded-xl transition-colors min-h-[44px]"
                    >
                      <ArrowLeftRight className="w-4 h-4" />Cedi a un collega
                    </button>
                  </div>
                )}
                {status === 'risposto' && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />Preventivo inviato
                  </div>
                )}
                {status === 'confermato' && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />Lavoro confermato
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL RISPONDI ── */}
      {modalLead && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Scrivi il tuo preventivo</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{modalLead.nome}</span>
                <span className="text-slate-400 mx-1">·</span>{modalLead.citta}
                <p className="mt-1">{modalLead.descrizione}</p>
              </div>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={5}
                placeholder="Scrivi il tuo preventivo: stima dei costi, tempi di intervento, disponibilità..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-white text-slate-800 placeholder:text-slate-400"
                autoFocus
              />
              {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button onClick={closeModal} disabled={isPending} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Annulla
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                Invia preventivo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CEDI ── */}
      {cediLead && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeCediModal() }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Cedi a un collega</h3>
              <button onClick={closeCediModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              {cediSuccess ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-800">Richiesta ceduta con successo!</p>
                  <p className="text-sm text-slate-500 mt-1">Il collega è stato notificato e guadagni +5 punti reputazione.</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800 mb-0.5">{cediLead.nome} · {cediLead.citta}</p>
                    <p className="line-clamp-2">{cediLead.descrizione}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Colleghi disponibili — stesso servizio e città
                  </p>
                  {loadingColleagues ? (
                    <div className="py-8 flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Caricamento colleghi…</span>
                    </div>
                  ) : colleagues.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">
                      Nessun collega disponibile in questa zona per questo servizio.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {colleagues.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => setSelectedColleague(col.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                            selectedColleague === col.id
                              ? 'border-orange-400 bg-orange-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 flex-shrink-0">
                            {col.ragione_sociale.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-800 text-sm truncate">{col.ragione_sociale}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              {col.rating_avg !== null ? (
                                <><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span>{col.rating_avg.toFixed(1)}</span><span>({col.review_count} rec.)</span></>
                              ) : <span>Nessuna recensione</span>}
                            </div>
                          </div>
                          {selectedColleague === col.id && <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                  {cediError && <p className="text-xs text-red-600 mt-2">{cediError}</p>}
                  <p className="text-xs text-slate-400 mt-4">
                    Cedendo questa richiesta guadagni <strong>+5 punti reputazione</strong>.
                  </p>
                </>
              )}
            </div>
            {!cediSuccess && (
              <div className="px-5 pb-5 flex gap-3 justify-end">
                <button onClick={closeCediModal} disabled={isCediPending} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Annulla
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isCediPending || !selectedColleague || loadingColleagues}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  {isCediPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Cedi richiesta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
