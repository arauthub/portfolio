from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import Optional
from ..core.config import settings, runtime_keys

router = APIRouter(prefix="/system", tags=["System & Keys"])

class KeyUpdateRequest(BaseModel):
    google_maps_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    openweather_api_key: Optional[str] = None

class SystemStatusResponse(BaseModel):
    google_maps_key_set: bool
    gemini_key_set: bool
    openweather_key_set: bool
    gcp_project_id: str
    version: str
    status: str

@router.get("/status", response_model=SystemStatusResponse)
async def get_system_status():
    """Check configuration and API key readiness."""
    maps_key = runtime_keys.get("google_maps_api_key") or settings.GOOGLE_MAPS_API_KEY
    gemini_key = runtime_keys.get("gemini_api_key") or settings.GEMINI_API_KEY
    weather_key = runtime_keys.get("openweather_api_key") or settings.OPENWEATHER_API_KEY

    return SystemStatusResponse(
        google_maps_key_set=bool(maps_key and maps_key.strip()),
        gemini_key_set=bool(gemini_key and gemini_key.strip()),
        openweather_key_set=bool(weather_key and weather_key.strip()),
        gcp_project_id=settings.GCP_PROJECT_ID,
        version=settings.VERSION,
        status="operational"
    )

@router.post("/keys")
async def update_runtime_keys(payload: KeyUpdateRequest):
    """Dynamically register or update API keys at runtime without restarting the server."""
    if payload.google_maps_api_key is not None:
        runtime_keys["google_maps_api_key"] = payload.google_maps_api_key.strip()
    if payload.gemini_api_key is not None:
        runtime_keys["gemini_api_key"] = payload.gemini_api_key.strip()
    if payload.openweather_api_key is not None:
        runtime_keys["openweather_api_key"] = payload.openweather_api_key.strip()

    return {
        "message": "Keys updated successfully",
        "google_maps_key_set": bool(runtime_keys["google_maps_api_key"]),
        "gemini_key_set": bool(runtime_keys["gemini_api_key"])
    }

