import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

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

// ── Argomenti ruotanti (1 a settimana) ───────────────────────────────────────
const TOPICS = [
  {
    title: 'Quanto costa installare un impianto fotovoltaico nel 2025',
    category: 'fotovoltaico',
    pexels: 'solar panels roof installation',
    keywords: ['fotovoltaico', 'prezzi', 'incentivi', 'pannelli solari'],
    internalLinks: [
      { href: '/fotovoltaico', label: 'installatori fotovoltaico verificati' },
      { href: '/richiedi-preventivo?categoria=fotovoltaico', label: 'preventivo gratuito' },
    ],
  },
  {
    title: 'Come scegliere un elettricista certificato: guida completa',
    category: 'elettricista',
    pexels: 'electrician electrical work',
    keywords: ['elettricista', 'certificazione', 'impianti elettrici', 'DM 37/08'],
    internalLinks: [
      { href: '/elettricista', label: 'elettricisti certificati' },
      { href: '/richiedi-preventivo?categoria=elettricista', label: 'richiedi preventivo' },
    ],
  },
  {
    title: 'Manutenzione caldaia: quando farla e quanto costa',
    category: 'idraulico',
    pexels: 'boiler heating system maintenance',
    keywords: ['caldaia', 'manutenzione', 'idraulico', 'riscaldamento'],
    internalLinks: [
      { href: '/idraulico', label: 'idraulici verificati nella tua zona' },
      { href: '/richiedi-preventivo?categoria=idraulico', label: 'preventivo gratuito' },
    ],
  },
  {
    title: 'Ristrutturazione casa: guida ai costi e ai permessi nel 2025',
    category: 'ristrutturazione',
    pexels: 'home renovation construction workers',
    keywords: ['ristrutturazione', 'costi', 'permessi', 'CILA', 'bonus'],
    internalLinks: [
      { href: '/ristrutturazione', label: 'imprese di ristrutturazione certificate' },
      { href: '/richiedi-preventivo?categoria=ristrutturazione', label: 'richiedi un preventivo' },
    ],
  },
  {
    title: 'Bonus Casa 2025: tutti gli incentivi per i lavori edilizi',
    category: 'generale',
    pexels: 'house renovation energy saving',
    keywords: ['bonus casa', 'incentivi', 'detrazione fiscale', 'ecobonus'],
    internalLinks: [
      { href: '/richiedi-preventivo', label: 'richiedi un preventivo gratuito' },
      { href: '/professionisti', label: 'professionisti verificati Maestranze' },
    ],
  },
  {
    title: 'Impianti fotovoltaici con accumulo: conviene nel 2025?',
    category: 'fotovoltaico',
    pexels: 'solar battery storage energy',
    keywords: ['fotovoltaico', 'accumulo', 'batterie', 'risparmio energetico'],
    internalLinks: [
      { href: '/fotovoltaico', label: 'installatori fotovoltaico verificati' },
      { href: '/calcolatore/fotovoltaico', label: 'calcola il risparmio' },
    ],
  },
  {
    title: 'Rifacimento bagno: costi, tempi e consigli pratici',
    category: 'idraulico',
    pexels: 'bathroom renovation modern design',
    keywords: ['rifacimento bagno', 'costi', 'idraulico', 'piastrellista'],
    internalLinks: [
      { href: '/idraulico', label: 'idraulici certificati' },
      { href: '/richiedi-preventivo?categoria=idraulico', label: 'preventivo gratuito' },
    ],
  },
  {
    title: 'Cappotto termico: costi, benefici e incentivi fiscali',
    category: 'muratore',
    pexels: 'thermal insulation house wall',
    keywords: ['cappotto termico', 'isolamento', 'risparmio energetico', 'ecobonus'],
    internalLinks: [
      { href: '/muratore', label: 'muratori e imprese edili verificate' },
      { href: '/richiedi-preventivo?categoria=muratore', label: 'richiedi preventivo' },
    ],
  },
  {
    title: 'Pompa di calore vs caldaia a gas: quale scegliere nel 2025',
    category: 'idraulico',
    pexels: 'heat pump air source home',
    keywords: ['pompa di calore', 'caldaia', 'riscaldamento', 'risparmio energetico'],
    internalLinks: [
      { href: '/idraulico', label: 'installatori pompe di calore' },
      { href: '/richiedi-preventivo?categoria=idraulico', label: 'preventivo gratuito' },
    ],
  },
  {
    title: 'Domotica e impianti smart home: guida completa per iniziare',
    category: 'elettricista',
    pexels: 'smart home automation technology',
    keywords: ['domotica', 'smart home', 'impianti elettrici', 'automazione'],
    internalLinks: [
      { href: '/elettricista', label: 'elettricisti specializzati in domotica' },
      { href: '/richiedi-preventivo?categoria=elettricista', label: 'richiedi preventivo' },
    ],
  },
  {
    title: 'Ristrutturazione appartamento: da dove iniziare e quanto costa',
    category: 'ristrutturazione',
    pexels: 'apartment renovation interior design',
    keywords: ['ristrutturazione appartamento', 'costi', 'tempi', 'impresa edile'],
    internalLinks: [
      { href: '/ristrutturazione', label: 'imprese di ristrutturazione' },
      { href: '/come-funziona', label: 'come funziona Maestranze' },
    ],
  },
  {
    title: 'Impianto elettrico di casa: quando rifarlo e quanto costa',
    category: 'elettricista',
    pexels: 'electrical panel wiring installation',
    keywords: ['impianto elettrico', 'rifacimento', 'costi', 'sicurezza'],
    internalLinks: [
      { href: '/elettricista', label: 'elettricisti certificati nella tua zona' },
      { href: '/richiedi-preventivo?categoria=elettricista', label: 'preventivo gratuito' },
    ],
  },
]

