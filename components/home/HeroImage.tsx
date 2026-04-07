'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const IMAGES = [
  { src: 'https://images.pexels.com/photos/9875408/pexels-photo-9875408.jpeg', alt: 'Impianti Fotovoltaici' },
  { src: 'https://images.pexels.com/photos/7359566/pexels-photo-7359566.jpeg', alt: 'Elettricista' },
  { src: 'https://images.pexels.com/photos/8581897/pexels-photo-8581897.jpeg', alt: 'Idraulico' },
  { src: 'https://images.pexels.com/photos/11429199/pexels-photo-11429199.jpeg', alt: 'Muratore' },
  { src: 'https://images.pexels.com/photos/15798783/pexels-photo-15798783.jpeg', alt: 'Impresa Edile' },
]

export default function HeroImage() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length)
        setVisible(true)
      }, 500)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  function goTo(index: number) {
    if (index === current) return
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, 500)
  }

  return (
    <>
      {/* Sfondo full-cover */}
      <Image
        src={IMAGES[current].src}
        alt={IMAGES[current].alt}
        fill
        className="object-cover"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        sizes="100vw"
        priority
      />

    </>
  )
}
