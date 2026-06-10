from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
import logging

from ...db.database import get_db
from ...models.user import User
from ...models.activity import Activity
from ...schemas.activity import ActivityCreate, ActivityUpdate, ActivityOut, DiaryExtractRequest, BulkActivityCreate
from ..deps import get_current_user
from ...services.carbon_calculation_service import calculate_carbon_emission
from ...services.ai_diary_service import ai_diary_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/extract",
    status_code=status.HTTP_200_OK,
    summary="Extract activities from natural language",
    description="Uses a hybrid rules + AI engine to extract carbon activities from text without saving to the DB."
)
def extract_activities(
    request: DiaryExtractRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        return ai_diary_service.extract_and_calculate(request.text)
    except ValueError as e:
        logger.warning(f"Validation error in extract_activities: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid data provided for processing.")
    except Exception as e:
        logger.error(f"Error in extract_activities: {str(e)}", exc_info=True)
        raise HTTPException(status_code=422, detail="Failed to process your request securely.")

@router.post(
    "/diary",
    response_model=List[ActivityOut],
    status_code=status.HTTP_201_CREATED,
    summary="Extract and save activities from natural language",
    description="Uses the Gemini Structured Output to extract carbon activities and immediately saves them."
)
def extract_and_save_diary(
    request: DiaryExtractRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Extract and calculate
        extraction_result = ai_diary_service.extract_and_calculate(request.text)
        
        saved_activities = []
        total_new_emissions = 0.0
        
        # Loop through extracted activities and save them
        for item in extraction_result["activities"]:
            activity_data = item["activity"]
            
            activity = Activity(
                **activity_data,
                user_id=current_user.id,
                carbon_emission=item["carbon_emission"],
                calculation_explanation=item["calculation_explanation"]
            )
            db.add(activity)
            saved_activities.append(activity)
            total_new_emissions += activity.carbon_emission
            
        # Update user's total carbon score
        current_user.current_carbon_score = (current_user.current_carbon_score or 0.0) + total_new_emissions
        db.commit()
        
        for a in saved_activities:
            db.refresh(a)
            
        return saved_activities
        
    except ValueError as e:
        logger.warning(f"Validation error in extract_and_save_diary: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid data provided for processing.")
    except Exception as e:
        logger.error(f"Error in extract_and_save_diary: {str(e)}", exc_info=True)
        raise HTTPException(status_code=422, detail="AI failed to extract valid data securely.")

@router.post(
    "/bulk",
    response_model=List[ActivityOut],
    status_code=status.HTTP_201_CREATED,
    summary="Create multiple activities",
    description="Save an array of confirmed activities at once."
)
def bulk_create_activities(
    bulk_in: BulkActivityCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    saved_activities = []
    total_new_emissions = 0.0
    
    for activity_in in bulk_in.activities:
        calc_result = calculate_carbon_emission(
            category=activity_in.category,
            activity_type=activity_in.activity_type,
            quantity=activity_in.quantity,
            unit=activity_in.unit
        )
        
        activity_data = activity_in.model_dump()
        activity_data["quantity"] = calc_result["normalized_quantity"]
        activity_data["unit"] = calc_result["normalized_unit"]
        
        activity = Activity(
            **activity_data,
            user_id=current_user.id,
            carbon_emission=calc_result["carbon_emission"],
            calculation_explanation=calc_result["calculation_explanation"]
        )
        db.add(activity)
        saved_activities.append(activity)
        total_new_emissions += activity.carbon_emission
        
    current_user.current_carbon_score = (current_user.current_carbon_score or 0.0) + total_new_emissions
    db.commit()
    
    for a in saved_activities:
        db.refresh(a)
        
    return saved_activities

@router.post(
    "/",
    response_model=ActivityOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new activity",
    description="Manually log a new carbon activity. Carbon emission is automatically calculated based on the input."
)
def create_activity(
    activity_in: ActivityCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Calculate carbon emission
    calc_result = calculate_carbon_emission(
        category=activity_in.category,
        activity_type=activity_in.activity_type,
        quantity=activity_in.quantity,
        unit=activity_in.unit
    )
    
    activity_data = activity_in.model_dump()
    activity_data["quantity"] = calc_result["normalized_quantity"]
    activity_data["unit"] = calc_result["normalized_unit"]
    
    activity = Activity(
        **activity_data,
        user_id=current_user.id,
        carbon_emission=calc_result["carbon_emission"],
        calculation_explanation=calc_result["calculation_explanation"]
    )
    db.add(activity)
    
    # Update user's total carbon score
    current_user.current_carbon_score = (current_user.current_carbon_score or 0.0) + activity.carbon_emission
    
    db.commit()
    db.refresh(activity)
    return activity

@router.get(
    "/",
    response_model=List[ActivityOut],
    summary="List all user activities",
    description="Retrieves a list of all activities logged by the current user."
)
def get_activities(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).order_by(Activity.activity_date.desc()).all()
    return activities

@router.get(
    "/{id}",
    response_model=ActivityOut,
    summary="Get a specific activity",
    description="Retrieve the details of a specific activity by its ID. Users can only access their own activities."
)
def get_activity(
    id: UUID,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(Activity.id == id, Activity.user_id == current_user.id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return activity

@router.put(
    "/{id}",
    response_model=ActivityOut,
    summary="Update an activity",
    description="Update an existing activity. Automatically recalculates carbon emissions if relevant fields are changed."
)
def update_activity(
    id: UUID,
    activity_in: ActivityUpdate,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(Activity.id == id, Activity.user_id == current_user.id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    
    update_data = activity_in.model_dump(exclude_unset=True)
    
    # Determine if we need to recalculate emission
    needs_recalc = False
    current_category = activity.category
    current_type = activity.activity_type
    current_quantity = activity.quantity
    current_unit = activity.unit
    
    if "category" in update_data:
        current_category = update_data["category"]
        needs_recalc = True
    if "activity_type" in update_data:
        current_type = update_data["activity_type"]
        needs_recalc = True
    if "quantity" in update_data:
        current_quantity = update_data["quantity"]
        needs_recalc = True
    if "unit" in update_data:
        current_unit = update_data["unit"]
        needs_recalc = True

    if needs_recalc:
        calc_result = calculate_carbon_emission(
            category=current_category,
            activity_type=current_type,
            quantity=current_quantity,
            unit=current_unit
        )
        update_data["quantity"] = calc_result["normalized_quantity"]
        update_data["unit"] = calc_result["normalized_unit"]
        new_emission = calc_result["carbon_emission"]
        update_data["carbon_emission"] = new_emission
        update_data["calculation_explanation"] = calc_result["calculation_explanation"]
        
        # Adjust total carbon score
        old_emission = activity.carbon_emission
        diff = new_emission - old_emission
        current_user.current_carbon_score = (current_user.current_carbon_score or 0.0) + diff
        
    for field, value in update_data.items():
        setattr(activity, field, value)
        
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an activity",
    description="Delete a specific activity. Decreases the user's total carbon score."
)
def delete_activity(
    id: UUID,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    activity = db.query(Activity).filter(Activity.id == id, Activity.user_id == current_user.id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    
    # Adjust user's carbon score
    current_user.current_carbon_score = (current_user.current_carbon_score or 0.0) - activity.carbon_emission
    if current_user.current_carbon_score < 0:
        current_user.current_carbon_score = 0.0
        
    db.delete(activity)
    db.commit()
    return None
