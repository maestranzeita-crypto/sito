'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Camera, Loader2, Trash2, Plus, ImageIcon } from 'lucide-react'
import type { Professional } from '@/lib/database.types'
import {
  uploadAvatar,
  deleteAvatar,
  uploadPortfolioPhoto,
  deletePortfolioPhoto,
} from '../actions'

export default function MediaSection({ pro }: { pro: Professional }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(pro.foto_url)
  const [portfolio, setPortfolio] = useState<string[]>(pro.foto_lavori ?? [])

  const [avatarPending, startAvatarTransition] = useTransition()
  const [portfolioPending, startPortfolioTransition] = useTransition()
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)

  const [avatarError, setAvatarError] = useState('')
  const [portfolioError, setPortfolioError] = useState('')

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const portfolioInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setAvatarError('Dimensione massima: 5 MB'); return }
    setAvatarError('')
    const fd = new FormData()
    fd.append('file', file)
    startAvatarTransition(async () => {
      try {
        const url = await uploadAvatar(fd)
        setAvatarUrl(url)
      } catch (err: unknown) {
        setAvatarError(err instanceof Error ? err.message : 'Errore upload')
      }
    })
  }

  function handleDeleteAvatar() {
    setAvatarError('')
    startAvatarTransition(async () => {
      try {
        await deleteAvatar()
        setAvatarUrl(null)
      } catch (err: unknown) {
        setAvatarError(err instanceof Error ? err.message : 'Errore eliminazione')
      }
    })
  }

  function handlePortfolioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (portfolio.length + files.length > 10) {
      setPortfolioError(`Puoi aggiungere ancora ${10 - portfolio.length} foto (max 10)`)
      return
    }
    setPortfolioError('')
    startPortfolioTransition(async () => {
      const added: string[] = []
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) continue
        const fd = new FormData()
        fd.append('file', file)
        try {
          const url = await uploadPortfolioPhoto(fd)
          added.push(url)
        } catch { /* skip single failed upload */ }
      }
      setPortfolio((prev) => [...prev, ...added])
    })
    e.target.value = ''
  }

  function handleDeletePortfolio(url: string) {
    setDeletingUrl(url)
    startPortfolioTransition(async () => {
      try {
        await deletePortfolioPhoto(url)
        setPortfolio((prev) => prev.filter((u) => u !== url))
      } catch (err: unknown) {
        setPortfolioError(err instanceof Error ? err.message : 'Errore eliminazione')
      } finally {
        setDeletingUrl(null)
      }
    })
  }

  return (
    <div className="space-y-8">

      {/* ── FOTO PROFILO ── */}
      <div id="foto">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Foto profilo
        </h3>
        <div className="flex items-start gap-5 flex-wrap">
          {/* Preview */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0 shadow">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Foto profilo" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-white">
                {pro.ragione_sociale.charAt(0).toUpperCase()}
              </div>
            )}
            {avatarPending && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Azioni */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-300 rounded-xl text-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              {avatarUrl ? 'Cambia foto' : 'Carica foto'}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={avatarPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Elimina foto
              </button>
            )}
            <p className="text-xs text-slate-400">JPG, PNG o WebP · Max 5 MB</p>
          </div>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
        {avatarError && <p className="text-sm text-red-500 mt-2">{avatarError}</p>}
      </div>

      {/* ── FOTO LAVORI ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Foto dei lavori
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{portfolio.length}/10 foto caricate</p>
          </div>
          {portfolio.length < 10 && (
            <button
              type="button"
              onClick={() => portfolioInputRef.current?.click()}
              disabled={portfolioPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-orange-50 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors disabled:opacity-50"
            >
              {portfolioPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Aggiungi foto
            </button>
          )}
        </div>

        <input
          ref={portfolioInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePortfolioChange}
        />

        {portfolio.length === 0 ? (
          <button
            type="button"
            onClick={() => portfolioInputRef.current?.click()}
            disabled={portfolioPending}
            className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 text-slate-400 hover:border-orange-300 hover:text-orange-400 transition-colors"
          >
            <ImageIcon className="w-8 h-8" />
            <span className="text-sm font-medium">Clicca per aggiungere le prime foto dei tuoi lavori</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {portfolio.map((url) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100">
                <Image src={url} alt="Foto lavoro" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(url)}
                    disabled={portfolioPending}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all shadow"
                  >
                    {deletingUrl === url ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {portfolio.length < 10 && portfolioPending && (
              <div className="aspect-square rounded-xl bg-slate-100 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            )}
          </div>
        )}

        {portfolioError && <p className="text-sm text-red-500 mt-2">{portfolioError}</p>}
      </div>
    </div>
  )
}
