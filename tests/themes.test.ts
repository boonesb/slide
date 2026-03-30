import { describe, expect, it } from "vitest";
import { BUILTIN_THEMES } from "@/lib/themes/themes";

describe("themes", () => {
  it("has required token categories", () => {
    for (const theme of Object.values(BUILTIN_THEMES)) {
      expect(theme.typography.title_primary).toBeDefined();
      expect(theme.colors.bg_primary).toBeTruthy();
      expect(theme.layout.margin_outer).toBeGreaterThan(0);
      expect(theme.containers.card_problem.fill).toBeTruthy();
      expect(theme.containers.card_solution.fill).toBeTruthy();
      expect(theme.containers.card_feature.fill).toBeTruthy();
    }
  });

  it("keeps visible differentiation between major styles", () => {
    const clean = BUILTIN_THEMES["Enterprise Clean"];
    const dark = BUILTIN_THEMES["Enterprise Dark"];
    const consulting = BUILTIN_THEMES["Consulting Minimal"];

    expect(clean.colors.bg_primary).not.toBe(dark.colors.bg_primary);
    expect(clean.colors.text_primary).not.toBe(dark.colors.text_primary);
    expect(clean.colors.accent_primary).not.toBe(consulting.colors.accent_primary);
  });
});
