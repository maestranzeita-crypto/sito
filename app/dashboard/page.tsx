import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Inbox, Star, TrendingUp, TrendingDown, ArrowRight, AlertCircle,
  Zap, CheckCircle2, BarChart2, Crown, ShieldCheck, ExternalLink,
} from 'lucide-react'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@/lib/supabase/server'
import type { Database, LeadRequest, Professional, Review } from '@/lib/database.types'
import { getCategoryBySlug } from '@/lib/categories'
import { LeadsSection } from './LeadsSection'
import { ReviewsSection } from './ReviewsSection'
import { AvailabilityToggle } from './AvailabilityToggle'
import { createProUpgradeCheckout } from './actions'

// ── Service-role client (bypassa RLS per lettura dati dashboard) ──
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

// ── Helpers ──────────────────────────────────────────────────────

type DisplayStatus = 'nuovo' | 'risposto' | 'confermato' | 'scaduto'

function getDisplayStatus(lead: LeadRequest): DisplayStatus {
  if (lead.status === 'closed') return 'confermato'
  if (lead.status === 'contacted') return 'risposto'
  const ageMs = Date.now() - new Date(lead.created_at).getTime()
  return ageMs > 48 * 60 * 60 * 1000 ? 'scaduto' : 'nuovo'
}

function startOfMonth(offsetMonths = 0) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offsetMonths)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfWeek(offsetWeeks = 0) {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - day + offsetWeeks * 7)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

type CompletenessItem = { label: string; pct: number; href: string; filled: boolean }

function computeCompleteness(pro: Professional): { total: number; missing: CompletenessItem[] } {
  const items: CompletenessItem[] = [
    { label: 'Foto profilo',          pct: 20, href: '/dashboard/profilo#foto',       filled: !!pro.foto_url },
    { label: 'Descrizione / Bio',     pct: 20, href: '/dashboard/profilo#bio',        filled: pro.bio.length > 20 },
    { label: 'Servizi selezionati',   pct: 15, href: '/dashboard/profilo#categorie',  filled: pro.categorie.length > 0 },
    { label: 'Zona operativa',        pct: 15, href: '/dashboard/profilo#zona',       filled: !!(pro.citta && pro.raggio_km) },
    { label: 'Certificazioni',        pct: 15, href: '/dashboard/profilo#cert',       filled: (pro.certificazioni ?? []).length > 0 },
    { label: 'Link Google My Business', pct: 15, href: '/dashboard/profilo#gmb',     filled: !!pro.gmb_link },
  ]
  const total = items.filter((i) => i.filled).reduce((s, i) => s + i.pct, 0)
  const missing = items.filter((i) => !i.filled)
  return { total, missing }
}

// ── Componenti di supporto ────────────────────────────────────────

