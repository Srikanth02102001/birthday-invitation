// Runtime validation coverage for: cake fireworks launch and centered name reveal.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    createPortal: (children: ReactNode) => children,
  };
});

import { Fireworks, FIREWORKS_DURATION_MS } from "./Fireworks";

describe("Fireworks", () => {
  beforeEach(() => {
    vi.stubGlobal("document", { body: {} });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders no celebration while inactive", () => {
    expect(renderToStaticMarkup(<Fireworks active={false} onComplete={() => {}} />)).toBe("");
  });

  it("shows a sustained sequence of eight fireworks and a centered name reveal", () => {
    const markup = renderToStaticMarkup(<Fireworks active onComplete={() => {}} />);

    expect(markup).toContain("MANASA999");
    expect(markup).toContain("left-1/2 top-1/2");
    expect(markup).toContain(`birthday-name-reveal ${FIREWORKS_DURATION_MS / 1000}s`);
    expect(markup.match(/class="birthday-rocket/g)).toHaveLength(8);
    expect(markup.match(/<svg/g)).toHaveLength(8);
    expect(markup).toContain("birthday-name-reveal");
    expect(FIREWORKS_DURATION_MS).toBeGreaterThanOrEqual(18_000);
  });
});
