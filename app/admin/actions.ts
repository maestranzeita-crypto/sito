'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import {
  sendEmail,
  buildPasswordSetupEmailHtml,
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

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
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

  // Crea utente auth e genera link imposta password
  // NOTA: il template "Reset Password" su Supabase deve essere svuotato
  // così generateLink genera solo il link senza inviare la propria email
  let passwordResetUrl = 'https://maestranze.com/accedi'
  try {
    const adminAuth = createAdminClient()
    await adminAuth.auth.admin.createUser({ email, email_confirm: true })
    const { data: linkData, error: linkError } = await adminAuth.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: 'https://maestranze.com/auth/update-password' },
    })
    if (linkError) {
      console.error('[approveProfessional] generateLink error:', linkError.message)
    } else if (linkData?.properties?.action_link) {
      passwordResetUrl = linkData.properties.action_link
    }
  } catch (err) {
    console.error('[approveProfessional] errore generazione link password:', err)
  }

  const sent = await sendEmail({
    to: email,
    subject: 'Il tuo profilo Maestranze è attivo — imposta la tua password',
    html: buildPasswordSetupEmailHtml({ ragioneSociale, passwordResetUrl }),
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

export async function resendPasswordEmail(email: string, ragioneSociale: string) {
  await getAdminUser()

  let passwordResetUrl = 'https://maestranze.com/accedi'
  try {
    const adminAuth = createAdminClient()
    const { data: linkData, error: linkError } = await adminAuth.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: 'https://maestranze.com/auth/update-password' },
    })
    if (linkError) {
      console.error('[resendPasswordEmail] generateLink error:', linkError.message)
    } else if (linkData?.properties?.action_link) {
      passwordResetUrl = linkData.properties.action_link
    }
  } catch (err) {
    console.error('[resendPasswordEmail] errore generazione link:', err)
  }

  const sent = await sendEmail({
    to: email,
    subject: 'Imposta la tua password — Maestranze',
    html: buildPasswordSetupEmailHtml({ ragioneSociale, passwordResetUrl }),
  })

  if (!sent) console.error('[resendPasswordEmail] Email non inviata a', email)
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

export async function assignLeadManually(leadId: string, professionalId: string) {
  await getAdminUser()
  const supabase = createServiceClient()

  const [{ data: lead }, { data: pro }] = await Promise.all([
    supabase.from('lead_requests').select('*').eq('id', leadId).single(),
    supabase.from('professionals').select('*').eq('id', professionalId).single(),
  ])

  if (!lead || !pro) throw new Error('Lead o professionista non trovato')

  const { error } = await supabase
    .from('lead_requests')
    .update({ assigned_professional_id: professionalId, status: 'contacted' })
    .eq('id', leadId)

  if (error) throw new Error(error.message)

  if (pro.telegram_username) {
    await sendTelegramMessage(
      pro.telegram_username,
      `Nuovo lead assegnato da Maestranze!\n\nCliente: ${lead.nome}\nServizio: ${lead.categoria}\nCittà: ${lead.citta}\nTelefono: ${lead.telefono}\nEmail: ${lead.email}\n\nContattalo il prima possibile.`,
    )
  }

  await sendEmail({
    to: pro.email,
    subject: `Nuovo cliente assegnato — ${lead.categoria} a ${lead.citta}`,
    html: buildLeadAssignedEmail({ proName: pro.ragione_sociale, lead }),
  })

  revalidatePath('/admin')
}

function buildLeadAssignedEmail({
  proName,
  lead,
}: {
  proName: string
  lead: { nome: string; categoria: string; citta: string; telefono: string; email: string }
}): string {
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"><title>Nuovo lead assegnato</title></head>
<body style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <h1 style="color:#f97316;font-size:22px;margin-top:0;">Nuovo cliente assegnato</h1>
    <p style="color:#475569;">Ciao <strong>${proName}</strong>,</p>
    <p style="color:#475569;">Il team di Maestranze ti ha assegnato un nuovo cliente. Ecco i dettagli:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:100px;">Cliente</td><td style="padding:8px 0;font-weight:600;color:#0f172a;">${lead.nome}</td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Servizio</td><td style="padding:8px 0;font-weight:600;color:#0f172a;">${lead.categoria}</td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Città</td><td style="padding:8px 0;font-weight:600;color:#0f172a;">${lead.citta}</td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Telefono</td><td style="padding:8px 0;font-weight:600;color:#0f172a;">${lead.telefono}</td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td><td style="padding:8px 0;font-weight:600;color:#0f172a;">${lead.email}</td></tr>
    </table>
    <p style="color:#475569;">Contattalo il prima possibile per fornire un preventivo.</p>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— Team Maestranze.com</p>
  </div>
</body>
</html>`
}

