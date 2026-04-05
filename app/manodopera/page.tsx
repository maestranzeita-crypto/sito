import type { Metadata } from 'next'
import ManodoperaClient from './ManodoperaClient'

export const metadata: Metadata = {
  title: 'Manodopera Edile — Trova Artigiani o Segnala Disponibilità',
  description:
    'Sei un\'impresa con un cantiere che parte? Trova artigiani qualificati disponibili nella tua zona. Sei un artigiano con tempo libero? Renditi disponibile e ricevi proposte.',
}

export default function ManodoperaPage() {
  return <ManodoperaClient />
}
