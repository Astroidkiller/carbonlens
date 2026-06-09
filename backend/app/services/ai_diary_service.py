import logging
from typing import List, Dict, Any
from datetime import datetime, timezone
from pydantic import ValidationError
from app.schemas.activity import ActivityCreate
from app.services.rule_extractor_service import rule_extractor
from app.services.gemini_service import gemini_service
from app.services.carbon_calculation_service import calculate_carbon_emission

logger = logging.getLogger(__name__)

class AIDiaryService:
    def extract_and_calculate(self, text: str) -> Dict[str, Any]:
        """
        Takes raw natural language diary text, extracts structured activities using
        a hybrid rule-based + AI fallback engine, validates them against the ActivityCreate schema,
        and computes the expected carbon footprint using the single source of truth calculator.
        """
        extracted_raw = []
        extraction_method = "none"

        # 1. Attempt Rule-Based Extraction
        try:
            rule_activities = rule_extractor.extract(text)
            overall_confidence = rule_extractor.calculate_overall_confidence(rule_activities, text)
            
            if overall_confidence >= 80:
                extracted_raw = rule_activities
                extraction_method = "rule_based"
                logger.info(f"Rule-based extraction succeeded with confidence {overall_confidence}")
            else:
                logger.info(f"Rule-based extraction yielded low confidence ({overall_confidence}). Falling back to Gemini.")
        except Exception as e:
            logger.warning(f"Rule-based extractor failed: {str(e)}. Falling back to Gemini.")

        # 2. Fallback to Gemini if necessary
        if not extracted_raw:
            try:
                extracted_raw = gemini_service.extract_activities(text)
                extraction_method = "gemini"
            except Exception as e:
                logger.error(f"Gemini fallback failed: {str(e)}")
                raise ValueError(f"Failed to process diary entry: {str(e)}")

        # 3. Validation and Calculation
        valid_activities = []
        total_emissions = 0.0
        
        current_date = datetime.now(timezone.utc)

        for raw_act in extracted_raw:
            try:
                # Add default current date if missing from extraction
                if "activity_date" not in raw_act:
                    raw_act["activity_date"] = current_date.isoformat()
                
                # Description can just be the original text snippet or general description
                if "description" not in raw_act:
                    raw_act["description"] = f"Extracted via {extraction_method}"

                # Pydantic validation (this will catch unsupported categories/types instantly)
                act_schema = ActivityCreate(**raw_act)
                
                # Perform Carbon Calculation (single source of truth)
                calc_result = calculate_carbon_emission(
                    category=act_schema.category,
                    activity_type=act_schema.activity_type,
                    quantity=act_schema.quantity,
                    unit=act_schema.unit
                )
                
                valid_activities.append({
                    "activity": act_schema.model_dump(),
                    "carbon_emission": calc_result["carbon_emission"],
                    "calculation_explanation": calc_result["calculation_explanation"]
                })
                total_emissions += calc_result["carbon_emission"]
                
            except ValidationError as ve:
                logger.warning(f"Extracted activity failed Pydantic validation: {raw_act}. Dropping it. Error: {ve}")
            except Exception as e:
                logger.warning(f"Failed to calculate emissions for {raw_act}: {e}")

        if not valid_activities:
            raise ValueError("No valid activities could be extracted from the text.")

        return {
            "activities_created": len(valid_activities),
            "total_carbon_emission": round(total_emissions, 2),
            "extraction_method": extraction_method,
            "activities": valid_activities
        }

ai_diary_service = AIDiaryService()
