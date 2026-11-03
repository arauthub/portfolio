import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SystemStatus {
  google_maps_key_set: boolean;
  gemini_key_set: boolean;
  openweather_key_set: boolean;
  gcp_project_id: string;
  version: string;
  status: string;
}

export interface PlaceItem {
  id: string;
  name: string;
  display_name: string;
  formatted_address?: string;
  latitude: float;
  longitude: float;
  rating?: number;
  user_rating_count?: number;
  primary_type?: string;
  types?: string[];
  business_status?: string;
  open_now?: boolean;
  price_level?: string;
  website_uri?: string;
  google_maps_uri?: string;
  phone_number?: string;
}

type float = number;

export interface PlacesResponse {
  places: PlaceItem[];
  count: number;
  source: string;
}

export interface RouteStep {
  instruction: string;
  distance_meters?: number;
  duration?: string;
  start_location: { latitude: number; longitude: number };
  end_location: { latitude: number; longitude: number };
  travel_mode?: string;
}

export interface RouteResponse {
  distance_meters: number;
  distance_text: string;
  duration: string;
  duration_text: string;
  encoded_polyline: string;
  polyline_coordinates: number[][]; // [[lat, lng], ...]
  steps: RouteStep[];
  travel_mode: string;
  description?: string;
}

export interface WeatherResponse {
  temperature_celsius: number;
  feels_like_celsius: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  wind_speed_kmh: number;
  uv_index: number;
  air_quality_index: number;
  air_quality_label: string;
  precipitation_chance: number;
  location_name: string;
  latitude: number;
  longitude: number;
  is_favorable_for_outdoor: boolean;
}

export interface RecommendedPlace {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  category?: string;
  why_recommended: string;
  weather_suitability?: string;
}

export interface GeospatialAIResponse {
  reply: string;
  recommended_places: RecommendedPlace[];
  weather_context?: WeatherResponse;
  detected_intent?: string;
  suggested_map_center?: { latitude: number; longitude: number };
  suggested_zoom?: number;
  grounding_sources: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Default to localhost:8000 in dev, or relative in production
  private baseUrl = window.location.port === '4200' ? 'http://localhost:8000/api/v1' : '/api/v1';

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const mapsKey = localStorage.getItem('gmp_maps_key') || '';
    const geminiKey = localStorage.getItem('gmp_gemini_key') || '';
    if (mapsKey) headers = headers.set('X-Google-Maps-Key', mapsKey);
    if (geminiKey) headers = headers.set('X-Gemini-Key', geminiKey);
    return headers;
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<SystemStatus>(`${this.baseUrl}/system/status`, { headers: this.getHeaders() });
  }

  updateRuntimeKeys(mapsKey?: string, geminiKey?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/system/keys`, {
      google_maps_api_key: mapsKey,
      gemini_api_key: geminiKey
    }, { headers: this.getHeaders() });
  }

  searchNearbyPlaces(lat: number, lng: number, radius: number = 2500, types?: string[]): Observable<PlacesResponse> {
    return this.http.post<PlacesResponse>(`${this.baseUrl}/places/nearby`, {
      latitude: lat,
      longitude: lng,
      radius: radius,
      included_types: types && types.length > 0 ? types : undefined,
      max_result_count: 15
    }, { headers: this.getHeaders() });
  }

  searchPlacesByText(query: string, lat?: number, lng?: number, radius?: number): Observable<PlacesResponse> {
    return this.http.post<PlacesResponse>(`${this.baseUrl}/places/search`, {
      query,
      latitude: lat,
      longitude: lng,
      radius
    }, { headers: this.getHeaders() });
  }

  computeRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    travelMode: string = 'DRIVE',
    intermediates?: { latitude: number; longitude: number }[]
  ): Observable<RouteResponse> {
    return this.http.post<RouteResponse>(`${this.baseUrl}/routes/compute`, {
      origin,
      destination,
      travel_mode: travelMode,
      intermediates
    }, { headers: this.getHeaders() });
  }

  getWeather(latitude: number, longitude: number, locationName?: string): Observable<WeatherResponse> {
    return this.http.post<WeatherResponse>(`${this.baseUrl}/weather/current`, {
      latitude,
      longitude,
      location_name: locationName
    }, { headers: this.getHeaders() });
  }

  geocode(address: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/geocoding/forward`, {
      params: { address },
      headers: this.getHeaders()
    });
  }

  reverseGeocode(latitude: number, longitude: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/geocoding/reverse`, {
      params: { latitude: latitude.toString(), longitude: longitude.toString() },
      headers: this.getHeaders()
    });
  }

  queryGeospatialAI(prompt: string, userLat?: number, userLng?: number, locationName?: string): Observable<GeospatialAIResponse> {
    return this.http.post<GeospatialAIResponse>(`${this.baseUrl}/ai/assistant`, {
      prompt,
      user_latitude: userLat,
      user_longitude: userLng,
      location_name: locationName,
      include_weather: true
    }, { headers: this.getHeaders() });
  }
}

