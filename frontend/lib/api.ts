export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface ResearchResult {
  report: string;
  sources: Source[];
  status: string;
}

export async function runResearch(topic: string): Promise<ResearchResult> {
  const response = await fetch(`${API_BASE_URL}/api/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail =
      body && typeof body.detail === "string"
        ? body.detail
        : "Failed to generate research report";
    throw new Error(detail);
  }

  return response.json();
}
