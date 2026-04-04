'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import type { Professional } from '@/lib/database.types'
import { saveCertificazioni } from '../actions'

export const CERT_OPTIONS = [
  { id: 'Patentino F-Gas',                         label: 'Patentino F-Gas' },
  { id: 'Certificazione SOA',                       label: 'Certificazione SOA' },
  { id: 'Abilitazione elettrica (DM 37/08)',        label: 'Abilitazione elettrica (DM 37/08)' },
  { id: 'Certificazione fotovoltaico (CEI 82-25)',  label: 'Certificazione fotovoltaico (CEI 82-25)' },
  { id: 'ISO 9001',                                 label: 'ISO 9001' },
]

const PREDEFINED_IDS = CERT_OPTIONS.map((c) => c.id)

function getInitialCustom(certs: string[]): string {
  return certs.find((c) => !PREDEFINED_IDS.includes(c)) ?? ''
}

export default function CertificazioniSection({ pro }: { pro: Professional }) {
  const existing = pro.certificazioni ?? []
  const [selected, setSelected] = useState<Set<string>>(new Set(existing.filter((c) => PREDEFINED_IDS.includes(c))))
  const [altroChecked, setAltroChecked] = useState(() => existing.some((c) => !PREDEFINED_IDS.includes(c)))
  const [altroText, setAltroText] = useState(() => getInitialCustom(existing))
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function toggle(id: string) {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
    setSaved(false)
  }

  function handleSave() {
    setError(''); setSaved(false)
    const certs = [...selected]
    if (altroChecked && altroText.trim()) certs.push(altroText.trim())
    startTransition(async () => {
      try { await saveCertificazioni(certs); setSaved(true); setTimeout(() => setSaved(false), 4000) }
      catch { setError('Errore nel salvataggio. Riprova.') }
    })
  }

  return (
    <div id="cert">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Certificazioni</h3>
      <p className="text-xs text-slate-400 mb-4">Le certificazioni selezionate appariranno come badge sul tuo profilo pubblico.</p>

      <div className="space-y-2 mb-4">
        {CERT_OPTIONS.map(({ id, label }) => (
          <label key={id} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => toggle(id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected.has(id) ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-300'
              }`}
            >
              {selected.has(id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm text-slate-700">{label}</span>
          </label>
        ))}

        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => { setAltroChecked((v) => !v); setSaved(false) }}
            className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              altroChecked ? 'bg-orange-500 border-orange-500' : 'border-slate-300 group-hover:border-orange-300'
            }`}
          >
            {altroChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
          </div>
          <div className="flex-1">
            <span className="text-sm text-slate-700">Altro</span>
            {altroChecked && (
              <input
                type="text"
                value={altroText}
                onChange={(e) => { setAltroText(e.target.value); setSaved(false) }}
                placeholder="Specifica la certificazione..."
                className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800 placeholder:text-slate-400"
              />
            )}
          </div>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700 mb-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700 mb-3">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Certificazioni salvate.
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors min-h-[44px]"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
        Salva certificazioni
      </button>
    </div>
  )
}
