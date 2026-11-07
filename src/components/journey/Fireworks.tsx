import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import { FIREWORK_DELAYS_SECONDS } from "@/components/scene1/birthdaySounds";

const FIREWORK_POSITIONS = [
  { x: 0.2, y: 0.3 },
  { x: 0.76, y: 0.24 },
  { x: 0.48, y: 0.2 },
  { x: 0.32, y: 0.38 },
  { x: 0.84, y: 0.36 },
  { x: 0.14, y: 0.2 },
  { x: 0.64, y: 0.29 },
  { x: 0.43, y: 0.33 },
] as const;
const FIREWORKS = FIREWORK_DELAYS_SECONDS.map((delay, index) => {
  const position = FIREWORK_POSITIONS[index];
  if (!position) throw new Error(`Missing firework position for burst ${index + 1}.`);
  return { ...position, delay };
});

const COLORS = ["#fff8df", "#ffd36f", "#ffae54"];
const ROCKET_DURATION_SECONDS = 1.6;
const BURST_START_DELAY_SECONDS = 0.85;
const BURST_DURATION_SECONDS = 3.4;
const LAST_BURST_END_SECONDS = Math.max(
  ...FIREWORKS.map(({ delay }) => delay + BURST_START_DELAY_SECONDS + BURST_DURATION_SECONDS),
);
export const FIREWORKS_DURATION_MS = Math.ceil((LAST_BURST_END_SECONDS + 0.5) * 1000);

/**
 * A sustained sequence of firework shots followed by a cake-positioned birthday-name reveal.
 */
export function Fireworks({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (!active) return;

    const timer = window.setTimeout(onComplete, FIREWORKS_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <style>{`
        @keyframes birthday-rocket-rise {
          0% { opacity: 0; transform: translate(-50%, 0) scaleY(.5); }
          10% { opacity: 1; }
          78% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, calc(-1 * var(--rise-distance))) scaleY(.7); }
        }
        @keyframes birthday-firework-burst {
          0%, 8% { opacity: 0; transform: scale(.12); }
          22% { opacity: 1; transform: scale(.88); }
          58% { opacity: .9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        @keyframes birthday-name-reveal {
          0%, 8% { opacity: 0; transform: translate(-50%, -50%) scale(.96); }
          18%, 82% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          .birthday-rocket { animation-duration: 1s !important; }
          .birthday-firework-burst { animation-duration: 2s !important; }
          .birthday-name-reveal { animation-duration: 7s !important; }
        }
      `}</style>

      {FIREWORKS.map(({ x, y, delay }, index) => (
        <Fragment key={`${x}-${y}`}>
          <div
            className="birthday-rocket absolute h-14 w-[3px] rounded-full"
            style={
              {
                left: `${x * 100}%`,
                top: "92%",
                background: "linear-gradient(to top, transparent, #ffbd70 35%, #fff9e8)",
                boxShadow: "0 0 10px 3px rgba(255, 195, 115, .8)",
                animation: `birthday-rocket-rise ${ROCKET_DURATION_SECONDS}s ease-out ${delay}s both`,
                "--rise-distance": `${(0.92 - y) * 100}vh`,
              } as React.CSSProperties
            }
          />
          <div
            className="absolute"
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg
              viewBox="0 0 120 120"
              className="birthday-firework-burst"
              style={{
                display: "block",
                width: "clamp(6rem, 24vw, 9rem)",
                height: "clamp(6rem, 24vw, 9rem)",
                overflow: "visible",
                animation: `birthday-firework-burst ${BURST_DURATION_SECONDS}s ease-out ${delay + BURST_START_DELAY_SECONDS}s both`,
              }}
            >
              <circle cx="60" cy="60" r="3" fill="#fffdf3" />
              {Array.from({ length: 20 }, (_, ray) => {
                const angle = (ray / 20) * Math.PI * 2;
                const innerRadius = ray % 2 === 0 ? 8 : 13;
                const outerRadius = ray % 2 === 0 ? 48 : 36;
                const x1 = 60 + Math.cos(angle) * innerRadius;
                const y1 = 60 + Math.sin(angle) * innerRadius;
                const x2 = 60 + Math.cos(angle) * outerRadius;
                const y2 = 60 + Math.sin(angle) * outerRadius;

                return (
                  <Fragment key={ray}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={COLORS[(ray + index) % COLORS.length]}
                      strokeWidth={ray % 2 === 0 ? 2 : 1.5}
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 3px rgba(255, 205, 112, .9))" }}
                    />
                    <circle
                      cx={x2}
                      cy={y2}
                      r={ray % 3 === 0 ? 1.5 : 1}
                      fill={COLORS[(ray + index) % COLORS.length]}
                    />
                  </Fragment>
                );
              })}
            </svg>
          </div>
        </Fragment>
      ))}

      <h1
        aria-live="polite"
        aria-atomic="true"
        className="birthday-name-reveal absolute left-1/2 top-[58%] z-10 m-0 text-center font-serif font-light leading-none"
        style={{
          width: "calc(100vw - 2rem)",
          maxWidth: "52rem",
          fontSize: "clamp(1.8rem, 8vw, 5rem)",
          letterSpacing: "clamp(0.08em, 1.2vw, 0.16em)",
          paddingLeft: "0.12em",
          color: "#fff2cf",
          textShadow:
            "0 0 12px rgba(255,230,174,.92), 0 0 38px rgba(255,188,115,.78), 0 0 82px rgba(255,131,157,.42)",
          animation: `birthday-name-reveal ${FIREWORKS_DURATION_MS / 1000}s ease-in-out 0.2s both`,
        }}
      >
        MANASA99
      </h1>
    </div>,
    document.body,
  );
}
