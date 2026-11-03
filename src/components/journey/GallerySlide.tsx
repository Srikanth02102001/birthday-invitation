import { motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { gallery } from "./content";

export function GallerySlide({ isActive }: { isActive: boolean }) {
  return (
    <SlideShell eyebrow="Photo gallery" title="Moments of you Feels Empty :( " isActive={isActive}>
      <div className="grid grid-cols-2 gap-3">
        {gallery.map((photo, i) => (
          <motion.figure
            key={photo.caption}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-starlight/12 bg-starlight/[0.05]"
          >
            {/* Replace this block with <img src={...} alt={photo.caption} /> */}
            <div
              className="aspect-[4/5] w-full"
              style={{
                background:
                  "radial-gradient(120% 90% at 30% 20%, color-mix(in oklab, var(--glow-gold) 22%, transparent), transparent 70%), radial-gradient(120% 90% at 80% 90%, color-mix(in oklab, var(--glow-rose) 22%, transparent), transparent 70%)",
              }}
            />
            <figcaption className="px-3 py-2 font-sans text-[0.65rem] font-light tracking-wide text-starlight/55">
              {photo.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </SlideShell>
  );
}
