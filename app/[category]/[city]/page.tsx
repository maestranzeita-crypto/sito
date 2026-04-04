import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, MapPin, Euro, Star, Users, Briefcase, Loader2 } from 'lucide-react'
import { CATEGORIES, CITIES, getCategoryBySlug, getCityBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

function createPublicClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}
import type { Professional } from '@/lib/database.types'
import ServiceSchema from '@/components/category/ServiceSchema'
import FaqAccordion from '@/components/category/FaqAccordion'
import RequestQuoteBanner from '@/components/category/RequestQuoteBanner'
import ResultsClient from './ResultsClient'

export const revalidate = 3600

export function generateStaticParams() {
  return CATEGORIES.flatMap((cat) =>
    CITIES.map((city) => ({ category: cat.slug, city: city.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; city: string }
}): Promise<Metadata> {
  const cat = getCategoryBySlug(params.category)
  const city = getCityBySlug(params.city)
  if (!cat || !city) return {}

  const title = `${cat.nameShort} a ${city.name} — Preventivi Gratis | Maestranze`
  const description = `Trova ${cat.nameShort.toLowerCase()} verificati a ${city.name} (${city.province}). Preventivi gratuiti, professionisti con P.IVA, recensioni reali. Risposta in 24 ore.`
  const url = `${SITE_URL}/${cat.slug}/${city.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'it_IT',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// Algoritmo di ranking dei professionisti
function rankProfessionals(pros: Professional[]): Professional[] {
  if (pros.length <= 1) return pros

  const maxReviews = Math.max(...pros.map((p) => p.review_count), 1)
  const maxReputation = Math.max(...pros.map((p) => p.reputation_points ?? 0), 1)

  type Scored = { pro: Professional; score: number }

  const scored: Scored[] = pros.map((pro) => {
    // 1. Distanza (29%): tutti nella stessa città → score uniforme
    const distanceScore = 1.0

    // 2. Media stelle (24%)
    const ratingScore = pro.rating_avg !== null ? pro.rating_avg / 5 : 0.3

    // 3. Tasso di risposta (19%) — proxy: numero recensioni normalizzato
    const responseRateScore = pro.review_count / maxReviews

    // 4. Velocità risposta (14%) — proxy: is_top_rated
    const responseSpeedScore = pro.is_top_rated ? 1.0 : 0.4

    // 5. Completezza profilo (9%)
    let completeness = 0
    if (pro.foto_url) completeness += 0.25
    if (pro.bio && pro.bio.length > 30) completeness += 0.25
    if (pro.piva) completeness += 0.25
    if (pro.verified_at) completeness += 0.25

    // 6. Punti reputazione (5%) — guadagnati cedendo richieste ai colleghi
    const reputationScore = (pro.reputation_points ?? 0) / maxReputation

    const score =
      distanceScore * 0.29 +
      ratingScore * 0.24 +
      responseRateScore * 0.19 +
      responseSpeedScore * 0.14 +
      completeness * 0.09 +
      reputationScore * 0.05

    return { pro, score }
  })

  // Ordina per punteggio decrescente (sort stabile in JS ES2019+)
  scored.sort((a, b) => b.score - a.score)
  const ranked = scored.map((s) => s.pro)

  // Boost Pro: ogni professionista is_top_rated sale di una posizione a parità
  for (let i = 1; i < ranked.length; i++) {
    if (ranked[i].is_top_rated && !ranked[i - 1].is_top_rated) {
      const tmp = ranked[i]
      ranked[i] = ranked[i - 1]
      ranked[i - 1] = tmp
    }
  }

  return ranked
}

export default async function CategoryCityPage({
  params,
}: {
  params: { category: string; city: string }
}) {
  const cat = getCategoryBySlug(params.category)
  const city = getCityBySlug(params.city)
  if (!cat || !city) notFound()

  let rankedPros: Professional[] = []
  try {
    const supabase = createPublicClient()
    const { data: pros, error } = await supabase
      .from('professionals')
      .select('*')
      .contains('categorie', [cat.slug])
      .eq('citta', city.slug)
      .eq('status', 'active')
    if (error) console.error('[CategoryCityPage] Supabase error:', error.message)
    rankedPros = rankProfessionals(pros ?? [])
  } catch (err) {
    console.error('[CategoryCityPage] createClient/query failed:', err)
  }

  const otherCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 15)
  const otherCategories = CATEGORIES.filter((c) => c.slug !== cat.slug)

  const totalReviews = rankedPros.reduce((acc, p) => acc + p.review_count, 0)
  const ratedPros = rankedPros.filter((p) => p.rating_avg !== null)
  const avgRating =
    ratedPros.length > 0
      ? ratedPros.reduce((acc, p) => acc + p.rating_avg!, 0) / ratedPros.length
      : null

  return (
    <>
      <ServiceSchema category={cat} city={city} />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
            <span>›</span>
            <span className="text-white">{city.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <cat.icon className="w-12 h-12 text-orange-400 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">
                  {city.name} · {city.region}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                  {cat.nameShort} a {city.name}
                </h1>
              </div>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Trova {cat.nameShort.toLowerCase()} verificati a {city.name}. Confronta preventivi,
              leggi le recensioni e scegli il professionista più adatto a te.
              Risposta garantita entro 24 ore.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/richiedi-preventivo?categoria=${cat.slug}&citta=${city.slug}`}>
                <button className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-md text-base">
                  Richiedi Preventivo Gratis <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href={`/registrati?categoria=${cat.slug}&citta=${city.slug}`}>
                <button className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-colors text-base">
                  Sei un {cat.nameShort} a {city.name}?
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS LOCALI ──────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-1">
              <Users className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-extrabold text-slate-900">
                {rankedPros.length > 0 ? rankedPros.length : '—'}
              </span>
              <span className="text-xs text-slate-500">Professionisti a {city.name}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Briefcase className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-extrabold text-slate-900">
                {totalReviews > 0 ? totalReviews : '—'}
              </span>
              <span className="text-xs text-slate-500">Recensioni totali</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-extrabold text-slate-900">
                {avgRating !== null ? `${avgRating.toFixed(1)}/5` : '—'}
              </span>
              <span className="text-xs text-slate-500">Valutazione media</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LISTA PROFESSIONISTI ──────────────────────────────── */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {cat.nameShort} verificati a {city.name}
              </h2>
              <p className="text-slate-500 mt-1">
                Professionisti con P.IVA, certificazioni e recensioni reali
              </p>
            </div>
            <Link
              href={`/richiedi-preventivo?categoria=${cat.slug}&citta=${city.slug}`}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              Richiedi preventivo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Suspense
            fallback={
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
              </div>
            }
          >
            <ResultsClient pros={rankedPros} category={cat} city={city} />
          </Suspense>
        </div>
      </section>

      {/* ─── SERVIZI + PREZZO ──────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
                Servizi di {cat.nameShort.toLowerCase()} a {city.name}
              </h2>
              <ul className="space-y-3">
                {cat.services.map((service) => (
                  <li key={service} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Euro className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-slate-900">
                  Costo indicativo a {city.name}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-orange-600 mb-2">{cat.avgPrice}</p>
              <p className="text-sm text-slate-500 mb-6">
                Il prezzo dipende dalla complessità del lavoro e dai materiali. Richiedi un preventivo gratuito per avere un costo preciso.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  `${cat.nameShort} con P.IVA e certificazioni`,
                  'Preventivi gratuiti e senza impegno',
                  'Recensioni verificate di altri clienti',
                  'Risposta entro 24 ore',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href={`/richiedi-preventivo?categoria=${cat.slug}&citta=${city.slug}`}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full"
              >
                Ottieni Preventivo Gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────── */}
      <RequestQuoteBanner category={cat} />

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            Domande frequenti su {cat.name.toLowerCase()} a {city.name}
          </h2>
          <FaqAccordion faqs={cat.faqs} />
        </div>
      </section>

      {/* ─── ALTRE CITTÀ ───────────────────────────────────────── */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-700 mb-5">
            {cat.nameShort} in altre città
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/${cat.slug}/${c.slug}`}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-600 text-sm font-medium px-3.5 py-2 rounded-xl transition-all"
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ALTRI SERVIZI A QUESTA CITTÀ ──────────────────────── */}
      <section className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-700 mb-5">
            Altri professionisti a {city.name}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/${other.slug}/${city.slug}`}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-600 text-sm font-medium px-3.5 py-2 rounded-xl transition-all"
              >
                <other.icon className="w-4 h-4 flex-shrink-0" /> {other.nameShort}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
