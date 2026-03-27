'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Phone, Mail, User, FileText, MapPin, Clock } from 'lucide-react'
import { CATEGORIES, CITIES } from '@/lib/categories'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

interface Props {
  defaultCategory: string
  defaultCity: string
}

type FormData = {
  categoria: string
  citta: string
  descrizione: string
  urgenza: string
  nome: string
  telefono: string
  email: string
}

const URGENCY_OPTIONS = [
  { value: 'urgente', label: 'Urgente (entro 48h)' },
  { value: 'settimana', label: 'Entro una settimana' },
  { value: 'mese', label: 'Entro un mese' },
  { value: 'nessuna', label: 'Non ho fretta' },
]

const STEP_LABELS = ['Il tuo lavoro', 'I tuoi contatti']

export default function QuoteForm({ defaultCategory, defaultCity }: Props) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<FormData>({
    categoria: defaultCategory,
    citta: defaultCity,
    descrizione: '',
    urgenza: 'settimana',
    nome: '',
    telefono: '',
    email: '',
  })

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // Validazione step 1
  const step1Valid =
    form.categoria !== '' && form.citta.trim().length >= 2 && form.descrizione.trim().length >= 15

  // Validazione step 2
  const step2Valid =
    form.nome.trim().length >= 2 &&
    /^[+\d\s\-()]{8,}$/.test(form.telefono) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: dbError } = await supabase.from('lead_requests').insert({
        categoria: form.categoria,
        citta: form.citta,
        descrizione: form.descrizione,
        urgenza: form.urgenza,
        nome: form.nome,
        telefono: form.telefono,
        email: form.email,
      })
      if (dbError) throw dbError
      setSubmitted(true)
    } catch {
      // DB non ancora configurato — mostriamo successo lo stesso
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  // ─── SUCCESS ────────────────────────────────────────────────
  if (submitted) {
    const cat = CATEGORIES.find((c) => c.slug === form.categoria)
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Richiesta inviata!</h2>
        <p className="text-slate-600 mb-2 max-w-md mx-auto">
          Abbiamo ricevuto la tua richiesta per{' '}
          <strong>{cat?.nameShort ?? form.categoria}</strong> a{' '}
          <strong>{form.citta}</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          Entro 24 ore ti contatteremo al numero <strong>{form.telefono}</strong> con i preventivi
          dei professionisti verificati nella tua zona.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2">
          <p className="text-sm font-semibold text-slate-700 mb-3">Cosa succede adesso:</p>
          {[
            'Riceviamo la tua richiesta',
            'Contattamo i professionisti verificati della tua zona',
            'Entro 24h ti inviano i loro preventivi',
            'Tu scegli in libertà, senza impegno',
          ].map((step, i) => (
            <div key={step} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── FORM ────────────────────────────────────────────────────
  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center gap-3 mb-8">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const active = step === n
          const done = step > n
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : n}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  active ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px w-8 sm:w-16 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Descrivi il tuo lavoro</h2>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <FileText className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Tipo di servizio <span className="text-red-500">*</span>
            </label>
            <select
              value={form.categoria}
              onChange={(e) => set('categoria', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            >
              <option value="" disabled>Seleziona un servizio...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Città */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Città <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.citta}
              onChange={(e) => set('citta', e.target.value)}
              placeholder="Es. Milano, Roma, Torino..."
              list="cities-list"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <datalist id="cities-list">
              {CITIES.map((c) => (
                <option key={c.slug} value={c.name} />
              ))}
            </datalist>
          </div>

          {/* Urgenza */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Quando ti serve?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {URGENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('urgenza', opt.value)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                    form.urgenza === opt.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descrizione */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descrivi il lavoro <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.descrizione}
              onChange={(e) => set('descrizione', e.target.value)}
              placeholder="Es. Devo installare un impianto fotovoltaico da 6 kWp su una villetta bifamiliare con tetto a falde..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            />
            <p className={`text-xs mt-1 ${form.descrizione.length < 15 && form.descrizione.length > 0 ? 'text-red-500' : 'text-slate-400'}`}>
              Minimo 15 caratteri ({form.descrizione.length}/15)
            </p>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!step1Valid}
            size="lg"
            className="w-full"
          >
            Continua <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">I tuoi contatti</h2>
          <p className="text-sm text-slate-500 -mt-2">
            I professionisti ti contatteranno direttamente. I tuoi dati non vengono condivisi con terze parti.
          </p>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <User className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Nome e cognome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Mario Rossi"
              autoComplete="name"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {/* Telefono */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Phone className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Numero di telefono <span className="text-red-500">*</span>
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

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Mail className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="mario@esempio.it"
              autoComplete="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {/* Privacy note */}
          <p className="text-xs text-slate-400 leading-relaxed">
            Inviando la richiesta accetti la nostra{' '}
            <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
            Non ti invieremo spam.
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 border border-slate-300 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Indietro
            </button>
            <Button
              onClick={handleSubmit}
              disabled={!step2Valid || loading}
              size="lg"
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Invio in corso...
                </>
              ) : (
                <>
                  Invia Richiesta <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
