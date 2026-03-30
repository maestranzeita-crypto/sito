import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Euro } from 'lucide-react'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import ServiceSchema from '@/components/category/ServiceSchema'
import FaqAccordion from '@/components/category/FaqAccordion'
import CityGrid from '@/components/category/CityGrid'
import RequestQuoteBanner from '@/components/category/RequestQuoteBanner'

// Genera le route statiche al build time
export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }))
}

// Metadata dinamici per SEO
export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const cat = getCategoryBySlug(params.category)
  if (!cat) return {}

  const title = `${cat.metaTitle} — Preventivi Gratis | Maestranze`
  const description = cat.metaDescription
  const url = `${SITE_URL}/${cat.slug}`

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

export default function CategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategoryBySlug(params.category)
  if (!cat) notFound()

  return (
    <>
      <ServiceSchema category={cat} />

      {/* ─── HERO CATEGORIA ──────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white">{cat.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <cat.icon className="w-12 h-12 text-orange-400 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">
                  Trova Professionisti
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                  {cat.name}
                </h1>
              </div>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              {cat.longDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/richiedi-preventivo?categoria=${cat.slug}`}>
                <button className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-md text-base">
                  Richiedi Preventivo Gratis <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href={`/registrati?categoria=${cat.slug}`}>
                <button className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-colors text-base">
                  Sei un {cat.nameShort}? Registrati
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVIZI OFFERTI ─────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
                Cosa fanno i nostri {cat.nameShort.toLowerCase()}
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

            {/* Box prezzo + CTA */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Euro className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-slate-900">Costo indicativo</span>
              </div>
              <p className="text-2xl font-extrabold text-orange-600 mb-2">{cat.avgPrice}</p>
              <p className="text-sm text-slate-500 mb-6">
                Il prezzo finale dipende dalla complessità del lavoro, dai materiali e dalla zona. Richiedi un preventivo gratuito per avere un prezzo preciso.
              </p>
              <div className="space-y-3">
                {[
                  'Professionisti verificati con P.IVA',
                  'Preventivi gratuiti e senza impegno',
                  'Recensioni reali di altri clienti',
                  'Garanzia sulla qualità del lavoro',
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
                href={`/richiedi-preventivo?categoria=${cat.slug}`}
                className="mt-6 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full"
              >
                Ottieni Preventivo Gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COME FUNZIONA ────────────────────────────────────── */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10 text-center">
            Come trovare il {cat.nameShort.toLowerCase()} giusto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Descrivi il lavoro',
                desc: `Inserisci il tipo di intervento di ${cat.nameShort.toLowerCase()} che ti serve e la tua città.`,
              },
              {
                step: '2',
                title: 'Ricevi preventivi',
                desc: `I ${cat.nameShort.toLowerCase()} verificati della tua zona ti contattano con un'offerta personalizzata.`,
              },
              {
                step: '3',
                title: 'Scegli il migliore',
                desc: 'Confronta prezzi, profili e recensioni. Affida il lavoro al professionista che preferisci.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-extrabold shadow">
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────────────────────────── */}
      <RequestQuoteBanner category={cat} />

      {/* ─── CITTÀ ────────────────────────────────────────────── */}
      <CityGrid category={cat} />

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">
            Domande frequenti su {cat.name.toLowerCase()}
          </h2>
          <FaqAccordion faqs={cat.faqs} />
        </div>
      </section>

      {/* ─── ALTRE CATEGORIE ──────────────────────────────────── */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-slate-700 mb-5">Altri servizi su Maestranze</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.filter((c) => c.slug !== cat.slug).map((other) => (
              <Link
                key={other.slug}
                href={`/${other.slug}`}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
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
