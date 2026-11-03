import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CakeSlide } from "./CakeSlide";

describe("CakeSlide", () => {
  it("shows five accessible candles, a progress indicator, and clear instructions", () => {
    const markup = renderToStaticMarkup(
      <CakeSlide isActive muted={false} onLaunchFireworks={() => {}} />,
    );

    expect(markup.match(/aria-label="Tap to blow out candle \d"/g)).toHaveLength(5);
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuenow="0"');
    expect(markup).toContain("Tap each candle to make a wish");
    expect(markup).toContain("5 candles still glowing");
  });
});
