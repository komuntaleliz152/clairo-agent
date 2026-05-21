from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import json
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
    o
    for o in [
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "https://clairo-research-agent.vercel.app",
    ]
    if o
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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


@app.post("/api/research/stream")
async def research_stream(request: ResearchRequest):
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY is not configured. Add it to backend/.env",
        )

    async def event_stream():
        try:
            async for chunk in research_service.run_research_stream(request.topic):
                yield chunk
        except Exception as e:
            yield f"data: {json.dumps({'step': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


def _is_port_taken(port: int) -> bool:
    """Check if something is already listening (avoids Windows bind-then-release races)."""
    import socket

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        return sock.connect_ex(("127.0.0.1", port)) == 0


def _pick_port(preferred: int) -> int:
    for port in range(preferred, preferred + 10):
        if not _is_port_taken(port):
            return port
    raise RuntimeError(f"No free port found near {preferred}")


if __name__ == "__main__":
    import uvicorn

    preferred = int(os.getenv("PORT", 8000))
    port = _pick_port(preferred)
    if port != preferred:
        print(
            f"Port {preferred} is busy — using http://localhost:{port} instead",
            flush=True,
        )
        print(
            f"Set NEXT_PUBLIC_API_URL=http://localhost:{port} in frontend/.env.local",
            flush=True,
        )
    else:
        print(f"API ready at http://localhost:{port}", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)
