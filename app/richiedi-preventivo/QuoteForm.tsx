'use client'

import { useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
  User,
  FileText,
  MapPin,
  Clock,
  PhoneCall,
} from 'lucide-react'
import { CITIES } from '@/lib/categories'
import type { UrgenzaType } from '@/lib/database.types'
import Button from '@/components/ui/Button'

// ─── Costanti ────────────────────────────────────────────────────────────────

const FORM_SERVICES = [
  { slug: 'fotovoltaico', label: 'Impianti Fotovoltaici' },
  { slug: 'elettricista', label: 'Impianti Elettrici' },
  { slug: 'idraulico', label: 'Idraulici' },
  { slug: 'muratore', label: 'Muratori' },
  { slug: 'ristrutturazione', label: 'Imprese Edili' },
]

const URGENCY_OPTIONS: { value: UrgenzaType; label: string }[] = [
  { value: 'urgente', label: 'Entro 48 ore' },
  { value: 'settimana', label: 'Entro una settimana' },
  { value: 'mese', label: 'Entro un mese' },
  { value: 'nessuna', label: 'Nessuna urgenza' },
]

// ─── Domande dinamiche per categoria ─────────────────────────────────────────

type Question = {
  key: string
  label: string
  options: string[]
  required?: boolean
}

const DYNAMIC_QUESTIONS: Record<string, Question[]> = {
  fotovoltaico: [
    {
      key: 'tipo_immobile',
      label: 'Tipo immobile',
      options: ['Casa singola', 'Appartamento', 'Condominio', 'Azienda'],
      required: true,
    },
    {
      key: 'mq_tetto',
      label: 'Mq tetto disponibile',
      options: ['Sotto 30 mq', '30–60 mq', '60–100 mq', 'Oltre 100 mq'],
    },
    {
      key: 'consumo_mensile',
      label: 'Consumo medio mensile',
      options: ['Sotto 200 kWh', '200–400 kWh', 'Oltre 400 kWh'],
    },
    {
      key: 'sistema_accumulo',
      label: 'Sistema di accumulo (batterie)?',
      options: ['Sì', 'No', 'Non so'],
    },
  ],
  elettricista: [
    {
      key: 'tipo_intervento',
      label: 'Tipo intervento',
      options: ['Nuovo impianto', 'Riparazione guasto', 'Messa a norma', 'Aggiunta punti luce'],
      required: true,
    },
    {
      key: 'numero_vani',
      label: 'Numero vani',
      options: ['1–2 vani', '3–4 vani', '5 o più'],
    },
    {
      key: 'anno_costruzione',
      label: 'Anno costruzione immobile',
      options: ['Prima del 1990', '1990–2010', 'Dopo il 2010'],
    },
  ],
  idraulico: [
    {
      key: 'tipo_intervento',
      label: 'Tipo intervento',
      options: ['Perdita o guasto', 'Nuovo impianto', 'Sostituzione caldaia', 'Ristrutturazione bagno'],
      required: true,
    },
    {
      key: 'piano_immobile',
      label: "Piano dell'immobile",
      options: ['Piano terra', 'Primo o secondo', 'Terzo o superiore'],
    },
    {
      key: 'preventivo_confronto',
      label: 'Hai già un preventivo da confrontare?',
      options: ['Sì', 'No'],
    },
  ],
  muratore: [
    {
      key: 'tipo_lavoro',
      label: 'Tipo lavoro',
      options: ['Tinteggiatura', 'Piccole riparazioni', 'Pavimentazione', 'Altro'],
      required: true,
    },
    {
      key: 'mq_coinvolti',
      label: 'Mq coinvolti',
      options: ['Sotto 20 mq', '20–50 mq', 'Oltre 50 mq'],
    },
    {
      key: 'interno_esterno',
      label: 'Interno o esterno',
      options: ['Interno', 'Esterno', 'Entrambi'],
    },
  ],
  ristrutturazione: [
    {
      key: 'cosa_ristrutturare',
      label: 'Cosa vuoi ristrutturare',
      options: ['Bagno', 'Cucina', 'Intera casa', 'Facciata esterna', 'Altro'],
      required: true,
    },
    {
      key: 'mq_coinvolti',
      label: 'Mq coinvolti',
      options: ['Sotto 50 mq', '50–100 mq', 'Oltre 100 mq'],
    },
    {
      key: 'stato_attuale',
      label: 'Stato attuale',
      options: ['Da demolire e rifare', 'Solo finiture', 'Struttura già pronta'],
    },
  ],
}

// ─── Tipi ─────────────────────────────────────────────────────────────────────

