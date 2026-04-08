'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/lib/database.types'
import { getStripe, PRO_PLAN_PRICE_CENTS } from '@/lib/stripe'
import { SITE_URL } from '@/lib/utils'
import {
  sendEmail,
  sendTelegramMessage,
  buildWaitlistNotifyEmailHtml,
  buildLeadTransferredToColleagueEmailHtml,
  buildLeadTransferredToClientEmailHtml,
} from '@/lib/emails'
import { getCategoryBySlug } from '@/lib/categories'

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

async function getAuthenticatedPro() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const service = createServiceClient()
  const { data: pro } = await service
    .from('professionals')
    .select('id, categorie, citta, email')
    .eq('email', user.email!)
    .single()

  if (!pro) throw new Error('Profilo non trovato')
  return pro
}

export async function respondToLead(leadId: string, responseText: string) {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  // Verifica che il lead appartenga all'area del professionista
  const { data: lead } = await service
    .from('lead_requests')
    .select('id, categoria, citta, status')
    .eq('id', leadId)
    .single()

  if (!lead) throw new Error('Richiesta non trovata')
  if (!pro.categorie.includes(lead.categoria)) throw new Error('Non autorizzato')
  if (lead.citta !== pro.citta) throw new Error('Non autorizzato')

  const { error } = await service
    .from('lead_requests')
    .update({
      status: 'contacted',
      notes: responseText,
      contacted_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  if (error) throw new Error('Errore nel salvataggio')
  revalidatePath('/dashboard')
}

export async function replyToReview(reviewId: string, replyText: string) {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  const { data: review } = await service
    .from('reviews')
    .select('id, professional_id')
    .eq('id', reviewId)
    .single()

  if (!review || review.professional_id !== pro.id) throw new Error('Non autorizzato')

  const { error } = await service
    .from('reviews')
    .update({ risposta_professionista: replyText })
    .eq('id', reviewId)

  if (error) throw new Error('Errore nel salvataggio')
  revalidatePath('/dashboard')
}

// ── Tipo restituito da fetchColleagues ────────────────────────────────────────
export type ColleagueInfo = {
  id: string
  ragione_sociale: string
  rating_avg: number | null
  review_count: number
  telegram_username: string | null
}

// ── Modalità Pausa ────────────────────────────────────────────────────────────
export async function toggleAvailability() {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  const { data: current } = await service
    .from('professionals')
    .select('available')
    .eq('id', pro.id)
    .single()

  const newAvailable = !(current?.available ?? true)

  await service
    .from('professionals')
    .update({ available: newAvailable })
    .eq('id', pro.id)

  // Se torna disponibile: notifica tutti nella waitlist e svuota la lista
  if (newAvailable) {
    const { data: entries } = await service
      .from('waitlist')
      .select('email')
      .eq('professional_id', pro.id)

    if (entries && entries.length > 0) {
      const { data: proFull } = await service
        .from('professionals')
        .select('ragione_sociale, categorie')
        .eq('id', pro.id)
        .single()

      const categoriaLabel = proFull?.categorie?.[0]
        ? (getCategoryBySlug(proFull.categorie[0])?.nameShort ?? proFull.categorie[0])
        : 'professionista'

      const emailPromises = entries.map((entry) =>
        sendEmail({
          to: entry.email,
          subject: `${proFull?.ragione_sociale ?? 'Il professionista'} è tornato disponibile — Maestranze`,
          html: buildWaitlistNotifyEmailHtml({
            clienteEmail: entry.email,
            proName: proFull?.ragione_sociale ?? 'Il professionista',
            proId: pro.id,
            categoriaLabel,
          }),
        })
      )
      await Promise.allSettled(emailPromises)

      await service.from('waitlist').delete().eq('professional_id', pro.id)
    }
  }

  revalidatePath('/dashboard')
}

// ── Colleghi disponibili per cessione ────────────────────────────────────────
export async function fetchColleagues(categoria: string, citta: string): Promise<ColleagueInfo[]> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  const { data } = await service
    .from('professionals')
    .select('id, ragione_sociale, rating_avg, review_count, telegram_username')
    .eq('status', 'active')
    .eq('available', true)
    .eq('citta', citta)
    .contains('categorie', [categoria])
    .neq('id', pro.id)
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .limit(20)

  return (data ?? []) as ColleagueInfo[]
}

// ── Cessione lavoro ───────────────────────────────────────────────────────────
export async function transferLead(leadId: string, toProfessionalId: string) {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  // Verifica il lead
  const { data: lead } = await service
    .from('lead_requests')
    .select('id, categoria, citta, nome, email, telefono, descrizione, status')
    .eq('id', leadId)
    .single()

  if (!lead) throw new Error('Richiesta non trovata')
  if (!pro.categorie.includes(lead.categoria)) throw new Error('Non autorizzato')
  if (lead.citta !== pro.citta) throw new Error('Non autorizzato')
  if (lead.status !== 'pending') throw new Error('Richiesta non più cedibile')

  // Verifica il collega
  const { data: colleague } = await service
    .from('professionals')
    .select('id, ragione_sociale, email, telegram_username, categorie, citta')
    .eq('id', toProfessionalId)
    .eq('status', 'active')
    .eq('available', true)
    .single()

  if (!colleague) throw new Error('Collega non trovato o non disponibile')
  if (!colleague.categorie.includes(lead.categoria) || colleague.citta !== lead.citta) {
    throw new Error('Il collega non copre questa categoria o città')
  }

  // Cedente: ottieni nome
  const { data: cedenteFull } = await service
    .from('professionals')
    .select('ragione_sociale')
    .eq('id', pro.id)
    .single()

  const cedenteName = cedenteFull?.ragione_sociale ?? 'Un collega'

  // Assegna il lead al collega
  await service
    .from('lead_requests')
    .update({ assigned_professional_id: toProfessionalId })
    .eq('id', leadId)

  // +5 punti reputazione al cedente
  const { data: cedentePts } = await service
    .from('professionals')
    .select('reputation_points')
    .eq('id', pro.id)
    .single()
  await service
    .from('professionals')
    .update({ reputation_points: (cedentePts?.reputation_points ?? 0) + 5 })
    .eq('id', pro.id)

  const categoriaLabel = getCategoryBySlug(lead.categoria)?.nameShort ?? lead.categoria

  // Notifica collega via email
  sendEmail({
    to: colleague.email,
    subject: `Richiesta ceduta: ${categoriaLabel} a ${lead.citta} — Maestranze`,
    html: buildLeadTransferredToColleagueEmailHtml({
      collegaName: colleague.ragione_sociale,
      cedenteName,
      categoriaLabel,
      citta: lead.citta,
      clienteNome: lead.nome,
      clienteTelefono: lead.telefono,
      clienteEmail: lead.email,
      descrizione: lead.descrizione,
    }),
  }).catch(console.error)

  // Notifica collega via Telegram (se configurato)
  if (colleague.telegram_username) {
    sendTelegramMessage(
      colleague.telegram_username,
      `🔄 ${cedenteName} ti ha ceduto una richiesta di ${categoriaLabel} a ${lead.citta}.\n` +
        `Cliente: ${lead.nome} · ${lead.telefono}\n` +
        `Vai alla dashboard: ${SITE_URL}/dashboard`
    ).catch(console.error)
  }

  // Notifica cliente via email
  sendEmail({
    to: lead.email,
    subject: `Il tuo preventivo è stato preso in carico — Maestranze`,
    html: buildLeadTransferredToClientEmailHtml({
      clienteNome: lead.nome,
      collegaName: colleague.ragione_sociale,
      categoriaLabel,
      citta: lead.citta,
      proId: colleague.id,
    }),
  }).catch(console.error)

  revalidatePath('/dashboard')
}


// ── Salva foto profilo ────────────────────────────────────────────────────────
export async function saveFotoUrl(fotoUrl: string | null): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { error } = await service
    .from('professionals')
    .update({ foto_url: fotoUrl })
    .eq('id', pro.id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
  revalidatePath(`/professionisti/${pro.id}`)
}

// ── Salva foto lavori ─────────────────────────────────────────────────────────
export async function saveFotoLavori(fotoLavori: string[]): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { error } = await service
    .from('professionals')
    .update({ foto_lavori: fotoLavori })
    .eq('id', pro.id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
  revalidatePath(`/professionisti/${pro.id}`)
}

// ── Salva certificazioni ──────────────────────────────────────────────────────
export async function saveCertificazioni(certificazioni: string[]): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  await service
    .from('professionals')
    .update({ certificazioni })
    .eq('id', pro.id)
  revalidatePath('/dashboard')
  revalidatePath(`/professionisti/${pro.id}`)
}

