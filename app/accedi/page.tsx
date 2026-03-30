import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Shield, Star, Users } from 'lucide-react'
import { SITE_URL } from '@/lib/utils'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Accedi alla Dashboard — Maestranze',
  description: 'Accedi alla tua dashboard professionale su Maestranze.',
  alternates: { canonical: `${SITE_URL}/accedi` },
  robots: { index: false, follow: false },
}

export default function AccediPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* ── FORM ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="mb-7">
              <Link href="/" className="inline-block mb-6">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Maest<span className="text-orange-500">ranze</span>
                </span>
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Accedi alla dashboard</h1>
              <p className="text-slate-500 text-sm">Gestisci il tuo profilo e le richieste di preventivo.</p>
            </div>
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="hidden lg:flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
                La tua area riservata
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Accedi per visualizzare le richieste di preventivo nella tua zona, gestire il tuo profilo e monitorare le recensioni.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Users, title: 'Richieste di preventivo', desc: 'Vedi tutti i clienti che cercano un professionista come te nella tua città.' },
                { icon: Star, title: 'Recensioni e reputazione', desc: 'Monitora il tuo rating e rispondi alle recensioni dei clienti.' },
                { icon: Shield, title: 'Profilo verificato', desc: 'Mantieni aggiornate le tue certificazioni e i tuoi servizi.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{title}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
