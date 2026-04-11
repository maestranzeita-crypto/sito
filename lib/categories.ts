import type { LucideIcon } from 'lucide-react'
import { Sun, Zap, Wrench, HardHat, Home } from 'lucide-react'

export type Category = {
  slug: string
  name: string
  nameShort: string
  description: string
  longDescription: string
  icon: LucideIcon
  color: string
  metaTitle: string
  metaDescription: string
  services: string[]       // sotto-servizi per la pagina categoria
  faqs: { q: string; a: string }[]
  avgPrice: string         // range prezzo indicativo
  calculatorHref?: string  // link al calcolatore dedicato
  calculatorAvailable?: boolean
}

export const CATEGORIES: Category[] = [
  {
    slug: 'fotovoltaico',
    name: 'Impianti Fotovoltaici',
    nameShort: 'Fotovoltaico',
    description: 'Installazione e manutenzione di pannelli solari e impianti fotovoltaici',
    longDescription:
      'Trova installatori di impianti fotovoltaici certificati e verificati nella tua città. Confronta preventivi, leggi le recensioni di chi ha già installato il fotovoltaico e scegli il professionista più adatto alle tue esigenze. Scopri anche come accedere agli incentivi statali e alle detrazioni fiscali disponibili.',
    icon: Sun,
    color: 'amber',
    metaTitle: 'Installatori Fotovoltaico Certificati',
    metaDescription:
      'Trova installatori di impianti fotovoltaici certificati nella tua città. Preventivi gratuiti, professionisti verificati.',
    services: [
      'Installazione impianti fotovoltaici residenziali',
      'Impianti fotovoltaici con accumulo (batterie)',
      'Impianti fotovoltaici per aziende e capannoni',
      'Manutenzione e pulizia pannelli solari',
      'Sostituzione inverter e componenti',
      'Pratiche GSE e connessione in rete',
      'Impianti termici solari',
      'Riqualificazione impianti esistenti',
    ],
    faqs: [
      {
        q: 'Quanto costa un impianto fotovoltaico da 3 kWp?',
        a: 'Il costo di un impianto fotovoltaico da 3 kWp varia tra 4.500€ e 7.000€ installato. Con la detrazione fiscale del 50% in 10 anni, il costo effettivo si riduce significativamente.',
      },
      {
        q: 'In quanti anni si ammortizza un impianto fotovoltaico?',
        a: 'Con un dimensionamento corretto, un impianto fotovoltaico si ammortizza mediamente in 6-9 anni, a seconda dei consumi e delle ore di sole della zona.',
      },
      {
        q: 'È obbligatorio avere un installatore certificato?',
        a: 'Sì. Per accedere alle detrazioni fiscali e agli incentivi GSE, l\'impianto deve essere installato da un installatore certificato secondo la norma CEI EN 50618.',
      },
      {
        q: 'Quali incentivi sono disponibili per il fotovoltaico?',
        a: 'È possibile accedere alla detrazione IRPEF del 50% in 10 anni (per privati), al Conto Energia per autoconsumo e, per alcune categorie, ai contributi regionali.',
      },
    ],
    avgPrice: '4.500€ – 12.000€',
    calculatorHref: '/calcolatore/fotovoltaico',
    calculatorAvailable: true,
  },
  {
    slug: 'elettricista',
    name: 'Elettricisti',
    nameShort: 'Elettricista',
    description: 'Impianti elettrici civili e industriali, certificazioni e collaudi',
    longDescription:
      'Trova elettricisti abilitati e certificati nella tua zona. Dalla realizzazione di nuovi impianti elettrici alla ristrutturazione di quelli esistenti, dal montaggio di punti luce alla domotica avanzata. Tutti i professionisti su Maestranze sono verificati e rilasciano la dichiarazione di conformità.',
    icon: Zap,
    color: 'yellow',
    metaTitle: 'Elettricisti Certificati',
    metaDescription:
      'Trova elettricisti abilitati e certificati nella tua zona. Impianti civili, industriali, domotica.',
    services: [
      'Impianti elettrici civili e residenziali',
      'Impianti elettrici industriali',
      'Collaudi e certificazioni (DM 37/08)',
      'Domotica e impianti smart home',
      'Installazione punti luce e prese',
      'Cablaggi strutturati e reti LAN',
      'Impianti di allarme e sicurezza',
      'Sostituzione quadri elettrici',
    ],
    faqs: [
      {
        q: 'È obbligatorio richiedere la dichiarazione di conformità?',
        a: 'Sì. Per ogni nuovo impianto o modifica sostanziale, il DM 37/08 impone al professionista di rilasciare la dichiarazione di conformità (ex dichiarazione di conformità ISPESL).',
      },
      {
        q: 'Quanto costa rifare l\'impianto elettrico di un appartamento?',
        a: 'Il rifacimento completo dell\'impianto di un appartamento da 80 mq costa mediamente tra 3.000€ e 6.000€ a seconda della complessità e dei materiali scelti.',
      },
      {
        q: 'Ogni quanto va revisionato l\'impianto elettrico?',
        a: 'Per le abitazioni private non c\'è un obbligo di legge, ma è consigliabile una verifica ogni 20-25 anni o in caso di ampliamenti. Per immobili in affitto è obbligatorio avere un impianto a norma.',
      },
    ],
    avgPrice: '50€ – 150€/ora · impianto completo da 3.000€',
    calculatorHref: '/calcolatore/elettrico',
    calculatorAvailable: false,
  },
  {
    slug: 'idraulico',
    name: 'Idraulici',
    nameShort: 'Idraulico',
    description: 'Impianti idraulici, termoidraulici e sanitari per casa e azienda',
    longDescription:
      'Trova idraulici qualificati e termoidraulici verificati vicino a te. Dai piccoli interventi di pronto intervento alla realizzazione di nuovi impianti, dalla manutenzione della caldaia all\'installazione di pavimento radiante. Preventivi gratuiti e risposta in 24 ore.',
    icon: Wrench,
    color: 'blue',
    metaTitle: 'Idraulici Qualificati',
    metaDescription:
      'Trova idraulici qualificati vicino a te. Impianti idrici, termici, caldaie, bagni e cucine.',
    services: [
      'Impianti idraulici civili e industriali',
      'Installazione e manutenzione caldaie',
      'Rifacimento bagno e cucina',
      'Pavimento radiante (riscaldamento a pavimento)',
      'Impianti di riscaldamento e raffrescamento',
      'Pronto intervento perdite e guasti',
      'Installazione pompe di calore',
      'Impianti di condizionamento',
    ],
    faqs: [
      {
        q: 'Quanto costa rifare un bagno completo?',
        a: 'Il rifacimento completo di un bagno standard (6-8 mq) ha un costo che varia da 3.500€ a 8.000€ inclusi materiali e manodopera, a seconda delle finiture scelte.',
      },
      {
        q: 'Ogni quanto va revisionata la caldaia?',
        a: 'La revisione annuale è obbligatoria per legge per le caldaie a gas. Va eseguita da un tecnico abilitato che rilascia il libretto di impianto aggiornato.',
      },
      {
        q: 'Quali incentivi esistono per le pompe di calore?',
        a: 'Le pompe di calore rientrano nel Bonus Ristrutturazioni (50%), nell\'Ecobonus (65% per sostituzione di vecchi impianti) e potenzialmente nel Superbonus.',
      },
    ],
    avgPrice: '60€ – 120€/ora · impianto completo da 2.500€',
    calculatorHref: '/calcolatore/idraulico',
    calculatorAvailable: false,
  },
  {
    slug: 'muratore',
    name: 'Muratori e Edili',
    nameShort: 'Muratore',
    description: 'Lavori edili, costruzioni, ristrutturazioni strutturali e opere murarie',
    longDescription:
      'Trova muratori esperti e imprese edili qualificate per tutti i tuoi lavori in muratura. Demolizioni e costruzioni, intonaci, massetti, tamponamenti, interventi antisismici e molto altro. Professionisti verificati con esperienza documentata e recensioni reali.',
    icon: HardHat,
    color: 'orange',
    metaTitle: 'Muratori e Imprese Edili',
    metaDescription:
      'Trova muratori esperti e imprese edili per costruzioni, manutenzioni e ristrutturazioni.',
    services: [
      'Costruzione e ristrutturazione strutturale',
      'Demolizioni e rimozione macerie',
      'Intonaci interni ed esterni',
      'Massetti e sottofondi',
      'Tamponamenti e divisori',
      'Cappotti termici ed isolamenti',
      'Interventi antisismici (sismabonus)',
      'Pavimentazioni esterne e cortili',
    ],
    faqs: [
      {
        q: 'Quanto costa rifare l\'intonaco esterno di una casa?',
        a: 'Il rifacimento dell\'intonaco esterno costa mediamente tra 30€ e 60€ al mq, inclusi ponteggi e materiali. Per una villetta tipo da 150 mq di facciata si parla di 4.500€–9.000€.',
      },
      {
        q: 'Cos\'è il Sismabonus e come funziona?',
        a: 'Il Sismabonus è una detrazione IRPEF dal 50% all\'85% per lavori di riduzione del rischio sismico sugli edifici. L\'entità dipende dalla riduzione di classe di rischio ottenuta.',
      },
      {
        q: 'Serve un permesso per abbattere un muro interno?',
        a: 'Dipende: per pareti non portanti generalmente basta una CILA o SCIA, per muri portanti o strutturali è richiesto un progetto firmato da un tecnico abilitato (geometra, ingegnere, architetto).',
      },
    ],
    avgPrice: '30€ – 60€/mq · lavori da 1.000€',
  },
  {
    slug: 'ristrutturazione',
    name: 'Ristrutturazioni',
    nameShort: 'Ristrutturazione',
    description: 'Ristrutturazioni complete di appartamenti, ville e locali commerciali',
    longDescription:
      'Trova imprese di ristrutturazione affidabili per rimettere a nuovo la tua casa o il tuo locale. Dalla ristrutturazione leggera al restyling completo, gestione delle pratiche comunali, accesso ai bonus fiscali. Imprese verificate, preventivi dettagliati, tempi certi.',
    icon: Home,
    color: 'green',
    metaTitle: 'Imprese di Ristrutturazione',
    metaDescription:
      'Trova imprese per ristrutturazioni complete. Detrazioni fiscali 50%, bonus ristrutturazioni.',
    services: [
      'Ristrutturazione completa appartamento',
      'Ristrutturazione bagno e cucina',
      'Posa pavimenti e rivestimenti',
      'Tinteggiatura e decorazione interni',
      'Serramenti e infissi (finestre, porte)',
      'Cappotto termico ed efficienza energetica',
      'Ristrutturazione locali commerciali',
      'Pratiche CILA, SCIA e DIA',
    ],
    faqs: [
      {
        q: 'Quanto costa ristrutturare un appartamento da 80 mq?',
        a: 'Una ristrutturazione media (impianti + finiture) di 80 mq può costare tra 25.000€ e 60.000€. Una ristrutturazione leggera (solo tinteggiatura + pavimenti) parte da 8.000–12.000€.',
      },
      {
        q: 'Quali bonus fiscali si possono usare per la ristrutturazione?',
        a: 'Il Bonus Ristrutturazioni offre una detrazione IRPEF del 50% su spese fino a 96.000€ per unità immobiliare. Si aggiunge il Bonus Mobili (50% su arredi) se si esegue una ristrutturazione.',
      },
      {
        q: 'Devo fare la CILA prima di ristrutturare?',
        a: 'Per interventi di manutenzione straordinaria (rifacimento bagni, cucine, impianti) è generalmente richiesta la CILA. Opere più impattanti richiedono SCIA o permesso di costruire.',
      },
    ],
    avgPrice: '300€ – 700€/mq · appartamento da 25.000€',
    calculatorHref: '/calcolatore/ristrutturazione',
    calculatorAvailable: true,
  },
]

