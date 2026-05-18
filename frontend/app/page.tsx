"use client";

import { useState } from "react";
import ResearchForm from "@/components/ResearchForm";
import ResearchReport from "@/components/ResearchReport";
import LoadingState from "@/components/LoadingState";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("http://localhost:8000/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate research report");
      }

      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Research Agent
          </h1>
          <p className="text-xl text-gray-600">
            Autonomous research powered by AI. Enter a topic and get a comprehensive report.
          </p>
        </div>

        {/* Research Form */}
        <ResearchForm onSubmit={handleResearch} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Research Report */}
        {report && !isLoading && <ResearchReport report={report} />}
      </div>
    </main>
  );
}
