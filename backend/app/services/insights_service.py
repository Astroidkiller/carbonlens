from sqlalchemy.orm import Session
from uuid import UUID
import logging
from .dashboard_service import get_dashboard_summary, get_dashboard_insights_data
from .ai_insights_service import ai_insights_service
from ..schemas.insights import InsightsResponse

logger = logging.getLogger(__name__)

class InsightsService:
    def get_insights(self, db: Session, user_id: UUID) -> dict:
        summary = get_dashboard_summary(db, user_id)
        insights_data = get_dashboard_insights_data(db, user_id)
        
        metrics = {
            "total_emissions": summary.total_emissions,
            "weekly_emissions": summary.current_week,
            "monthly_emissions": summary.current_month,
            "carbon_score": summary.carbon_score,
            "highest_category": insights_data.highest_category or "None",
            "highest_category_percentage": insights_data.highest_category_percentage,
            "trend_direction": summary.trend_direction,
            "monthly_change_percent": summary.monthly_change_percent,
            "average_daily_emissions": summary.average_daily_emissions
        }
        
        try:
            # Try AI extraction
            return ai_insights_service.generate_insights(metrics)
        except Exception as e:
            logger.warning(f"AI Insights failed, using rule-based fallback. Error: {e}")
            return self._generate_rule_based_insights(metrics)
            
    def _generate_rule_based_insights(self, metrics: dict) -> dict:
        insights = []
        recommendations = []
        positive_habits = []
        risk_areas = []
        
        # Determine priorities
        score = metrics["carbon_score"]
        if score < 50:
            score_priority = "high"
            risk_areas.append("Carbon Score")
        elif score <= 80:
            score_priority = "medium"
        else:
            score_priority = "low"
            positive_habits.append("Excellent Carbon Score")
            
        insights.append({
            "title": "Carbon Score",
            "description": f"Your carbon score is {score}/100.",
            "priority": score_priority
        })
        
        trend = metrics["trend_direction"]
        pct = metrics["monthly_change_percent"]
        if trend == "Increasing" or pct > 0:
            insights.append({
                "title": "Emissions Trend",
                "description": f"Your emissions have increased by {pct}% compared to last month.",
                "priority": "high"
            })
            risk_areas.append("Rising Emissions")
        elif trend == "Improving":
            insights.append({
                "title": "Emissions Trend",
                "description": f"Great job! Your emissions decreased by {abs(pct)}% compared to last month.",
                "priority": "low"
            })
            positive_habits.append("Reducing Emissions")
        else:
            insights.append({
                "title": "Emissions Trend",
                "description": "Your emissions are stable.",
                "priority": "medium"
            })
            
        highest_cat = metrics["highest_category"]
        highest_pct = metrics["highest_category_percentage"]
        if highest_pct > 60:
            insights.append({
                "title": "Highest Category",
                "description": f"{highest_cat.capitalize()} accounts for {highest_pct}% of your total emissions.",
                "priority": "high"
            })
            risk_areas.append(f"High {highest_cat.capitalize()} emissions")
            recommendations.append({
                "title": f"Reduce {highest_cat.capitalize()} usage",
                "impact": "high",
                "estimated_savings": "Varies"
            })
            
        if not recommendations:
            recommendations.append({
                "title": "Maintain your current habits",
                "impact": "low",
                "estimated_savings": "0 kg CO2/month"
            })
            
        return {
            "summary": "This is a basic rule-based analysis because the AI service is currently unavailable.",
            "insights": insights,
            "recommendations": recommendations,
            "risk_areas": risk_areas,
            "positive_habits": positive_habits
        }

insights_service = InsightsService()
