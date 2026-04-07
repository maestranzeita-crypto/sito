// Tutti i template email di Maestranze — usati via Resend

const YEAR = new Date().getFullYear()
const SITE = 'https://maestranze.com'
const ORANGE = '#f97316'
const DARK = '#0f172a'
const SLATE = '#475569'
const MUTED = '#94a3b8'
const BORDER = '#e2e8f0'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function header(): string {
  return `
  <tr>
    <td style="background-color:${ORANGE};border-radius:12px 12px 0 0;padding:24px 32px;">
      <span style="font-size:24px;font-weight:800;color:#ffffff;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.5px;">
        Maestranze
      </span>
    </td>
  </tr>`
}

function footer(): string {
  return `
  <tr>
    <td style="background-color:#f1f5f9;border-radius:0 0 12px 12px;border:1px solid ${BORDER};border-top:0;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;">
        <a href="${SITE}" style="color:${ORANGE};text-decoration:none;font-weight:600;">maestranze.com</a>
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">
        Maestranze.com — La piattaforma degli artigiani italiani &nbsp;·&nbsp; © ${YEAR}
      </p>
    </td>
  </tr>`
}

function cta(href: string, text: string): string {
  return `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
    <tr>
      <td style="background-color:${ORANGE};border-radius:8px;">
        <a href="${href}"
           style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`
}

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @media only screen and (max-width:600px){
      .wrap{width:100%!important}
      .body-pad{padding:24px 16px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table class="wrap" role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        ${header()}
        <tr>
          <td class="body-pad" style="background-color:#ffffff;padding:32px;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};">
            ${bodyHtml}
          </td>
        </tr>
        ${footer()}
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function steps(items: [string, string][]): string {
  return items.map(([num, text]) => `
  <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;width:100%;">
    <tr>
      <td style="width:32px;vertical-align:top;">
        <span style="display:inline-block;width:28px;height:28px;background-color:${ORANGE};border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">${num}</span>
      </td>
      <td style="padding-left:12px;font-size:14px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${text}</td>
    </tr>
  </table>`).join('')
}

function dataRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding-bottom:12px;width:130px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.06em;vertical-align:top;font-family:Arial,Helvetica,sans-serif;">${label}</td>
    <td style="padding-bottom:12px;font-size:15px;color:${DARK};font-family:Arial,Helvetica,sans-serif;">${value}</td>
  </tr>`
}

// ─── TEMPLATE 1 — BENVENUTO PROFESSIONISTA ───────────────────────────────────

export type WelcomeEmailData = {
  ragioneSociale: string
}

export function buildWelcomeEmailHtml(data: WelcomeEmailData): string {
  const body = `
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:${ORANGE};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">
    Richiesta ricevuta
  </p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:${DARK};line-height:1.3;font-family:Arial,Helvetica,sans-serif;">
    Ciao ${data.ragioneSociale}, ci siamo quasi!
  </h1>
  <p style="margin:0 0 24px;font-size:15px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Abbiamo ricevuto la tua richiesta di iscrizione a <strong>Maestranze.com</strong>.
    Il nostro team la verificherà entro <strong>24 ore</strong> e ti aggiorneremo via email non appena il profilo sarà attivo.
  </p>

  <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">Cosa succede adesso</p>
  ${steps([
    ['1', 'Verifichiamo la tua P.IVA e i dati inseriti — di solito entro poche ore.'],
    ['2', 'Attiviamo il tuo profilo pubblico su Maestranze.com.'],
    ['3', 'Inizi a ricevere richieste di preventivo dai clienti nella tua zona.'],
  ])}

  <p style="margin:28px 0 0;font-size:14px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Per qualsiasi domanda scrivi a
    <a href="mailto:info@maestranze.it" style="color:${ORANGE};text-decoration:none;font-weight:600;">info@maestranze.it</a>.<br><br>
    A presto,<br>
    <strong>Alonzo — Team Maestranze</strong>
  </p>`

  return layout('Richiesta ricevuta — Maestranze', body)
}

// ─── TEMPLATE 2 — PROFILO APPROVATO ─────────────────────────────────────────

export type ApprovalEmailData = {
  ragioneSociale: string
  profileId: string
}

export function buildApprovalEmailHtml(data: ApprovalEmailData): string {
  const profileUrl = `${SITE}/professionisti/${data.profileId}`

  const body = `
  <div style="text-align:center;margin-bottom:24px;">
    <span style="display:inline-block;width:64px;height:64px;background-color:#dcfce7;border-radius:50%;text-align:center;line-height:64px;font-size:28px;">✓</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${DARK};text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Il tuo profilo è attivo!
  </h1>
  <p style="margin:0 0 28px;font-size:15px;color:${SLATE};line-height:1.6;text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.ragioneSociale}</strong>, da adesso sei visibile ai clienti della tua zona
    e puoi ricevere richieste di preventivo direttamente su Maestranze.com.
  </p>

  ${cta(`${SITE}/dashboard/profilo`, 'Completa il profilo →')}

  <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">3 consigli per ricevere più richieste</p>
  ${steps([
    ['1', 'Carica una <strong>foto professionale</strong> — i profili con foto ricevono il 60% di richieste in più.'],
    ['2', 'Scrivi una <strong>descrizione dettagliata</strong> dei tuoi servizi e delle zone in cui operi.'],
    ['3', 'Aggiungi <strong>foto dei tuoi lavori</strong> per dare fiducia ai potenziali clienti.'],
  ])}

  <p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Il tuo profilo pubblico:
    <a href="${profileUrl}" style="color:${ORANGE};text-decoration:none;">${profileUrl}</a>
  </p>`

  return layout('Il tuo profilo Maestranze è attivo', body)
}

// ─── TEMPLATE 3 — PROFILO RIFIUTATO ─────────────────────────────────────────

export type RejectionEmailData = {
  ragioneSociale: string
}

export function buildRejectionEmailHtml(data: RejectionEmailData): string {
  const body = `
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:${DARK};font-family:Arial,Helvetica,sans-serif;">
    Aggiornamento sulla tua richiesta
  </h1>
  <p style="margin:0 0 16px;font-size:15px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.ragioneSociale}</strong>,
  </p>
  <p style="margin:0 0 16px;font-size:15px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Dopo aver verificato i dati della tua richiesta, al momento non siamo in grado di attivare il profilo su Maestranze.com.
    Questo può essere dovuto a informazioni incomplete, una P.IVA non verificabile o una categoria non ancora disponibile nella tua zona.
  </p>
  <p style="margin:0 0 28px;font-size:15px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Se pensi ci sia un errore o vuoi fornire ulteriori informazioni, scrivici direttamente — siamo felici di rivalutare la tua richiesta.
  </p>
  ${cta('mailto:info@maestranze.it', 'Scrivi a info@maestranze.it →')}
  <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Grazie per aver scelto Maestranze.com.<br>
    <strong>Team Maestranze</strong>
  </p>`

  return layout('Aggiornamento sulla tua richiesta — Maestranze', body)
}

// ─── TEMPLATE 4 — NUOVA RICHIESTA PREVENTIVO (al professionista) ─────────────

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

const URGENZA_LABEL: Record<string, string> = {
  urgente: 'Urgente (entro 48h)',
  settimana: 'Entro una settimana',
  mese: 'Entro un mese',
  nessuna: 'Non ha fretta',
}

export function buildLeadEmailHtml(data: LeadEmailData): string {
  const urgenzaLabel = URGENZA_LABEL[data.urgenza] ?? data.urgenza
  const mailtoHref = `mailto:${data.clienteEmail}?subject=Preventivo ${data.categoriaLabel} — Risposta alla tua richiesta&body=Gentile ${data.clienteNome},%0A%0AHo ricevuto la sua richiesta di preventivo per ${data.categoriaLabel} a ${data.citta}.%0A`

  const body = `
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:${ORANGE};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">
    Nuova richiesta di preventivo
  </p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:${DARK};line-height:1.3;font-family:Arial,Helvetica,sans-serif;">
    Un cliente cerca un ${data.categoriaLabel} a ${data.citta}
  </h1>
  <p style="margin:0 0 24px;font-size:15px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.proName}</strong>, hai ricevuto una nuova richiesta di preventivo.
    Rispondi subito — la richiesta è stata inviata a <strong>massimo 3 professionisti</strong>.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#f8fafc;border-radius:10px;border:1px solid ${BORDER};margin-bottom:20px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Servizio richiesto</p>
      <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">${data.categoriaLabel} · ${data.citta}</p>

      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Urgenza</p>
      <p style="margin:0 0 16px;font-size:15px;color:#334155;font-family:Arial,Helvetica,sans-serif;">${urgenzaLabel}</p>

      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Descrizione</p>
      <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${data.descrizione}</p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#fff7ed;border-radius:10px;border:1px solid #fed7aa;margin-bottom:28px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Contatti del cliente</p>
      <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">${data.clienteNome}</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;font-family:Arial,Helvetica,sans-serif;">
        &#128222; <a href="tel:${data.clienteTelefono}" style="color:${ORANGE};font-weight:600;text-decoration:none;">${data.clienteTelefono}</a>
      </p>
      <p style="margin:0;font-size:14px;color:#334155;font-family:Arial,Helvetica,sans-serif;">
        &#9993; <a href="mailto:${data.clienteEmail}" style="color:${ORANGE};font-weight:600;text-decoration:none;">${data.clienteEmail}</a>
      </p>
    </td></tr>
  </table>

  ${cta(`${SITE}/dashboard`, 'Rispondi adesso →')}

  <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Ricevi queste email perché sei registrato su Maestranze come <strong>${data.categoriaLabel}</strong> a ${data.citta}.
    Gestisci le notifiche dalla <a href="${SITE}/dashboard" style="color:${ORANGE};text-decoration:none;">dashboard</a>.
  </p>`

  return layout(`Nuova richiesta di preventivo — ${data.categoriaLabel} a ${data.citta}`, body)
}

// ─── TEMPLATE 4b — CONFERMA AL CLIENTE ───────────────────────────────────────

export type ConfirmEmailData = {
  clienteNome: string
  clienteEmail: string
  categoriaLabel: string
  citta: string
  descrizione: string
}

export function buildConfirmEmailHtml(data: ConfirmEmailData): string {
  const body = `
  <div style="text-align:center;margin-bottom:24px;">
    <span style="display:inline-block;width:64px;height:64px;background-color:#dcfce7;border-radius:50%;text-align:center;line-height:64px;font-size:28px;">✓</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${DARK};text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Richiesta ricevuta!
  </h1>
  <p style="margin:0 0 28px;font-size:15px;color:${SLATE};line-height:1.6;text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.clienteNome}</strong>, abbiamo inoltrato la tua richiesta per
    <strong>${data.categoriaLabel}</strong> a <strong>${data.citta}</strong> ai professionisti verificati della zona.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#f8fafc;border-radius:10px;border:1px solid ${BORDER};margin-bottom:28px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">La tua richiesta</p>
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${data.descrizione}</p>
    </td></tr>
  </table>

  <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">Cosa succede adesso</p>
  ${steps([
    ['1', 'I professionisti verificati nella tua zona ricevono la richiesta.'],
    ['2', 'Entro 24 ore ti contattano direttamente con un preventivo.'],
    ['3', 'Tu confronti le offerte e scegli in completa libertà.'],
  ])}

  <p style="margin:20px 0 0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    I tuoi dati sono condivisi solo con i professionisti che rispondono a questa richiesta.
  </p>`

  return layout('Richiesta ricevuta — Maestranze', body)
}

// ─── TEMPLATE 2b — SETUP PASSWORD DOPO APPROVAZIONE ─────────────────────────

export type PasswordSetupEmailData = {
  ragioneSociale: string
  passwordResetUrl: string
}

export function buildPasswordSetupEmailHtml(data: PasswordSetupEmailData): string {
  const body = `
  <div style="text-align:center;margin-bottom:24px;">
    <span style="display:inline-block;width:64px;height:64px;background-color:#dcfce7;border-radius:50%;text-align:center;line-height:64px;font-size:28px;">✓</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${DARK};text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Il tuo profilo è attivo!
  </h1>
  <p style="margin:0 0 28px;font-size:15px;color:${SLATE};line-height:1.6;text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.ragioneSociale}</strong>, il tuo profilo su Maestranze.com è stato verificato e approvato.
    Da adesso sei visibile ai clienti della tua zona.
  </p>

  <p style="margin:0 0 16px;font-size:15px;color:${DARK};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Per accedere alla tua dashboard e completare il profilo, imposta una password:
  </p>

  ${cta(data.passwordResetUrl, 'Imposta la tua password →')}

  <p style="margin:0 0 24px;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Il link è valido per 24 ore. Se scade, scrivici a
    <a href="mailto:info@maestranze.it" style="color:${ORANGE};text-decoration:none;">info@maestranze.it</a>
    e ne generiamo uno nuovo.
  </p>

  <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">Da adesso puoi</p>
  ${steps([
    ['1', 'Accedere alla dashboard e <strong>completare il profilo</strong> con foto e descrizione dettagliata.'],
    ['2', 'Ricevere <strong>richieste di preventivo</strong> dai clienti nella tua zona.'],
    ['3', 'Costruire la tua <strong>reputazione con le recensioni</strong> dei clienti soddisfatti.'],
  ])}

  <p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Bentornato nella community!<br>
    <strong>Team Maestranze</strong>
  </p>`

  return layout('Il tuo profilo Maestranze è attivo — imposta la tua password', body)
}

// ─── TEMPLATE 5 — NOTIFICA ADMIN NUOVA REGISTRAZIONE ─────────────────────────

export type AdminNotificationData = {
  ragioneSociale: string
  piva: string
  email: string
  telefono: string
  categorie: string[] | string
  citta: string
}

export function buildAdminNotificationEmailHtml(data: AdminNotificationData): string {
  const categorieStr = Array.isArray(data.categorie) ? data.categorie.join(', ') : String(data.categorie ?? '')

  const body = `
  <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:${ORANGE};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">
    Nuova registrazione
  </p>
  <h1 style="margin:0 0 24px;font-size:22px;font-weight:800;color:${DARK};font-family:Arial,Helvetica,sans-serif;">
    ${data.ragioneSociale}
  </h1>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#f8fafc;border-radius:10px;border:1px solid ${BORDER};margin-bottom:28px;">
    <tr><td style="padding:20px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${dataRow('Ragione sociale', `<strong>${data.ragioneSociale}</strong>`)}
        ${dataRow('P.IVA', `<span style="font-family:monospace;">${data.piva}</span>`)}
        ${dataRow('Email', `<a href="mailto:${data.email}" style="color:${ORANGE};text-decoration:none;">${data.email}</a>`)}
        ${dataRow('Telefono', `<a href="tel:${data.telefono}" style="color:${ORANGE};text-decoration:none;">${data.telefono}</a>`)}
        ${dataRow('Servizi', categorieStr)}
        ${dataRow('Città / Zona', data.citta)}
      </table>
    </td></tr>
  </table>

  ${cta(`${SITE}/admin`, 'Vai all\'admin →')}`

  return layout(`Nuova registrazione — ${data.ragioneSociale}`, body)
}

// ─── TEMPLATE 6 — WAITLIST: PRO TORNATO DISPONIBILE ─────────────────────────

export type WaitlistNotifyEmailData = {
  clienteEmail: string
  proName: string
  proId: string
  categoriaLabel: string
}

export function buildWaitlistNotifyEmailHtml(data: WaitlistNotifyEmailData): string {
  const profileUrl = `${SITE}/professionisti/${data.proId}`

  const body = `
  <div style="text-align:center;margin-bottom:24px;">
    <span style="display:inline-block;width:64px;height:64px;background-color:#dcfce7;border-radius:50%;text-align:center;line-height:64px;font-size:28px;">🟢</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${DARK};text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Il professionista è tornato disponibile!
  </h1>
  <p style="margin:0 0 28px;font-size:15px;color:${SLATE};line-height:1.6;text-align:center;font-family:Arial,Helvetica,sans-serif;">
    <strong>${data.proName}</strong> (${data.categoriaLabel}) che avevi salvato nella lista d'attesa
    è ora nuovamente disponibile su Maestranze.com.
  </p>

  ${cta(`${profileUrl}`, 'Richiedi un preventivo →')}

  <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Hai ricevuto questa email perché hai richiesto di essere avvisato quando ${data.proName} tornasse disponibile.
  </p>`

  return layout(`${data.proName} è tornato disponibile — Maestranze`, body)
}

// ─── TEMPLATE 7 — LEAD CEDUTO AL COLLEGA ────────────────────────────────────

export type LeadTransferredToColleagueData = {
  collegaName: string
  cedenteName: string
  categoriaLabel: string
  citta: string
  clienteNome: string
  clienteTelefono: string
  clienteEmail: string
  descrizione: string
}

export function buildLeadTransferredToColleagueEmailHtml(data: LeadTransferredToColleagueData): string {
  const body = `
  <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:${ORANGE};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">
    Richiesta ceduta da un collega
  </p>
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:${DARK};line-height:1.3;font-family:Arial,Helvetica,sans-serif;">
    ${data.cedenteName} ti ha ceduto una richiesta di preventivo
  </h1>
  <p style="margin:0 0 24px;font-size:15px;color:${SLATE};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.collegaName}</strong>, il tuo collega <strong>${data.cedenteName}</strong>
    non era disponibile e ha pensato a te per questa richiesta di ${data.categoriaLabel} a ${data.citta}.
    Contatta il cliente il prima possibile!
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#f8fafc;border-radius:10px;border:1px solid ${BORDER};margin-bottom:20px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Servizio richiesto</p>
      <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">${data.categoriaLabel} · ${data.citta}</p>
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Descrizione</p>
      <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${data.descrizione}</p>
    </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background-color:#fff7ed;border-radius:10px;border:1px solid #fed7aa;margin-bottom:28px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:.08em;font-family:Arial,Helvetica,sans-serif;">Contatti del cliente</p>
      <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${DARK};font-family:Arial,Helvetica,sans-serif;">${data.clienteNome}</p>
      <p style="margin:0 0 6px;font-size:14px;color:#334155;font-family:Arial,Helvetica,sans-serif;">
        &#128222; <a href="tel:${data.clienteTelefono}" style="color:${ORANGE};font-weight:600;text-decoration:none;">${data.clienteTelefono}</a>
      </p>
      <p style="margin:0;font-size:14px;color:#334155;font-family:Arial,Helvetica,sans-serif;">
        &#9993; <a href="mailto:${data.clienteEmail}" style="color:${ORANGE};font-weight:600;text-decoration:none;">${data.clienteEmail}</a>
      </p>
    </td></tr>
  </table>

  ${cta(`${SITE}/dashboard`, 'Vai alla dashboard →')}

  <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Questa richiesta è stata ceduta direttamente a te da un collega di Maestranze.com.
  </p>`

  return layout(`Richiesta ceduta: ${data.categoriaLabel} a ${data.citta}`, body)
}

// ─── TEMPLATE 8 — NOTIFICA CLIENTE: RICHIESTA PRESA IN CARICO ───────────────

export type LeadTransferredToClientData = {
  clienteNome: string
  collegaName: string
  categoriaLabel: string
  citta: string
  proId: string
}

export function buildLeadTransferredToClientEmailHtml(data: LeadTransferredToClientData): string {
  const profileUrl = `${SITE}/professionisti/${data.proId}`

  const body = `
  <div style="text-align:center;margin-bottom:24px;">
    <span style="display:inline-block;width:64px;height:64px;background-color:#dbeafe;border-radius:50%;text-align:center;line-height:64px;font-size:28px;">👷</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${DARK};text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Il tuo preventivo è in buone mani!
  </h1>
  <p style="margin:0 0 28px;font-size:15px;color:${SLATE};line-height:1.6;text-align:center;font-family:Arial,Helvetica,sans-serif;">
    Ciao <strong>${data.clienteNome}</strong>, la tua richiesta di <strong>${data.categoriaLabel}</strong>
    a <strong>${data.citta}</strong> è stata presa in carico da
    <strong>${data.collegaName}</strong> su Maestranze.com.
    Ti contatterà al più presto con un preventivo.
  </p>

  ${cta(profileUrl, `Vedi il profilo di ${data.collegaName} →`)}

  <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
    Hai ricevuto questa email perché hai inviato una richiesta di preventivo su Maestranze.com.
  </p>`

  return layout(`Il tuo preventivo è stato preso in carico — Maestranze`, body)
}
