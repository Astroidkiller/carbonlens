from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

from ...db.database import get_db
from ...models.user import User
from ...schemas.dashboard import (
    DashboardSummary, DashboardCategories, DashboardTrends, 
    DashboardTopContributors, DashboardInsightsData
)
from ..deps import get_current_user
from ...services import dashboard_service
from ...services.insights_service import insights_service
from ...schemas.insights import InsightsResponse

router = APIRouter()

@router.get(
    "/summary",
    response_model=DashboardSummary,
    summary="Get Dashboard Summary",
    description="Returns high-level statistics including total emissions, weekly/monthly comparisons, trend direction, and carbon score for the authenticated user."
)
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return dashboard_service.get_dashboard_summary(db, current_user.id)

@router.get(
    "/categories",
    response_model=DashboardCategories,
    summary="Get Emissions by Category",
    description="Returns aggregated emissions split across top-level categories."
)
def get_categories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return dashboard_service.get_dashboard_categories(db, current_user.id)

@router.get(
    "/trends",
    response_model=DashboardTrends,
    summary="Get Emission Trends",
    description="Returns daily, weekly, and monthly time-series arrays using database aggregation."
)
def get_trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return dashboard_service.get_dashboard_trends(db, current_user.id)

@router.get(
    "/top-contributors",
    response_model=DashboardTopContributors,
    summary="Get Top Contributors",
    description="Returns the individual activities and broader categories that contribute the highest emissions."
)
def get_top_contributors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return dashboard_service.get_dashboard_top_contributors(db, current_user.id)

@router.get(
    "/insights-data",
    response_model=DashboardInsightsData,
    summary="Get Insights Data",
    description="Returns specific derived insights like highest category percentage, largest single activity, and monthly change percentage. Useful for future AI integrations."
)
def get_insights_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return dashboard_service.get_dashboard_insights_data(db, current_user.id)

@router.get(
    "/ai-insights",
    response_model=InsightsResponse,
    summary="Get AI Insights",
    description="Returns AI-generated insights based on the user's carbon metrics."
)
def get_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        data = insights_service.get_insights(db, current_user.id)
        return InsightsResponse(**data)
    except Exception as e:
        logger.error(f"Error generating AI insights: {str(e)}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An internal error occurred while generating insights.")

