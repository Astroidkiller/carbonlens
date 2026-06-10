import subprocess
import time
import requests

print("Starting server...")
proc = subprocess.Popen(
    [".\\venv\\Scripts\\python.exe", "-m", "uvicorn", "main:app", "--port", "8001"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

time.sleep(3)

print("Testing register...")
try:
    res = requests.post("http://127.0.0.1:8001/api/v1/auth/register", json={"email": "test456@test.com", "password": "password", "full_name": "Test User"})
    print("Register response:", res.status_code, res.text)
except Exception as e:
    print("Register failed:", e)

print("Testing login...")
try:
    res = requests.post("http://127.0.0.1:8001/api/v1/auth/login", data={"username": "test456@test.com", "password": "password"})
    print("Login response:", res.status_code, res.text)
except Exception as e:
    print("Login failed:", e)

proc.terminate()
print("Server output:")
try:
    outs, errs = proc.communicate(timeout=2)
    print(outs)
except:
    pass
