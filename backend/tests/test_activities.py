import pytest
import datetime

@pytest.fixture
def auth_token(client):
    # Register and login a test user
    client.post(
        "/api/v1/auth/register",
        json={"email": "activityuser@example.com", "password": "password"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "activityuser@example.com", "password": "password"}
    )
    return response.json()["access_token"]

@pytest.fixture
def other_auth_token(client):
    # Register and login another test user
    client.post(
        "/api/v1/auth/register",
        json={"email": "otheruser@example.com", "password": "password"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "otheruser@example.com", "password": "password"}
    )
    return response.json()["access_token"]

def test_create_activity_success(client, auth_token):
    activity_data = {
        "activity_date": "2026-06-10T10:00:00Z",
        "category": "transport",
        "activity_type": "car",
        "description": "Drove to work",
        "quantity": 15.5,
        "unit": "km"
    }
    response = client.post(
        "/api/v1/activities/",
        json=activity_data,
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["category"] == "transport"
    assert data["quantity"] == 15.5
    assert "id" in data
    assert "carbon_emission" in data
    assert "created_at" in data

def test_create_activity_negative_quantity(client, auth_token):
    activity_data = {
        "activity_date": "2026-06-10T10:00:00Z",
        "category": "transport",
        "activity_type": "car",
        "quantity": -5.0,
        "unit": "km"
    }
    response = client.post(
        "/api/v1/activities/",
        json=activity_data,
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 422 # Unprocessable Entity due to validation
    
def test_create_activity_zero_quantity(client, auth_token):
    activity_data = {
        "activity_date": "2026-06-10T10:00:00Z",
        "category": "transport",
        "activity_type": "car",
        "quantity": 0,
        "unit": "km"
    }
    response = client.post(
        "/api/v1/activities/",
        json=activity_data,
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 422

def test_get_activities_empty(client, auth_token):
    response = client.get(
        "/api/v1/activities/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert response.json() == []

def test_get_activities_with_data(client, auth_token):
    # Create two activities
    client.post(
        "/api/v1/activities/",
        json={
            "activity_date": "2026-06-10T10:00:00Z",
            "category": "transport",
            "activity_type": "car",
            "quantity": 10.0,
            "unit": "km"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    client.post(
        "/api/v1/activities/",
        json={
            "activity_date": "2026-06-11T10:00:00Z",
            "category": "food",
            "activity_type": "beef meal",
            "quantity": 1.0,
            "unit": "meal"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    response = client.get(
        "/api/v1/activities/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

def test_update_activity_success(client, auth_token):
    # Create
    create_response = client.post(
        "/api/v1/activities/",
        json={
            "activity_date": "2026-06-10T10:00:00Z",
            "category": "transport",
            "activity_type": "car",
            "quantity": 10.0,
            "unit": "km"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    activity_id = create_response.json()["id"]

    # Update
    update_response = client.put(
        f"/api/v1/activities/{activity_id}",
        json={"quantity": 20.0},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["quantity"] == 20.0

def test_delete_activity_success(client, auth_token):
    # Create
    create_response = client.post(
        "/api/v1/activities/",
        json={
            "activity_date": "2026-06-10T10:00:00Z",
            "category": "transport",
            "activity_type": "car",
            "quantity": 10.0,
            "unit": "km"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    activity_id = create_response.json()["id"]

    # Delete
    delete_response = client.delete(
        f"/api/v1/activities/{activity_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert delete_response.status_code == 204

    # Verify Get returns 404
    get_response = client.get(
        f"/api/v1/activities/{activity_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert get_response.status_code == 404

def test_cross_user_access_denied(client, auth_token, other_auth_token):
    # User 1 Creates
    create_response = client.post(
        "/api/v1/activities/",
        json={
            "activity_date": "2026-06-10T10:00:00Z",
            "category": "transport",
            "activity_type": "car",
            "quantity": 10.0,
            "unit": "km"
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    activity_id = create_response.json()["id"]

    # User 2 Tries to GET
    get_response = client.get(
        f"/api/v1/activities/{activity_id}",
        headers={"Authorization": f"Bearer {other_auth_token}"}
    )
    assert get_response.status_code == 404 # Should act like it doesn't exist

    # User 2 Tries to PUT
    put_response = client.put(
        f"/api/v1/activities/{activity_id}",
        json={"quantity": 20.0},
        headers={"Authorization": f"Bearer {other_auth_token}"}
    )
    assert put_response.status_code == 404

    # User 2 Tries to DELETE
    del_response = client.delete(
        f"/api/v1/activities/{activity_id}",
        headers={"Authorization": f"Bearer {other_auth_token}"}
    )
    assert del_response.status_code == 404
