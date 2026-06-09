import sys
import os
import logging
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Enable logging to see the fallback logs
logging.basicConfig(level=logging.INFO)

from app.services.ai_diary_service import ai_diary_service

print("--- AI DIARY EXTRACTION TEST ---")
try:
    text = "I ate a huge steak for dinner with my friends"
    result = ai_diary_service.extract_and_calculate(text)
    print("\n--- SUCCESS ---")
    print(result)
except Exception as e:
    print("\n--- FAILURE ---")
    print(e)
