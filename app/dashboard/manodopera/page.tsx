import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Database, Professional, ManodoperaRequest, ManodoperaAvailability } from '@/lib/database.types'
import ManodoperaSection from './ManodoperaSection'

function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

// Mappa slug categorie → specializzazioni manodopera
function toSpecializzazioni(categorie: string[]): string[] {
  const map: Record<string, string[]> = {
    fotovoltaico:    ['Installatore FV'],
    elettricista:    ['Elettricista'],
    idraulico:       ['Idraulico'],
    muratore:        ['Muratore'],
    ristrutturazione:['Muratore', 'Cartongessista', 'Piastrellista', 'Imbianchino'],
  }
  const result: string[] = []
  const seen = new Set<string>()
  for (const s of categorie.flatMap((c) => map[c] ?? [])) {
    if (!seen.has(s)) { seen.add(s); result.push(s) }
  }
  return result
}

export default async function DashboardManodoperaPage() {
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

  const specializzazioni = toSpecializzazioni(pro.categorie)
  const today = new Date().toISOString().split('T')[0]

  const [
    { data: artigianiRaw },
    { data: richiesteRaw },
    { data: mieRichiesteRaw },
    { data: miaDisp },
  ] = await Promise.all([
    // Artigiani disponibili con specializzazione compatibile, ancora attivi (escludo me stesso)
    service
      .from('manodopera_availability')
      .select('*')
      .in('specializzazione', specializzazioni.length > 0 ? specializzazioni : ['__nessuna__'])
      .gte('disponibile_a', today)
      .neq('email', pro.email)
      .order('created_at', { ascending: false })
      .limit(50),
    // Richieste aperte con specializzazione compatibile
    service
      .from('manodopera_requests')
      .select('*')
      .in('specializzazione', specializzazioni.length > 0 ? specializzazioni : ['__nessuna__'])
      .gte('periodo_a', today)
      .neq('email', pro.email) // non mostrare le mie
      .order('created_at', { ascending: false })
      .limit(50),
    // Le mie richieste pubblicate
    service
      .from('manodopera_requests')
      .select('*')
      .eq('email', pro.email)
      .order('created_at', { ascending: false }),
    // La mia disponibilità attiva
    service
      .from('manodopera_availability')
      .select('*')
      .eq('email', pro.email)
      .gte('disponibile_a', today)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Mappa email → professional_id per link ai profili
  const artigianiEmails = (artigianiRaw ?? []).map((a) => a.email)
  const emailToProId: Record<string, string> = {}
  if (artigianiEmails.length > 0) {
    const { data: proEmails } = await service
      .from('professionals')
      .select('id, email')
      .in('email', artigianiEmails)
    for (const p of proEmails ?? []) emailToProId[p.email] = p.id
  }

  return (
    <ManodoperaSection
      pro={pro}
      specializzazioni={specializzazioni}
      artigianiDisponibili={(artigianiRaw ?? []) as ManodoperaAvailability[]}
      richiesteAperte={(richiesteRaw ?? []) as ManodoperaRequest[]}
      mieRichieste={(mieRichiesteRaw ?? []) as ManodoperaRequest[]}
      miaDisponibilita={(miaDisp ?? []) as ManodoperaAvailability[]}
      emailToProId={emailToProId}
    />
  )
}
