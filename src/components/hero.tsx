import Image from "next/image";
import * as motion from "motion/react-m";

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* <div className="absolute left-0 top-0 z-10 w-full bg-gradient-to-b from-black/20 to-transparent py-2 text-center text-white">
        <p className="text-sm">Sublimez votre intérieur avec nos magnifiques tableaux ✨</p>
      </div> */}

      <div className="relative h-72 w-full overflow-hidden sm:h-96 md:h-[600px]">
        {/* Background image with optimizations */}
        <Image
        quality={0}
          src="/images/hero.webp"
          fill
          className="object-cover object-center"
          alt="hi"
        />
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1
          className="text-3xl font-bold text-white md:text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {Array.from("CreativaDeco").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className="mt-2 text-lg text-white md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {Array.from("Décorez votre intérieur avec style").map(
            (char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.03, duration: 0.3 }}
              >
                {char}
              </motion.span>
            )
          )}
        </motion.p>
      </motion.div>
    </section>
  );
}
