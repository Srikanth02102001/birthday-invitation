import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { timeline } from "./content";

export function TimelineSlide({ isActive }: { isActive: boolean }) {
  return (
    <SlideShell eyebrow="Our story" title="A little timeline" isActive={isActive}>
      <ol className="relative space-y-6 border-l border-starlight/15 pl-5">
        {timeline.map((item, i) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[1.7rem] top-1.5 h-2 w-2 rounded-full bg-glow-gold"
              style={{
                boxShadow: "0 0 14px color-mix(in oklab, var(--glow-gold) 70%, transparent)",
              }}
            />
            <p className="font-sans text-[0.6rem] font-light tracking-[0.32em] text-starlight/45 uppercase">
              {item.when}
            </p>
            <p className="mt-1 font-serif text-xl text-starlight">{item.title}</p>
            <p className="mt-1 font-sans text-sm font-light leading-relaxed text-starlight/60">
              {item.paragraph}
            </p>
          </motion.li>
        ))}
      </ol>
    </SlideShell>
  );
}
