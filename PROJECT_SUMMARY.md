# CarbonLens

**CarbonLens** is an intelligent, automated personal carbon footprint tracker. It replaces tedious manual carbon accounting with a seamless, AI-driven experience that translates everyday natural language descriptions into highly accurate, scientifically-backed emissions data.

## 🎯 The Problem
Individuals and small businesses lack an intuitive way to track their environmental impact. Existing solutions require users to manually select from hundreds of dropdowns, converting miles to kilometers, and tracking down carbon coefficients for obscure items. The friction causes users to abandon tracking altogether.

## 💡 The Solution
CarbonLens solves this friction with the **AI Natural Language Diary**. Users simply type exactly what they did—"I drove 15 miles to work, ate a chicken salad for lunch, and bought a t-shirt"—and the application's Hybrid AI Engine instantly categorizes, calculates, and visually graphs the carbon impact. 

## ⚙️ Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS, Chart.js
- **Backend**: FastAPI (Python), Pydantic, SQLAlchemy, Alembic
- **Database**: PostgreSQL (Neon.tech)
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Authentication**: OAuth2 JWT Bearer tokens

## ✨ Key Features
- **Hybrid AI Extractor**: A high-speed, cost-free rules engine intercepts standard patterns, while seamlessly falling back to Google Gemini for ambiguous diary entries.
- **Single-Source-of-Truth Engine**: The system actively prevents AI mathematical hallucinations by restricting Gemini to data parsing, routing all extracted parameters through a strict, deterministic backend calculation pipeline.
- **Real-Time Analytics Dashboard**: Automatic aggregation of carbon scores, category breakdowns (transport, electricity, food, waste, shopping), and 14-day trailing emission trends.
- **Secure Architecture**: End-to-end JWT protection with data isolation per user.

## 🚀 Challenges Solved
- **API Cost Constraints**: Designing the "Hybrid Extractor" lowered LLM dependency by ~50%, keeping the application operating entirely within the Google AI Studio free tier.
- **LLM Hallucinations**: Prompt-engineering Gemini with `response_mime_type="application/json"` and enforcing strict Pydantic validation prevented bad data from polluting the Postgres database.
- **Time-Series Aggregation**: Leveraged native PostgreSQL `date_trunc` functions via SQLAlchemy to aggregate massive activity datasets instantaneously for the React dashboard.
