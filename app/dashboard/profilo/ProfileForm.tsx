'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, CITIES } from '@/lib/categories'
import type { Professional } from '@/lib/database.types'

const RAGGIO_OPTIONS = ['10', '20', '30', '50', '100']
const ANNI_OPTIONS = ['1', '2', '3', '5', '10', '15', '20', '25', '30']

export default function ProfileForm({ pro }: { pro: Professional }) {
  const supabase = createClient()

  const [bio, setBio] = useState(pro.bio)
  const [telefono, setTelefono] = useState(pro.telefono)
  const [raggioKm, setRaggioKm] = useState(pro.raggio_km)
  const [anniEsperienza, setAnniEsperienza] = useState(pro.anni_esperienza)
  const [categorie, setCategorie] = useState<string[]>(pro.categorie)
  const [citta, setCitta] = useState(pro.citta)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggleCategory(slug: string) {
    setCategorie((prev) => prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (categorie.length === 0) { setError('Seleziona almeno una categoria.'); return }
    setSaving(true); setError(''); setSaved(false)
    const { error: err } = await supabase
      .from('professionals')
      .update({ bio, telefono, raggio_km: raggioKm, anni_esperienza: anniEsperienza, categorie, citta })
      .eq('id', pro.id)
    if (err) { setError('Errore nel salvataggio. Riprova.') }
    else { setSaved(true); setTimeout(() => setSaved(false), 4000) }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Profilo aggiornato con successo.
        </div>
      )}

      {/* Dati aziendali (non modificabili) */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Dati aziendali</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Ragione sociale', value: pro.ragione_sociale },
            { label: 'P.IVA', value: pro.piva },
            { label: 'Forma giuridica', value: pro.forma_giuridica },
            { label: 'Email', value: pro.email },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="block text-xs text-slate-400 mb-0.5">{label}</span>
              <span className="font-medium text-slate-700">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">Per modificare ragione sociale, P.IVA o email contatta il supporto.</p>
      </div>

      {/* Contatti e operatività */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Contatti e operatività</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Anni di esperienza</label>
            <select
              value={anniEsperienza}
              onChange={(e) => setAnniEsperienza(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800"
            >
              {ANNI_OPTIONS.map((a) => <option key={a} value={a}>{a} anni</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Città principale</label>
            <select
              value={citta}
              onChange={(e) => setCitta(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800"
            >
              {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name} ({c.province})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Raggio operativo</label>
            <select
              value={raggioKm}
              onChange={(e) => setRaggioKm(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800"
            >
              {RAGGIO_OPTIONS.map((r) => <option key={r} value={r}>{r} km</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Categorie */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-1.5" id="categorie">Categorie di servizio</h3>
        <p className="text-xs text-slate-400 mb-4">Le richieste di preventivo che ricevi dipendono dalle categorie selezionate.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const selected = categorie.includes(cat.slug)
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                  selected
                    ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-400'
                    : 'border-slate-200 text-slate-600 hover:border-orange-300'
                }`}
              >
                <cat.icon className="w-4 h-4 flex-shrink-0" />
                {cat.nameShort}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bio */}
      <div id="bio">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Presentazione / Bio
          <span className="text-slate-400 font-normal ml-1">({bio.length}/500 caratteri)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={5}
          placeholder="Descrivi la tua attività, specializzazioni, anni di esperienza e zona operativa..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-white text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition-colors min-h-[44px]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Salva modifiche
        </button>
      </div>
    </form>
  )
}
