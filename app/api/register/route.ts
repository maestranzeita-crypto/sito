import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database, ProfessionalStatus } from '@/lib/database.types'
import { sendEmail, buildWelcomeEmailHtml } from '@/lib/emails'

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

  const {
    categorie, citta, raggio_km, ragione_sociale, piva,
    forma_giuridica, telefono, email, anni_esperienza, bio, telegram_username,
  } = body as Record<string, string | string[]>

  if (!categorie || !citta || !ragione_sociale || !piva || !forma_giuridica || !telefono || !email || !bio) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { error } = await supabase.from('professionals').insert({
    categorie: categorie as string[],
    citta: String(citta).toLowerCase().replace(/\s+/g, '-'),
    raggio_km: String(raggio_km ?? '50'),
    ragione_sociale: String(ragione_sociale),
    piva: String(piva),
    forma_giuridica: String(forma_giuridica),
    telefono: String(telefono),
    email: String(email),
    anni_esperienza: String(anni_esperienza ?? '5–10'),
    bio: String(bio),
    status: 'pending' as ProfessionalStatus,
    telegram_username: telegram_username ? String(telegram_username) : null,
  })

  if (error) {
    console.error('[API register] DB insert error:', error.message)
    return NextResponse.json({ error: 'Errore nel salvataggio. Riprova.' }, { status: 500 })
  }

  // Email di conferma ricezione registrazione (fire and forget)
  sendEmail({
    to: String(email),
    subject: 'Abbiamo ricevuto la tua richiesta — Maestranze',
    html: buildWelcomeEmailHtml({ ragioneSociale: String(ragione_sociale) }),
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
