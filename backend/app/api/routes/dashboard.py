from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.database import get_db
from ...models.user import User
from ...schemas.dashboard import (
    DashboardSummary, DashboardCategories, DashboardTrends, 
    DashboardTopContributors, DashboardInsightsData
)
from ..deps import get_current_user
from ...services import dashboard_service

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
