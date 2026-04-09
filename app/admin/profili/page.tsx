import { createServerClient } from '@supabase/ssr'
import type { Database, Professional } from '@/lib/database.types'
import ProfiliClient from './ProfiliClient'

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

export default async function ProfiliPage() {
  const service = createServiceClient()

  const { data } = await service
    .from('professionals')
    .select('*')
    .in('status', ['active', 'suspended', 'rejected'])
    .order('created_at', { ascending: false })

  const professionals = (data ?? []) as Professional[]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Profili</h1>
        <p className="text-sm text-gray-400 mt-0.5">{professionals.length} profili totali</p>
      </div>
      <ProfiliClient professionals={professionals} />
    </div>
  )
}
