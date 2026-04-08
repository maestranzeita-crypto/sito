import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { BLOG_POSTS } from '@/lib/blog'
import { ensureBlogImage } from '@/lib/blog-images'

function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

const CATEGORY_PEXELS: Record<string, string> = {
  fotovoltaico: 'solar panels roof installation',
  elettricista: 'electrician electrical work',
  idraulico: 'plumber bathroom renovation',
  muratore: 'construction wall masonry',
  ristrutturazione: 'home renovation interior',
  generale: 'house construction workers',
}

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

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient()
  const updated: string[] = []
  const errors: string[] = []

  // 1. Articoli statici → upsert in Supabase con immagine
  for (const post of BLOG_POSTS) {
    try {
      const query = CATEGORY_PEXELS[post.category] ?? 'home renovation'
      const image = ensureBlogImage(await fetchPexelsImage(query), post.category, post.title)

      await service.from('blog_posts').upsert({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        published_at: post.publishedAt,
        reading_time: post.readingTime,
        author_name: post.author.name,
        sections: post.sections as unknown as Database['public']['Tables']['blog_posts']['Insert']['sections'],
        image_url: image.url,
        image_alt: image.alt,
        status: 'published',
        seo_title: post.title,
        seo_description: post.excerpt.slice(0, 160),
      }, { onConflict: 'slug', ignoreDuplicates: false })

      updated.push(post.slug)
    } catch (e) {
      errors.push(`${post.slug}: ${e}`)
    }
  }

  // 2. Post DB già esistenti senza immagine
  const { data: dbPosts } = await service
    .from('blog_posts')
    .select('id, slug, category')
    .is('image_url', null)
    .eq('status', 'published')

  for (const row of dbPosts ?? []) {
    try {
      const query = CATEGORY_PEXELS[row.category] ?? 'home renovation'
      const image = ensureBlogImage(await fetchPexelsImage(query), row.category, row.slug)

      await service
        .from('blog_posts')
        .update({ image_url: image.url, image_alt: image.alt })
        .eq('id', row.id)

      updated.push(row.slug)
    } catch (e) {
      errors.push(`${row.slug}: ${e}`)
    }
  }

  return NextResponse.json({ ok: true, updated, errors })
}
