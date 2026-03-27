'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Briefcase, ChevronDown, Search, ArrowRight, Building2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'

type Job = {
  id: number
  titolo: string
  azienda: string
  citta: string
  provincia: string
  categoria: string
  tipo: 'Dipendente' | 'Subappalto' | 'Progetto'
  retribuzione?: string
  descrizione: string
  giorni: number
}

const JOBS: Job[] = [
  {
    id: 1,
    titolo: 'Elettricista qualificato per cantieri residenziali',
    azienda: 'Impianti Bianchi SRL',
    citta: 'Milano', provincia: 'MI',
    categoria: 'elettricista',
    tipo: 'Dipendente',
    retribuzione: '1.800€ – 2.400€/mese',
    descrizione: 'Cerchiamo elettricista con almeno 3 anni di esperienza su impianti civili e residenziali. Indispensabile patentino. Zona Milano nord.',
    giorni: 2,
  },
  {
    id: 2,
    titolo: 'Installatore impianti fotovoltaici',
    azienda: 'SolarTech Italia',
    citta: 'Roma', provincia: 'RM',
    categoria: 'fotovoltaico',
    tipo: 'Dipendente',
    retribuzione: '2.000€ – 2.800€/mese',
    descrizione: 'Installatore con esperienza su impianti fotovoltaici residenziali e commerciali. Necessaria certificazione CEI EN 50618. Auto aziendale inclusa.',
    giorni: 1,
  },
  {
    id: 3,
    titolo: 'Idraulico termoidraulico',
    azienda: 'Termoidraulica Esposito',
    citta: 'Napoli', provincia: 'NA',
    categoria: 'idraulico',
    tipo: 'Subappalto',
    retribuzione: '25€ – 35€/ora',
    descrizione: 'Cerchiamo idraulico per lavori in subappalto su cantieri privati. Preferibile esperienza su impianti di riscaldamento a pavimento e pompe di calore.',
    giorni: 4,
  },
  {
    id: 4,
    titolo: 'Muratore specializzato in ristrutturazioni',
    azienda: 'Edil Ferrari & C.',
    citta: 'Torino', provincia: 'TO',
    categoria: 'muratore',
    tipo: 'Dipendente',
    retribuzione: '1.600€ – 2.200€/mese',
    descrizione: 'Impresa edile cerca muratore per ristrutturazioni civili. Esperienza in intonaci, massetti e tamponamenti. Zona Torino e provincia.',
    giorni: 5,
  },
  {
    id: 5,
    titolo: 'Coordinatore lavori di ristrutturazione',
    azienda: 'RisturaCasa SRL',
    citta: 'Firenze', provincia: 'FI',
    categoria: 'ristrutturazione',
    tipo: 'Dipendente',
    retribuzione: '2.500€ – 3.200€/mese',
    descrizione: 'Cerchiamo un coordinatore tecnico per gestione cantieri di ristrutturazione residenziale. Diploma geometra o laurea ingegneria edile. Gestione pratiche CILA/SCIA.',
    giorni: 3,
  },
  {
    id: 6,
    titolo: 'Elettricista industriale per azienda manifatturiera',
    azienda: 'Meccanica Nord SpA',
    citta: 'Brescia', provincia: 'BS',
    categoria: 'elettricista',
    tipo: 'Dipendente',
    retribuzione: '2.200€ – 3.000€/mese',
    descrizione: 'Ricerchiamo elettricista industriale per manutenzione impianti in stabilimento produttivo. Esperienza con quadri BT, PLC e automazione industriale.',
    giorni: 6,
  },
  {
    id: 7,
    titolo: 'Installatore fotovoltaico + accumulo (batterie)',
    azienda: 'GreenPower Sud',
    citta: 'Bari', provincia: 'BA',
    categoria: 'fotovoltaico',
    tipo: 'Progetto',
    retribuzione: '200€ – 350€/giornata',
    descrizione: 'Collaborazione a progetto per installazione impianti fotovoltaici con sistema di accumulo. Lavori in Puglia e Basilicata. Patentino obbligatorio.',
    giorni: 1,
  },
  {
    id: 8,
    titolo: 'Idraulico per pronto intervento e manutenzioni',
    azienda: 'IdroPronto Bologna',
    citta: 'Bologna', provincia: 'BO',
    categoria: 'idraulico',
    tipo: 'Dipendente',
    retribuzione: '1.700€ – 2.300€/mese',
    descrizione: 'Idraulico per interventi di pronto intervento e manutenzione programmata su condomini e uffici. Disponibilità reperibilità. Furgone aziendale.',
    giorni: 8,
  },
  {
    id: 9,
    titolo: 'Muratore per cappotto termico e isolamenti',
    azienda: 'IsolaEdil SRL',
    citta: 'Verona', provincia: 'VR',
    categoria: 'muratore',
    tipo: 'Progetto',
    retribuzione: '180€ – 250€/giornata',
    descrizione: 'Cerchiamo muratori specializzati in posa cappotto termico (ETICS) per cantieri residenziali e condomini. Lavori legati a Ecobonus e Sismabonus.',
    giorni: 10,
  },
  {
    id: 10,
    titolo: 'Project manager ristrutturazioni luxury',
    azienda: 'PremiumHome Milano',
    citta: 'Milano', provincia: 'MI',
    categoria: 'ristrutturazione',
    tipo: 'Dipendente',
    retribuzione: '3.000€ – 4.500€/mese',
    descrizione: 'Ricerchiamo PM per gestione ristrutturazioni di pregio nel centro di Milano. Esperienza minima 5 anni, ottimo italiano e inglese. Gestione fornitori e clienti HNWI.',
    giorni: 2,
  },
  {
    id: 11,
    titolo: 'Elettricista domotica e smart home',
    azienda: 'SmartLiving Genova',
    citta: 'Genova', provincia: 'GE',
    categoria: 'elettricista',
    tipo: 'Subappalto',
    retribuzione: '28€ – 40€/ora',
    descrizione: 'Collaborazione per installazione sistemi domotici KNX/BTicino MyHome. Esperienza in impianti smart home e audio/video residenziali.',
    giorni: 7,
  },
  {
    id: 12,
    titolo: 'Termoidraulico pompe di calore',
    azienda: 'ClimaTech Venezia',
    citta: 'Venezia', provincia: 'VE',
    categoria: 'idraulico',
    tipo: 'Dipendente',
    retribuzione: '2.000€ – 2.700€/mese',
    descrizione: 'Installatore pompe di calore aria-acqua per sostituzione caldaie incentivata. Certificazione F-Gas e patentino caldaie richiesti. Zona Veneto.',
    giorni: 3,
  },
]

