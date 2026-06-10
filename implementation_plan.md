# CarbonLens Production-Grade Testing Strategy

This plan outlines the complete execution of the 12-phase testing audit and implementation strategy to achieve **95%+ Backend Coverage** and **90%+ Frontend Coverage**, ensuring enterprise-level reliability.

## Proposed Changes

### Phase 1: Coverage Audit & Foundation
* **Backend Framework:** Install `pytest`, `pytest-cov`, `pytest-asyncio`, and `httpx` to replace the manual `test_*.py` scripts with a formal testing suite.
* **Frontend Framework:** Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
* **Action:** Run initial coverage baselines on both backend and frontend to generate the required `coverage_report.md`.

---

### Backend Testing (Phases 2-9)
I will systematically create the `backend/tests/` directory and implement the following suites using `TestClient` and an isolated test database.

* **Phase 2: Authentication Tests** (`tests/test_auth.py`)
  * Matrix of successful/failed logins, invalid inputs, duplicate emails.
  * JWT manipulation (expired, missing, malformed).
* **Phase 3: Activity CRUD Tests** (`tests/test_activities.py`)
  * Full lifecycle (Create, Read, Update, Delete).
  * Boundary testing on quantities (negative, zero, extreme values).
  * Authorization tests (User A cannot access User B's activities - 403/404 assertions).
* **Phase 4: Carbon Calculation Tests** (`tests/test_carbon_calculation.py`)
  * Strict I/O tests with a `±0.01` tolerance for all categories (Transport, Electricity, Food, Shopping, Waste).
* **Phase 5: Analytics Tests** (`tests/test_analytics.py`)
  * Trend aggregations, scoring logic, and empty dataset handling.
  * Volume testing (1 vs 100 vs 1000 activities).
* **Phase 6: AI Diary Tests** (`tests/test_ai_diary.py`)
  * Mocked Gemini responses to simulate various extraction complexities (single vs mixed activities).
  * Validation of fallback logic and extraction accuracy.
* **Phase 7: AI Insights Tests** (`tests/test_insights.py`)
  * Verification of system stability under missing API keys, quota exhaustion, and malformed JSON.
* **Phase 8: API Contract Tests**
  * Automated validation of Pydantic schemas against actual endpoint responses.
  * Generation of `api_contract_report.md`.
* **Phase 9: Database Tests** (`tests/test_db.py`)
  * Validation of foreign keys, cascade deletes, and Alembic migrations.

---

### Frontend Testing (Phase 10)
I will create the `frontend/src/__tests__/` directory.

* **Component Tests:** Mount and test `Login`, `Register`, and `AddActivity` forms to verify success, error, and loading states.
* **Integration Tests:** Verify `DashboardLayout` rendering and context isolation.

---

### End-to-End & Stress Testing (Phases 11-12)
* **Phase 11: E2E Testing (Playwright)**
  * Install `@playwright/test`.
  * Create `e2e/` directory and implement the 3 core user scenarios (Registration to Dashboard, AI Extraction flow, Insights).
* **Phase 12: Stress Testing**
  * Implement an asynchronous load tester to generate 1,000+ activities and measure backend response times and database aggregation latency.
  * Generation of `performance_report.md`.

---

## Verification Plan

### Test Deliverables
1. `coverage_report.md` (Initial vs Final coverage % for both codebases).
2. `api_contract_report.md` (Schema validation).
3. `performance_report.md` (Stress test timings).
4. `test_summary.md` (Final count, pass/fail, remaining risks).

> [!WARNING]
> **Database Reset Warning:** The E2E and Stress tests will require a clean test database. I will configure the backend tests to spin up an isolated SQLite in-memory database or a separate Test schema so we don't accidentally wipe your production Neon DB.

## Open Questions
1. Do you want the Playwright E2E tests to run in headless browser mode, and should I configure them to use a mock backend or run against the actual live server? (I recommend running them against a local instance during testing to avoid polluting production data).
2. For the 1000-activity stress test, should I use the local dev server or target the Render deployment? (Local is better for pure backend profiling, Render is better for real-world latency).