type Step1Data = {
  categoria: string
  citta: string
  urgenza: UrgenzaType
  descrizione: string
}

type OnlineData = {
  nome: string
  email: string
  telefono: string
  jobDetails: Record<string, string>
}

type CallbackData = {
  nome: string
  telefono: string
  orario: string
}

type SubmitMode = 'online' | 'callback' | null

interface Props {
  defaultCategory: string
  defaultCity: string
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function QuoteForm({ defaultCategory, defaultCity }: Props) {
  const [step, setStep] = useState(1)
  const [submitMode, setSubmitMode] = useState<SubmitMode>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [step1, setStep1] = useState<Step1Data>({
    categoria: defaultCategory,
    citta: defaultCity,
    urgenza: 'settimana',
    descrizione: '',
  })

  const [online, setOnline] = useState<OnlineData>({
    nome: '',
    email: '',
    telefono: '',
    jobDetails: {},
  })

  const [callback, setCallback] = useState<CallbackData>({
    nome: '',
    telefono: '',
    orario: 'mattina',
  })

  const setS1 = (field: keyof Step1Data, value: string) =>
    setStep1((p) => ({ ...p, [field]: value }))

  const setOnlineField = (field: keyof Omit<OnlineData, 'jobDetails'>, value: string) =>
    setOnline((p) => ({ ...p, [field]: value }))

  const setJobDetail = (key: string, value: string) =>
    setOnline((p) => ({ ...p, jobDetails: { ...p.jobDetails, [key]: value } }))

  const setCb = (field: keyof CallbackData, value: string) =>
    setCallback((p) => ({ ...p, [field]: value }))

  // Validazioni
  const step1Valid =
    step1.categoria !== '' &&
    step1.citta.trim().length >= 2 &&
    step1.descrizione.trim().length >= 10

  const questions = DYNAMIC_QUESTIONS[step1.categoria] ?? []
  const requiredQuestions = questions.filter((q) => q.required)
  const onlineValid =
    online.nome.trim().length >= 2 &&
    /^[+\d\s\-()\u202F]{8,}$/.test(online.telefono) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(online.email) &&
    requiredQuestions.every((q) => !!online.jobDetails[q.key])

  const callbackValid =
    callback.nome.trim().length >= 2 &&
    /^[+\d\s\-()\u202F]{8,}$/.test(callback.telefono)

  // Submit
  async function handleSubmit(mode: SubmitMode) {
    if (mode === null) return
    setLoading(true)
    setError('')
    try {
      const body =
        mode === 'online'
          ? {
              request_type: 'online',
              categoria: step1.categoria,
              citta: step1.citta,
              urgenza: step1.urgenza,
              descrizione: step1.descrizione,
              nome: online.nome,
              email: online.email,
              telefono: online.telefono,
              job_details: online.jobDetails,
            }
          : {
              request_type: 'callback',
              categoria: step1.categoria,
              citta: step1.citta,
              urgenza: step1.urgenza,
              descrizione: step1.descrizione,
              nome: callback.nome,
              telefono: callback.telefono,
              email: '',
              job_details: { orario_preferito: callback.orario },
            }

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Errore server')
      }
      setSubmitMode(mode)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  if (submitted) {
    const svcLabel =
      FORM_SERVICES.find((s) => s.slug === step1.categoria)?.label ?? step1.categoria
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
          {submitMode === 'callback' ? 'Ti richiamiamo presto!' : 'Richiesta inviata!'}
        </h2>
        <p className="text-slate-600 mb-2 max-w-md mx-auto">
          Abbiamo ricevuto la tua richiesta per <strong>{svcLabel}</strong> a{' '}
          <strong>{step1.citta}</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          {submitMode === 'callback'
            ? `Ti chiameremo al numero ${callback.telefono} nelle prossime 24 ore.`
            : `Entro 24 ore ti contatteremo al numero ${online.telefono} con i preventivi dei professionisti verificati.`}
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2">
          <p className="text-sm font-semibold text-slate-700 mb-3">Cosa succede adesso:</p>
          {(submitMode === 'callback'
            ? [
                'Riceviamo la tua richiesta',
                'Un nostro consulente ti richiama entro 24 ore',
                'Ti aiutiamo a trovare il professionista giusto',
                'Ricevi i preventivi in libertà, senza impegno',
              ]
            : [
                'Riceviamo la tua richiesta',
                'Contattamo i professionisti verificati della tua zona',
                'Entro 24h ti inviano i loro preventivi',
                'Tu scegli in libertà, senza impegno',
              ]
          ).map((txt, i) => (
            <div key={txt} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {txt}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Progress bar ─────────────────────────────────────────────────────────
  const progressBar = (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Step {step} di 2
        </span>
        <span className="text-xs text-slate-400">
          {step === 1 ? 'Dati del lavoro' : 'Scegli come ricevere i preventivi'}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-300"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>
    </div>
  )

  // ─── Step 1 ───────────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div>
        {progressBar}
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Descrivi il tuo lavoro</h2>

          {/* Tipo di lavoro */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <FileText className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Tipo di lavoro <span className="text-red-500">*</span>
            </label>
            <select
              value={step1.categoria}
              onChange={(e) => setS1('categoria', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            >
              <option value="" disabled>Seleziona un servizio…</option>
              {FORM_SERVICES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.label}
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
              value={step1.citta}
              onChange={(e) => setS1('citta', e.target.value)}
              placeholder="Es. Milano, Roma, Torino…"
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
                  onClick={() => setS1('urgenza', opt.value)}
                  className={`min-h-[44px] px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                    step1.urgenza === opt.value
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
              Descrizione breve <span className="text-red-500">*</span>
            </label>
            <textarea
              value={step1.descrizione}
              onChange={(e) => {
                if (e.target.value.length <= 300) setS1('descrizione', e.target.value)
              }}
              placeholder="Es. Devo installare un impianto fotovoltaico da 6kw su tetto a falde"
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            />
            <p className="text-xs mt-1 text-slate-400 text-right">
              {step1.descrizione.length}/300
            </p>
          </div>

          <Button onClick={() => setStep(2)} disabled={!step1Valid} size="lg" className="w-full min-h-[44px]">
            Continua <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  // ─── Step 2 ───────────────────────────────────────────────────────────────
  return (
    <div>
      {progressBar}

      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Indietro
        </button>
        <h2 className="text-xl font-extrabold text-slate-900">Come vuoi i preventivi?</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ── Card 1: Online ── */}
        <div className="border-2 border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ricevi preventivi online</h3>
              <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Gratuito
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              I professionisti verificati della tua zona ti contattano entro 24 ore.
            </p>
          </div>

          {/* Campi contatto */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                <User className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={online.nome}
                onChange={(e) => setOnlineField('nome', e.target.value)}
                placeholder="Mario Rossi"
                autoComplete="name"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                <Mail className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={online.email}
                onChange={(e) => setOnlineField('email', e.target.value)}
                placeholder="mario@esempio.it"
                autoComplete="email"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                <Phone className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                Telefono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={online.telefono}
                onChange={(e) => setOnlineField('telefono', e.target.value)}
                placeholder="+39 333 123 4567"
                autoComplete="tel"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[44px]"
              />
            </div>
          </div>

          {/* Domande dinamiche */}
          {questions.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 pt-3">
              {questions.map((q) => (
                <div key={q.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {q.label}
                    {q.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setJobDetail(q.key, opt)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all min-h-[34px] ${
                          online.jobDetails[q.key] === opt
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Inviando accetti la nostra{' '}
            <a href="/privacy" className="underline hover:text-slate-600">
              Privacy Policy
            </a>
            .
          </p>

          <button
            onClick={() => handleSubmit('online')}
            disabled={!onlineValid || loading}
            className="w-full min-h-[44px] px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Invio…</>
            ) : (
              <>Richiedi preventivi <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* ── Card 2: Callback ── */}
        <div className="border-2 border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ti chiamiamo noi</h3>
              <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Entro 24 ore
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ti chiamiamo noi per capire esattamente cosa ti serve.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                <User className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={callback.nome}
                onChange={(e) => setCb('nome', e.target.value)}
                placeholder="Mario Rossi"
                autoComplete="name"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                <Phone className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                Telefono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={callback.telefono}
                onChange={(e) => setCb('telefono', e.target.value)}
                placeholder="+39 333 123 4567"
                autoComplete="tel"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-orange-500" />
                Orario preferito
              </label>
              <div className="flex gap-2">
                {['mattina', 'pomeriggio', 'sera'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setCb('orario', o)}
                    className={`flex-1 min-h-[44px] px-2 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${
                      callback.orario === o
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Inviando accetti la nostra{' '}
            <a href="/privacy" className="underline hover:text-slate-600">
              Privacy Policy
            </a>
            .
          </p>

          <button
            onClick={() => handleSubmit('callback')}
            disabled={!callbackValid || loading}
            className="w-full min-h-[44px] px-4 py-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 mt-auto"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Invio…</>
            ) : (
              <><PhoneCall className="w-4 h-4" /> Richiedimi una chiamata</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
