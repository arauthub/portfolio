import logging
import httpx
import math
from typing import List, Optional, Dict, Any
from ..schemas.routes import ComputeRouteRequest, RouteResponse, Step, RoutePoint, RouteLeg
from ..core.config import get_google_maps_key

logger = logging.getLogger(__name__)

ROUTES_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"
ROUTES_FIELD_MASK = "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs,routes.description"

def decode_polyline(encoded: str) -> List[List[float]]:
    """Decode Google Maps encoded polyline into list of [latitude, longitude]."""
    points = []
    index = 0
    length = len(encoded)
    lat = 0
    lng = 0

    while index < length:
        # Decode latitude
        shift = 0
        result = 0
        while True:
            if index >= length:
                break
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlat = ~(result >> 1) if (result & 1) else (result >> 1)
        lat += dlat

        # Decode longitude
        shift = 0
        result = 0
        while True:
            if index >= length:
                break
            b = ord(encoded[index]) - 63
            index += 1
            result |= (b & 0x1F) << shift
            shift += 5
            if b < 0x20:
                break
        dlng = ~(result >> 1) if (result & 1) else (result >> 1)
        lng += dlng

        points.append([lat / 1e5, lng / 1e5])

    return points

def _create_mock_route(req: ComputeRouteRequest) -> RouteResponse:
    """Generate a realistic mock route between origin and destination."""
    o_lat, o_lng = req.origin.latitude, req.origin.longitude
    d_lat, d_lng = req.destination.latitude, req.destination.longitude
    
    # Calculate approximate distance
    dlat = (d_lat - o_lat) * 111000
    dlng = (d_lng - o_lng) * 111000 * math.cos(math.radians(o_lat))
    straight_dist = math.sqrt(dlat**2 + dlng**2)
    road_dist = int(straight_dist * 1.35)
    
    speed_kmh = 35.0 if req.travel_mode == "DRIVE" else (18.0 if req.travel_mode == "BICYCLE" else 4.8)
    dur_sec = int((road_dist / 1000.0) / speed_kmh * 3600)
    dur_sec = max(60, dur_sec)
    
    # Create smooth intermediate waypoints
    coords = []
    steps = []
    num_segments = 6
    for i in range(num_segments + 1):
        ratio = i / float(num_segments)
        # add subtle jitter/curve for realistic road navigation
        jitter_lat = math.sin(ratio * math.pi) * 0.0012
        jitter_lng = math.sin(ratio * math.pi * 2) * 0.0008
        pt_lat = round(o_lat + (d_lat - o_lat) * ratio + jitter_lat, 6)
        pt_lng = round(o_lng + (d_lng - o_lng) * ratio + jitter_lng, 6)
        coords.append([pt_lat, pt_lng])
        
        if i > 0:
            step_dist = road_dist // num_segments
            instructions = [
                f"Head towards Grand Avenue for {step_dist}m",
                f"Turn slightly right onto Central Expressway",
                f"Continue straight through the roundabout",
                f"Merge onto Market Boulevard",
                f"Turn left onto destination access lane",
                f"Arrive at destination on the right"
            ]
            steps.append(Step(
                instruction=instructions[(i-1) % len(instructions)],
                distance_meters=step_dist,
                duration=f"{dur_sec // num_segments}s",
                start_location=RoutePoint(latitude=coords[i-1][0], longitude=coords[i-1][1]),
                end_location=RoutePoint(latitude=pt_lat, longitude=pt_lng),
                travel_mode=req.travel_mode
            ))

    dist_km = road_dist / 1000.0
    dist_text = f"{dist_km:.1f} km" if dist_km >= 1.0 else f"{road_dist} m"
    mins = dur_sec // 60
    dur_text = f"{mins} mins" if mins > 0 else "< 1 min"

    return RouteResponse(
        distance_meters=road_dist,
        distance_text=dist_text,
        duration=f"{dur_sec}s",
        duration_text=dur_text,
        encoded_polyline="",
        polyline_coordinates=coords,
        steps=steps,
        legs=[RouteLeg(distance_meters=road_dist, duration=f"{dur_sec}s", steps=steps)],
        travel_mode=req.travel_mode,
        description="Fastest simulated route (Google Maps Routes Engine ready)"
    )

