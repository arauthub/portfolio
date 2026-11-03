from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class WeatherRequest(BaseModel):
    latitude: float
    longitude: float
    location_name: Optional[str] = None

class WeatherResponse(BaseModel):
    temperature_celsius: float
    feels_like_celsius: float
    condition: str
    description: str
    icon: str
    humidity: int
    wind_speed_kmh: float
    uv_index: Optional[float] = 4.5
    air_quality_index: Optional[int] = 35
    air_quality_label: Optional[str] = "Good"
    precipitation_chance: Optional[int] = 10
    location_name: Optional[str] = None
    latitude: float
    longitude: float
    is_favorable_for_outdoor: bool = True

