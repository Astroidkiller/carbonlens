import pytest

def test_register_success(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data

def test_register_duplicate_email(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"}
    )
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "anotherpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "The user with this email already exists in the system."

def test_login_success(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "securepassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Incorrect email or password"

def test_login_unknown_user(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "unknown@example.com", "password": "password"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Incorrect email or password"

def test_get_current_user_success(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "securepassword123"}
    )
    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "securepassword123"}
    )
    token = login_response.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"

def test_get_current_user_missing_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401

def test_get_current_user_invalid_token(client):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    assert response.status_code == 401
