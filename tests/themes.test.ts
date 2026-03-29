import { describe, expect, it } from "vitest";
import { BUILTIN_THEMES } from "@/lib/themes/themes";

describe("themes", () => {
  it("has required token categories", () => {
    for (const theme of Object.values(BUILTIN_THEMES)) {
      expect(theme.typography.title_primary).toBeDefined();
      expect(theme.colors.bg_primary).toBeTruthy();
      expect(theme.layout.margin_outer).toBeGreaterThan(0);
    }
  });
});
