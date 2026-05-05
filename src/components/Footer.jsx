import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
}

export default function Footer() {
  return (
    <footer className="bg-[#1A0808] py-14 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Tagline */}
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-display italic text-[#FDF8F0]/50 text-[16px] text-center"
        >
          Caffetteria di giorno, vineria di sera
        </motion.p>

        {/* Links */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex items-center gap-8 flex-wrap justify-center"
        >
          <a
            href="https://instagram.com/caffineria"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#FDF8F0]/65 hover:text-[#C4853A]
                       transition-colors duration-300 font-body text-[14px]"
          >
            <InstagramIcon />
            @caffineria
          </a>
          <a
            href="tel:0249420043"
            className="flex items-center gap-2 text-[#FDF8F0]/65 hover:text-[#C4853A]
                       transition-colors duration-300 font-body text-[14px]"
          >
            <Phone size={18} />
            02 4942 0043
          </a>
        </motion.div>

        {/* Sedi inline */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex gap-6 flex-wrap justify-center text-[13px] text-[#FDF8F0]/35 font-body"
        >
          <span>Via Privata Prandina 1 — Martesana</span>
          <span className="hidden sm:block">·</span>
          <span>Piazza Morbegno 2 — NoLo</span>
        </motion.div>

        {/* Divider */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="w-full h-px bg-[#FDF8F0]/8"
        />

        {/* Copyright */}
        <motion.p
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-[12px] text-[#FDF8F0]/25 font-body text-center"
        >
          © {new Date().getFullYear()} Caffineria. Tutti i diritti riservati. Milano.
        </motion.p>
      </div>
    </footer>
  )
}
