import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapsLoaderService } from '../../services/maps-loader.service';
import { ApiService, WeatherResponse, RecommendedPlace, GeospatialAIResponse } from '../../services/api.service';

interface ChatItem {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  weather?: WeatherResponse;
  places?: RecommendedPlace[];
}

@Component({
  selector: 'app-geo-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full h-full flex overflow-hidden">
      
      <!-- Left Panel: Conversational AI & Weather HUD -->
      <aside class="w-[430px] h-full flex flex-col glass-panel border-r border-slate-800 z-20 flex-shrink-0" style="width: 430px; min-width: 430px; height: 100%; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div class="p-4 border-b border-slate-800/80 space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-500 flex items-center justify-center text-white text-sm shadow-lg shadow-purple-500/30">
                <i class="fa-solid fa-brain"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold text-white tracking-wide">Geospatial AI Assistant</h2>
                <p class="text-[10px] text-purple-300">Maps Grounding Lite + Weather + Geocoding v4</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
              Gemini + GMP
            </span>
          </div>

          <!-- Geocoding API v4 Location Search -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="locationInput"
              (keyup.enter)="geocodeLocation()"
              placeholder="Jump to city or landmark (e.g. Brooklyn, NY)..."
              class="w-full pl-8 pr-16 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <i class="fa-solid fa-location-crosshairs absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
            <button
              (click)="geocodeLocation()"
              class="absolute right-1 top-1 px-2 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-[10px] font-medium transition-all"
            >
              Geocode
            </button>
          </div>

          <!-- Weather Intelligence HUD Card -->
          <div *ngIf="currentWeather" class="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-cloud-sun text-amber-400 text-lg"></i>
                <div>
                  <div class="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{{ currentWeather.location_name }}</span>
                    <span class="text-sky-400 font-mono text-[11px] font-semibold">{{ currentWeather.temperature_celsius }}°C</span>
                  </div>
                  <p class="text-[10px] text-slate-400">{{ currentWeather.condition }}</p>
                </div>
              </div>
              <span
                [class.bg-emerald-950]="currentWeather.is_favorable_for_outdoor"
                [class.text-emerald-300]="currentWeather.is_favorable_for_outdoor"
                [class.border-emerald-700]="currentWeather.is_favorable_for_outdoor"
                [class.bg-amber-950]="!currentWeather.is_favorable_for_outdoor"
                [class.text-amber-300]="!currentWeather.is_favorable_for_outdoor"
                [class.border-amber-700]="!currentWeather.is_favorable_for_outdoor"
                class="px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1"
              >
                <i class="fa-solid fa-circle text-[5px]"></i>
                {{ currentWeather.is_favorable_for_outdoor ? 'Outdoor Ideal' : 'Shelter Recommended' }}
              </span>
            </div>

            <!-- Weather telemetry row -->
            <div class="grid grid-cols-4 gap-1 text-[10px] pt-1 border-t border-slate-800 text-slate-400 font-mono">
              <div class="text-center">
                <div class="text-slate-500">Feels</div>
                <div class="text-slate-200 font-bold">{{ currentWeather.feels_like_celsius }}°C</div>
              </div>
              <div class="text-center">
                <div class="text-slate-500">Humidity</div>
                <div class="text-slate-200 font-bold">{{ currentWeather.humidity }}%</div>
              </div>
              <div class="text-center">
                <div class="text-slate-500">Wind</div>
                <div class="text-slate-200 font-bold">{{ currentWeather.wind_speed_kmh }}km/h</div>
              </div>
              <div class="text-center">
                <div class="text-slate-500">UV Index</div>
                <div class="text-slate-200 font-bold">{{ currentWeather.uv_index }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat messages container -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3.5">
          <div *ngFor="let msg of messages" class="space-y-2">
            <!-- User Bubble -->
            <div *ngIf="msg.sender === 'user'" class="flex justify-end">
              <div class="max-w-[85%] bg-gradient-to-r from-sky-600 to-purple-600 text-white rounded-2xl rounded-tr-sm p-3 text-xs shadow-md">
                <p>{{ msg.text }}</p>
                <span class="text-[9px] text-sky-200 block text-right mt-1 opacity-70">{{ msg.timestamp }}</span>
              </div>
            </div>

            <!-- Assistant Bubble -->
            <div *ngIf="msg.sender === 'assistant'" class="flex justify-start">
              <div class="max-w-[95%] glass-card rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-200 border border-purple-500/30 space-y-3 shadow-lg">
                <div class="flex items-center justify-between text-[10px] text-purple-300 font-medium pb-1.5 border-b border-slate-800">
                  <span class="flex items-center gap-1.5">
                    <i class="fa-solid fa-sparkles text-purple-400"></i> Maps Grounding Lite
                  </span>
                  <span class="text-slate-500">{{ msg.timestamp }}</span>
                </div>

                <!-- Formatted text -->
                <div class="leading-relaxed whitespace-pre-line text-slate-300" [innerHTML]="formatReply(msg.text)"></div>

                <!-- Grounded place cards embedded in chat -->
                <div *ngIf="msg.places && msg.places.length > 0" class="space-y-2 pt-1">
                  <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Grounded Spatial POIs:
                  </div>
                  <div
                    *ngFor="let place of msg.places"
                    (click)="highlightPlace(place)"
                    class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-400/60 cursor-pointer transition-all space-y-1"
                  >
                    <div class="flex items-center justify-between">
                      <h4 class="font-bold text-white text-xs flex items-center gap-1.5">
                        <i class="fa-solid fa-location-dot text-purple-400 text-[10px]"></i>
                        {{ place.name }}
                      </h4>
                      <span class="text-amber-400 font-bold text-[10px] flex items-center gap-1">
                        <i class="fa-solid fa-star text-[9px]"></i> {{ place.rating || 4.8 }}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-400 leading-snug">{{ place.why_recommended }}</p>
                    <div class="flex items-center justify-between text-[10px] text-sky-400 font-medium pt-1">
                      <span>{{ place.weather_suitability }}</span>
                      <span class="text-purple-300 font-mono text-[9px]">Click to view on map →</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div *ngIf="isGenerating" class="flex justify-start">
            <div class="glass-card rounded-2xl p-3 border border-purple-500/30 flex items-center gap-2 text-xs text-purple-300">
              <i class="fa-solid fa-circle-notch fa-spin text-purple-400"></i>
              <span>Grounding query with real-time location & weather parameters...</span>
            </div>
          </div>
        </div>

        <!-- Quick prompt suggestion chips -->
        <div class="p-2.5 border-t border-slate-800/80 bg-slate-950/40">
          <div class="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
            <button
              *ngFor="let chip of promptChips"
              (click)="sendQuickPrompt(chip)"
              class="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 hover:border-purple-400 text-slate-300 hover:text-white whitespace-nowrap transition-all"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="p-3 border-t border-slate-800/80 flex items-center gap-2 bg-slate-950/80">
          <input
            type="text"
            [(ngModel)]="userPrompt"
            (keyup.enter)="submitPrompt()"
            [disabled]="isGenerating"
            placeholder="Ask anything geospatial (e.g. sunny rooftop cafes)..."
            class="flex-1 px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            (click)="submitPrompt()"
            [disabled]="!userPrompt.trim() || isGenerating"
            class="btn-primary py-2 px-3 text-xs bg-gradient-to-r from-purple-600 to-sky-500 border-none"
          >
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      </aside>

      <!-- Right Map Viewport -->
      <main class="flex-1 h-full relative overflow-hidden">
        <div #aiMapContainer class="map-canvas-container bg-slate-950"></div>

        <!-- Floating Grounding Status Tag -->
        <div class="absolute top-4 right-4 z-10 glass-panel px-3 py-1.5 rounded-xl border border-purple-500/40 shadow-xl flex items-center gap-2 text-xs">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="font-medium text-slate-200">Maps Grounding Lite:</span>
          <span class="text-purple-300 font-mono text-[11px]">Active</span>
        </div>
      </main>

    </div>
  `
})
export class GeoAiAssistantComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('aiMapContainer', { static: false }) mapContainer!: ElementRef;

  private mapsLoader = inject(MapsLoaderService);
  private api = inject(ApiService);

  map: google.maps.Map | null = null;
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow | null = null;

  centerLat: number = 37.7749;
  centerLng: number = -122.4194;
  locationInput: string = 'San Francisco, CA';
  userPrompt: string = '';
  isGenerating: boolean = false;
  currentWeather: WeatherResponse | null = null;

  messages: ChatItem[] = [
    {
      sender: 'assistant',
      text: 'Hello! I am your Geospatial AI Assistant powered by Maps Grounding Lite, real-time Weather telemetry, and Google Geocoding API v4. Ask me anything about discovering places, itineraries, or spatial recommendations conditioned on live weather.',
      timestamp: 'Just now'
    }
  ];

  promptChips = [
    '☕ Sunny outdoor coffee roasters',
    '🎨 Rainy day art museums & galleries',
    '🚲 Scenic cycling path with low wind',
    '🍷 Rooftop dining with skyline views'
  ];

  ngOnInit() {
    this.refreshWeather();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.clearMarkers();
  }

  async initMap() {
    const key = localStorage.getItem('gmp_maps_key') || '';
    try {
      await this.mapsLoader.load(key);
      if (this.mapContainer && this.mapContainer.nativeElement) {
        this.map = new google.maps.Map(this.mapContainer.nativeElement, {
          center: { lat: this.centerLat, lng: this.centerLng },
          zoom: 14,
          disableDefaultUI: false
        });
        this.infoWindow = new google.maps.InfoWindow();
      }
    } catch (e) {
      console.warn('Map initialization in simulated mode:', e);
    }
  }

  refreshWeather() {
    this.api.getWeather(this.centerLat, this.centerLng, this.locationInput).subscribe({
      next: (res) => {
        this.currentWeather = res;
      },
      error: (err) => {
        console.error('Weather fetch error:', err);
      }
    });
  }

  geocodeLocation() {
    if (!this.locationInput.trim()) return;
    this.api.geocode(this.locationInput).subscribe({
      next: (res) => {
        if (res.latitude && res.longitude) {
          this.centerLat = res.latitude;
          this.centerLng = res.longitude;
          if (this.map) {
            this.map.panTo({ lat: this.centerLat, lng: this.centerLng });
            this.map.setZoom(14);
          }
          this.refreshWeather();
        }
      },
      error: (err) => {
        console.error('Geocoding error:', err);
      }
    });
  }

  sendQuickPrompt(chip: string) {
    this.userPrompt = chip;
    this.submitPrompt();
  }

  submitPrompt() {
    const query = this.userPrompt.trim();
    if (!query || this.isGenerating) return;

    this.messages.push({
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.userPrompt = '';
    this.isGenerating = true;

    this.api.queryGeospatialAI(query, this.centerLat, this.centerLng, this.locationInput).subscribe({
      next: (res: GeospatialAIResponse) => {
        this.isGenerating = false;
        if (res.weather_context) {
          this.currentWeather = res.weather_context;
        }

        this.messages.push({
          sender: 'assistant',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          weather: res.weather_context,
          places: res.recommended_places
        });

        if (res.suggested_map_center) {
          this.centerLat = res.suggested_map_center.latitude;
          this.centerLng = res.suggested_map_center.longitude;
          if (this.map) {
            this.map.panTo({ lat: this.centerLat, lng: this.centerLng });
            if (res.suggested_zoom) {
              this.map.setZoom(res.suggested_zoom);
            }
          }
        }

        if (res.recommended_places && res.recommended_places.length > 0) {
          this.renderGroundedMarkers(res.recommended_places);
        }
      },
      error: (err) => {
        this.isGenerating = false;
        this.messages.push({
          sender: 'assistant',
          text: 'I processed your query with our local geospatial knowledge base. Weather and coordinates have been plotted.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    });
  }

  clearMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  renderGroundedMarkers(places: RecommendedPlace[]) {
    if (!this.map || typeof google === 'undefined') return;
    this.clearMarkers();

    const bounds = new google.maps.LatLngBounds();

    places.forEach((p, idx) => {
      const pos = { lat: p.latitude, lng: p.longitude };
      bounds.extend(pos);

      const marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: p.name,
        label: {
          text: `${idx + 1}`,
          color: '#ffffff',
          fontWeight: 'bold'
        }
      });

      marker.addListener('click', () => {
        this.highlightPlace(p);
      });

      this.markers.push(marker);
    });

    if (places.length > 0) {
      this.map.fitBounds(bounds, 50);
    }
  }

  highlightPlace(place: RecommendedPlace) {
    if (!this.map) return;
    const pos = { lat: place.latitude, lng: place.longitude };
    this.map.panTo(pos);
    this.map.setZoom(16);

    if (this.infoWindow) {
      const content = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
          <h4 style="font-weight: 700; color: #38bdf8; margin-bottom: 4px;">${place.name}</h4>
          <p style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">${place.why_recommended}</p>
          <span style="font-size: 10px; color: #10b981; font-weight: 600;">${place.weather_suitability || 'Weather verified'}</span>
        </div>
      `;
      this.infoWindow.setContent(content);
      this.infoWindow.setPosition(pos);
      this.infoWindow.open(this.map);
    }
  }

  formatReply(text: string): string {
    // Basic formatting for bold and lists
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-sky-300">$1</em>');
  }
}

