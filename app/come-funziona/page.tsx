import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Shield, Star, Zap, Users,
  ClipboardList, MessageSquare, Hammer, UserPlus, FileCheck, TrendingUp,
  Search, BadgeCheck, Phone,
} from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Come Funziona Maestranze — Trova Professionisti o Lavora con Noi',
  description:
    'Scopri come funziona Maestranze: trova professionisti edili verificati in 3 passi oppure registra la tua attività e ricevi richieste di preventivo dalla tua zona.',
  alternates: { canonical: `${SITE_URL}/come-funziona` },
}

const CLIENT_STEPS = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Descrivi il tuo lavoro',
    desc: 'Inserisci il tipo di intervento, la città e qualche dettaglio. Bastano 2 minuti. Puoi indicare anche l\'urgenza e avere un\'idea del budget.',
    detail: ['Seleziona la categoria di servizio', 'Indica la tua città', 'Descrivi brevemente il lavoro', 'Scegli quando ti serve'],
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Ricevi i preventivi',
    desc: 'Entro 24 ore i professionisti verificati della tua zona ti contattano con un\'offerta personalizzata. Puoi ricevere fino a 3 preventivi diversi.',
    detail: ['I professionisti ti contattano direttamente', 'Confronti prezzi e profili in libertà', 'Leggi le recensioni di altri clienti', 'Fai domande prima di decidere'],
  },
  {
    icon: Hammer,
    step: '03',
    title: 'Scegli e inizia',
    desc: 'Scegli il professionista che ti convince di più e affida il lavoro. Nessun intermediario, nessuna commissione. Il contatto è diretto.',
    detail: ['Nessuna commissione sul lavoro', 'Contratto diretto col professionista', 'Lascia una recensione a fine lavoro', 'Supporto Maestranze in caso di problemi'],
  },
]

const PRO_STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Crea il tuo profilo',
    desc: 'Registrazione gratuita in 3 minuti. Inserisci le tue specializzazioni, la zona operativa, la P.IVA e una breve presentazione della tua attività.',
    detail: ['Profilo gratuito senza limiti di tempo', 'Scegli le specializzazioni e la zona', 'Carica foto dei tuoi lavori (presto)', 'Aggiungi certificazioni e qualifiche'],
  },
  {
    icon: Search,
    step: '02',
    title: 'Vieni trovato dai clienti',
    desc: 'Il tuo profilo appare nelle ricerche locali su Maestranze e su Google. I clienti nella tua zona ti trovano e ti inviano richieste di preventivo.',
    detail: ['Visibilità su Google per la tua zona', 'Richieste filtrate per categoria e città', 'Notifica immediata per ogni nuova richiesta', 'Gestisci tutto dalla dashboard'],
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Costruisci la tua reputazione',
    desc: 'Ogni lavoro completato può ricevere una recensione verificata. Più recensioni positive ottieni, più il tuo profilo sale nei risultati.',
    detail: ['Recensioni verificate (solo chi ha lavorato con te)', 'Badge "Top Rated" per i migliori professionisti', 'Statistiche di visualizzazioni e richieste', 'Piani premium per maggiore visibilità'],
  },
]

const VERIFICATION_STEPS = [
  {
    icon: FileCheck,
    title: 'Verifica P.IVA',
    desc: 'Controlliamo che la partita IVA sia attiva e regolare tramite i registri camerali.',
  },
  {
    icon: BadgeCheck,
    title: 'Certificazioni di settore',
    desc: 'Verifichiamo le abilitazioni richieste dalla legge (es. DM 37/08 per elettricisti, patentino per gas).',
  },
  {
    icon: Shield,
    title: 'Assicurazione RC',
    desc: 'Raccomandiamo la polizza RC professionale e la rendiamo visibile sul profilo.',
  },
  {
    icon: Star,
    title: 'Recensioni reali',
    desc: 'Solo i clienti che hanno effettivamente usato il servizio possono lasciare una recensione.',
  },
]

