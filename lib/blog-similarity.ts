/**
 * Utility per rilevare argomenti blog troppo simili.
 * Usa Jaccard similarity su parole significative (ignora stopword italiane).
 */

const STOP_WORDS = new Set([
  'di', 'da', 'in', 'per', 'con', 'su', 'la', 'il', 'lo', 'le', 'gli',
  'un', 'una', 'e', 'è', 'a', 'come', 'nel', 'nella', 'nei', 'alle', 'al',
  'del', 'della', 'dei', 'degli', 'che', 'si', 'non', 'se', 'ma', 'o',
  'ho', 'ha', 'sono', 'tra', 'fra', 'quando', 'dove', 'quali', 'quale',
  'tutti', 'tutto', 'guida', 'completa', 'pratica', 'cosa', 'perché',
])

export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9àèéìòùÀÈÉÌÒÙ\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
  )
}

/** Jaccard similarity [0, 1] tra due testi */
export function textSimilarity(a: string, b: string): number {
  const setA = tokenize(a)
  const setB = tokenize(b)
  const intersection = [...setA].filter((x) => setB.has(x)).length
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

/** Soglia oltre cui due argomenti sono considerati "troppo simili" */
export const SIMILARITY_THRESHOLD = 0.35

export interface SimilarityAlert {
  titleA: string
  titleB: string
  score: number
}

/** Trova tutte le coppie di titoli con similarità > SIMILARITY_THRESHOLD */
export function findSimilarPairs(titles: string[]): SimilarityAlert[] {
  const alerts: SimilarityAlert[] = []
  for (let i = 0; i < titles.length; i++) {
    for (let j = i + 1; j < titles.length; j++) {
      const score = textSimilarity(titles[i], titles[j])
      if (score >= SIMILARITY_THRESHOLD) {
        alerts.push({ titleA: titles[i], titleB: titles[j], score })
      }
    }
  }
  return alerts.sort((a, b) => b.score - a.score)
}

/** Verifica se un nuovo titolo è troppo simile a uno qualsiasi dei titoli esistenti */
export function isTooSimilar(
  newTitle: string,
  existingTitles: string[]
): { similar: boolean; closestTitle?: string; score?: number } {
  let maxScore = 0
  let closestTitle: string | undefined

  for (const existing of existingTitles) {
    const score = textSimilarity(newTitle, existing)
    if (score > maxScore) {
      maxScore = score
      closestTitle = existing
    }
  }

  return {
    similar: maxScore >= SIMILARITY_THRESHOLD,
    closestTitle,
    score: maxScore,
  }
}
