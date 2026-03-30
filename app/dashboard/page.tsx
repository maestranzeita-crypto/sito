import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Inbox, Clock, Phone, Mail, MapPin, Briefcase, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/categories'
import type { LeadRequest, Professional } from '@/lib/database.types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const URGENZA_LABEL: Record<string, string> = {
  urgente: 'Urgente',
  settimana: 'Entro la settimana',
  mese: 'Entro il mese',
  nessuna: 'Senza fretta',
}
const URGENZA_COLOR: Record<string, string> = {
  urgente: 'bg-red-100 text-red-700',
  settimana: 'bg-orange-100 text-orange-700',
  mese: 'bg-yellow-100 text-yellow-700',
  nessuna: 'bg-slate-100 text-slate-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  // Profilo professionale
  const { data: proData } = await supabase
    .from('professionals')
    .select('*')
    .eq('email', user.email!)
    .single()
  const pro = proData as Professional | null

  if (!pro) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Dashboard</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900 mb-1">Profilo non trovato</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Nessun profilo professionale è associato a <strong>{user.email}</strong>.
              Registrati come professionista per attivare la dashboard.
            </p>
            <Link
              href="/registrati"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Registrati gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Lead requests che corrispondono alle categorie + città del professionista
  const { data: leadsData } = await supabase
    .from('lead_requests')
    .select('*')
    .in('categoria', pro.categorie)
    .eq('citta', pro.citta)
    .order('created_at', { ascending: false })
    .limit(50)

  const allLeads: LeadRequest[] = (leadsData as LeadRequest[] | null) ?? []
  const newLeads = allLeads.filter((l) => l.status === 'pending')
  const oldLeads = allLeads.filter((l) => l.status !== 'pending')

  return (
    <div className="max-w-4xl">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Buongiorno, {pro.ragione_sociale.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Richieste di preventivo nella tua zona
          </p>
        </div>
        {pro.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-amber-800 font-medium">Profilo in revisione</span>
          </div>
        )}
      </div>

      {/* ── STATS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Richieste totali', value: allLeads.length, color: 'text-slate-900' },
          { label: 'Da contattare', value: newLeads.length, color: 'text-orange-600' },
          { label: 'Contattate', value: oldLeads.length, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <div className={`text-3xl font-extrabold mb-1 ${color}`}>{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* ── NUOVE RICHIESTE ──────────────────────────────────── */}
      {newLeads.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Nuove richieste ({newLeads.length})
          </h2>
          <div className="space-y-4">
            {newLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} isNew />
            ))}
          </div>
        </div>
      )}

      {/* ── RICHIESTE PRECEDENTI ─────────────────────────────── */}
      {oldLeads.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Già contattate ({oldLeads.length})
          </h2>
          <div className="space-y-3">
            {oldLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} isNew={false} />
            ))}
          </div>
        </div>
      )}

      {allLeads.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700 mb-1">Nessuna richiesta ancora</p>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Quando un cliente richiede un preventivo per{' '}
            <strong>{pro.categorie.map((c: string) => getCategoryBySlug(c)?.nameShort ?? c).join(', ')}</strong>{' '}
            a <strong>{pro.citta}</strong>, comparirà qui.
          </p>
          {pro.status === 'pending' && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mt-4 inline-block">
              Il tuo profilo è ancora in fase di verifica. Le richieste arriveranno dopo l'attivazione.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function LeadCard({ lead, isNew }: { lead: LeadRequest; isNew: boolean }) {
  const cat = getCategoryBySlug(lead.categoria)
  return (
    <div className={`bg-white rounded-2xl border p-5 transition-all ${isNew ? 'border-orange-300 shadow-sm' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {cat && <cat.icon className="w-5 h-5 text-orange-500 flex-shrink-0" />}
          <span className="font-bold text-slate-900">{cat?.nameShort ?? lead.categoria}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${URGENZA_COLOR[lead.urgenza] ?? 'bg-slate-100 text-slate-500'}`}>
            {URGENZA_LABEL[lead.urgenza] ?? lead.urgenza}
          </span>
          {isNew && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              Nuovo
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(lead.created_at)}</span>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mb-4 bg-slate-50 rounded-xl p-3">
        {lead.descrizione}
      </p>

      <div className="flex items-center gap-4 flex-wrap text-sm">
        <span className="flex items-center gap-1.5 font-semibold text-slate-900">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          {lead.nome}
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {lead.citta}
        </span>
        <a
          href={`tel:${lead.telefono}`}
          className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold"
        >
          <Phone className="w-3.5 h-3.5" />
          {lead.telefono}
        </a>
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold"
        >
          <Mail className="w-3.5 h-3.5" />
          {lead.email}
        </a>
      </div>
    </div>
  )
}
