import subprocess
import time
import urllib.request
import urllib.parse
import json
import uuid

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
    # 1. Setup user
    uid = str(uuid.uuid4())[:8]
    email = f'dashboard_{uid}@test.com'
    request('POST', '/api/v1/auth/register', {'email': email, 'password':'password'})
    _, res = request('POST', '/api/v1/auth/login', {'username': email, 'password':'password'})
    token = res['access_token']

    # 2. Add some activities
    acts = [
        {"activity_date": "2026-06-09T10:00:00Z", "category": "transport", "activity_type": "car", "quantity": 50, "unit": "km"}, # ~9.5 kg
        {"activity_date": "2026-06-08T10:00:00Z", "category": "food", "activity_type": "beef meal", "quantity": 1, "unit": "meal"}, # 27 kg
        {"activity_date": "2026-06-01T10:00:00Z", "category": "electricity", "activity_type": "generic", "quantity": 20, "unit": "kwh"} # 16.4 kg
    ]
    for act in acts:
        request('POST', '/api/v1/activities/', act, token)

    print("--- Dashboard Summary ---")
    status, res = request('GET', '/api/v1/dashboard/summary', token=token)
    print(f"Status: {status}")
    print(json.dumps(res, indent=2))

    print("\n--- Dashboard Categories ---")
    status, res = request('GET', '/api/v1/dashboard/categories', token=token)
    print(f"Status: {status}")
    print(json.dumps(res, indent=2))

    print("\n--- Dashboard Trends ---")
    status, res = request('GET', '/api/v1/dashboard/trends', token=token)
    print(f"Status: {status}")
    print("Daily trends points:", len(res.get('daily', [])))

    print("\n--- Dashboard Top Contributors ---")
    status, res = request('GET', '/api/v1/dashboard/top-contributors', token=token)
    print(f"Status: {status}")
    print("Top Activities:", res.get('top_activities', [])[0] if res.get('top_activities') else None)

    print("\n--- Dashboard Insights Data ---")
    status, res = request('GET', '/api/v1/dashboard/insights-data', token=token)
    print(f"Status: {status}")
    print(json.dumps(res, indent=2))

except Exception as e:
    print("FAILED:", e)

proc.terminate()
