import os
import re
from dataclasses import dataclass
from html import unescape
from typing import List
from urllib.parse import unquote

import httpx


@dataclass
class SearchResult:
    title: str
    url: str
    snippet: str


class SearchService:
    """Web search via Tavily (if configured) or DuckDuckGo HTML (no extra packages)."""

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
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            ),
        }
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            response = await client.post(
                "https://html.duckduckgo.com/html/",
                data={"q": query},
                headers=headers,
            )
            response.raise_for_status()
            html = response.text

        return self._parse_duckduckgo_html(html, max_results)

    def _parse_duckduckgo_html(self, html: str, max_results: int) -> List[SearchResult]:
        link_pattern = re.compile(
            r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
            re.DOTALL,
        )
        snippet_pattern = re.compile(
            r'class="result__snippet"[^>]*>(.*?)</a>',
            re.DOTALL,
        )

        links = link_pattern.findall(html)
        snippets = snippet_pattern.findall(html)

        results: List[SearchResult] = []
        for i, (url, title_html) in enumerate(links[:max_results]):
            title = self._clean_html(title_html)
            url = unquote(url)
            if url.startswith("//"):
                url = "https:" + url

            snippet = ""
            if i < len(snippets):
                snippet = self._clean_html(snippets[i])[:500]

            results.append(SearchResult(title=title or "Untitled", url=url, snippet=snippet))

        return results

    @staticmethod
    def _clean_html(text: str) -> str:
        text = re.sub(r"<[^>]+>", "", text)
        return unescape(text).strip()

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
