import subprocess
import time
import urllib.request
import json
import traceback

# Start uvicorn
proc = subprocess.Popen(
    [".\\venv\\Scripts\\python", "-m", "uvicorn", "app.main:app", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

time.sleep(3) # wait for startup

try:
    url = 'http://localhost:8000/api/v1/auth/register'
    data = json.dumps({"email":"test_8000@test.com", "password":"testpassword", "full_name":"Test User"}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    response = urllib.request.urlopen(req)
    print("STATUS:", response.status)
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("ERROR BODY:", e.read().decode('utf-8'))
except Exception as e:
    print("REQUEST FAILED:", e)

# Give it a second to log
time.sleep(1)

proc.terminate()
stdout, _ = proc.communicate()

print("\n--- UVICORN LOGS ---")
print(stdout)
