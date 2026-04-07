import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import type { Database, Professional, LeadRequest } from '@/lib/database.types'
import { approveProfessional, rejectProfessional, suspendProfessional } from './actions'
import LeadsSection from './LeadsSection'

const ADMIN_EMAIL = 'info@maestranze.it'

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const service = createServiceClient()

  const [{ data: pending }, { data: active }, { data: leads }, { data: allPros }] = await Promise.all([
    service
      .from('professionals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    service
      .from('professionals')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    service
      .from('lead_requests')
      .select('*')
      .order('created_at', { ascending: false }),
    service
      .from('professionals')
      .select('*')
      .in('status', ['active'])
      .order('ragione_sociale', { ascending: true }),
  ])

  const pendingList = (pending ?? []) as Professional[]
  const activeList = (active ?? []) as Professional[]
  const leadsList = (leads ?? []) as LeadRequest[]
  const allProsList = (allPros ?? []) as Professional[]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin — Maestranze</h1>
          <p className="text-sm text-gray-500 mt-1">Connesso come {user.email}</p>
        </div>

        {/* Pending Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">In attesa di verifica</h2>
            <span className="bg-orange-100 text-orange-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {pendingList.length} {pendingList.length === 1 ? 'profilo' : 'profili'}
            </span>
          </div>

          {pendingList.length === 0 ? (
            <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-6 text-center">
              Nessun profilo in attesa.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingList.map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} mode="pending" />
              ))}
            </div>
          )}
        </section>

        {/* Active Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Profili attivi</h2>
            <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {activeList.length}
            </span>
          </div>

          {activeList.length === 0 ? (
            <p className="text-gray-400 text-sm bg-white border border-gray-200 rounded-lg p-6 text-center">
              Nessun profilo attivo.
            </p>
          ) : (
            <div className="space-y-3">
              {activeList.map((pro) => (
                <ProfessionalCard key={pro.id} pro={pro} mode="active" />
              ))}
            </div>
          )}
        </section>

        {/* Leads Section */}
        <LeadsSection leads={leadsList} professionals={allProsList} />

      </div>
    </div>
  )
}

function ProfessionalCard({ pro, mode }: { pro: Professional; mode: 'pending' | 'active' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        {/* Info */}
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

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          {mode === 'pending' && (
            <>
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
            </>
          )}
          {mode === 'active' && (
            <form action={suspendProfessional.bind(null, pro.id)}>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Sospendi
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
