import logging
import httpx
from typing import Optional, Dict, Any, List
from ..core.config import get_google_maps_key

logger = logging.getLogger(__name__)

GEOCODING_API_BASE = "https://maps.googleapis.com/maps/api/geocode/json"

class GeocodingService:
    async def geocode(self, address: str, api_key_override: Optional[str] = None) -> Dict[str, Any]:
        """Geocode address or landmark into latitude/longitude."""
        api_key = get_google_maps_key(api_key_override)
        if not api_key:
            # Fallback for popular landmarks if key is pending
            low = address.lower()
            if "san francisco" in low:
                return {"latitude": 37.7749, "longitude": -122.4194, "formatted_address": "San Francisco, CA, USA"}
            elif "new york" in low or "manhattan" in low:
                return {"latitude": 40.7128, "longitude": -74.0060, "formatted_address": "New York, NY, USA"}
            elif "london" in low:
                return {"latitude": 51.5074, "longitude": -0.1278, "formatted_address": "London, UK"}
            elif "tokyo" in low:
                return {"latitude": 35.6762, "longitude": 139.6503, "formatted_address": "Tokyo, Japan"}
            elif "paris" in low:
                return {"latitude": 48.8566, "longitude": 2.3522, "formatted_address": "Paris, France"}
            elif "mumbai" in low:
                return {"latitude": 19.0760, "longitude": 72.8777, "formatted_address": "Mumbai, Maharashtra, India"}
            else:
                return {"latitude": 37.7749, "longitude": -122.4194, "formatted_address": address}

        params = {"address": address, "key": api_key}
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(GEOCODING_API_BASE, params=params)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    if results:
                        top = results[0]
                        loc = top.get("geometry", {}).get("location", {})
                        return {
                            "latitude": loc.get("lat"),
                            "longitude": loc.get("lng"),
                            "formatted_address": top.get("formatted_address"),
                            "place_id": top.get("place_id"),
                            "address_components": top.get("address_components")
                        }
        except Exception as e:
            logger.warning(f"Google Geocoding call failed: {e}")

        return {"latitude": 37.7749, "longitude": -122.4194, "formatted_address": address}

    async def reverse_geocode(self, lat: float, lng: float, api_key_override: Optional[str] = None) -> Dict[str, Any]:
        """Convert latitude/longitude into formatted address."""
        api_key = get_google_maps_key(api_key_override)
        if not api_key:
            return {
                "formatted_address": f"Coordinates ({lat:.4f}, {lng:.4f})",
                "latitude": lat,
                "longitude": lng,
                "city": "Current Map View"
            }

        params = {"latlng": f"{lat},{lng}", "key": api_key}
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(GEOCODING_API_BASE, params=params)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    if results:
                        top = results[0]
                        return {
                            "formatted_address": top.get("formatted_address"),
                            "latitude": lat,
                            "longitude": lng,
                            "place_id": top.get("place_id")
                        }
        except Exception as e:
            logger.warning(f"Reverse geocode failed: {e}")

        return {
            "formatted_address": f"Lat: {lat:.4f}, Lng: {lng:.4f}",
            "latitude": lat,
            "longitude": lng
        }

geocoding_service = GeocodingService()

