import Image from 'next/image'
import Link from 'next/link'

const SECTORS = [
  {
    name: 'Fotovoltaico',
    slug: 'fotovoltaico',
    img: 'https://images.pexels.com/photos/9875408/pexels-photo-9875408.jpeg',
  },
  {
    name: 'Elettricista',
    slug: 'elettricista',
    img: 'https://images.pexels.com/photos/34054464/pexels-photo-34054464.jpeg',
  },
  {
    name: 'Idraulico',
    slug: 'idraulico',
    img: 'https://images.pexels.com/photos/8581897/pexels-photo-8581897.jpeg',
  },
  {
    name: 'Muratore',
    slug: 'muratore',
    img: 'https://images.pexels.com/photos/11429199/pexels-photo-11429199.jpeg',
  },
  {
    name: 'Impresa Edile',
    slug: 'ristrutturazione',
    img: 'https://images.pexels.com/photos/15798783/pexels-photo-15798783.jpeg',
  },
]

export default function SectorsCarousel() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          I settori in cui operiamo
        </p>

        {/* Scrollabile su mobile, griglia su desktop */}
        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible">
          {SECTORS.map((sector) => (
            <Link
              key={sector.slug}
              href={`/${sector.slug}`}
              className="flex-shrink-0 w-44 sm:w-auto group"
            >
              <div className="relative h-40 rounded-xl overflow-hidden">
                <Image
                  src={sector.img}
                  alt={sector.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 176px, 20vw"
                />
              </div>
              <p className="mt-2 text-sm font-bold text-slate-900 text-center">
                {sector.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
