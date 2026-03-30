import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { CITIES } from '@/lib/categories'
import type { Category } from '@/lib/categories'

export default function CityGrid({ category }: { category: Category }) {
  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
          {category.nameShort} per città
        </h2>
        <p className="text-slate-500 mb-8">
          Trova professionisti verificati nella tua città
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/${category.slug}/${city.slug}`}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
              <span className="truncate">{city.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
