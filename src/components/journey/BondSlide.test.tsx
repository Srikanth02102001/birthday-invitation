import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BondSlide } from "./BondSlide";
import { bondMoments } from "./content";

describe("BondSlide", () => {
  it("shares the personal moments that define their friendship", () => {
    const markup = renderToStaticMarkup(<BondSlide isActive />);

    expect(markup).toContain("The little things that became our story");
    for (const moment of bondMoments) {
      expect(markup).toContain(moment.title);
      expect(markup).toContain(moment.message);
    }
  });
});
