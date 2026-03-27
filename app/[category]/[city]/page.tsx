import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, MapPin, Euro, Star, Users, Briefcase } from 'lucide-react'
import { CATEGORIES, CITIES, getCategoryBySlug, getCityBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import ServiceSchema from '@/components/category/ServiceSchema'
import FaqAccordion from '@/components/category/FaqAccordion'
import RequestQuoteBanner from '@/components/category/RequestQuoteBanner'

// Genera tutte le combinazioni categoria × città al build time
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

// Dati placeholder finché non c'è il DB
const PLACEHOLDER_PROS = [
  { name: 'Marco Bianchi', rating: 4.9, reviews: 47, jobs: 120, badge: 'Top Rated', years: 12 },
  { name: 'Luigi Esposito', rating: 4.8, reviews: 31, jobs: 89, badge: 'Verificato', years: 8 },
  { name: 'Giovanni Ferrari', rating: 4.7, reviews: 23, jobs: 65, badge: 'Verificato', years: 5 },
]

export default function CategoryCityPage({
  params,
}: {
  params: { category: string; city: string }
}) {
  const cat = getCategoryBySlug(params.category)
  const city = getCityBySlug(params.city)
  if (!cat || !city) notFound()

  const otherCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 15)
  const otherCategories = CATEGORIES.filter((c) => c.slug !== cat.slug)

  return (
    <>
      <ServiceSchema category={cat} city={city} />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
            <span>›</span>
            <span className="text-white">{city.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl" role="img" aria-label={cat.nameShort}>{cat.icon}</span>
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
              <span className="text-2xl font-extrabold text-slate-900">40+</span>
              <span className="text-xs text-slate-500">Professionisti a {city.name}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Briefcase className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-extrabold text-slate-900">300+</span>
              <span className="text-xs text-slate-500">Lavori completati</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-extrabold text-slate-900">4.8/5</span>
              <span className="text-xs text-slate-500">Valutazione media</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROFESSIONISTI PLACEHOLDER ────────────────────────── */}
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
              Vedi tutti <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLACEHOLDER_PROS.map((pro) => (
              <div key={pro.name} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-orange-300 hover:shadow-md transition-all">
                {/* Avatar placeholder */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-xl font-bold text-orange-600 flex-shrink-0">
                    {pro.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 truncate">{pro.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        pro.badge === 'Top Rated'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {pro.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {cat.nameShort} · {city.name} · {pro.years} anni esperienza
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-slate-900">{pro.rating}</span>
                    <span className="text-slate-400">({pro.reviews} rec.)</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Briefcase className="w-4 h-4" />
                    {pro.jobs} lavori
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {city.name}, {city.province}
                </div>

                <ul className="space-y-1.5 mb-5">
                  {cat.services.slice(0, 3).map((service) => (
                    <li key={service} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      {service}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/richiedi-preventivo?categoria=${cat.slug}&citta=${city.slug}`}
                  className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
                >
                  Richiedi Preventivo
                </Link>
              </div>
            ))}
          </div>

          {/* CTA registrazione professionista */}
          <div className="mt-6 text-center bg-white border border-dashed border-orange-300 rounded-2xl p-6">
            <p className="text-slate-600 font-medium mb-3">
              Sei un {cat.nameShort.toLowerCase()} a {city.name}?
              <span className="text-slate-900"> Registrati gratis e raggiungi nuovi clienti.</span>
            </p>
            <Link
              href={`/registrati?categoria=${cat.slug}&citta=${city.slug}`}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Crea il tuo profilo gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
                Il prezzo dipende dalla complessità del lavoro e dai materiali. Richiedi un preventivo gratuito per avere un costo preciso per il tuo intervento.
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
                {other.icon} {other.nameShort}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
