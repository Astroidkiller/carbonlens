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
    uid_a = str(uuid.uuid4())[:8]
    uid_b = str(uuid.uuid4())[:8]
    email_a = f'userA_{uid_a}@test.com'
    email_b = f'userB_{uid_b}@test.com'

    # Register users
    request('POST', '/api/v1/auth/register', {'email': email_a, 'password':'password'})
    _, res = request('POST', '/api/v1/auth/login', {'username': email_a, 'password':'password'})
    tokenA = res['access_token']
    
    request('POST', '/api/v1/auth/register', {'email': email_b, 'password':'password'})
    _, res = request('POST', '/api/v1/auth/login', {'username': email_b, 'password':'password'})
    tokenB = res['access_token']

    print("--- 1. Valid Activity Creation & Unit Conversion ---")
    # 10 miles should convert to 16.09 km. 16.09 * 0.19 = 3.06 kg CO2
    act_data = {
        "activity_date": "2026-06-09T10:00:00Z",
        "category": "transport",
        "activity_type": "car",
        "quantity": 10.0,
        "unit": "miles"
    }
    status, res = request('POST', '/api/v1/activities/', act_data, tokenA)
    print(f"Status: {status}")
    print(f"Emission: {res.get('carbon_emission')}")
    print(f"Explanation: {res.get('calculation_explanation')}")
    act_id = res.get('id')

    print("\n--- 2. Unsupported Activity Type ---")
    bad_data = act_data.copy()
    bad_data["activity_type"] = "airplane"
    status, res = request('POST', '/api/v1/activities/', bad_data, tokenA)
    print(f"Status: {status} (Expected 400)")
    print(f"Error Detail: {res.get('detail')}")

    print("\n--- 3. Update Recalculation ---")
    # Change type to bus (0.08 kg/km). 16.09 * 0.08 = 1.29 kg CO2
    status, res = request('PUT', f'/api/v1/activities/{act_id}', {"activity_type": "bus"}, tokenA)
    print(f"Status: {status}")
    print(f"New Emission: {res.get('carbon_emission')}")
    print(f"New Explanation: {res.get('calculation_explanation')}")

    print("\n--- 4. Ownership Protection ---")
    status, res = request('PUT', f'/api/v1/activities/{act_id}', {"quantity": 20.0}, tokenB)
    print(f"User B PUT User A Activity Status: {status} (Expected 404)")

    print("\n--- 5. Delete Activity ---")
    status, res = request('DELETE', f'/api/v1/activities/{act_id}', token=tokenA)
    print(f"User A Delete Activity Status: {status} (Expected 204)")

except Exception as e:
    print("FAILED:", e)

proc.terminate()
