import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { bondMoments } from "./content";

export function BondSlide({ isActive }: { isActive: boolean }) {
  return (
    <SlideShell
      eyebrow="A little about us"
      title="The little things that became our story"
      isActive={isActive}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-lg leading-relaxed text-starlight/75"
      >
        Not one big moment, but a collection of small ones that feel unmistakably ours.
      </motion.p>

      <div className="mt-6 space-y-3">
        {bondMoments.map((moment, index) => (
          <motion.article
            key={moment.label}
            initial={{ opacity: 0, x: index % 2 === 0 ? -14 : 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.14 * index, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-starlight/10 bg-gradient-to-br from-starlight/[0.08] to-starlight/[0.02] p-4 transition-colors hover:border-glow-gold/25"
          >
            <span
              aria-hidden="true"
              className="absolute -right-4 -top-6 font-serif text-7xl text-glow-gold/[0.08] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
            >
              {moment.symbol}
            </span>
            <div className="relative flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-glow-gold/20 bg-glow-gold/[0.08] font-serif text-lg text-glow-gold"
              >
                {moment.symbol}
              </span>
              <div>
                <p className="font-sans text-[0.55rem] font-light tracking-[0.32em] text-glow-gold/70">
                  {moment.label}
                </p>
                <h3 className="mt-1 font-serif text-xl font-light text-starlight">
                  {moment.title}
                </h3>
                <p className="mt-1.5 font-sans text-sm font-light leading-relaxed text-starlight/65">
                  {moment.message}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="mt-5 border-l border-glow-gold/50 pl-4 font-serif text-lg italic leading-relaxed text-glow-gold/85"
      >
        Sister anu antav ga Manasa Sister, the only problem is alavatu padina ga frnd anni :(
      </motion.blockquote>
    </SlideShell>
  );
}
