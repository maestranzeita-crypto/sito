import { motion } from 'framer-motion'

const RamoTopRight = () => (
  <motion.svg
    viewBox="0 0 260 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute top-0 right-0 w-48 md:w-64 pointer-events-none select-none"
    aria-hidden="true"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.28 }}
    viewport={{ once: true }}
    transition={{ duration: 1.8, ease: 'easeOut', delay: 0.4 }}
  >
    {/* Main stem */}
    <path d="M 248 2 C 230 48 208 88 180 124 C 152 160 118 192 88 230 C 64 260 44 292 24 334"
      stroke="#4A6741" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

    {/* Branch 1 — upper right */}
    <path d="M 216 58 C 228 42 238 26 242 10"
      stroke="#4A6741" strokeWidth="1.6" strokeLinecap="round" />

    {/* Branch 2 — going left */}
    <path d="M 180 124 C 158 112 132 106 108 104"
      stroke="#4A6741" strokeWidth="1.7" strokeLinecap="round" />

    {/* Branch 2b — tertiary going up */}
    <path d="M 144 110 C 140 96 140 82 144 70"
      stroke="#4A6741" strokeWidth="1.3" strokeLinecap="round" />

    {/* Branch 3 — going right */}
    <path d="M 136 192 C 154 182 172 176 190 170"
      stroke="#4A6741" strokeWidth="1.5" strokeLinecap="round" />

    {/* Branch 4 — lower left */}
    <path d="M 88 230 C 66 220 44 218 22 224"
      stroke="#4A6741" strokeWidth="1.5" strokeLinecap="round" />

    {/* Leaves — branch 1 */}
    <path d="M 236 28 C 244 18 252 10 250 4 C 244 10 237 20 236 28 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 236 28 C 244 16 250 6 250 4" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 226 44 C 216 36 210 26 214 18 C 218 28 224 38 226 44 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 226 44 C 218 32 214 20 214 18" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />

    {/* Leaves — branch 2 */}
    <path d="M 118 106 C 110 96 108 84 114 76 C 116 86 118 98 118 106 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 118 106 C 112 94 110 82 114 76" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 126 108 C 122 120 116 128 108 126 C 114 120 122 112 126 108 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 155 108 C 151 96 151 84 157 76 C 157 88 156 100 155 108 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — branch 2b */}
    <path d="M 144 72 C 148 62 154 54 156 46 C 150 54 145 64 144 72 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 144 72 C 148 60 154 50 156 46" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 140 88 C 132 82 128 72 132 64 C 134 74 138 84 140 88 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — branch 3 */}
    <path d="M 176 174 C 184 166 192 160 196 152 C 188 160 180 168 176 174 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 176 174 C 184 164 192 156 196 152" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 164 180 C 160 192 154 200 146 198 C 152 192 160 184 164 180 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — branch 4 */}
    <path d="M 32 224 C 22 216 16 206 20 198 C 24 208 30 218 32 224 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 32 224 C 24 212 18 202 20 198" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 42 222 C 48 234 50 244 44 250 C 42 240 40 230 42 222 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — main stem bottom */}
    <path d="M 36 312 C 28 302 22 290 26 282 C 30 292 34 304 36 312 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 40 316 C 48 308 56 302 60 294 C 52 302 44 310 40 316 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
  </motion.svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

export default function ChiSiamo() {
  return (
    <section id="chi-siamo" className="relative overflow-hidden py-28 px-6">
      <RamoTopRight />
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-[13px] font-body font-medium tracking-[0.2em] uppercase
                       text-[#722F37] mb-4"
          >
            La nostra storia
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-display font-medium text-[#3C2415] mb-8 leading-tight"
          >
            Nate dalla nostalgia,<br />
            <em>cresciute dall'amore</em>
          </motion.h2>

          {/* Decorative line */}
          <motion.div
            variants={fadeUp}
            className="w-16 h-[2px] bg-[#722F37] mx-auto mb-10 rounded-full"
          />

          <motion.p
            variants={fadeUp}
            className="text-[17px] text-[#3C2415]/75 leading-relaxed mb-6"
          >
            Caffineria nasce da un'idea semplice e potente: la nostalgia. Ragazze italiane
            tornate dall'estero, cariche di esperienze e sapori nuovi, ma con un vuoto nel petto —
            quello del caffè al bar la mattina, della brioche calda, del bicchiere di vino condiviso
            con le amiche la sera.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[17px] text-[#3C2415]/75 leading-relaxed mb-6"
          >
            Non volevamo scegliere tra il caffè di qualità e il vino buono. Volevamo un posto che
            fosse entrambe le cose — un rifugio di giorno, un ritrovo la sera. Un luogo dove
            sentirsi a casa in ogni ora del giorno.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[17px] text-[#3C2415]/75 leading-relaxed"
          >
            Così è nata Caffineria. Prima nel quartiere Martesana, poi a NoLo. Due angoli di Milano
            dove il tempo scorre più lento, i profumi ti accolgono dalla porta e ogni cliente
            diventa, con il tempo, un'amica.
          </motion.p>

          {/* Quote */}
          <motion.blockquote
            variants={fadeUp}
            className="mt-14 px-8 py-6 rounded-2xl bg-[#FDF8F0]/50 backdrop-blur-sm
                       border border-[#3C2415]/10 text-left relative"
          >
            <span className="absolute -top-4 left-8 text-6xl font-display text-[#722F37]/30 leading-none">"</span>
            <p className="text-[18px] font-display italic text-[#3C2415] leading-relaxed">
              Un caffè e una brioche la mattina, un calice e una chiacchiera la sera.
              Questo è Caffineria.
            </p>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}
