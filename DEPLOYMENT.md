# CarbonLens Deployment Guide

This guide details how to deploy CarbonLens into a production environment using Render (Backend) and Vercel (Frontend).

## 1. Database (Neon PostgreSQL)
1. Create a free account at [Neon.tech](https://neon.tech).
2. Provision a new project and PostgreSQL database.
3. Copy the `DATABASE_URL` (ensure it includes `?sslmode=require`).

## 2. Backend (Render)
1. Push the entire CarbonLens repository to GitHub.
2. Log into [Render](https://render.com) and create a new **Web Service**.
3. Point it to your GitHub repository and set the `Root Directory` to `backend`.
4. Configure the environment:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add the following Environment Variables in the Render dashboard:
   - `DATABASE_URL`: Your Neon Postgres URL.
   - `SECRET_KEY`: A secure 32+ character random string (for JWTs).
   - `GEMINI_API_KEY`: Your free Google AI Studio key.
   - `ALLOWED_ORIGINS`: `https://your-vercel-domain.vercel.app`
6. Click **Deploy**. Note the public Render URL (e.g., `https://carbonlens-api.onrender.com`).

## 3. Database Migration
Once the Render backend is live, you need to apply Alembic migrations to Neon.
1. Locally, set your `DATABASE_URL` to the Neon database URL.
2. Run `alembic upgrade head` from the `backend/` directory.

## 4. Frontend (Vercel)
1. Log into [Vercel](https://vercel.com) and select **Add New Project**.
2. Import the CarbonLens GitHub repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `frontend`.
5. In the Environment Variables section, add:
   - `VITE_API_URL`: Your live Render API URL (e.g., `https://carbonlens-api.onrender.com/api/v1`)
6. Click **Deploy**. Vercel will automatically run `npm run build`.

## 5. Troubleshooting
- **Frontend 401s / Can't Log In**: Ensure `ALLOWED_ORIGINS` in Render exactly matches the Vercel domain without trailing slashes.
- **AI Extraction Failing**: Verify `GEMINI_API_KEY` is correctly pasted in Render without quotes.
- **500 Server Errors**: Check the Render logs. Common issues include forgetting to run `alembic upgrade head` on the production database.
