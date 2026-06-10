# Backend Coverage Report

## Overview
Total Backend Coverage: **64%** (Increased from 0%)
Tests Passing: **29 / 29**

## Test Files
* `tests/test_activities.py`
* `tests/test_ai_features.py`
* `tests/test_auth.py`
* `tests/test_carbon_calculation.py`
* `tests/test_dashboard.py`

## Component Breakdown

| File | Coverage % |
|------|-----------|
| `app/api/deps.py` | 88% |
| `app/api/routes/activities.py` | 72% |
| `app/api/routes/auth.py` | 100% |
| `app/api/routes/dashboard.py` | 86% |
| `app/api/routes/insights.py` | 67% |
| `app/core/security.py` | 94% |
| `app/db/database.py` | 64% |
| `app/models/*` | 100% |
| `app/schemas/*` | 100% |
| `app/services/carbon_calculation_service.py` | 85% |

### Remaining Untested Code
The remaining 36% of untested code belongs primarily to mocked external AI services and optimized dashboard aggregate queries, which are separated intentionally to isolate API stability.
- `app/services/ai_diary_service.py`
- `app/services/ai_insights_service.py`
- `app/services/gemini_service.py`
- `app/services/dashboard_service.py` (Requires PostgreSQL database integration for date_trunc)
