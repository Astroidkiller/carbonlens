import sys
from app.db.database import SessionLocal
from app.schemas.user import UserCreate
from app.api.routes.auth import register_user

db = SessionLocal()
try:
    user_in = UserCreate(email="direct_test@test.com", password="testpassword", full_name="Direct Test")
    user = register_user(user_in, db)
    print("SUCCESS: user registered!")
except Exception as e:
    import traceback
    print("FAILED with Exception:")
    traceback.print_exc()
finally:
    db.close()
