"use client";

const steps = [
  "Uploading image",
  "Analyzing slide",
  "Building schema",
  "Validating and repairing",
  "Generating PPTX",
  "Ready to download"
];

export function StatusPanel({ current }: { current: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Job status</h3>
      <ol className="space-y-2">
        {steps.map((step) => (
          <li key={step} className={`text-sm ${step === current ? "font-semibold text-blue-700" : "text-slate-500"}`}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
