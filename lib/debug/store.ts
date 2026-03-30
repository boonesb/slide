import type { GenerationDiagnostics } from "@/types/slide";

// In-memory only: debug payloads are ephemeral to this process and are not shared across instances.
// Entries are removed after a short TTL; use a persistent store (file/db/kv) if durable diagnostics are required.
const debugMap = new Map<string, GenerationDiagnostics>();
let sessionEstimatedCostTotalUsd = 0;

export function putDebug(id: string, payload: GenerationDiagnostics) {
  if (typeof payload.ai?.estimatedCostUsd === "number") {
    sessionEstimatedCostTotalUsd += payload.ai.estimatedCostUsd;
  }
  if (payload.ai) {
    payload.ai.sessionEstimatedCostTotalUsd = sessionEstimatedCostTotalUsd;
  }
  debugMap.set(id, payload);
  // TTL: keep debug payloads for 15 minutes.
  setTimeout(() => debugMap.delete(id), 1000 * 60 * 15);
}

export function getDebug(id: string) {
  return debugMap.get(id);
}
