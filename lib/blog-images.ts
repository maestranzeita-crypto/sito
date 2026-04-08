export type BlogImage = {
  url: string
  alt: string
}

const CATEGORY_FALLBACK_IMAGES: Record<string, BlogImage> = {
  fotovoltaico: {
    url: 'https://images.pexels.com/photos/9875408/pexels-photo-9875408.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Installazione di pannelli fotovoltaici su tetto residenziale',
  },
  elettricista: {
    url: 'https://images.pexels.com/photos/7359566/pexels-photo-7359566.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Lavori su impianto elettrico domestico',
  },
  idraulico: {
    url: 'https://images.pexels.com/photos/8486972/pexels-photo-8486972.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Intervento idraulico in ambiente bagno',
  },
  muratore: {
    url: 'https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Lavori edili e muratura in cantiere',
  },
  ristrutturazione: {
    url: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Ristrutturazione di interni residenziali',
  },
  generale: {
    url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
    alt: 'Lavori di casa e manutenzione domestica',
  },
}

export function getFallbackBlogImage(category: string, title?: string): BlogImage {
  const fallback = CATEGORY_FALLBACK_IMAGES[category] ?? CATEGORY_FALLBACK_IMAGES.generale

  return {
    url: fallback.url,
    alt: title ? `${title} - immagine illustrativa` : fallback.alt,
  }
}

export function ensureBlogImage(
  image: Partial<BlogImage> | null | undefined,
  category: string,
  title?: string
): BlogImage {
  if (image?.url) {
    return {
      url: image.url,
      alt: image.alt?.trim() || title || getFallbackBlogImage(category, title).alt,
    }
  }

  return getFallbackBlogImage(category, title)
}
