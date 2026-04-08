import type { Metadata } from 'next'
import { Shield, Users, Zap, Star, Handshake, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Chi Siamo — Maestranze',
  description:
    'Maestranze è il marketplace italiano che mette in contatto artigiani qualificati con le aziende che li cercano. Basta lavoro in nero e intermediari: talento e imprese si incontrano qui.',
  alternates: { canonical: `${SITE_URL}/chi-siamo` },
}

const VALUES = [
  {
    icon: Handshake,
    title: 'Connessione diretta',
    desc: 'Mettiamo in contatto artigiani e imprese senza intermediari. Il rapporto di lavoro nasce tra le persone giuste, nelle condizioni giuste.',
  },
  {
    icon: Shield,
    title: 'Professionisti verificati',
    desc: 'Ogni artigiano presente sulla piattaforma ha P.IVA attiva, esperienza documentata e referenze controllate. Nessuna sorpresa.',
  },
  {
    icon: Star,
    title: 'Reputazione trasparente',
    desc: 'Le recensioni vengono da aziende che hanno davvero lavorato con quel professionista. Niente stelle false, solo feedback reali.',
  },
  {
    icon: Zap,
    title: 'Velocità',
    desc: 'Un\'azienda pubblica la sua esigenza, un artigiano risponde. In pochi minuti parte una collaborazione che prima richiedeva settimane di ricerca.',
  },
  {
    icon: Users,
    title: 'Comunità di mestiere',
    desc: 'Sostenere l\'artigianato italiano significa dare agli artigiani strumenti digitali all\'altezza delle loro competenze. Questo è il nostro impegno.',
  },
  {
    icon: TrendingUp,
    title: 'Crescita concreta',
    desc: 'Più visibilità, più lavoro qualificato, meno tempo perso. Gli artigiani su Maestranze costruiscono una reputazione che li fa crescere nel tempo.',
  },
]

const NUMBERS = [
  { value: '10.000+', label: 'Artigiani registrati' },
  { value: '2.000+', label: 'Aziende attive' },
  { value: '300+', label: 'Città coperte' },
  { value: '4,8/5', label: 'Valutazione media' },
]

export default function ChiSiamoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-orange-500/15 text-orange-400 text-sm font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full mb-6 border border-orange-500/30">
            Il marketplace delle maestranze italiane
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Artigiani bravi.<br />
            <span className="text-orange-400">Aziende che li cercano.</span><br />
            Un solo posto.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Maestranze nasce per risolvere un problema reale: le aziende faticano a trovare artigiani
            qualificati, e gli artigiani bravi faticano a farsi trovare. Noi chiudiamo questo gap.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrati" className="inline-flex items-center justify-center font-semibold rounded-lg px-6 py-3 bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg">
              Sei un artigiano? Registrati
            </Link>
            <Link href="/richiedi-preventivo" className="inline-flex items-center justify-center font-semibold rounded-lg px-6 py-3 bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors">
              Cerchi maestranze? Inizia qui
            </Link>
          </div>
        </div>
      </section>

      {/* Missione */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-1 flex-shrink-0 bg-orange-500 rounded-full self-stretch min-h-[80px]" />
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">La nostra missione</h2>
              <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
                <p>
                  In Italia ci sono migliaia di artigiani straordinari — elettricisti, idraulici,
                  carpentieri, installatori, posatori — che lavorano con competenza e dedizione.
                  Eppure restano invisibili: nessun sito, nessuna presenza online, tutto affidato
                  al passaparola.
                </p>
                <p>
                  Dall&apos;altra parte ci sono imprese edili, general contractor, property manager
                  e privati che cercano continuamente maestranze affidabili. Spesso non riescono
                  a trovarle, e quando ci riescono è solo per fortuna o per conoscenza diretta.
                </p>
                <p>
                  <strong className="text-slate-900">Maestranze è il ponte che mancava.</strong>{' '}
                  Una piattaforma dove chi ha un mestiere si rende visibile, e chi ha lavoro da
                  assegnare trova le persone giuste — velocemente, in modo trasparente, senza
                  intermediari che si prendono una fetta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numeri */}
      <section className="bg-orange-500 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Maestranze in numeri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {NUMBERS.map((n) => (
              <div key={n.label}>
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{n.value}</div>
                <div className="text-sm text-orange-100 font-medium">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona per entrambi */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Due lati, un&apos;unica piattaforma</h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">Maestranze funziona per chi cerca lavoro e per chi offre lavoro, con strumenti pensati su misura per entrambi.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Artigiani */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Per gli artigiani</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Profilo professionale gratuito con specializzazioni e zone di lavoro</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Richieste di lavoro qualificate dalla propria area</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Sistema di recensioni che costruisce reputazione nel tempo</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Nessuna commissione sui lavori acquisiti</li>
              </ul>
              <Link href="/registrati" className="mt-6 inline-flex items-center font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                Registrati ora →
              </Link>
            </div>
            {/* Aziende */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                <Handshake className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Per le aziende</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Ricerca di artigiani per specializzazione e zona geografica</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Profili verificati con storico e recensioni reali</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Richiesta preventivo in pochi minuti</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Contatto diretto, senza intermediari</li>
              </ul>
              <Link href="/richiedi-preventivo" className="mt-6 inline-flex items-center font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                Trova un artigiano →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">I valori che ci guidano</h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">Non siamo una piattaforma generica. Siamo focalizzati sull&apos;artigianato italiano e sui valori che lo rendono grande.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center mb-4 border border-orange-100">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storia */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Come è nata l&apos;idea</h2>
          <div className="space-y-5 text-lg text-slate-300 leading-relaxed">
            <p>
              Maestranze nasce dall&apos;osservazione di un paradosso tutto italiano: un Paese con
              una tradizione artigianale tra le più forti al mondo, dove però artigiani e committenti
              faticano a trovarsi. Il problema non è la mancanza di talento — è la mancanza di
              un&apos;infrastruttura moderna che li faccia incontrare.
            </p>
            <p>
              Abbiamo costruito questa piattaforma con un principio chiaro: <span className="text-orange-400 font-semibold">la tecnologia deve servire il mestiere, non sostituirlo.</span>{' '}
              Un muratore, un saldatore, un posatore di pavimenti non ha bisogno di diventare un
              marketer digitale — ha bisogno che le aziende giuste lo trovino.
            </p>
            <p>
              Stiamo crescendo ogni giorno. Se sei un artigiano che vuole essere trovato, o
              un&apos;azienda che vuole smettere di cercare, sei nel posto giusto.
            </p>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Entra in Maestranze</h2>
          <p className="text-slate-500 mb-10 text-lg">
            Che tu abbia un mestiere da offrire o lavoro da assegnare, il tuo posto è qui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrati" className="inline-flex items-center justify-center font-semibold rounded-lg px-7 py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md text-base">
              Registrati come Artigiano
            </Link>
            <Link href="/richiedi-preventivo" className="inline-flex items-center justify-center font-semibold rounded-lg px-7 py-3.5 border-2 border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-500 transition-colors text-base">
              Cerca Maestranze
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
