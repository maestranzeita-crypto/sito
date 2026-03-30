// Template email per Maestranze — inviati via Resend

export type LeadEmailData = {
  proName: string
  proEmail: string
  categoria: string
  categoriaLabel: string
  citta: string
  descrizione: string
  urgenza: string
  urgenzaLabel: string
  clienteNome: string
  clienteTelefono: string
  clienteEmail: string
  leadId: string
}

export type ConfirmEmailData = {
  clienteNome: string
  clienteEmail: string
  categoriaLabel: string
  citta: string
  descrizione: string
}

const URGENZA_LABEL: Record<string, string> = {
  urgente: 'Urgente (entro 48h)',
  settimana: 'Entro una settimana',
  mese: 'Entro un mese',
  nessuna: 'Non ha fretta',
}

// ─── EMAIL AL PROFESSIONISTA ─────────────────────────────────────────────────
export function buildLeadEmailHtml(data: LeadEmailData): string {
  const urgenzaLabel = URGENZA_LABEL[data.urgenza] ?? data.urgenza
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuova richiesta di preventivo — Maestranze</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:#1e293b;border-radius:16px 16px 0 0;padding:28px 32px;">
          <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
            Maest<span style="color:#f97316;">ranze</span>
          </span>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#f97316;text-transform:uppercase;letter-spacing:.08em;">
            Nuova richiesta di preventivo
          </p>
          <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
            Un cliente cerca un ${data.categoriaLabel} a ${data.citta}
          </h1>

          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
            Ciao <strong>${data.proName}</strong>, hai ricevuto una nuova richiesta di preventivo da un cliente nella tua zona.
          </p>

          <!-- DETTAGLI LAVORO -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Servizio richiesto</p>
              <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#0f172a;">${data.categoriaLabel} · ${data.citta}</p>

              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Urgenza</p>
              <p style="margin:0 0 16px;font-size:15px;color:#334155;">${urgenzaLabel}</p>

              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Descrizione</p>
              <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">${data.descrizione}</p>
            </td></tr>
          </table>

          <!-- CONTATTI CLIENTE -->
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f172a;">Contatti del cliente</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:12px;border:1px solid #fed7aa;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 8px;font-size:15px;color:#0f172a;"><strong>${data.clienteNome}</strong></p>
              <p style="margin:0 0 6px;font-size:14px;color:#334155;">📞 <a href="tel:${data.clienteTelefono}" style="color:#ea580c;font-weight:600;text-decoration:none;">${data.clienteTelefono}</a></p>
              <p style="margin:0;font-size:14px;color:#334155;">✉️ <a href="mailto:${data.clienteEmail}" style="color:#ea580c;font-weight:600;text-decoration:none;">${data.clienteEmail}</a></p>
            </td></tr>
          </table>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="background:#f97316;border-radius:10px;">
              <a href="mailto:${data.clienteEmail}?subject=Preventivo ${data.categoriaLabel} - Risposta alla tua richiesta&body=Gentile ${data.clienteNome},%0A%0AHo ricevuto la sua richiesta di preventivo per ${data.categoriaLabel} a ${data.citta}.%0A"
                 style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
                Rispondi al cliente →
              </a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
            Hai ricevuto questa email perché sei registrato su Maestranze come ${data.categoriaLabel} a ${data.citta}.
            Per gestire le tue preferenze accedi alla <a href="https://maestranze.com/dashboard" style="color:#f97316;">dashboard</a>.
          </p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f1f5f9;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            © ${new Date().getFullYear()} Maestranze.com — P.IVA IT00000000000
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── EMAIL DI CONFERMA AL CLIENTE ────────────────────────────────────────────
export function buildConfirmEmailHtml(data: ConfirmEmailData): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Richiesta ricevuta — Maestranze</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:#1e293b;border-radius:16px 16px 0 0;padding:28px 32px;">
          <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
            Maest<span style="color:#f97316;">ranze</span>
          </span>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#fff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <!-- Icona check -->
          <div style="text-align:center;margin-bottom:24px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#dcfce7;border-radius:50%;font-size:28px;">✓</span>
          </div>

          <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;text-align:center;">
            Richiesta ricevuta!
          </h1>
          <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.6;text-align:center;">
            Ciao <strong>${data.clienteNome}</strong>, abbiamo ricevuto la tua richiesta per <strong>${data.categoriaLabel}</strong> a <strong>${data.citta}</strong>.
          </p>

          <!-- RIEPILOGO -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Il tuo lavoro</p>
              <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${data.descrizione}</p>
            </td></tr>
          </table>

          <!-- STEPS -->
          <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0f172a;">Cosa succede adesso</p>
          ${[
            ['1', 'I professionisti verificati della tua zona ricevono la richiesta', '#f97316'],
            ['2', 'Entro 24 ore ti contattano direttamente con un preventivo', '#f97316'],
            ['3', 'Tu confronti le offerte e scegli in completa libertà', '#22c55e'],
          ].map(([n, text, color]) => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;width:100%;">
            <tr>
              <td style="width:32px;vertical-align:top;">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:${color};border-radius:50%;font-size:12px;font-weight:800;color:#fff;">${n}</span>
              </td>
              <td style="padding-left:12px;font-size:14px;color:#475569;line-height:1.6;">${text}</td>
            </tr>
          </table>`).join('')}

          <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.6;">
            Non ti invieremo spam. I tuoi dati sono condivisi solo con i professionisti che rispondo a questa richiesta.
          </p>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f1f5f9;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            © ${new Date().getFullYear()} Maestranze.com — P.IVA IT00000000000
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
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
        from: 'Maestranze <noreply@maestranze.com>',
        to,
        subject,
        html,
      }),
    })
    return res.ok
  } catch (err) {
    console.error('[Resend] Errore invio email:', err)
    return false
  }
}