const TIPO_OPTIONS = ['Tutti', 'Dipendente', 'Subappalto', 'Progetto'] as const

const TIPO_COLORS: Record<string, string> = {
  Dipendente: 'bg-blue-100 text-blue-700',
  Subappalto: 'bg-purple-100 text-purple-700',
  Progetto: 'bg-green-100 text-green-700',
}

function daysLabel(n: number) {
  if (n === 1) return 'Oggi'
  if (n <= 3) return `${n} giorni fa`
  return `${n} giorni fa`
}

export default function JobBoard() {
  const [searchText, setSearchText] = useState('')
  const [filterCat, setFilterCat] = useState('tutte')
  const [filterTipo, setFilterTipo] = useState<string>('Tutti')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return JOBS.filter((job) => {
      const matchCat = filterCat === 'tutte' || job.categoria === filterCat
      const matchTipo = filterTipo === 'Tutti' || job.tipo === filterTipo
      const matchSearch =
        searchText === '' ||
        job.titolo.toLowerCase().includes(searchText.toLowerCase()) ||
        job.citta.toLowerCase().includes(searchText.toLowerCase()) ||
        job.azienda.toLowerCase().includes(searchText.toLowerCase())
      return matchCat && matchTipo && matchSearch
    })
  }, [searchText, filterCat, filterTipo])

  return (
    <div>
      {/* ── FILTRI ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca per ruolo, azienda o città..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div className="relative">
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="tutte">Tutte le categorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.nameShort}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Tipo contratto */}
            <div className="relative">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white cursor-pointer"
              >
                {TIPO_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t === 'Tutti' ? 'Tipo contratto' : t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── LISTA OFFERTE ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Colonna offerte (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-900">{filtered.length}</strong> offerte trovate
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nessuna offerta trovata</p>
                <p className="text-sm mt-1">Prova a modificare i filtri</p>
              </div>
            ) : (
              filtered.map((job) => {
                const cat = CATEGORIES.find((c) => c.slug === job.categoria)
                return (
                  <article
                    key={job.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                          {job.titolo}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{job.azienda}</span>
                        </div>
                      </div>
                      <span className="text-2xl flex-shrink-0">{cat?.icon}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TIPO_COLORS[job.tipo]}`}>
                        {job.tipo}
                      </span>
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {cat?.nameShort}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.citta} ({job.provincia})
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {daysLabel(job.giorni)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {job.descrizione}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      {job.retribuzione ? (
                        <span className="text-sm font-semibold text-slate-900">{job.retribuzione}</span>
                      ) : (
                        <span />
                      )}
                      <Link
                        href={`/lavoro/${job.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Candidati <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                )
              })
            )}
          </div>

          {/* Sidebar (1/3) */}
          <aside className="hidden lg:block space-y-5 sticky top-32">
            {/* CTA pubblica offerta */}
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-2">Cerchi personale?</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Pubblica un&apos;offerta di lavoro e raggiungi migliaia di professionisti qualificati
                nel settore edile.
              </p>
              <Link
                href="/pubblica-offerta"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors w-full"
              >
                Pubblica un&apos;Offerta <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-slate-500 text-center mt-2">Gratuito per i primi 3 annunci</p>
            </div>

            {/* Alert nuove offerte */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Ricevi nuove offerte via email</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Inserisci la tua email e ti avvisiamo quando escono annunci per la tua specializzazione.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="La tua email..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
                  Attiva Avvisi
                </button>
              </div>
            </div>

            {/* Registrati come pro */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-2 text-sm">Sei un professionista?</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Crea il tuo profilo e ricevi anche richieste dirette dai clienti.
              </p>
              <Link
                href="/registrati"
                className="flex items-center justify-center gap-2 border border-slate-300 hover:border-orange-400 text-slate-700 hover:text-orange-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all w-full"
              >
                Crea profilo gratis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
