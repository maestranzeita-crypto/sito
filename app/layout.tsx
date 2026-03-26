import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Trova Professionisti Edili e Impiantistici Verificati`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'professionisti edili',
    'installatori fotovoltaico',
    'elettricisti certificati',
    'idraulici',
    'ristrutturazioni',
    'muratori',
    'preventivo gratuito',
    'Italia',
  ],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Trova Professionisti Edili e Impiantistici Verificati`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Trova Professionisti Edili`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
