import sys
import os
import logging
from dotenv import load_dotenv
load_dotenv()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)

from app.services.ai_diary_service import ai_diary_service

print("\n--- TEST 1: Rule Based Extraction ---")
try:
    text = "I drove 10 km by car."
    result = ai_diary_service.extract_and_calculate(text)
    print("\n--- SUCCESS ---")
    print(result)
except Exception as e:
    print("\n--- FAILURE ---")
    print(e)

print("\n--- TEST 2: Gemini Fallback Extraction ---")
try:
    text = "Today I commuted to college and had lunch with friends."
    result = ai_diary_service.extract_and_calculate(text)
    print("\n--- SUCCESS ---")
    print(result)
except Exception as e:
    print("\n--- FAILURE ---")
    print(e)
