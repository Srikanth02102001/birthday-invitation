import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Shot = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  angle: number;
};

const MUZZLE_X = 0.024;
const MUZZLE_Y = 0.35;

function getShot(gun: DOMRect, gift: DOMRect): { shot: Shot; rotation: number } {
  const centerX = gun.left + gun.width / 2;
  const centerY = gun.top + gun.height / 2;
  const targetX = gift.left + gift.width / 2;
  const targetY = gift.top + gift.height / 2;
  const muzzleOffsetX = gun.width * (MUZZLE_X - 0.5);
  const muzzleOffsetY = gun.height * (MUZZLE_Y - 0.5);
  const targetOffsetX = targetX - centerX;
  const targetOffsetY = targetY - centerY;
  const targetDistance = Math.hypot(targetOffsetX, targetOffsetY);
  const muzzleHeightRatio = Math.max(
    -1,
    Math.min(1, muzzleOffsetY / Math.max(targetDistance, Math.abs(muzzleOffsetY))),
  );
  const rotation =
    ((Math.atan2(targetOffsetY, targetOffsetX) - Math.PI + Math.asin(muzzleHeightRatio)) * 180) /
    Math.PI;

  const radians = (rotation * Math.PI) / 180;
  const x = centerX + Math.cos(radians) * muzzleOffsetX - Math.sin(radians) * muzzleOffsetY;
  const y = centerY + Math.sin(radians) * muzzleOffsetX + Math.cos(radians) * muzzleOffsetY;

  return {
    rotation,
    shot: {
      x,
      y,
      dx: targetX - x,
      dy: targetY - y,
      angle: (Math.atan2(targetY - y, targetX - x) * 180) / Math.PI,
    },
  };
}

/**
 * Scene 2 — tap the decorative gun to send a sparkling shot into the gift.
 */
