import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MusicPlayer } from "@/components/journey/MusicPlayer";
import { Starfield } from "@/components/scene1/Starfield";
import { GiftBox } from "@/components/scene1/GiftBox";
import { RevealText } from "@/components/scene1/RevealText";
import { TapToBegin } from "@/components/scene1/TapToBegin";
import { Petals } from "@/components/scene1/Petals";
import { useBirthdayAudio } from "@/components/scene1/useAudioLayer";

const JourneyDeck = lazy(() => import("@/components/journey/JourneyDeck"));

type Phase = "idle" | "whisper" | "bloom" | "name" | "gift" | "opened" | "finale" | "journey";

const burst = async (y = 0.6) => {
  const { default: confetti } = await import("canvas-confetti");
  confetti({
    particleCount: 120,
    spread: 120,
    startVelocity: 38,
    gravity: 0.55,
    ticks: 340,
    scalar: 0.9,
    origin: { x: 0.5, y },
    colors: ["#fff7e6", "#ffd699", "#ffc4c7", "#f7e7c6"],
    disableForReducedMotion: false,
  });
};

function BirthdayExperience() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const { muted, track, audioError, toggleMuted, prepareForShot, startBirthdaySong } =
    useBirthdayAudio(started);

  useEffect(() => {
    if (!started) return;
    const timers = [
      window.setTimeout(() => setPhase("whisper"), 2200),
      window.setTimeout(() => setPhase("bloom"), 5600),
      window.setTimeout(() => setPhase("name"), 7000),
      window.setTimeout(() => setPhase("gift"), 12000),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [started]);

  useEffect(() => {
    if (phase !== "opened") return;
    void burst(0.55);
    const timer = window.setTimeout(() => {
      setPhase("finale");
      void burst(0.7);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const bloomed = phase !== "idle" && phase !== "whisper";
  const finale = phase === "finale";

  return (
    <main className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-night">
      <Starfield reveal={started ? 1 : 0} />
      {(finale || phase === "journey") && <Petals />}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[75vmin] w-[75vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--glow-gold) 22%, transparent) 0%, transparent 68%)",
        }}
        animate={{ opacity: bloomed ? 1 : 0, scale: bloomed ? 1 : 0.85 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      <div
        className={`relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-8 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] ${phase === "journey" ? "pointer-events-none" : ""}`}
      >
        <AnimatePresence mode="wait">
          {phase === "whisper" && (
            <motion.div
              key="whisper"
              exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 1.2 } }}
              className="max-w-xs text-center"
            >
              <RevealText
                text="Thanks for being such an amazing frnd 😀"
                className="font-sans text-base font-extralight leading-relaxed tracking-[0.18em] text-starlight/70"
                stagger={0.26}
              />
            </motion.div>
          )}

          {phase === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1.2 } }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <h1
                className="font-serif text-5xl font-light tracking-tight text-starlight sm:text-6xl"
                style={{
                  textShadow:
                    "0 0 40px color-mix(in oklab, var(--glow-gold) 45%, transparent), 0 0 90px color-mix(in oklab, var(--glow-rose) 25%, transparent)",
                }}
              >
                Belated Happy Diwali Shine
              </h1>
              <p className="mt-3 font-serif text-4xl font-light text-starlight sm:text-5xl">
                Brighter Better EveryDay
                <motion.span
                  className="inline-block"
                  animate={{ scale: [1, 1.14, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  aria-label="with love"
                >
                  🧟‍♀️
                </motion.span>
              </p>
            </motion.div>
          )}

          {(phase === "gift" || phase === "opened") && (
            <motion.div
              key="gift"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1 } }}
              transition={{ duration: 1.6 }}
              className="absolute inset-0"
            >
              <GiftBox
                opened={phase === "opened"}
                onShotStart={() => {
                  prepareForShot();
                  startBirthdaySong();
                }}
                onOpen={() => {
                  setPhase("opened");
                }}
              />
            </motion.div>
          )}

          {finale && (
            <motion.section
              key="finale"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 1 } }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md rounded-[2rem] border border-starlight/15 bg-starlight/[0.06] px-8 py-12 text-center backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 0 80px color-mix(in oklab, var(--glow-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklab, var(--starlight) 18%, transparent)",
              }}
            >
              <p className="font-sans text-[0.62rem] font-light tracking-[0.5em] text-glow-gold/70 uppercase">
                Today is yours
              </p>
              <h1 className="mt-6 font-serif text-5xl font-light leading-[1.05] tracking-tight text-starlight sm:text-6xl">
                Happy
                <br />
                Birthday
              </h1>
              <p
                className="mt-4 font-serif text-4xl font-light text-starlight sm:text-5xl"
                style={{
                  textShadow:
                    "0 0 40px color-mix(in oklab, var(--glow-gold) 50%, transparent), 0 0 90px color-mix(in oklab, var(--glow-rose) 28%, transparent)",
                }}
              >
                Manasa{" "}
                <motion.span
                  className="inline-block"
                  animate={{ scale: [1, 1.14, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  ❤️
                </motion.span>
              </p>

              <motion.button
                type="button"
                onClick={() => setPhase("journey")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 2 }}
                className="mt-10 rounded-full border border-starlight/20 bg-starlight/[0.06] px-6 py-3 font-sans text-[0.6rem] font-light tracking-[0.4em] text-starlight/75 uppercase transition-colors hover:bg-starlight/[0.12]"
              >
                Open your memories
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {phase === "journey" && (
        <Suspense
          fallback={
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <p className="font-sans text-xs tracking-[0.3em] text-starlight/70 uppercase">
                Opening your memories
              </p>
            </div>
          }
        >
          <JourneyDeck muted={muted} />
        </Suspense>
      )}

      <AnimatePresence>
        {!started && <TapToBegin onBegin={() => setStarted(true)} />}
      </AnimatePresence>

      {started && (
        <MusicPlayer muted={muted} track={track} audioError={audioError} onToggle={toggleMuted} />
      )}
    </main>
  );
}

export default function App() {
  return <BirthdayExperience />;
}
