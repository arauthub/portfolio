from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LatLng(BaseModel):
    latitude: float
    longitude: float

class NearbySearchRequest(BaseModel):
    latitude: float = Field(..., description="Center latitude")
    longitude: float = Field(..., description="Center longitude")
    radius: float = Field(default=2500.0, description="Search radius in meters")
    included_types: Optional[List[str]] = Field(default=None, description="e.g. ['cafe', 'restaurant', 'store', 'supermarket']")
    max_result_count: int = Field(default=20, ge=1, le=20)
    rank_preference: str = Field(default="POPULARITY", description="POPULARITY or DISTANCE")

class TextSearchRequest(BaseModel):
    query: str = Field(..., description="Search query string")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[float] = 5000.0
    open_now: Optional[bool] = False
    min_rating: Optional[float] = None

class PlaceItem(BaseModel):
    id: str
    name: str
    display_name: str
    formatted_address: Optional[str] = None
    latitude: float
    longitude: float
    rating: Optional[float] = None
    user_rating_count: Optional[int] = None
    primary_type: Optional[str] = None
    types: Optional[List[str]] = None
    business_status: Optional[str] = None
    open_now: Optional[bool] = None
    price_level: Optional[str] = None
    website_uri: Optional[str] = None
    google_maps_uri: Optional[str] = None
    phone_number: Optional[str] = None
    photos: Optional[List[Dict[str, Any]]] = None
    distance_meters: Optional[float] = None

class PlacesResponse(BaseModel):
    places: List[PlaceItem]
    count: int
    source: str = "Google Places API (New)"

