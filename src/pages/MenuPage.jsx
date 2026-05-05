import { motion } from 'framer-motion'
import Menu from '../components/Menu'

export default function MenuPage() {
  return (
    <>
      <div className="pt-28 pb-4 px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block text-[13px] font-body font-medium tracking-[0.2em] uppercase text-[#722F37] mb-4"
        >
          Caffineria
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl font-display font-medium text-[#3C2415] leading-tight"
        >
          Il nostro menu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 text-[16px] text-[#3C2415]/60 font-body max-w-md mx-auto"
        >
          Dalla colazione all'aperitivo, tutto quello che trovi da noi.
        </motion.p>
      </div>
      <Menu />
    </>
  )
}
