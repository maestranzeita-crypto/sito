import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import type { Professional, UrgenzaType } from '@/lib/database.types'
import { getCategoryBySlug } from '@/lib/categories'
import { buildLeadEmailHtml, buildConfirmEmailHtml, sendEmail } from '@/lib/emails'

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

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Payload non valido' }, { status: 400 })
  }

  const {
    request_type,
    categoria,
    citta,
    descrizione,
    urgenza,
    nome,
    telefono,
    email,
    job_details,
  } = body as Record<string, string> & { job_details?: Record<string, string> }

  if (!categoria || !citta || !nome || !telefono) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  const isCallback = request_type === 'callback'

  if (!isCallback && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const cittaNorm = citta.toLowerCase().replace(/\s+/g, '-')
  const cat = getCategoryBySlug(categoria)
  const categoriaLabel = cat?.nameShort ?? categoria

  // 1. Salva lead
  const { data: lead, error: leadError } = await supabase
    .from('lead_requests')
    .insert({
      categoria,
      citta: cittaNorm,
      descrizione: descrizione ?? '',
      urgenza: (urgenza ?? 'settimana') as UrgenzaType,
      nome,
      telefono,
      email: email ?? '',
      request_type: isCallback ? 'callback' : 'online',
      job_details: job_details ?? null,
    })
    .select('id')
    .single()

  if (leadError) {
    console.error('[API lead] DB insert error:', leadError.message)
  }

  const leadId = (lead as { id: string } | null)?.id ?? ''

  if (isCallback) {
    // 2a. Callback: email admin + conferma cliente
    const orario = job_details?.orario_preferito ?? 'non specificato'
    const adminHtml = buildCallbackAdminEmail({ nome, telefono, orario, categoria: categoriaLabel, citta, urgenza: urgenza ?? 'settimana', descrizione: descrizione ?? '' })
    const clientHtml = buildCallbackConfirmEmail({ nome, telefono })

    Promise.all([
      sendEmail({ to: ADMIN_EMAIL, subject: `Richiesta callback — ${nome} (${categoriaLabel} a ${citta})`, html: adminHtml }),
      sendEmail({ to: ADMIN_EMAIL, subject: `Richiesta callback — ${nome} (${categoriaLabel} a ${citta})`, html: adminHtml }),
    ]).catch((err) => console.error('[API lead] Callback email error:', err))

    // Conferma SMS-like via email (no email del cliente in callback)
    void sendEmail({ to: ADMIN_EMAIL, subject: `[CALLBACK] ${nome} · ${telefono} · ${categoriaLabel} · ${citta}`, html: adminHtml })

    return NextResponse.json({ ok: true, leadId })
  }

  // 2b. Online: notifica professionisti + conferma cliente
  const { data: prosData } = await supabase
    .from('professionals')
    .select('ragione_sociale, email, categorie, citta')
    .eq('status', 'active')
    .eq('available', true)
    .contains('categorie', [categoria])
    .eq('citta', cittaNorm)
    .limit(10)

  const pros: Pick<Professional, 'ragione_sociale' | 'email' | 'categorie' | 'citta'>[] =
    (prosData as typeof prosData & Pick<Professional, 'ragione_sociale' | 'email' | 'categorie' | 'citta'>[] | null) ?? []

  const proEmailPromises = pros.map((pro) =>
    sendEmail({
      to: pro.email,
      subject: `Nuova richiesta: ${categoriaLabel} a ${citta} — Maestranze`,
      html: buildLeadEmailHtml({
        proName: pro.ragione_sociale,
        proEmail: pro.email,
        categoria,
        categoriaLabel,
        citta,
        descrizione: descrizione ?? '',
        urgenza: urgenza ?? 'settimana',
        urgenzaLabel: urgenza ?? 'settimana',
        clienteNome: nome,
        clienteTelefono: telefono,
        clienteEmail: email,
        leadId,
      }),
    })
  )

  const confirmPromise = sendEmail({
    to: email,
    subject: `Richiesta ricevuta: ${categoriaLabel} a ${citta} — Maestranze`,
    html: buildConfirmEmailHtml({
      clienteNome: nome,
      clienteEmail: email,
      categoriaLabel,
      citta,
      descrizione: descrizione ?? '',
    }),
  })

  Promise.all([...proEmailPromises, confirmPromise]).catch((err) =>
    console.error('[API lead] Email error:', err)
  )

  return NextResponse.json({ ok: true, proCount: pros.length })
}

// ─── Email helpers callback ───────────────────────────────────────────────────

function buildCallbackAdminEmail({
  nome, telefono, orario, categoria, citta, urgenza, descrizione,
}: {
  nome: string; telefono: string; orario: string
  categoria: string; citta: string; urgenza: string; descrizione: string
}): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <h1 style="color:#f97316;font-size:20px;margin-top:0;">Nuova richiesta di callback</h1>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;width:130px;">Nome</td><td style="padding:6px 0;font-weight:600;color:#0f172a;">${nome}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Telefono</td><td style="padding:6px 0;font-weight:600;color:#0f172a;">${telefono}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Orario preferito</td><td style="padding:6px 0;font-weight:600;color:#0f172a;">${orario}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Servizio</td><td style="padding:6px 0;color:#0f172a;">${categoria}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Città</td><td style="padding:6px 0;color:#0f172a;">${citta}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Urgenza</td><td style="padding:6px 0;color:#0f172a;">${urgenza}</td></tr>
      <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Descrizione</td><td style="padding:6px 0;color:#0f172a;">${descrizione || '—'}</td></tr>
    </table>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— Maestranze.com</p>
  </div>
</body></html>`
}

function buildCallbackConfirmEmail({ nome, telefono }: { nome: string; telefono: string }): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <h1 style="color:#f97316;font-size:20px;margin-top:0;">Ti richiameremo presto!</h1>
    <p style="color:#475569;">Ciao <strong>${nome}</strong>,</p>
    <p style="color:#475569;">Abbiamo ricevuto la tua richiesta. Ti chiameremo al numero <strong>${telefono}</strong> entro le prossime 24 ore.</p>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— Team Maestranze.com</p>
  </div>
</body></html>`
}
