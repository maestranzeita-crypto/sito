import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

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

  const { professional_id, email } = body as Record<string, string>

  if (!professional_id || !email) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Verifica che il professionista esista
  const { data: pro } = await supabase
    .from('professionals')
    .select('id, available')
    .eq('id', professional_id)
    .eq('status', 'active')
    .single()

  if (!pro) {
    return NextResponse.json({ error: 'Professionista non trovato' }, { status: 404 })
  }
  if (pro.available) {
    return NextResponse.json({ error: 'Il professionista è già disponibile' }, { status: 409 })
  }

  const { error } = await supabase
    .from('waitlist')
    .upsert({ professional_id, email }, { onConflict: 'professional_id,email' })

  if (error) {
    console.error('[waitlist] DB error:', error.message)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
