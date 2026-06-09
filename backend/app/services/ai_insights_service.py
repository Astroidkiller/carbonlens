import json
import logging
from google import genai
from google.genai import types
import os
from typing import Dict, Any
from ..schemas.insights import InsightsResponse

from ..core.config import settings

logger = logging.getLogger(__name__)

api_key = settings.GEMINI_API_KEY
client = genai.Client(api_key=api_key) if api_key and api_key != "PLACEHOLDER_GEMINI_API_KEY" else None

class AIInsightsService:
    def __init__(self):
        self.model_name = 'gemini-2.5-flash'

    def generate_insights(self, metrics: Dict[str, Any]) -> dict:
        if not client:
            logger.error("GEMINI_API_KEY environment variable is missing or invalid.")
            raise ValueError("AI configuration error.")

        prompt = f"""
You are a sustainability assistant for CarbonLens.
Your job is to read the user's structured carbon footprint analytics and return a personalized JSON insights report.

CRITICAL RULES:
1. NEVER calculate or fabricate any statistics.
2. ONLY explain the analytics data provided.
3. Your output MUST be a valid JSON object matching the requested format.
4. Do NOT use markdown outside of the JSON structure.

USER ANALYTICS DATA:
{json.dumps(metrics, indent=2)}

INSIGHT PRIORITIZATION GUIDELINES:
- High Priority (assign "high" priority to insight or impact): 
  - Emissions increasing (trend_direction = "Increasing" or positive monthly_change_percent)
  - Carbon score below 50
  - Single category > 60% of emissions
- Medium Priority (assign "medium" priority):
  - Stable emissions
  - Carbon score 50-80
- Low Priority (assign "low" priority):
  - Improving trends
  - Carbon score > 80

REQUIRED JSON FORMAT:
{{
  "summary": "A 1-2 sentence overview.",
  "insights": [
    {{
      "title": "Short title",
      "description": "Explanation of a trend, change, or score.",
      "priority": "high|medium|low"
    }}
  ],
  "recommendations": [
    {{
      "title": "Actionable recommendation",
      "impact": "high|medium|low",
      "estimated_savings": "Estimation like '10-20 kg CO2/month'"
    }}
  ],
  "risk_areas": ["List of areas needing attention"],
  "positive_habits": ["List of areas where the user is doing well"]
}}
"""

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2 # Lower temperature for strictly factual explanations
                )
            )
            
            raw_json = response.text
            parsed = json.loads(raw_json)
            
            # Validate output matches schema
            validated = InsightsResponse(**parsed)
            return validated.model_dump()
            
        except Exception as e:
            logger.error(f"Gemini Insights Error: {str(e)}")
            raise ValueError(f"Failed to generate insights via AI: {str(e)}")

ai_insights_service = AIInsightsService()
