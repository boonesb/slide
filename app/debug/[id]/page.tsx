async function getDebug(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/debug/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Debug payload not found");
  return res.json();
}

export default async function DebugPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDebug(id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Debug report: {id}</h1>
      <section className="rounded border bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">Summary</h2>
        <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(data.requestSummary, null, 2)}</pre>
      </section>
      {[
        ["Raw AI Request", data.rawAiRequest],
        ["Raw AI Response", data.rawAiResponse],
        ["Cleaned Schema", data.cleanedSchema],
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
