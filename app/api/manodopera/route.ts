import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { sendEmail } from '@/lib/emails'

const ADMIN_EMAIL = 'info@maestranze.it'

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      auth: { persistSession: false },
    }
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Payload non valido' }, { status: 400 })
  }

  const data = body as Record<string, unknown>
  const { tipo } = data

  if (tipo !== 'request' && tipo !== 'availability') {
    return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (tipo === 'request') {
    const {
      nome, email, telefono,
      specializzazione, zona_cantiere,
      periodo_da, periodo_a,
      tipo_ingaggio, compenso,
      requisiti,
    } = data as Record<string, string> & { requisiti: string[] }

    if (!nome || !email || !telefono || !specializzazione || !zona_cantiere || !periodo_da || !periodo_a || !tipo_ingaggio || !compenso) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    const { error: dbError } = await supabase.from('manodopera_requests').insert({
      nome, email, telefono,
      specializzazione, zona_cantiere,
      periodo_da, periodo_a,
      tipo_ingaggio, compenso,
      requisiti: requisiti ?? [],
    })

    if (dbError) console.error('[API manodopera/request] DB error:', dbError.message)

    const html = buildRequestEmail({ nome, email, telefono, specializzazione, zona_cantiere, periodo_da, periodo_a, tipo_ingaggio, compenso, requisiti: requisiti ?? [] })
    void sendEmail({ to: ADMIN_EMAIL, subject: `Nuova richiesta manodopera — ${nome} cerca ${specializzazione} a ${zona_cantiere}`, html })

    return NextResponse.json({ ok: true })
  }

  // tipo === 'availability'
  const {
    nome, email, telefono,
    specializzazione, zona_operativa,
    disponibile_da, disponibile_a,
    tipo_collaborazione, tariffa,
    attrezzatura_propria, durc_valido,
  } = data as Record<string, string> & {
    tipo_collaborazione: string[]
    attrezzatura_propria: boolean
    durc_valido: boolean
  }

  if (!nome || !email || !telefono || !specializzazione || !zona_operativa || !disponibile_da || !disponibile_a || !tariffa) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('manodopera_availability').insert({
    nome, email, telefono,
    specializzazione, zona_operativa,
    disponibile_da, disponibile_a,
    tipo_collaborazione: tipo_collaborazione ?? [],
    tariffa,
    attrezzatura_propria: !!attrezzatura_propria,
    durc_valido: !!durc_valido,
  })

  if (dbError) console.error('[API manodopera/availability] DB error:', dbError.message)

  const html = buildAvailabilityEmail({ nome, email, telefono, specializzazione, zona_operativa, disponibile_da, disponibile_a, tipo_collaborazione: tipo_collaborazione ?? [], tariffa, attrezzatura_propria: !!attrezzatura_propria, durc_valido: !!durc_valido })
  void sendEmail({ to: ADMIN_EMAIL, subject: `Nuova disponibilità artigiano — ${nome} (${specializzazione}) a ${zona_operativa}`, html })

  return NextResponse.json({ ok: true })
}

// ─── Email builders ───────────────────────────────────────────────────────────

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;width:160px;">${label}</td><td style="padding:6px 0;font-weight:600;color:#0f172a;">${value || '—'}</td></tr>`
}

function buildRequestEmail(d: {
  nome: string; email: string; telefono: string
  specializzazione: string; zona_cantiere: string
  periodo_da: string; periodo_a: string
  tipo_ingaggio: string; compenso: string
  requisiti: string[]
}): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <h1 style="color:#f97316;font-size:20px;margin-top:0;">Nuova richiesta manodopera (impresa)</h1>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${row('Nome', d.nome)}
      ${row('Email', d.email)}
      ${row('Telefono', d.telefono)}
      ${row('Specializzazione', d.specializzazione)}
      ${row('Zona cantiere', d.zona_cantiere)}
      ${row('Periodo', `${d.periodo_da} → ${d.periodo_a}`)}
      ${row('Tipo ingaggio', d.tipo_ingaggio)}
      ${row('Compenso', d.compenso)}
      ${row('Requisiti', d.requisiti.length ? d.requisiti.join(', ') : 'Nessuno')}
    </table>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— Maestranze.com</p>
  </div>
</body></html>`
}

function buildAvailabilityEmail(d: {
  nome: string; email: string; telefono: string
  specializzazione: string; zona_operativa: string
  disponibile_da: string; disponibile_a: string
  tipo_collaborazione: string[]; tariffa: string
  attrezzatura_propria: boolean; durc_valido: boolean
}): string {
  return `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
    <h1 style="color:#f97316;font-size:20px;margin-top:0;">Nuova disponibilità artigiano</h1>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      ${row('Nome', d.nome)}
      ${row('Email', d.email)}
      ${row('Telefono', d.telefono)}
      ${row('Specializzazione', d.specializzazione)}
      ${row('Zona operativa', d.zona_operativa)}
      ${row('Disponibilità', `${d.disponibile_da} → ${d.disponibile_a}`)}
      ${row('Tipo collaborazione', d.tipo_collaborazione.length ? d.tipo_collaborazione.join(', ') : 'Non specificato')}
      ${row('Tariffa', d.tariffa)}
      ${row('Attrezzatura propria', d.attrezzatura_propria ? 'Sì' : 'No')}
      ${row('DURC valido', d.durc_valido ? 'Sì' : 'No')}
    </table>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— Maestranze.com</p>
  </div>
</body></html>`
}
