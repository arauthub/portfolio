from fastapi import APIRouter, Header
from typing import Optional
from ..schemas.routes import ComputeRouteRequest, RouteResponse
from ..services.routes_service import routes_service

router = APIRouter(prefix="/routes", tags=["Routes API"])

@router.post("/compute", response_model=RouteResponse)
async def compute_route(
    req: ComputeRouteRequest,
    x_google_maps_key: Optional[str] = Header(None, alias="X-Google-Maps-Key")
):
    """Compute multi-modal route path between origin, destination, and waypoints."""
    return await routes_service.compute_route(req, api_key_override=x_google_maps_key)

