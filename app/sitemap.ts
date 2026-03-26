import { MetadataRoute } from 'next'
import { CATEGORIES, MAIN_CITIES } from '@/lib/categories'

const BASE_URL = 'https://maestranze.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/come-funziona`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/registrati`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/richiedi-preventivo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/lavoro`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Pagine categoria: /fotovoltaico, /elettricista, ecc.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Pagine categoria + città: /fotovoltaico/milano, ecc.
  const cityRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) =>
    MAIN_CITIES.map((city) => ({
      url: `${BASE_URL}/${cat.slug}/${city.toLowerCase()}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticRoutes, ...categoryRoutes, ...cityRoutes]
}
