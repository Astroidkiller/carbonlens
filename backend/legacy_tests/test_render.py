import requests

url = "https://carbonlens-backend-1em1.onrender.com/api/v1"
print("Testing live render with CORS...")
try:
    headers = {
        "Origin": "https://carbonlens.vercel.app",
        "Access-Control-Request-Method": "POST"
    }
    res = requests.options(f"{url}/auth/login", headers=headers)
    print("OPTIONS status:", res.status_code)
    print("OPTIONS headers:", res.headers)
    
    res = requests.post(f"{url}/auth/login", data={"username": "test@test.com", "password": "password"}, headers={"Origin": "https://carbonlens.vercel.app"})
    print("Login status:", res.status_code)
    print("Login body:", res.text)
    print("Login CORS Header:", res.headers.get("Access-Control-Allow-Origin"))
except Exception as e:
    print("Error:", e)
