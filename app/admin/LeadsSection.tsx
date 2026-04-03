'use client'

import { useState, useTransition } from 'react'
import type { LeadRequest, Professional } from '@/lib/database.types'
import { assignLeadManually } from './actions'

type Props = {
  leads: LeadRequest[]
  professionals: Professional[]
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'In attesa',
  contacted: 'Contattato',
  closed: 'Chiuso',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
}

export default function LeadsSection({ leads, professionals }: Props) {
  const [selectedLead, setSelectedLead] = useState<LeadRequest | null>(null)
  const [selectedProId, setSelectedProId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const proMap = Object.fromEntries(professionals.map((p) => [p.id, p]))

  const unassigned = leads.filter((l) => !l.assigned_professional_id)
  const assigned = leads.filter((l) => l.assigned_professional_id)

  const filteredPros = selectedLead
    ? professionals.filter(
        (p) =>
          p.status === 'active' &&
          p.categorie.some((c) => c.toLowerCase() === selectedLead.categoria.toLowerCase()),
      )
    : []

  function openModal(lead: LeadRequest) {
    setSelectedLead(lead)
    setSelectedProId('')
    setError(null)
  }

  function closeModal() {
    setSelectedLead(null)
    setSelectedProId('')
    setError(null)
  }

  function handleAssign() {
    if (!selectedLead || !selectedProId) return
    setError(null)
    startTransition(async () => {
      try {
        await assignLeadManually(selectedLead.id, selectedProId)
        closeModal()
      } catch {
        setError("Errore durante l'assegnazione. Riprova.")
      }
    })
  }

  return (
    <>
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Gestione Lead</h2>
          <span className="bg-blue-100 text-blue-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
            {leads.length} {leads.length === 1 ? 'richiesta' : 'richieste'}
          </span>
        </div>

        {/* Non assegnati */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Non assegnati ({unassigned.length})
          </h3>
          {unassigned.length === 0 ? (
            <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-4 text-center">
              Tutti i lead sono assegnati.
            </p>
          ) : (
            <LeadsTable leads={unassigned} proMap={proMap} onAssign={openModal} showAssignButton />
          )}
        </div>

        {/* Assegnati */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Assegnati ({assigned.length})
          </h3>
          {assigned.length === 0 ? (
            <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-4 text-center">
              Nessun lead ancora assegnato.
            </p>
          ) : (
            <LeadsTable leads={assigned} proMap={proMap} onAssign={openModal} showAssignButton={false} />
          )}
        </div>
      </section>

      {/* Modal assegnazione */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Assegna manualmente</h3>
            <p className="text-sm text-gray-500 mb-5">
              Lead:{' '}
              <strong className="text-gray-700">{selectedLead.nome}</strong>{' '}
              &middot; {selectedLead.categoria} &middot; {selectedLead.citta}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Professionista (stesso servizio)
            </label>
            {filteredPros.length === 0 ? (
              <p className="text-sm text-red-500 mb-4">
                Nessun professionista attivo trovato per &ldquo;{selectedLead.categoria}&rdquo;.
              </p>
            ) : (
              <select
                value={selectedProId}
                onChange={(e) => setSelectedProId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">— Seleziona professionista —</option>
                {filteredPros.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.ragione_sociale} · {p.citta}
                  </option>
                ))}
              </select>
            )}

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleAssign}
                disabled={isPending || !selectedProId}
                className="px-4 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? 'Assegnando…' : 'Conferma assegnazione'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function LeadsTable({
  leads,
  proMap,
  onAssign,
  showAssignButton,
}: {
  leads: LeadRequest[]
  proMap: Record<string, Professional>
  onAssign: (lead: LeadRequest) => void
  showAssignButton: boolean
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Cliente
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Servizio
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Città
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Data
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Stato
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Assegnato a
            </th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => {
            const pro = lead.assigned_professional_id
              ? proMap[lead.assigned_professional_id]
              : null
            return (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {lead.nome}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.categoria}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.citta}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[lead.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {pro ? (
                    pro.ragione_sociale
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {showAssignButton && (
                    <button
                      onClick={() => onAssign(lead)}
                      className="px-3 py-1 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg transition-colors"
                    >
                      Assegna
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
