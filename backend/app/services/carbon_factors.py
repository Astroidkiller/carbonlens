TRANSPORT_FACTORS = {
    "car": 0.19,        # kg CO2/km
    "motorcycle": 0.10, # kg CO2/km
    "bus": 0.08,        # kg CO2/km
    "train": 0.04,      # kg CO2/km
    "bicycle": 0.0      # kg CO2/km
}

ELECTRICITY_FACTORS = {
    "generic": 0.82     # kg CO2 per kWh
}

FOOD_FACTORS = {
    "beef meal": 27.0,
    "chicken meal": 6.9,
    "vegetarian meal": 2.0
}

SHOPPING_FACTORS = {
    "clothing item": 5.0,
    "electronics item": 50.0
}

WASTE_FACTORS = {
    "plastic waste": 6.0, # kg/kg
    "paper waste": 1.0    # kg/kg
}

CATEGORY_FACTORS = {
    "transport": TRANSPORT_FACTORS,
    "electricity": ELECTRICITY_FACTORS,
    "food": FOOD_FACTORS,
    "shopping": SHOPPING_FACTORS,
    "waste": WASTE_FACTORS
}
