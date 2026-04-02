import { NextResponse } from 'next/server'
import { sendEmail, buildPasswordSetupEmailHtml } from '@/lib/emails'

// Endpoint di debug — RIMUOVERE DOPO IL TEST
// Chiamare: GET /api/debug-email?to=tua@email.com&secret=maestranze2024
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const to = searchParams.get('to')

  if (secret !== 'maestranze2024') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }
  if (!to) {
    return NextResponse.json({ error: 'Parametro ?to= mancante' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const diagnostics = {
    RESEND_API_KEY: resendKey ? `configurata (${resendKey.slice(0, 8)}...)` : 'MANCANTE',
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey ? 'configurata' : 'MANCANTE',
  }

  const sent = await sendEmail({
    to,
    subject: '[TEST] Email approvazione — Maestranze',
    html: buildPasswordSetupEmailHtml({
      ragioneSociale: 'Test Azienda SRL',
      passwordResetUrl: 'https://maestranze.com/dashboard',
    }),
  })

  return NextResponse.json({
    diagnostics,
    email_inviata: sent,
    destinatario: to,
  })
}