class RoutesService:
    async def compute_route(self, req: ComputeRouteRequest, api_key_override: Optional[str] = None) -> RouteResponse:
        api_key = get_google_maps_key(api_key_override)
        if not api_key:
            logger.info("No Google Maps API Key provided; returning high-fidelity mock route.")
            return _create_mock_route(req)

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": ROUTES_FIELD_MASK
        }
        
        # Build Routes API payload
        payload: Dict[str, Any] = {
            "origin": {
                "location": {
                    "latLng": {
                        "latitude": req.origin.latitude,
                        "longitude": req.origin.longitude
                    }
                }
            },
            "destination": {
                "location": {
                    "latLng": {
                        "latitude": req.destination.latitude,
                        "longitude": req.destination.longitude
                    }
                }
            },
            "travelMode": req.travel_mode,
            "routingPreference": req.routing_preference if req.travel_mode in ["DRIVE", "TWO_WHEELER"] else None,
            "computeAlternativeRoutes": req.compute_alternative_routes,
            "units": "METRIC"
        }

        # Filter None
        payload = {k: v for k, v in payload.items() if v is not None}

        if req.intermediates:
            payload["intermediates"] = [
                {"location": {"latLng": {"latitude": p.latitude, "longitude": p.longitude}}}
                for p in req.intermediates
            ]

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(ROUTES_API_URL, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    routes = data.get("routes", [])
                    if not routes:
                        return _create_mock_route(req)
                    
                    r = routes[0]
                    dist_meters = int(r.get("distanceMeters", 0))
                    duration_str = r.get("duration", "0s")
                    dur_seconds = int(duration_str.replace("s", "")) if "s" in duration_str else 0
                    
                    enc_poly = r.get("polyline", {}).get("encodedPolyline", "")
                    coords = decode_polyline(enc_poly) if enc_poly else []
                    
                    # Parse steps
                    steps_list: List[Step] = []
                    legs_list: List[RouteLeg] = []
                    for leg in r.get("legs", []):
                        leg_steps = []
                        for st in leg.get("steps", []):
                            nav = st.get("navigationInstruction", {})
                            instr = nav.get("instructions", "Proceed along route")
                            sloc = st.get("startLocation", {}).get("latLng", {})
                            eloc = st.get("endLocation", {}).get("latLng", {})
                            step_obj = Step(
                                instruction=instr,
                                distance_meters=int(st.get("distanceMeters", 0)),
                                duration=st.get("staticDuration"),
                                start_location=RoutePoint(latitude=sloc.get("latitude", 0), longitude=sloc.get("longitude", 0)),
                                end_location=RoutePoint(latitude=eloc.get("latitude", 0), longitude=eloc.get("longitude", 0)),
                                travel_mode=req.travel_mode
                            )
                            leg_steps.append(step_obj)
                            steps_list.append(step_obj)
                        
                        legs_list.append(RouteLeg(
                            distance_meters=int(leg.get("distanceMeters", dist_meters)),
                            duration=leg.get("duration", duration_str),
                            steps=leg_steps
                        ))
                    
                    dist_km = dist_meters / 1000.0
                    dist_text = f"{dist_km:.1f} km" if dist_km >= 1.0 else f"{dist_meters} m"
                    mins = dur_seconds // 60
                    dur_text = f"{mins} mins" if mins > 0 else "< 1 min"

                    return RouteResponse(
                        distance_meters=dist_meters,
                        distance_text=dist_text,
                        duration=duration_str,
                        duration_text=dur_text,
                        encoded_polyline=enc_poly,
                        polyline_coordinates=coords,
                        steps=steps_list,
                        legs=legs_list,
                        travel_mode=req.travel_mode,
                        description=r.get("description", "Google Routes API (New)")
                    )
                else:
                    logger.warning(f"Routes API returned {res.status_code}: {res.text}")
                    return _create_mock_route(req)
        except Exception as e:
            logger.exception("Error calling Routes API")
            return _create_mock_route(req)

routes_service = RoutesService()

