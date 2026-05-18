"use client";

interface ResearchReportProps {
  report: string;
}

export default function ResearchReport({ report }: ResearchReportProps) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Research Report</h2>
        <button
          onClick={() => {
            const blob = new Blob([report], { type: "text/plain" });
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

      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {report}
        </div>
      </div>
    </div>
  );
}
