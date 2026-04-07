export type BlogSection =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'html'; content: string }   // paragrafo con link HTML interni (generato da AI)

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  author: { name: string; role: string }
  sections: BlogSection[]
  imageUrl?: string
  imageAlt?: string
}

import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} }, auth: { persistSession: false } }
  )
}

function rowToPost(row: Database['public']['Tables']['blog_posts']['Row']): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    publishedAt: row.published_at,
    readingTime: row.reading_time,
    author: { name: row.author_name, role: 'Redazione' },
    sections: (row.sections as BlogSection[]) ?? [],
    imageUrl: row.image_url ?? undefined,
    imageAlt: row.image_alt ?? undefined,
  }
}

export async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const service = createServiceClient()
    const { data } = await service
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)
    return (data ?? []).map(rowToPost)
  } catch {
    return []
  }
}

export async function getDbPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const service = createServiceClient()
    const { data } = await service
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return data ? rowToPost(data) : null
  } catch {
    return null
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const dbPosts = await getDbPosts()
  // DB posts prima, poi statici (senza duplicati per slug)
  const dbSlugs = new Set(dbPosts.map((p) => p.slug))
  const staticFiltered = BLOG_POSTS.filter((p) => !dbSlugs.has(p.slug))
  return [...dbPosts, ...staticFiltered]
}

