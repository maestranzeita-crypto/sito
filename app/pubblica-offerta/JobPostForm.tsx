'use client'

import { useState } from 'react'
import {
  ArrowRight, ArrowLeft, CheckCircle2, Loader2,
  Briefcase, MapPin, FileText, Euro, Phone, Mail, Building2,
} from 'lucide-react'
import { CATEGORIES, CITIES } from '@/lib/categories'
import { createClient } from '@/lib/supabase/client'
import type { ContrattoType, ListingStatus } from '@/lib/database.types'
import Button from '@/components/ui/Button'

type FormData = {
  categoria: string
  tipo: ContrattoType | ''
  titolo: string
  citta: string
  raggio: string
  descrizione: string
  requisiti: string
  retribuzione: string
  retribuzioneVisibile: boolean
  ragioneSociale: string
  telefono: string
  email: string
}

const TIPO_OPTIONS: { value: ContrattoType; label: string; desc: string }[] = [
  { value: 'Dipendente', label: 'Dipendente', desc: 'Assunzione a tempo determinato o indeterminato' },
  { value: 'Subappalto', label: 'Subappalto', desc: 'Collaborazione come ditta o artigiano esterno' },
  { value: 'Progetto', label: 'Progetto', desc: 'Collaborazione per uno o più cantieri specifici' },
]

const RAGGIO_OPTIONS = [
  { value: 'citta', label: 'Solo in città' },
  { value: '30', label: 'Entro 30 km' },
  { value: '60', label: 'Entro 60 km' },
  { value: 'regione', label: 'Tutta la regione' },
  { value: 'italia', label: 'Tutta Italia' },
]

const STEP_LABELS = ['Il lavoro', 'Dettagli', 'Chi sei']

