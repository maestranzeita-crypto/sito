import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IconCup = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2c0 0 1 1 1 3s-1 3-1 3" /><path d="M10 2c0 0 1 1 1 3s-1 3-1 3" />
    <path d="M3 10h13l-1.5 9H4.5L3 10z" /><path d="M16 12h2a2 2 0 0 1 0 4h-2" />
  </svg>
)

const IconLeaf = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 5-3 8-3 8s2 0 3 1c-1 4-3 5-8 9z" />
    <path d="M2 21c3-3 6-6 9-8" />
  </svg>
)

const IconCake = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1" />
    <path d="M2 21h20" /><path d="M7 8v2" /><path d="M12 8v2" /><path d="M17 8v2" />
    <path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" />
  </svg>
)

const IconSun = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const IconPlate = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
)

const IconCocktail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22h8" /><path d="M12 11v11" />
    <path d="M20 2H4l8 9.46L20 2z" />
  </svg>
)

const IconWine = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8l-2 8a4 4 0 0 1-4 0L8 2z" />
    <line x1="12" y1="10" x2="12" y2="20" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
)

const categories = [
  {
    id: 'caffe',
    label: 'Caffetteria',
    icon: <IconCup />,
    items: [
      { name: 'Caffè 100% Arabica', price: '1,30 €' },
      { name: 'Decaffeinato Agust', price: '1,40 €' },
      { name: 'Americano', price: '1,50 €' },
      { name: 'Corretto', price: '1,70 €' },
      { name: 'Macchiatone', price: '1,50 €' },
      { name: 'Cappuccino', price: '1,80 €' },
      { name: 'Latte Macchiato', price: '2,20 €' },
      { name: 'Americano Macchiato', price: '1,70 €' },
      { name: 'Marocchino', price: '1,60 €', note: 'Deca/Orzo 1,70 €' },
      { name: 'Orzo / Ginseng', price: '1,50 – 2,00 €', note: 'Piccolo 1,50 € / Grande 2,00 €' },
      { name: 'Cappuccino Orzo/Ginseng', price: '2,20 €' },
      { name: 'Latte Bianco', price: '0,50 – 1,50 €', note: 'Piccolo 0,50 € / Medio 1,00 € / Grande 1,50 €' },
      { name: 'Filtrato', price: '1,70 – 2,10 €', note: 'Medio 1,70 € / Grande 2,10 €' },
      { name: 'Shakerato Caffè', price: '3,30 €' },
      { name: 'Shakerato Ginseng', price: '3,50 €' },
      { name: 'Shakerato con Baileys', price: '4,60 €' },
      { name: 'Cioccolata', price: '3,00 €', note: 'Con panna 3,50 €' },
      { name: 'Tè Caldo / Tisane', price: '2,50 €' },
      { name: 'Tè Matcha', price: '3,50 €' },
      { name: 'Matcha Cappuccino', price: '2,10 €', note: 'Versione latte 2,40 €' },
      { name: 'Golden Milk Cappuccino', price: '2,10 €', note: 'Versione latte 2,40 €' },
      { name: 'Leche e Leche', price: '2,50 €' },
      { name: 'Caffinero', price: '2,80 €' },
      { name: 'Aggiunta Ghiaccio', price: '+0,40 €' },
    ],
  },
  {
    id: 'healthy',
    label: 'Healthy',
    icon: <IconLeaf />,
    items: [
      { name: 'Spremuta', price: '4,00 – 5,00 €', note: 'Piccola 4,00 € / Grande 5,00 €' },
      { name: 'Succo', price: '3,00 €' },
      { name: 'Yogurt', price: '4,00 €', note: 'Con granola, miele e marmellata' },
      { name: 'Acqua Menta', price: '1,50 €' },
      { name: 'Menta Latte', price: '2,50 €' },
      { name: 'Aggiunta Latte di Soia', price: '+0,20 €' },
      { name: 'Aggiunta Latte di Avena', price: '+0,30 €' },
      { name: 'Aggiunta Latte di Mandorla', price: '+0,40 €' },
    ],
  },
  {
    id: 'dolci',
    label: 'Dolci',
    icon: <IconCake />,
    items: [
      { name: 'Torte Artigianali', price: '3,50 €', note: 'Carrot Cake, Mela/Cannella, Limone' },
      { name: 'Biscotti Cocco e Limone / Burro', price: '1,80 €' },
      { name: 'Biscotti Gocce di Cioccolato', price: '2,00 €' },
      { name: 'Muffin Artigianali', price: '3,50 €', note: 'Cioccolato, Mirtillo, Red Velvet' },
      { name: 'Muffin Vegani', price: '3,50 €' },
      { name: 'Pancake', price: '4,00 €', note: 'Aggiunta panna montata +0,50 €' },
    ],
  },
  {
    id: 'brunch',
    label: 'Brunch',
    icon: <IconSun />,
    badge: 'Sab & Dom 9:30 – 11:30',
    items: [
      { name: 'Toast', price: '11,00 €' },
      { name: 'Bagel Salato', price: '12,00 €' },
      { name: 'Pancakes', price: '10,50 €' },
      { name: 'Pane, Burro e Marmellata', price: 'incluso' },
    ],
    footer: 'Ogni brunch include: biscotto artigianale al burro + spremuta e caffè filtrato.',
  },
  {
    id: 'pranzo',
    label: 'Pranzo',
    icon: <IconPlate />,
    items: [
      { name: 'Insalata Vegetariana', price: '7,50 €' },
      { name: 'Insalata Salmone', price: '8,00 €' },
      { name: 'Piatto di Bresaola', price: '8,00 €', note: 'Rucola, grana, limone' },
      { name: 'Piatto Acciughe', price: '8,00 €', note: 'Finocchio, arancia, acciughe' },
      { name: 'Bagel Salmone', price: '7,00 €' },
      { name: 'Bagel Mousse Tonno', price: '6,50 €' },
      { name: 'Bagel Crudo', price: '7,00 €', note: 'Crudo, Brie, Miele' },
      { name: 'Bagel Pesto', price: '6,50 €' },
      { name: 'Bagel Bresaola', price: '7,00 €' },
      { name: 'Maxi Toast', price: '4,50 €' },
      { name: 'Panino', price: 'da 6,50 €' },
      { name: 'Focaccia Farcita', price: 'da 4,50 €' },
      { name: 'Piadina', price: '6,50 €' },
    ],
  },
  {
    id: 'aperitivo',
    label: 'Aperitivo',
    icon: <IconCocktail />,
    items: [
      { name: 'Spritz', price: '6,00 €', note: 'Aperol, Campari, Vermouth, Cynar, Select — +4,00 € per il Tagliere' },
      { name: 'Gin Tonic / Vodka Tonic', price: 'da 7,00 €' },
      { name: 'Negroni / Sbagliato', price: '7,00 €' },
      { name: 'Mojito', price: '10,00 €' },
      { name: 'Vermouth Cocchi', price: '4,50 €' },
      { name: 'Amari Classici', price: '4,00 €' },
      { name: 'Amari Artigianali', price: '5,00 €', note: 'Jefferson, Taneda, Nonino, Venti' },
      { name: 'Pisco / Grappe', price: '4,50 €' },
      { name: 'Rum Diplomatico / Whisky', price: '7,00 €' },
      { name: 'Shot Classici', price: '3,00 €' },
      { name: 'Shot Artigianali', price: '3,50 €' },
      { name: 'Shot Tequila', price: '3,00 €' },
      { name: 'Shot Diplomatico', price: '5,00 €' },
    ],
  },
  {
    id: 'vini',
    label: 'Vini & Birre',
    icon: <IconWine />,
    items: [
      { name: 'Montepulciano DOC', price: '5,00 € / 20,00 €', note: 'Calice / Bottiglia — Formula Aperitivo 9,00 € — Take away 15,00 €' },
      { name: 'Valpolicella', price: '6,00 € / 24,00 €', note: 'Calice / Bottiglia — Formula Aperitivo 10,00 € — Take away 18,00 €' },
      { name: 'Morellino di Scansano Bio', price: '6,00 € / 24,00 €', note: 'Calice / Bottiglia — Formula Aperitivo 10,00 € — Take away 18,00 €' },
      { name: 'Nebbiolo Langhe DOC', price: '6,00 € / 24,00 €', note: 'Calice / Bottiglia — Formula Aperitivo 10,00 € — Take away 18,00 €' },
      { name: 'Prosecco DOC Extra Brut', price: '6,00 € / 22,00 €', note: 'Calice / Bottiglia — Formula Aperitivo 10,00 € — Take away 15,00 €' },
      { name: 'HB Pils alla spina', price: '3,00 – 5,00 €', note: '0,2L 3,00 € / 0,4L 5,00 €' },
      { name: 'America IPA 6,1%', price: '3,50 – 6,00 €', note: '0,2L 3,50 € / 0,4L 6,00 €' },
      { name: 'Lattine War Artigianali', price: '5,00 €', note: 'Take away' },
    ],
  },
]

