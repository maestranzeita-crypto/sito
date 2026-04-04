'use client'

import { useState, useTransition } from 'react'
import { ExternalLink, CheckCircle2, Loader2, AlertCircle, MapPin } from 'lucide-react'
import type { Professional } from '@/lib/database.types'
import { saveGmbLink } from '../actions'

const GMB_PATTERNS = ['maps.google.com', 'google.com/maps', 'g.page', 'goo.gl/maps']

function isValidGmbUrl(url: string): boolean {
  if (!url.trim()) return true
  try { const u = new URL(url.trim()); return GMB_PATTERNS.some((p) => u.href.includes(p)) }
  catch { return false }
}

export default function GmbSection({ pro }: { pro: Professional }) {
  const [link, setLink] = useState(pro.gmb_link ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    const trimmed = link.trim()
    if (trimmed && !isValidGmbUrl(trimmed)) { setError('Il link deve provenire da maps.google.com, g.page o goo.gl/maps'); return }
    setError(''); setSaved(false)
    startTransition(async () => {
      try { await saveGmbLink(trimmed); setSaved(true); setTimeout(() => setSaved(false), 4000) }
      catch { setError('Errore nel salvataggio. Riprova.') }
    })
  }

  return (
    <div id="gmb">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Google My Business</h3>
      <p className="text-xs text-slate-400 mb-4">
        Aggiungi il link alla tua scheda Google Maps. Apparirà come bottone sul tuo profilo pubblico.
      </p>

      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url"
            value={link}
            onChange={(e) => { setLink(e.target.value); setSaved(false); setError('') }}
            placeholder="https://maps.google.com/maps?..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors flex-shrink-0 min-h-[44px]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Salva
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700 mb-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-green-700 mb-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Link Google My Business salvato.
        </div>
      )}

      {link.trim() && isValidGmbUrl(link.trim()) && (
        <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mt-1">
          <ExternalLink className="w-3.5 h-3.5" />Anteprima: apri su Google Maps
        </a>
      )}

      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500 font-medium mb-1">Formati accettati:</p>
        <ul className="text-xs text-slate-400 space-y-0.5">
          <li>· https://maps.google.com/maps?…</li>
          <li>· https://www.google.com/maps/place/…</li>
          <li>· https://g.page/nome-attività</li>
          <li>· https://goo.gl/maps/…</li>
        </ul>
      </div>
    </div>
  )
}
