from pydantic import BaseModel, Field

class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500, description="Research topic")

class ResearchResponse(BaseModel):
    report: str = Field(..., description="Generated research report")
    status: str = Field(default="success", description="Response status")
