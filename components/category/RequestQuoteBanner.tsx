import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Category } from '@/lib/categories'

interface Props {
  category: Category
  cityName?: string
}

export default function RequestQuoteBanner({ category, cityName }: Props) {
  const location = cityName ? ` a ${cityName}` : ''
  return (
    <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
          Cerchi un {category.nameShort.toLowerCase()}{location}?
        </h2>
        <p className="text-orange-100 mb-6 text-lg">
          Ricevi fino a 3 preventivi gratuiti da professionisti verificati nella tua zona. Nessun obbligo.
        </p>
        <Link href={`/richiedi-preventivo?categoria=${category.slug}${cityName ? `&citta=${cityName.toLowerCase()}` : ''}`}>
          <Button size="lg" variant="secondary">
            Richiedi Preventivo Gratis <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <p className="mt-3 text-sm text-orange-200">✓ Gratuito · ✓ Nessun obbligo · ✓ Risposta entro 24h</p>
      </div>
    </section>
  )
}
