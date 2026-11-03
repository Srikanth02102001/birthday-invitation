import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Scene 3 — slow floating petals drifting upward/downward.
 */
export function Petals({ count = 40 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 14,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 120,
        rose: Math.random() > 0.5,
      })),
    [count],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[60%_40%_55%_45%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.72,
            background: p.rose
              ? "color-mix(in oklab, var(--glow-rose) 65%, transparent)"
              : "color-mix(in oklab, var(--glow-rose) 55%, transparent)",
            filter: "blur(0.4px)",
          }}
          initial={{ y: "110svh", opacity: 0, rotate: 0 }}
          animate={{
            y: "-15svh",
            x: [0, p.drift, 0],
            opacity: [0, 0.85, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
