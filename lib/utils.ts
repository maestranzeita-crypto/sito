import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SITE_NAME = 'Maestranze'
export const SITE_URL = 'https://maestranze.com'
export const SITE_DESCRIPTION =
  'Trova professionisti edili e impiantistici verificati in tutta Italia. Elettricisti, idraulici, muratori, impianti fotovoltaici e molto altro.'

/** Normalizza il nome di una città al formato slug usato nel DB (es. "Reggio Emilia" → "reggio-emilia") */
export function normalizeCity(citta: unknown): string {
  return String(citta).toLowerCase().trim().replace(/\s+/g, '-')
}
