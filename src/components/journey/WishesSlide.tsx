import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { wishes } from "./content";

export function WishesSlide() {
  const [wishMade, setWishMade] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl font-light leading-tight text-starlight sm:text-5xl"
          style={{
            textShadow:
              "0 0 40px color-mix(in oklab, var(--glow-gold) 45%, transparent), 0 0 90px color-mix(in oklab, var(--glow-rose) 24%, transparent)",
          }}
        >
          Happy Birthday, Manasa ❤️
        </motion.h2>

        <div className="mt-8 space-y-3">
          {wishes.map((wish, i) => (
            <motion.p
              key={wish}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-sm font-light leading-relaxed text-starlight/70"
            >
              {wish}
            </motion.p>
          ))}
        </div>

        <motion.button
          type="button"
          aria-expanded={wishMade}
          aria-controls="personal-birthday-wish"
          onClick={() => setWishMade(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="mx-auto mt-8 flex min-h-14 min-w-14 touch-manipulation items-center justify-center rounded-full border border-glow-gold/35 bg-glow-gold/[0.08] text-3xl text-glow-gold shadow-[0_0_32px_color-mix(in_oklab,var(--glow-gold)_24%,transparent)] transition-colors hover:bg-glow-gold/[0.16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow-gold"
        >
          <motion.span
            aria-hidden="true"
            animate={
              wishMade ? { rotate: [0, 18, -12, 0], scale: [1, 1.3, 1] } : { scale: [1, 1.12, 1] }
            }
            transition={
              wishMade
                ? { duration: 0.8, ease: "easeOut" }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            ✦
          </motion.span>
          <span className="sr-only">{wishMade ? "Your wish is on its way" : "Make a wish"}</span>
        </motion.button>
        <p className="mt-3 font-sans text-[0.62rem] font-light tracking-[0.28em] text-starlight/55 uppercase">
          {wishMade ? "A little wish, just for you" : "Tap the star and make a wish"}
        </p>

        <AnimatePresence>
          {wishMade && (
            <motion.div
              id="personal-birthday-wish"
              key="personal-wish"
              aria-live="polite"
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 rounded-2xl border border-starlight/10 bg-starlight/[0.04] px-5 py-4"
            >
              <p className="font-serif text-lg leading-relaxed text-starlight/90">
                Manasa, I hope every year brings you the same warmth and happiness you bring to the
                people around you. May it be full of little adventures, reasons to smile, and dreams
                coming true. And whenever a day feels difficult, remember I am always here cheering
                you on. Stay strong, keep smiling, and keep being wonderfully you. ❤️
              </p>
              <button
                type="button"
                aria-expanded={noteOpen}
                aria-controls="birthday-postscript"
                onClick={() => setNoteOpen((open) => !open)}
                className="mt-4 min-h-11 touch-manipulation rounded-full px-3 font-sans text-[0.62rem] font-light tracking-[0.2em] text-glow-gold/80 transition-colors hover:text-glow-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow-gold"
              >
                {noteOpen ? "A little note, just between us ✦" : "P.S. there’s one more thing"}
              </button>
              <AnimatePresence>
                {noteOpen && (
                  <motion.p
                    id="birthday-postscript"
                    key="birthday-postscript"
                    initial={{ opacity: 0, height: 0, y: 6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden font-serif text-base leading-relaxed text-starlight/75"
                  >
                  Its okey to feel I'm no ones favorite, no ones priority, because you can 
                  be someones favorite, priority, e oka roju ni kopam pakkana petu,
                  ni badha endhi strom anaku haha
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="mt-10 font-sans text-[0.58rem] font-light tracking-[0.5em] text-glow-gold/70 uppercase"
        >
          With all my effort, love and care, I made this for you.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="mt-10 font-sans text-[0.58rem] font-light tracking-[0.5em] text-glow-gold/70 uppercase"
        >
          Cheers 🥂
        </motion.p>
      </div>
    </div>
  );
}
