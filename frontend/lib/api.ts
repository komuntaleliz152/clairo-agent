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

export type ResearchStepId = "searching" | "analyzing" | "generating";

export interface ResearchProgress {
  step: ResearchStepId | "complete" | "error";
  message?: string;
  sources?: Source[];
  report?: string;
  status?: string;
}

function authHeaders(token: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function parseError(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  if (body && typeof body.detail === "string") return body.detail;
  if (response.status === 401) return "Please sign in to run research.";
  return "Failed to generate research report";
}

export async function runResearchStream(
  topic: string,
  onProgress: (progress: ResearchProgress) => void,
  token: string | null
): Promise<ResearchResult> {
  const response = await fetch(`${API_BASE_URL}/api/research/stream`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (!response.body) {
    throw new Error("No response stream from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: ResearchResult | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;

      const data = JSON.parse(line.slice(5).trim()) as ResearchProgress;

      if (data.step === "error") {
        throw new Error(data.message ?? "Research failed");
      }

      onProgress(data);

      if (data.step === "complete" && data.report) {
        result = {
          report: data.report,
          sources: data.sources ?? [],
          status: data.status ?? "success",
        };
      }
    }
  }

  if (!result) {
    throw new Error("Research ended without a report");
  }

  return result;
}

export async function runResearch(
  topic: string,
  token: string | null
): Promise<ResearchResult> {
  const response = await fetch(`${API_BASE_URL}/api/research`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
