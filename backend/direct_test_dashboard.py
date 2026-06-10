import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from app.db.database import SessionLocal
from app.services.dashboard_service import get_dashboard_summary, get_dashboard_insights_data
from app.models.user import User

db = SessionLocal()
user = db.query(User).first()
if user:
    print("Testing summary")
    summary = get_dashboard_summary(db, user.id)
    print("Summary:", summary)
    print("Testing insights")
    insights = get_dashboard_insights_data(db, user.id)
    print("Insights:", insights)
else:
    print("No user found")
db.close()
