import Link from 'next/link'
import { Calculator, ArrowRight, Clock } from 'lucide-react'
import type { Category } from '@/lib/categories'

export default function CalculatorCTA({ category }: { category: Category }) {
  if (!category.calculatorHref) return null

  const available = category.calculatorAvailable

  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Icona */}
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Calculator className="w-10 h-10 text-orange-500" />
          </div>

          {/* Testo */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
              Stima il costo in anticipo
            </h2>
            <p className="text-slate-500 leading-relaxed max-w-xl">
              Usa il nostro calcolatore gratuito per avere un'idea del preventivo prima ancora di contattare un professionista. Veloce, senza registrazione.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            {available ? (
              <Link
                href={category.calculatorHref!}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-md text-base whitespace-nowrap"
              >
                Apri il calcolatore <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="flex flex-col items-center md:items-end gap-2">
                <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-400 font-semibold px-7 py-3.5 rounded-xl cursor-not-allowed text-base whitespace-nowrap border border-slate-200">
                  <Clock className="w-5 h-5" /> Calcolatore in arrivo
                </span>
                <span className="text-xs text-slate-400">Prossimamente disponibile</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
