import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Calendar, ChevronRight, AlertCircle, Newspaper } from 'lucide-react'
import { BLOG_POSTS, getPostBySlug, getRelatedPosts, type BlogSection } from '@/lib/blog'
import { CATEGORIES } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const title = `${post.title} | Maestranze`
  const url = `${SITE_URL}/blog/${post.slug}`

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title, description: post.excerpt, url, type: 'article', locale: 'it_IT' },
    twitter: { card: 'summary_large_image', title, description: post.excerpt },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'h2':
      return <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-8 mb-3">{section.text}</h2>
    case 'h3':
      return <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">{section.text}</h3>
    case 'p':
      return <p className="text-slate-700 leading-relaxed">{section.text}</p>
    case 'ul':
      return (
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-4 my-2">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="font-bold text-slate-900 text-sm">{section.title}</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{section.text}</p>
        </div>
      )
  }
}

function ArticleJsonLd({ post }: { post: ReturnType<typeof getPostBySlug> }) {
  if (!post) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          author: { '@type': 'Organization', name: 'Maestranze', url: SITE_URL },
          publisher: { '@type': 'Organization', name: 'Maestranze', url: SITE_URL },
          datePublished: post.publishedAt,
          url: `${SITE_URL}/blog/${post.slug}`,
          keywords: post.tags.join(', '),
        }),
      }}
    />
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  fotovoltaico: 'Fotovoltaico',
  elettricista: 'Elettricista',
  idraulico: 'Idraulico',
  muratore: 'Muratore',
  ristrutturazione: 'Ristrutturazione',
  generale: 'Generale',
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const cat = CATEGORIES.find((c) => c.slug === post.category)
  const related = getRelatedPosts(post)

  return (
    <>
      <ArticleJsonLd post={post} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-white transition-colors">Guide</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              {cat && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-orange-500/20 border border-orange-500/30 text-orange-300 px-3 py-1 rounded-full">
                  <cat.icon className="w-3.5 h-3.5" /> {CATEGORY_LABELS[post.category]}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} minuti di lettura
              </span>
              <span className="text-slate-500">{post.author.name}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENUTO ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Articolo (2/3) */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
              {post.sections.map((section, i) => (
                <RenderSection key={i} section={section} />
              ))}
            </div>

            {/* Tag */}
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA inline */}
            {cat && (
              <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <h3 className="font-extrabold text-lg mb-2">
                  Cerchi un {cat.nameShort.toLowerCase()} verificato?
                </h3>
                <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                  Ricevi fino a 3 preventivi gratuiti da professionisti verificati nella tua zona entro 24 ore.
                </p>
                <Link
                  href={`/richiedi-preventivo?categoria=${cat.slug}`}
                  className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  Richiedi Preventivo Gratis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </article>

          {/* Sidebar (1/3) */}
          <aside className="space-y-5 sticky top-24">
            {/* CTA preventivo */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">
                Hai bisogno di un professionista?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Descrivi il lavoro e ricevi preventivi gratuiti da professionisti verificati nella tua zona.
              </p>
              <Link
                href={cat ? `/richiedi-preventivo?categoria=${cat.slug}` : '/richiedi-preventivo'}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-3 rounded-xl transition-colors w-full"
              >
                Preventivo Gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-slate-400 text-center mt-2">Gratis · Nessun obbligo · 24h</p>
            </div>

            {/* Link categoria */}
            {cat && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-xs text-slate-500 mb-2">Trova professionisti:</p>
                <Link
                  href={`/${cat.slug}`}
                  className="flex items-center gap-2 font-semibold text-slate-800 hover:text-orange-600 transition-colors text-sm"
                >
                  <cat.icon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  {cat.name} verificati in Italia
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            )}

            {/* Articoli correlati */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Leggi anche</h3>
                <div className="space-y-3">
                  {related.map((rel) => {
                    const RelIcon = CATEGORIES.find((c) => c.slug === rel.category)?.icon ?? Newspaper
                    return (
                    <Link key={rel.slug} href={`/blog/${rel.slug}`} className="block group">
                      <div className="flex items-start gap-3">
                        <RelIcon className="w-5 h-5 flex-shrink-0 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                            {rel.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {rel.readingTime} min
                          </p>
                        </div>
                      </div>
                    </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
