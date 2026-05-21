import asyncio
import json
from typing import AsyncGenerator, List

from models.schemas import ResearchResponse, Source
from services.groq_client import GroqClient
from services.search_service import SearchService


class ResearchService:
    def __init__(self):
        self.search = SearchService()
        self.groq = GroqClient()

    async def run_research(self, topic: str) -> ResearchResponse:
        search_results = await self.search.search(topic, max_results=5)
        search_context = self.search.format_for_llm(search_results)
        report = await asyncio.to_thread(
            self.groq.generate_research_report, topic, search_context
        )
        sources = self._to_sources(search_results)
        return ResearchResponse(report=report, sources=sources, status="success")

    async def run_research_stream(self, topic: str) -> AsyncGenerator[str, None]:
        def event(step: str, **payload) -> str:
            return f"data: {json.dumps({'step': step, **payload})}\n\n"

        yield event("searching", message="Searching the web for relevant sources...")

        search_results = await self.search.search(topic, max_results=5)
        sources = self._to_sources(search_results)

        yield event(
            "analyzing",
            message=f"Analyzing {len(sources)} source{'s' if len(sources) != 1 else ''}...",
            sources=[s.model_dump() for s in sources],
        )

        search_context = self.search.format_for_llm(search_results)

        yield event("generating", message="Generating your research report...")

        report = await asyncio.to_thread(
            self.groq.generate_research_report, topic, search_context
        )

        yield event(
            "complete",
            report=report,
            sources=[s.model_dump() for s in sources],
            status="success",
        )

    @staticmethod
    def _to_sources(search_results) -> List[Source]:
        return [
            Source(title=r.title, url=r.url, snippet=r.snippet)
            for r in search_results
            if r.url
        ]
