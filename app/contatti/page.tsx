import type { Metadata } from 'next'
import { Mail, Clock, HelpCircle, Briefcase, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contatti — Maestranze',
  description:
    'Hai domande su Maestranze? Contattaci per assistenza, segnalazioni o collaborazioni. Rispondiamo entro 24 ore lavorative.',
  alternates: { canonical: `${SITE_URL}/contatti` },
}

const TOPICS = [
  {
    icon: HelpCircle,
    title: 'Assistenza clienti',
    desc: 'Hai problemi con il tuo account, una richiesta di preventivo o una recensione? Scrivici e ti aiutiamo.',
    email: 'supporto@maestranze.com',
  },
  {
    icon: Briefcase,
    title: 'Per i professionisti',
    desc: 'Domande sul profilo, la dashboard o i piani premium? Il nostro team dedicato ai professionisti è a disposizione.',
    email: 'professionisti@maestranze.com',
  },
  {
    icon: AlertCircle,
    title: 'Segnalazioni',
    desc: 'Hai riscontrato un comportamento scorretto o un problema tecnico? Segnalacelo immediatamente.',
    email: 'segnalazioni@maestranze.com',
  },
]

export default function ContattiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Contattaci
          </h1>
          <p className="text-lg text-slate-300">
            Siamo qui per aiutarti. Rispondiamo entro 24 ore lavorative.
          </p>
        </div>
      </section>

      {/* Canali di contatto */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOPICS.map(({ icon: Icon, title, desc, email }) => (
              <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center mb-4 border border-orange-100">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{desc}</p>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tempi di risposta */}
      <section className="bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0 border border-orange-500/20">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Tempi di risposta</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Il nostro team risponde entro <strong>24 ore lavorative</strong> (lunedì–venerdì, 9:00–18:00).
              Per le segnalazioni urgenti relative a comportamenti scorretti, ci impegniamo a intervenire
              entro 4 ore durante l&apos;orario di lavoro.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ rapida */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Domande frequenti</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Come posso eliminare il mio account?',
                a: 'Scrivici a supporto@maestranze.com dalla email associata all\'account. Provvederemo alla cancellazione entro 7 giorni lavorativi.',
              },
              {
                q: 'Come posso segnalare una recensione falsa?',
                a: 'Scrivici a segnalazioni@maestranze.com indicando l\'URL del profilo e i motivi della segnalazione. Analizziamo ogni caso singolarmente.',
              },
              {
                q: 'Offrite piani a pagamento per i professionisti?',
                a: 'Attualmente la piattaforma è gratuita. I piani premium per maggiore visibilità sono in fase di sviluppo. Puoi scrivere a professionisti@maestranze.com per essere avvisato al lancio.',
              },
              {
                q: 'Come posso collaborare con Maestranze?',
                a: 'Per partnership, accordi commerciali o collaborazioni editoriali, scrivici a supporto@maestranze.com con oggetto "Collaborazione".',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-slate-900 hover:bg-slate-50 transition-colors list-none">
                  {q}
                  <span className="ml-4 text-orange-500 group-open:rotate-45 transition-transform text-xl leading-none select-none">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-14 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Non trovi quello che cerchi?</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Consulta la nostra pagina su come funziona Maestranze oppure scrivi direttamente al nostro team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/come-funziona" className="inline-flex items-center justify-center font-semibold rounded-lg px-5 py-2.5 border-2 border-orange-600 text-orange-700 hover:bg-orange-50 transition-colors">Come funziona</Link>
            <a href="mailto:supporto@maestranze.com" className="inline-flex items-center justify-center font-semibold rounded-lg px-5 py-2.5 bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md">Scrivici</a>
          </div>
        </div>
      </section>
    </>
  )
}
