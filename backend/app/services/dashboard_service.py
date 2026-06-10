from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract, text, and_
from datetime import datetime, timedelta, timezone
from uuid import UUID
from typing import Dict, Any, List
from sqlalchemy.sql import expression
from sqlalchemy.ext.compiler import compiles

class date_trunc(expression.FunctionElement):
    type = expression.FunctionElement
    name = 'date_trunc'
    inherit_cache = True

@compiles(date_trunc, 'postgresql')
def compile_date_trunc(element, compiler, **kw):
    return "DATE_TRUNC(%s, %s)" % (compiler.process(element.clauses.clauses[0]), compiler.process(element.clauses.clauses[1]))

@compiles(date_trunc, 'sqlite')
def compile_date_trunc_sqlite(element, compiler, **kw):
    # element.clauses.clauses[0] is the precision (e.g. 'day', 'week', 'month')
    # element.clauses.clauses[1] is the column
    col = compiler.process(element.clauses.clauses[1])
    precision = element.clauses.clauses[0].value
    if precision == 'day':
        return f"strftime('%Y-%m-%d', {col})"
    elif precision == 'week':
        return f"strftime('%Y-%W', {col})"
    elif precision == 'month':
        return f"strftime('%Y-%m', {col})"
    return f"strftime('%Y-%m-%d', {col})"

from ..models.activity import Activity
from ..schemas.dashboard import (
    DashboardSummary, DashboardCategories, DashboardTrends, 
    TrendDataPoint, DashboardTopContributors, ActivityContributor, 
    CategoryContributor, DashboardInsightsData
)

def calculate_carbon_score(daily_avg: float) -> int:
    """
    Tier-based scoring system with linear interpolation:
    0-2 kg/day -> 95-100
    2-4 kg/day -> 80-95
    4-6 kg/day -> 65-80
    6-8 kg/day -> 50-65
    8-12 kg/day -> 30-50
    12+ kg/day -> 0-30
    """
    if daily_avg <= 0: return 100
    if daily_avg <= 2:
        return int(100 - (daily_avg / 2) * 5)
    if daily_avg <= 4:
        return int(95 - ((daily_avg - 2) / 2) * 15)
    if daily_avg <= 6:
        return int(80 - ((daily_avg - 4) / 2) * 15)
    if daily_avg <= 8:
        return int(65 - ((daily_avg - 6) / 2) * 15)
    if daily_avg <= 12:
        return int(50 - ((daily_avg - 8) / 4) * 20)
    if daily_avg <= 20:
        return int(max(0, 30 - ((daily_avg - 12) / 8) * 30))
    return 0

def get_percent_change(current: float, previous: float) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 2)

def get_trend_direction(change_percent: float) -> str:
    if change_percent <= -5.0:
        return "Improving"
    elif change_percent >= 5.0:
        return "Increasing"
    return "Stable"

def get_dashboard_summary(db: Session, user_id: UUID) -> DashboardSummary:
    now = datetime.now(timezone.utc)
    
    # Base query for user
    user_activities = db.query(Activity).filter(Activity.user_id == user_id)
    
    # Total emissions & Activity count
    total_metrics = user_activities.with_entities(
        func.sum(Activity.carbon_emission),
        func.count(Activity.id)
    ).first()
    total_emissions = total_metrics[0] or 0.0
    activity_count = total_metrics[1] or 0
    
    # Determine first activity date to compute real average_daily
    first_activity = user_activities.order_by(Activity.activity_date.asc()).first()
    days_active = 1
    if first_activity:
        delta = (now - first_activity.activity_date).days
        days_active = max(1, delta)
    avg_daily = total_emissions / days_active if days_active > 0 else 0.0
    
    # Time-based filters
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)
    month_ago = now - timedelta(days=30)
    two_months_ago = now - timedelta(days=60)
    
    metrics = user_activities.with_entities(
        func.sum(case((Activity.activity_date >= week_ago, Activity.carbon_emission), else_=0)).label('current_week'),
        func.sum(case((and_(Activity.activity_date >= two_weeks_ago, Activity.activity_date < week_ago), Activity.carbon_emission), else_=0)).label('previous_week'),
        func.sum(case((Activity.activity_date >= month_ago, Activity.carbon_emission), else_=0)).label('current_month'),
        func.sum(case((and_(Activity.activity_date >= two_months_ago, Activity.activity_date < month_ago), Activity.carbon_emission), else_=0)).label('previous_month'),
    ).first()

    current_week = metrics.current_week or 0.0
    previous_week = metrics.previous_week or 0.0
    weekly_change = get_percent_change(current_week, previous_week)
    
    current_month = metrics.current_month or 0.0
    previous_month = metrics.previous_month or 0.0
    monthly_change = get_percent_change(current_month, previous_month)
    
    # Trend direction based on weekly change
    trend_dir = get_trend_direction(weekly_change)
    
    # Calculate carbon score based on last 30 days average
    last_30_avg = current_month / 30.0
    score = calculate_carbon_score(last_30_avg)
    
    # Highest category overall
    highest_cat = user_activities.with_entities(
        Activity.category, func.sum(Activity.carbon_emission).label("total")
    ).group_by(Activity.category).order_by(text("total DESC")).first()
    
    return DashboardSummary(
        total_emissions=round(total_emissions, 2),
        current_week=round(current_week, 2),
        previous_week=round(previous_week, 2),
        weekly_change_percent=weekly_change,
        current_month=round(current_month, 2),
        previous_month=round(previous_month, 2),
        monthly_change_percent=monthly_change,
        activity_count=activity_count,
        average_daily_emissions=round(avg_daily, 2),
        highest_emission_category=highest_cat[0] if highest_cat else None,
        carbon_score=score,
        trend_direction=trend_dir
    )

