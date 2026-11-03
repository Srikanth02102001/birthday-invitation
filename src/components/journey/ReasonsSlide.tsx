import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { reasons } from "./content";

export function ReasonsSlide({ isActive }: { isActive: boolean }) {
  return (
    <SlideShell eyebrow="Reasons" title={`${reasons.length} reasons why you`} isActive={isActive}>
      <ul className="space-y-3">
        {reasons.map((reason, i) => (
          <motion.li
            key={reason}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-3 rounded-2xl border border-starlight/10 bg-starlight/[0.04] px-4 py-3"
          >
            <span className="font-sans text-[0.7rem] font-light text-glow-gold/80">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-sans text-sm font-light leading-relaxed text-starlight/80">
              {reason}
            </span>
          </motion.li>
        ))}
      </ul>
    </SlideShell>
  );
}
