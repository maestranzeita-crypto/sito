'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Sun, Zap, Euro, TrendingDown, Battery,
  CheckCircle2, AlertCircle, ChevronDown, Info, SlidersHorizontal,
} from 'lucide-react'

// ─── Costanti base ────────────────────────────────────────────────────────────
const PREZZI_KWP: Record<string, number> = {
  '3':   6000,
  '4.5': 8000,
  '6':   10000,
  '10':  14000,
}
const PREZZI_BATTERIA: Record<string, number> = {
  '0':  0,
  '5':  3500,
  '10': 6000,
  '15': 9000,
}
const PRODUZIONE_SUD    = 1350
const PRODUZIONE_CENTRO = 1200
const PRODUZIONE_NORD   = 1050
const COSTO_ENERGIA   = 0.28
const DETRAZIONE_IRPEF = 0.50
const ANNI_DETRAZIONE  = 10

type Zona = 'nord' | 'centro' | 'sud'
type ProfiloCsm = 'giorno' | 'fuori' | 'custom'

interface Risultato {
  produzione:      number
  risparmioAnno:   number
  costoLordo:      number
  detrazioneAnno:  number
  costoNetto:      number
  payback:         number
  risparmio25anni: number
}

interface RisultatoPro {
  produzioneNetta: number
  autoconsumata:   number
  ceduta:          number
  risparmioAnno:   number
  costoLordo:      number
  detrazioneAnno:  number
  costoNetto:      number
  payback:         number
  risparmio25anni: number
}

function calcola(potenza: string, batteria: string, zona: Zona, consumo: number): Risultato {
  const kWp = parseFloat(potenza)
  const prodMap: Record<Zona, number> = { nord: PRODUZIONE_NORD, centro: PRODUZIONE_CENTRO, sud: PRODUZIONE_SUD }
  const produzione = Math.round(kWp * prodMap[zona])
  const energiaUsata = Math.min(produzione, consumo * 0.60 + (parseFloat(batteria) > 0 ? consumo * 0.20 : 0))
  const risparmioAnno = Math.round(energiaUsata * COSTO_ENERGIA)
  const costoLordo = PREZZI_KWP[potenza] + PREZZI_BATTERIA[batteria]
  const detrazioneAnno = Math.round((costoLordo * DETRAZIONE_IRPEF) / ANNI_DETRAZIONE)
  const costoNetto = Math.round(costoLordo * (1 - DETRAZIONE_IRPEF))
  const annualNet = risparmioAnno + detrazioneAnno
  const payback = parseFloat((costoLordo / annualNet).toFixed(1))
  const risparmio25anni = Math.round(risparmioAnno * 25 - costoNetto)
  return { produzione, risparmioAnno, costoLordo, detrazioneAnno, costoNetto, payback, risparmio25anni }
}

// ─── Costanti pro ─────────────────────────────────────────────────────────────
const ORIENTAMENTI = [
  { v: 'sud',     label: 'Sud',               coeff: 1.00, sub: 'Ottimale' },
  { v: 'sud-est', label: 'Sud-Est / Sud-Ovest', coeff: 0.95, sub: '−5% produzione' },
  { v: 'est',     label: 'Est / Ovest',        coeff: 0.80, sub: '−20% produzione' },
  { v: 'nord-o',  label: 'Nord',               coeff: 0.65, sub: '−35% produzione' },
]

