import pytest
from unittest.mock import patch
from app.schemas.dashboard import DashboardSummary, DashboardCategories, DashboardTrends

@pytest.fixture
def auth_token(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "dashuser@example.com", "password": "password"}
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "dashuser@example.com", "password": "password"}
    )
    return response.json()["access_token"]

@patch("app.api.routes.dashboard.dashboard_service.get_dashboard_summary")
def test_get_dashboard_summary(mock_summary, client, auth_token):
    mock_summary.return_value = DashboardSummary(
        total_emissions=10.0,
        current_week=5.0,
        previous_week=2.0,
        weekly_change_percent=150.0,
        current_month=10.0,
        previous_month=0.0,
        monthly_change_percent=100.0,
        activity_count=2,
        average_daily_emissions=1.5,
        highest_emission_category="transport",
        carbon_score=85,
        trend_direction="Increasing"
    )

    response = client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_emissions"] == 10.0
    assert data["activity_count"] == 2
    assert data["carbon_score"] == 85

@patch("app.api.routes.dashboard.dashboard_service.get_dashboard_categories")
def test_get_dashboard_categories(mock_categories, client, auth_token):
    mock_categories.return_value = DashboardCategories(
        transport=10.0,
        food=5.0,
        electricity=2.0,
        shopping=1.0,
        waste=0.5
    )

    response = client.get(
        "/api/v1/dashboard/categories",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["transport"] == 10.0

@patch("app.api.routes.dashboard.dashboard_service.get_dashboard_trends")
def test_get_dashboard_trends(mock_trends, client, auth_token):
    mock_trends.return_value = DashboardTrends(
        daily=[],
        weekly=[],
        monthly=[]
    )

    response = client.get(
        "/api/v1/dashboard/trends",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["daily"], list)
