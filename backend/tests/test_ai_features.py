import pytest
from unittest.mock import patch
from datetime import datetime, timezone

@pytest.fixture
def auth_token(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "aiuser@example.com", "password": "password"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "aiuser@example.com", "password": "password"}
    )
    return response.json()["access_token"]

@patch("app.api.routes.dashboard.insights_service.get_insights")
def test_get_ai_insights(mock_get_insights, client, auth_token):
    mock_get_insights.return_value = {
        "summary": "You are doing great overall.",
        "insights": [
            {
                "title": "Transport Expert",
                "description": "You walk more than you drive.",
                "priority": "low"
            }
        ],
        "recommendations": [
            {
                "title": "Keep it up",
                "impact": "high",
                "estimated_savings": "2kg CO2"
            }
        ],
        "risk_areas": ["Too much beef"],
        "positive_habits": ["Lots of biking"]
    }

    response = client.get(
        "/api/v1/dashboard/ai-insights",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["insights"]) == 1
    assert len(data["recommendations"]) == 1

@patch("app.api.routes.activities.ai_diary_service.extract_and_calculate")
def test_diary_entry(mock_extract, client, auth_token):
    mock_extract.return_value = {
        "activities": [
            {
                "activity": {
                    "activity_date": datetime.now(timezone.utc),
                    "category": "transport",
                    "activity_type": "bicycle",
                    "quantity": 10.0,
                    "unit": "km",
                    "description": "Biked to work"
                },
                "carbon_emission": 0.0,
                "calculation_explanation": "Biking is carbon neutral"
            }
        ]
    }

    response = client.post(
        "/api/v1/activities/diary",
        json={"text": "I biked to work today."},
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert len(data) == 1
    assert data[0]["activity_type"] == "bicycle"
