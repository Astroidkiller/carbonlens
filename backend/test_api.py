import urllib.request
import json
import urllib.error

url = 'http://localhost:8000/api/v1/auth/register'
data = json.dumps({"email":"debug_test@test.com", "password":"testpassword", "full_name":"Test User"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    response = urllib.request.urlopen(req)
    print("STATUS:", response.status)
    print("BODY:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("ERROR BODY:", e.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR:", str(e))
