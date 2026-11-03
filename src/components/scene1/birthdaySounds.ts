export const FIREWORK_DELAYS_SECONDS = [0, 2, 4, 6, 8, 10, 12, 14] as const;

let audioContext: AudioContext | null = null;
let effectsBus: GainNode | null = null;

function getAudioContext(): Promise<AudioContext | null> {
  if (typeof window === "undefined" || !window.AudioContext) {
    return Promise.resolve(null);
  }

  audioContext ??= new window.AudioContext();
  effectsBus ??= audioContext.createGain();
  effectsBus.gain.value = 0.32;
  effectsBus.connect(audioContext.destination);

  if (audioContext.state === "running") return Promise.resolve(audioContext);
  return audioContext.resume().then(() => audioContext);
}

function playTone(
  context: AudioContext,
  frequency: number,
  startAt: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
  endFrequency = frequency,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.025, duration / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain);
  gain.connect(effectsBus ?? context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

function playNoise(
  context: AudioContext,
  startAt: number,
  duration: number,
  volume: number,
  lowFrequency: number,
  highFrequency: number,
) {
  const frameCount = Math.ceil(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    samples[i] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(lowFrequency, startAt);
  filter.frequency.exponentialRampToValueAtTime(highFrequency, startAt + duration);
  filter.Q.value = 0.65;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + Math.min(0.035, duration / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(effectsBus ?? context.destination);
  source.start(startAt);
  source.stop(startAt + duration);
}

function reportPlaybackFailure(error: unknown) {
  console.warn("Birthday sound effects could not be played.", error);
}

export function playCandleSound(candleIndex: number, muted: boolean) {
  if (muted) return;

  void getAudioContext()
    .then((context) => {
      if (!context) return;
      const startAt = context.currentTime + 0.015;
      playNoise(context, startAt, 0.24, 0.16, 1100, 380);
      playTone(context, 480 + candleIndex * 35, startAt, 0.28, 0.1, "sine", 220);

      if (candleIndex === 4) {
        [659.25, 783.99, 987.77].forEach((frequency, index) => {
          playTone(context, frequency, startAt + 0.12 + index * 0.1, 0.9, 0.1);
        });
      }
    })
    .catch(reportPlaybackFailure);
}

export function playFireworksSound(muted: boolean) {
  if (muted) return;

  void getAudioContext()
    .then((context) => {
      if (!context) return;
      const startAt = context.currentTime + 0.04;
      playNoise(context, startAt, 0.8, 0.12, 280, 1800);
      playTone(context, 150, startAt, 0.75, 0.1, "sawtooth", 620);

      FIREWORK_DELAYS_SECONDS.forEach((delay, index) => {
        const burstAt = startAt + delay + 0.85;
        playNoise(context, burstAt, 0.52, 0.2, 320 + index * 35, 2200 + index * 120);
        playNoise(context, burstAt + 0.05, 0.32, 0.08, 2400, 5200);
        playTone(context, 180 + (index % 3) * 35, burstAt, 0.42, 0.1, "triangle", 75);
      });
    })
    .catch(reportPlaybackFailure);
}
