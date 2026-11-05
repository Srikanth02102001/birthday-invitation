import { useEffect, useRef } from "react";
import gsap from "gsap";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  appearAt: number;
  hue: "white" | "gold" | "rose";
};

const COLORS: Record<Star["hue"], string> = {
  white: "255, 249, 240",
  gold: "255, 214, 153",
  rose: "255, 196, 199",
};
const MAX_STAR_RADIUS = 1.6;
const MAX_STAR_GLOW_RADIUS = 7;

function makeStars(width: number, height: number): Star[] {
  const count = Math.min(650, Math.max(220, Math.round((width * height) / 1900)));
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.min(MAX_STAR_RADIUS, 0.45 + Math.random() ** 2 * 1.15),
      base: 0.5 + Math.random() * 0.2,
      appearAt: 1 - Math.random() ** 1.8,
      hue: roll > 0.985 ? "rose" : roll > 0.94 ? "gold" : "white",
    });
  }
  return stars;
}

/**
 * Canvas starfield. `reveal` drives how many stars have appeared (0 -> 1).
 */
export function Starfield({ reveal }: { reveal: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const anim = useRef({ reveal: 0 });
  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const tween = gsap.to(anim.current, {
      reveal,
      duration: 10,
      ease: "none",
      overwrite: "auto",
      onUpdate: () => renderRef.current?.(),
    });
    return () => {
      tween.kill();
    };
  }, [reveal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(width, height);
    };

    const draw = () => {
      const { reveal: rv } = anim.current;

      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        if (s.appearAt > rv) continue;
        const fade = Math.min(1, (rv - s.appearAt) * 4);
        const x = s.x * width;
        const y = s.y * height;
        const alpha = Math.max(0, Math.min(1, s.base * fade));
        const radius = Math.max(0.45, Math.min(s.r, MAX_STAR_RADIUS));
        const glowRadius = Math.min(radius * 5, MAX_STAR_GLOW_RADIUS);
        const color = COLORS[s.hue];

        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        glow.addColorStop(0, `rgba(${color}, ${alpha})`);
        glow.addColorStop(0.35, `rgba(${color}, ${alpha * 0.28})`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    renderRef.current = draw;
    const onResize = () => {
      resize();
      draw();
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
