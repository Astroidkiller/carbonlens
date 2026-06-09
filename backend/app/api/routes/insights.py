from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...models.user import User
from ...schemas.insights import InsightsResponse
from ..deps import get_current_user
from ...services.insights_service import insights_service

router = APIRouter()

@router.get(
    "/generate",
    response_model=InsightsResponse,
    summary="Get AI Insights",
    description="Returns AI-generated insights based on the user's carbon metrics."
)
def get_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        data = insights_service.get_insights(db, current_user.id)
        return InsightsResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
