'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { sendEmail } from '@/lib/emails'

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

const ADMIN_EMAIL = 'maestranze.ita@gmail.com'

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
    subject: 'Il tuo profilo è stato attivato su Maestranze.com',
    html: buildApprovalEmail(ragioneSociale),
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
    subject: 'Aggiornamento sulla tua richiesta di registrazione — Maestranze.com',
    html: buildRejectionEmail(ragioneSociale),
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

function buildApprovalEmail(ragioneSociale: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8" /><title>Profilo attivato — Maestranze</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#1e293b;border-radius:16px 16px 0 0;padding:28px 32px;">
          <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Maest<span style="color:#f97316;">ranze</span></span>
        </td></tr>
        <tr><td style="background:#fff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#dcfce7;border-radius:50%;font-size:28px;">✓</span>
          </div>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0f172a;text-align:center;">Profilo verificato e attivato!</h1>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
            Ciao <strong>${ragioneSociale}</strong>,
          </p>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
            Il tuo profilo è stato verificato e attivato su <strong>Maestranze.com</strong>. Da questo momento sei visibile ai clienti nella tua zona e puoi ricevere richieste di preventivo.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#f97316;border-radius:10px;">
              <a href="https://maestranze.com/dashboard" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">Vai alla dashboard →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f1f5f9;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Maestranze.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildRejectionEmail(ragioneSociale: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8" /><title>Aggiornamento richiesta — Maestranze</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#1e293b;border-radius:16px 16px 0 0;padding:28px 32px;">
          <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Maest<span style="color:#f97316;">ranze</span></span>
        </td></tr>
        <tr><td style="background:#fff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0f172a;">Aggiornamento sulla tua richiesta</h1>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
            Ciao <strong>${ragioneSociale}</strong>,
          </p>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
            La tua richiesta di registrazione su Maestranze.com non è stata approvata. Contattaci per maggiori informazioni o per risolvere eventuali problemi con la tua registrazione.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#1e293b;border-radius:10px;">
              <a href="mailto:maestranze.ita@gmail.com" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">Contattaci →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f1f5f9;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Maestranze.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
