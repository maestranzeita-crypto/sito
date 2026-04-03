import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600 // cache 1h

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')?.trim()
  const city = searchParams.get('city')?.trim()

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !name) {
    return Response.json({ rating: null, total: null, place_id: null })
  }

  try {
    const query = encodeURIComponent(`${name} ${city ?? ''}`)
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}&language=it`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return Response.json({ rating: null, total: null, place_id: null })

    const data = await res.json()
    const place = data.results?.[0]
    if (!place) return Response.json({ rating: null, total: null, place_id: null })

    return Response.json({
      rating: place.rating ?? null,
      total: place.user_ratings_total ?? null,
      place_id: place.place_id ?? null,
    })
  } catch {
    return Response.json({ rating: null, total: null, place_id: null })
  }
}
