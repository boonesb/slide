async function getDebug(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/debug/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Diagnostics payload not found");
  return res.json();
}

function fmtUsd(value?: number) {
  if (typeof value !== "number") return "n/a";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(value);
}

export default async function CostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDebug(id);
  const ai = data.ai ?? {};

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Cost diagnostics: {id}</h1>
      <div className="rounded border bg-white p-4">
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div><dt className="font-medium text-slate-700">Request timestamp</dt><dd>{ai.requestedAt ?? "n/a"}</dd></div>
          <div><dt className="font-medium text-slate-700">Model</dt><dd>{ai.model ?? "n/a"}</dd></div>
          <div><dt className="font-medium text-slate-700">Mode</dt><dd>{ai.mock ? "Mock" : "Real OpenAI"}</dd></div>
          <div><dt className="font-medium text-slate-700">Input tokens</dt><dd>{ai.usage?.inputTokens ?? "n/a"}</dd></div>
          <div><dt className="font-medium text-slate-700">Output tokens</dt><dd>{ai.usage?.outputTokens ?? "n/a"}</dd></div>
          <div><dt className="font-medium text-slate-700">Total tokens</dt><dd>{ai.usage?.totalTokens ?? "n/a"}</dd></div>
          <div><dt className="font-medium text-slate-700">Estimated request cost</dt><dd>{fmtUsd(ai.estimatedCostUsd)}</dd></div>
          <div><dt className="font-medium text-slate-700">Session running total</dt><dd>{fmtUsd(ai.sessionEstimatedCostTotalUsd)}</dd></div>
        </dl>
      </div>

      {ai.error && (
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 text-lg font-medium text-red-700">OpenAI error details</h2>
          <pre className="overflow-auto rounded bg-red-950 p-3 text-xs text-red-100">{JSON.stringify(ai.error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
