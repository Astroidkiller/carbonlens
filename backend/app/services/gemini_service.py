import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Configure API key safely from environment variable
api_key = os.environ.get("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)

class GeminiService:
    def __init__(self):
        # We use gemini-2.5-flash as it's the required model and highly cost-efficient
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
    def extract_activities(self, text: str) -> List[Dict[str, Any]]:
        if not api_key:
            logger.error("GEMINI_API_KEY environment variable is missing.")
            raise ValueError("AI configuration error.")

        prompt = f"""
You are a strict data extraction system for a carbon footprint tracker.
Your job is to read the user's diary entry and extract the activities they performed into a structured JSON format.

RULES:
1. ONLY return a JSON object with a key 'activities' containing a list of extracted activities.
2. DO NOT include any conversational text, markdown formatting, or explanations. Just raw JSON.
3. Supported categories and activity types:
   - transport: car, motorcycle, bus, train, bicycle
   - electricity: generic
   - food: beef meal, chicken meal, vegetarian meal
   - shopping: clothing item, electronics item
   - waste: plastic waste, paper waste
4. You must normalize the text to match ONLY the supported types above.
   Example: 'chicken biryani' -> category: 'food', activity_type: 'chicken meal'
   Example: 'drove my suv' -> category: 'transport', activity_type: 'car'
5. If an activity is completely unsupported (e.g. 'flew in an airplane'), DO NOT include it in the JSON array.
6. Units should be appropriate (km, miles, kWh, meal, item, kg, grams, lbs).

DIARY TEXT:
"{text}"

EXPECTED JSON FORMAT:
{{
  "activities": [
    {{
      "category": "transport",
      "activity_type": "car",
      "quantity": 15,
      "unit": "km"
    }}
  ]
}}
"""

        try:
            # Setting response_mime_type forces Gemini to return strict JSON
            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            
            raw_json = response.text
            parsed = json.loads(raw_json)
            
            return parsed.get("activities", [])
            
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise ValueError(f"AI extraction failed: {str(e)}")

gemini_service = GeminiService()
