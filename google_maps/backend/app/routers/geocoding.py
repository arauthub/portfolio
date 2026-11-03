from fastapi import APIRouter, Header, Query
from typing import Optional, Dict, Any
from ..services.geocoding_service import geocoding_service

router = APIRouter(prefix="/geocoding", tags=["Geocoding API v4"])

@router.get("/forward")
async def geocode_address(
    address: str = Query(..., description="Address, place name, or landmark"),
    x_google_maps_key: Optional[str] = Header(None, alias="X-Google-Maps-Key")
) -> Dict[str, Any]:
    """Forward geocode address to coordinates using Geocoding API v4."""
    return await geocoding_service.geocode(address, api_key_override=x_google_maps_key)

@router.get("/reverse")
async def reverse_geocode(
    latitude: float = Query(...),
    longitude: float = Query(...),
    x_google_maps_key: Optional[str] = Header(None, alias="X-Google-Maps-Key")
) -> Dict[str, Any]:
    """Reverse geocode coordinates into formatted address."""
    return await geocoding_service.reverse_geocode(latitude, longitude, api_key_override=x_google_maps_key)

