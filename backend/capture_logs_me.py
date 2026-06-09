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

try:
    # 1. Login
    url_login = 'http://localhost:8080/api/v1/auth/login'
    data_login = urllib.parse.urlencode({'username':'real_test@test.com', 'password':'testpassword'}).encode('utf-8')
    req_login = urllib.request.Request(url_login, data=data_login, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    resp_login = urllib.request.urlopen(req_login)
    token_data = json.loads(resp_login.read().decode('utf-8'))
    token = token_data['access_token']
    print("LOGIN SUCCESS. Token:", token[:20] + "...")

    # 2. Get /me
    url_me = 'http://localhost:8080/api/v1/auth/me'
    req_me = urllib.request.Request(url_me, headers={'Authorization': f'Bearer {token}'})
    resp_me = urllib.request.urlopen(req_me)
    print("ME STATUS:", resp_me.status)
    print("ME BODY:", resp_me.read().decode('utf-8'))

except Exception as e:
    print("FAILED:", e)

time.sleep(1)
proc.terminate()
