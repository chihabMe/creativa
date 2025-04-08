"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="absolute left-0 top-0 z-10 w-full bg-gradient-to-b from-black/20 to-transparent py-2 text-center text-white">
        <p className="text-sm">Sublimez votre intérieur avec nos magnifiques tableaux ✨</p>
      </div>

      <div className="relative h-[300px] w-full overflow-hidden sm:h-[400px] md:h-[500px]">
        <Image src="/images/hero.png" alt="Creativa Deco Store Front" fill priority className="object-cover" />
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-5xl">CreativaDeco</h1>
        <p className="mt-2 text-lg text-white drop-shadow-md md:text-xl">Décorez votre intérieur avec style</p>
      </motion.div>
    </section>
  )
}
