import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createServerClient } from '@supabase/ssr'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { Database } from '@/lib/database.types'
import { ensureBlogImage } from '@/lib/blog-images'
import { isTooSimilar } from '@/lib/blog-similarity'

// ENV richieste:
// PEXELS_API_KEY  — chiave Pexels (gratuita su pexels.com/api)
// CRON_SECRET     — segreto per proteggere l'endpoint (impostare su Vercel)
// Auth AI         — OIDC automatico su Vercel (nessuna chiave manuale necessaria)

function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

// ── Legge argomenti da /content/blog-topics.json ─────────────────────────────
interface TopicEntry {
  title: string
  category: string
  pexels: string
  keywords: string[]
  internalLinks: { href: string; label: string }[]
}

function loadTopics(): TopicEntry[] {
  try {
    const filePath = join(process.cwd(), 'content', 'blog-topics.json')
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return data.predefined ?? []
  } catch {
    return []
  }
}

function getWeekTopic(topics: TopicEntry[], publishedTitles: string[]): TopicEntry {
  // Preferisce argomenti non ancora pubblicati
  const unpublished = topics.filter(
    (t) => !isTooSimilar(t.title, publishedTitles).similar
  )
  const pool = unpublished.length > 0 ? unpublished : topics
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  return pool[weekNumber % pool.length]
}

