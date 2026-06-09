from fastapi import HTTPException
from .carbon_factors import CATEGORY_FACTORS

def convert_quantity(category: str, quantity: float, unit: str) -> tuple[float, str]:
    unit = unit.lower().strip()
    
    if category == "transport":
        if unit == "miles":
            return quantity * 1.60934, "km"
        if unit == "meters":
            return quantity / 1000.0, "km"
        if unit == "km":
            return quantity, "km"
        raise HTTPException(status_code=400, detail="Unsupported unit for transport. Supported: km, miles, meters")
        
    if category == "electricity":
        if unit == "watt-hours" or unit == "wh":
            return quantity / 1000.0, "kWh"
        if unit == "kwh":
            return quantity, "kWh"
        raise HTTPException(status_code=400, detail="Unsupported unit for electricity. Supported: kWh, Wh")

    if category in ["food", "shopping"]:
        if unit == "items" or unit == "meals" or unit == "item" or unit == "meal":
            return quantity, unit
        raise HTTPException(status_code=400, detail=f"Unsupported unit for {category}. Supported: items, meals")

    if category == "waste":
        if unit == "grams" or unit == "g":
            return quantity / 1000.0, "kg"
        if unit == "lbs" or unit == "pounds":
            return quantity * 0.453592, "kg"
        if unit == "kg":
            return quantity, "kg"
        raise HTTPException(status_code=400, detail="Unsupported unit for waste. Supported: kg, grams, lbs")

    return quantity, unit

def calculate_carbon_emission(category: str, activity_type: str, quantity: float, unit: str) -> dict:
    category = category.lower().strip()
    activity_type = activity_type.lower().strip()
    
    if category not in CATEGORY_FACTORS:
        raise HTTPException(
            status_code=400, 
            detail={
                "error": "Unsupported category", 
                "supported_categories": list(CATEGORY_FACTORS.keys())
            }
        )

    factors = CATEGORY_FACTORS[category]
    if activity_type not in factors:
        raise HTTPException(
            status_code=400, 
            detail={
                "error": f"Unsupported {category} activity type",
                "supported_types": list(factors.keys())
            }
        )

    normalized_quantity, normalized_unit = convert_quantity(category, quantity, unit)
    factor = factors[activity_type]
    
    # Calculate emission
    emission = normalized_quantity * factor
    emission = round(emission, 2)
    
    # Format explanation
    if factor == 0:
        explanation = f"{normalized_quantity:.2f} {normalized_unit} × 0 kg CO2/{normalized_unit} = 0 kg CO2"
    else:
        unit_str = f"kg CO2/{normalized_unit}" if category not in ["food", "shopping"] else "kg CO2/item"
        explanation = f"{normalized_quantity:.2f} {normalized_unit} × {factor} {unit_str} = {emission} kg CO2"

    return {
        "carbon_emission": emission,
        "calculation_explanation": explanation,
        "normalized_quantity": normalized_quantity,
        "normalized_unit": normalized_unit
    }
