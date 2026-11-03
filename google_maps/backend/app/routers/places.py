from fastapi import APIRouter, Header, Query
from typing import Optional
from ..schemas.places import NearbySearchRequest, TextSearchRequest, PlacesResponse
from ..services.places_service import places_service

router = APIRouter(prefix="/places", tags=["Places API (New)"])

@router.post("/nearby", response_model=PlacesResponse)
async def search_nearby(
    req: NearbySearchRequest,
    x_google_maps_key: Optional[str] = Header(None, alias="X-Google-Maps-Key")
):
    """Search nearby places using Places API (New) with vector/field mask optimization."""
    return await places_service.search_nearby(req, api_key_override=x_google_maps_key)

@router.post("/search", response_model=PlacesResponse)
async def search_text(
    req: TextSearchRequest,
    x_google_maps_key: Optional[str] = Header(None, alias="X-Google-Maps-Key")
):
    """Search places by text query using Places API (New)."""
    return await places_service.search_text(req, api_key_override=x_google_maps_key)

