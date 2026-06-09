# CarbonLens Architecture

CarbonLens is built using a modern, decoupled monolithic architecture combining a high-performance Python backend with a scalable React frontend.

## High-Level Architecture
1. **Frontend**: React 19 + Vite + TailwindCSS. Uses Axios for data fetching and Context API for JWT state management. Chart.js powers the data visualization.
2. **Backend**: FastAPI (Python 3.10+). Leverages Pydantic for strict schema validation, SQLAlchemy for ORM, and Uvicorn as the ASGI server.
3. **Database**: PostgreSQL hosted on Neon.tech.

## Database Schema
- **users table**: `id`, `email`, `hashed_password`, `full_name`, `current_carbon_score`, `created_at`.
- **activities table**: `id`, `user_id` (FK), `activity_date`, `category`, `activity_type`, `description`, `quantity`, `unit`, `carbon_emission`, `calculation_explanation`, `created_at`.

## Core Workflows

### 1. Carbon Calculation Flow (Single Source of Truth)
To prevent drift, all math occurs strictly in `carbon_calculation_service.py`.
- **Input**: Raw quantity and unit (e.g., `10 miles`).
- **Normalization**: The service converts units (miles -> km, grams -> kg) to match internal storage standards.
- **Calculation**: Multiplies normalized quantities by strict scientific factors (e.g., `1 km Car = 0.19 kg CO2`).
- **Output**: Returns normalized values, the final footprint, and a string-based `calculation_explanation` to maintain transparency with the user.

### 2. Hybrid AI Extraction Flow
The "AI Diary" processes natural language intelligently while prioritizing speed and keeping costs at absolute zero.
- **Step 1 (Rule-Based Regex)**: `rule_extractor_service.py` scans text for obvious structural patterns (e.g., `<Number> <Unit> <Mode of Transport>`). It assigns a Confidence Score.
- **Step 2 (Gemini Fallback)**: If confidence falls below 80%, the raw text is dispatched to Google `gemini-2.5-flash` with `response_mime_type="application/json"` and a highly restrictive prompt, forcing it to structure ambiguous text into matching `ActivityCreate` schemas.
- **Step 3 (Orchestration)**: `ai_diary_service.py` receives the structured JSON (from either engine) and runs it through the *Carbon Calculation Flow*, outputting a dry-run preview for the user before writing to the database.
