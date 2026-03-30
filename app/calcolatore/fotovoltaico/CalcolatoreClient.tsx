'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sun, Zap, Euro, TrendingDown, Battery, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'

// ─── Costanti di calcolo ──────────────────────────────────────────────────────
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
const PRODUZIONE_SUD   = 1350  // kWh/kWp/anno
const PRODUZIONE_CENTRO = 1200
const PRODUZIONE_NORD   = 1050
const COSTO_ENERGIA = 0.28     // €/kWh
const DETRAZIONE_IRPEF = 0.50  // 50%
const ANNI_DETRAZIONE = 10

type Zona = 'nord' | 'centro' | 'sud'

interface Risultato {
  produzione:     number   // kWh/anno
  risparmioAnno:  number   // €/anno
  costoLordo:     number   // €
  detrazioneAnno: number   // €/anno (rata annua)
  costoNetto:     number   // € (effettivo 10 anni)
  payback:        number   // anni
  risparmio25anni: number  // €
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

// ─── Componente ───────────────────────────────────────────────────────────────
export default function CalcolatoreClient() {
  const [potenza, setPotenza]   = useState('4.5')
  const [batteria, setBatteria] = useState('0')
  const [zona, setZona]         = useState<Zona>('nord')
  const [consumo, setConsumo]   = useState(3000)
  const [showDetails, setShowDetails] = useState(false)

  const r = calcola(potenza, batteria, zona, consumo)

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── FORM ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Configura il tuo impianto</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Potenza */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Potenza impianto
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: '3',   label: '3 kWp', sub: 'Appartamento' },
                { v: '4.5', label: '4,5 kWp', sub: 'Casa 80–100 mq' },
                { v: '6',   label: '6 kWp', sub: 'Villetta' },
                { v: '10',  label: '10 kWp', sub: 'Villa / azienda' },
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Sistema di accumulo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: '0',  label: 'Nessuna', sub: 'Solo fotovoltaico' },
                { v: '5',  label: '5 kWh', sub: '+ 3.500€' },
                { v: '10', label: '10 kWh', sub: '+ 6.000€' },
                { v: '15', label: '15 kWh', sub: '+ 9.000€' },
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

          {/* Zona geografica */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Zona geografica
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'nord'  as Zona, label: 'Nord Italia', sub: '~1.050 h sole' },
                { v: 'centro' as Zona, label: 'Centro Italia', sub: '~1.200 h sole' },
                { v: 'sud'  as Zona, label: 'Sud Italia', sub: '~1.350 h sole' },
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

          {/* Consumo annuo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Consumo annuo stimato
              <span className="ml-2 text-orange-600 font-extrabold">{consumo.toLocaleString('it-IT')} kWh</span>
            </label>
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={consumo}
              onChange={(e) => setConsumo(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1.000 kWh</span>
              <span className="text-slate-500 text-xs">
                (bolletta media ~{Math.round(consumo * COSTO_ENERGIA / 12)}€/mese)
              </span>
              <span>10.000 kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RISULTATI ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white mb-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Sun className="w-5 h-5 text-orange-400" />
          Risultati stimati per il tuo impianto
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Zap className="w-3.5 h-3.5" /> Produzione
            </div>
            <div className="text-2xl font-extrabold text-white">{r.produzione.toLocaleString('it-IT')}</div>
            <div className="text-xs text-slate-400">kWh/anno</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Euro className="w-3.5 h-3.5" /> Risparmio
            </div>
            <div className="text-2xl font-extrabold text-orange-400">{r.risparmioAnno.toLocaleString('it-IT')}€</div>
            <div className="text-xs text-slate-400">all'anno</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <TrendingDown className="w-3.5 h-3.5" /> Payback
            </div>
            <div className="text-2xl font-extrabold text-white">{r.payback}</div>
            <div className="text-xs text-slate-400">anni (con detraz.)</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <TrendingDown className="w-3.5 h-3.5" /> Guadagno 25 anni
            </div>
            <div className={`text-2xl font-extrabold ${r.risparmio25anni > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {r.risparmio25anni > 0 ? '+' : ''}{r.risparmio25anni.toLocaleString('it-IT')}€
            </div>
            <div className="text-xs text-slate-400">risparmio netto</div>
          </div>
        </div>

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
              <div className="font-bold">{r.costoLordo.toLocaleString('it-IT')}€</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Detrazione IRPEF 50% (rata/anno)</div>
              <div className="font-bold text-green-400">−{r.detrazioneAnno.toLocaleString('it-IT')}€/anno</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Costo netto effettivo</div>
              <div className="font-bold text-orange-400">{r.costoNetto.toLocaleString('it-IT')}€</div>
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
