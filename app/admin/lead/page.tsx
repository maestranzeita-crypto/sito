import { createServerClient } from '@supabase/ssr'
import type { Database, LeadRequest, Professional } from '@/lib/database.types'
import LeadClient from './LeadClient'

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

export default async function LeadPage() {
  const service = createServiceClient()

  const [{ data: leads }, { data: pros }] = await Promise.all([
    service.from('lead_requests').select('*').order('created_at', { ascending: false }),
    service.from('professionals').select('id, ragione_sociale, citta, categorie, status, email, telefono, telegram_username').eq('status', 'active'),
  ])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Lead</h1>
        <p className="text-sm text-gray-400 mt-0.5">{leads?.length ?? 0} richieste totali</p>
      </div>
      <LeadClient
        leads={(leads ?? []) as LeadRequest[]}
        professionals={(pros ?? []) as Pick<Professional, 'id' | 'ragione_sociale' | 'citta' | 'categorie' | 'status' | 'email' | 'telefono' | 'telegram_username'>[]}
      />
    </div>
  )
}
