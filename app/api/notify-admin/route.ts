import { NextResponse } from 'next/server'
import { sendEmail, buildAdminNotificationEmailHtml, buildWelcomeEmailHtml } from '@/lib/emails'

const ADMIN_EMAIL = 'info@maestranze.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ragione_sociale, piva, email, telefono, categorie, citta } = body

    if (!ragione_sociale || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await Promise.all([
      // Notifica admin
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `Nuova registrazione — ${ragione_sociale}`,
        html: buildAdminNotificationEmailHtml({ ragioneSociale: ragione_sociale, piva, email, telefono, categorie, citta }),
      }),
      // Benvenuto al professionista
      sendEmail({
        to: email,
        subject: 'Richiesta ricevuta — ti contattiamo entro 24 ore',
        html: buildWelcomeEmailHtml({ ragioneSociale: ragione_sociale }),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-admin] Errore:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
