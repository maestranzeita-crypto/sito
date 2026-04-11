import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })
const GOOGLE_SITE_VERIFICATION_TOKEN = 'PcMoAB8jyXGRhp7_qd-tLcdDTCjhpKQqxW4m12e2pMY'
const GA_MEASUREMENT_ID = 'G-7L1Z9GQV8F'
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION ?? GOOGLE_SITE_VERIFICATION_TOKEN
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? GA_MEASUREMENT_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
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
    title: SITE_NAME,
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
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/favicon.svg',
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
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        {gaMeasurementId ? <Suspense><GoogleAnalytics measurementId={gaMeasurementId} /></Suspense> : null}
        {/* Anti-FOUC: apply stored theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('maestranze-theme');if(t==='dark'||(t===null&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}` }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
