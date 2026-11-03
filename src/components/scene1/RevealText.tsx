import { motion } from "framer-motion";

/**
 * Word-by-word soft fade-up reveal. Slow easing, no bounce.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.16,
  as = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "p" | "h1";
}) {
  const words = text.split(" ");
  const Wrapper = as === "h1" ? motion.h1 : motion.p;

  return (
    <Wrapper
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre"
          variants={{
            hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Wrapper>
  );
}
