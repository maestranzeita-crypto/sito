// Re-esporta tutti i template da email-templates.ts
export type {
  WelcomeEmailData,
  ApprovalEmailData,
  PasswordSetupEmailData,
  RejectionEmailData,
  LeadEmailData,
  ConfirmEmailData,
  AdminNotificationData,
  WaitlistNotifyEmailData,
  LeadTransferredToColleagueData,
  LeadTransferredToClientData,
} from '@/lib/email-templates'

export {
  buildWelcomeEmailHtml,
  buildApprovalEmailHtml,
  buildPasswordSetupEmailHtml,
  buildRejectionEmailHtml,
  buildLeadEmailHtml,
  buildConfirmEmailHtml,
  buildAdminNotificationEmailHtml,
  buildWaitlistNotifyEmailHtml,
  buildLeadTransferredToColleagueEmailHtml,
  buildLeadTransferredToClientEmailHtml,
} from '@/lib/email-templates'

// ─── Telegram sender helper ──────────────────────────────────────────────────

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN non configurata — messaggio non inviato')
    return false
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[Telegram] Errore ${res.status} inviando a ${chatId}:`, body)
      return false
    }
    return true
  } catch (err) {
    console.error('[Telegram] Errore invio messaggio:', err)
    return false
  }
}

// ─── Resend sender helper ────────────────────────────────────────────────────
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY non configurata — email non inviata')
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Maestranze <info@maestranze.com>',
        to,
        subject,
        html,
      }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[Resend] Errore ${res.status} inviando a ${to}:`, body)
      return false
    }
    return true
  } catch (err) {
    console.error('[Resend] Errore invio email:', err)
    return false
  }
}
