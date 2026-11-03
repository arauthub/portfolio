import logging
import httpx
from typing import List, Optional, Dict, Any
from ..schemas.places import NearbySearchRequest, TextSearchRequest, PlaceItem, PlacesResponse
from ..core.config import get_google_maps_key

logger = logging.getLogger(__name__)

PLACES_API_BASE = "https://places.googleapis.com/v1"
FIELD_MASK = "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.primaryType,places.types,places.businessStatus,places.currentOpeningHours,places.priceLevel,places.websiteUri,places.googleMapsUri,places.nationalPhoneNumber"

def _mock_places_around(lat: float, lng: float, query: str = "") -> List[PlaceItem]:
    """Provide realistic high-fidelity fallback places around given coordinates."""
    templates = [
        {"name": "Artisan Roastery & Espresso Lab", "type": "cafe", "offset": (0.003, 0.002), "rating": 4.8, "count": 342, "price": "PRICE_LEVEL_MODERATE", "open": True},
        {"name": "Greenhouse Botanical Bistro", "type": "restaurant", "offset": (-0.002, 0.004), "rating": 4.9, "count": 612, "price": "PRICE_LEVEL_EXPENSIVE", "open": True},
        {"name": "Urban Harvest Organic Market", "type": "supermarket", "offset": (0.004, -0.003), "rating": 4.6, "count": 189, "price": "PRICE_LEVEL_MODERATE", "open": True},
        {"name": "Skyline Rooftop Lounge & Tapas", "type": "bar", "offset": (-0.004, -0.002), "rating": 4.7, "count": 520, "price": "PRICE_LEVEL_EXPENSIVE", "open": False},
        {"name": "The Grand Heritage Flagship Store", "type": "department_store", "offset": (0.001, 0.005), "rating": 4.5, "count": 890, "price": "PRICE_LEVEL_MODERATE", "open": True},
        {"name": "Velocipede Cycle Co. & Workshop", "type": "bicycle_store", "offset": (-0.003, -0.005), "rating": 4.9, "count": 140, "price": "PRICE_LEVEL_MODERATE", "open": True},
        {"name": "Serenade Tea Atelier", "type": "cafe", "offset": (0.005, 0.001), "rating": 4.8, "count": 275, "price": "PRICE_LEVEL_MODERATE", "open": True},
        {"name": "L'Avant-Garde Bookstore & Vinyl", "type": "book_store", "offset": (-0.001, -0.004), "rating": 4.7, "count": 430, "price": "PRICE_LEVEL_INEXPENSIVE", "open": True},
    ]
    
    results = []
    for idx, t in enumerate(templates):
        plat = round(lat + t["offset"][0], 6)
        plng = round(lng + t["offset"][1], 6)
        results.append(PlaceItem(
            id=f"demo_place_{idx+1}",
            name=f"places/demo_{idx+1}",
            display_name=f"{t['name']}",
            formatted_address=f"{idx*12 + 101} Downtown Blvd, District {idx+1}",
            latitude=plat,
            longitude=plng,
            rating=t["rating"],
            user_rating_count=t["count"],
            primary_type=t["type"],
            types=[t["type"], "point_of_interest", "establishment"],
            business_status="OPERATIONAL",
            open_now=t["open"],
            price_level=t["price"],
            website_uri="https://developers.google.com/maps",
            google_maps_uri=f"https://www.google.com/maps/search/?api=1&query={plat},{plng}",
            phone_number="+1 (555) 019-2834"
        ))
    return results