function StatCard({
  label, value, sub, color = 'text-slate-900',
}: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className={`text-3xl font-extrabold mb-1 ${color}`}>{value}</div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function DeltaBadge({ current, previous, label }: { current: number; previous: number; label: string }) {
  const diff = current - previous
  const up = diff > 0
  const same = diff === 0
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="text-3xl font-extrabold text-slate-900 mb-1">{current}</div>
      <div className="text-xs font-semibold text-slate-500 mb-2">{label}</div>
      {same ? (
        <span className="text-xs text-slate-400">Uguale alla settimana precedente</span>
      ) : (
        <span className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
          {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {up ? '+' : ''}{diff} vs periodo precedente
        </span>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/accedi')

  const service = createServiceClient()

  // Profilo professionale
  const { data: proData } = await service
    .from('professionals')
    .select('*')
    .eq('email', user.email!)
    .single()
  const pro = proData as Professional | null

  if (!pro) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Dashboard</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900 mb-1">Profilo non trovato</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Nessun profilo professionale è associato a <strong>{user.email}</strong>.
            </p>
            <Link
              href="/registrati"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Registrati gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Fetch parallelo di tutti i dati ──────────────────────────

  const now = new Date()
  const thisMonthStart = startOfMonth(0)
  const lastMonthStart = startOfMonth(-1)
  const thisWeekStart  = startOfWeek(0)
  const lastWeekStart  = startOfWeek(-1)

  const [leadsRes, reviewsRes, viewsThisWeekRes, viewsLastWeekRes] = await Promise.all([
    // Lead nella zona del professionista (non assegnati ad altri o assegnati a questo pro)
    service
      .from('lead_requests')
      .select('*')
      .in('categoria', pro.categorie)
      .eq('citta', pro.citta)
      .or(`assigned_professional_id.is.null,assigned_professional_id.eq.${pro.id}`)
      .order('created_at', { ascending: false })
      .limit(50),

    // Ultime 5 recensioni
    service
      .from('reviews')
      .select('*')
      .eq('professional_id', pro.id)
      .order('created_at', { ascending: false })
      .limit(5),

    // Visualizzazioni profilo questa settimana
    service
      .from('profile_views')
      .select('id', { count: 'exact', head: true })
      .eq('professional_id', pro.id)
      .gte('viewed_at', thisWeekStart),

    // Visualizzazioni profilo settimana scorsa
    service
      .from('profile_views')
      .select('id', { count: 'exact', head: true })
      .eq('professional_id', pro.id)
      .gte('viewed_at', lastWeekStart)
      .lt('viewed_at', thisWeekStart),
  ])

  const leads: LeadRequest[]  = (leadsRes.data as LeadRequest[] | null) ?? []
  const reviews: Review[]     = (reviewsRes.data as Review[] | null) ?? []
  const viewsThisWeek         = viewsThisWeekRes.count ?? 0
  const viewsLastWeek         = viewsLastWeekRes.count ?? 0

  // ── Calcoli header ────────────────────────────────────────────

  const nuoveRichieste = leads.filter((l) => getDisplayStatus(l) === 'nuovo').length
  const inAttesa       = leads.filter((l) => getDisplayStatus(l) === 'risposto').length
  const confermatiMese = leads.filter((l) => {
    if (l.status !== 'closed') return false
    return l.contacted_at ? l.contacted_at >= thisMonthStart : l.created_at >= thisMonthStart
  }).length
  const mediaStelle = pro.rating_avg

  // ── Statistiche mensili richieste ─────────────────────────────

  const richiesteThisMo = leads.filter((l) => l.created_at >= thisMonthStart).length
  const richiesteLastMo = leads.filter(
    (l) => l.created_at >= lastMonthStart && l.created_at < thisMonthStart
  ).length

  // ── Completezza profilo ───────────────────────────────────────

  const { total: completePct, missing } = computeCompleteness(pro)

  // ── Piano ─────────────────────────────────────────────────────

  const planType     = pro.plan_type ?? 'free'
  const planExpires  = pro.plan_expires_at
  const isPro        = planType === 'pro'

  return (
    <div className="max-w-4xl space-y-10">

      {/* ══ HEADER: 4 STAT CARD ══════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Ciao, {pro.ragione_sociale.split(' ')[0]}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Dashboard professionista</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {pro.status === 'pending' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Profilo in revisione
              </div>
            )}
            <AvailabilityToggle initialAvailable={pro.available ?? true} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Nuove richieste"
            value={nuoveRichieste}
            sub="Non lette"
            color={nuoveRichieste > 0 ? 'text-orange-600' : 'text-slate-900'}
          />
          <StatCard
            label="In attesa risposta"
            value={inAttesa}
            sub="Dal cliente"
            color={inAttesa > 0 ? 'text-blue-600' : 'text-slate-900'}
          />
          <StatCard
            label="Confermati"
            value={confermatiMese}
            sub="Questo mese"
            color={confermatiMese > 0 ? 'text-green-600' : 'text-slate-900'}
          />
          <StatCard
            label="Media recensioni"
            value={mediaStelle ? `${mediaStelle.toFixed(1)} ★` : '—'}
            sub={`su ${pro.review_count} recens.`}
            color={mediaStelle && mediaStelle >= 4 ? 'text-amber-500' : 'text-slate-900'}
          />
        </div>
      </div>

      {/* ══ RICHIESTE ════════════════════════════════════════════ */}
      <LeadsSection leads={leads} />

      {/* ══ PROFILO: COMPLETEZZA ═════════════════════════════════ */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Completezza profilo</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          {/* Barra */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">
              {completePct}% completato
            </span>
            {completePct === 100 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                <ShieldCheck className="w-3.5 h-3.5" /> Profilo completo
              </span>
            )}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${completePct}%`,
                background: completePct === 100
                  ? '#22c55e'
                  : completePct >= 60
                  ? '#f97316'
                  : '#ef4444',
              }}
            />
          </div>

          {/* Lista elementi mancanti */}
          {missing.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Cosa manca ({missing.reduce((s, i) => s + i.pct, 0)}% potenziale)
              </p>
              {missing.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between gap-3 text-sm text-slate-700 hover:text-orange-600 group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    {item.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-orange-500 group-hover:underline">
                    +{item.pct}%
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              Ottimo lavoro! Il tuo profilo è al 100%.
            </p>
          )}
        </div>
      </section>

      {/* ══ RECENSIONI ═══════════════════════════════════════════ */}
      <ReviewsSection
        reviews={reviews}
        avgRating={mediaStelle}
        proName={pro.ragione_sociale}
      />

      {/* ══ STATISTICHE ══════════════════════════════════════════ */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Statistiche</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DeltaBadge
            current={viewsThisWeek}
            previous={viewsLastWeek}
            label="Visualizzazioni profilo questa settimana"
          />
          <DeltaBadge
            current={richiesteThisMo}
            previous={richiesteLastMo}
            label="Richieste ricevute questo mese"
          />
        </div>
      </section>

      {/* ══ PIANO ════════════════════════════════════════════════ */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Il tuo piano</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isPro ? (
                  <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 font-bold text-sm px-3 py-1 rounded-full">
                    <Crown className="w-3.5 h-3.5" /> Piano Pro
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 font-semibold text-sm px-3 py-1 rounded-full">
                    Piano Free
                  </span>
                )}
              </div>
              {isPro && planExpires && (
                <p className="text-xs text-slate-500 mt-1">
                  Rinnovo il{' '}
                  {new Date(planExpires).toLocaleDateString('it-IT', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              )}
              {!isPro && (
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Passa a Pro per richieste illimitate, badge verificato e statistiche avanzate.
                </p>
              )}
            </div>

            {!isPro && (
              <form action={createProUpgradeCheckout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  Passa a Pro — €29/mese
                </button>
              </form>
            )}
          </div>

          {/* Confronto piani */}
          {!isPro && (
            <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-slate-700 mb-2">Free</p>
                {['Visibilità limitata', '5 richieste/mese', 'Nessun badge'].map((f) => (
                  <p key={f} className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-200 flex-shrink-0" />
                    {f}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-semibold text-orange-600 mb-2">Pro ✦</p>
                {['Richieste illimitate', 'Badge Pro verificato', 'Statistiche avanzate', 'Priorità nei risultati'].map((f) => (
                  <p key={f} className="flex items-center gap-2 text-slate-700 text-xs mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
