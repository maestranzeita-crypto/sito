import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { SITE_DESCRIPTION } from '@/lib/utils'
import CategoryCard from '@/components/home/CategoryCard'
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


export default function HomePage() {
  return (
    <>
      <HomeJsonLd />

      {/* ─── B2B FULL-WIDTH SECTION ───────────────────────────── */}
      <section className="relative flex items-center justify-center text-white overflow-hidden py-16 md:py-24">
        {/* Immagine di sfondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/10202865/pexels-photo-10202865.jpeg)' }}
        />
        {/* Overlay scuro */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Contenuto */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Il cantiere non aspetta.<br className="sm:hidden" /> La squadra giusta nemmeno.
          </h2>
          <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Sei un&apos;impresa con un cantiere aperto e ti manca personale qualificato? Sei un artigiano con tempo libero e vuoi lavorare? Maestranze connette entrambi — senza agenzie, senza intermediari.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/manodopera" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors text-sm md:text-base">
                Sono un&apos;impresa
              </button>
            </Link>
            <Link href="/manodopera" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm md:text-base">
                Sono un artigiano
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xs sm:max-w-sm mx-auto">
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">48h</p>
              <p className="text-white/70 text-xs mt-1 leading-snug">per trovare un artigiano disponibile</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">100%</p>
              <p className="text-white/70 text-xs mt-1 leading-snug">professionisti con DURC verificato</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold">0€</p>
              <p className="text-white/70 text-xs mt-1 leading-snug">commissioni sui lavori</p>
            </div>
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

      {/* ─── NON BASTA REGISTRARSI ────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Non basta registrarsi.
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Ogni professionista su Maestranze viene verificato manualmente dal nostro team prima di essere visibile ai clienti.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: '01', title: 'P.IVA attiva', desc: 'Verifichiamo che la partita IVA sia attiva e intestata all\'azienda registrata.' },
              { n: '02', title: 'Documenti di settore', desc: 'Polizza RC, certificazioni specifiche — DM 37/08 per elettricisti, abilitazioni per installatori fotovoltaico, DURC per le imprese.' },
              { n: '03', title: 'Controllo manuale', desc: 'Una persona reale legge ogni richiesta. Se qualcosa non torna, chiediamo chiarimenti prima di attivare il profilo.' },
              { n: '04', title: 'Badge Verificato', desc: 'Solo dopo aver superato tutti i controlli il professionista riceve il badge Maestranze Verificato sul profilo pubblico.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-extrabold shadow-md">
                  {n}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/come-funziona" className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
              Scopri come funziona la verifica <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


{/* ─── COLLABORAZIONI ───────────────────────────────────── */}
      <section className="relative py-24 text-white overflow-hidden">
        {/* Immagine di sfondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/80" />
        {/* Contenuto */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wider">
            Collaborazioni
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Vuoi collaborare con noi?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Siamo aperti a partnership con associazioni di categoria, piattaforme di settore, media specializzati e realtà che condividono la nostra missione. Scrivici e valutiamo insieme.
          </p>
          <a
            href="mailto:info@maestranze.com"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base shadow-lg"
          >
            info@maestranze.com
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  )
}
