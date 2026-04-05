'use client'

import { useState, useRef } from 'react'

const SPECIALIZZAZIONI = [
  'Elettricista',
  'Idraulico',
  'Muratore',
  'Cartongessista',
  'Piastrellista',
  'Imbianchino',
  'Installatore FV',
  'Altro',
]

const COMPENSI = [
  '€100-150/giorno',
  '€150-200/giorno',
  '€200-250/giorno',
  'Oltre €250/giorno',
  'Da concordare',
]

const TARIFFE = [
  '€100-150/giorno',
  '€150-200/giorno',
  '€200-250/giorno',
  'Oltre €250',
  'Non specificata',
]

const TIPI_INGAGGIO = ['Giornata', 'Settimana', 'Progetto', 'Valuto assunzione']
const TIPI_COLLABORAZIONE = ['Giornata', 'Settimana', 'Progetto']
const REQUISITI_LIST = ['DURC', 'Patentino', 'Attrezzatura propria', 'Certificazione sicurezza']

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (item: string) =>
    onChange(selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item])

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-sm text-slate-700">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  name: string
}) {
  return (
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-sm text-slate-700">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

const fieldClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1'

// ─── Form Imprese ─────────────────────────────────────────────────────────────

function FormImpresa() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [requisiti, setRequisiti] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const body = {
      tipo: 'request',
      nome: fd.get('nome') as string,
      email: fd.get('email') as string,
      telefono: fd.get('telefono') as string,
      specializzazione: fd.get('specializzazione') as string,
      zona_cantiere: fd.get('zona_cantiere') as string,
      periodo_da: fd.get('periodo_da') as string,
      periodo_a: fd.get('periodo_a') as string,
      tipo_ingaggio: fd.get('tipo_ingaggio') as string,
      compenso: fd.get('compenso') as string,
      requisiti,
    }

    try {
      const res = await fetch('/api/manodopera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? 'Errore server')
      }
      setSuccess(true)
      formRef.current?.reset()
      setRequisiti([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Richiesta pubblicata!</h3>
        <p className="text-slate-600 text-sm">Riceverai profili compatibili entro 48 ore.</p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Specializzazione cercata *</label>
        <select name="specializzazione" required className={fieldClass}>
          <option value="">Seleziona...</option>
          {SPECIALIZZAZIONI.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Zona cantiere *</label>
        <input name="zona_cantiere" required placeholder="es. Milano, Roma Nord..." className={fieldClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Da quando *</label>
          <input name="periodo_da" type="date" required className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>A quando *</label>
          <input name="periodo_a" type="date" required className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tipo ingaggio *</label>
        <select name="tipo_ingaggio" required className={fieldClass}>
          <option value="">Seleziona...</option>
          {TIPI_INGAGGIO.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Compenso offerto *</label>
        <select name="compenso" required className={fieldClass}>
          <option value="">Seleziona...</option>
          {COMPENSI.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Requisiti richiesti</label>
        <CheckboxGroup options={REQUISITI_LIST} selected={requisiti} onChange={setRequisiti} />
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div>
          <label className={labelClass}>Nome e cognome *</label>
          <input name="nome" required placeholder="Mario Rossi" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input name="email" type="email" required placeholder="mario@impresa.it" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Telefono *</label>
          <input name="telefono" required placeholder="+39 333 1234567" className={fieldClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Invio in corso...' : 'Pubblica la richiesta'}
      </button>
    </form>
  )
}

// ─── Form Artigiani ───────────────────────────────────────────────────────────

function FormArtigiano() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tipoCollab, setTipoCollab] = useState<string[]>([])
  const [attrezzatura, setAttrezzatura] = useState('')
  const [durc, setDurc] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const body = {
      tipo: 'availability',
      nome: fd.get('nome') as string,
      email: fd.get('email') as string,
      telefono: fd.get('telefono') as string,
      specializzazione: fd.get('specializzazione') as string,
      zona_operativa: fd.get('zona_operativa') as string,
      disponibile_da: fd.get('disponibile_da') as string,
      disponibile_a: fd.get('disponibile_a') as string,
      tipo_collaborazione: tipoCollab,
      tariffa: fd.get('tariffa') as string,
      attrezzatura_propria: attrezzatura === 'si',
      durc_valido: durc === 'si',
    }

    try {
      const res = await fetch('/api/manodopera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? 'Errore server')
      }
      setSuccess(true)
      formRef.current?.reset()
      setTipoCollab([])
      setAttrezzatura('')
      setDurc('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore imprevisto')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Disponibilità segnalata!</h3>
        <p className="text-slate-600 text-sm">Verrai contattato da imprese nella tua zona.</p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Specializzazione *</label>
        <select name="specializzazione" required className={fieldClass}>
          <option value="">Seleziona...</option>
          {SPECIALIZZAZIONI.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Zona operativa *</label>
        <input name="zona_operativa" required placeholder="es. Torino e provincia..." className={fieldClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Disponibile da *</label>
          <input name="disponibile_da" type="date" required className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Disponibile fino a *</label>
          <input name="disponibile_a" type="date" required className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tipo collaborazione accettata</label>
        <CheckboxGroup options={TIPI_COLLABORAZIONE} selected={tipoCollab} onChange={setTipoCollab} />
      </div>

      <div>
        <label className={labelClass}>Tariffa indicativa *</label>
        <select name="tariffa" required className={fieldClass}>
          <option value="">Seleziona...</option>
          {TARIFFE.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Hai attrezzatura propria? *</label>
        <RadioGroup
          name="attrezzatura"
          options={[{ label: 'Sì', value: 'si' }, { label: 'No', value: 'no' }]}
          value={attrezzatura}
          onChange={setAttrezzatura}
        />
      </div>

      <div>
        <label className={labelClass}>DURC in corso di validità? *</label>
        <RadioGroup
          name="durc"
          options={[{ label: 'Sì', value: 'si' }, { label: 'No', value: 'no' }]}
          value={durc}
          onChange={setDurc}
        />
      </div>

      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div>
          <label className={labelClass}>Nome e cognome *</label>
          <input name="nome" required placeholder="Marco Bianchi" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input name="email" type="email" required placeholder="marco@email.it" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Telefono *</label>
          <input name="telefono" required placeholder="+39 333 7654321" className={fieldClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !attrezzatura || !durc}
        className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Invio in corso...' : 'Segnala disponibilità'}
      </button>
    </form>
  )
}

// ─── Main page client ─────────────────────────────────────────────────────────

export default function ManodoperaClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Trova manodopera qualificata per il tuo cantiere —{' '}
            <span className="text-orange-400">o metti a frutto il tuo tempo libero</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#imprese"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Cerco artigiani
            </a>
            <a
              href="#artigiani"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Sono disponibile
            </a>
          </div>
          <p className="text-slate-400 text-sm">
            127 artigiani disponibili questa settimana · 34 cantieri cercano personale
          </p>
        </div>
      </section>

      {/* Sezione imprese */}
      <section id="imprese" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Per le imprese
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Sei un'impresa edile?</h2>
            <p className="text-slate-600">
              Hai un cantiere che parte e ti manca personale? Trova artigiani qualificati e verificati
              disponibili nella tua zona. Nessuna agenzia interinale, nessun costo per contatto.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <FormImpresa />
          </div>
        </div>
      </section>

      {/* Sezione artigiani */}
      <section id="artigiani" className="py-16 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Per gli artigiani
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Sei un artigiano?</h2>
            <p className="text-slate-600">
              Hai periodi con poco lavoro? Renditi disponibile e ricevi proposte da imprese verificate
              nella tua zona.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <FormArtigiano />
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">Come funziona</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Per le imprese */}
            <div>
              <h3 className="font-semibold text-orange-600 text-sm uppercase tracking-wide mb-6">Per le imprese</h3>
              <ol className="space-y-6">
                {[
                  { n: '1', title: 'Pubblica la richiesta', desc: 'Inserisci le tue esigenze: specializzazione, zona, periodo e compenso.' },
                  { n: '2', title: 'Ricevi profili compatibili entro 48 ore', desc: 'Ti contatteremo con artigiani verificati disponibili nella tua area.' },
                  { n: '3', title: 'Contatta direttamente', desc: 'Nessun intermediario: parla direttamente con i professionisti.' },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Per gli artigiani */}
            <div>
              <h3 className="font-semibold text-slate-600 text-sm uppercase tracking-wide mb-6">Per gli artigiani</h3>
              <ol className="space-y-6">
                {[
                  { n: '1', title: 'Segnala disponibilità', desc: 'Indica la tua specializzazione, zona e le date in cui sei libero.' },
                  { n: '2', title: 'Vieni contattato da imprese nella tua zona', desc: 'Le imprese ti troveranno e ti contatteranno direttamente.' },
                  { n: '3', title: 'Scegli la proposta', desc: 'Valuta le offerte e accetta solo quelle che ti interessano.' },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer legale */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed text-center">
            Maestranze è una piattaforma di matching che facilita il contatto tra professionisti e imprese.
            Il rapporto contrattuale è esclusivamente tra le parti. Maestranze non è un'agenzia per il lavoro
            ai sensi del D.Lgs. 276/2003 e non svolge attività di somministrazione, intermediazione o ricerca
            e selezione del personale.
          </p>
        </div>
      </footer>
    </div>
  )
}
