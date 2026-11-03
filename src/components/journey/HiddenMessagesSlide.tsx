import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { hiddenMessages } from "./content";

export function HiddenMessagesSlide({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SlideShell eyebrow="Hidden messages" title="Little envelopes" isActive={isActive}>
      <div className="space-y-3">
        {hiddenMessages.map((item, i) => {
          const isOpen = open === i;
          return (
            <button
              key={item.hint}
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full rounded-2xl border border-starlight/12 bg-starlight/[0.04] px-4 py-3 text-left transition-colors hover:bg-starlight/[0.08]"
            >
              <span className="flex items-center gap-3">
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? -8 : 0, scale: isOpen ? 1.1 : 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-lg"
                >
                  {isOpen ? "💌" : "✉️"}
                </motion.span>
                <span className="font-sans text-[0.72rem] font-light tracking-[0.18em] text-starlight/65 uppercase">
                  {item.hint}
                </span>
              </span>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span
                    key="msg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="block overflow-hidden"
                  >
                    <span className="mt-3 block font-serif text-lg leading-snug text-starlight">
                      {item.message}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </SlideShell>
  );
}
