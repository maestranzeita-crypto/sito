import { SITE_URL } from '@/lib/utils'
import type { Category } from '@/lib/categories'
import type { City } from '@/lib/categories'

interface Props {
  category: Category
  city?: City
}

export default function ServiceSchema({ category, city }: Props) {
  const name = city
    ? `${category.nameShort} ${city.name}`
    : category.name

  const url = city
    ? `${SITE_URL}/${category.slug}/${city.slug}`
    : `${SITE_URL}/${category.slug}`

  const schema = city
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `${category.nameShort} a ${city.name} — Maestranze`,
        description: `Trova ${category.nameShort.toLowerCase()} verificati a ${city.name} (${city.province}). Preventivi gratuiti su Maestranze.`,
        url,
        areaServed: {
          '@type': 'City',
          name: city.name,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: city.region,
          },
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Servizi di ${category.nameShort} a ${city.name}`,
          itemListElement: category.services.map((s, i) => ({
            '@type': 'Offer',
            position: i + 1,
            itemOffered: {
              '@type': 'Service',
              name: s,
            },
          })),
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description: category.longDescription,
        url,
        provider: {
          '@type': 'Organization',
          name: 'Maestranze',
          url: SITE_URL,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Servizi di ${category.name}`,
          itemListElement: category.services.map((s, i) => ({
            '@type': 'Offer',
            position: i + 1,
            itemOffered: {
              '@type': 'Service',
              name: s,
            },
          })),
        },
      }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
