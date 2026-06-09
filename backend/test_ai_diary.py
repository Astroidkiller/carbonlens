import os
import sys

# Configure mock API key for tests if not present
if "GEMINI_API_KEY" not in os.environ:
    os.environ["GEMINI_API_KEY"] = "mock_key_for_test"

# Allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.rule_extractor_service import rule_extractor

def test_rule_extractor_transport():
    text = "I drove 15 km in a car"
    extracted = rule_extractor.extract(text)
    assert len(extracted) == 1
    assert extracted[0]["category"] == "transport"
    assert extracted[0]["activity_type"] == "car"
    assert extracted[0]["quantity"] == 15.0
    assert extracted[0]["unit"] == "km"
    print("Transport extraction passed.")

def test_rule_extractor_food():
    text = "Ate 2 vegetarian meals"
    extracted = rule_extractor.extract(text)
    assert len(extracted) == 1
    assert extracted[0]["category"] == "food"
    assert extracted[0]["activity_type"] == "vegetarian meal"
    assert extracted[0]["quantity"] == 2.0
    print("Food extraction passed.")

def test_rule_extractor_electricity():
    text = "Used 5.5 kwh of electricity"
    extracted = rule_extractor.extract(text)
    assert len(extracted) == 1
    assert extracted[0]["category"] == "electricity"
    assert extracted[0]["activity_type"] == "generic"
    assert extracted[0]["quantity"] == 5.5
    print("Electricity extraction passed.")

def test_rule_extractor_fallback_detection():
    # Long text with only one match should return low confidence
    text = "Today was a very long day. I went to the store, talked to my friends, studied hard for 5 hours, played basketball, and then finally drove 1 km in a car back home. I also cooked dinner and read a book."
    extracted = rule_extractor.extract(text)
    confidence = rule_extractor.calculate_overall_confidence(extracted, text)
    assert confidence < 80, f"Expected <80 confidence for verbose text, got {confidence}"
    print("Fallback detection passed.")

if __name__ == "__main__":
    test_rule_extractor_transport()
    test_rule_extractor_food()
    test_rule_extractor_electricity()
    test_rule_extractor_fallback_detection()
    print("All rule extractor tests passed!")