const FAQS = [
  {
    q: 'Quanto costa usare Maestranze come cliente?',
    a: 'Completamente gratuito. Non paghi nulla per ricevere preventivi, confrontare professionisti o contattarli. Il costo è solo quello del lavoro che concordi direttamente col professionista.',
  },
  {
    q: 'Quanto costa registrarsi come professionista?',
    a: 'La registrazione base è gratuita e senza limiti di tempo. Puoi ricevere richieste di preventivo gratuitamente. Offriamo piani premium a pagamento per chi vuole maggiore visibilità nei risultati di ricerca.',
  },
  {
    q: 'Come vengono verificati i professionisti?',
    a: 'Ogni professionista passa un processo di verifica: controllo P.IVA attiva, verifica delle certificazioni di settore obbligatorie (es. DM 37/08 per gli elettricisti) e, dove disponibile, verifica della polizza RC professionale.',
  },
  {
    q: 'Cosa succede se non sono soddisfatto del lavoro?',
    a: 'Maestranze facilita il contatto ma il contratto di lavoro è tra te e il professionista. In caso di controversie, il nostro team può supportarti con mediazione. Raccomandiamo sempre di richiedere un preventivo scritto prima di iniziare.',
  },
  {
    q: 'Posso usare Maestranze anche se non sono in una delle 30 città principali?',
    a: 'Sì. Puoi cercare professionisti in qualsiasi città italiana. I professionisti indicano il loro raggio operativo (es. entro 50 km), quindi un professionista di una città vicina potrebbe comunque coprirti.',
  },
  {
    q: 'Come faccio a sapere che un professionista è davvero bravo?',
    a: 'Puoi leggere le recensioni lasciate da altri clienti verificati, controllare il numero di lavori completati e gli anni di esperienza. Il badge "Top Rated" viene assegnato ai professionisti con valutazione media superiore a 4.7/5.',
  },
]

export default function ComeFunzionaPage() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Come funziona
            <span className="text-orange-400"> Maestranze</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Il marketplace che connette chi cerca un professionista edile verificato
            con chi offre competenza, qualità e affidabilità.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/richiedi-preventivo">
              <Button size="lg">Cerco un professionista <ArrowRight className="ml-2 w-5 h-5" /></Button>
            </Link>
            <Link href="/registrati">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Sono un professionista
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PER I CLIENTI ────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Per i Clienti</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
              Trova il professionista giusto in 3 passi
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Semplice, veloce e completamente gratuito. Nessun obbligo, preventivi in 24 ore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CLIENT_STEPS.map(({ icon: Icon, step, title, desc, detail }) => (
              <div key={step} className="relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-0 h-px bg-slate-200" style={{ width: 'calc(100% - 56px)', left: 'calc(50% + 28px)' }} />

                <div className="text-center mb-5">
                  <div className="relative inline-flex">
                    <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {step}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 text-center mb-3">{title}</h3>
                <p className="text-slate-500 text-sm text-center leading-relaxed mb-4">{desc}</p>

                <ul className="space-y-2">
                  {detail.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/richiedi-preventivo">
              <Button size="lg">
                Richiedi il tuo primo preventivo gratis <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ── PER I PROFESSIONISTI ─────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Per i Professionisti</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
              Fai crescere la tua attività
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Registrazione gratuita. Nessuna commissione sui lavori. Clienti qualificati nella tua zona.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRO_STEPS.map(({ icon: Icon, step, title, desc, detail }) => (
              <div key={step} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
                <ul className="space-y-2">
                  {detail.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/registrati">
              <Button size="lg" variant="secondary">
                Crea il tuo profilo gratis <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── VERIFICA ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Qualità garantita</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Come verifichiamo i professionisti
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Non basta registrarsi: ogni professionista su Maestranze passa un processo
                di verifica prima che il profilo diventi pubblico. Ci vogliono 24–48 ore,
                ma garantisce la qualità per tutti.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-slate-900 text-sm">Badge di Qualità</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  I professionisti con più di 10 recensioni verificate e una media superiore a 4.7/5
                  ottengono il badge <strong>"Top Rated"</strong> e appaiono in cima ai risultati
                  di ricerca per la loro zona.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VERIFICATION_STEPS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900">Domande frequenti</h2>
            <p className="text-slate-500 mt-2">Tutto quello che devi sapere su Maestranze.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-2 text-sm leading-snug">{q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINALE ───────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cliente */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <Users className="w-8 h-8 mb-3 text-orange-200" />
              <h3 className="text-xl font-extrabold mb-2">Cerchi un professionista?</h3>
              <p className="text-orange-100 text-sm leading-relaxed mb-5">
                Descrivi il lavoro e ricevi preventivi gratuiti da professionisti verificati
                nella tua zona entro 24 ore.
              </p>
              <Link href="/richiedi-preventivo">
                <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  Richiedi Preventivo Gratis <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <Zap className="w-8 h-8 mb-3 text-orange-200" />
              <h3 className="text-xl font-extrabold mb-2">Sei un professionista?</h3>
              <p className="text-orange-100 text-sm leading-relaxed mb-5">
                Crea il tuo profilo gratuito, fatti verificare e inizia a ricevere
                richieste di preventivo dalla tua zona.
              </p>
              <Link href="/registrati">
                <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  Registrati Gratis <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
          <p className="text-center text-orange-200 text-sm mt-8 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" />
            Hai domande? Scrivici a <a href="mailto:info@maestranze.com" className="underline hover:text-white">info@maestranze.com</a>
          </p>
        </div>
      </section>

    </div>
  )
}