def get_dashboard_categories(db: Session, user_id: UUID) -> DashboardCategories:
    cats = db.query(Activity.category, func.sum(Activity.carbon_emission)).filter(Activity.user_id == user_id).group_by(Activity.category).all()
    data = {c[0]: round(c[1], 2) for c in cats if c[0]}
    return DashboardCategories(
        transport=data.get("transport", 0.0),
        food=data.get("food", 0.0),
        electricity=data.get("electricity", 0.0),
        shopping=data.get("shopping", 0.0),
        waste=data.get("waste", 0.0)
    )

def get_dashboard_trends(db: Session, user_id: UUID) -> DashboardTrends:
    # Daily (Last 14 days)
    fourteen_days_ago = datetime.now(timezone.utc) - timedelta(days=14)
    daily_res = db.query(
        date_trunc('day', Activity.activity_date).label('day'),
        func.sum(Activity.carbon_emission)
    ).filter(Activity.user_id == user_id, Activity.activity_date >= fourteen_days_ago).group_by('day').order_by('day').all()
    
    # Weekly (Last 8 weeks)
    eight_weeks_ago = datetime.now(timezone.utc) - timedelta(weeks=8)
    weekly_res = db.query(
        date_trunc('week', Activity.activity_date).label('week'),
        func.sum(Activity.carbon_emission)
    ).filter(Activity.user_id == user_id, Activity.activity_date >= eight_weeks_ago).group_by('week').order_by('week').all()
    
    # Monthly (Last 12 months)
    twelve_months_ago = datetime.now(timezone.utc) - timedelta(days=365)
    monthly_res = db.query(
        date_trunc('month', Activity.activity_date).label('month'),
        func.sum(Activity.carbon_emission)
    ).filter(Activity.user_id == user_id, Activity.activity_date >= twelve_months_ago).group_by('month').order_by('month').all()

    def format_trends(res, date_fmt):
        return [TrendDataPoint(period=r[0].strftime(date_fmt) if r[0] else "", emissions=round(r[1], 2)) for r in res]

    return DashboardTrends(
        daily=format_trends(daily_res, "%Y-%m-%d"),
        weekly=format_trends(weekly_res, "%Y-%W"),
        monthly=format_trends(monthly_res, "%Y-%m")
    )

def get_dashboard_top_contributors(db: Session, user_id: UUID) -> DashboardTopContributors:
    # Top 5 activities globally
    top_activities = db.query(Activity.activity_type, func.sum(Activity.carbon_emission).label("total"))\
        .filter(Activity.user_id == user_id)\
        .group_by(Activity.activity_type)\
        .order_by(text("total DESC")).limit(5).all()

    # Categories
    top_categories = db.query(Activity.category, func.sum(Activity.carbon_emission).label("total"))\
        .filter(Activity.user_id == user_id)\
        .group_by(Activity.category)\
        .order_by(text("total DESC")).all()

    return DashboardTopContributors(
        top_activities=[ActivityContributor(activity_type=r[0], emissions=round(r[1], 2)) for r in top_activities],
        top_categories=[CategoryContributor(category=r[0], emissions=round(r[1], 2)) for r in top_categories]
    )

def get_dashboard_insights_data(db: Session, user_id: UUID) -> DashboardInsightsData:
    now = datetime.now(timezone.utc)
    month_ago = now - timedelta(days=30)
    two_months_ago = now - timedelta(days=60)
    
    user_activities = db.query(Activity).filter(Activity.user_id == user_id)
    
    # 1. Get total emissions and monthly stats
    metrics = user_activities.with_entities(
        func.sum(Activity.carbon_emission).label('total'),
        func.sum(case((Activity.activity_date >= month_ago, Activity.carbon_emission), else_=0)).label('current_month'),
        func.sum(case((and_(Activity.activity_date >= two_months_ago, Activity.activity_date < month_ago), Activity.carbon_emission), else_=0)).label('previous_month'),
    ).first()
    
    total = metrics.total or 0.0
    current_month = metrics.current_month or 0.0
    previous_month = metrics.previous_month or 0.0
    monthly_change_percent = get_percent_change(current_month, previous_month)
    
    # 2. Get categories
    cats = user_activities.with_entities(
        Activity.category, func.sum(Activity.carbon_emission).label("total")
    ).group_by(Activity.category).order_by(text("total DESC")).all()
        
    highest_cat = cats[0][0] if cats else None
    highest_val = cats[0][1] if cats else 0.0
    lowest_cat = cats[-1][0] if cats else None
    
    highest_pct = round((highest_val / total) * 100, 2) if total > 0 else 0.0

    # 3. Largest activity
    largest_activity = user_activities.order_by(Activity.carbon_emission.desc()).first()
    
    return DashboardInsightsData(
        highest_category=highest_cat,
        highest_category_percentage=highest_pct,
        lowest_category=lowest_cat,
        largest_activity=largest_activity.activity_type if largest_activity else None,
        monthly_change_percent=monthly_change_percent
    )
