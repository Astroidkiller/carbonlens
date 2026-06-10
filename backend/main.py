from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
import os
from app.core.config import settings
from app.api.routes import auth, activities, dashboard, insights

tags_metadata = [
    {
        "name": "auth",
        "description": "Authentication and user management operations. Includes login, registration, and profile retrieval.",
    },
    {
        "name": "activities",
        "description": "Manage user carbon activities. Supports manual logging and AI-powered natural language diary parsing.",
    },
]

app = FastAPI(
    title="CarbonLens API",
    description="""
    **CarbonLens** is an AI-powered personal carbon footprint tracker. 🌿
    
    ## Features
    * **AI Diary**: Log activities using natural language.
    * **Carbon Calculation**: Accurate emissions tracking.
    * **Insights**: Personalized sustainability recommendations.
    """,
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url=None, # Disable default docs to inject custom UI below
    debug=os.getenv("DEBUG", "False").lower() == "true",
)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="CarbonLens API - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_ui_parameters={"defaultModelsExpandDepth": -1},
        swagger_favicon_url="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg"
    )

from fastapi.responses import JSONResponse
import traceback
import logging
from fastapi.middleware.cors import CORSMiddleware
import os

# Configure production logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Use wildcard CORS to prevent any blocking from Vercel preview environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins

    allow_credentials=False, # Must be false when using wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal Server Error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred."}
    )

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(activities.router, prefix=f"{settings.API_V1_STR}/activities", tags=["activities"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(insights.router, prefix=f"{settings.API_V1_STR}/insights", tags=["insights"])

@app.get("/health", summary="Health Check", tags=["health"])
def health_check():
    """
    Returns a healthy status to verify the API is running for production platforms (Render).
    """
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"status": "healthy", "message": "CarbonLens API is running successfully"}
