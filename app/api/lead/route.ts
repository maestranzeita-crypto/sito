import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import type { Professional, UrgenzaType } from '@/lib/database.types'
import { getCategoryBySlug } from '@/lib/categories'
import { buildLeadEmailHtml, buildConfirmEmailHtml, sendEmail } from '@/lib/emails'

// Usa service_role per bypassare RLS in lettura (professionisti) e scrittura (lead)
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

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Payload non valido' }, { status: 400 })
  }

  const { categoria, citta, descrizione, urgenza, nome, telefono, email } = body as Record<string, string>

  // Validazione base
  if (!categoria || !citta || !descrizione || !nome || !telefono || !email) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // 1. Salva il lead
  const { data: lead, error: leadError } = await supabase
    .from('lead_requests')
    .insert({ categoria, citta: citta.toLowerCase().replace(/\s+/g, '-'), descrizione, urgenza: (urgenza ?? 'settimana') as UrgenzaType, nome, telefono, email })
    .select('id')
    .single()

  if (leadError) {
    console.error('[API lead] DB insert error:', leadError.message)
    // Non blocchiamo: rispondiamo successo comunque per non perdere la UX
  }

  const leadId = (lead as { id: string } | null)?.id ?? ''
  const cat = getCategoryBySlug(categoria)
  const categoriaLabel = cat?.nameShort ?? categoria

  // 2. Trova professionisti attivi e disponibili che coprono questa categoria + città
  const { data: prosData } = await supabase
    .from('professionals')
    .select('ragione_sociale, email, categorie, citta')
    .eq('status', 'active')
    .eq('available', true)
    .contains('categorie', [categoria])
    .eq('citta', citta.toLowerCase().replace(/\s+/g, '-'))
    .limit(10)

  const pros: Pick<Professional, 'ragione_sociale' | 'email' | 'categorie' | 'citta'>[] =
    (prosData as typeof prosData & Pick<Professional, 'ragione_sociale' | 'email' | 'categorie' | 'citta'>[] | null) ?? []

  // 3. Invia email ai professionisti (in parallelo, con waitUntil-like pattern)
  const proEmailPromises = pros.map((pro) =>
    sendEmail({
      to: pro.email,
      subject: `Nuova richiesta: ${categoriaLabel} a ${citta} — Maestranze`,
      html: buildLeadEmailHtml({
        proName: pro.ragione_sociale,
        proEmail: pro.email,
        categoria,
        categoriaLabel,
        citta,
        descrizione,
        urgenza: urgenza ?? 'settimana',
        urgenzaLabel: urgenza ?? 'settimana',
        clienteNome: nome,
        clienteTelefono: telefono,
        clienteEmail: email,
        leadId,
      }),
    })
  )

  // 4. Invia conferma al cliente
  const confirmPromise = sendEmail({
    to: email,
    subject: `Richiesta ricevuta: ${categoriaLabel} a ${citta} — Maestranze`,
    html: buildConfirmEmailHtml({
      clienteNome: nome,
      clienteEmail: email,
      categoriaLabel,
      citta,
      descrizione,
    }),
  })

  // Fire-and-forget: non aspettiamo le email per rispondere al client
  Promise.all([...proEmailPromises, confirmPromise]).catch((err) =>
    console.error('[API lead] Email error:', err)
  )

  return NextResponse.json({ ok: true, proCount: pros.length })
}
