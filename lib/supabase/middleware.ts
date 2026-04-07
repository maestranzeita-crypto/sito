import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Passa il pathname ai server components tramite header custom
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  // Chiamata a Supabase solo per /dashboard — evita round-trip inutili su tutte le altre route
  if (isDashboard) {
    let supabaseResponse = NextResponse.next({
      request: { headers: requestHeaders },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request: { headers: requestHeaders },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    // Redirige solo se non c'è sessione E non ci sono errori di rete/timeout
    // Evita logout involontari quando Supabase è temporaneamente lento
    if (!user && !error) {
      const url = request.nextUrl.clone()
      url.pathname = '/accedi'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}
