import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Bell, Shield, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function ImpostazioniPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Impostazioni</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gestisci il tuo account e le preferenze.</p>
      </div>

      <div className="space-y-3">
        <Link
          href="/dashboard/profilo"
          className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Profilo professionale</p>
              <p className="text-sm text-slate-500">Modifica foto, bio, categorie e zona</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-400 transition-colors" />
        </Link>

        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 opacity-60">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Notifiche</p>
              <p className="text-sm text-slate-500">Email e notifiche push — prossimamente</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-5 opacity-60">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Sicurezza</p>
              <p className="text-sm text-slate-500">Password e autenticazione — prossimamente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500">
          Account: <strong className="text-slate-700">{user.email}</strong>
        </p>
      </div>
    </div>
  )
}
