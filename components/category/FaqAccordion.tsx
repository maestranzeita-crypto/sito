'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  faqs: { q: string; a: string }[]
}

export default function FaqAccordion({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-semibold text-slate-900 text-sm md:text-base">{faq.q}</span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200',
                open === i && 'rotate-180'
              )}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-5 pt-1 bg-white text-slate-600 text-sm leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
