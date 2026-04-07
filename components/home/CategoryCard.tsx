import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/lib/categories'

export default function CategoryCard({ cat }: { cat: Category }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-400 hover:shadow-lg transition-all duration-200">
      <Link href={`/${cat.slug}`} className="flex items-start gap-4">
        <cat.icon className="w-10 h-10 text-orange-500 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
            {cat.name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">{cat.description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  )
}
