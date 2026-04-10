import { createServerClient } from '@supabase/ssr'
import { findSimilarPairs } from '@/lib/blog-similarity'
import BlogAdminClient from './BlogAdminClient'

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

export default async function AdminBlogPage() {
  const service = createServiceClient()

  // Articoli pubblicati
  const { data: published } = await service
    .from('blog_posts')
    .select('slug, title, category, tags, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const publishedList = published ?? []

  // Argomenti pianificati — gestisce gracefully la tabella mancante
  let plannedList: any[] = []
  let tableExists = true
  try {
    const { data, error } = await (service as any)
      .from('blog_planned_topics')
      .select('*')
      .in('status', ['planned', 'in_progress'])
      .order('created_at', { ascending: false })

    if (error?.code === '42P01') {
      tableExists = false
    } else {
      plannedList = data ?? []
    }
  } catch {
    tableExists = false
  }

  // Controlla similarità tra tutti i titoli (pubblicati + pianificati)
  const allTitles = [
    ...publishedList.map((p) => p.title),
    ...plannedList.map((t) => t.title),
  ]
  const alerts = findSimilarPairs(allTitles)

  return (
    <BlogAdminClient
      published={publishedList}
      planned={plannedList}
      alerts={alerts}
      tableExists={tableExists}
    />
  )
}
