'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Camera, Loader2, Trash2, Plus, ImageIcon } from 'lucide-react'
import type { Professional } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'

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
    if (file.size > 15 * 1024 * 1024) { setAvatarError('Dimensione massima: 15 MB'); return }
    setAvatarError('')
    startAvatarTransition(async () => {
      try {
        const supabase = createClient()
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
        const path = `${pro.id}/avatar.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true, contentType: file.type })
        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

        const { error: dbError } = await supabase
          .from('professionals')
          .update({ foto_url: publicUrl })
          .eq('id', pro.id)
        if (dbError) throw new Error(dbError.message)

        setAvatarUrl(publicUrl)
      } catch (err: unknown) {
        setAvatarError(err instanceof Error ? err.message : 'Errore upload')
      }
    })
  }

  function handleDeleteAvatar() {
    setAvatarError('')
    startAvatarTransition(async () => {
      try {
        const supabase = createClient()
        if (avatarUrl) {
          const pathPart = avatarUrl.split('/avatars/')[1]
          if (pathPart) await supabase.storage.from('avatars').remove([pathPart])
        }
        await supabase.from('professionals').update({ foto_url: null }).eq('id', pro.id)
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
      const supabase = createClient()
      const added: string[] = []

      for (const file of files) {
        if (file.size > 15 * 1024 * 1024) continue
        try {
          const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
          const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const path = `${pro.id}/${uniqueName}`

          const { error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(path, file, { contentType: file.type })
          if (uploadError) throw new Error(uploadError.message)

          const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(path)
          added.push(publicUrl)
        } catch { /* salta foto singola fallita */ }
      }

      if (added.length > 0) {
        const newPortfolio = [...portfolio, ...added]
        const supabase2 = createClient()
        await supabase2.from('professionals').update({ foto_lavori: newPortfolio }).eq('id', pro.id)
        setPortfolio(newPortfolio)
      }
    })
    e.target.value = ''
  }

  function handleDeletePortfolio(url: string) {
    setDeletingUrl(url)
    startPortfolioTransition(async () => {
      try {
        const supabase = createClient()
        const pathPart = url.split('/portfolio/')[1]
        if (pathPart) await supabase.storage.from('portfolio').remove([pathPart])

        const newPortfolio = portfolio.filter((u) => u !== url)
        await supabase.from('professionals').update({ foto_lavori: newPortfolio }).eq('id', pro.id)
        setPortfolio(newPortfolio)
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
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Foto profilo</h3>
        <div className="flex items-start gap-5 flex-wrap">
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

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarPending}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border border-slate-300 rounded-xl text-slate-700 hover:border-orange-400 hover:text-orange-600 transition-colors disabled:opacity-50 min-h-[44px]"
            >
              <Camera className="w-4 h-4" />
              {avatarUrl ? 'Cambia foto' : 'Carica foto'}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={avatarPending}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />Elimina foto
              </button>
            )}
            <p className="text-xs text-slate-400">JPG, PNG o WebP · Max 15 MB</p>
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
        {avatarError && <p className="text-sm text-red-500 mt-2">{avatarError}</p>}
      </div>

      {/* ── FOTO LAVORI ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Foto dei lavori</h3>
            <p className="text-xs text-slate-400 mt-0.5">{portfolio.length}/10 foto caricate</p>
          </div>
          {portfolio.length < 10 && (
            <button
              type="button"
              onClick={() => portfolioInputRef.current?.click()}
              disabled={portfolioPending}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold bg-orange-50 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {portfolioPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Aggiungi foto
            </button>
          )}
        </div>

        <input ref={portfolioInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handlePortfolioChange} />

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
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <Image src={url} alt="Foto lavoro" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/20 sm:bg-black/0 sm:hover:bg-black/40 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(url)}
                    disabled={portfolioPending}
                    className="sm:opacity-0 sm:group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow"
                  >
                    {deletingUrl === url ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
