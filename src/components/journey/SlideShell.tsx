import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";

/**
 * Glass card shell shared by every journey slide.
 * Mobile-first, and switches to a wide two-line layout in landscape.
 */
export function SlideShell({
  eyebrow,
  title,
  children,
  isActive,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  isActive: boolean;
}) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const contentElement = contentRef.current;
    if (
      !isActive ||
      !scrollElement ||
      !contentElement ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      wrapper: scrollElement,
      content: contentElement,
      eventsTarget: scrollElement,
      autoRaf: true,
      smoothWheel: true,
    });

    const allowSwiperWheelAtEdges = (event: WheelEvent) => {
      const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
      const atTop = scrollElement.scrollTop <= 0;
      const atBottom = scrollElement.scrollTop >= maxScroll - 1;
      if (!((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom))) {
        event.stopPropagation();
      }
    };

    scrollElement.addEventListener("wheel", allowSwiperWheelAtEdges);
    return () => {
      scrollElement.removeEventListener("wheel", allowSwiperWheelAtEdges);
      lenis.destroy();
    };
  }, [isActive]);

  return (
    <div className="journey-slide-frame flex h-full w-full items-center justify-center px-5 py-[max(1.5rem,env(safe-area-inset-top))]">
      <motion.section
        ref={scrollRef}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-full w-full max-w-md overflow-y-auto rounded-[1.75rem] border border-starlight/15 bg-starlight/[0.06] px-6 py-8 backdrop-blur-xl landscape:max-w-2xl landscape:px-8 landscape:py-6"
        style={{
          boxShadow:
            "0 0 70px color-mix(in oklab, var(--glow-gold) 14%, transparent), inset 0 1px 0 color-mix(in oklab, var(--starlight) 16%, transparent)",
        }}
      >
        <div ref={contentRef}>
          <p className="font-sans text-[0.58rem] font-light tracking-[0.5em] text-glow-gold/70 uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light leading-tight text-starlight sm:text-4xl">
            {title}
          </h2>
          <div className="mt-6">{children}</div>
        </div>
      </motion.section>
    </div>
  );
}
