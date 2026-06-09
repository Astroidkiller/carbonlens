import subprocess
import time
import urllib.request
import urllib.parse
import json

proc = subprocess.Popen(
    [".\\venv\\Scripts\\python", "-m", "uvicorn", "app.main:app", "--port", "8080"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)
time.sleep(3)

def request(method, path, data=None, token=None):
    url = f'http://localhost:8080{path}'
    headers = {}
    if data:
        if isinstance(data, dict):
            if path.endswith('login'):
                data = urllib.parse.urlencode(data).encode('utf-8')
                headers['Content-Type'] = 'application/x-www-form-urlencoded'
            else:
                data = json.dumps(data).encode('utf-8')
                headers['Content-Type'] = 'application/json'
    if token:
        headers['Authorization'] = f'Bearer {token}'
        
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req)
        return resp.status, json.loads(resp.read().decode('utf-8') or '{}')
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8') or '{}')

try:
    # 1. Register User A
    status, res = request('POST', '/api/v1/auth/register', {'email':'userA@test.com', 'password':'password'})
    if status != 200:
        print("Register A returned:", status, res)
    status, res = request('POST', '/api/v1/auth/login', {'username':'userA@test.com', 'password':'password'})
    tokenA = res['access_token']
    
    # 2. Register User B
    status, res = request('POST', '/api/v1/auth/register', {'email':'userB@test.com', 'password':'password'})
    status, res = request('POST', '/api/v1/auth/login', {'username':'userB@test.com', 'password':'password'})
    tokenB = res['access_token']

    # 3. Create Activity for User A
    activity_data = {
        "activity_date": "2026-06-09T10:00:00Z",
        "category": "transport",
        "activity_type": "driving",
        "quantity": 10.0,
        "unit": "miles",
        "carbon_emission": 4.5
    }
    status, res = request('POST', '/api/v1/activities/', activity_data, tokenA)
    print("Create Activity (User A):", status)
    act_id = res['id']

    # 4. User B tries to GET User A's activity
    status, res = request('GET', f'/api/v1/activities/{act_id}', token=tokenB)
    print("User B GET User A Activity:", status)

    # 5. User A updates Activity
    status, res = request('PUT', f'/api/v1/activities/{act_id}', {"quantity": 20.0, "carbon_emission": 9.0}, tokenA)
    print("User A PUT Activity:", status)

    # 6. User B tries to DELETE User A's activity
    status, res = request('DELETE', f'/api/v1/activities/{act_id}', token=tokenB)
    print("User B DELETE User A Activity:", status)

    # 7. User A DELETEs Activity
    status, res = request('DELETE', f'/api/v1/activities/{act_id}', token=tokenA)
    print("User A DELETE Activity:", status)

except Exception as e:
    print("FAILED:", e)

proc.terminate()
