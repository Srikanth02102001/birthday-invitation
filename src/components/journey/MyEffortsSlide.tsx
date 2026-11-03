import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { myEfforts } from "./content";

export function MyEffortsSlide({ isActive }: { isActive: boolean }) {
  return (
    <SlideShell eyebrow="One last thing" title="My efforts" isActive={isActive}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex items-center gap-4 rounded-2xl border border-glow-gold/20 bg-glow-gold/[0.06] p-4"
      >
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-glow-gold/25 font-serif text-2xl text-glow-gold"
        >
          ✦
        </span>
        <div>
          <p className="font-sans text-[0.55rem] font-light tracking-[0.32em] text-glow-gold/65 uppercase">
            A little time, every day
          </p>
          <p className="mt-1 font-serif text-xl text-starlight">{myEfforts.startDate}</p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {myEfforts.paragraphs.map((paragraph, index) => (
          <motion.p
            key={paragraph}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.12 * index, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-sm font-light leading-relaxed text-starlight/75"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-6 border-t border-starlight/10 pt-5 text-center font-serif text-lg italic text-glow-gold/85"
      >
        Whatever happens, I’m glad I got to make this for you. ✨
      </motion.p>
    </SlideShell>
  );
}
