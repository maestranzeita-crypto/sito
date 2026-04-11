'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Home, Euro, Clock, CheckCircle2,
  AlertCircle, ChevronDown, TrendingDown, SlidersHorizontal, Lock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

// ─── Tipi ────────────────────────────────────────────────────────────────────
type Ambiente   = 'appartamento' | 'bagno' | 'cucina' | 'camera'
type Intervento = 'leggero' | 'medio' | 'completo'
type Finitura   = 'economica' | 'standard' | 'premium'
type Zona       = 'nord' | 'centro' | 'sud'

// ─── Config slider per ambiente ───────────────────────────────────────────────
const MQ_CONFIG: Record<Ambiente, { min: number; max: number; default: number; step: number }> = {
  appartamento: { min: 30, max: 250, default: 80, step: 5 },
  bagno:        { min: 3,  max: 25,  default: 7,  step: 1 },
  cucina:       { min: 8,  max: 40,  default: 14, step: 1 },
  camera:       { min: 10, max: 60,  default: 20, step: 5 },
}

// ─── Costi €/mq [min, max] ────────────────────────────────────────────────────
// Calibrati su medie di mercato italiane 2026
const COSTI: Record<Ambiente, Record<Intervento, [number, number]>> = {
  appartamento: { leggero: [100, 220], medio: [250, 520], completo: [520, 1000] },
  bagno:        { leggero: [220, 400], medio: [440, 800], completo: [800, 1500] },
  cucina:       { leggero: [180, 350], medio: [360, 650], completo: [650, 1100] },
  camera:       { leggero: [80,  160], medio: [200, 380], completo: [400, 750]  },
}

// Durata in settimane [min, max]
const DURATA: Record<Ambiente, Record<Intervento, [number, number]>> = {
  appartamento: { leggero: [2, 4],  medio: [4, 10],  completo: [10, 20] },
  bagno:        { leggero: [1, 2],  medio: [2, 5],   completo: [5, 10]  },
  cucina:       { leggero: [1, 2],  medio: [2, 5],   completo: [5, 10]  },
  camera:       { leggero: [1, 2],  medio: [2, 4],   completo: [4, 8]   },
}

// Voci di costo per il breakdown pro (% sul totale)
const BREAKDOWN_PERC: Record<Intervento, { label: string; perc: number }[]> = {
  leggero: [
    { label: 'Manodopera', perc: 45 },
    { label: 'Materiali e finiture', perc: 35 },
    { label: 'Ponteggi / attrezzatura', perc: 12 },
    { label: 'Smaltimento rifiuti', perc: 8 },
  ],
  medio: [
    { label: 'Impianti (elettrico/idraulico)', perc: 28 },
    { label: 'Manodopera muraria', perc: 22 },
    { label: 'Pavimenti e rivestimenti', perc: 25 },
    { label: 'Infissi e serramenti', perc: 15 },
    { label: 'Smaltimento e trasporto', perc: 10 },
  ],
  completo: [
    { label: 'Impianti (elettrico/idraulico)', perc: 22 },
    { label: 'Demolizioni e muratura', perc: 18 },
    { label: 'Manodopera specializzata', perc: 20 },
    { label: 'Pavimenti e rivestimenti', perc: 20 },
    { label: 'Infissi, porte e serramenti', perc: 12 },
    { label: 'Smaltimento e cantiere', perc: 8 },
  ],
}

const FINITURA_MULT: Record<Finitura, number> = {
  economica: 0.80,
  standard:  1.00,
  premium:   1.35,
}

const ZONA_MULT: Record<Zona, number> = {
  nord:   1.10,
  centro: 1.00,
  sud:    0.85,
}

const DETRAZIONE = 0.50
const ANNI_DETRAZIONE = 10

function calcola(ambiente: Ambiente, mq: number, intervento: Intervento, finitura: Finitura, zona: Zona) {
  const [baseMin, baseMax] = COSTI[ambiente][intervento]
  const mult = FINITURA_MULT[finitura] * ZONA_MULT[zona]
  const costoMqMin = Math.round(baseMin * mult)
  const costoMqMax = Math.round(baseMax * mult)
  const costoMin = Math.round(costoMqMin * mq)
  const costoMax = Math.round(costoMqMax * mq)
  const costoMedio = Math.round((costoMin + costoMax) / 2)
  const [durataMin, durataMax] = DURATA[ambiente][intervento]
  const detrazioneAnno = Math.round((costoMedio * DETRAZIONE) / ANNI_DETRAZIONE)
  const costoNettoMin = Math.round(costoMin * (1 - DETRAZIONE))
  const costoNettoMax = Math.round(costoMax * (1 - DETRAZIONE))
  const breakdown = BREAKDOWN_PERC[intervento].map(({ label, perc }) => ({
    label,
    min: Math.round(costoMin * perc / 100),
    max: Math.round(costoMax * perc / 100),
  }))
  return { costoMin, costoMax, costoMqMin, costoMqMax, costoMedio, durataMin, durataMax, detrazioneAnno, costoNettoMin, costoNettoMax, breakdown }
}

