import { NextRequest, NextResponse } from 'next/server'
import { getStripe, UNLOCK_PRICE_CENTS } from '@/lib/stripe'
import { SITE_URL } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { category, city } = await request.json()

    if (!category || !city) {
      return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 })
    }

    const successUrl = `${SITE_URL}/${category}/${city}?payment=success&sid={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${SITE_URL}/${category}/${city}`

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: UNLOCK_PRICE_CENTS,
            product_data: {
              name: 'Sblocca tutti i professionisti',
              description: `Accesso completo ai professionisti per la tua ricerca`,
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { category, city },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] Errore:', err)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
