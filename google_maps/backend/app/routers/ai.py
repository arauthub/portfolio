from fastapi import APIRouter, Header
from typing import Optional
from ..schemas.ai import GeospatialAIRequest, GeospatialAIResponse
from ..services.ai_assistant_service import ai_assistant

router = APIRouter(prefix="/ai", tags=["Geospatial AI Assistant"])

@router.post("/assistant", response_model=GeospatialAIResponse)
async def query_geospatial_assistant(
    req: GeospatialAIRequest,
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key"),
    x_google_maps_key: Optional[str] = Header(None, alias="X-Google-Maps-Key")
):
    """Ground natural language queries with real-time location, Geocoding v4, and Weather parameters."""
    return await ai_assistant.process_query(
        req,
        gemini_key_override=x_gemini_key,
        maps_key_override=x_google_maps_key
    )

