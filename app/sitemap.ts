import { MetadataRoute } from 'next'
import { CATEGORIES, MAIN_CITIES } from '@/lib/categories'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://maestranze.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/come-funziona`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/registrati`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/richiedi-preventivo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/lavoro`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/calcolatore/fotovoltaico`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const cityRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) =>
    MAIN_CITIES.map((city) => ({
      url: `${BASE_URL}/${cat.slug}/${city.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  // Profili pubblici professionisti attivi
  let proRoutes: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('professionals')
      .select('id, updated_at:created_at')
      .eq('status', 'active')
      .limit(500)
    if (data) {
      proRoutes = (data as { id: string; updated_at: string }[]).map((p) => ({
        url: `${BASE_URL}/professionisti/${p.id}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // Supabase non raggiungibile al build time — skip profili
  }

  return [...staticRoutes, ...categoryRoutes, ...cityRoutes, ...proRoutes]
}
