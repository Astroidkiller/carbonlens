import os
import sys
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

# Allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, engine
from app.models.user import User
from app.models.activity import Activity
from app.core.security import get_password_hash
from app.services.carbon_calculation_service import calculate_carbon_emission

def seed_data():
    db: Session = SessionLocal()
    
    demo_email = "demo@carbonlens.com"
    demo_password = "password123"
    
    # 1. Ensure Demo User Exists
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
        print("Creating demo user...")
        user = User(
            email=demo_email,
            hashed_password=get_password_hash(demo_password),
            full_name="Carbon Demo",
            current_carbon_score=0.0
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        print("Demo user exists. Resetting their activities...")
        db.query(Activity).filter(Activity.user_id == user.id).delete()
        user.current_carbon_score = 0.0
        db.commit()

    # 2. Generate 14 days of realistic demo activities
    now = datetime.now(timezone.utc)
    
    demo_activities_raw = [
        # Today
        {"days_ago": 0, "cat": "transport", "type": "car", "qty": 15, "unit": "km"},
        {"days_ago": 0, "cat": "food", "type": "chicken meal", "qty": 1, "unit": "meal"},
        # Yesterday
        {"days_ago": 1, "cat": "electricity", "type": "generic", "qty": 12, "unit": "kWh"},
        {"days_ago": 1, "cat": "transport", "type": "bus", "qty": 10, "unit": "km"},
        {"days_ago": 1, "cat": "food", "type": "beef meal", "qty": 1, "unit": "meal"},
        # 2 days ago
        {"days_ago": 2, "cat": "shopping", "type": "clothing item", "qty": 2, "unit": "item"},
        {"days_ago": 2, "cat": "transport", "type": "train", "qty": 45, "unit": "km"},
        # 3 days ago
        {"days_ago": 3, "cat": "waste", "type": "plastic waste", "qty": 2.5, "unit": "kg"},
        {"days_ago": 3, "cat": "food", "type": "vegetarian meal", "qty": 2, "unit": "meal"},
        # 4 days ago
        {"days_ago": 4, "cat": "transport", "type": "car", "qty": 22, "unit": "km"},
        {"days_ago": 4, "cat": "electricity", "type": "generic", "qty": 14, "unit": "kWh"},
        # 5 days ago
        {"days_ago": 5, "cat": "food", "type": "beef meal", "qty": 1, "unit": "meal"},
        # 7 days ago
        {"days_ago": 7, "cat": "shopping", "type": "electronics item", "qty": 1, "unit": "item"},
        # 8 days ago
        {"days_ago": 8, "cat": "transport", "type": "car", "qty": 10, "unit": "km"},
        # 10 days ago
        {"days_ago": 10, "cat": "electricity", "type": "generic", "qty": 20, "unit": "kWh"},
        # 14 days ago
        {"days_ago": 14, "cat": "transport", "type": "bus", "qty": 15, "unit": "km"},
        {"days_ago": 14, "cat": "waste", "type": "paper waste", "qty": 5, "unit": "kg"},
    ]
    
    total_score = 0.0
    for raw in demo_activities_raw:
        calc_result = calculate_carbon_emission(
            category=raw["cat"],
            activity_type=raw["type"],
            quantity=raw["qty"],
            unit=raw["unit"]
        )
        
        act = Activity(
            user_id=user.id,
            activity_date=now - timedelta(days=raw["days_ago"]),
            category=raw["cat"],
            activity_type=raw["type"],
            quantity=calc_result["normalized_quantity"],
            unit=calc_result["normalized_unit"],
            carbon_emission=calc_result["carbon_emission"],
            calculation_explanation=calc_result["calculation_explanation"]
        )
        db.add(act)
        total_score += calc_result["carbon_emission"]

    user.current_carbon_score = total_score
    db.commit()
    
    print(f"Successfully seeded {len(demo_activities_raw)} activities for demo@carbonlens.com")
    print(f"New Carbon Score: {total_score:.2f} kg CO2")
    db.close()

if __name__ == "__main__":
    seed_data()
