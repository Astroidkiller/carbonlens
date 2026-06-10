import requests

print("Testing register new user on live render...")
url = "https://carbonlens-backend-1em1.onrender.com/api/v1"

try:
    # Register new user
    import uuid
    email = f"newuser_{uuid.uuid4().hex[:6]}@test.com"
    res = requests.post(f"{url}/auth/register", json={"email": email, "password": "password", "full_name": "New User"})
    print("Register:", res.status_code, res.text)
    
    # Login
    res = requests.post(f"{url}/auth/login", data={"username": email, "password": "password"})
    token = res.json().get("access_token")
    print("Login:", res.status_code, "Token:", token[:10] + "...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get Dashboard
    sum_res = requests.get(f"{url}/dashboard/summary", headers=headers)
    print("Summary:", sum_res.status_code, sum_res.text)
    
    cat_res = requests.get(f"{url}/dashboard/categories", headers=headers)
    print("Categories:", cat_res.status_code, cat_res.text)
    
    trend_res = requests.get(f"{url}/dashboard/trends", headers=headers)
    print("Trends:", trend_res.status_code, trend_res.text)

except Exception as e:
    print("Error:", e)
