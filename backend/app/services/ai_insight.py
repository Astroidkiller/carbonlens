from ..core.config import settings
import google.generativeai as genai

class AIInsightService:
    def __init__(self):
        # Configure Gemini API using the placeholder/actual key
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-pro-latest')

    def extract_activities_from_diary(self, diary_text: str) -> dict:
        """
        Uses Gemini to parse natural language text into structured activity JSON.
        Returns extracted activities and categories.
        """
        # TODO: Implement actual LLM call with structured JSON prompt
        return {"status": "Placeholder for AI extraction", "raw_text": diary_text}
        
    def generate_recommendations(self, user_activities: list) -> list:
        """
        Generates personalized sustainability recommendations based on activity history.
        """
        return ["Consider taking public transit tomorrow.", "Try a meatless Monday!"]

ai_service = AIInsightService()
