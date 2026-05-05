import { motion } from 'framer-motion'
import { MapPin, Phone, Clock } from 'lucide-react'

const sedi = [
  {
    nome: 'Martesana',
    indirizzo: 'Via Privata Prandina 1, Milano',
    telefono: '02 4942 0043',
    orari: [
      { giorni: 'Lunedì', ore: '7:30 – 15:00' },
      { giorni: 'Mar – Gio', ore: '7:30 – 22:30' },
      { giorni: 'Venerdì', ore: '7:30 – 23:00' },
      { giorni: 'Sabato', ore: '8:00 – 23:00' },
      { giorni: 'Domenica', ore: '7:30 – 22:30' },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.7!2d9.2268!3d45.4862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c6f7b8a0c1e5%3A0x0!2sVia+Privata+Prandina+1%2C+Milano!5e0!3m2!1sit!2sit!4v1',
  },
  {
    nome: 'NoLo',
    indirizzo: 'Piazza Morbegno 2, Milano',
    telefono: null,
    orari: [
      { giorni: 'Dom – Gio', ore: '8:00 – 23:00' },
      { giorni: 'Ven – Sab', ore: '8:00 – 01:00' },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.4!2d9.2156!3d45.4962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c6e5b9a1c2d3%3A0x0!2sPiazza+Morbegno+2%2C+Milano!5e0!3m2!1sit!2sit!4v1',
  },
]

export default function Sedi() {
  return (
    <section id="sedi" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[13px] font-body font-medium tracking-[0.2em] uppercase
                       text-[#C4853A] mb-4"
          >
            Le nostre sedi
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-medium text-[#FDF8F0] leading-tight"
          >
            Vieni a trovarci
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sedi.map((sede, i) => (
            <motion.div
              key={sede.nome}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="rounded-3xl overflow-hidden bg-[#FDF8F0]/10 backdrop-blur-sm
                         border border-[#FDF8F0]/15 hover:border-[#FDF8F0]/25
                         transition-all duration-300"
            >
              {/* Map */}
              <div className="w-full h-52 overflow-hidden">
                <iframe
                  title={`Mappa ${sede.nome}`}
                  src={sede.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'sepia(20%) saturate(0.8)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Info */}
              <div className="p-7">
                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.2 }}
                  className="text-2xl font-display font-medium text-[#FDF8F0] mb-5"
                >
                  {sede.nome}
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.32 }}
                  className="space-y-3 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#C4853A] flex-shrink-0 mt-0.5" />
                    <p className="text-[14px] text-[#FDF8F0]/75 font-body">{sede.indirizzo}</p>
                  </div>

                  {sede.telefono && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-[#C4853A] flex-shrink-0" />
                      <a
                        href={`tel:${sede.telefono.replace(/\s/g, '')}`}
                        className="text-[14px] text-[#FDF8F0]/75 font-body hover:text-[#FDF8F0] transition-colors"
                      >
                        {sede.telefono}
                      </a>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.44 }}
                  className="border-t border-[#FDF8F0]/10 pt-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={15} className="text-[#C4853A]" />
                    <span className="text-[12px] font-body font-medium tracking-[0.15em] uppercase text-[#C4853A]">
                      Orari
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {sede.orari.map((o, j) => (
                      <li key={j} className="flex justify-between text-[13px] font-body">
                        <span className="text-[#FDF8F0]/55">{o.giorni}</span>
                        <span className="text-[#FDF8F0]/85 font-medium">{o.ore}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
