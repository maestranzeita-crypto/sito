'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { sendEmail, buildApprovalEmailHtml, buildRejectionEmailHtml } from '@/lib/emails'

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

export async function approveProfessional(id: string, email: string, ragioneSociale: string) {
  await getAdminUser()
  const supabase = createServiceClient()

  await supabase
    .from('professionals')
    .update({ status: 'active', verified_at: new Date().toISOString() })
    .eq('id', id)

  await sendEmail({
    to: email,
    subject: 'Il tuo profilo Maestranze è attivo',
    html: buildApprovalEmailHtml({ ragioneSociale, profileId: id }),
  })

  revalidatePath('/admin')
}

export async function rejectProfessional(id: string, email: string, ragioneSociale: string) {
  await getAdminUser()
  const supabase = createServiceClient()

  await supabase
    .from('professionals')
    .update({ status: 'rejected' })
    .eq('id', id)

  await sendEmail({
    to: email,
    subject: 'Aggiornamento sulla tua richiesta',
    html: buildRejectionEmailHtml({ ragioneSociale }),
  })

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

