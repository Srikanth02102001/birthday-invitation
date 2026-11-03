import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

/**
 * Soft piano bed.
 *
 * PLACEHOLDER: swap this single URL for the uploaded MP3 when it arrives.
 * Everything else (fade-in, loop, mute toggle) already works.
 */
export const PIANO_SRC =
  "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=soft-piano-100-bpm-121529.mp3";

export const BIRTHDAY_SONG_SRC = "/birthday-song.mp3";

export function useBirthdayAudio(started: boolean) {
  const pianoRef = useRef<Howl | null>(null);
  const birthdayRef = useRef<Howl | null>(null);
  const mutedRef = useRef(false);
  const pianoStopTimerRef = useRef<number | null>(null);
  const birthdayStartedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [track, setTrack] = useState<"piano" | "birthday">("piano");
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    if (!started || pianoRef.current) return;

    const reportTrackError = (name: string) => (_soundId: number, error: unknown) => {
      console.error(`Unable to play the ${name} track.`, error);
      setAudioError(`${name === "birthday" ? "Birthday song" : "Piano"} could not be played.`);
    };

    const piano = new Howl({
      src: [PIANO_SRC],
      html5: true,
      loop: true,
      volume: 0,
      mute: mutedRef.current,
      onloaderror: reportTrackError("piano"),
      onplayerror: reportTrackError("piano"),
    });
    const birthday = new Howl({
      src: [BIRTHDAY_SONG_SRC],
      html5: true,
      loop: false,
      preload: true,
      volume: 0,
      mute: mutedRef.current,
      onloaderror: reportTrackError("birthday"),
      onplayerror: reportTrackError("birthday"),
    });

    pianoRef.current = piano;
    birthdayRef.current = birthday;
    birthdayStartedRef.current = false;
    setTrack("piano");
    setAudioError(null);
    piano.play();
    piano.fade(0, 0.55, 4000);

    return () => {
      if (pianoStopTimerRef.current !== null) {
        window.clearTimeout(pianoStopTimerRef.current);
        pianoStopTimerRef.current = null;
      }
      piano.fade(piano.volume(), 0, 250);
      birthday.stop();
      window.setTimeout(() => {
        piano.unload();
        birthday.unload();
      }, 300);
      pianoRef.current = null;
      birthdayRef.current = null;
    };
  }, [started]);

  useEffect(() => {
    mutedRef.current = muted;
    pianoRef.current?.mute(muted);
    birthdayRef.current?.mute(muted);
  }, [muted]);

  const prepareForShot = useCallback(() => {
    const piano = pianoRef.current;
    if (!piano || birthdayStartedRef.current) return;

    if (pianoStopTimerRef.current !== null) {
      window.clearTimeout(pianoStopTimerRef.current);
    }
    piano.fade(piano.volume(), 0, 300);
    pianoStopTimerRef.current = window.setTimeout(() => {
      piano.stop();
      pianoStopTimerRef.current = null;
    }, 350);
  }, []);

  const startBirthdaySong = useCallback(() => {
    const piano = pianoRef.current;
    const birthday = birthdayRef.current;
    if (!birthday || birthdayStartedRef.current) return;

    birthdayStartedRef.current = true;
    if (pianoStopTimerRef.current !== null) {
      window.clearTimeout(pianoStopTimerRef.current);
      pianoStopTimerRef.current = null;
    }
    piano?.stop();
    setAudioError(null);
    setTrack("birthday");

    const playBirthday = () => {
      birthday.mute(mutedRef.current);
      birthday.volume(0.7);
      birthday.play();
    };

    if (birthday.state() === "loaded") {
      playBirthday();
    } else {
      birthday.once("load", playBirthday);
    }
  }, []);

  const toggleMuted = useCallback(() => setMuted((current) => !current), []);

  return { muted, track, audioError, toggleMuted, prepareForShot, startBirthdaySong };
}
