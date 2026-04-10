import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/*
  Tabella Supabase richiesta (esegui su Supabase SQL editor):

  create table blog_planned_topics (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    category text not null default 'generale',
    keywords text[] default '{}',
    pexels_query text,
    internal_links jsonb default '[]',
    status text default 'planned',   -- planned | in_progress | published | skipped
    published_slug text,
    notes text,
    created_at timestamptz default now()
  );
*/

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

export async function GET() {
  try {
    const service = createServiceClient()
    const { data, error } = await (service as any)
      .from('blog_planned_topics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true, topics: data ?? [] })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Errore', topics: [] },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, keywords, notes } = body

    if (!title?.trim()) {
      return NextResponse.json({ ok: false, error: 'Titolo obbligatorio' }, { status: 400 })
    }

    const service = createServiceClient()
    const { data, error } = await (service as any)
      .from('blog_planned_topics')
      .insert({
        title: title.trim(),
        category: category ?? 'generale',
        keywords: keywords ?? [],
        notes: notes ?? null,
        status: 'planned',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true, topic: data })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Errore' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ ok: false, error: 'ID mancante' }, { status: 400 })

    const service = createServiceClient()
    const { error } = await (service as any)
      .from('blog_planned_topics')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Errore' },
      { status: 500 }
    )
  }
}
