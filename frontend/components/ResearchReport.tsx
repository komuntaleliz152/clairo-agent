"use client";

import type { Source } from "@/lib/api";
import ReportMarkdown from "@/components/ReportMarkdown";

interface ResearchReportProps {
  report: string;
  sources?: Source[];
}

export default function ResearchReport({ report, sources = [] }: ResearchReportProps) {
  const downloadText =
    sources.length > 0
      ? `${report}\n\n--- Sources ---\n${sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.url}`).join("\n")}`
      : report;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(downloadText);
  };

  return (
    <div className="mt-6 space-y-6">
      {sources.length > 0 && (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-slate-900">
              Sources analyzed
            </h2>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {sources.length} found
            </span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-1">
            {sources.map((source, index) => (
              <li
                key={`${source.url}-${index}`}
                className="group flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-brand-200 hover:bg-brand-50/30"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-900 underline decoration-brand-300 decoration-2 underline-offset-2 transition group-hover:text-brand-700"
                  >
                    {source.title}
                  </a>
                  {source.snippet && (
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
                      {source.snippet}
                    </p>
                  )}
                  <p className="mt-1 truncate text-xs text-slate-400">{source.url}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:p-8 p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Research report
            </p>
            <h2 className="font-[family-name:var(--font-fraunces)] mt-1 text-2xl font-semibold text-slate-900">
              Your findings
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([downloadText], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "research-report.txt";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              Download
            </button>
          </div>
        </div>

        <ReportMarkdown content={report} />
      </section>
    </div>
  );
}
