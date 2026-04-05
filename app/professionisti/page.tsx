import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { SITE_URL } from '@/lib/utils'
import type { Professional } from '@/lib/database.types'
import ProfessionistiClient from './ProfessionistiClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Professionisti Verificati | Maestranze',
  description:
    'Scopri tutti i professionisti edili verificati su Maestranze: elettricisti, idraulici, muratori, installatori fotovoltaico e imprese di ristrutturazione. Preventivi gratuiti.',
  alternates: { canonical: `${SITE_URL}/professionisti` },
  openGraph: {
    title: 'Professionisti Verificati | Maestranze',
    description:
      'Trova artigiani e imprese edili verificati in tutta Italia. Leggi le recensioni e richiedi preventivi gratuiti.',
    type: 'website',
  },
}

export default async function ProfessionistiPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('professionals')
    .select(
      'id, ragione_sociale, citta, categorie, foto_url, rating_avg, review_count, verified_at, is_top_rated, available'
    )
    .eq('status', 'active')
    .order('is_top_rated', { ascending: false })
    .order('rating_avg', { ascending: false, nullsFirst: false })

  const professionals = ((data as Professional[] | null) ?? []).map((pro) => ({
    ...pro,
    categoryLabels: pro.categorie.map((c) => getCategoryBySlug(c)?.nameShort ?? c),
  }))

  // Ricava lista città uniche ordinate
  const cities = Array.from(new Set(professionals.map((p) => p.citta))).sort()

  const schemaList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Professionisti verificati su Maestranze',
    numberOfItems: professionals.length,
    itemListElement: professionals.slice(0, 20).map((pro, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/professionisti/${pro.id}`,
      name: pro.ragione_sociale,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaList) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 bg-orange-400/10 px-4 py-1.5 rounded-full mb-4">
            <Users className="w-4 h-4" />
            Professionisti verificati
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Trova il professionista giusto
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            {professionals.length} artigiani e imprese edili verificati in tutta Italia.
            Leggi le recensioni, confronta i profili e richiedi preventivi gratuiti.
          </p>
        </div>
      </section>

      <ProfessionistiClient
        professionals={professionals}
        categories={CATEGORIES}
        cities={cities}
      />
    </>
  )
}