function getWeekTopic() {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  return TOPICS[weekNumber % TOPICS.length]
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
    return {
      url: photo.src.large2x ?? photo.src.large,
      alt: photo.alt ?? query,
    }
  } catch {
    return null
  }
}

// ── Claude generation via Vercel AI SDK ──────────────────────────────────────
async function generateBlogPost(topic: (typeof TOPICS)[0], existingSlugs: string[]) {
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
- html: paragrafo con link interni in HTML (es: "Testo con <a href='/...'>link</a> nel testo.")
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

  // Estrai JSON dalla risposta (rimuove eventuale markdown ```json ... ```)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude non ha restituito JSON valido')
  return JSON.parse(jsonMatch[0])
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  // Autenticazione cron
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const service = createServiceClient()

    // Slugs già pubblicati (per evitare duplicati)
    const { data: existing } = await service
      .from('blog_posts')
      .select('slug, published_at')
      .order('published_at', { ascending: false })
      .limit(20)

    const existingSlugs = (existing ?? []).map((r) => r.slug)

    // Controlla se sono già stati pubblicati 2 articoli questa settimana
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const publishedThisWeek = (existing ?? []).filter((r) => r.published_at > oneWeekAgo)
    if (publishedThisWeek.length >= 2) {
      return NextResponse.json({
        ok: true,
        message: 'Già pubblicati 2 articoli questa settimana',
        slug: publishedThisWeek[0].slug,
      })
    }

    const topic = getWeekTopic()

    // Genera contenuto con Claude
    const postData = await generateBlogPost(topic, existingSlugs)

    // Immagine da Pexels
    const image = await fetchPexelsImage(topic.pexels)

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
        image_url: image?.url ?? null,
        image_alt: image?.alt ?? postData.title,
        status: 'published',
        seo_title: postData.seo_title ?? postData.title,
        seo_description: postData.seo_description ?? postData.excerpt,
      })
      .select('slug')
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ ok: true, slug: saved?.slug })
  } catch (err) {
    console.error('[blog/generate]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Errore generazione' },
      { status: 500 }
    )
  }
}
