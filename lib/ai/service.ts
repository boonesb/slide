import OpenAI from "openai";
import type { Mode, SlideSchema, ThemeName } from "@/types/slide";
import { slideSchemaZod, slideJsonSchema } from "@/lib/schema/slide-schema";
import { buildPrompt } from "@/lib/ai/prompt-builder";
import { makeMockSchema } from "@/lib/ai/mock-data";

export async function analyzeSlide(params: {
  imageBase64: string;
  mode: Mode;
  theme: ThemeName;
  archetypeHint?: string;
  model?: string;
}): Promise<{ schema: SlideSchema; rawRequest: Record<string, unknown>; rawResponse: Record<string, unknown> }> {
  if (process.env.OPENAI_USE_MOCK === "true") {
    const schema = makeMockSchema((params.archetypeHint as never) ?? "two_column");
    return { schema, rawRequest: { mode: "mock" }, rawResponse: { mode: "mock" } };
  }

  const prompt = buildPrompt(params.mode, params.theme);
  const model = params.model ?? process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const requestPayload = {
    model,
    input: [
      { role: "system", content: prompt.system },
      { role: "developer", content: prompt.developer },
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt.user },
          { type: "input_image", image_url: `data:image/png;base64,${params.imageBase64}` }
        ]
      }
    ],
    response_format: {
      type: "json_schema",
      name: "slide_schema",
      schema: slideJsonSchema,
      strict: true
    }
  };

  const resp = await client.responses.create(requestPayload as never);
  const text = resp.output_text;
  const parsed = slideSchemaZod.parse(JSON.parse(text));
  return { schema: parsed, rawRequest: requestPayload as never, rawResponse: resp as never };
}

export async function repairSchema(raw: unknown, mode: Mode, theme: ThemeName) {
  const prompt = buildPrompt(mode, theme);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const response = await client.responses.create({
    model,
    input: [
      { role: "system", content: prompt.system },
      { role: "developer", content: "Repair this malformed slide schema JSON to match the required schema exactly." },
      { role: "user", content: JSON.stringify(raw) }
    ],
    response_format: { type: "json_schema", name: "slide_schema", schema: slideJsonSchema, strict: true }
  } as never);

  return slideSchemaZod.parse(JSON.parse(response.output_text));
}
