import subprocess
import time
import urllib.request
import json
import traceback

# Start uvicorn
proc = subprocess.Popen(
    [".\\venv\\Scripts\\python", "-m", "uvicorn", "app.main:app", "--port", "8005"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

time.sleep(3) # wait for startup

try:
    url = 'http://localhost:8005/api/v1/auth/register'
    data = json.dumps({"email":"debug2@test.com", "password":"testpassword", "full_name":"Test User"}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    response = urllib.request.urlopen(req)
    print("STATUS:", response.status)
except Exception as e:
    print("REQUEST FAILED:", e)

# Give it a second to log
time.sleep(1)

proc.terminate()
stdout, _ = proc.communicate()

print("\n--- UVICORN LOGS ---")
print(stdout)
