import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/accedi', '/admin/'],
    },
    sitemap: 'https://maestranze.com/sitemap.xml',
  }
}
