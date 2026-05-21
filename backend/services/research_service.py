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

        report = self.groq.generate_research_report(topic, search_context)

        sources = [
            Source(title=r.title, url=r.url, snippet=r.snippet)
            for r in search_results
            if r.url
        ]

        return ResearchResponse(
            report=report,
            sources=sources,
            status="success",
        )
