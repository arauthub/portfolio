from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from .places import PlaceItem
from .weather import WeatherResponse

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant' or 'model'")
    content: str

class GeospatialAIRequest(BaseModel):
    prompt: str = Field(..., description="User's query (e.g. 'Find cafes with outdoor seating in sunny weather nearby')")
    user_latitude: Optional[float] = None
    user_longitude: Optional[float] = None
    location_name: Optional[str] = "Current Map Center"
    search_radius_meters: Optional[int] = 5000
    include_weather: bool = True
    history: Optional[List[ChatMessage]] = []

class RecommendedPlace(BaseModel):
    id: Optional[str] = None
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    rating: Optional[float] = None
    category: Optional[str] = None
    why_recommended: str
    weather_suitability: Optional[str] = None

class GeospatialAIResponse(BaseModel):
    reply: str
    recommended_places: List[RecommendedPlace] = []
    weather_context: Optional[WeatherResponse] = None
    detected_intent: Optional[str] = None
    suggested_map_center: Optional[Dict[str, float]] = None
    suggested_zoom: Optional[int] = 14
    grounding_sources: List[str] = ["Google Maps Platform", "Geocoding API v4", "Weather Intelligence"]

