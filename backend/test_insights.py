import os
import sys
import logging
import json
from dotenv import load_dotenv

# Load env variables for Gemini
load_dotenv()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.ai_insights_service import ai_insights_service

logging.basicConfig(level=logging.INFO)

scenarios = [
    {
        "name": "Heavy Transport User",
        "metrics": {
            "total_emissions": 450.0,
            "weekly_emissions": 120.0,
            "monthly_emissions": 450.0,
            "carbon_score": 25,
            "highest_category": "transport",
            "highest_category_percentage": 85.0,
            "trend_direction": "Increasing",
            "monthly_change_percent": 15.0,
            "average_daily_emissions": 15.0
        }
    },
    {
        "name": "Low Carbon User",
        "metrics": {
            "total_emissions": 30.0,
            "weekly_emissions": 7.0,
            "monthly_emissions": 30.0,
            "carbon_score": 95,
            "highest_category": "food",
            "highest_category_percentage": 40.0,
            "trend_direction": "Improving",
            "monthly_change_percent": -5.0,
            "average_daily_emissions": 1.0
        }
    }
]

for idx, scenario in enumerate(scenarios):
    print(f"\n{'='*50}\nSCENARIO {idx+1}: {scenario['name']}\n{'='*50}")
    try:
        insights = ai_insights_service.generate_insights(scenario["metrics"])
        print(json.dumps(insights, indent=2))
    except Exception as e:
        print(f"FAILED: {e}")
