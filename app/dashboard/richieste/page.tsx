import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'
import type { Database, LeadRequest, Professional } from '@/lib/database.types'
import { LeadsSection } from '../LeadsSection'

function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

export default async function RichiestePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  const service = createServiceClient()
  const { data: proData } = await service
    .from('professionals')
    .select('*')
    .eq('email', user.email!)
    .single()
  const pro = proData as Professional | null
  if (!pro) redirect('/dashboard')

  const { data: leadsData } = await service
    .from('lead_requests')
    .select('*')
    .in('categoria', pro.categorie)
    .eq('citta', pro.citta)
    .or(`assigned_professional_id.is.null,assigned_professional_id.eq.${pro.id}`)
    .order('created_at', { ascending: false })
    .limit(50)

  const leads = (leadsData as LeadRequest[] | null) ?? []

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Richieste ricevute</h1>
        <p className="text-slate-500 text-sm mt-0.5">Tutte le richieste di preventivo nella tua zona e categoria.</p>
      </div>
      <LeadsSection leads={leads} />
    </div>
  )
}