function calcolaPro(
  potenza: string,
  batteria: string,
  zona: Zona,
  consumo: number,
  coeffOrientamento: number,
  perdita: number,
  autoconsumoPerc: number,
  prezzoEn: number,
  ssp: boolean,
): RisultatoPro {
  const kWp = parseFloat(potenza)
  const prodMap: Record<Zona, number> = { nord: PRODUZIONE_NORD, centro: PRODUZIONE_CENTRO, sud: PRODUZIONE_SUD }
  const produzioneLorda = kWp * prodMap[zona]
  const produzioneNetta = Math.round(produzioneLorda * (1 - perdita / 100) * coeffOrientamento)
  const autoconsumata = Math.min(Math.round(produzioneNetta * (autoconsumoPerc / 100)), consumo)
  const ceduta = Math.max(0, produzioneNetta - autoconsumata)
  const risparmioAnno = Math.round(autoconsumata * prezzoEn + (ssp ? ceduta * 0.10 : 0))
  const costoLordo = PREZZI_KWP[potenza] + PREZZI_BATTERIA[batteria]
  const detrazioneAnno = Math.round((costoLordo * DETRAZIONE_IRPEF) / ANNI_DETRAZIONE)
  const costoNetto = Math.round(costoLordo * (1 - DETRAZIONE_IRPEF))
  const annualNet = risparmioAnno + detrazioneAnno
  const payback = parseFloat((costoLordo / annualNet).toFixed(1))
  const risparmio25anni = Math.round(risparmioAnno * 25 - costoNetto)
  return { produzioneNetta, autoconsumata, ceduta, risparmioAnno, costoLordo, detrazioneAnno, costoNetto, payback, risparmio25anni }
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="text-slate-400 hover:text-slate-600"
        aria-label="Info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 z-50 shadow-lg leading-relaxed">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────
export default function CalcolatoreClient() {
  const [potenza, setPotenza]   = useState('4.5')
  const [batteria, setBatteria] = useState('0')
  const [zona, setZona]         = useState<Zona>('nord')
  const [consumo, setConsumo]   = useState(3000)
  const [showDetails, setShowDetails] = useState(false)

  // pro state
  const [proMode, setProMode]           = useState(false)
  const [orientamento, setOrientamento] = useState('sud')
  const [perditaSistema, setPerditaSistema] = useState(15)
  const [autoconsumo, setAutoconsumo]   = useState(60)
  const [profiloCsm, setProfiloCsm]     = useState<ProfiloCsm>('giorno')
  const [prezzoEnergia, setPrezzoEnergia] = useState(0.28)
  const [ssp, setSsp]                   = useState(false)

  // auto-adjust autoconsumo quando cambia batteria o profilo (solo se non custom)
  useEffect(() => {
    if (profiloCsm === 'custom') return
    if (parseFloat(batteria) >= 5) {
      setAutoconsumo(75)
    } else if (profiloCsm === 'giorno') {
      setAutoconsumo(60)
    } else {
      setAutoconsumo(30)
    }
  }, [batteria, profiloCsm])

  const r    = calcola(potenza, batteria, zona, consumo)
  const coeffOrientamento = ORIENTAMENTI.find((o) => o.v === orientamento)?.coeff ?? 1.0
  const rPro = calcolaPro(potenza, batteria, zona, consumo, coeffOrientamento, perditaSistema, autoconsumo, prezzoEnergia, ssp)

  const disp = proMode
    ? { produzione: rPro.produzioneNetta, risparmioAnno: rPro.risparmioAnno, payback: rPro.payback, risparmio25anni: rPro.risparmio25anni, costoLordo: rPro.costoLordo, detrazioneAnno: rPro.detrazioneAnno, costoNetto: rPro.costoNetto }
    : r

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── FORM BASE ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Configura il tuo impianto</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Potenza */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Potenza impianto</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: '3',   label: '3 kWp',   sub: 'Appartamento' },
                { v: '4.5', label: '4,5 kWp', sub: 'Casa 80–100 mq' },
                { v: '6',   label: '6 kWp',   sub: 'Villetta' },
                { v: '10',  label: '10 kWp',  sub: 'Villa / azienda' },
              ].map(({ v, label, sub }) => (
                <button
                  key={v}
                  onClick={() => setPotenza(v)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    potenza === v
                      ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                      : 'border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{label}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Batteria */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sistema di accumulo</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: '0',  label: 'Nessuna', sub: 'Solo fotovoltaico' },
                { v: '5',  label: '5 kWh',   sub: '+ 3.500€' },
                { v: '10', label: '10 kWh',  sub: '+ 6.000€' },
                { v: '15', label: '15 kWh',  sub: '+ 9.000€' },
              ].map(({ v, label, sub }) => (
                <button
                  key={v}
                  onClick={() => setBatteria(v)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    batteria === v
                      ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                      : 'border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    {parseFloat(v) > 0 && <Battery className="w-3.5 h-3.5 text-orange-500" />}
                    {label}
                  </div>
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
                { v: 'nord'   as Zona, label: 'Nord Italia',   sub: '~1.050 h sole' },
                { v: 'centro' as Zona, label: 'Centro Italia', sub: '~1.200 h sole' },
                { v: 'sud'    as Zona, label: 'Sud Italia',    sub: '~1.350 h sole' },
              ]).map(({ v, label, sub }) => (
                <button
                  key={v}
                  onClick={() => setZona(v)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    zona === v
                      ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                      : 'border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs">{label}</div>
                  <div className="text-xs text-slate-400">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Consumo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Consumo annuo stimato
              <span className="ml-2 text-orange-600 font-extrabold">{consumo.toLocaleString('it-IT')} kWh</span>
            </label>
            <input
              type="range" min={1000} max={10000} step={500} value={consumo}
              onChange={(e) => setConsumo(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1.000 kWh</span>
              <span className="text-slate-500 text-xs">(bolletta media ~{Math.round(consumo * COSTO_ENERGIA / 12)}€/mese)</span>
              <span>10.000 kWh</span>
            </div>
          </div>
        </div>

        {/* Pulsante passa a pro */}
        {!proMode && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => setProMode(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 border border-slate-200 hover:border-orange-300 rounded-xl px-5 py-2.5 transition-all hover:bg-orange-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Passa al Calcolatore Professionale
            </button>
          </div>
        )}
      </div>

      {/* ── PARAMETRI PRO ──────────────────────────────────────── */}
      {proMode && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-500" />
              Parametri Professionali
            </h2>
            <button
              onClick={() => setProMode(false)}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Torna alla modalità base
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Orientamento tetto */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                Orientamento tetto
                <Tooltip text="L'orientamento del tetto influenza direttamente la produzione. Un impianto rivolto a Sud produce il massimo dell'energia, mentre l'orientamento Nord può ridurla fino al 35%." />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ORIENTAMENTI.map(({ v, label, sub }) => (
                  <button
                    key={v}
                    onClick={() => setOrientamento(v)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      orientamento === v
                        ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">{label}</div>
                    <div className="text-xs text-slate-400">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Perdita di sistema */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                Perdita di sistema
                <span className="ml-2 text-orange-600 font-extrabold">{perditaSistema}%</span>
                <Tooltip text="Include le perdite dell'inverter (~4%), i cavi (~2%), le ombre parziali e la degradazione dei pannelli (~0,5%/anno). Un sistema ben progettato ha perdite intorno al 14–16%." />
              </label>
              <input
                type="range" min={10} max={25} step={1} value={perditaSistema}
                onChange={(e) => setPerditaSistema(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10% (ottimale)</span>
                <span>25% (pessimistico)</span>
              </div>
            </div>

            {/* Profilo di consumo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                Profilo di consumo
                <Tooltip text="Determina quanta energia produci e consumi contemporaneamente. Se sei in casa di giorno autoconsumi di più; se sei assente di giorno autoconsumi meno. Con batteria il valore viene ottimizzato automaticamente." />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: 'giorno' as ProfiloCsm, label: 'In casa di giorno', sub: '~60% autoconsumo' },
                  { v: 'fuori'  as ProfiloCsm, label: 'Fuori di giorno',   sub: '~30% autoconsumo' },
                  { v: 'custom' as ProfiloCsm, label: 'Personalizzato',    sub: 'Imposta tu' },
                ]).map(({ v, label, sub }) => (
                  <button
                    key={v}
                    onClick={() => setProfiloCsm(v)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      profiloCsm === v
                        ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">{label}</div>
                    <div className="text-xs text-slate-400">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Percentuale autoconsumo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                Quota autoconsumo
                <span className="ml-2 text-orange-600 font-extrabold">{autoconsumo}%</span>
                <Tooltip text="Percentuale dell'energia prodotta che consumi direttamente, evitando di comprarla dalla rete. Con batteria da 5 kWh questo valore arriva tipicamente al 70–80%." />
              </label>
              <input
                type="range" min={20} max={90} step={5} value={autoconsumo}
                onChange={(e) => { setProfiloCsm('custom'); setAutoconsumo(parseInt(e.target.value)) }}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>20%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Prezzo energia */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                Prezzo energia acquistata
                <Tooltip text="Costo del kWh che paghi in bolletta (tutto incluso: materia energia + oneri di rete + tasse). Verifica la tua bolletta: varia tra 0,20 e 0,45 €/kWh. Default: 0,28 €/kWh (media nazionale 2024)." />
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0.15} max={0.50} step={0.01}
                  value={prezzoEnergia}
                  onChange={(e) => setPrezzoEnergia(Math.max(0.15, Math.min(0.50, parseFloat(e.target.value) || 0.28)))}
                  className="w-28 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span className="text-sm text-slate-500">€/kWh</span>
                <button
                  onClick={() => setPrezzoEnergia(0.28)}
                  className="text-xs text-orange-600 hover:text-orange-700 underline"
                >
                  Reset
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Min 0,15 · Max 0,50 €/kWh</p>
            </div>

            {/* SSP */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                Scambio Sul Posto (SSP)
                <Tooltip text="Il meccanismo di Scambio Sul Posto (GSE) valorizza l'energia che immetti in rete a ~0,10 €/kWh. Si applica agli impianti fino a 500 kW non soggetti ad altri incentivi. Consigliato per impianti con bassa autosufficienza." />
              </label>
              <button
                onClick={() => setSsp(!ssp)}
                className={`flex items-center gap-3 w-full rounded-xl border p-4 text-left transition-all ${
                  ssp
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-400'
                    : 'border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${ssp ? 'bg-orange-500' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${ssp ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{ssp ? 'SSP attivo' : 'SSP non attivo'}</div>
                  <div className="text-xs text-slate-500">{ssp ? 'Energia ceduta valorizzata a +0,10 €/kWh' : 'Energia ceduta non valorizzata'}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RISULTATI ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white mb-6">
        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
          <Sun className="w-5 h-5 text-orange-400" />
          Risultati stimati per il tuo impianto
        </h2>
        {proMode && (
          <p className="text-xs text-orange-300 mb-5">Calcolo avanzato · orientamento + perdite + autoconsumo personalizzato</p>
        )}
        {!proMode && <div className="mb-5" />}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Zap className="w-3.5 h-3.5" />
              {proMode ? 'Produzione netta' : 'Produzione'}
            </div>
            <div className="text-2xl font-extrabold text-white">{disp.produzione.toLocaleString('it-IT')}</div>
            <div className="text-xs text-slate-400">kWh/anno</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Euro className="w-3.5 h-3.5" /> Risparmio
            </div>
            <div className="text-2xl font-extrabold text-orange-400">{disp.risparmioAnno.toLocaleString('it-IT')}€</div>
            <div className="text-xs text-slate-400">all'anno</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <TrendingDown className="w-3.5 h-3.5" /> Payback
            </div>
            <div className="text-2xl font-extrabold text-white">{disp.payback}</div>
            <div className="text-xs text-slate-400">anni (con detraz.)</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <TrendingDown className="w-3.5 h-3.5" /> Guadagno 25 anni
            </div>
            <div className={`text-2xl font-extrabold ${disp.risparmio25anni > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {disp.risparmio25anni > 0 ? '+' : ''}{disp.risparmio25anni.toLocaleString('it-IT')}€
            </div>
            <div className="text-xs text-slate-400">risparmio netto</div>
          </div>
        </div>

        {/* Metriche extra pro */}
        {proMode && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Energia autoconsumata</div>
              <div className="font-bold text-white">{rPro.autoconsumata.toLocaleString('it-IT')} kWh</div>
              <div className="text-xs text-slate-500">{Math.round(rPro.autoconsumata / rPro.produzioneNetta * 100)}% della produzione</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Energia ceduta alla rete</div>
              <div className="font-bold text-white">{rPro.ceduta.toLocaleString('it-IT')} kWh</div>
              {ssp && <div className="text-xs text-green-400">+{Math.round(rPro.ceduta * 0.10).toLocaleString('it-IT')}€/anno via SSP</div>}
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Copertura del fabbisogno</div>
              <div className="font-bold text-white">{Math.min(100, Math.round(rPro.autoconsumata / consumo * 100))}%</div>
              <div className="text-xs text-slate-500">dei {consumo.toLocaleString('it-IT')} kWh annui</div>
            </div>
          </div>
        )}

        {/* Dettaglio costi */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          {showDetails ? 'Nascondi dettaglio costi' : 'Mostra dettaglio costi'}
        </button>

        {showDetails && (
          <div className="bg-white/5 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Costo impianto lordo</div>
              <div className="font-bold">{disp.costoLordo.toLocaleString('it-IT')}€</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Detrazione IRPEF 50% (rata/anno)</div>
              <div className="font-bold text-green-400">−{disp.detrazioneAnno.toLocaleString('it-IT')}€/anno</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Costo netto effettivo</div>
              <div className="font-bold text-orange-400">{disp.costoNetto.toLocaleString('it-IT')}€</div>
            </div>
          </div>
        )}
      </div>

      {/* ── DISCLAIMER + CTA ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <div className="sm:col-span-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Stima indicativa.</strong> I valori sono basati su medie nazionali (prezzi energia 0,28 €/kWh, irraggiamento medio per zona). Il calcolo preciso dipende dall'orientamento del tetto, dalle ombre, dal tipo di pannelli e dal tuo contratto energetico. Richiedi un preventivo reale per avere un'analisi personalizzata.
          </p>
        </div>
        <div className="sm:col-span-2 bg-orange-500 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-white font-bold text-sm mb-1">Vuoi un preventivo preciso?</div>
            <p className="text-orange-100 text-xs leading-relaxed mb-4">
              Ricevi fino a 3 preventivi gratuiti da installatori certificati nella tua zona.
            </p>
          </div>
          <Link
            href="/richiedi-preventivo?categoria=fotovoltaico"
            className="flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            Richiedi Preventivo Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── COSA INCLUDE IL PREVENTIVO ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-extrabold text-slate-900 mb-4">Cosa include il preventivo degli installatori su Maestranze</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Sopralluogo gratuito e analisi del tetto',
            'Dimensionamento ottimale dell\'impianto',
            'Scelta dei pannelli (monocristallino, bifacciale)',
            'Inverter e sistema di monitoraggio',
            'Struttura di montaggio e cablaggio',
            'Pratiche GSE e connessione alla rete',
            'Dichiarazione di conformità (CEI EN 50618)',
            'Garanzia su prodotti e installazione',
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
