import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Google Maps Platform Suite"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # GCP Project
    GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "gmp-demo-project-569655961")
    
    # Google Maps Platform Key
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY", "")
    
    # Gemini / AI Key
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    
    # Weather API Key (optional fallback)
    OPENWEATHER_API_KEY: Optional[str] = os.getenv("OPENWEATHER_API_KEY", "")
    
    # Server host & port
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Runtime in-memory key cache allows dynamic updates from frontend
runtime_keys = {
    "google_maps_api_key": settings.GOOGLE_MAPS_API_KEY or "",
    "gemini_api_key": settings.GEMINI_API_KEY or "",
    "openweather_api_key": settings.OPENWEATHER_API_KEY or "",
    "gcp_project_id": settings.GCP_PROJECT_ID
}

def get_google_maps_key(override: Optional[str] = None) -> str:
    if override and override.strip():
        return override.strip()
    return runtime_keys.get("google_maps_api_key") or os.getenv("GOOGLE_MAPS_API_KEY", "")

def get_gemini_key(override: Optional[str] = None) -> str:
    if override and override.strip():
        return override.strip()
    return runtime_keys.get("gemini_api_key") or os.getenv("GEMINI_API_KEY", "")

