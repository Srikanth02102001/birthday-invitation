import { motion } from "framer-motion";

export function TapToBegin({ onBegin }: { onBegin: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onBegin}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      transition={{ duration: 2.2, delay: 0.6 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-8 text-center"
    >
      <motion.span
        aria-hidden="true"
        className="block h-1.5 w-1.5 rounded-full bg-starlight"
        animate={{ opacity: [0.25, 1, 0.25], scale: [1, 1.6, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="font-sans text-[0.7rem] font-light tracking-[0.42em] text-starlight/60 uppercase">
        Tap to begin
      </span>
      <span className="font-sans text-[0.62rem] font-light tracking-[0.2em] text-starlight/30">
        Use Earphones for best experience 🎧
      </span>
    </motion.button>
  );
}
