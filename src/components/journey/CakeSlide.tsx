import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideShell } from "./SlideShell";
import { playCandleSound } from "@/components/scene1/birthdaySounds";

const CANDLES = [0, 1, 2, 3, 4];

/**
 * Interactive cake — blow out every candle, then launch the birthday fireworks.
 */
export function CakeSlide({
  isActive,
  muted,
  onLaunchFireworks,
}: {
  isActive: boolean;
  muted: boolean;
  onLaunchFireworks: () => void;
}) {
  const [out, setOut] = useState<number[]>([]);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const pointerLaunchAt = useRef(0);
  const allOut = out.length === CANDLES.length;

  const blow = (i: number) => {
    if (out.includes(i)) return;
    playCandleSound(i, muted);
    setOut((current) => (current.includes(i) ? current : [...current, i]));
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!allOut || !start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const swipedUp = deltaY < -48 && Math.abs(deltaX) < 80;
    const tapped = Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12;
    if (swipedUp || tapped) {
      pointerLaunchAt.current = Date.now();
      onLaunchFireworks();
    }
  };

  return (
    <SlideShell
      eyebrow="Make a wish"
      title={allOut ? "Wish made ✨" : "Blow out the candles"}
      isActive={isActive}
    >
      <div className="flex flex-col items-center">
        <p className="mb-3 font-sans text-[0.62rem] font-light tracking-[0.2em] text-starlight/55">
          {allOut ? "Your wish is ready" : "Tap each candle to make a wish"}
        </p>

        <div className="flex items-end gap-1.5" role="group" aria-label="Birthday candles">
          {CANDLES.map((i) => {
            const isOut = out.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => blow(i)}
                aria-label={isOut ? `Candle ${i + 1} is out` : `Tap to blow out candle ${i + 1}`}
                aria-pressed={isOut}
                className="relative flex h-16 w-11 shrink-0 touch-manipulation flex-col items-center justify-end rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-glow-gold"
              >
                <AnimatePresence>
                  {!isOut && (
                    <motion.span
                      key="flame"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: 1,
                        scale: [1, 1.18, 1],
                        y: [0, -2, 0],
                        rotate: [-3, 3, -3],
                      }}
                      exit={{ opacity: 0, scale: 0.3, y: -10 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-0.5 h-4 w-3 rounded-[50%_50%_45%_45%] bg-gradient-to-t from-[#ff9c45] via-glow-gold to-[#fff8df]"
                      style={{
                        boxShadow:
                          "0 0 18px color-mix(in oklab, var(--glow-gold) 85%, transparent), 0 0 34px color-mix(in oklab, var(--glow-rose) 45%, transparent)",
                      }}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isOut && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, y: 4, scale: 0.7 }}
                      animate={{ opacity: [0, 0.55, 0], y: -13, scale: 1.2 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute bottom-10 h-3 w-2 rounded-full bg-starlight/40 blur-[2px]"
                    />
                  )}
                </AnimatePresence>
                <span
                  aria-hidden="true"
                  className={`relative h-10 w-2 rounded-t-sm rounded-b-full shadow-[inset_1px_0_2px_rgba(255,255,255,0.3)] ${isOut ? "bg-starlight/25" : "bg-gradient-to-r from-[#c47a83] via-[#f2c4c0] to-[#a85669]"}`}
                />
              </button>
            );
          })}
        </div>

        <div
          className={`mt-1 w-full max-w-[16rem] ${allOut ? "cursor-pointer touch-manipulation" : ""}`}
          role={allOut ? "button" : undefined}
          tabIndex={allOut ? 0 : -1}
          aria-label={allOut ? "Tap the cake to launch fireworks" : undefined}
          onClick={() => {
            if (Date.now() - pointerLaunchAt.current < 500) {
              pointerLaunchAt.current = 0;
              return;
            }
            if (allOut) onLaunchFireworks();
          }}
          onKeyDown={(event) => {
            if (allOut && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              pointerLaunchAt.current = Date.now();
              onLaunchFireworks();
            }
          }}
          onPointerDown={(event) => {
            if (!allOut) return;
            swipeStart.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
          style={{ touchAction: allOut ? "none" : "auto" }}
        >
          <div className="relative h-7 overflow-hidden rounded-t-xl border border-starlight/20 bg-gradient-to-b from-[#fff0d6]/25 to-[#f2c4c0]/15 backdrop-blur-md">
            <span
              aria-hidden="true"
              className="absolute inset-x-5 top-2 flex justify-between text-[0.55rem] text-glow-gold/80"
            >
              <span>✦</span>
              <span>·</span>
              <span>✦</span>
              <span>·</span>
              <span>✦</span>
            </span>
          </div>
          <div
            className="relative h-12 border-x border-starlight/15 bg-gradient-to-r from-[#8d4a59]/25 via-[#f0c3bd]/15 to-[#8d4a59]/25"
            style={{
              boxShadow: "inset 0 0 30px color-mix(in oklab, var(--glow-rose) 14%, transparent)",
            }}
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-2 h-px bg-glow-gold/25" />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-2 h-px bg-glow-gold/20" />
          </div>
          <div className="h-10 rounded-b-2xl border border-starlight/15 bg-gradient-to-b from-[#f0c3bd]/15 to-[#8d4a59]/20" />
        </div>

        <div
          role="progressbar"
          aria-label="Candles blown out"
          aria-valuemin={0}
          aria-valuemax={CANDLES.length}
          aria-valuenow={out.length}
          className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-starlight/10"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-glow-rose to-glow-gold"
            animate={{ width: `${(out.length / CANDLES.length) * 100}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>

        {allOut ? (
          <>
            <p aria-live="polite" className="mt-4 font-serif text-lg text-glow-gold">
              All five wishes are in the stars ✨
            </p>
            <button
              type="button"
              onClick={onLaunchFireworks}
              className="mt-3 min-h-12 touch-manipulation rounded-full border border-glow-gold/40 bg-glow-gold/[0.12] px-6 py-3 font-sans text-[0.65rem] font-light tracking-[0.2em] text-glow-gold uppercase shadow-[0_0_24px_color-mix(in_oklab,var(--glow-gold)_20%,transparent)] transition-all hover:bg-glow-gold/[0.2] hover:shadow-[0_0_34px_color-mix(in_oklab,var(--glow-gold)_35%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow-gold"
            >
              Send your wishes to the sky 🎆
            </button>
          </>
        ) : (
          <p
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 font-sans text-[0.62rem] font-light tracking-[0.18em] text-starlight/55"
          >
            {CANDLES.length - out.length} {CANDLES.length - out.length === 1 ? "candle" : "candles"}{" "}
            still glowing
          </p>
        )}
      </div>
    </SlideShell>
  );
}
