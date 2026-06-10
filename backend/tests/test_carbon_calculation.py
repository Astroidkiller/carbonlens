import pytest
from fastapi import HTTPException
from app.services.carbon_calculation_service import calculate_carbon_emission, convert_quantity

def test_convert_quantity_transport():
    # Miles to km
    q, u = convert_quantity("transport", 10.0, "miles")
    assert q == 16.0934
    assert u == "km"

    # Meters to km
    q, u = convert_quantity("transport", 5000.0, "meters")
    assert q == 5.0
    assert u == "km"

    # Unsupported
    with pytest.raises(HTTPException) as excinfo:
        convert_quantity("transport", 10.0, "gallons")
    assert excinfo.value.status_code == 400

def test_convert_quantity_electricity():
    q, u = convert_quantity("electricity", 1500.0, "wh")
    assert q == 1.5
    assert u == "kWh"

def test_convert_quantity_food():
    q, u = convert_quantity("food", 2.0, "meals")
    assert q == 2.0
    assert u == "meals"
    
    with pytest.raises(HTTPException) as excinfo:
        convert_quantity("food", 2.0, "kg")
    assert excinfo.value.status_code == 400

def test_convert_quantity_waste():
    q, u = convert_quantity("waste", 1000.0, "grams")
    assert q == 1.0
    assert u == "kg"
    
    q, u = convert_quantity("waste", 10.0, "lbs")
    assert q == 4.53592
    assert u == "kg"

def test_calculate_carbon_emission_success():
    res = calculate_carbon_emission("transport", "car", 10.0, "km")
    assert res["carbon_emission"] == 1.9
    assert res["normalized_quantity"] == 10.0
    assert "10.00 km" in res["calculation_explanation"]

def test_calculate_carbon_emission_unsupported_category():
    with pytest.raises(HTTPException) as excinfo:
        calculate_carbon_emission("invalid", "car", 10.0, "km")
    assert excinfo.value.status_code == 400
    assert "Unsupported category" in excinfo.value.detail["error"]

def test_calculate_carbon_emission_unsupported_type():
    with pytest.raises(HTTPException) as excinfo:
        calculate_carbon_emission("transport", "airplane", 100.0, "km")
    assert excinfo.value.status_code == 400
    assert "Unsupported transport activity type" in excinfo.value.detail["error"]

def test_calculate_carbon_emission_zero_factor():
    res = calculate_carbon_emission("transport", "bicycle", 10.0, "km")
    assert res["carbon_emission"] == 0.0
    assert "0 kg CO2" in res["calculation_explanation"]
