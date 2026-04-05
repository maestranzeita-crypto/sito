import type { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import ManodoperaClient from './ManodoperaClient'

export const metadata: Metadata = {
  title: 'Manodopera Edile — Trova Artigiani o Segnala Disponibilità',
  description:
    'Sei un\'impresa con un cantiere che parte? Trova artigiani qualificati disponibili nella tua zona. Sei un artigiano con tempo libero? Renditi disponibile e ricevi proposte.',
}

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false },
    }
  )
}

export default async function ManodoperaPage() {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [{ count: artigianiCount }, { count: cantieriCount }] = await Promise.all([
    supabase
      .from('manodopera_availability')
      .select('*', { count: 'exact', head: true })
      .gt('disponibile_a', today),
    supabase
      .from('manodopera_requests')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo),
  ])

  return (
    <ManodoperaClient
      artigianiCount={artigianiCount ?? 0}
      cantieriCount={cantieriCount ?? 0}
    />
  )
}
