# slide-rebuilder

Production-style Next.js starter for **image-to-editable-slide generation**.

## What it does

- Upload one slide image (PNG/JPG/JPEG/WebP up to 10MB)
- Analyze with OpenAI Responses API (default model `gpt-5-mini`) or deterministic mock mode
- Uses current Responses API structured output shape (`text.format`) for JSON schema generation
- Build a typed 3-layer schema (`metadata`, `content`, `layout`)
- Normalize semantic content and run deterministic archetype layout builders before rendering
- Validate with Zod + reference checks, then perform one repair retry on failure
- Let user edit detected text/content before final render
- Apply overflow strategy (compress -> font-safe fitting -> drop lower-priority detail with diagnostics)
- Render deterministic editable PPTX via PptxGenJS (with speaker notes placeholders)
- Provide debug HTML page with raw request/response + normalized schema + diagnostics
- Provide cost diagnostics page with usage tokens and estimated per-request/session costs
- Regenerate using same upload and changed mode/theme without re-uploading

## Architecture (layered)

1. `app/` UI + API routes
2. `lib/ai/` prompt composition, OpenAI integration, mock outputs
3. `lib/schema/` schema contract (Zod + JSON schema)
4. `lib/validation/` app-side validation and contentRef checks
5. `lib/templates/` archetype template registry (all 8 archetypes)
6. `lib/themes/` design token themes + custom theme schema
7. `lib/layout/` semantic normalization, deterministic archetype builders, overflow and guardrails
8. `lib/render/` styled deterministic layout-to-PPTX renderer
9. `lib/debug/` ephemeral diagnostics store

This separates AI inference from deterministic layout/rendering, enabling maintainability and future multi-slide expansion.

## Deterministic layout builder (quality pass)

- AI output is treated as semantic structure first (archetype/title/subtitle/sections/priority), not final pixel geometry.
- The app computes final zones, margins, gutters, card sizing, and hierarchy deterministically.
- Primary quality focus archetypes: `title_hero`, `two_column`, `three_card`, `quote_proof`.
- Secondary archetypes remain supported via a simpler fallback layout strategy.
- Debug diagnostics now include normalized semantic content, final computed layout, overflow warnings, and dropped-content warnings.

## Modes

- `rebuild_faithfully`: preserve wording/structure as much as possible
- `rebuild_and_polish` (default): preserve message while improving hierarchy/clarity
- `use_as_inspiration`: preserve intent and allow stronger rewrite/layout changes

## Themes

Built-in:
- Enterprise Clean
- Enterprise Dark
- Consulting Minimal
- Custom (JSON)

Custom theme supports typography, color, spacing/layout, containers, visual/icon tokens.
Use file upload or paste JSON in UI. `lib/themes/themes.ts` includes starter JSON example (`CUSTOM_THEME_EXAMPLE`).

## OpenAI configuration

Create `.env` from `.env.example`:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
OPENAI_USE_MOCK=true
```

- `OPENAI_USE_MOCK=true` => deterministic local archetype outputs
- `OPENAI_USE_MOCK=false` => real OpenAI Responses API with structured JSON schema output
- Real mode captures `input_tokens`, `output_tokens`, and `total_tokens` when returned by OpenAI
- Estimated costs are computed using model pricing defaults (`gpt-5-mini`: input $0.25 / 1M, output $2.00 / 1M)

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Debug page

After generation, follow “Open debug diagnostics” link to `/debug/[id]`.
Shows:
- request summary
- selected mode/theme/template/archetype (in payload)
- raw AI request payload
- raw AI response payload
- cleaned internal schema
- validation and repair results
- rendering diagnostics
- OpenAI error details when API calls fail

## Cost diagnostics page

After generation, follow “Open cost diagnostics” link to `/cost/[id]`.
Shows:
- request timestamp
- model and mock/real mode
- input/output/total token usage (when available from OpenAI)
- estimated request cost
- in-memory running total estimated cost for this app session

> Cost values are estimates only for quick diagnostics and are **not invoice-grade accounting**.

## Testing

```bash
npm run test
npm run typecheck
```

Included tests:
- schema validation
- template registry coverage
- theme tokens
- mock output conformance
- PPTX renderer smoke test

## Deployment notes

- App Router + server-side API integration is Vercel-compatible
- No auth and no persistence in v1
- Upload handling is ephemeral in request memory
- Structured to support Dockerization later
