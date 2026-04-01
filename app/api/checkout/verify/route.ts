import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const sid = request.nextUrl.searchParams.get('sid')

  if (!sid) {
    return NextResponse.json({ paid: false, error: 'Session ID mancante' }, { status: 400 })
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sid)
    const paid = session.payment_status === 'paid'
    return NextResponse.json({ paid, category: session.metadata?.category, city: session.metadata?.city })
  } catch (err) {
    console.error('[checkout/verify] Errore:', err)
    return NextResponse.json({ paid: false, error: 'Sessione non trovata' }, { status: 404 })
  }
}
