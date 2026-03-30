async function getDebug(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/debug/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function DebugPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDebug(id);

  if (!data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Debug report unavailable</h1>
        <section className="rounded border bg-white p-4">
          <p className="font-medium">Debug payload expired or unavailable.</p>
          <p className="mt-2 text-sm text-slate-700">Debug ID: {id}</p>
          <p className="mt-2 text-sm text-slate-700">
            Reproduce by triggering a new generation and opening the latest debug link immediately.
            Debug payloads are short-lived and may be removed after the TTL window.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Debug report: {id}</h1>
      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">Summary</h2>
        <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(data.requestSummary, null, 2)}</pre>
      </section>
      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">AI Usage & Cost</h2>
        <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(data.ai, null, 2)}</pre>
      </section>
      {[
        ["Raw AI Request", data.rawAiRequest],
        ["Raw AI Response", data.rawAiResponse],
        ["Cleaned Schema", data.cleanedSchema],
        ["Normalized Semantic Content", data.normalizedSemantic],
        ["Final Computed Layout", data.finalComputedLayout],
        ["Validation", data.validation],
        ["Repair", data.repair],
        ["Rendering", data.rendering]
      ].map(([title, block]) => (
        <section key={title as string} className="rounded border bg-white p-4">
          <h2 className="mb-2 text-lg font-medium">{title as string}</h2>
          <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(block, null, 2)}</pre>
        </section>
      ))}
    </div>
  );
}
