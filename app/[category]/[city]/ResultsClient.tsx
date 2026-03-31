'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, CheckCircle2, Lock, Unlock, ArrowRight, Loader2 } from 'lucide-react'
import type { Professional } from '@/lib/database.types'
import type { Category, City } from '@/lib/categories'

type Props = {
  pros: Professional[]
  category: Category
  city: City
}

const FREE_LIMIT = 3
const UNLOCK_KEY = (cat: string, cit: string) => `unlock_${cat}_${cit}`

function proYearsLabel(anni: string): string {
  const n = parseInt(anni, 10)
  if (!isNaN(n)) return `${n} ann${n === 1 ? 'o' : 'i'} esperienza`
  return `${anni} anni esperienza`
}

function StarRating({ rating, count }: { rating: number | null; count: number }) {
  if (rating === null) {
    return <span className="text-xs text-slate-400 italic">Nessuna recensione</span>
  }
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      <span className="font-semibold text-slate-900">{rating.toFixed(1)}</span>
      <span className="text-slate-400 text-sm">({count} rec.)</span>
    </div>
  )
}

function ProCard({
  pro,
  index,
  category,
  city,
  blurred,
}: {
  pro: Professional
  index: number
  category: Category
  city: City
  blurred: boolean
}) {
  const isConsigliato = index < FREE_LIMIT

  return (
    <div
      className={`relative bg-white rounded-2xl border p-5 transition-all ${
        blurred
          ? 'border-slate-200 select-none'
          : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
      }`}
    >
      {/* Blur overlay */}
      {blurred && (
        <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-white/60 z-10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
      )}

      {/* Badge Consigliato */}
      {isConsigliato && (
        <div className="absolute -top-2.5 left-4 z-10">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-sm">
            Consigliato
          </span>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4 mt-1">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-xl font-bold text-orange-600 flex-shrink-0">
          {blurred ? '?' : pro.ragione_sociale.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 truncate">
              {blurred ? '████████' : pro.ragione_sociale}
            </span>
            {!blurred && pro.is_top_rated && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                Top Rated
              </span>
            )}
            {!blurred && pro.verified_at && !pro.is_top_rated && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-600">
                Verificato
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {category.nameShort} · {city.name} · {proYearsLabel(pro.anni_esperienza)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mb-4">
        <StarRating rating={pro.rating_avg} count={pro.review_count} />
      </div>

      <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        {city.name}, {city.province}
      </div>

      {!blurred && (
        <ul className="space-y-1.5 mb-5">
          {category.services.slice(0, 3).map((service) => (
            <li key={service} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
              {service}
            </li>
          ))}
        </ul>
      )}

      {blurred && <div className="h-16 mb-5" />}

      {!blurred && (
        <div className="flex gap-2">
          <Link
            href={`/professionisti/${pro.id}`}
            className="flex-1 text-center border border-slate-200 hover:border-orange-400 text-slate-600 hover:text-orange-600 font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            Vedi profilo
          </Link>
          <Link
            href={`/richiedi-preventivo?categoria=${category.slug}&citta=${city.slug}`}
            className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            Preventivo
          </Link>
        </div>
      )}
    </div>
  )
}

function UnlockBanner({
  category,
  city,
  hiddenCount,
}: {
  category: Category
  city: City
  hiddenCount: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUnlock() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: category.slug, city: city.slug }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Errore durante il pagamento. Riprova.')
        setLoading(false)
      }
    } catch {
      setError('Errore di rete. Riprova.')
      setLoading(false)
    }
  }

  return (
    <div className="col-span-full my-2">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6 text-orange-500" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          Vuoi più scelte? Sblocca tutti i professionisti
        </h3>
        <p className="text-sm text-slate-600 mb-1">
          Accedi a <strong>{hiddenCount} professionisti in più</strong> per {category.nameShort.toLowerCase()} a {city.name}
        </p>
        <p className="text-xs text-slate-400 mb-4">
          Pagamento una tantum · Solo per questa ricerca · IVA inclusa
        </p>
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-md text-base"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Attendere…</>
          ) : (
            <><Unlock className="w-4 h-4" /> Sblocca tutti — €4,99</>
          )}
        </button>
        <p className="text-xs text-slate-400 mt-2">€6,09 IVA inclusa · Pagamento sicuro con Stripe</p>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

export default function ResultsClient({ pros, category, city }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [unlocked, setUnlocked] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const storageKey = UNLOCK_KEY(category.slug, city.slug)

  const verifyAndUnlock = useCallback(
    async (sid: string) => {
      setVerifying(true)
      try {
        const res = await fetch(`/api/checkout/verify?sid=${sid}`)
        const data = await res.json()
        if (data.paid) {
          localStorage.setItem(storageKey, JSON.stringify({ sid, ts: Date.now() }))
          setUnlocked(true)
          // Rimuove i query params dall'URL senza ricaricamento
          router.replace(`/${category.slug}/${city.slug}`, { scroll: false })
        }
      } finally {
        setVerifying(false)
      }
    },
    [storageKey, router, category.slug, city.slug]
  )

  useEffect(() => {
    // Check localStorage per unlock già effettuato
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setUnlocked(true)
        return
      }
    } catch {
      // localStorage non disponibile
    }

    // Check query params per ritorno da Stripe
    const payment = searchParams.get('payment')
    const sid = searchParams.get('sid')
    if (payment === 'success' && sid) {
      verifyAndUnlock(sid)
    }
  }, [searchParams, storageKey, verifyAndUnlock])

  if (verifying) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Verifica del pagamento in corso…</p>
      </div>
    )
  }

  if (pros.length === 0) {
    return (
      <div className="text-center py-14 bg-white rounded-2xl border border-slate-200">
        <p className="font-semibold text-slate-700 mb-1">
          Nessun professionista ancora registrato a {city.name}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Sei un {category.nameShort.toLowerCase()} a {city.name}? Registrati gratis e raggiungi nuovi clienti.
        </p>
        <Link
          href={`/registrati?categoria=${category.slug}&citta=${city.slug}`}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Registrati gratis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const visiblePros = unlocked ? pros : pros.slice(0, FREE_LIMIT)
  const hiddenPros = unlocked ? [] : pros.slice(FREE_LIMIT)
  const hiddenCount = hiddenPros.length

  return (
    <div className="space-y-4">
      {/* Contatore risultati */}
      <p className="text-sm text-slate-500">
        {unlocked
          ? `${pros.length} professionisti disponibili`
          : `${Math.min(pros.length, FREE_LIMIT)} di ${pros.length} professionisti disponibili`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visiblePros.map((pro, i) => (
          <ProCard
            key={pro.id}
            pro={pro}
            index={i}
            category={category}
            city={city}
            blurred={false}
          />
        ))}

        {/* Banner sblocco (se ci sono risultati nascosti) */}
        {!unlocked && hiddenCount > 0 && (
          <UnlockBanner category={category} city={city} hiddenCount={hiddenCount} />
        )}

        {/* Schede oscurate */}
        {!unlocked &&
          hiddenPros.map((pro, i) => (
            <ProCard
              key={pro.id}
              pro={pro}
              index={FREE_LIMIT + i}
              category={category}
              city={city}
              blurred={true}
            />
          ))}
      </div>

      {/* CTA registrazione */}
      {pros.length > 0 && (
        <div className="mt-6 text-center bg-white border border-dashed border-orange-300 rounded-2xl p-6">
          <p className="text-slate-600 font-medium mb-3">
            Sei un {category.nameShort.toLowerCase()} a {city.name}?
            <span className="text-slate-900"> Registrati gratis e raggiungi nuovi clienti.</span>
          </p>
          <Link
            href={`/registrati?categoria=${category.slug}&citta=${city.slug}`}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Crea il tuo profilo gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
