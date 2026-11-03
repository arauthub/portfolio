from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class RoutePoint(BaseModel):
    latitude: float
    longitude: float

class Step(BaseModel):
    instruction: str
    distance_meters: Optional[int] = None
    duration: Optional[str] = None
    start_location: RoutePoint
    end_location: RoutePoint
    travel_mode: Optional[str] = None

class ComputeRouteRequest(BaseModel):
    origin: RoutePoint = Field(..., description="Starting coordinate")
    destination: RoutePoint = Field(..., description="Destination coordinate")
    intermediates: Optional[List[RoutePoint]] = Field(default=None, description="Optional waypoints")
    travel_mode: str = Field(default="DRIVE", description="DRIVE, WALK, BICYCLE, TWO_WHEELER, TRANSIT")
    routing_preference: str = Field(default="TRAFFIC_AWARE", description="TRAFFIC_UNAWARE, TRAFFIC_AWARE, TRAFFIC_AWARE_OPTIMAL")
    compute_alternative_routes: bool = False

class RouteLeg(BaseModel):
    distance_meters: int
    duration: str
    steps: List[Step] = []

class RouteResponse(BaseModel):
    distance_meters: int
    distance_text: str
    duration: str
    duration_text: str
    encoded_polyline: str
    polyline_coordinates: List[List[float]] = []  # [[lat, lng], [lat, lng], ...]
    steps: List[Step] = []
    legs: List[RouteLeg] = []
    travel_mode: str
    description: Optional[str] = None

