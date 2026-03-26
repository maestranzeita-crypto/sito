import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SITE_NAME = 'Maestranze'
export const SITE_URL = 'https://maestranze.com'
export const SITE_DESCRIPTION =
  'Trova professionisti edili e impiantistici verificati in tutta Italia. Elettricisti, idraulici, muratori, impianti fotovoltaici e molto altro.'