// ── Pexels ────────────────────────────────────────────────────────────────────
async function fetchPexelsImage(query: string): Promise<{ url: string; alt: string } | null> {
  const key = process.env.PEXELS_API_KEY
  if (!key) return null
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&size=large`,
      { headers: { Authorization: key } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return null
    return { url: photo.src.large2x ?? photo.src.large, alt: photo.alt ?? query }
  } catch {
    return null
  }
}

// ── Claude generation via Vercel AI SDK ──────────────────────────────────────
async function generateBlogPost(topic: TopicEntry, existingSlugs: string[]) {
  const internalLinksDoc = topic.internalLinks
    .map((l) => `- <a href="${l.href}">${l.label}</a>`)
    .join('\n')

  const prompt = `Sei il redattore SEO di Maestranze.com, marketplace italiano che connette clienti a professionisti edili verificati (elettricisti, idraulici, muratori, installatori fotovoltaico, imprese di ristrutturazione).

Scrivi un articolo blog SEO-ottimizzato in italiano sull'argomento: "${topic.title}"

REQUISITI:
- Lingua: italiano, tono professionale ma accessibile
- Lunghezza: 700-900 parole totali
- Categoria: ${topic.category}
- Tag keywords: ${topic.keywords.join(', ')}
- Include naturalmente almeno 2 link interni tra questi (usa HTML <a href="...">):
${internalLinksDoc}

STRUTTURA SEZIONI (JSON esatto richiesto):
- h2: titolo sezione principale
- h3: sottotitolo
- html: paragrafo con link interni in HTML
- p: paragrafo senza link
- ul: lista puntata (array "items")
- callout: box evidenziato con "title" e "text"

IMPORTANTE:
- Lo slug deve essere unico, in italiano, con trattini, max 60 caratteri
- NON usare questi slug già esistenti: ${existingSlugs.slice(0, 10).join(', ')}
- seo_title: max 60 caratteri
- seo_description: 140-160 caratteri, include keyword principale
- L'articolo deve rispondere a domande reali degli utenti (prezzi, come fare, quando chiamare, incentivi)
- Includi dati e cifre realistici per il mercato italiano 2025
- I link interni devono essere in sezioni di tipo "html", non "p"

Rispondi SOLO con JSON valido (nessun testo fuori dal JSON):
{
  "slug": "...",
  "title": "...",
  "excerpt": "...",
  "category": "${topic.category}",
  "tags": [...],
  "reading_time": 6,
  "seo_title": "...",
  "seo_description": "...",
  "sections": [
    {"type": "h2", "text": "..."},
    {"type": "html", "content": "...testo con <a href='/...' class='text-orange-600 hover:underline font-medium'>link</a>..."},
    {"type": "p", "text": "..."},
    {"type": "ul", "items": ["...", "...", "..."]},
    {"type": "callout", "title": "...", "text": "..."}
  ]
}`

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.6',
    prompt,
    maxTokens: 4096,
  })

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude non ha restituito JSON valido')
  return JSON.parse(jsonMatch[0])
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const service = createServiceClient()

    // Articoli già pubblicati
    const { data: existing } = await service
      .from('blog_posts')
      .select('slug, title, published_at')
      .order('published_at', { ascending: false })
      .limit(50)

    const existingSlugs = (existing ?? []).map((r) => r.slug)
    const existingTitles = (existing ?? []).map((r) => r.title)

    // Max 2 articoli a settimana
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const publishedThisWeek = (existing ?? []).filter((r) => r.published_at > oneWeekAgo)
    if (publishedThisWeek.length >= 2) {
      return NextResponse.json({
        ok: true,
        message: 'Già pubblicati 2 articoli questa settimana',
        slug: publishedThisWeek[0].slug,
      })
    }

    // Priorità: argomenti pianificati dall'admin su Supabase
    let topic: TopicEntry | null = null
    let plannedId: string | null = null
    try {
      const { data: planned } = await (service as any)
        .from('blog_planned_topics')
        .select('*')
        .eq('status', 'planned')
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (planned) {
        plannedId = planned.id
        topic = {
          title: planned.title,
          category: planned.category,
          pexels: planned.pexels_query ?? planned.category,
          keywords: planned.keywords ?? [],
          internalLinks: planned.internal_links ?? [],
        }
        await (service as any)
          .from('blog_planned_topics')
          .update({ status: 'in_progress' })
          .eq('id', plannedId)
      }
    } catch { /* tabella opzionale */ }

    // Fallback: argomenti predefiniti dal JSON
    if (!topic) {
      const topics = loadTopics()
      if (topics.length === 0) throw new Error('Nessun argomento in blog-topics.json')

      const candidate = getWeekTopic(topics, existingTitles)
      const { similar, closestTitle } = isTooSimilar(candidate.title, existingTitles)

      if (similar) {
        return NextResponse.json({
          ok: false,
          skipped: true,
          message: `Argomento troppo simile a un già pubblicato: "${closestTitle}"`,
          suggestedTitle: candidate.title,
        })
      }
      topic = candidate
    }

    // Genera con Claude
    const postData = await generateBlogPost(topic, existingSlugs)

    // Immagine Pexels
    const image = ensureBlogImage(
      await fetchPexelsImage(topic.pexels),
      postData.category ?? topic.category,
      postData.title
    )

    // Salva su Supabase
    const { data: saved, error } = await service
      .from('blog_posts')
      .insert({
        slug: postData.slug,
        title: postData.title,
        excerpt: postData.excerpt,
        category: postData.category ?? topic.category,
        tags: postData.tags ?? topic.keywords,
        reading_time: postData.reading_time ?? 6,
        author_name: 'Redazione Maestranze',
        sections: postData.sections,
        image_url: image.url,
        image_alt: image.alt,
        status: 'published',
        seo_title: postData.seo_title ?? postData.title,
        seo_description: postData.seo_description ?? postData.excerpt,
      })
      .select('slug')
      .single()

    if (error) throw new Error(error.message)

    // Segna il topic pianificato come pubblicato
    if (plannedId) {
      try {
        await (service as any)
          .from('blog_planned_topics')
          .update({ status: 'published', published_slug: saved?.slug })
          .eq('id', plannedId)
      } catch { /* opzionale */ }
    }

    return NextResponse.json({ ok: true, slug: saved?.slug })
  } catch (err) {
    console.error('[blog/generate]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore generazione' },
      { status: 500 }
    )
  }
}
