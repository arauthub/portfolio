from fastapi import APIRouter
from ..schemas.weather import WeatherRequest, WeatherResponse
from ..services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather Intelligence"])

@router.post("/current", response_model=WeatherResponse)
async def get_current_weather(req: WeatherRequest):
    """Retrieve real-time atmospheric & weather metrics for given coordinates."""
    return await weather_service.get_weather(req)

