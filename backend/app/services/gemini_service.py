import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Configure API key safely from environment variable
api_key = os.environ.get("GEMINI_API_KEY", "")
client = genai.Client(api_key=api_key) if api_key else None

class ExtractedActivity(BaseModel):
    category: str = Field(description="Must strictly be one of: 'transport', 'electricity', 'food', 'shopping', 'waste'")
    activity_type: str = Field(description="The specific type. E.g. 'car', 'motorcycle', 'bus', 'train', 'bicycle' for transport, 'beef meal', 'chicken meal', 'vegetarian meal' for food, 'plastic waste', 'paper waste' for waste, 'clothing item', 'electronics item' for shopping, or 'generic' for electricity.")
    quantity: float = Field(default=1.0, description="If a quantity is missing, default to 1.")
    unit: str = Field(description="If units are missing, intelligently infer them (e.g., 'biking' implies distance in 'km', 'chicken' implies 'kg' or 'meal').")
    description: str = Field(description="Brief description of the activity")

class ExtractionResult(BaseModel):
    activities: List[ExtractedActivity]

class GeminiService:
    def __init__(self):
        self.model_name = 'gemini-2.5-flash'
        
    def extract_activities(self, text: str) -> List[Dict[str, Any]]:
        if not client:
            logger.error("GEMINI_API_KEY environment variable is missing.")
            raise ValueError("AI configuration error.")

        prompt = f"""
You are a data extraction engine.
Your job is to read the user's diary entry and extract the activities they performed.

RULES:
1. Ignore conversational filler (e.g., 'I was tired today').
2. If units are missing, intelligently infer them (e.g., 'biking' implies distance in 'km', 'chicken' implies 'kg' or 'serving').
3. If a quantity is missing, default to 1.
4. Never return markdown formatting or conversational text; return only the JSON.

DIARY TEXT:
"{text}"
"""

        try:
            response = client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ExtractionResult,
                    temperature=0.1
                ),
            )
            
            raw_json = response.text
            parsed = json.loads(raw_json)
            
            return parsed.get("activities", [])
            
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise ValueError(f"AI extraction failed: {str(e)}")

gemini_service = GeminiService()
