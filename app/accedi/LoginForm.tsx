'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'password' | 'magic'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'
  const urlError = searchParams.get('error')

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(urlError === 'auth' ? 'Link non valido o scaduto. Riprova.' : '')
  const [magicSent, setMagicSent] = useState(false)

  const supabase = createClient()

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o password non corretti.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    })

    if (error) {
      setError("Impossibile inviare il link. Verifica l'indirizzo email.")
      setLoading(false)
      return
    }

    setMagicSent(true)
    setLoading(false)
  }

  if (magicSent) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Controlla la tua email</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Ti abbiamo inviato un link di accesso a <strong>{email}</strong>.
          Clicca il link nell'email per entrare nella tua dashboard.
        </p>
        <button
          onClick={() => { setMagicSent(false); setEmail('') }}
          className="mt-6 text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          Usa un'altra email
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Toggle mode */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
        {([
          { v: 'password' as Mode, label: 'Password' },
          { v: 'magic' as Mode, label: 'Link via email' },
        ]).map(({ v, label }) => (
          <button
            key={v}
            onClick={() => { setMode(v); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === v
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={mode === 'password' ? handlePassword : handleMagic} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@azienda.it"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        {mode === 'password' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setMode('magic')}
                className="text-xs text-orange-500 hover:text-orange-600"
              >
                Password dimenticata?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {mode === 'magic' && (
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 leading-relaxed">
            Ti invieremo un link sicuro via email. Nessuna password da ricordare.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {mode === 'password' ? 'Accedi' : 'Invia link di accesso'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Non hai ancora un account?{' '}
        <Link href="/registrati" className="text-orange-500 hover:text-orange-600 font-semibold">
          Registrati gratis
        </Link>
      </p>
    </div>
  )
}
