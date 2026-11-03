import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { letter } from "./content";

export function LetterSlide({ isActive }: { isActive: boolean }) {
  return (
    <SlideShell eyebrow="A letter" title="For you, on your day" isActive={isActive}>
      <div className="space-y-4">
        {letter.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.18 * i, ease: [0.16, 1, 0.3, 1] }}
            className={
              i === 0
                ? "font-serif text-2xl text-starlight"
                : "font-sans text-sm font-light leading-relaxed text-starlight/75"
            }
          >
            {line}
          </motion.p>
        ))}
      </div>
    </SlideShell>
  );
}
