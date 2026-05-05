import { motion } from 'framer-motion'

const RamoBottomLeft = () => (
  <motion.svg
    viewBox="0 0 220 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute bottom-0 left-0 w-36 md:w-48 pointer-events-none select-none"
    aria-hidden="true"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.32 }}
    viewport={{ once: true }}
    transition={{ duration: 1.8, ease: 'easeOut', delay: 0.5 }}
  >
    {/* Main stem — from bottom-left rising up-right */}
    <path d="M 14 318 C 30 272 54 234 82 200 C 110 166 140 136 164 102 C 182 78 194 52 202 22"
      stroke="#4A6741" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />

    {/* Branch 1 — going left from lower-mid */}
    <path d="M 70 215 C 50 205 30 200 12 206"
      stroke="#4A6741" strokeWidth="1.5" strokeLinecap="round" />

    {/* Branch 2 — going right from mid */}
    <path d="M 132 145 C 150 136 170 130 188 124"
      stroke="#4A6741" strokeWidth="1.6" strokeLinecap="round" />

    {/* Branch 3 — going left from upper-mid */}
    <path d="M 168 98 C 150 86 130 80 112 78"
      stroke="#4A6741" strokeWidth="1.5" strokeLinecap="round" />

    {/* Branch 4 — top going right */}
    <path d="M 194 36 C 206 24 212 12 210 2"
      stroke="#4A6741" strokeWidth="1.4" strokeLinecap="round" />

    {/* Leaves — branch 1 */}
    <path d="M 16 206 C 6 198 2 186 8 180 C 10 190 14 202 16 206 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 16 206 C 8 194 4 182 8 180" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 20 202 C 24 214 24 226 16 230 C 16 220 16 208 20 202 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — main stem lower */}
    <path d="M 52 240 C 44 230 40 218 46 212 C 48 222 50 234 52 240 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 58 236 C 64 248 64 260 56 264 C 54 254 54 244 58 236 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — branch 2 */}
    <path d="M 180 128 C 188 120 196 116 200 108 C 192 116 184 124 180 128 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 180 128 C 188 118 196 112 200 108" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 172 132 C 168 146 162 154 154 152 C 160 144 168 136 172 132 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — branch 3 */}
    <path d="M 114 80 C 106 70 104 58 110 52 C 112 62 114 74 114 80 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 114 80 C 108 68 106 56 110 52" stroke="#4A6741" strokeWidth="0.5" strokeLinecap="round" />
    <path d="M 120 80 C 128 92 128 104 120 108 C 118 98 118 88 120 80 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — branch 4 top */}
    <path d="M 208 6 C 214 -2 220 -4 218 0 C 212 4 208 8 208 6 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 202 18 C 194 12 188 2 192 -2 C 196 8 200 14 202 18 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />

    {/* Leaves — mid stem */}
    <path d="M 110 162 C 102 152 100 140 106 134 C 108 144 110 154 110 162 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
    <path d="M 116 158 C 124 150 132 146 134 136 C 126 144 118 152 116 158 Z"
      fill="#5B7A4A" stroke="#4A6741" strokeWidth="0.7" strokeLinejoin="round" />
  </motion.svg>
)

const SvgCup = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2c0 0 1 1 1 3s-1 3-1 3" />
    <path d="M10 2c0 0 1 1 1 3s-1 3-1 3" />
    <path d="M3 10h13l-1.5 9H4.5L3 10z" />
    <path d="M16 12h2a2 2 0 0 1 0 4h-2" />
  </svg>
)

const SvgCroissant = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18c0-4 2-8 8-8s8 4 8 8" />
    <path d="M4 18l3-3" />
    <path d="M20 18l-3-3" />
    <path d="M12 10V7" />
    <path d="M9 8l3-4 3 4" />
  </svg>
)

const SvgBagel = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const SvgBowl = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11c0 4.4 3.6 8 8 8s8-3.6 8-8H4z" />
    <line x1="2" y1="11" x2="22" y2="11" />
    <path d="M10 4c0 2 1 3 2 3s2-1 2-3" />
  </svg>
)


const SvgSun = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
    <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
  </svg>
)

const SvgMoon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' },
  }),
}

const dayItems = [
  { icon: <SvgCup size={20} />, label: 'Caffè espresso da 1€' },
  { icon: <SvgCroissant size={20} />, label: 'Brioche artigianali da 1€' },
  { icon: <SvgCup size={20} />, label: 'Cappuccini e specialty' },
  { icon: <SvgBagel size={20} />, label: 'Bagels freschi da 5,40€' },
  { icon: <SvgBowl size={20} />, label: 'Piatti caldi del giorno' },
]


export default function DoppiaAnima() {
  return (
    <section id="doppia-anima" className="py-20">
      {/* Section header */}
      <div className="text-center px-6 mb-16">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block text-[13px] font-body font-medium tracking-[0.2em] uppercase
                     text-[#722F37] mb-4"
        >
          La doppia anima
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-display font-medium text-[#3C2415] leading-tight"
        >
          Giorno e notte, <em>sempre noi</em>
        </motion.h2>
      </div>

      {/* Split panel */}
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Day side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden flex-1 bg-[#FDF8F0]/85 backdrop-blur-sm px-8 md:px-14 py-14
                     flex flex-col justify-center"
        >
          <RamoBottomLeft />
          <div className="max-w-sm mx-auto md:mx-0 md:ml-auto">
            <div className="flex items-center gap-3 mb-2">
              <SvgSun size={22} className="text-[#8B6914]" />
              <span className="text-[13px] font-body font-medium tracking-[0.18em] uppercase text-[#8B6914]">
                Il giorno
              </span>
            </div>
            <h3 className="text-3xl font-display font-medium text-[#3C2415] mb-8 leading-snug">
              La tua colazione<br />perfetta
            </h3>
            <ul className="space-y-4">
              {dayItems.map((item, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-center gap-3 text-[15px] text-[#3C2415]/80 font-body"
                >
                  <span className="text-[#8B6914] flex-shrink-0">{item.icon}</span>
                  {item.label}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:flex items-center justify-center w-px bg-gradient-to-b from-transparent via-[#3C2415]/20 to-transparent" />

        {/* Night side — Vale Doppio */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 bg-[#2C1008]/80 backdrop-blur-sm px-8 md:px-14 py-14
                     flex flex-col justify-center"
        >
          <div className="max-w-sm mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <SvgMoon size={22} />
              <span className="text-[13px] font-body font-medium tracking-[0.18em] uppercase text-[#C4853A]">
                La sera
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl font-display font-medium text-[#FDF8F0] mb-3 leading-none tracking-tight"
            >
              Vale Doppio
            </motion.h3>

            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="inline-block text-[12px] font-body font-medium tracking-[0.22em] uppercase
                         text-[#C4853A] mb-8"
            >
              Ogni mercoledì sera
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="text-[16px] text-[#FDF8F0]/70 font-body leading-relaxed"
            >
              Perché una volta sola non basta. Ogni mercoledì ti aspettiamo con la nostra offerta
              speciale:{' '}
              <span className="text-[#C4853A] font-medium">
                due Aperol Spritz al prezzo di €8
              </span>
              . Porta qualcuno con cui brindare — il mercoledì è fatto per condividere.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
