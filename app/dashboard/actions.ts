'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { getStripe } from '@/lib/stripe'
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

// ── Storage client (service role per upload/delete) ──────────────────────────
function createStorageClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ── Upload foto profilo ───────────────────────────────────────────────────────
export async function uploadAvatar(formData: FormData): Promise<string> {
  const pro = await getAuthenticatedPro()
  const file = formData.get('file') as File
  if (!file || file.size === 0) throw new Error('File mancante')

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${pro.id}/avatar.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const storage = createStorageClient()
  const { error } = await storage.storage
    .from('avatars')
    .upload(path, buffer, { upsert: true, contentType: file.type })
  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = storage.storage.from('avatars').getPublicUrl(path)

  const service = createServiceClient()
  await service.from('professionals').update({ foto_url: publicUrl }).eq('id', pro.id)

  revalidatePath('/dashboard/profilo')
  return publicUrl
}

// ── Elimina foto profilo ──────────────────────────────────────────────────────
export async function deleteAvatar(): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  const { data: proData } = await service
    .from('professionals')
    .select('foto_url')
    .eq('id', pro.id)
    .single()

  if (proData?.foto_url) {
    const pathPart = proData.foto_url.split('/avatars/')[1]
    if (pathPart) {
      const storage = createStorageClient()
      await storage.storage.from('avatars').remove([pathPart])
    }
  }

  await service.from('professionals').update({ foto_url: null }).eq('id', pro.id)
  revalidatePath('/dashboard/profilo')
}

// ── Upload foto lavori (portfolio) ────────────────────────────────────────────
export async function uploadPortfolioPhoto(formData: FormData): Promise<string> {
  const pro = await getAuthenticatedPro()
  const file = formData.get('file') as File
  if (!file || file.size === 0) throw new Error('File mancante')

  const service = createServiceClient()
  const { data: proData } = await service
    .from('professionals')
    .select('foto_lavori')
    .eq('id', pro.id)
    .single()
  const current: string[] = (proData?.foto_lavori as string[]) ?? []
  if (current.length >= 10) throw new Error('Massimo 10 foto nel portfolio')

  const ext = file.name.split('.').pop() ?? 'jpg'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${pro.id}/${uniqueName}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const storage = createStorageClient()
  const { error } = await storage.storage
    .from('portfolio')
    .upload(path, buffer, { contentType: file.type })
  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = storage.storage.from('portfolio').getPublicUrl(path)
  const updated = [...current, publicUrl]
  await service.from('professionals').update({ foto_lavori: updated }).eq('id', pro.id)

  revalidatePath('/dashboard')
  return publicUrl
}

// ── Elimina foto lavori ───────────────────────────────────────────────────────
export async function deletePortfolioPhoto(photoUrl: string): Promise<void> {
  const pro = await getAuthenticatedPro()
  const service = createServiceClient()

  const { data: proData } = await service
    .from('professionals')
    .select('foto_lavori')
    .eq('id', pro.id)
    .single()
  const current: string[] = (proData?.foto_lavori as string[]) ?? []

  const pathPart = photoUrl.split('/portfolio/')[1]
  if (pathPart) {
    const storage = createStorageClient()
    await storage.storage.from('portfolio').remove([pathPart])
  }

  const updated = current.filter((u) => u !== photoUrl)
  await service.from('professionals').update({ foto_lavori: updated }).eq('id', pro.id)
  revalidatePath('/dashboard')
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
          unit_amount: 2900,
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
