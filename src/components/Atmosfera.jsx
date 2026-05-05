import { motion } from 'framer-motion'

const photos = [
  {
    src: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Espresso al banco',
    caption: 'Il rito del mattino',
  },
  {
    src: 'https://images.pexels.com/photos/1995010/pexels-photo-1995010.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Il bancone',
    caption: 'Il nostro spazio',
  },
  {
    src: 'https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Aperitivo serale',
    caption: 'La sera con gli amici',
  },
]

export default function Atmosfera() {
  return (
    <section id="atmosfera" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[13px] font-body font-medium tracking-[0.2em] uppercase
                       text-[#722F37] mb-4"
          >
            L'atmosfera
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-medium text-[#3C2415] leading-tight"
          >
            Un posto dove <em>stare bene</em>
          </motion.h2>
        </div>

        {/* Grid asimmetrica */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* Foto grande a sinistra */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 relative overflow-hidden rounded-3xl group"
          >
            <div className="aspect-[4/3] md:aspect-auto md:h-[480px]">
              <img
                src={photos[1].src}
                alt={photos[1].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0808]/60 via-transparent to-transparent" />
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-5 left-6 text-[#FDF8F0]/85 font-display italic text-[18px]"
              >
                {photos[1].caption}
              </motion.span>
            </div>
          </motion.div>

          {/* Colonna destra: due foto */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-5">
            {[photos[0], photos[2]].map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.15 }}
                className="relative overflow-hidden rounded-3xl group flex-1"
              >
                <div className="aspect-[16/9] md:aspect-auto md:h-[228px]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0808]/55 via-transparent to-transparent" />
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                    className="absolute bottom-4 left-5 text-[#FDF8F0]/85 font-display italic text-[16px]"
                  >
                    {photo.caption}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