export default function JobPostForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<FormData>({
    categoria: '',
    tipo: '',
    titolo: '',
    citta: '',
    raggio: '30',
    descrizione: '',
    requisiti: '',
    retribuzione: '',
    retribuzioneVisibile: true,
    ragioneSociale: '',
    telefono: '',
    email: '',
  })

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const step1Valid =
    form.categoria !== '' &&
    form.tipo !== '' &&
    form.titolo.trim().length >= 10 &&
    form.citta.trim().length >= 2

  const step2Valid = form.descrizione.trim().length >= 50

  const step3Valid =
    form.ragioneSociale.trim().length >= 2 &&
    /^[+\d\s\-()]{8,}$/.test(form.telefono) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  async function handleSubmit() {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('job_listings').insert({
        categoria: form.categoria,
        tipo_contratto: form.tipo as ContrattoType,
        titolo: form.titolo,
        citta: form.citta,
        raggio: form.raggio,
        descrizione: form.descrizione,
        requisiti: form.requisiti || null,
        retribuzione: form.retribuzioneVisibile ? form.retribuzione || null : null,
        ragione_sociale: form.ragioneSociale,
        telefono: form.telefono,
        email: form.email,
        status: 'pending' as ListingStatus,
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  // ─── SUCCESS ──────────────────────────────────────────────────
  if (submitted) {
    const cat = CATEGORIES.find((c) => c.slug === form.categoria)
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Annuncio inviato!</h2>
        <p className="text-slate-600 mb-2 max-w-md mx-auto">
          Il tuo annuncio per <strong>{cat?.nameShort ?? form.categoria}</strong> a{' '}
          <strong>{form.citta}</strong> è in fase di revisione.
        </p>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          Verificheremo i dati entro 24 ore e riceverai una conferma a{' '}
          <strong>{form.email}</strong> quando l&apos;annuncio sarà pubblicato.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-3">
          <p className="text-sm font-semibold text-slate-700 mb-1">Prossimi passi:</p>
          {[
            'Revisioniamo l\'annuncio entro 24 ore',
            'L\'annuncio viene pubblicato sulla bacheca',
            'I candidati ti contattano direttamente',
            'Puoi modificare o chiudere l\'annuncio in qualsiasi momento',
          ].map((s, i) => (
            <div key={s} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const active = step === n
          const done = step > n
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                done ? 'bg-green-500 text-white' : active ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : n}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px w-6 sm:w-14 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1 — Il lavoro ── */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">Che figura stai cercando?</h2>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Briefcase className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const selected = form.categoria === cat.slug
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => set('categoria', cat.slug)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      selected
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <cat.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{cat.name}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-orange-500 ml-auto flex-shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tipo contratto */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipo di collaborazione <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {TIPO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('tipo', opt.value)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                    form.tipo === opt.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-colors ${
                    form.tipo === opt.value ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                  }`} />
                  <div>
                    <p className={`text-sm font-semibold ${form.tipo === opt.value ? 'text-orange-800' : 'text-slate-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Titolo annuncio */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <FileText className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Titolo dell&apos;annuncio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.titolo}
              onChange={(e) => set('titolo', e.target.value)}
              placeholder="Es. Elettricista qualificato per cantieri residenziali"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">Minimo 10 caratteri ({form.titolo.length}/10)</p>
          </div>

          {/* Città + raggio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <MapPin className="w-4 h-4 inline mr-1.5 text-orange-500" />
                Città <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.citta}
                onChange={(e) => set('citta', e.target.value)}
                placeholder="Es. Milano..."
                list="cities-job"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <datalist id="cities-job">
                {CITIES.map((c) => <option key={c.slug} value={c.name} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Zona di lavoro
              </label>
              <select
                value={form.raggio}
                onChange={(e) => set('raggio', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
              >
                {RAGGIO_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button onClick={() => setStep(2)} disabled={!step1Valid} size="lg" className="w-full">
            Continua <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {/* ── STEP 2 — Dettagli ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Dettagli dell&apos;offerta</h2>

          {/* Descrizione */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descrizione del lavoro <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.descrizione}
              onChange={(e) => set('descrizione', e.target.value)}
              placeholder="Descrivi il ruolo, le mansioni principali, il tipo di cantieri, l'ambiente di lavoro e tutto ciò che un candidato dovrebbe sapere..."
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            />
            <p className={`text-xs mt-1 ${form.descrizione.length < 50 && form.descrizione.length > 0 ? 'text-red-500' : 'text-slate-400'}`}>
              Minimo 50 caratteri ({form.descrizione.length}/50)
            </p>
          </div>

          {/* Requisiti */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Requisiti richiesti
              <span className="text-slate-400 font-normal ml-1">(opzionale)</span>
            </label>
            <textarea
              value={form.requisiti}
              onChange={(e) => set('requisiti', e.target.value)}
              placeholder="Es. Patentino B, esperienza minima 3 anni, certificazione DM 37/08, disponibilità immediata..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Retribuzione */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Euro className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Retribuzione indicativa
              <span className="text-slate-400 font-normal ml-1">(opzionale)</span>
            </label>
            <input
              type="text"
              value={form.retribuzione}
              onChange={(e) => set('retribuzione', e.target.value)}
              placeholder="Es. 1.800€ – 2.400€/mese oppure 25€ – 35€/ora"
              disabled={!form.retribuzioneVisibile}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!form.retribuzioneVisibile}
                onChange={(e) => set('retribuzioneVisibile', !e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
              />
              <span className="text-xs text-slate-500">Non indicare la retribuzione nell&apos;annuncio</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 border border-slate-300 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Indietro
            </button>
            <Button onClick={() => setStep(3)} disabled={!step2Valid} size="lg" className="flex-1">
              Continua <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3 — Chi sei ── */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Chi pubblica l&apos;annuncio</h2>
          <p className="text-sm text-slate-500 -mt-2">
            I candidati ti contatteranno direttamente. Dati non visibili pubblicamente.
          </p>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Building2 className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Nome / Ragione sociale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.ragioneSociale}
              onChange={(e) => set('ragioneSociale', e.target.value)}
              placeholder="Es. Rossi Impianti SRL o Mario Rossi"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Phone className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Telefono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
              placeholder="+39 333 123 4567"
              autoComplete="tel"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Mail className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="info@tuaazienda.it"
              autoComplete="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Pubblicando accetti i nostri{' '}
            <a href="/termini" className="underline hover:text-slate-600">Termini di Servizio</a>.
            I primi 3 annunci sono gratuiti.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-3 border border-slate-300 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Indietro
            </button>
            <Button
              onClick={handleSubmit}
              disabled={!step3Valid || loading}
              size="lg"
              className="flex-1"
            >
              {loading ? (
                <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Invio...</>
              ) : (
                <>Pubblica Annuncio <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
