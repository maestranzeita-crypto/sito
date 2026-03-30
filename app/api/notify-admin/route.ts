import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/emails'

const ADMIN_EMAIL = 'maestranze.ita@gmail.com'
const ADMIN_URL = 'https://maestranze.com/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { ragione_sociale, piva, email, telefono, categorie, citta } = body

    if (!ragione_sociale || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const categorieStr = Array.isArray(categorie) ? categorie.join(', ') : String(categorie ?? '')

    const html = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8" /><title>Nuova registrazione — Maestranze</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#1e293b;border-radius:16px 16px 0 0;padding:28px 32px;">
          <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
            Maest<span style="color:#f97316;">ranze</span>
            <span style="font-size:13px;font-weight:400;color:#94a3b8;margin-left:12px;">Admin</span>
          </span>
        </td></tr>
        <tr><td style="background:#fff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#f97316;text-transform:uppercase;letter-spacing:.08em;">Nuova registrazione</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:800;color:#0f172a;">${ragione_sociale}</h1>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:12px;width:130px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;">Ragione sociale</td>
                  <td style="padding-bottom:12px;font-size:15px;color:#0f172a;font-weight:600;">${ragione_sociale}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;">P.IVA</td>
                  <td style="padding-bottom:12px;font-size:15px;color:#0f172a;font-family:monospace;">${piva}</td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;">Email</td>
                  <td style="padding-bottom:12px;font-size:15px;"><a href="mailto:${email}" style="color:#f97316;text-decoration:none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;">Telefono</td>
                  <td style="padding-bottom:12px;font-size:15px;"><a href="tel:${telefono}" style="color:#f97316;text-decoration:none;">${telefono}</a></td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;">Servizi</td>
                  <td style="padding-bottom:12px;font-size:15px;color:#0f172a;">${categorieStr}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;vertical-align:top;">Città / Provincia</td>
                  <td style="font-size:15px;color:#0f172a;">${citta}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#f97316;border-radius:10px;">
              <a href="${ADMIN_URL}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
                Vai alla pagina admin →
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f1f5f9;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Maestranze.com — Notifica automatica</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Nuova registrazione — ${ragione_sociale}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-admin] Errore:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
