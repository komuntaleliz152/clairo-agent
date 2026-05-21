from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from models.schemas import ResearchRequest, ResearchResponse
from services.research_service import ResearchService

load_dotenv()

app = FastAPI(
    title="AI Research Agent API",
    description="Backend API for autonomous AI research agent",
    version="1.0.0",
)

frontend_origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://localhost:3000",
    "https://clairo-research-agent.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list({o for o in frontend_origins if o}),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

research_service = ResearchService()


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "AI Research Agent API is running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api_key_configured": bool(os.getenv("GROQ_API_KEY")),
        "search_provider": "tavily" if os.getenv("TAVILY_API_KEY") else "duckduckgo",
    }


@app.post("/api/research", response_model=ResearchResponse)
async def research(request: ResearchRequest):
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY is not configured. Add it to backend/.env",
        )

    try:
        return await research_service.run_research(request.topic)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
