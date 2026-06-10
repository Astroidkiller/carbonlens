from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Literal

# Category literals for validation
CategoryType = Literal["transport", "electricity", "food", "shopping", "waste"]

class ActivityBase(BaseModel):
    activity_date: datetime
    category: CategoryType
    activity_type: str
    description: Optional[str] = None
    quantity: float = Field(gt=0)
    unit: str

class ActivityCreate(ActivityBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "activity_date": "2026-06-09T08:00:00Z",
                "category": "transport",
                "activity_type": "car",
                "description": "Driving to work",
                "quantity": 10.0,
                "unit": "miles"
            }
        }
    )

class ActivityUpdate(BaseModel):
    activity_date: Optional[datetime] = None
    category: Optional[CategoryType] = None
    activity_type: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "description": "Driving to work via highway",
                "quantity": 12.0
            }
        }
    )

class ActivityOut(ActivityBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    carbon_emission: float
    calculation_explanation: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174001",
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "created_at": "2026-06-09T08:05:00Z",
                "activity_date": "2026-06-09T08:00:00Z",
                "category": "transport",
                "activity_type": "car",
                "description": "Driving to work",
                "quantity": 16.09,
                "unit": "km",
                "carbon_emission": 3.06,
                "calculation_explanation": "16.09 km × 0.19 kg CO2/km = 3.06 kg CO2"
            }
        }
    )

class DiaryExtractRequest(BaseModel):
    text: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "text": "Today I drove 15 km to college, ate a chicken biryani for lunch, used about 5 kWh of electricity, and bought a T-shirt."
            }
        }
    )

class BulkActivityCreate(BaseModel):
    activities: list[ActivityCreate]
