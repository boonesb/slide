# slide-rebuilder

Production-style Next.js starter for **image-to-editable-slide generation**.

## What it does

- Upload one slide image (PNG/JPG/JPEG/WebP up to 10MB)
- Analyze with OpenAI Responses API (default model `gpt-5-mini`) or deterministic mock mode
- Keep AI focused on **semantic understanding** (message, hierarchy, grouping, roles), not final geometry
- Translate decorative marketing graphics into enterprise-native slide structures in `rebuild_and_polish`
- Run deterministic layout building for exact zones, gutters, widths, spacing, and padding
- Apply layout normalization guardrails (in-bounds, margins, anti-overlap)
- Apply overflow handling (compress -> tighten -> drop lower-priority detail with diagnostics)
- Render styled, editable PPTX with theme-token-aware card and text treatments
- Expose debug diagnostics (source class, archetype/template selection, normalized semantics, final layout, warnings)

## Architecture (layered)

1. `lib/ai/` semantic extraction prompt + Responses API integration
2. `lib/layout/normalize.ts` semantic normalization + source-class interpretation + guardrail normalization
3. `lib/layout/archetypes/*` deterministic primary templates (`title_hero`, `two_column`, `three_card`, `quote_proof`) plus fallback
4. `lib/layout/overflow.ts` content-fit and prioritization logic
5. `lib/render/pptx-renderer.ts` styled renderer using meaningful theme tokens
6. `app/api/generate` + `app/api/render` orchestrate generate/edit/render flow
7. `app/debug/[id]` exposes internals for benchmark-driven tuning

## Semantic understanding vs deterministic layout

- **AI decides:** archetype, title/subtitle, sections, semantic roles, priorities, rewrite allowance, optional hints.
- **App decides:** final `x/y/w/h`, margins, gutters, card sizing, spacing rhythm, padding, and overflow behavior.
- `layout.elements` from AI remains compatibility/advisory and is recomputed before rendering.

## Source translation vs literal recreation

When source imagery is poster-like/infographic/decorative:
- preserve core message and panel grouping
- simplify decorative backgrounds/effects
- translate to clean enterprise templates (often `three_card`)
- avoid literal tracing of ornamental art

This benchmark philosophy uses representative fixtures (e.g. decorative 3-panel marketing graphics) while keeping logic generalized.

## Primary quality archetypes

High-quality deterministic templates:
- `title_hero`
- `two_column`
- `three_card`
- `quote_proof`

Other archetypes (`process_timeline`, `comparison`, `stat_insight`, `diagram_light`) remain supported via fallback layout logic.

## Overflow strategy

If content does not fit:
1. compress text according to `rewriteAllowed`
2. truncate safely with ellipsis when necessary
3. drop lower-priority details when allowed
4. emit warnings/dropped-content diagnostics to debug output

## Testing

```bash
npm run test
npm run typecheck
```

Included tests cover:
- deterministic layout builder for primary archetypes
- decorative benchmark-like `three_card` translation behavior
- in-bounds and no-overlap guardrails
- overflow handling
- renderer smoke output
- theme token differentiation

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
