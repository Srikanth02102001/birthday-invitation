import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MyEffortsSlide } from "./MyEffortsSlide";
import { myEfforts } from "./content";

describe("MyEffortsSlide", () => {
  it("shows the effort story and the December interview note", () => {
    const markup = renderToStaticMarkup(<MyEffortsSlide isActive />);

    expect(markup).toContain("My efforts");
    expect(markup).toContain(myEfforts.startDate);
    for (const paragraph of myEfforts.paragraphs) {
      expect(markup).toContain(paragraph);
    }
  });
});
