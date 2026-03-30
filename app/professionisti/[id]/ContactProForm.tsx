'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, AlertCircle, User, Phone, Mail, FileText } from 'lucide-react'
import { getCategoryBySlug } from '@/lib/categories'

interface Props {
  proId: string
  proName: string
  categories: string[]
  citta: string
}

type FormData = {
  nome: string
  telefono: string
  email: string
  descrizione: string
  categoria: string
}

export default function ContactProForm({ proId, proName, categories, citta }: Props) {
  const [form, setForm] = useState<FormData>({
    nome: '',
    telefono: '',
    email: '',
    descrizione: '',
    categoria: categories[0] ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const isValid =
    form.nome.trim().length >= 2 &&
    /^[+\d\s\-()]{8,}$/.test(form.telefono) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.descrizione.trim().length >= 10

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: form.categoria,
          citta,
          descrizione: form.descrizione,
          urgenza: 'settimana',
          nome: form.nome,
          telefono: form.telefono,
          email: form.email,
        }),
      })
      if (!res.ok) throw new Error('Errore server')
      setSubmitted(true)
    } catch {
      setError('Errore imprevisto. Riprova o chiama direttamente.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="font-bold text-slate-900 mb-1">Richiesta inviata!</p>
        <p className="text-sm text-slate-500 leading-relaxed">
          <strong>{proName}</strong> riceverà la tua richiesta via email e ti contatterà presto.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Categoria (se più di una) */}
      {categories.length > 1 && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Servizio</label>
          <select
            value={form.categoria}
            onChange={(e) => set('categoria', e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {categories.map((c) => {
              const cat = getCategoryBySlug(c)
              return (
                <option key={c} value={c}>{cat?.nameShort ?? c}</option>
              )
            })}
          </select>
        </div>
      )}

      {/* Nome */}
      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          required
          value={form.nome}
          onChange={(e) => set('nome', e.target.value)}
          placeholder="Nome e cognome"
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Telefono */}
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="tel"
          required
          value={form.telefono}
          onChange={(e) => set('telefono', e.target.value)}
          placeholder="+39 333 123 4567"
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="mario@esempio.it"
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Descrizione */}
      <div className="relative">
        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <textarea
          required
          value={form.descrizione}
          onChange={(e) => set('descrizione', e.target.value)}
          placeholder="Descrivi brevemente il lavoro che ti serve..."
          rows={3}
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Invia richiesta gratuita'
        )}
      </button>

      <p className="text-xs text-slate-400 text-center leading-relaxed">
        Gratuito · Senza impegno · Risposta entro 24h
      </p>
    </form>
  )
}
