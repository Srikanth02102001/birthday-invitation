import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MusicPlayer } from "./MusicPlayer";

describe("MusicPlayer", () => {
  it("announces the birthday song after the track switch", () => {
    const markup = renderToStaticMarkup(
      <MusicPlayer muted={false} track="birthday" audioError={null} onToggle={() => {}} />,
    );

    expect(markup).toContain("Happy Birthday");
    expect(markup).toContain("Mute music and sound effects");
  });

  it("makes audio playback errors visible", () => {
    const markup = renderToStaticMarkup(
      <MusicPlayer
        muted={false}
        track="birthday"
        audioError="Birthday song could not be played."
        onToggle={() => {}}
      />,
    );

    expect(markup).toContain("Audio unavailable");
    expect(markup).toContain("Birthday song could not be played.");
  });
});
