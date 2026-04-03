import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin, Star, CheckCircle2, Briefcase,
  ArrowRight, Shield, Clock, Users, PauseCircle, Award, ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Professional, Review } from '@/lib/database.types'
import { getCategoryBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import ContactProForm from './ContactProForm'
import WaitlistForm from './WaitlistForm'
import Image from 'next/image'

// Etichette certificazioni (stesse di CertificazioniSection)
const CERT_LABELS: Record<string, string> = {
  'Patentino F-Gas': 'Patentino F-Gas',
  'Certificazione SOA': 'Certificazione SOA',
  'Abilitazione elettrica (DM 37/08)': 'Abilitazione elettrica (DM 37/08)',
  'Certificazione fotovoltaico (CEI 82-25)': 'Certificazione fotovoltaico (CEI 82-25)',
  'ISO 9001': 'ISO 9001',
}

async function fetchGmbRating(name: string, city: string): Promise<{ rating: number | null; total: number | null } | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return null
  try {
    const query = encodeURIComponent(`${name} ${city}`)
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}&language=it`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const place = data.results?.[0]
    if (!place) return null
    return { rating: place.rating ?? null, total: place.user_ratings_total ?? null }
  } catch {
    return null
  }
}

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

  // GMB Places rating (solo se GOOGLE_PLACES_API_KEY configurata)
  const gmbRating = pro.gmb_link ? await fetchGmbRating(pro.ragione_sociale, cityLabel) : null

  const certificazioni: string[] = pro.certificazioni ?? []
  const portfolio: string[] = pro.foto_lavori ?? []

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
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg bg-gradient-to-br from-orange-400 to-orange-600">
              {pro.foto_url ? (
                <Image src={pro.foto_url} alt={pro.ragione_sociale} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-white">
                  {pro.ragione_sociale.charAt(0).toUpperCase()}
                </div>
              )}
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
                {pro.available === false && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-400/10 px-2.5 py-1 rounded-full">
                    <PauseCircle className="w-3 h-3" /> Al momento non disponibile
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

              {/* Certificazioni */}
              {certificazioni.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    Certificazioni
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {certificazioni.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        {CERT_LABELS[cert] ?? cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio foto lavori */}
              {portfolio.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="font-extrabold text-slate-900 mb-4">Foto dei lavori</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {portfolio.map((url, i) => (
                      <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                        <Image
                          src={url}
                          alt={`Lavoro ${i + 1} di ${pro.ragione_sociale}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── COLONNA DESTRA — FORM CONTATTO ── */}
            <div className="lg:col-span-1 space-y-5">
              {/* Form contatto / waitlist */}
              <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 sticky top-24" id="avvisami">
                {pro.available === false ? (
                  <>
                    <div className="mb-4">
                      <h2 className="font-extrabold text-slate-900 mb-1">Avvisami quando torna disponibile</h2>
                      <p className="text-xs text-slate-500">Gratuito · Nessuna pubblicità</p>
                    </div>
                    <WaitlistForm professionalId={pro.id} />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Google My Business button */}
              {pro.gmb_link && (
                <a
                  href={pro.gmb_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 px-5 py-3.5 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Vedi su Google Maps</p>
                      {gmbRating?.rating != null && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.round(gmbRating.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {gmbRating.rating.toFixed(1)}
                          </span>
                          {gmbRating.total != null && (
                            <span className="text-xs text-slate-400">
                              ({gmbRating.total.toLocaleString('it-IT')})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-blue-500" />
                </a>
              )}

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
