import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Come Verifichiamo i Professionisti — Maestranze',
  description:
    'Un processo manuale, rigoroso e trasparente. Scopri ogni passaggio della verifica dei professionisti su Maestranze.',
  alternates: { canonical: `${SITE_URL}/come-funziona` },
}

export default function ComeFunzionaPage() {
  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Come verifichiamo i professionisti su Maestranze
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
            Un processo manuale, rigoroso e trasparente. Ecco ogni passaggio nel dettaglio.
          </p>
        </div>
      </section>

      {/* ── SEZIONE 1 — Cosa succede quando si registra ─────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5">
            Cosa succede quando un professionista si registra
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Quando un professionista completa la registrazione su Maestranze, il profilo non viene attivato automaticamente. Entra in una coda di verifica che il nostro team gestisce manualmente entro 24–48 ore lavorative.
          </p>
        </div>
      </section>

      {/* ── SEZIONE 2 — Documenti ────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            I documenti che chiediamo
          </h2>
          <ul className="space-y-6">
            {[
              {
                title: 'P.IVA',
                desc: 'Verifica tramite Registro Imprese che sia attiva e intestata correttamente.',
              },
              {
                title: 'Polizza RC professionale',
                desc: 'Documento in corso di validità che copra i danni causati nell\'esercizio dell\'attività.',
              },
              {
                title: 'Certificazioni specifiche per settore',
                desc: null,
                sub: [
                  'Elettricisti: abilitazione DM 37/08',
                  'Installatori fotovoltaico: certificazione CEI 82-25 o equivalente',
                  'Idraulici: abilitazione DM 37/08 per impianti termici e idrosanitari',
                  'Imprese edili: DURC in corso di validità',
                ],
              },
              {
                title: 'Documento di identità del titolare',
                desc: null,
              },
            ].map(({ title, desc, sub }) => (
              <li key={title} className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2.5" />
                <div>
                  <p className="font-bold text-slate-900 mb-1">{title}</p>
                  {desc && <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>}
                  {sub && (
                    <ul className="mt-2 space-y-1">
                      {sub.map((s) => (
                        <li key={s} className="text-sm text-slate-600 flex gap-2 items-start">
                          <span className="text-orange-400 font-bold flex-shrink-0">·</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SEZIONE 3 — Tempistiche ──────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            Le tempistiche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { time: 'Entro 24 ore', desc: 'Ricevi la conferma che la tua richiesta è in fase di verifica.' },
              { time: 'Entro 48 ore', desc: 'Il nostro team completa la verifica dei documenti.' },
              { time: 'Attivazione immediata', desc: 'Una volta approvato ricevi email + messaggio con il link al tuo profilo pubblico.' },
            ].map(({ time, desc }) => (
              <div key={time} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <p className="text-xl font-extrabold text-orange-500 mb-2">{time}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEZIONE 4 — Se qualcosa non va ──────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5">
            Cosa succede se qualcosa non va
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Se un documento è scaduto, mancante o non corrispondente ai dati inseriti, ti contattiamo direttamente via email spiegando cosa manca. Non rifiutiamo il profilo senza darti la possibilità di correggere. Se dopo 7 giorni non riceviamo risposta, la richiesta viene archiviata ma puoi ripresentarla in qualsiasi momento.
          </p>
        </div>
      </section>

      {/* ── SEZIONE 5 — Badge Verificato ─────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5">
            Il badge Verificato
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            Il badge <strong>Maestranze Verificato</strong> che appare sul profilo pubblico significa che abbiamo controllato tutti i documenti richiesti per quel tipo di servizio. Non è un badge automatico — viene assegnato manualmente e può essere rimosso se i documenti scadono senza rinnovo.
          </p>
        </div>
      </section>

      {/* ── CTA FINALE ───────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            Sei un professionista?
          </h2>
          <Link href="/registrati">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-md mb-6">
              Registrati gratis <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-orange-100 text-sm mt-4">
            Hai domande? Scrivici a{' '}
            <a href="mailto:info@maestranze.it" className="underline hover:text-white font-medium">
              info@maestranze.it
            </a>
          </p>
        </div>
      </section>

    </div>
  )
}