export async function getPostBySlugHybrid(slug: string): Promise<BlogPost | null> {
  const dbPost = await getDbPostBySlug(slug)
  if (dbPost) return dbPost
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'costo-impianto-fotovoltaico-2024',
    title: 'Quanto costa un impianto fotovoltaico nel 2025? Guida completa ai prezzi',
    excerpt:
      'Prezzi aggiornati per impianti da 3 kWp a 10 kWp, batterie di accumulo, incentivi e tempo di ammortamento. Tutto quello che devi sapere prima di richiedere un preventivo.',
    category: 'fotovoltaico',
    tags: ['fotovoltaico', 'prezzi', 'incentivi', 'detrazione fiscale'],
    publishedAt: '2025-02-10',
    readingTime: 7,
    author: { name: 'Redazione Maestranze', role: 'Guida tecnica' },
    sections: [
      {
        type: 'p',
        text: 'Il costo di un impianto fotovoltaico dipende da tre fattori principali: la potenza installata (kWp), la presenza o meno di un sistema di accumulo (batterie) e la complessità dell\'installazione (tipo di tetto, accesso, distanza dal contatore). In questa guida ti forniamo i prezzi medi aggiornati al 2025.',
      },
      { type: 'h2', text: 'Prezzi per potenza installata' },
      {
        type: 'ul',
        items: [
          '3 kWp (monolocale / piccolo appartamento): 4.500€ – 6.500€',
          '4,5 kWp (appartamento 80–100 mq): 6.000€ – 8.500€',
          '6 kWp (villetta bifamiliare): 7.500€ – 11.000€',
          '10 kWp (villa o piccola azienda): 11.000€ – 16.000€',
          'Oltre 10 kWp (uso industriale): da 1.000€/kWp in su',
        ],
      },
      {
        type: 'callout',
        title: 'Prezzi chiavi in mano',
        text: 'I prezzi indicati sono "chiavi in mano": includono pannelli, inverter, struttura di montaggio, collegamento alla rete e pratiche GSE. Non includono le batterie di accumulo.',
      },
      { type: 'h2', text: 'Aggiungere le batterie di accumulo' },
      {
        type: 'p',
        text: 'Un sistema di accumulo consente di immagazzinare l\'energia prodotta di giorno per usarla la sera o la notte. Il costo aggiuntivo varia in base alla capacità:',
      },
      {
        type: 'ul',
        items: [
          'Batteria da 5 kWh: 2.500€ – 4.000€',
          'Batteria da 10 kWh: 4.500€ – 7.000€',
          'Batteria da 15 kWh: 6.500€ – 10.000€',
        ],
      },
      { type: 'h2', text: 'Incentivi e detrazioni fiscali disponibili' },
      {
        type: 'p',
        text: 'Per le abitazioni private, i costi di installazione di un impianto fotovoltaico su immobile di proprietà beneficiano della detrazione IRPEF del 50% in 10 rate annuali, fino a un massimo di spesa di 96.000€. Questo dimezza di fatto il costo netto dell\'impianto nel tempo.',
      },
      {
        type: 'ul',
        items: [
          'Detrazione IRPEF 50% (Bonus Ristrutturazioni) per abitazioni private',
          'Ritiro Dedicato GSE: vendita dell\'energia in eccesso alla rete',
          'Scambio sul posto (SSP): compensazione con l\'energia prelevata',
          'Contributi regionali: disponibili in alcune regioni, verifica sul sito della tua Regione',
        ],
      },
      { type: 'h2', text: 'Tempo di ammortamento' },
      {
        type: 'p',
        text: 'Con un corretto dimensionamento e in presenza di incentivi fiscali, un impianto fotovoltaico residenziale si ammortizza in media in 6–9 anni. Con le batterie il payback si allunga leggermente a 8–12 anni, ma l\'autonomia energetica aumenta significativamente.',
      },
      {
        type: 'callout',
        title: 'Come ottenere il miglior prezzo',
        text: 'Richiedi almeno 3 preventivi da installatori certificati nella tua zona. La differenza tra il preventivo più basso e il più alto può arrivare al 30–40%. Verifica sempre che l\'installatore sia certificato CEI EN 50618 per accedere agli incentivi.',
      },
    ],
  },

  {
    slug: 'come-scegliere-elettricista',
    title: 'Come scegliere un elettricista: 7 cose da verificare prima di assumere',
    excerpt:
      'Non tutti gli elettricisti sono uguali. Ecco cosa controllare su certificazioni, abilitazioni e dichiarazione di conformità prima di affidare il lavoro.',
    category: 'elettricista',
    tags: ['elettricista', 'certificazioni', 'DM 37/08', 'impianti elettrici'],
    publishedAt: '2025-02-18',
    readingTime: 5,
    author: { name: 'Redazione Maestranze', role: 'Guida tecnica' },
    sections: [
      {
        type: 'p',
        text: 'Scegliere un elettricista non è una decisione da prendere alla leggera. Un impianto elettrico realizzato male è un rischio per la sicurezza di tutta la famiglia e può causare problemi legali al momento della vendita o dell\'affitto dell\'immobile. Ecco le 7 cose fondamentali da verificare.',
      },
      { type: 'h2', text: '1. Abilitazione e partita IVA' },
      {
        type: 'p',
        text: 'L\'elettricista deve essere in possesso dell\'abilitazione prevista dal DM 37/2008, che ha sostituito la vecchia Legge 46/90. L\'impresa deve essere iscritta alla Camera di Commercio con il codice ATECO corretto per gli impianti elettrici. Chiedi sempre copia del certificato di iscrizione.',
      },
      { type: 'h2', text: '2. Dichiarazione di conformità (DiCo)' },
      {
        type: 'p',
        text: 'Qualsiasi intervento che modifichi l\'impianto elettrico deve essere accompagnato dalla dichiarazione di conformità (DiCo) ai sensi del DM 37/08. Questo documento certifica che l\'impianto è stato realizzato a regola d\'arte e deve essere depositato al Comune. Senza DiCo non puoi usufruire delle detrazioni fiscali.',
      },
      {
        type: 'callout',
        title: 'Attenzione',
        text: 'Un elettricista che "lavora in nero" o che non vuole rilasciare la dichiarazione di conformità ti espone a rischi legali e di sicurezza. In caso di sinistro, l\'assicurazione potrebbe non coprire i danni.',
      },
      { type: 'h2', text: '3. Assicurazione RC professionale' },
      {
        type: 'p',
        text: 'L\'elettricista dovrebbe avere una polizza di responsabilità civile professionale che copra eventuali danni causati durante i lavori. Chiedi di visionare la polizza prima di iniziare.',
      },
      { type: 'h2', text: '4. Preventivo scritto e dettagliato' },
      {
        type: 'p',
        text: 'Non accettare mai preventivi verbali. Il preventivo scritto deve indicare: materiali usati (marca e modello), ore di lavoro previste, inclusione o esclusione della DiCo, eventuali costi aggiuntivi per opere murarie.',
      },
      { type: 'h2', text: '5. Recensioni verificate' },
      {
        type: 'p',
        text: 'Chiedi referenze a clienti precedenti o leggi le recensioni su piattaforme verificate. Un buon elettricista avrà una storia di lavori documentata. Diffidate di chi non riesce a fornire alcuna referenza.',
      },
      { type: 'h2', text: '6. Tempistiche realistiche' },
      {
        type: 'p',
        text: 'Un professionista serio ti darà una stima realistica dei tempi. Diffidate di chi promette lavori "per domani" su interventi complessi: la fretta è spesso nemica della qualità.',
      },
      { type: 'h2', text: '7. Contratto scritto per lavori importanti' },
      {
        type: 'p',
        text: 'Per rifacimenti completi dell\'impianto o lavori sopra i 5.000€, è buona prassi firmare un contratto che specifichi: importo totale, modalità di pagamento, penali per ritardi, garanzia post-lavoro.',
      },
    ],
  },

  {
    slug: 'bonus-ristrutturazioni-2025',
    title: 'Bonus Ristrutturazioni 2025: come funziona, importi e come richiederlo',
    excerpt:
      'Guida aggiornata al Bonus Ristrutturazioni 2025: detrazione del 50%, lavori ammessi, massimali di spesa e come non perdere il beneficio.',
    category: 'ristrutturazione',
    tags: ['bonus ristrutturazioni', 'detrazione fiscale', 'IRPEF', 'agevolazioni'],
    publishedAt: '2025-03-01',
    readingTime: 6,
    author: { name: 'Redazione Maestranze', role: 'Guida fiscale' },
    sections: [
      {
        type: 'p',
        text: 'Il Bonus Ristrutturazioni è una delle agevolazioni fiscali più utilizzate dagli italiani. Permette di detrarre dall\'IRPEF il 50% delle spese sostenute per ristrutturare la propria abitazione, fino a un massimo di 96.000€ per unità immobiliare. La detrazione viene ripartita in 10 rate annuali di pari importo.',
      },
      { type: 'h2', text: 'Quali lavori sono ammessi' },
      {
        type: 'ul',
        items: [
          'Manutenzione straordinaria (rifacimento bagni, cucine, impianti)',
          'Restauro e risanamento conservativo',
          'Ristrutturazione edilizia',
          'Rifacimento di impianti elettrici, idraulici, termici',
          'Sostituzione di infissi e serramenti',
          'Realizzazione di nuove aperture o chiusura di vani',
          'Installazione di impianti di sicurezza',
          'Eliminazione di barriere architettoniche',
        ],
      },
      { type: 'h2', text: 'Chi può usufruirne' },
      {
        type: 'p',
        text: 'Possono beneficiare della detrazione i proprietari dell\'immobile o i titolari di un diritto reale (usufrutto, uso, abitazione). Anche gli inquilini possono accedere al bonus se sostengono le spese con il consenso del proprietario. L\'immobile deve essere adibito ad uso residenziale.',
      },
      {
        type: 'callout',
        title: 'Massimale per unità immobiliare',
        text: 'Il tetto di 96.000€ si applica per singola unità immobiliare. Se possiedi più immobili, puoi detrarre fino a 96.000€ per ciascuno di essi.',
      },
      { type: 'h2', text: 'Come richiedere il bonus: adempimenti obbligatori' },
      {
        type: 'ul',
        items: [
          'Pagare le spese con bonifico "parlante" (bancario o postale) che riporti causale, codice fiscale del beneficiario e partita IVA dell\'impresa',
          'Conservare le fatture dei lavori e le ricevute dei bonifici',
          'Per lavori soggetti a CILA o SCIA: ottenere il titolo abilitativo prima di iniziare i lavori',
          'Comunicare all\'ENEA i lavori di risparmio energetico entro 90 giorni dalla fine lavori (per alcune categorie)',
          'Inserire le spese nella dichiarazione dei redditi (730 o Unico)',
        ],
      },
      { type: 'h2', text: 'Bonus Mobili collegato' },
      {
        type: 'p',
        text: 'Chi esegue una ristrutturazione che dà diritto al Bonus Ristrutturazioni può anche accedere al Bonus Mobili: detrazione del 50% su spese per arredi e grandi elettrodomestici (classe energetica A o superiore), fino a 5.000€ di spesa.',
      },
    ],
  },

  {
    slug: 'caldaia-vs-pompa-di-calore',
    title: 'Caldaia o pompa di calore? Guida alla scelta e incentivi 2025',
    excerpt:
      'Confronto completo tra caldaia a gas e pompa di calore: costi di installazione, consumi, incentivi fiscali e quale scegliere in base alla propria situazione.',
    category: 'idraulico',
    tags: ['pompa di calore', 'caldaia', 'riscaldamento', 'Ecobonus', 'incentivi'],
    publishedAt: '2025-02-25',
    readingTime: 6,
    author: { name: 'Redazione Maestranze', role: 'Guida tecnica' },
    sections: [
      {
        type: 'p',
        text: 'Con la progressiva eliminazione delle caldaie a gas nei nuovi edifici prevista dalla direttiva europea "Case Green", sempre più proprietari si interrogano sulla scelta tra caldaia tradizionale e pompa di calore. Questa guida ti aiuta a valutare i pro e contro di entrambe le soluzioni.',
      },
      { type: 'h2', text: 'Confronto sui costi di installazione' },
      {
        type: 'ul',
        items: [
          'Caldaia a condensazione: 1.500€ – 3.500€ installata',
          'Pompa di calore aria-acqua (monosplit): 6.000€ – 12.000€ installata',
          'Pompa di calore aria-acqua (sistema completo con radiatori): 10.000€ – 20.000€',
          'Pompa di calore geotermica: 15.000€ – 30.000€',
        ],
      },
      { type: 'h2', text: 'Confronto sui costi di gestione annuali' },
      {
        type: 'p',
        text: 'Per una casa da 100 mq in zona climatica E (Milano, Torino):',
      },
      {
        type: 'ul',
        items: [
          'Caldaia a gas metano: circa 1.200€ – 1.800€/anno di gas',
          'Pompa di calore: circa 600€ – 1.000€/anno di elettricità (COP medio 3)',
          'Pompa di calore + fotovoltaico: potenzialmente meno di 300€/anno',
        ],
      },
      {
        type: 'callout',
        title: 'Il COP fa la differenza',
        text: 'Il Coefficient of Performance (COP) indica quanta energia termica produce la pompa di calore per ogni kWh elettrico consumato. Una pompa con COP 3 produce 3 kWh di calore consumando 1 kWh di elettricità.',
      },
      { type: 'h2', text: 'Incentivi disponibili nel 2025' },
      {
        type: 'ul',
        items: [
          'Ecobonus 65%: per sostituzione di caldaie con pompe di calore ad alta efficienza',
          'Bonus Ristrutturazioni 50%: per sostituzione di qualsiasi impianto di riscaldamento',
          'Conto Termico: contributo diretto per privati e PA, fino al 65% delle spese',
          'Contributi regionali: verifica disponibilità nella tua regione',
        ],
      },
      { type: 'h2', text: 'Quando conviene la pompa di calore' },
      {
        type: 'p',
        text: 'La pompa di calore è la scelta migliore se: l\'edificio è ben isolato (cappotto termico), si ha o si prevede un impianto fotovoltaico, si abita in zona climatica C o D (Sud Italia o pianura padana), o si dispone di un impianto a pavimento radiante o fan coil.',
      },
      { type: 'h2', text: 'Quando conviene la caldaia a condensazione' },
      {
        type: 'p',
        text: 'La caldaia a condensazione rimane competitiva se: l\'edificio è scarsamente isolato (temperature operative alte), si risiede in zona climatica E o F con inverni rigidi, si ha un impianto a radiatori ad alta temperatura, o si vuole minimizzare il costo iniziale di installazione.',
      },
    ],
  },

  {
    slug: 'costo-ristrutturazione-bagno',
    title: 'Quanto costa ristrutturare un bagno nel 2025: guida ai prezzi',
    excerpt:
      'Prezzi aggiornati per ristrutturazione bagno completa o parziale: sanitari, rivestimenti, impianti e accessori. Con e senza bonus fiscali.',
    category: 'ristrutturazione',
    tags: ['ristrutturazione bagno', 'prezzi', 'sanitari', 'idraulico'],
    publishedAt: '2025-03-10',
    readingTime: 5,
    author: { name: 'Redazione Maestranze', role: 'Guida prezzi' },
    sections: [
      {
        type: 'p',
        text: 'Il bagno è uno degli ambienti che si ristruttura più frequentemente e il cui costo varia enormemente in base al livello delle finiture scelte. In questa guida ti forniamo una panoramica completa dei costi 2025, dalla ristrutturazione base al restyling di lusso.',
      },
      { type: 'h2', text: 'Costo per tipologia di intervento' },
      {
        type: 'ul',
        items: [
          'Ristrutturazione leggera (solo tinteggiatura, accessori): 500€ – 1.500€',
          'Sostituzione sanitari e rubinetteria (senza rivestimenti): 1.500€ – 3.500€',
          'Ristrutturazione media (rivestimenti + sanitari + impianti): 3.500€ – 7.000€',
          'Ristrutturazione completa con finiture medio-alte: 7.000€ – 12.000€',
          'Ristrutturazione luxury (materiali pregiati, doccia walk-in): 12.000€ – 25.000€+',
        ],
      },
      { type: 'h2', text: 'Voci di costo principali' },
      {
        type: 'ul',
        items: [
          'Demolizione vecchi rivestimenti e smaltimento: 300€ – 800€',
          'Impianto idraulico (nuovi scarichi e adduzione): 800€ – 2.000€',
          'Impianto elettrico (prese, luci, aspiratore): 400€ – 900€',
          'Posa piastrelle pavimento e pareti (al mq): 25€ – 60€/mq',
          'Sanitari (WC, lavabo, bidet): 300€ – 2.500€ per set',
          'Box doccia o vasca: 300€ – 3.000€',
          'Rubinetteria completa: 200€ – 1.500€',
          'Mobili bagno: 400€ – 3.000€',
        ],
      },
      {
        type: 'callout',
        title: 'Quanto incide la manodopera',
        text: 'In media, la manodopera pesa il 40–50% del costo totale di una ristrutturazione bagno. Risparmiare sulla manodopera scegliendo professionisti non qualificati è rischioso: un errore all\'impianto idraulico può costare molto di più.',
      },
      { type: 'h2', text: 'Bonus fiscali applicabili' },
      {
        type: 'p',
        text: 'La ristrutturazione del bagno rientra tra gli interventi ammessi al Bonus Ristrutturazioni (detrazione IRPEF 50% in 10 anni, fino a 96.000€). Per il rifacimento del bagno è generalmente richiesta la CILA (Comunicazione Inizio Lavori Asseverata), che il professionista può presentare per te.',
      },
      { type: 'h2', text: 'Come risparmiare senza rinunciare alla qualità' },
      {
        type: 'ul',
        items: [
          'Mantieni la posizione degli scarichi dove possibile (risparmio 500–1.000€)',
          'Scegli piastrelle di formato standard anziché formati speciali',
          'Confronta almeno 3 preventivi da idraulici e piastrellisti',
          'Acquista i sanitari in proprio (attenzione: poi la posa è a tuo carico)',
          'Valuta finiture mid-range per rapporto qualità/prezzo ottimale',
        ],
      },
    ],
  },

  {
    slug: 'cappotto-termico-costo-guida',
    title: 'Cappotto termico: costo al metro quadro, materiali e incentivi',
    excerpt:
      'Tutto sul cappotto termico: differenza tra EPS e lana di roccia, costo al mq con posa, Ecobonus e Sismabonus applicabili. Guida 2025.',
    category: 'muratore',
    tags: ['cappotto termico', 'isolamento', 'Ecobonus', 'muratore', 'efficienza energetica'],
    publishedAt: '2025-03-15',
    readingTime: 5,
    author: { name: 'Redazione Maestranze', role: 'Guida tecnica' },
    sections: [
      {
        type: 'p',
        text: 'Il cappotto termico è uno degli interventi di efficienza energetica più efficaci per ridurre le bollette e aumentare il valore dell\'immobile. In questa guida vediamo costi, materiali e incentivi fiscali disponibili nel 2025.',
      },
      { type: 'h2', text: 'Cos\'è il cappotto termico' },
      {
        type: 'p',
        text: 'Il cappotto termico (o sistema ETICS) è un rivestimento isolante applicato all\'esterno delle pareti. Riduce le dispersioni termiche invernali ed estive, elimina i ponti termici e migliora il comfort abitativo. È uno degli interventi cardine per il miglioramento della classe energetica.',
      },
      { type: 'h2', text: 'Costo al metro quadro (posa inclusa)' },
      {
        type: 'ul',
        items: [
          'Pannelli EPS (polistirene) 10 cm: 50€ – 80€/mq',
          'Pannelli EPS 12–14 cm (maggiore isolamento): 60€ – 95€/mq',
          'Lana di roccia 10 cm (migliore traspirabilità): 70€ – 110€/mq',
          'Grafite EPS (prestazioni superiori): 65€ – 100€/mq',
        ],
      },
      {
        type: 'p',
        text: 'I prezzi includono pannelli isolanti, rasatura armata, finitura intonaco colorato e ponteggi. Per una villetta con 150 mq di facciata, il costo totale si aggira tra 7.500€ e 16.500€.',
      },
      {
        type: 'callout',
        title: 'EPS vs Lana di roccia',
        text: 'L\'EPS (polistirene espanso) è più economico ma meno traspirante. La lana di roccia costa di più ma è ignifuga e permette alle pareti di "respirare". Per edifici storici o con problemi di umidità, la lana di roccia è generalmente preferibile.',
      },
      { type: 'h2', text: 'Incentivi fiscali' },
      {
        type: 'ul',
        items: [
          'Ecobonus 65%: se il cappotto porta a un miglioramento certificato della classe energetica',
          'Bonus Ristrutturazioni 50%: sempre applicabile come manutenzione straordinaria',
          'Sismabonus: se combinato con interventi antisismici (fino all\'85%)',
        ],
      },
      { type: 'h2', text: 'Quanto si risparmia in bolletta' },
      {
        type: 'p',
        text: 'Un cappotto termico ben realizzato può ridurre il fabbisogno energetico per il riscaldamento del 20–40%, a seconda dello spessore e del materiale scelto e delle condizioni iniziali dell\'edificio. In una casa in classe energetica E, il risparmio annuo può essere di 600–1.200€.',
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getRelatedPosts(current: BlogPost, count = 3): BlogPost[] {
  return BLOG_POSTS
    .filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      // Priorità: stessa categoria
      const aScore = a.category === current.category ? 1 : 0
      const bScore = b.category === current.category ? 1 : 0
      return bScore - aScore
    })
    .slice(0, count)
}
