import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Star, Shield, Zap, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import { SITE_DESCRIPTION } from '@/lib/utils'
import CategoryCard from '@/components/home/CategoryCard'
import HomeSearchForm from '@/components/home/HomeSearchForm'
import { CATEGORIES } from '@/lib/categories'

export const metadata: Metadata = {
  title: 'Maestranze — Trova Professionisti Edili e Impiantistici Verificati in Italia',
  description: SITE_DESCRIPTION,
  alternates: { canonical: 'https://maestranze.com' },
}

// Schema.org JSON-LD
function HomeJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Maestranze',
          url: 'https://maestranze.com',
          description: SITE_DESCRIPTION,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://maestranze.com/cerca?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  )
}


const HOW_IT_WORKS_CLIENT = [
  {
    step: '01',
    title: 'Descrivi il tuo lavoro',
    desc: 'Inserisci il tipo di intervento, la città e alcuni dettagli. Bastano 2 minuti.',
  },
  {
    step: '02',
    title: 'Ricevi preventivi',
    desc: 'I professionisti verificati della tua zona ti inviano offerte entro 24 ore.',
  },
  {
    step: '03',
    title: 'Scegli e inizia',
    desc: 'Confronta profili, recensioni e prezzi. Affida il lavoro con fiducia.',
  },
]

const HOW_IT_WORKS_PRO = [
  {
    step: '01',
    title: 'Crea il tuo profilo',
    desc: 'Registrazione gratuita. Carica certificazioni, foto dei lavori e descrizione.',
  },
  {
    step: '02',
    title: 'Ricevi richieste',
    desc: 'I clienti nella tua zona ti trovano in base alla specializzazione.',
  },
  {
    step: '03',
    title: 'Fai crescere il business',
    desc: 'Gestisci preventivi, raccogli recensioni e aumenta la tua visibilità online.',
  },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Verificati sul serio',
    desc: 'Ogni professionista viene controllato manualmente. P.IVA attiva, polizza RC, certificazioni di settore. Non basta registrarsi.',
  },
  {
    icon: Zap,
    title: 'Zero commissioni',
    desc: 'I professionisti non pagano per ogni contatto ricevuto. Solo un abbonamento opzionale se vogliono più visibilità.',
  },
  {
    icon: Star,
    title: 'Solo edilizia e fotovoltaico',
    desc: 'Non siamo un portale generalista. Conosciamo il settore, i suoi standard e le certificazioni specifiche — dal DM 37/08 al CEI 82-25.',
  },
  {
    icon: TrendingUp,
    title: 'Per privati e imprese',
    desc: 'Trova l\'installatore fotovoltaico per casa tua, o trova manodopera qualificata per il tuo cantiere. Una sola piattaforma.',
  },
]

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 25%, #f97316 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Trova il professionista
              <span className="text-orange-400"> giusto </span>
              per la tua casa
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Elettricisti, idraulici, muratori, installatori fotovoltaico e molto altro.
              Professionisti verificati, preventivi gratuiti, recensioni reali.
            </p>

            {/* Search box */}
            <HomeSearchForm />

            <p className="mt-4 text-sm text-slate-400">
              ✓ Gratuito per i clienti &nbsp;·&nbsp; ✓ Nessun obbligo &nbsp;·&nbsp; ✓ Preventivi in 24h
            </p>
          </div>
        </div>
      </section>


      {/* ─── CATEGORIE SERVIZI ────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              I nostri servizi
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Dal fotovoltaico alla ristrutturazione completa. Professionisti specializzati per ogni esigenza.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── MANODOPERA PROMO ─────────────────────────────────── */}
      <section className="py-20" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonna sinistra */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Hai un cantiere che parte e ti manca personale?
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Trova artigiani qualificati e disponibili nella tua zona in 48 ore. Senza agenzie, senza intermediari, senza costi per contatto.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Installatori fotovoltaico, elettricisti, idraulici, muratori e cartongessisti pronti a lavorare',
                  'DURC in corso di validità e certificazioni sicurezza verificate',
                  'Disponibili anche per una sola giornata o settimana',
                  'Ogni collaborazione viene recensita da entrambe le parti',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/manodopera">
                  <Button size="lg">Cerca un artigiano</Button>
                </Link>
                <Link href="/manodopera">
                  <Button size="lg" variant="outline" className="border-slate-800 text-slate-800 hover:bg-slate-900 hover:text-white">
                    Pubblica una richiesta
                  </Button>
                </Link>
              </div>
            </div>
            {/* Colonna destra — card stats */}
            <div className="flex flex-col gap-4">
              {[
                { stat: '48 ore', desc: 'Tempo medio per trovare un artigiano disponibile nella tua zona' },
                { stat: 'Verificati', desc: 'P.IVA attiva, DURC e certificazioni controllate prima dell\'attivazione' },
                { stat: 'Zero commissioni', desc: 'Paghi solo se vuoi più visibilità — nessuna percentuale sui lavori' },
              ].map(({ stat, desc }) => (
                <div key={stat} className="flex items-start gap-4 bg-white border border-slate-200 rounded-2xl p-6 border-l-4 border-l-orange-500">
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 mb-1">{stat}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── COME FUNZIONA — CLIENTI ──────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Per i Clienti</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">
              Trova il professionista in 3 passi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_CLIENT.map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-extrabold shadow-md">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/richiedi-preventivo">
              <Button size="lg">
                Richiedi Preventivo Gratis <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PER I PROFESSIONISTI ─────────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Per i Professionisti</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                Fai crescere la tua attività con Maestranze
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Connettiti con migliaia di clienti alla ricerca di professionisti come te.
                Profilo gratuito, nessuna commissione sui lavori.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Profilo verificato con badge di qualità',
                  'Clienti qualificati nella tua zona',
                  'Gestione preventivi e comunicazione',
                  'Bacheca offerte di lavoro per dipendenti',
                  'Statistiche e analisi del tuo profilo',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/registrati">
                  <Button size="lg">Registrati Gratis</Button>
                </Link>
                <Link href="/come-funziona">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Scopri di più
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {HOW_IT_WORKS_PRO.map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PER CHI CERCA LAVORO ─────────────────────────────── */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Bacheca Lavoro</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Cerchi lavoro nel settore edile?
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Imprese ed artigiani pubblicano offerte di lavoro ogni giorno. Trova posizioni da elettricista,
              idraulico, muratore, operaio specializzato e molto altro.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/lavoro">
                <Button size="lg" variant="secondary">
                  Vedi le Offerte di Lavoro <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pubblica-offerta">
                <Button size="lg" variant="outline">
                  Pubblica un&apos;Offerta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PERCHÉ SCEGLIERE MAESTRANZE ──────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Perché scegliere Maestranze
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Qualità, affidabilità e trasparenza in ogni fase del lavoro.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINALE ───────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Pronto a iniziare?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Unisciti a migliaia di clienti e professionisti che si sono già affidati a Maestranze.
            È gratuito e ci vogliono solo 2 minuti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/richiedi-preventivo">
              <Button size="lg" variant="secondary">
                Richiedi un Preventivo
              </Button>
            </Link>
            <Link href="/registrati">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 shadow-md"
              >
                Sei un Professionista? Registrati
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
