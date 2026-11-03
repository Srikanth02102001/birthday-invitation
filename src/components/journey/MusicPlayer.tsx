import { motion } from "framer-motion";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";

/**
 * Phase 4 music player — small glass pill, bottom centre.
 */
export function MusicPlayer({
  muted,
  track,
  audioError,
  onToggle,
}: {
  muted: boolean;
  track: "piano" | "birthday";
  audioError: string | null;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 1.2 }}
      className="pointer-events-auto absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-30 -translate-x-1/2"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={muted ? "Enable music and sound effects" : "Mute music and sound effects"}
        title={audioError ?? (track === "birthday" ? "Happy Birthday song" : "Soft piano")}
        aria-describedby={audioError ? "music-player-error" : undefined}
        className="flex min-h-11 touch-manipulation items-center gap-3 rounded-full border border-starlight/15 bg-starlight/[0.07] px-4 py-2 backdrop-blur-xl transition-colors hover:bg-starlight/[0.12]"
      >
        {muted ? (
          <HiOutlineSpeakerXMark size={14} className="text-starlight/60" />
        ) : (
          <HiOutlineSpeakerWave size={14} className="text-glow-gold/90" />
        )}
        <span className="font-sans text-[0.55rem] font-light tracking-[0.34em] text-starlight/60 uppercase">
          {audioError
            ? "Audio unavailable"
            : muted
              ? "Sound off"
              : track === "birthday"
                ? "Happy Birthday"
                : "Soft piano"}
        </span>
        <span aria-hidden="true" className="flex items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full bg-glow-gold/80"
              animate={muted ? { height: 3 } : { height: [3, 10, 5, 12, 4] }}
              transition={
                muted
                  ? { duration: 0.3 }
                  : { duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }
              }
            />
          ))}
        </span>
        {audioError && (
          <span id="music-player-error" role="status" className="sr-only">
            {audioError}
          </span>
        )}
      </button>
    </motion.div>
  );
}