// ── Salva link Google My Business ─────────────────────────────────────────────
export async function saveGmbLink(gmbLink: string): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  await service
    .from('professionals')
    .update({ gmb_link: gmbLink || null })
    .eq('id', pro.id)
  revalidatePath('/dashboard')
  revalidatePath(`/professionisti/${pro.id}`)
}

// ── Manodopera: pubblica richiesta impresa ────────────────────────────────────
export async function publishManodoperaRequest(data: {
  specializzazione: string
  zona_cantiere: string
  periodo_da: string
  periodo_a: string
  tipo_ingaggio: string
  compenso: string
  requisiti: string[]
}): Promise<void> {
  const pro = await getAuthenticatedPro()
  const { createClient: createSrv } = await import('@/lib/supabase/server')
  const supabase = await createSrv()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const service = createServiceClient()
  const { data: proFull } = await service
    .from('professionals')
    .select('ragione_sociale, telefono, email')
    .eq('id', pro.id)
    .single()

  if (!proFull) throw new Error('Profilo non trovato')

  const { error } = await service.from('manodopera_requests').insert({
    nome: proFull.ragione_sociale,
    email: proFull.email,
    telefono: proFull.telefono,
    ...data,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/manodopera')
}

// ── Manodopera: pubblica disponibilità artigiano ──────────────────────────────
export async function publishManodoperaAvailability(data: {
  specializzazione: string
  zona_operativa: string
  disponibile_da: string
  disponibile_a: string
  tipo_collaborazione: string[]
  tariffa: string
  attrezzatura_propria: boolean
  durc_valido: boolean
}): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  const { data: proFull } = await service
    .from('professionals')
    .select('ragione_sociale, telefono, email')
    .eq('id', pro.id)
    .single()

  if (!proFull) throw new Error('Profilo non trovato')

  const { error } = await service.from('manodopera_availability').insert({
    nome: proFull.ragione_sociale,
    email: proFull.email,
    telefono: proFull.telefono,
    ...data,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/manodopera')
}

// ── Manodopera: elimina richiesta ─────────────────────────────────────────────
export async function deleteManodoperaRequest(id: string): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { data: proFull } = await service.from('professionals').select('email').eq('id', pro.id).single()
  const { error } = await service.from('manodopera_requests').delete().eq('id', id).eq('email', proFull!.email)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/manodopera')
}

// ── Manodopera: elimina disponibilità ────────────────────────────────────────
export async function deleteManodoperaAvailability(id: string): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { data: proFull } = await service.from('professionals').select('email').eq('id', pro.id).single()
  const { error } = await service.from('manodopera_availability').delete().eq('id', id).eq('email', proFull!.email)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/manodopera')
}

// ── Chat: invia messaggio ─────────────────────────────────────────────────────
export async function sendChatMessage(receiverEmail: string, message: string): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { data: proFull } = await service.from('professionals').select('email').eq('id', pro.id).single()
  if (!proFull) throw new Error('Profilo non trovato')
  const { error } = await service.from('chat_messages').insert({
    sender_email: proFull.email,
    receiver_email: receiverEmail,
    message: message.trim(),
  })
  if (error) throw new Error(error.message)
}

