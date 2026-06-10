import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonLens"
    API_V1_STR: str = "/api/v1"
    
    # Placeholder for PostgreSQL Neon DB URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@ep-cold-shadow-123456.us-east-2.aws.neon.tech/carbonlens").replace("postgres://", "postgresql://")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey_change_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # AI Service
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "PLACEHOLDER_GEMINI_API_KEY")

    # CORS
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    class Config:
        env_file = ".env"

settings = Settings()
