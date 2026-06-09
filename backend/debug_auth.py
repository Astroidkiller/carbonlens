import requests
import json
import traceback

BASE_URL = "http://127.0.0.1:8001/api/v1"

print("--- EMERGENCY AUTH DEBUG ---")
print("1. Testing Backend Registration...")

try:
    register_response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "testdebug@carbonlens.com",
        "password": "password123",
        "full_name": "Debug User"
    })
    print(f"REGISTER STATUS: {register_response.status_code}")
    print(f"REGISTER BODY: {register_response.text}")
except Exception as e:
    print(f"REGISTER FAILED: {str(e)}")

print("\n2. Testing Backend Login (x-www-form-urlencoded)...")
try:
    login_response = requests.post(f"{BASE_URL}/auth/login", data={
        "username": "testdebug@carbonlens.com",
        "password": "password123"
    })
    print(f"LOGIN STATUS: {login_response.status_code}")
    print(f"LOGIN BODY: {login_response.text}")
    
    token = None
    if login_response.status_code == 200:
        token = login_response.json().get("access_token")
        
except Exception as e:
    print(f"LOGIN FAILED: {str(e)}")

if token:
    print("\n3. Testing /auth/me with JWT...")
    try:
        me_response = requests.get(f"{BASE_URL}/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        print(f"ME STATUS: {me_response.status_code}")
        print(f"ME BODY: {me_response.text}")
    except Exception as e:
        print(f"ME FAILED: {str(e)}")
else:
    print("\n3. Skipping /auth/me because no token was received.")
