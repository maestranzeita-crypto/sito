import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin, Star, CheckCircle2, Briefcase, Phone, Mail,
  ArrowRight, Shield, Clock, Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Professional, Review } from '@/lib/database.types'
import { getCategoryBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import ContactProForm from './ContactProForm'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('professionals')
    .select('ragione_sociale, bio, citta, categorie')
    .eq('id', params.id)
    .eq('status', 'active')
    .single()
  const pro = data as Pick<Professional, 'ragione_sociale' | 'bio' | 'citta' | 'categorie'> | null
  if (!pro) return {}

  const catLabels = pro.categorie.map((c) => getCategoryBySlug(c)?.nameShort ?? c).join(', ')
  const title = `${pro.ragione_sociale} — ${catLabels} a ${pro.citta} | Maestranze`
  const description = pro.bio
    ? pro.bio.slice(0, 155)
    : `Professionista ${catLabels} a ${pro.citta}. Preventivi gratuiti su Maestranze.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/professionisti/${params.id}` },
    openGraph: { title, description, type: 'profile' },
  }
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
    </div>
  )
}

export default async function ProfiloPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: proData } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', params.id)
    .eq('status', 'active')
    .single()
  const pro = proData as Professional | null
  if (!pro) notFound()

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('professional_id', pro.id)
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(20)
  const reviews: Review[] = (reviewsData as Review[] | null) ?? []

  const categories = pro.categorie.map((c) => getCategoryBySlug(c)).filter(Boolean)
  const cityLabel = pro.citta.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  // Schema JSON-LD per il profilo
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: pro.ragione_sociale,
    description: pro.bio,
    address: { '@type': 'PostalAddress', addressLocality: cityLabel, addressCountry: 'IT' },
    ...(pro.rating_avg && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: pro.rating_avg.toFixed(1),
        reviewCount: pro.review_count,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {categories[0] && (
              <>
                <span>›</span>
                <Link href={`/${categories[0]!.slug}`} className="hover:text-white transition-colors">
                  {categories[0]!.nameShort}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-white">{pro.ragione_sociale}</span>
          </nav>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0 shadow-lg">
              {pro.ragione_sociale.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{pro.ragione_sociale}</h1>
                {pro.is_top_rated && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-orange-500 text-white rounded-full">Top Rated</span>
                )}
                {pro.verified_at && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
                    <Shield className="w-3 h-3" /> Verificato
                  </span>
                )}
              </div>

              {/* Categorie */}
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => cat && (
                  <span key={cat.slug} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                    <cat.icon className="w-3.5 h-3.5 text-orange-400" />
                    {cat.nameShort}
                  </span>
                ))}
              </div>

              {/* Metadati */}
              <div className="flex items-center gap-4 flex-wrap text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  {cityLabel}
                  {pro.raggio_km && ` · entro ${pro.raggio_km} km`}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-orange-400" />
                  {pro.anni_esperienza} anni di esperienza
                </span>
                {pro.rating_avg !== null && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <strong className="text-white">{pro.rating_avg.toFixed(1)}</strong>
                    <span>({pro.review_count} rec.)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENUTO ─────────────────────────────────────────── */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── COLONNA SINISTRA ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Bio */}
              {pro.bio && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="font-extrabold text-slate-900 mb-3">Chi sono</h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{pro.bio}</p>
                </div>
              )}

              {/* Servizi */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-extrabold text-slate-900 mb-4">Servizi offerti</h2>
                <div className="space-y-4">
                  {categories.map((cat) => cat && (
                    <div key={cat.slug}>
                      <div className="flex items-center gap-2 mb-3">
                        <cat.icon className="w-5 h-5 text-orange-500" />
                        <span className="font-semibold text-slate-800">{cat.nameShort}</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.services.slice(0, 6).map((service) => (
                          <li key={service} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recensioni */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-extrabold text-slate-900">
                      Recensioni verificate ({reviews.length})
                    </h2>
                    {pro.rating_avg !== null && (
                      <div className="flex items-center gap-2">
                        <StarRating rating={pro.rating_avg} />
                        <span className="font-bold text-slate-900">{pro.rating_avg.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-5">
                    {reviews.map((r) => (
                      <div key={r.id} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <StarRating rating={r.rating} size="sm" />
                            <span className="font-semibold text-slate-800 text-sm">{r.nome_cliente}</span>
                            {r.verified && (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verificata
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(r.created_at).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{r.testo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviews.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Nessuna recensione ancora. Sii il primo cliente!</p>
                </div>
              )}
            </div>

            {/* ── COLONNA DESTRA — FORM CONTATTO ── */}
            <div className="lg:col-span-1 space-y-5">
              {/* Form */}
              <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 sticky top-24">
                <div className="mb-4">
                  <h2 className="font-extrabold text-slate-900 mb-1">Richiedi un preventivo</h2>
                  <p className="text-xs text-slate-500">Contatto diretto · Gratuito · Senza impegno</p>
                </div>
                <ContactProForm
                  proId={pro.id}
                  proName={pro.ragione_sociale}
                  categories={pro.categorie}
                  citta={pro.citta}
                />
              </div>

              {/* Trust badges */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                {[
                  { icon: Shield, text: 'Professionista verificato con P.IVA' },
                  { icon: Clock, text: `${pro.anni_esperienza} anni di esperienza nel settore` },
                  { icon: CheckCircle2, text: 'Preventivo gratuito e senza impegno' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                    <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Link categoria */}
              {categories[0] && (
                <Link
                  href={`/${categories[0]!.slug}/${pro.citta}`}
                  className="flex items-center justify-between gap-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 text-sm font-medium px-5 py-3 rounded-xl transition-all"
                >
                  <span>Altri {categories[0]!.nameShort} a {cityLabel}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
