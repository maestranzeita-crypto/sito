export type Category = {
  slug: string
  name: string
  nameShort: string
  description: string
  icon: string
  color: string
  metaTitle: string
  metaDescription: string
}

export const CATEGORIES: Category[] = [
  {
    slug: 'fotovoltaico',
    name: 'Impianti Fotovoltaici',
    nameShort: 'Fotovoltaico',
    description: 'Installazione e manutenzione di pannelli solari e impianti fotovoltaici',
    icon: '☀️',
    color: 'amber',
    metaTitle: 'Installatori Fotovoltaico Certificati',
    metaDescription:
      'Trova installatori di impianti fotovoltaici certificati nella tua città. Preventivi gratuiti, professionisti verificati.',
  },
  {
    slug: 'elettricista',
    name: 'Elettricisti',
    nameShort: 'Elettricista',
    description: 'Impianti elettrici civili e industriali, certificazioni e collaudi',
    icon: '⚡',
    color: 'yellow',
    metaTitle: 'Elettricisti Certificati',
    metaDescription:
      'Trova elettricisti abilitati e certificati nella tua zona. Impianti civili, industriali, domotica.',
  },
  {
    slug: 'idraulico',
    name: 'Idraulici',
    nameShort: 'Idraulico',
    description: 'Impianti idraulici, termoidraulici e sanitari per casa e azienda',
    icon: '🔧',
    color: 'blue',
    metaTitle: 'Idraulici Qualificati',
    metaDescription:
      'Trova idraulici qualificati vicino a te. Impianti idrici, termici, caldaie, bagni e cucine.',
  },
  {
    slug: 'muratore',
    name: 'Muratori e Edili',
    nameShort: 'Muratore',
    description: 'Lavori edili, costruzioni, ristrutturazioni strutturali',
    icon: '🧱',
    color: 'orange',
    metaTitle: 'Muratori e Imprese Edili',
    metaDescription:
      'Trova muratori esperti e imprese edili per costruzioni, manutenzioni e ristrutturazioni.',
  },
  {
    slug: 'ristrutturazione',
    name: 'Ristrutturazioni',
    nameShort: 'Ristrutturazione',
    description: 'Ristrutturazioni complete di appartamenti, ville e locali commerciali',
    icon: '🏠',
    color: 'green',
    metaTitle: 'Imprese di Ristrutturazione',
    metaDescription:
      'Trova imprese per ristrutturazioni complete. Detrazioni fiscali 110%, 50%, bonus ristrutturazioni.',
  },
]

export const MAIN_CITIES = [
  'Milano',
  'Roma',
  'Napoli',
  'Torino',
  'Palermo',
  'Genova',
  'Bologna',
  'Firenze',
  'Bari',
  'Catania',
  'Venezia',
  'Verona',
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
