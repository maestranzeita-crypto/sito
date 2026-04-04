import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Star, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Professional, Review } from '@/lib/database.types'
import ProfileForm from './ProfileForm'
import MediaSection from './MediaSection'
import CertificazioniSection from './CertificazioniSection'
import GmbSection from './GmbSection'

export const metadata: Metadata = {
  title: 'Il mio profilo — Dashboard Maestranze',
  robots: { index: false, follow: false },
}

export default async function DashboardProfiloPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  const { data: proData } = await supabase
    .from('professionals')
    .select('*')
    .eq('email', user.email!)
    .single()
  const pro = proData as Professional | null
  if (!pro) redirect('/dashboard')

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('professional_id', pro.id)
    .order('created_at', { ascending: false })
    .limit(5)
  const reviews = reviewsData as Review[] | null

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Il mio profilo</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Le informazioni qui aggiornate sono visibili ai clienti nella tua scheda profilo.
        </p>
      </div>

      {pro.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900 mb-0.5">Profilo in attesa di verifica</p>
            <p className="text-amber-800">
              Il tuo profilo è in fase di revisione. Riceverai una conferma via email entro 24 ore.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
        <h2 className="font-extrabold text-slate-800 mb-6">Foto profilo e lavori</h2>
        <MediaSection pro={pro} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
        <ProfileForm pro={pro} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6">
        <h2 className="font-extrabold text-slate-800 mb-6">Certificazioni</h2>
        <CertificazioniSection pro={pro} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
        <h2 className="font-extrabold text-slate-800 mb-6">Google My Business</h2>
        <GmbSection pro={pro} />
      </div>

      {reviews && reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Ultime recensioni ({pro.review_count} totali · {pro.rating_avg?.toFixed(1) ?? '–'}/5)
          </h2>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{r.nome_cliente}</span>
                  {r.verified && (
                    <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">Verificata</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.testo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
