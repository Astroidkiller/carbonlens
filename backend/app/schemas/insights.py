from pydantic import BaseModel, Field
from typing import List, Literal, Optional

PriorityLevel = Literal["high", "medium", "low"]

class InsightItem(BaseModel):
    title: str
    description: str
    priority: PriorityLevel

class RecommendationItem(BaseModel):
    title: str
    impact: PriorityLevel
    estimated_savings: str

class InsightsResponse(BaseModel):
    summary: str
    insights: List[InsightItem]
    recommendations: List[RecommendationItem]
    risk_areas: List[str]
    positive_habits: List[str]
