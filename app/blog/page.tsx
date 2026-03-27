import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog'
import { CATEGORIES } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Guide e Consigli per Ristrutturazioni, Impianti e Lavori di Casa | Maestranze',
  description:
    'Guide pratiche su fotovoltaico, ristrutturazioni, elettricisti, idraulici e muratori. Prezzi aggiornati, incentivi fiscali e consigli per scegliere il professionista giusto.',
  alternates: { canonical: `${SITE_URL}/blog` },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  fotovoltaico: 'Fotovoltaico',
  elettricista: 'Elettricista',
  idraulico: 'Idraulico',
  muratore: 'Muratore',
  ristrutturazione: 'Ristrutturazione',
  generale: 'Generale',
}

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Guide e Consigli</span>
            <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Tutto quello che devi sapere sui lavori di casa
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Prezzi aggiornati, guida agli incentivi fiscali e consigli pratici per scegliere il professionista giusto.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── ARTICOLO IN EVIDENZA ──────────────────────────── */}
        <div className="mb-12">
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Placeholder immagine */}
                <div className={`h-48 lg:h-auto bg-gradient-to-br ${getCategoryGradient(featured.category)} flex items-center justify-center`}>
                  <span className="text-7xl opacity-60">
                    {CATEGORIES.find((c) => c.slug === featured.category)?.icon ?? '📰'}
                  </span>
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                      In evidenza
                    </span>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {CATEGORY_LABELS[featured.category]}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors mb-3 leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{formatDate(featured.publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.readingTime} min
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-600 flex items-center gap-1">
                      Leggi <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── GRIGLIA ARTICOLI ────────────────────────────── */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Tutti gli articoli</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-orange-300 hover:shadow-md transition-all h-full flex flex-col">
                    {/* Placeholder immagine piccola */}
                    <div className={`h-32 bg-gradient-to-br ${getCategoryGradient(post.category)} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-5xl opacity-50">
                        {CATEGORIES.find((c) => c.slug === post.category)?.icon ?? '📰'}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full self-start mb-2">
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors text-sm leading-snug mb-2 flex-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* ── SIDEBAR ─────────────────────────────────────── */}
          <aside className="space-y-6">

            {/* Categorie */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Argomenti</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const count = BLOG_POSTS.filter((p) => p.category === cat.slug).length
                  if (count === 0) return null
                  return (
                    <div key={cat.slug} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                      <span className="text-sm text-slate-700 flex items-center gap-2">
                        <span>{cat.icon}</span>
                        {cat.nameShort}
                      </span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tag cloud */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" /> Tag popolari
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags))).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-full cursor-default transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA preventivo */}
            <div className="bg-orange-500 text-white rounded-2xl p-5">
              <h3 className="font-bold mb-2 text-sm">Pronto a iniziare?</h3>
              <p className="text-orange-100 text-xs leading-relaxed mb-4">
                Richiedi un preventivo gratuito da professionisti verificati nella tua zona.
              </p>
              <Link
                href="/richiedi-preventivo"
                className="flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Richiedi Preventivo Gratis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}

function getCategoryGradient(category: string): string {
  const map: Record<string, string> = {
    fotovoltaico: 'from-amber-100 to-orange-100',
    elettricista: 'from-yellow-100 to-amber-100',
    idraulico: 'from-blue-100 to-cyan-100',
    muratore: 'from-orange-100 to-red-100',
    ristrutturazione: 'from-green-100 to-emerald-100',
    generale: 'from-slate-100 to-slate-200',
  }
  return map[category] ?? 'from-slate-100 to-slate-200'
}
