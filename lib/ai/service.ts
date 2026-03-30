import OpenAI from "openai";
import type { Mode, SlideSchema, ThemeName } from "@/types/slide";
import { slideSchemaZod, slideJsonSchema } from "@/lib/schema/slide-schema";
import { buildPrompt } from "@/lib/ai/prompt-builder";
import { makeMockSchema } from "@/lib/ai/mock-data";
import type { AiUsage } from "@/lib/ai/cost";

interface AnalyzeResult {
  schema: SlideSchema;
  rawRequest: Record<string, unknown>;
  rawResponse: Record<string, unknown>;
  model: string;
  mock: boolean;
  usage?: AiUsage;
}

export function extractUsage(resp: {
  usage?: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
  } | null;
}): AiUsage | undefined {
  if (!resp.usage) return undefined;
  const inputTokens = resp.usage.input_tokens ?? 0;
  const outputTokens = resp.usage.output_tokens ?? 0;
  const totalTokens = resp.usage.total_tokens ?? inputTokens + outputTokens;
  return { inputTokens, outputTokens, totalTokens };
}

export function toErrorDetails(error: unknown): { message: string; status?: number; type?: string; code?: string; param?: string } {
  if (error instanceof OpenAI.APIError) {
    return {
      message: error.message,
      status: error.status,
      type: typeof error.type === "string" ? error.type : undefined,
      code: typeof error.code === "string" ? error.code : undefined,
      param: typeof error.param === "string" ? error.param : undefined
    };
  }
  return { message: error instanceof Error ? error.message : String(error) };
}

export async function analyzeSlide(params: {
  imageBase64: string;
  imageMimeType: string;
  mode: Mode;
  theme: ThemeName;
  archetypeHint?: string;
  model?: string;
}): Promise<AnalyzeResult> {
  const model = params.model ?? process.env.OPENAI_MODEL ?? "gpt-5-mini";
  if (process.env.OPENAI_USE_MOCK === "true") {
    const schema = makeMockSchema((params.archetypeHint as never) ?? "two_column");
    return { schema, rawRequest: { mode: "mock" }, rawResponse: { mode: "mock" }, model, mock: true };
  }

  const prompt = buildPrompt(params.mode, params.theme);
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
          { type: "input_image", image_url: `data:${params.imageMimeType};base64,${params.imageBase64}` }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "slide_schema",
        schema: slideJsonSchema,
        strict: true
      }
    }
  };

  const resp = await client.responses.create(requestPayload as never);
  const text = resp.output_text;
  const parsed = slideSchemaZod.parse(JSON.parse(text));
  return {
    schema: parsed,
    rawRequest: requestPayload as never,
    rawResponse: resp as never,
    model,
    mock: false,
    usage: extractUsage(resp)
  };
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
    text: { format: { type: "json_schema", name: "slide_schema", schema: slideJsonSchema, strict: true } }
  } as never);

  return slideSchemaZod.parse(JSON.parse(response.output_text));
}
