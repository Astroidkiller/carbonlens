import re
from typing import List, Dict, Any

class RuleExtractorService:
    def __init__(self):
        # Maps to CATEGORY_FACTORS in carbon_factors.py
        pass

    def extract(self, text: str) -> List[Dict[str, Any]]:
        text_lower = text.lower()
        activities = []
        
        # 1. Transport Patterns
        # e.g., "drove 15 km", "15 miles in a car", "travelled 10 km by bus"
        transport_pattern = r"(?P<qty>\d+(?:\.\d+)?)\s*(?P<unit>km|kilometers|miles|m|meters)\s*(?:by\s+|in\s+a\s+|on\s+a\s+)?(?P<type>car|motorcycle|bus|train|bicycle)"
        # Alternate phrasing: "car for 15 km"
        transport_alt = r"(?P<type>car|motorcycle|bus|train|bicycle).*?(?P<qty>\d+(?:\.\d+)?)\s*(?P<unit>km|kilometers|miles|m|meters)"
        
        for match in re.finditer(transport_pattern, text_lower):
            activities.append({
                "category": "transport",
                "activity_type": match.group("type"),
                "quantity": float(match.group("qty")),
                "unit": match.group("unit").replace("kilometers", "km").replace("meters", "m"),
                "confidence": 100
            })
            
        if not activities:
            for match in re.finditer(transport_alt, text_lower):
                activities.append({
                    "category": "transport",
                    "activity_type": match.group("type"),
                    "quantity": float(match.group("qty")),
                    "unit": match.group("unit").replace("kilometers", "km").replace("meters", "m"),
                    "confidence": 100
                })

        # 2. Electricity Patterns
        # e.g., "used 5 kwh", "5 kwh of electricity"
        elec_pattern = r"(?P<qty>\d+(?:\.\d+)?)\s*(?P<unit>kwh|wh)"
        for match in re.finditer(elec_pattern, text_lower):
            activities.append({
                "category": "electricity",
                "activity_type": "generic",
                "quantity": float(match.group("qty")),
                "unit": match.group("unit"),
                "confidence": 100
            })

        # 3. Food Patterns
        # e.g., "1 beef meal", "ate a chicken meal", "2 vegetarian meals", "chicken biryani" -> chicken meal
        if re.search(r"beef", text_lower):
            qty_match = re.search(r"(?P<qty>\d+)\s*beef", text_lower)
            activities.append({
                "category": "food",
                "activity_type": "beef meal",
                "quantity": float(qty_match.group("qty")) if qty_match else 1.0,
                "unit": "meal",
                "confidence": 90 if not qty_match else 100
            })
        if re.search(r"chicken", text_lower):
            qty_match = re.search(r"(?P<qty>\d+)\s*chicken", text_lower)
            activities.append({
                "category": "food",
                "activity_type": "chicken meal",
                "quantity": float(qty_match.group("qty")) if qty_match else 1.0,
                "unit": "meal",
                "confidence": 90 if not qty_match else 100
            })
        if re.search(r"(vegetarian|veg |salad)", text_lower):
            qty_match = re.search(r"(?P<qty>\d+)\s*(vegetarian|veg |salad)", text_lower)
            activities.append({
                "category": "food",
                "activity_type": "vegetarian meal",
                "quantity": float(qty_match.group("qty")) if qty_match else 1.0,
                "unit": "meal",
                "confidence": 90 if not qty_match else 100
            })

        # 4. Shopping Patterns
        if re.search(r"(t-shirt|shirt|pants|clothing|jacket|dress)", text_lower):
            qty_match = re.search(r"(?P<qty>\d+)\s*(t-shirt|shirt|pants|clothing|jacket|dress)", text_lower)
            activities.append({
                "category": "shopping",
                "activity_type": "clothing item",
                "quantity": float(qty_match.group("qty")) if qty_match else 1.0,
                "unit": "item",
                "confidence": 90 if not qty_match else 100
            })
        if re.search(r"(phone|laptop|tv|electronics|computer)", text_lower):
            qty_match = re.search(r"(?P<qty>\d+)\s*(phone|laptop|tv|electronics|computer)", text_lower)
            activities.append({
                "category": "shopping",
                "activity_type": "electronics item",
                "quantity": float(qty_match.group("qty")) if qty_match else 1.0,
                "unit": "item",
                "confidence": 90 if not qty_match else 100
            })

        # 5. Waste Patterns
        waste_pattern = r"(?P<qty>\d+(?:\.\d+)?)\s*(?P<unit>kg|lbs|grams|g)\s*(?:of\s+)?(?P<type>plastic|paper)"
        for match in re.finditer(waste_pattern, text_lower):
            activities.append({
                "category": "waste",
                "activity_type": f"{match.group('type')} waste",
                "quantity": float(match.group("qty")),
                "unit": match.group("unit"),
                "confidence": 100
            })

        return activities

    def calculate_overall_confidence(self, activities: List[Dict[str, Any]], original_text: str) -> int:
        if not activities:
            return 0
        
        # Simple heuristic: if we extracted things, but the sentence is very long and we only got 1 thing, 
        # maybe we missed a lot. Words count:
        words = len(original_text.split())
        extracted_features_count = len(activities) * 3 # (type, qty, unit)
        
        # If words > 15 and we only extracted 1 activity, confidence drops.
        avg_conf = sum(a["confidence"] for a in activities) / len(activities)
        
        if words > 15 and len(activities) == 1:
            return min(75, int(avg_conf)) # forces gemini
        
        return int(avg_conf)

rule_extractor = RuleExtractorService()