function fmt(n: number) { return n.toLocaleString('it-IT') }

// ─── Componente principale ────────────────────────────────────────────────────
export default function CalcolatoreRistrutturazioneClient() {
  const [ambiente, setAmbiente]     = useState<Ambiente>('appartamento')
  const [mq, setMq]                 = useState(MQ_CONFIG.appartamento.default)
  const [intervento, setIntervento] = useState<Intervento>('medio')
  const [finitura, setFinitura]     = useState<Finitura>('standard')
  const [zona, setZona]             = useState<Zona>('nord')
  const [showDetails, setShowDetails] = useState(false)

  // pro
  const [proMode, setProMode]       = useState(false)
  const [showProGate, setShowProGate] = useState(false)
  const [user, setUser]             = useState<User | null>(null)

  // Reset mq al valore di default quando cambia ambiente
  useEffect(() => {
    setMq(MQ_CONFIG[ambiente].default)
  }, [ambiente])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  function handleProClick() {
    if (user) { setProMode(true); setShowProGate(false) }
    else setShowProGate(true)
  }

  const cfg = MQ_CONFIG[ambiente]
  const r   = calcola(ambiente, mq, intervento, finitura, zona)

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── FORM BASE ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Configura la tua ristrutturazione</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Ambiente */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cosa vuoi ristrutturare?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { v: 'appartamento' as Ambiente, label: 'Appartamento', sub: 'Intera unità' },
                { v: 'bagno'        as Ambiente, label: 'Bagno',        sub: 'Solo bagno' },
                { v: 'cucina'       as Ambiente, label: 'Cucina',       sub: 'Solo cucina' },
                { v: 'camera'       as Ambiente, label: 'Camera / Soggiorno', sub: 'Singola stanza' },
              ]).map(({ v, label, sub }) => (
                <button key={v} onClick={() => setAmbiente(v)}
                  className={`rounded-xl border p-3 text-left transition-all ${ambiente === v ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400' : 'border-slate-200 hover:border-orange-300'}`}
                >
                  <div className="font-bold text-slate-900 text-sm">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Superficie — range dinamico per ambiente */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Superficie
              <span className="ml-2 text-orange-600 font-extrabold">{mq} mq</span>
            </label>
            <input
              type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={mq}
              onChange={(e) => setMq(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{cfg.min} mq</span>
              <span>{cfg.max} mq</span>
            </div>
          </div>

          {/* Tipo intervento */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo di intervento</label>
            <div className="flex flex-col gap-2">
              {([
                { v: 'leggero'  as Intervento, label: 'Leggero',  sub: 'Tinteggiatura, piccole riparazioni, pavimenti laminati' },
                { v: 'medio'    as Intervento, label: 'Medio',    sub: 'Pavimenti, rivestimenti, impianti parziali, infissi' },
                { v: 'completo' as Intervento, label: 'Completo', sub: 'Demolizione totale, impianti, muratura, finiture nuove' },
              ]).map(({ v, label, sub }) => (
                <button key={v} onClick={() => setIntervento(v)}
                  className={`rounded-xl border p-3 text-left transition-all ${intervento === v ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400' : 'border-slate-200 hover:border-orange-300'}`}
                >
                  <div className="font-bold text-slate-900 text-sm">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Finiture */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Qualità finiture</label>
              <div className="flex flex-col gap-2">
                {([
                  { v: 'economica' as Finitura, label: 'Economica', sub: 'Materiali base, funzionale' },
                  { v: 'standard'  as Finitura, label: 'Standard',  sub: 'Buona qualità, rapporto qualità/prezzo' },
                  { v: 'premium'   as Finitura, label: 'Premium',   sub: 'Materiali pregiati, design curato' },
                ]).map(({ v, label, sub }) => (
                  <button key={v} onClick={() => setFinitura(v)}
                    className={`rounded-xl border p-3 text-left transition-all ${finitura === v ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400' : 'border-slate-200 hover:border-orange-300'}`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{label}</div>
                    <div className="text-xs text-slate-500">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zona */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Zona geografica</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: 'nord'   as Zona, label: 'Nord',   sub: '+10% manodopera' },
                  { v: 'centro' as Zona, label: 'Centro', sub: 'Media naz.' },
                  { v: 'sud'    as Zona, label: 'Sud',    sub: '−15% manodopera' },
                ]).map(({ v, label, sub }) => (
                  <button key={v} onClick={() => setZona(v)}
                    className={`rounded-xl border p-3 text-left transition-all ${zona === v ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400' : 'border-slate-200 hover:border-orange-300'}`}
                  >
                    <div className="font-bold text-slate-900 text-xs">{label}</div>
                    <div className="text-xs text-slate-400">{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pulsante pro */}
        {!proMode && !showProGate && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex justify-center">
            <button onClick={handleProClick}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 border border-slate-200 hover:border-orange-300 rounded-xl px-5 py-2.5 transition-all hover:bg-orange-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Vedi dettaglio costi per categoria
            </button>
          </div>
        )}

        {/* Gate registrazione */}
        {showProGate && !proMode && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-extrabold text-slate-900 mb-1">Il dettaglio pro è riservato agli utenti registrati</p>
                <p className="text-sm text-slate-600">Scopri il breakdown preciso per categoria di lavoro: impianti, muratura, pavimenti, infissi e smaltimento. Registrati gratis.</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                <Link href="/registrati"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  Registrati gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={`/accedi?redirect=${encodeURIComponent('/calcolatore/ristrutturazione')}`}
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors bg-white"
                >
                  Hai già un account? Accedi
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BREAKDOWN PRO ──────────────────────────────────────── */}
      {proMode && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-500" />
              Dettaglio costi per categoria
            </h2>
            <button onClick={() => setProMode(false)} className="text-xs text-slate-400 hover:text-slate-600 underline">
              Nascondi
            </button>
          </div>
          <div className="space-y-3">
            {r.breakdown.map(({ label, min, max }) => {
              const pct = Math.round(((min + max) / 2) / r.costoMedio * 100)
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 font-medium">{label}</span>
                    <span className="font-bold text-slate-900">{fmt(min)}€ – {fmt(max)}€</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">Ripartizione indicativa basata su medie di mercato per intervento {intervento}.</p>
        </div>
      )}

      {/* ── RISULTATI ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white mb-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Home className="w-5 h-5 text-orange-400" />
          Stima per la tua ristrutturazione
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4 sm:col-span-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Euro className="w-3.5 h-3.5" /> Costo stimato
            </div>
            <div className="text-2xl font-extrabold text-orange-400">
              {fmt(r.costoMin)}€ – {fmt(r.costoMax)}€
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{fmt(r.costoMqMin)}–{fmt(r.costoMqMax)} €/mq</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5" /> Durata
            </div>
            <div className="text-2xl font-extrabold text-white">{r.durataMin}–{r.durataMax}</div>
            <div className="text-xs text-slate-400">settimane</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <TrendingDown className="w-3.5 h-3.5" /> Detrazione/anno
            </div>
            <div className="text-2xl font-extrabold text-green-400">{fmt(r.detrazioneAnno)}€</div>
            <div className="text-xs text-slate-400">IRPEF 50% × 10 anni</div>
          </div>
        </div>

        <button onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          {showDetails ? 'Nascondi dettaglio incentivi' : 'Mostra dettaglio incentivi'}
        </button>

        {showDetails && (
          <div className="bg-white/5 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Costo lordo medio</div>
              <div className="font-bold">{fmt(r.costoMedio)}€</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Detrazione IRPEF 50% (rata annua)</div>
              <div className="font-bold text-green-400">−{fmt(r.detrazioneAnno)}€/anno</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Costo netto effettivo</div>
              <div className="font-bold text-orange-400">{fmt(r.costoNettoMin)}€ – {fmt(r.costoNettoMax)}€</div>
            </div>
          </div>
        )}
      </div>

      {/* ── DISCLAIMER + CTA ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <div className="sm:col-span-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Stima indicativa.</strong> I valori sono basati su medie di mercato nazionali 2026 per zona geografica.
            Il costo reale dipende dalle condizioni dell'immobile, dai materiali scelti e dall'accessibilità del cantiere.
          </p>
        </div>
        <div className="sm:col-span-2 bg-orange-500 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-white font-bold text-sm mb-1">Vuoi un preventivo preciso?</div>
            <p className="text-orange-100 text-xs leading-relaxed mb-4">
              Ricevi fino a 3 preventivi gratuiti da imprese edili certificate nella tua zona.
            </p>
          </div>
          <Link href="/richiedi-preventivo?categoria=ristrutturazioni"
            className="flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Richiedi Preventivo Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── COSA INCLUDE ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-extrabold text-slate-900 mb-4">Cosa include il preventivo delle imprese su Maestranze</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Sopralluogo gratuito e rilievo misure',
            'Analisi dello stato dell\'immobile',
            'Computo metrico dettagliato',
            'Scelta dei materiali con campionatura',
            'Gestione pratiche comunali (CILA, SCIA)',
            'Coordinamento di tutti i subappaltatori',
            'Direzione lavori e sicurezza cantiere',
            'Garanzia su opere e manodopera',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
