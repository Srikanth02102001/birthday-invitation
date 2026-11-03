# Scene 1 — The Magical First Impression

A single full-screen, mobile-first cinematic intro for Manasa's birthday. No scrolling, no other pages. Optimized for iPhone 16 Pro Max (safe areas, tall viewport), works on desktop too.

## The sequence

```text
0.0s   Pure black screen. A single soft "Tap to begin" pulse.
       (Tap is required — mobile browsers block autoplay audio.)
0.0s   On tap: soft piano fades in.
0.5s   Tiny stars begin to appear — sparse, then a slow drifting starfield.
2.5s   "Someone made something special for you..." fades up, letter by letter.
6.0s   That line fades out. Stars brighten and pull inward slightly.
7.5s   "Happy Birthday, Manasa ❤️" scales in with a warm glow.
9.0s   A gentle confetti burst; starfield keeps drifting. Screen holds here.
```

## Look and feel

- Pure black canvas, warm off-white text, soft gold/rose glow accents — no purple gradients.
- Elegant serif for the name reveal, light sans for the whisper line.
- Everything slow and breathing: long easings, no bouncy motion.
- Stars: hundreds of tiny points with staggered fade-in, subtle twinkle and slow parallax drift.
- Respects `prefers-reduced-motion` (shows the text reveals, skips drift/twinkle).

## Music

You'll upload the MP3. Until then I'll wire the audio layer with a placeholder source so the fade-in, loop, and a small mute toggle (bottom corner) are already working — dropping in your file is then a one-line swap.

## Technical notes

- Stack as specified: React 19 + Vite + Tailwind, Framer Motion for text/opacity reveals, GSAP timeline for the starfield choreography, Howler.js for the piano with fade-in and loop, canvas-confetti for the final burst.
- Lenis, Lottie, Swiper and React Icons are part of the overall stack but are not needed for Scene 1; they'll be added when the scroll story arrives (I'll only install what this scene uses, plus React Icons for the mute toggle).
- Built as the app's home route (`/`), replacing the placeholder page, with its own page title and social preview metadata.
- Star rendering on a `<canvas>` sized to `devicePixelRatio` so points stay crisp on the Pro Max display; animation paused when the tab is hidden.
- Structure: one `Scene1` route composed of small pieces — `Starfield` (canvas), `RevealText`, `AudioLayer`, `TapToBegin` — so later scenes can reuse them.
