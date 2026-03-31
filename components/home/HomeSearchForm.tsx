'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, CITIES } from '@/lib/categories'
import Button from '@/components/ui/Button'

export default function HomeSearchForm() {
  const router = useRouter()
  const [categoria, setCategoria] = useState('')
  const [citta, setCitta] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!categoria) return

    const cityInput = citta.trim().toLowerCase()
    const matched = CITIES.find(
      (c) =>
        c.slug === cityInput ||
        c.name.toLowerCase() === cityInput
    )

    if (categoria && matched) {
      router.push(`/${categoria}/${matched.slug}`)
    } else if (categoria) {
      router.push(
        `/richiedi-preventivo?categoria=${categoria}${citta ? `&citta=${encodeURIComponent(citta.trim())}` : ''}`
      )
    }
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          className="flex-1 px-4 py-3 text-slate-800 bg-transparent rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 border border-slate-200"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Tipo di servizio"
        >
          <option value="" disabled>Che lavoro ti serve?</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.nameShort}
            </option>
          ))}
        </select>

        <input
          type="text"
          list="cities-list"
          placeholder="La tua città..."
          value={citta}
          onChange={(e) => setCitta(e.target.value)}
          className="flex-1 px-4 py-3 text-slate-800 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Città"
        />
        <datalist id="cities-list">
          {CITIES.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>

        <Button type="submit" size="md" className="w-full sm:w-auto whitespace-nowrap">
          Cerca <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
