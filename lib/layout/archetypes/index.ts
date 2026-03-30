import type { SlideSchema } from "@/types/slide";
import type { LayoutBuildContext } from "@/lib/layout/types";
import { buildTitleHero } from "@/lib/layout/archetypes/title-hero";
import { buildTwoColumn } from "@/lib/layout/archetypes/two-column";
import { buildThreeCard } from "@/lib/layout/archetypes/three-card";
import { buildQuoteProof } from "@/lib/layout/archetypes/quote-proof";
import { buildFallback } from "@/lib/layout/archetypes/fallback";

export function buildArchetypeElements(ctx: LayoutBuildContext): SlideSchema["layout"]["elements"] {
  switch (ctx.semantic.archetype) {
    case "title_hero":
      return buildTitleHero(ctx);
    case "two_column":
      return buildTwoColumn(ctx);
    case "three_card":
      return buildThreeCard(ctx);
    case "quote_proof":
      return buildQuoteProof(ctx);
    default:
      return buildFallback(ctx);
  }
}