export function GiftBox({
  opened,
  onShotStart,
  onOpen,
}: {
  opened: boolean;
  onShotStart: () => void;
  onOpen: () => void;
}) {
  const giftRef = useRef<HTMLDivElement | null>(null);
  const gunRef = useRef<HTMLButtonElement | null>(null);
  const [shooting, setShooting] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const updateAim = () => {
      const gun = gunRef.current;
      const gift = giftRef.current;
      if (!gun || !gift) return;
      setRotation(getShot(gun.getBoundingClientRect(), gift.getBoundingClientRect()).rotation);
    };

    updateAim();
    window.addEventListener("resize", updateAim);
    return () => window.removeEventListener("resize", updateAim);
  }, []);

  const handleShoot = () => {
    if (opened || shooting) return;

    const gun = gunRef.current;
    const gift = giftRef.current;
    if (!gun || !gift) {
      throw new Error("Cannot fire the gift animation without the gun and gift elements.");
    }

    onShotStart();
    const result = getShot(gun.getBoundingClientRect(), gift.getBoundingClientRect());
    setRotation(result.rotation);
    setShot(result.shot);
    setShooting(true);
  };

  return (
    <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--glow-gold) 28%, transparent) 0%, transparent 66%)",
        }}
        animate={{
          opacity: opened ? 0 : [0.6, 1, 0.6],
          scale: opened ? 1.4 : [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 4,
          repeat: opened ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        ref={giftRef}
        className="relative"
        style={{ width: "clamp(168px, 42vmin, 240px)", aspectRatio: "1", perspective: "900px" }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[5%] left-1/2 h-[10%] w-[82%] -translate-x-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,0,0,.8) 0%, rgba(0,0,0,.32) 48%, transparent 76%)",
            filter: "blur(9px)",
          }}
          animate={{ opacity: opened ? 0 : 0.8, scale: opened ? 0.7 : 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[16%] z-10 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,246,217,.98) 0%, rgba(255,216,145,.76) 18%, rgba(248,179,103,.28) 42%, transparent 72%)",
            filter: "blur(8px)",
          }}
          initial={{ opacity: 0, scale: 0.1 }}
          animate={
            opened
              ? { opacity: [0, 1, 0.65], scale: [0.1, 1.35, 1.8], y: [10, -8, -24] }
              : { opacity: 0, scale: 0.1 }
          }
          transition={{ duration: 1.25, times: [0, 0.5, 1], ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          className="absolute bottom-[9%] left-[5%] h-[66%] w-[90%] overflow-hidden rounded-[1.15rem] border border-[#f2cf89]/50"
          style={{
            background:
              "linear-gradient(112deg, #39101e 0%, #6f1c35 22%, #8c2943 48%, #5b152d 76%, #300d1c 100%)",
            boxShadow:
              "0 20px 36px rgba(0,0,0,.48), 0 0 54px rgba(225,166,91,.2), inset 0 1px 0 rgba(255,244,215,.46), inset 0 -18px 30px rgba(21,4,12,.48)",
          }}
          animate={
            opened ? { opacity: 0, scale: 0.92, y: 12 } : { opacity: 1, scale: 1, y: [0, -2, 0] }
          }
          transition={{
            opacity: { duration: 0.65, delay: opened ? 0.95 : 0 },
            scale: { duration: 0.9, delay: opened ? 0.95 : 0 },
            y: opened
              ? { duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-[5px] rounded-[.85rem] border border-[#e8bd79]/25"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,233,193,.08), transparent 35%, rgba(16,3,10,.2))",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[15%] h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,231,184,.42), transparent)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[15%] h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,231,184,.26), transparent)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-[17%] -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg, #8b5a25 0%, #f0ce87 18%, #fff0bd 42%, #d7aa5b 63%, #8b5a25 100%)",
              boxShadow: "0 0 18px rgba(255,219,150,.22)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[43%] h-[17%]"
            style={{
              background:
                "linear-gradient(180deg, #8b5a25 0%, #f0ce87 18%, #fff0bd 42%, #d7aa5b 63%, #8b5a25 100%)",
              boxShadow: "0 0 18px rgba(255,219,150,.22)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-[8%] bottom-[8%] h-[18%] rounded-lg border border-[#f6dcaa]/45"
            style={{
              background: "linear-gradient(145deg, rgba(39,9,20,.62), rgba(109,30,53,.58))",
              boxShadow: "inset 0 1px 0 rgba(255,239,205,.18)",
            }}
          >
            <span className="flex h-full items-center justify-center font-sans text-[clamp(.42rem,1.8vmin,.62rem)] font-light tracking-[.34em] text-[#f4dcae] uppercase">
              For Manasa
            </span>
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-[47%] z-10 h-[18%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, #fff4cf 0%, #f3cf86 24%, #bd8243 55%, rgba(91,42,29,.92) 100%)",
              boxShadow: "0 0 18px rgba(255,221,157,.72), 0 2px 6px rgba(20,5,10,.5)",
            }}
            animate={opened ? { scale: 1.9, opacity: 0 } : { scale: [1, 1.04, 1] }}
            transition={
              opened
                ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        <motion.div
          className="absolute left-[-1%] top-[20%] z-20 h-[25%] w-[102%] rounded-[1.1rem] border border-[#ffe3ad]/75"
          style={{
            background:
              "linear-gradient(105deg, #491323 0%, #8a2942 18%, #a83d54 46%, #77203a 78%, #3b101f 100%)",
            boxShadow:
              "0 12px 24px rgba(0,0,0,.42), 0 0 26px rgba(240,191,119,.25), inset 0 2px 0 rgba(255,243,216,.62), inset 0 -7px 12px rgba(32,5,16,.44)",
            transformOrigin: "50% 12%",
            transformStyle: "preserve-3d",
          }}
          animate={
            opened
              ? { rotateX: -112, rotateZ: -8, y: -24, opacity: 0.16 }
              : { rotateX: [0, 1.5, 0], rotateZ: 0, y: [0, -2, 0], opacity: 1 }
          }
          transition={
            opened
              ? { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <div
            aria-hidden="true"
            className="absolute inset-[5px] rounded-[.85rem] border border-[#ffebc4]/30"
            style={{
              background:
                "linear-gradient(155deg, rgba(255,238,202,.13), transparent 34%, rgba(31,5,16,.12))",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-[17%] -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg, #95632d 0%, #f3d48f 18%, #fff1c1 42%, #dab36b 63%, #95632d 100%)",
              boxShadow: "0 0 16px rgba(255,222,159,.28)",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[43%] h-[17%]"
            style={{
              background:
                "linear-gradient(180deg, #95632d 0%, #f3d48f 18%, #fff1c1 42%, #dab36b 63%, #95632d 100%)",
              boxShadow: "0 0 16px rgba(255,222,159,.28)",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-23%] z-10 h-[52%] w-[36%] -translate-x-1/2"
            animate={opened ? { y: -14, scale: 0.72, opacity: 0 } : { y: [0, -2, 0] }}
            transition={
              opened
                ? { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <motion.span
              className="absolute left-[3%] top-[18%] h-[48%] w-[48%] rounded-[55%_45%_52%_48%]"
              style={{
                background:
                  "linear-gradient(145deg, #fff1c1 0%, #e8c273 35%, #ae773a 72%, #f3d99c 100%)",
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,.55), 0 3px 8px rgba(0,0,0,.25)",
              }}
              animate={
                opened
                  ? { x: -18, y: -8, rotate: -42, scale: 0.5, opacity: 0 }
                  : { rotate: [-8, -4, -8] }
              }
              transition={
                opened
                  ? { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <motion.span
              className="absolute right-[3%] top-[18%] h-[48%] w-[48%] rounded-[45%_55%_48%_52%]"
              style={{
                background:
                  "linear-gradient(215deg, #fff1c1 0%, #e8c273 35%, #ae773a 72%, #f3d99c 100%)",
                boxShadow: "inset -1px 1px 2px rgba(255,255,255,.48), 0 3px 8px rgba(0,0,0,.25)",
              }}
              animate={
                opened
                  ? { x: 18, y: -8, rotate: 42, scale: 0.5, opacity: 0 }
                  : { rotate: [8, 4, 8] }
              }
              transition={
                opened
                  ? { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <motion.span
              className="absolute left-[35%] top-[53%] h-[43%] w-[30%] -skew-x-12 rounded-b-md"
              style={{
                background: "linear-gradient(90deg, #aa7738, #fff0be 38%, #dfb86e 70%, #8e602e)",
                clipPath: "polygon(0 0, 100% 0, 88% 100%, 50% 78%, 12% 100%)",
              }}
              animate={opened ? { y: 10, opacity: 0 } : { rotate: [0, 2, 0] }}
              transition={
                opened ? { duration: 0.5 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <motion.span
              className="absolute left-[47%] top-[53%] h-[43%] w-[30%] skew-x-12 rounded-b-md"
              style={{
                background: "linear-gradient(90deg, #8e602e, #dfb86e 35%, #fff0be 68%, #aa7738)",
                clipPath: "polygon(0 0, 100% 0, 88% 100%, 50% 78%, 12% 100%)",
              }}
              animate={opened ? { y: 10, opacity: 0 } : { rotate: [0, -2, 0] }}
              transition={
                opened ? { duration: 0.5 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </motion.div>
        </motion.div>

        {Array.from({ length: 10 }, (_, index) => {
          const angle = (index / 10) * Math.PI * 2;
          const driftX = Math.cos(angle) * (36 + (index % 3) * 15);
          const driftY = Math.sin(angle) * (34 + (index % 4) * 13) - 24;
          return (
            <motion.span
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[48%] z-30 h-1.5 w-1.5 rounded-full"
              style={{
                background: index % 3 === 0 ? "#fff0bd" : "#e7bd72",
                boxShadow: "0 0 10px 2px rgba(255,224,163,.82)",
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
              animate={
                opened
                  ? {
                      opacity: [0, 1, 0],
                      x: [0, driftX],
                      y: [0, driftY - 28],
                      scale: [0.2, 1.35, 0.2],
                    }
                  : { opacity: 0, x: 0, y: 0, scale: 0.2 }
              }
              transition={{
                duration: 1.1,
                delay: 0.08 + (index % 5) * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {!opened && (
          <motion.button
            ref={gunRef}
            type="button"
            aria-label="Fire a sparkling shot at the gift"
            disabled={shooting}
            onClick={handleShoot}
            initial={{ opacity: 0 }}
            animate={shooting ? { opacity: 1, x: [0, -5, 0] } : { opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: shooting ? 0.24 : 0.8 }}
            className="absolute z-30 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-glow-gold disabled:cursor-default"
            style={{
              width: "min(48vw, 360px)",
              aspectRatio: "1422 / 768",
              right: "0%",
              bottom: "17%",
            }}
          >
            <motion.img
              src="/ump45.webp"
              alt=""
              draggable={false}
              fetchPriority="high"
              className="h-full w-full select-none object-contain drop-shadow-[0_0_18px_rgba(255,190,90,0.42)]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 400ms ease-out",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shooting && shot && !opened && (
          <>
            <motion.span
              aria-hidden="true"
              className="pointer-events-none fixed z-50 block h-3 w-3 rounded-full bg-glow-gold"
              style={{
                left: shot.x,
                top: shot.y,
                boxShadow: "0 0 12px 5px rgba(255, 214, 153, 0.85)",
              }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 1.8, 0.5] }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
              style={{ left: shot.x, top: shot.y }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.55 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: shot.dx,
                y: shot.dy,
                scale: [0.55, 1, 0.8, 0.2],
              }}
              transition={{ duration: 0.55, ease: "easeIn" }}
              onAnimationComplete={onOpen}
            >
              <span
                className="block h-[3px] w-8 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,226,160,0.9)]"
                style={{ transform: `rotate(${shot.angle}deg)` }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
