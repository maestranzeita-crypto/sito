'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import {
  sendEmail,
  buildApprovalEmailHtml,
  buildRejectionEmailHtml,
  sendTelegramMessage,
} from '@/lib/emails'

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

const ADMIN_EMAIL = 'info@maestranze.com'

async function getAdminUser() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) throw new Error('Unauthorized')
  return user
}

export async function approveProfessional(
  id: string,
  email: string,
  ragioneSociale: string,
  telegramUsername?: string | null,
) {
  await getAdminUser()
  const supabase = createServiceClient()

  const { error: dbError } = await supabase
    .from('professionals')
    .update({ status: 'active', verified_at: new Date().toISOString() })
    .eq('id', id)

  if (dbError) {
    console.error('[approveProfessional] DB error:', dbError.message)
    redirect('/admin?error=db')
  }

  // Email di approvazione — un solo invio, nessuna dipendenza da Supabase Auth
  const sent = await sendEmail({
    to: email,
    subject: 'Il tuo profilo Maestranze è attivo!',
    html: buildApprovalEmailHtml({ ragioneSociale, profileId: id }),
  })
  if (!sent) {
    console.error('[approveProfessional] Email non inviata a', email)
  }

  // Messaggio Telegram (opzionale)
  if (telegramUsername) {
    const msg =
      `Ciao ${ragioneSociale}! Il tuo profilo su Maestranze.com è stato verificato e approvato. ` +
      `Da adesso sei visibile ai clienti della tua zona e riceverai richieste di preventivo direttamente qui. ` +
      `Benvenuto nella community! — Team Maestranze.com`
    await sendTelegramMessage(telegramUsername, msg)
  }

  revalidatePath('/admin')
}

export async function rejectProfessional(id: string, email: string, ragioneSociale: string) {
  await getAdminUser()
  const supabase = createServiceClient()

  const { error: dbError } = await supabase
    .from('professionals')
    .update({ status: 'rejected' })
    .eq('id', id)

  if (dbError) {
    console.error('[rejectProfessional] DB error:', dbError.message)
    redirect('/admin?error=db')
  }

  const sent = await sendEmail({
    to: email,
    subject: 'Aggiornamento sulla tua richiesta',
    html: buildRejectionEmailHtml({ ragioneSociale }),
  })

  if (!sent) {
    console.error('[rejectProfessional] Email non inviata a', email)
  }

  revalidatePath('/admin')
}

export async function suspendProfessional(id: string) {
  await getAdminUser()
  const supabase = createServiceClient()

  await supabase
    .from('professionals')
    .update({ status: 'suspended' })
    .eq('id', id)

  revalidatePath('/admin')
}