class PlacesService:
    async def search_nearby(self, req: NearbySearchRequest, api_key_override: Optional[str] = None) -> PlacesResponse:
        api_key = get_google_maps_key(api_key_override)
        if not api_key:
            logger.info("No Google Maps API Key provided; returning curated demo POIs.")
            places = _mock_places_around(req.latitude, req.longitude)
            return PlacesResponse(places=places, count=len(places), source="Google Maps Demo (Awaiting Key)")
        
        url = f"{PLACES_API_BASE}/places:searchNearby"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK
        }
        body: Dict[str, Any] = {
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": req.latitude,
                        "longitude": req.longitude
                    },
                    "radius": float(req.radius)
                }
            },
            "maxResultCount": req.max_result_count,
            "rankPreference": req.rank_preference
        }
        if req.included_types and len(req.included_types) > 0:
            body["includedTypes"] = req.included_types

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=body, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    raw_places = data.get("places", [])
                    places = []
                    for p in raw_places:
                        loc = p.get("location", {})
                        d_name = p.get("displayName", {}).get("text", "Unknown Place")
                        opening = p.get("currentOpeningHours", {}).get("openNow")
                        places.append(PlaceItem(
                            id=p.get("id", ""),
                            name=p.get("name", ""),
                            display_name=d_name,
                            formatted_address=p.get("formattedAddress"),
                            latitude=loc.get("latitude", req.latitude),
                            longitude=loc.get("longitude", req.longitude),
                            rating=p.get("rating"),
                            user_rating_count=p.get("userRatingCount"),
                            primary_type=p.get("primaryType"),
                            types=p.get("types", []),
                            business_status=p.get("businessStatus"),
                            open_now=opening,
                            price_level=p.get("priceLevel"),
                            website_uri=p.get("websiteUri"),
                            google_maps_uri=p.get("googleMapsUri"),
                            phone_number=p.get("nationalPhoneNumber")
                        ))
                    return PlacesResponse(places=places, count=len(places), source="Places API (New)")
                else:
                    logger.warning(f"Places API returned status {res.status_code}: {res.text}")
                    places = _mock_places_around(req.latitude, req.longitude)
                    return PlacesResponse(places=places, count=len(places), source=f"Fallback Demo (API Status: {res.status_code})")
        except Exception as e:
            logger.exception("Error calling Places API (New)")
            places = _mock_places_around(req.latitude, req.longitude)
            return PlacesResponse(places=places, count=len(places), source=f"Fallback Demo (Error: {str(e)})")

    async def search_text(self, req: TextSearchRequest, api_key_override: Optional[str] = None) -> PlacesResponse:
        api_key = get_google_maps_key(api_key_override)
        lat = req.latitude or 37.7749
        lng = req.longitude or -122.4194
        
        if not api_key:
            places = _mock_places_around(lat, lng, req.query)
            return PlacesResponse(places=places, count=len(places), source="Google Maps Demo (Awaiting Key)")

        url = f"{PLACES_API_BASE}/places:searchText"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK
        }
        body: Dict[str, Any] = {
            "textQuery": req.query,
            "maxResultCount": 15
        }
        if req.latitude is not None and req.longitude is not None:
            body["locationBias"] = {
                "circle": {
                    "center": {"latitude": req.latitude, "longitude": req.longitude},
                    "radius": float(req.radius or 5000.0)
                }
            }
        if req.open_now:
            body["openNow"] = True
        if req.min_rating:
            body["minRating"] = req.min_rating

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=body, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    raw_places = data.get("places", [])
                    places = []
                    for p in raw_places:
                        loc = p.get("location", {})
                        d_name = p.get("displayName", {}).get("text", "Unknown Place")
                        opening = p.get("currentOpeningHours", {}).get("openNow")
                        places.append(PlaceItem(
                            id=p.get("id", ""),
                            name=p.get("name", ""),
                            display_name=d_name,
                            formatted_address=p.get("formattedAddress"),
                            latitude=loc.get("latitude", lat),
                            longitude=loc.get("longitude", lng),
                            rating=p.get("rating"),
                            user_rating_count=p.get("userRatingCount"),
                            primary_type=p.get("primaryType"),
                            types=p.get("types", []),
                            business_status=p.get("businessStatus"),
                            open_now=opening,
                            price_level=p.get("priceLevel"),
                            website_uri=p.get("websiteUri"),
                            google_maps_uri=p.get("googleMapsUri"),
                            phone_number=p.get("nationalPhoneNumber")
                        ))
                    return PlacesResponse(places=places, count=len(places), source="Places API (New) Text Search")
                else:
                    logger.warning(f"Places API Text Search returned {res.status_code}: {res.text}")
                    places = _mock_places_around(lat, lng, req.query)
                    return PlacesResponse(places=places, count=len(places), source=f"Fallback Demo ({res.status_code})")
        except Exception as e:
            logger.exception("Error calling Places Text Search")
            places = _mock_places_around(lat, lng, req.query)
            return PlacesResponse(places=places, count=len(places), source=f"Fallback Demo ({str(e)})")

places_service = PlacesService()

