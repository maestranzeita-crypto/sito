'use client'

import { useState, useTransition } from 'react'
import { Star, MessageSquare, X, Loader2, Copy, Check } from 'lucide-react'
import { replyToReview } from './actions'
import type { Review } from '@/lib/database.types'

function StarRow({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`}
        />
      ))}
    </div>
  )
}

export function ReviewsSection({ reviews, avgRating, proName }: {
  reviews: Review[]; avgRating: number | null; proName: string
}) {
  const [replyModal, setReplyModal] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const showWhatsAppBanner = avgRating !== null && avgRating < 3

  const whatsappText =
    `Ciao! Sono ${proName} di Maestranze.com. Ho apprezzato molto averti come cliente. ` +
    `Se sei rimasto/a soddisfatto/a del mio lavoro, ti chiederei gentilmente di lasciarmi ` +
    `una breve recensione su Maestranze.com. Grazie di cuore! 🙏`

  function openReply(review: Review) { setReplyModal(review); setReplyText(review.risposta_professionista ?? ''); setError('') }
  function closeModal() { if (isPending) return; setReplyModal(null) }

  function handleSubmit() {
    if (!replyModal || !replyText.trim()) { setError('Scrivi una risposta prima di inviare.'); return }
    setError('')
    startTransition(async () => {
      try { await replyToReview(replyModal.id, replyText); setReplyModal(null) }
      catch { setError('Errore durante il salvataggio. Riprova.') }
    })
  }

  function copyWhatsApp() {
    navigator.clipboard.writeText(whatsappText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-4">Recensioni</h2>

      {avgRating !== null ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-4 flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-slate-800 leading-none">{avgRating.toFixed(1)}</div>
            <div className="text-xs text-slate-400 mt-1">su 5</div>
          </div>
          <div>
            <StarRow rating={Math.round(avgRating)} size={5} />
            <p className="text-sm text-slate-500 mt-1">{reviews.length} recension{reviews.length === 1 ? 'e' : 'i'}</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-4 text-center text-sm text-slate-400">
          Nessuna recensione ancora verificata.
        </div>
      )}

      {showWhatsAppBanner && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
          <p className="text-sm font-semibold text-green-800 mb-1">La tua media è bassa — chiedi recensioni ai clienti precedenti</p>
          <p className="text-xs text-green-700 mb-3">Copia e invia questo messaggio via WhatsApp:</p>
          <div className="bg-white border border-green-100 rounded-xl p-3 text-sm text-slate-600 mb-3">{whatsappText}</div>
          <button
            onClick={copyWhatsApp}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiato!' : 'Copia testo'}
          </button>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{review.nome_cliente}</p>
                  <StarRow rating={review.rating} size={4} />
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {new Date(review.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{review.testo}</p>
              {review.risposta_professionista ? (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm">
                  <span className="text-xs font-semibold text-orange-700 block mb-1">La tua risposta</span>
                  <p className="text-slate-700">{review.risposta_professionista}</p>
                  <button onClick={() => openReply(review)} className="text-xs text-orange-600 hover:underline mt-2 block">
                    Modifica risposta
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openReply(review)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />Rispondi alla recensione
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {replyModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Rispondi alla recensione</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-slate-800">{replyModal.nome_cliente}</span>
                  <StarRow rating={replyModal.rating} size={3} />
                </div>
                <p>{replyModal.testo}</p>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Scrivi la tua risposta pubblica alla recensione..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none bg-white text-slate-800 placeholder:text-slate-400"
                autoFocus
              />
              {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button onClick={closeModal} disabled={isPending} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Annulla
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Pubblica risposta
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
