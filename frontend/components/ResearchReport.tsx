"use client";

import type { Source } from "@/lib/api";

interface ResearchReportProps {
  report: string;
  sources?: Source[];
}

export default function ResearchReport({ report, sources = [] }: ResearchReportProps) {
  const downloadText =
    sources.length > 0
      ? `${report}\n\n--- Sources ---\n${sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.url}`).join("\n")}`
      : report;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Research Report</h2>
        <button
          onClick={() => {
            const blob = new Blob([downloadText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "research-report.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Download Report
        </button>
      </div>

      {sources.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Sources analyzed</h3>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li
                key={`${source.url}-${index}`}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {source.title}
                </a>
                {source.snippet && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{source.snippet}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{report}</div>
      </div>
    </div>
  );
}
