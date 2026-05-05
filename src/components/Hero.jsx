import { motion } from 'framer-motion'
import { Link } from 'react-scroll'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col lg:flex-row"
    >
      {/* LEFT — content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center relative">
        {/* Soft radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-[#FDF8F0]/50 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative flex flex-col items-center gap-8"
        >
          <img
            src="/logo.png"
            alt="Caffineria"
            className="w-[200px] md:w-[260px] lg:w-[280px] max-w-full drop-shadow-sm"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl font-display italic text-[#3C2415]/80 tracking-wide"
          >
            Caffetteria di giorno, vineria di sera
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <Link
              to="doppia-anima"
              smooth
              duration={700}
              offset={-72}
              className="px-8 py-3 rounded-full bg-[#722F37] text-[#FDF8F0] font-body font-medium
                         text-[15px] tracking-wide cursor-pointer hover:bg-[#5a2229] transition-all
                         duration-300 shadow-md hover:shadow-lg"
            >
              Scopri il menu
            </Link>
            <Link
              to="sedi"
              smooth
              duration={700}
              offset={-72}
              className="px-8 py-3 rounded-full border-2 border-[#3C2415]/40 text-[#3C2415]
                         font-body font-medium text-[15px] tracking-wide cursor-pointer
                         hover:border-[#3C2415] transition-all duration-300"
            >
              Le nostre sedi
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[12px] font-body text-[#3C2415]/50 tracking-widest uppercase">Scorri</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-[1px] h-10 bg-gradient-to-b from-[#3C2415]/40 to-transparent"
          />
        </motion.div>
      </div>

      {/* RIGHT — photo (solo desktop) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="hidden lg:block lg:w-[52%] relative overflow-hidden"
      >
        <img
          src="https://images.pexels.com/photos/19561080/pexels-photo-19561080.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="Caffineria interno"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay sfumato a sinistra per integrarlo col contenuto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDF8F0]/80 via-[#FDF8F0]/10 to-transparent" />
        {/* Overlay caldo in basso */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3C2415]/30 to-transparent" />
      </motion.div>
    </section>
  )
}
