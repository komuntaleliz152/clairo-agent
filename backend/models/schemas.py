from pydantic import BaseModel, Field
from typing import List


class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500, description="Research topic")


class Source(BaseModel):
    title: str
    url: str
    snippet: str = ""


class ResearchResponse(BaseModel):
    report: str = Field(..., description="Generated research report")
    sources: List[Source] = Field(default_factory=list, description="Web sources used")
    status: str = Field(default="success", description="Response status")
