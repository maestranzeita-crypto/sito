'use client'

import { useState } from 'react'
import {
  ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle,
  Phone, Mail, User, MapPin, Briefcase, Building2, FileCheck,
} from 'lucide-react'
import { CATEGORIES, CITIES } from '@/lib/categories'
import Button from '@/components/ui/Button'

interface Props {
  defaultCategory: string
  defaultCity: string
}

type FormData = {
  categorie: string[]
  citta: string
  raggio: string
  ragioneSociale: string
  piva: string
  formaGiuridica: string
  telefono: string
  email: string
  anniEsperienza: string
  bio: string
  telegramUsername: string
}

const RAGGI = [
  { value: '20', label: 'Entro 20 km' },
  { value: '50', label: 'Entro 50 km' },
  { value: '100', label: 'Entro 100 km' },
  { value: 'regione', label: 'Tutta la regione' },
]

const FORME_GIURIDICHE = [
  'Artigiano / Ditta individuale',
  'Società di persone (SNC, SAS)',
  'Società di capitali (SRL, SpA)',
  'Libero professionista',
]

const ANNI_OPTIONS = ['Meno di 2', '2–5', '5–10', '10–20', 'Più di 20']

const STEP_LABELS = ['Specializzazione', 'Dati aziendali', 'Profilo']

// Validazione P.IVA italiana (11 cifre + checksum)
function validatePIVA(piva: string): boolean {
  const p = piva.replace(/\s/g, '')
  if (!/^\d{11}$/.test(p)) return false
  let s = 0
  for (let i = 0; i <= 9; i++) {
    const n = parseInt(p[i])
    if (i % 2 === 0) {
      s += n
    } else {
      const d = n * 2
      s += d > 9 ? d - 9 : d
    }
  }
  return (10 - (s % 10)) % 10 === parseInt(p[10])
}

