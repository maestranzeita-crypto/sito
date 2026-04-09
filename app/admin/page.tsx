import { createServerClient } from '@supabase/ssr'
import type { Database, Professional } from '@/lib/database.types'
import { approveProfessional, rejectProfessional } from './actions'

function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false },
    }
  )
}

export default async function AdminDashboard() {
  const service = createServiceClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const since30d = thirtyDaysAgo.toISOString()

  const [
    { data: proStatuses },
    { data: leadStatuses },
    { data: pending },
    { data: newPros },
    { data: newLeads },
  ] = await Promise.all([
    service.from('professionals').select('status'),
    service.from('lead_requests').select('status'),
    service.from('professionals').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    service.from('professionals').select('id').gte('created_at', since30d),
    service.from('lead_requests').select('id').gte('created_at', since30d),
  ])

  const pro = {
    active:    proStatuses?.filter(p => p.status === 'active').length    ?? 0,
    pending:   proStatuses?.filter(p => p.status === 'pending').length   ?? 0,
    suspended: proStatuses?.filter(p => p.status === 'suspended').length ?? 0,
    rejected:  proStatuses?.filter(p => p.status === 'rejected').length  ?? 0,
    total:     proStatuses?.length ?? 0,
  }

  const lead = {
    total:     leadStatuses?.length ?? 0,
    pending:   leadStatuses?.filter(l => l.status === 'pending').length   ?? 0,
    contacted: leadStatuses?.filter(l => l.status === 'contacted').length ?? 0,
    closed:    leadStatuses?.filter(l => l.status === 'closed').length    ?? 0,
  }

  const closureRate = lead.total > 0
    ? Math.round((lead.closed / lead.total) * 100)
    : null

  const pendingList = (pending ?? []) as Professional[]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Panoramica generale della piattaforma</p>
      </div>

      {/* Profili */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Profili</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Attivi" value={pro.active} color="green" />
          <StatCard label="Da verificare" value={pro.pending} color="orange" badge={pro.pending > 0} />
          <StatCard label="Sospesi" value={pro.suspended} color="gray" />
          <StatCard label="Rifiutati" value={pro.rejected} color="red" />
        </div>
      </section>

      {/* Lead */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Lead</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Totale" value={lead.total} color="gray" />
          <StatCard label="Non assegnati" value={lead.pending} color="yellow" badge={lead.pending > 0} />
          <StatCard label="In lavorazione" value={lead.contacted} color="blue" />
          <StatCard label="Chiusi" value={lead.closed} color="green" />
        </div>
      </section>

      {/* Ultimi 30 giorni */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Ultimi 30 giorni</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Nuovi profili" value={newPros?.length ?? 0} color="gray" />
          <StatCard label="Nuovi lead" value={newLeads?.length ?? 0} color="gray" />
          <StatCard
            label="Tasso chiusura"
            value={closureRate !== null ? `${closureRate}%` : '—'}
            color="gray"
          />
          <StatCard
            label="Totale profili"
            value={pro.total}
            color="gray"
          />
        </div>
      </section>

      {/* Profili in attesa — action items */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">In attesa di verifica</h2>
          {pro.pending > 0 && (
            <span className="bg-orange-100 text-orange-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {pro.pending}
            </span>
          )}
        </div>

        {pendingList.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-6 text-center">
            Nessun profilo in attesa.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingList.map((p) => (
              <PendingCard key={p.id} pro={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/* ─── Stat Card ─── */

const COLOR_MAP: Record<string, { bg: string; value: string; dot: string }> = {
  green:  { bg: 'bg-green-50',  value: 'text-green-700',  dot: 'bg-green-400' },
  orange: { bg: 'bg-orange-50', value: 'text-orange-700', dot: 'bg-orange-400' },
  yellow: { bg: 'bg-yellow-50', value: 'text-yellow-700', dot: 'bg-yellow-400' },
  blue:   { bg: 'bg-blue-50',   value: 'text-blue-700',   dot: 'bg-blue-400' },
  red:    { bg: 'bg-red-50',    value: 'text-red-700',    dot: 'bg-red-400' },
  gray:   { bg: 'bg-white',     value: 'text-gray-900',   dot: 'bg-gray-300' },
}

function StatCard({
  label,
  value,
  color,
  badge,
}: {
  label: string
  value: number | string
  color: keyof typeof COLOR_MAP
  badge?: boolean
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.gray
  return (
    <div className={`relative ${c.bg} border border-gray-200 rounded-xl p-4`}>
      {badge && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
      )}
      <div className={`text-3xl font-bold ${c.value} tabular-nums`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  )
}

/* ─── Pending Card ─── */

function PendingCard({ pro }: { pro: Professional }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-base">{pro.ragione_sociale}</span>
            <span className="text-gray-400 text-xs">{pro.forma_giuridica}</span>
          </div>
          <div className="text-gray-600">
            P.IVA: <span className="font-mono">{pro.piva}</span>
          </div>
          <div className="text-gray-600">
            <a href={`mailto:${pro.email}`} className="text-blue-600 hover:underline">{pro.email}</a>
            {' · '}
            <a href={`tel:${pro.telefono}`} className="text-blue-600 hover:underline">{pro.telefono}</a>
          </div>
          <div className="text-gray-600">
            Città: <span className="font-medium">{pro.citta}</span>
            {' · '}
            Raggio: {pro.raggio_km} km
            {pro.anni_esperienza && ` · ${pro.anni_esperienza} anni esp.`}
          </div>
          <div className="text-gray-600">
            Servizi: <span className="font-medium">{pro.categorie.join(', ')}</span>
          </div>
          <div className="text-gray-400 text-xs">
            Registrato il {new Date(pro.created_at).toLocaleDateString('it-IT', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <form action={approveProfessional.bind(null, pro.id, pro.email, pro.ragione_sociale, pro.telegram_username)}>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Approva
            </button>
          </form>
          <form action={rejectProfessional.bind(null, pro.id, pro.email, pro.ragione_sociale)}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Rifiuta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
