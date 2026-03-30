import type { Metadata } from 'next'
import { Shield, Users, Zap, Heart, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Chi Siamo — Maestranze',
  description:
    'Maestranze è il marketplace italiano che mette in contatto clienti e professionisti edili verificati. Scopri la nostra missione e i valori che ci guidano.',
  alternates: { canonical: `${SITE_URL}/chi-siamo` },
}

const VALUES = [
  {
    icon: Shield,
    title: 'Fiducia',
    desc: 'Verifichiamo ogni professionista prima che appaia sul portale: P.IVA attiva, abilitazioni di settore e assicurazione RC professionale.',
  },
  {
    icon: Zap,
    title: 'Semplicità',
    desc: 'Trovare un bravo professionista o ricevere nuovi clienti non deve essere complicato. Bastano pochi minuti, da qualsiasi dispositivo.',
  },
  {
    icon: Heart,
    title: 'Comunità',
    desc: 'Sosteniamo le piccole imprese e gli artigiani italiani, dando loro gli stessi strumenti digitali delle grandi aziende.',
  },
  {
    icon: Target,
    title: 'Trasparenza',
    desc: 'Nessuna commissione nascosta sui lavori. I prezzi sono concordati direttamente tra cliente e professionista, senza intermediari.',
  },
  {
    icon: Users,
    title: 'Qualità',
    desc: 'Le recensioni verificate e il sistema di reputazione garantiscono che solo i migliori professionisti emergano nelle ricerche.',
  },
  {
    icon: TrendingUp,
    title: 'Crescita',
    desc: 'Aiutiamo i professionisti a costruire la propria reputazione online e ad acquisire nuovi clienti in modo costante e misurabile.',
  },
]

const NUMBERS = [
  { value: '10.000+', label: 'Professionisti registrati' },
  { value: '50.000+', label: 'Richieste gestite' },
  { value: '300+', label: 'Città coperte' },
  { value: '4,8/5', label: 'Valutazione media' },
]

export default function ChiSiamoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Il marketplace edile <span className="text-orange-400">fatto in Italia</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            Maestranze nasce per risolvere un problema concreto: trovare un professionista affidabile
            per la propria casa è difficile. Noi lo rendiamo semplice, veloce e trasparente.
          </p>
        </div>
      </section>

      {/* Missione */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">La nostra missione</h2>
        <div className="prose prose-slate prose-lg max-w-none">
          <p>
            Il settore edile e impiantistico italiano vale decine di miliardi di euro l&apos;anno, eppure
            trovare un elettricista, un idraulico o un installatore fotovoltaico affidabile resta
            ancora oggi un processo faticoso, basato sul passaparola e sulla fortuna.
          </p>
          <p>
            Maestranze è nato per cambiare questo. Siamo una piattaforma digitale che mette in
            contatto diretto clienti e professionisti verificati, eliminando l&apos;incertezza da
            entrambi i lati: il cliente sa con chi ha a che fare, il professionista riceve richieste
            qualificate dalla propria zona.
          </p>
          <p>
            Non siamo un&apos;agenzia di intermediazione: non prendiamo commissioni sui lavori e non
            ci interponiamo nella trattativa. Siamo uno strumento — semplice, trasparente e gratuito
            per chi cerca, accessibile per chi lavora.
          </p>
        </div>
      </section>

      {/* Numeri */}
      <section className="bg-orange-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Maestranze in numeri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {NUMBERS.map((n) => (
              <div key={n.label}>
                <div className="text-4xl font-extrabold text-orange-500 mb-2">{n.value}</div>
                <div className="text-sm text-slate-600">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">I nostri valori</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storia */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">La nostra storia</h2>
          <div className="prose prose-slate prose-lg max-w-none">
            <p>
              Maestranze è un progetto italiano, creato da chi conosce il settore dall&apos;interno.
              L&apos;idea è nata dall&apos;esperienza diretta delle difficoltà incontrate sia dai
              privati che cercano professionisti fidati, sia dagli artigiani che faticano a farsi
              trovare online pur avendo anni di esperienza e ottime referenze.
            </p>
            <p>
              Abbiamo costruito Maestranze con un principio guida: la tecnologia deve semplificare,
              non complicare. Per questo la piattaforma è pensata per essere intuitiva anche per chi
              non è abituato agli strumenti digitali — dal muratore che gestisce tutto dal cellulare
              al pensionato che deve ristrutturare il bagno.
            </p>
            <p>
              Siamo ancora all&apos;inizio, ma cresciamo ogni giorno. Se vuoi far parte di questa
              comunità — come professionista o come cliente — sei nel posto giusto.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Unisciti a Maestranze</h2>
          <p className="text-slate-600 mb-8">
            Sei un professionista? Registrati gratis e inizia a ricevere richieste dalla tua zona.
            Cerchi qualcuno? Richiedi un preventivo in 2 minuti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrati" className="inline-flex items-center justify-center font-semibold rounded-lg px-5 py-2.5 bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md">Registrati come Professionista</Link>
            <Link href="/richiedi-preventivo" className="inline-flex items-center justify-center font-semibold rounded-lg px-5 py-2.5 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors">Richiedi un Preventivo</Link>
          </div>
        </div>
      </section>
    </>
  )
}