export default function Menu() {
  const [active, setActive] = useState('caffe')
  const current = categories.find(c => c.id === active)

  return (
    <section id="menu" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[13px] font-body font-medium tracking-[0.2em] uppercase text-[#722F37] mb-4"
          >
            Il menu
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-medium text-[#3C2415] leading-tight"
          >
            Cosa trovi da noi
          </motion.h2>
        </div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-2 justify-center mb-10 flex-wrap"
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-body
                         font-medium transition-all duration-300 ${
                active === cat.id
                  ? 'bg-[#722F37] text-[#FDF8F0] shadow-md'
                  : 'bg-[#FDF8F0]/60 backdrop-blur-sm text-[#3C2415] hover:bg-[#FDF8F0]/80 border border-[#3C2415]/15'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Badge e footer di categoria */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {current.badge && (
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#722F37]/10
                                 text-[#722F37] text-[12px] font-body font-medium tracking-wide uppercase">
                  {current.badge}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {current.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex justify-between items-start p-5 rounded-2xl
                             bg-[#FDF8F0]/55 backdrop-blur-sm border border-[#3C2415]/10
                             hover:bg-[#FDF8F0]/70 transition-all duration-300"
                >
                  <div className="flex-1 pr-4">
                    <p className="font-body font-medium text-[#3C2415] text-[15px]">{item.name}</p>
                    {item.note && (
                      <p className="text-[12px] text-[#3C2415]/50 mt-0.5 font-body leading-snug">{item.note}</p>
                    )}
                  </div>
                  <span className="font-display text-[#722F37] font-medium text-[14px] whitespace-nowrap">
                    {item.price}
                  </span>
                </motion.div>
              ))}
            </div>

            {current.footer && (
              <p className="text-center text-[13px] text-[#3C2415]/55 font-body mt-6 italic">
                {current.footer}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-[13px] text-[#3C2415]/40 font-body mt-10"
        >
          Il menu può variare in base alla disponibilità giornaliera e stagionale.
        </motion.p>

      </div>
    </section>
  )
}
