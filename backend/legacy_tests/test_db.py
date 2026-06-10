import os
import sys
import traceback
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

load_dotenv()

# 3. Verify DB Connectivity
url = os.getenv('DATABASE_URL')
print(f"DATABASE_URL: {url}")
try:
    engine = create_engine(url)
    with engine.connect() as conn:
        result = conn.execute(text('SELECT 1')).fetchone()
        print(f"DB Connection Success: SELECT 1 -> {result}")
except Exception as e:
    print(f"DB Connection Failed: {e}")

# 5. Inspect DB Schema
try:
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables in DB: {tables}")
    if 'users' in tables:
        columns = inspector.get_columns('users')
        print("Columns in 'users' table:")
        for col in columns:
            print(f"  - {col['name']} ({col['type']}), nullable={col['nullable']}")
    else:
        print("'users' table NOT FOUND in DB.")
except Exception as e:
    print(f"Failed to inspect schema: {e}")

# 8. Verify Password Hashing
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    test_hash = pwd_context.hash("testpassword")
    print(f"Passlib & Bcrypt test success. Hash: {test_hash[:10]}...")
except Exception as e:
    print(f"Passlib/Bcrypt verification failed: {e}")