export default function RegisterForm({ defaultCategory, defaultCity }: Props) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [pivaError, setPivaError] = useState('')

  const [form, setForm] = useState<FormData>({
    categorie: defaultCategory ? [defaultCategory] : [],
    citta: defaultCity,
    raggio: '50',
    ragioneSociale: '',
    piva: '',
    formaGiuridica: '',
    telefono: '',
    email: '',
    anniEsperienza: '5–10',
    bio: '',
    telegramUsername: '',
  })

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  function toggleCategoria(slug: string) {
    setForm((prev) => ({
      ...prev,
      categorie: prev.categorie.includes(slug)
        ? prev.categorie.filter((c) => c !== slug)
        : [...prev.categorie, slug],
    }))
  }

  const step1Valid = form.categorie.length > 0 && form.citta.trim().length >= 2
  const step2Valid =
    form.ragioneSociale.trim().length >= 2 &&
    validatePIVA(form.piva) &&
    form.formaGiuridica !== '' &&
    /^[+\d\s\-()]{8,}$/.test(form.telefono) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const step3Valid = form.bio.trim().length >= 30

  function handlePivaBlur() {
    if (form.piva && !validatePIVA(form.piva)) {
      setPivaError('P.IVA non valida. Controlla il numero (11 cifre).')
    } else {
      setPivaError('')
    }
  }

  async function handleSubmit() {
    setLoading(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorie: form.categorie,
          citta: form.citta,
          raggio_km: form.raggio,
          ragione_sociale: form.ragioneSociale,
          piva: form.piva,
          forma_giuridica: form.formaGiuridica,
          telefono: form.telefono,
          email: form.email,
          anni_esperienza: form.anniEsperienza,
          bio: form.bio,
          telegram_username: form.telegramUsername.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error ?? 'Errore imprevisto. Riprova.')
        return
      }

      // Notifica admin — fire and forget, non blocca il flusso
      fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ragione_sociale: form.ragioneSociale,
          piva: form.piva,
          email: form.email,
          telefono: form.telefono,
          categorie: form.categorie,
          citta: form.citta,
        }),
      }).catch(() => {})

      setSubmitted(true)
    } catch {
      setSubmitError('Errore di connessione. Controlla la rete e riprova.')
    } finally {
      setLoading(false)
    }
  }

  // ─── SUCCESS ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Registrazione inviata!</h2>
        <p className="text-slate-600 mb-2 max-w-md mx-auto">
          Abbiamo ricevuto la tua richiesta per <strong>{form.ragioneSociale}</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          Il nostro team verificherà i tuoi dati entro 24–48 ore. Riceverai una email a{' '}
          <strong>{form.email}</strong> quando il profilo sarà attivo.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-3">
          <p className="text-sm font-semibold text-slate-700 mb-1">Prossimi passi:</p>
          {[
            'Verifichiamo P.IVA e dati aziendali',
            'Attiviamo il tuo profilo pubblico',
            'Inizi a ricevere richieste di preventivo',
            'Costruisci la tua reputazione con le recensioni',
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

  // ─── FORM ─────────────────────────────────────────────────────
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
              <span className={`text-sm font-medium hidden sm:block ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px w-6 sm:w-12 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1 — Specializzazione ── */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">In cosa sei specializzato?</h2>

          {/* Categorie (chip multi-select) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Briefcase className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Seleziona le tue specializzazioni <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const selected = form.categorie.includes(cat.slug)
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => toggleCategoria(cat.slug)}
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
            {form.categorie.length === 0 && (
              <p className="text-xs text-slate-400 mt-2">Seleziona almeno una specializzazione</p>
            )}
          </div>

          {/* Città */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Città principale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.citta}
              onChange={(e) => set('citta', e.target.value)}
              placeholder="Es. Milano..."
              list="cities-reg"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <datalist id="cities-reg">
              {CITIES.map((c) => <option key={c.slug} value={c.name} />)}
            </datalist>
          </div>

          {/* Raggio operativo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Raggio operativo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RAGGI.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set('raggio', r.value)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.raggio === r.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => setStep(2)} disabled={!step1Valid} size="lg" className="w-full">
            Continua <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {/* ── STEP 2 — Dati aziendali ── */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">I dati della tua azienda</h2>
          <p className="text-sm text-slate-500 -mt-2">
            Servono per la verifica del profilo. Non saranno visibili pubblicamente.
          </p>

          {/* Ragione sociale */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Building2 className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Nome / Ragione sociale <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.ragioneSociale}
              onChange={(e) => set('ragioneSociale', e.target.value)}
              placeholder="Es. Mario Rossi o Rossi Impianti SRL"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {/* P.IVA */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <FileCheck className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Partita IVA <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.piva}
              onChange={(e) => { set('piva', e.target.value); setPivaError('') }}
              onBlur={handlePivaBlur}
              placeholder="12345678901"
              maxLength={11}
              inputMode="numeric"
              className={`w-full px-4 py-3 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                pivaError ? 'border-red-400 bg-red-50' : 'border-slate-300'
              }`}
            />
            {pivaError && <p className="text-xs text-red-600 mt-1">{pivaError}</p>}
            {!pivaError && form.piva.length === 11 && validatePIVA(form.piva) && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> P.IVA valida
              </p>
            )}
          </div>

          {/* Forma giuridica */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Forma giuridica <span className="text-red-500">*</span>
            </label>
            <select
              value={form.formaGiuridica}
              onChange={(e) => set('formaGiuridica', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            >
              <option value="" disabled>Seleziona...</option>
              {FORME_GIURIDICHE.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Telefono */}
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

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Mail className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Email professionale <span className="text-red-500">*</span>
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

      {/* ── STEP 3 — Profilo ── */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-slate-900">Il tuo profilo pubblico</h2>
          <p className="text-sm text-slate-500 -mt-2">
            Questi dati saranno visibili ai clienti. Più è completo, più richieste ricevi.
          </p>

          {/* Anni esperienza */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <User className="w-4 h-4 inline mr-1.5 text-orange-500" />
              Anni di esperienza
            </label>
            <div className="flex flex-wrap gap-2">
              {ANNI_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => set('anniEsperienza', a)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.anniEsperienza === a
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {a} anni
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Presentazione <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Descrivi la tua azienda, le specializzazioni, i punti di forza e cosa ti distingue dagli altri. Es. &quot;Siamo un'impresa familiare specializzata in impianti fotovoltaici residenziali da oltre 10 anni. Tutti i nostri lavori sono garantiti e realizziamo le pratiche GSE per i clienti...&quot;"
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
            />
            <p className={`text-xs mt-1 ${form.bio.length < 30 && form.bio.length > 0 ? 'text-red-500' : 'text-slate-400'}`}>
              Minimo 30 caratteri ({form.bio.length}/30)
            </p>
          </div>

          {/* Telegram username (opzionale) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Username Telegram <span className="text-slate-400 font-normal">(opzionale)</span>
            </label>
            <input
              type="text"
              value={form.telegramUsername}
              onChange={(e) => set('telegramUsername', e.target.value)}
              placeholder="Es. @tuonome"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">
              Se lo inserisci, ti invieremo un messaggio su Telegram quando il profilo viene approvato.
            </p>
          </div>

          {submitError && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {submitError}
            </div>
          )}

          {/* Privacy */}
          <p className="text-xs text-slate-400 leading-relaxed">
            Registrandoti accetti i nostri{' '}
            <a href="/termini" className="underline hover:text-slate-600">Termini di Servizio</a> e la{' '}
            <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
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
                <>Completa Registrazione <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