export const MAIN_CITIES = [
  'Milano',
  'Roma',
  'Napoli',
  'Torino',
  'Palermo',
  'Genova',
  'Bologna',
  'Firenze',
  'Bari',
  'Catania',
  'Venezia',
  'Verona',
  'Messina',
  'Padova',
  'Trieste',
  'Brescia',
  'Taranto',
  'Prato',
  'Modena',
  'Parma',
  'Reggio Calabria',
  'Reggio Emilia',
  'Perugia',
  'Livorno',
  'Ravenna',
  'Cagliari',
  'Foggia',
  'Rimini',
  'Salerno',
  'Ferrara',
]

export type City = {
  slug: string
  name: string
  province: string
  region: string
}

export const CITIES: City[] = [
  { slug: 'milano', name: 'Milano', province: 'MI', region: 'Lombardia' },
  { slug: 'roma', name: 'Roma', province: 'RM', region: 'Lazio' },
  { slug: 'napoli', name: 'Napoli', province: 'NA', region: 'Campania' },
  { slug: 'torino', name: 'Torino', province: 'TO', region: 'Piemonte' },
  { slug: 'palermo', name: 'Palermo', province: 'PA', region: 'Sicilia' },
  { slug: 'genova', name: 'Genova', province: 'GE', region: 'Liguria' },
  { slug: 'bologna', name: 'Bologna', province: 'BO', region: 'Emilia-Romagna' },
  { slug: 'firenze', name: 'Firenze', province: 'FI', region: 'Toscana' },
  { slug: 'bari', name: 'Bari', province: 'BA', region: 'Puglia' },
  { slug: 'catania', name: 'Catania', province: 'CT', region: 'Sicilia' },
  { slug: 'venezia', name: 'Venezia', province: 'VE', region: 'Veneto' },
  { slug: 'verona', name: 'Verona', province: 'VR', region: 'Veneto' },
  { slug: 'messina', name: 'Messina', province: 'ME', region: 'Sicilia' },
  { slug: 'padova', name: 'Padova', province: 'PD', region: 'Veneto' },
  { slug: 'trieste', name: 'Trieste', province: 'TS', region: 'Friuli-Venezia Giulia' },
  { slug: 'brescia', name: 'Brescia', province: 'BS', region: 'Lombardia' },
  { slug: 'taranto', name: 'Taranto', province: 'TA', region: 'Puglia' },
  { slug: 'prato', name: 'Prato', province: 'PO', region: 'Toscana' },
  { slug: 'modena', name: 'Modena', province: 'MO', region: 'Emilia-Romagna' },
  { slug: 'parma', name: 'Parma', province: 'PR', region: 'Emilia-Romagna' },
  { slug: 'reggio-calabria', name: 'Reggio Calabria', province: 'RC', region: 'Calabria' },
  { slug: 'reggio-emilia', name: 'Reggio Emilia', province: 'RE', region: 'Emilia-Romagna' },
  { slug: 'perugia', name: 'Perugia', province: 'PG', region: 'Umbria' },
  { slug: 'livorno', name: 'Livorno', province: 'LI', region: 'Toscana' },
  { slug: 'ravenna', name: 'Ravenna', province: 'RA', region: 'Emilia-Romagna' },
  { slug: 'cagliari', name: 'Cagliari', province: 'CA', region: 'Sardegna' },
  { slug: 'foggia', name: 'Foggia', province: 'FG', region: 'Puglia' },
  { slug: 'rimini', name: 'Rimini', province: 'RN', region: 'Emilia-Romagna' },
  { slug: 'salerno', name: 'Salerno', province: 'SA', region: 'Campania' },
  { slug: 'ferrara', name: 'Ferrara', province: 'FE', region: 'Emilia-Romagna' },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug)
}

export function formatCityName(raw: string): string {
  return raw
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