// ── Chat: fetch messaggi thread ───────────────────────────────────────────────
export async function fetchChatThread(otherEmail: string): Promise<import('@/lib/database.types').ChatMessage[]> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { data: proFull } = await service.from('professionals').select('email').eq('id', pro.id).single()
  if (!proFull) return []
  const myEmail = proFull.email

  const { data } = await service
    .from('chat_messages')
    .select('*')
    .or(
      `and(sender_email.eq.${myEmail},receiver_email.eq.${otherEmail}),and(sender_email.eq.${otherEmail},receiver_email.eq.${myEmail})`
    )
    .order('created_at', { ascending: true })
    .limit(100)

  // Marca come letti i messaggi ricevuti non ancora letti
  const unread = (data ?? []).filter((m) => m.receiver_email === myEmail && !m.read_at).map((m) => m.id)
  if (unread.length > 0) {
    await service.from('chat_messages').update({ read_at: new Date().toISOString() }).in('id', unread)
  }

  return (data ?? []) as import('@/lib/database.types').ChatMessage[]
}

// ── Chat: lista conversazioni ─────────────────────────────────────────────────
export type ChatConversation = {
  otherEmail: string
  otherNome: string
  lastMessage: string
  lastAt: string
  unread: number
}

export async function fetchChatConversations(): Promise<ChatConversation[]> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()
  const { data: proFull } = await service.from('professionals').select('email').eq('id', pro.id).single()
  if (!proFull) return []
  const myEmail = proFull.email

  const { data: msgs } = await service
    .from('chat_messages')
    .select('*')
    .or(`sender_email.eq.${myEmail},receiver_email.eq.${myEmail}`)
    .order('created_at', { ascending: false })
    .limit(200)

  const threads = new Map<string, ChatConversation>()
  for (const m of msgs ?? []) {
    const other = m.sender_email === myEmail ? m.receiver_email : m.sender_email
    if (!threads.has(other)) {
      threads.set(other, { otherEmail: other, otherNome: other, lastMessage: m.message, lastAt: m.created_at, unread: 0 })
    }
    if (m.receiver_email === myEmail && !m.read_at) {
      threads.get(other)!.unread++
    }
  }

  // Arricchisci con nomi dai professionisti
  const emails = Array.from(threads.keys())
  if (emails.length > 0) {
    const { data: pros } = await service.from('professionals').select('email, ragione_sociale').in('email', emails)
    for (const p of pros ?? []) {
      if (threads.has(p.email)) threads.get(p.email)!.otherNome = p.ragione_sociale
    }
  }

  return Array.from(threads.values()).sort((a, b) => b.lastAt.localeCompare(a.lastAt))
}

export async function createProUpgradeCheckout() {
  const pro = await getAuthenticatedPro()

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          recurring: { interval: 'month' },
          unit_amount: PRO_PLAN_PRICE_CENTS,
          product_data: {
            name: 'Piano Pro — Maestranze',
            description: 'Richieste illimitate, badge Pro verificato, statistiche avanzate',
          },
        },
      },
    ],
    success_url: `${SITE_URL}/dashboard?upgrade=success`,
    cancel_url: `${SITE_URL}/dashboard`,
    metadata: { professional_id: pro.id },
  })

  if (!session.url) throw new Error('Errore creazione sessione Stripe')
  redirect(session.url)
}
