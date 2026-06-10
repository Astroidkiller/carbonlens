import sys
import os
import traceback
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.db.database import SessionLocal
    from app.models.user import User
    
    db = SessionLocal()
    print("DB Connection successful")
    
    users = db.query(User).all()
    print(f"Found {len(users)} users.")
    for u in users:
        print(f" - {u.email} (ID: {u.id})")
        
except Exception as e:
    print("DB ERROR:")
    traceback.print_exc()
