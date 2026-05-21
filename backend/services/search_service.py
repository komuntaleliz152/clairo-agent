import asyncio
import os
from dataclasses import dataclass
from typing import List

import httpx


@dataclass
class SearchResult:
    title: str
    url: str
    snippet: str


class SearchService:
    """Web search via Tavily (if configured) or DuckDuckGo (no API key)."""

    async def search(self, query: str, max_results: int = 5) -> List[SearchResult]:
        if os.getenv("TAVILY_API_KEY"):
            return await self._tavily_search(query, max_results)
        return await self._duckduckgo_search(query, max_results)

    async def _tavily_search(self, query: str, max_results: int) -> List[SearchResult]:
        api_key = os.getenv("TAVILY_API_KEY")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": api_key,
                    "query": query,
                    "max_results": max_results,
                    "include_answer": False,
                },
            )
            response.raise_for_status()
            data = response.json()

        results: List[SearchResult] = []
        for item in data.get("results", []):
            results.append(
                SearchResult(
                    title=item.get("title", "Untitled"),
                    url=item.get("url", ""),
                    snippet=item.get("content", "")[:500],
                )
            )
        return results

    async def _duckduckgo_search(self, query: str, max_results: int) -> List[SearchResult]:
        return await asyncio.to_thread(self._duckduckgo_search_sync, query, max_results)

    def _duckduckgo_search_sync(self, query: str, max_results: int) -> List[SearchResult]:
        from duckduckgo_search import DDGS

        results: List[SearchResult] = []
        with DDGS() as ddgs:
            for item in ddgs.text(query, max_results=max_results):
                results.append(
                    SearchResult(
                        title=item.get("title", "Untitled"),
                        url=item.get("href", ""),
                        snippet=(item.get("body") or "")[:500],
                    )
                )
        return results

    @staticmethod
    def format_for_llm(results: List[SearchResult]) -> str:
        if not results:
            return "No web search results were found for this topic."

        parts = []
        for i, r in enumerate(results, 1):
            parts.append(
                f"[{i}] {r.title}\n"
                f"URL: {r.url}\n"
                f"Snippet: {r.snippet}"
            )
        return "\n\n".join(parts)
