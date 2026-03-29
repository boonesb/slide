import { z } from "zod";

export const themeSchema = z.object({
  name: z.string(),
  typography: z.record(z.object({ fontFace: z.string(), fontSize: z.number(), bold: z.boolean().optional() })),
  colors: z.record(z.string()),
  layout: z.record(z.number()),
  containers: z.record(z.object({ fill: z.string(), line: z.string().optional(), radius: z.number().optional() })),
  visual: z.record(z.object({ stroke: z.string().optional(), fill: z.string().optional(), size: z.number().optional() }))
});

export type ThemeTokens = z.infer<typeof themeSchema>;

const baseTypography = {
  title_primary: { fontFace: "Aptos", fontSize: 34, bold: true },
  title_secondary: { fontFace: "Aptos", fontSize: 22, bold: true },
  section_label: { fontFace: "Aptos", fontSize: 14, bold: true },
  body_primary: { fontFace: "Aptos", fontSize: 16 },
  body_secondary: { fontFace: "Aptos", fontSize: 13 },
  caption_small: { fontFace: "Aptos", fontSize: 11 },
  stat_large: { fontFace: "Aptos", fontSize: 42, bold: true },
  quote_primary: { fontFace: "Aptos", fontSize: 24 }
};

export const BUILTIN_THEMES: Record<string, ThemeTokens> = {
  "Enterprise Clean": themeSchema.parse({
    name: "Enterprise Clean",
    typography: baseTypography,
    colors: {
      bg_primary: "F7F9FC", bg_panel: "FFFFFF", bg_subtle: "EEF2F7", text_primary: "111827", text_secondary: "4B5563", accent_primary: "1D4ED8", accent_problem: "B91C1C", accent_solution: "047857", divider_subtle: "CBD5E1"
    },
    layout: { margin_outer: 0.5, gap_section: 0.28, gap_card: 0.2, gap_minor: 0.12, padding_card: 0.18, padding_panel: 0.24, safe_title_zone: 1.3 },
    containers: { card_neutral: { fill: "FFFFFF", line: "D1D5DB", radius: 6 }, card_problem: { fill: "FEF2F2", line: "FCA5A5" }, card_solution: { fill: "ECFDF5", line: "6EE7B7" }, card_feature: { fill: "EFF6FF", line: "93C5FD" }, panel_subtle: { fill: "F8FAFC" }, stat_callout: { fill: "EFF6FF", line: "60A5FA" } },
    visual: { icon_standard: { stroke: "334155", size: 18 }, icon_emphasis: { stroke: "1D4ED8", size: 20 }, image_hero: { fill: "E2E8F0" }, image_supporting: { fill: "E2E8F0" }, line_connector: { stroke: "CBD5E1" }, divider_standard: { stroke: "CBD5E1" } }
  }),
  "Enterprise Dark": themeSchema.parse({
    name: "Enterprise Dark",
    typography: baseTypography,
    colors: { bg_primary: "0F172A", bg_panel: "111827", bg_subtle: "1F2937", text_primary: "F8FAFC", text_secondary: "CBD5E1", accent_primary: "60A5FA", accent_problem: "F87171", accent_solution: "34D399", divider_subtle: "334155" },
    layout: { margin_outer: 0.5, gap_section: 0.28, gap_card: 0.2, gap_minor: 0.12, padding_card: 0.18, padding_panel: 0.24, safe_title_zone: 1.3 },
    containers: { card_neutral: { fill: "1F2937", line: "334155", radius: 6 }, card_problem: { fill: "3F1D1D", line: "7F1D1D" }, card_solution: { fill: "052E2B", line: "065F46" }, card_feature: { fill: "172554", line: "1D4ED8" }, panel_subtle: { fill: "1E293B" }, stat_callout: { fill: "172554", line: "1D4ED8" } },
    visual: { icon_standard: { stroke: "E2E8F0", size: 18 }, icon_emphasis: { stroke: "93C5FD", size: 20 }, image_hero: { fill: "334155" }, image_supporting: { fill: "334155" }, line_connector: { stroke: "475569" }, divider_standard: { stroke: "475569" } }
  }),
  "Consulting Minimal": themeSchema.parse({
    name: "Consulting Minimal",
    typography: baseTypography,
    colors: { bg_primary: "FFFFFF", bg_panel: "FFFFFF", bg_subtle: "F8FAFC", text_primary: "0F172A", text_secondary: "475569", accent_primary: "0F766E", accent_problem: "9F1239", accent_solution: "166534", divider_subtle: "E2E8F0" },
    layout: { margin_outer: 0.55, gap_section: 0.32, gap_card: 0.22, gap_minor: 0.12, padding_card: 0.2, padding_panel: 0.24, safe_title_zone: 1.25 },
    containers: { card_neutral: { fill: "FFFFFF", line: "E2E8F0", radius: 4 }, card_problem: { fill: "FFF1F2", line: "FDA4AF" }, card_solution: { fill: "F0FDF4", line: "86EFAC" }, card_feature: { fill: "F0FDFA", line: "5EEAD4" }, panel_subtle: { fill: "F8FAFC" }, stat_callout: { fill: "F0FDFA", line: "2DD4BF" } },
    visual: { icon_standard: { stroke: "334155", size: 17 }, icon_emphasis: { stroke: "0F766E", size: 19 }, image_hero: { fill: "E2E8F0" }, image_supporting: { fill: "E2E8F0" }, line_connector: { stroke: "CBD5E1" }, divider_standard: { stroke: "CBD5E1" } }
  })
};

export const CUSTOM_THEME_EXAMPLE = JSON.stringify(BUILTIN_THEMES["Enterprise Clean"], null, 2);
