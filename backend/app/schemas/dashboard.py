from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import date

class DashboardSummary(BaseModel):
    total_emissions: float
    current_week: float
    previous_week: float
    weekly_change_percent: float
    current_month: float
    previous_month: float
    monthly_change_percent: float
    activity_count: int
    average_daily_emissions: float
    highest_emission_category: Optional[str]
    carbon_score: int
    trend_direction: str

class DashboardCategories(BaseModel):
    transport: float = 0.0
    food: float = 0.0
    electricity: float = 0.0
    shopping: float = 0.0
    waste: float = 0.0

class TrendDataPoint(BaseModel):
    period: str  # Date string or label
    emissions: float

class DashboardTrends(BaseModel):
    daily: List[TrendDataPoint]
    weekly: List[TrendDataPoint]
    monthly: List[TrendDataPoint]

class ActivityContributor(BaseModel):
    activity_type: str
    emissions: float

class CategoryContributor(BaseModel):
    category: str
    emissions: float

class DashboardTopContributors(BaseModel):
    top_activities: List[ActivityContributor]
    top_categories: List[CategoryContributor]

class DashboardInsightsData(BaseModel):
    highest_category: Optional[str]
    highest_category_percentage: float
    lowest_category: Optional[str]
    largest_activity: Optional[str]
    monthly_change_percent: float
