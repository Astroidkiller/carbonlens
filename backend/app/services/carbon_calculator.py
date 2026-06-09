class CarbonCalculatorService:
    def calculate_emissions(self, category: str, details: dict) -> float:
        """
        Stub for carbon footprint calculation logic.
        Uses standardized emission factors based on the activity details.
        """
        # Placeholder calculation
        if category == "Transport" and "distance_miles" in details:
            return details["distance_miles"] * 0.4  # example factor
        elif category == "Food" and details.get("type") == "Beef":
            return 27.0 # example kg CO2
        return 0.0

carbon_calculator = CarbonCalculatorService()
