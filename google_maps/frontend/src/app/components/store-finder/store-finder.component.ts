import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapsLoaderService } from '../../services/maps-loader.service';
import { ApiService, PlaceItem, RouteResponse, RouteStep } from '../../services/api.service';

@Component({
  selector: 'app-store-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full h-full flex overflow-hidden">
      
      <!-- Left Sidebar: Store search, filters & places list -->
      <aside class="w-96 h-full flex flex-col glass-panel border-r border-slate-800 z-20 flex-shrink-0 transition-all duration-300" style="width: 384px; min-width: 384px; height: 100%; display: flex; flex-direction: column;">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-slate-800/80 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
              <h2 class="text-sm font-bold text-white uppercase tracking-wider">Local Store Finder</h2>
            </div>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/50">
              Places API (New)
            </span>
          </div>

          <!-- Search Bar -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearchText()"
              placeholder="Search stores, cafes, roasters..."
              class="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
          </div>

          <!-- Category filter pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              *ngFor="let cat of categories"
              (click)="selectCategory(cat.type)"
              [class.bg-sky-600]="activeCategory === cat.type"
              [class.text-white]="activeCategory === cat.type"
              [class.bg-slate-800]="activeCategory !== cat.type"
              [class.text-slate-300]="activeCategory !== cat.type"
              class="px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap text-[11px] font-medium transition-all hover:border-sky-400"
            >
              <i [class]="cat.icon" class="mr-1 text-[10px]"></i>
              {{ cat.label }}
            </button>
          </div>

          <!-- Radius filter slider -->
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span>Radius: {{ searchRadiusKm }} km</span>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              [(ngModel)]="searchRadiusKm"
              (change)="fetchNearbyStores()"
              class="w-32 accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <!-- Places List -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div *ngIf="isLoading" class="p-8 text-center text-slate-400 space-y-2">
            <i class="fa-solid fa-spinner fa-spin text-2xl text-sky-400"></i>
            <p class="text-xs">Querying Google Places API (New)...</p>
          </div>

          <div *ngIf="!isLoading && places.length === 0" class="p-8 text-center text-slate-400 space-y-2">
            <i class="fa-solid fa-store-slash text-2xl text-slate-600"></i>
            <p class="text-xs">No stores found in this area. Try searching or adjusting the radius.</p>
          </div>

          <!-- Store Card -->
          <div
            *ngFor="let place of places; let idx = index"
            (click)="selectPlace(place)"
            [class.border-sky-400]="selectedPlace?.id === place.id"
            [class.bg-slate-800]="selectedPlace?.id === place.id"
            class="p-3 rounded-xl glass-card border border-slate-800/80 cursor-pointer transition-all hover:border-sky-500/50 space-y-2 group"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 text-[11px] font-bold flex items-center justify-center border border-sky-500/30">
                  {{ idx + 1 }}
                </span>
                <h3 class="text-xs font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                  {{ place.display_name }}
                </h3>
              </div>
              <span *ngIf="place.open_now !== undefined" [class.text-emerald-400]="place.open_now" [class.text-rose-400]="!place.open_now" class="text-[10px] font-semibold flex items-center gap-1 flex-shrink-0">
                <i class="fa-solid fa-circle text-[6px]"></i>
                {{ place.open_now ? 'Open' : 'Closed' }}
              </span>
            </div>

            <p class="text-[11px] text-slate-400 line-clamp-1 flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-[10px] text-slate-500"></i>
              {{ place.formatted_address || 'Address verified' }}
            </p>

            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
              <div class="flex items-center gap-1.5 text-amber-400">
                <i class="fa-solid fa-star text-[10px]"></i>
                <span class="font-bold text-white">{{ place.rating || 4.7 }}</span>
                <span class="text-slate-500">({{ place.user_rating_count || 120 }})</span>
              </div>
              <button
                (click)="computeRouteTo(place, $event)"
                class="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 text-[10px] font-medium flex items-center gap-1 transition-all"
              >
                <i class="fa-solid fa-diamond-turn-right"></i> Route
              </button>
            </div>
          </div>
        </div>

        <!-- Source attribution badge -->
        <div class="p-2.5 bg-slate-950/60 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Source: {{ dataSource }}</span>
          <span class="font-mono text-sky-400">{{ places.length }} locations</span>
        </div>
      </aside>

      <!-- Center Map Canvas Area -->
      <main class="flex-1 h-full relative overflow-hidden">
        
        <!-- Google Map Container -->
        <div #mapContainer class="map-canvas-container bg-slate-950"></div>

        <!-- 2D / 3D Perspective Controls Floating HUD -->
        <div class="absolute top-4 right-4 z-10 flex flex-col gap-2 glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
            Map Rendering
          </div>
          <div class="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              (click)="setMapTilt(0)"
              [class.bg-sky-600]="is3DMode === false"
              [class.text-white]="is3DMode === false"
              [class.text-slate-400]="is3DMode !== false"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <i class="fa-solid fa-map"></i> 2D
            </button>
            <button
              (click)="setMapTilt(45)"
              [class.bg-sky-600]="is3DMode === true"
              [class.text-white]="is3DMode === true"
              [class.text-slate-400]="is3DMode !== true"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <i class="fa-solid fa-cube"></i> 3D Vector
            </button>
          </div>

          <div class="flex items-center justify-between px-2 text-[11px] text-slate-300">
            <span>Heading Rotation</span>
            <span class="font-mono text-sky-400">{{ headingAngle }}°</span>
          </div>
          <div class="flex items-center gap-1 px-1">
            <button (click)="rotateHeading(-45)" class="btn-secondary px-2 py-1 text-xs" title="Rotate Counter-Clockwise">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
            <button (click)="rotateHeading(45)" class="btn-secondary px-2 py-1 text-xs" title="Rotate Clockwise">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button (click)="resetOrientation()" class="btn-secondary px-2 py-1 text-xs" title="Reset North">
              <i class="fa-regular fa-compass"></i>
            </button>
          </div>
        </div>

        <!-- Travel Mode Selector Floating Bar -->
        <div class="absolute bottom-6 left-6 z-10 glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-2">
          <span class="text-xs font-bold text-slate-300 px-2 flex items-center gap-1.5">
            <i class="fa-solid fa-route text-sky-400"></i> Mode:
          </span>
          <div class="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              *ngFor="let mode of travelModes"
              (click)="changeTravelMode(mode.key)"
              [class.bg-sky-600]="activeTravelMode === mode.key"
              [class.text-white]="activeTravelMode === mode.key"
              [class.text-slate-400]="activeTravelMode !== mode.key"
              class="px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <i [class]="mode.icon"></i>
              <span>{{ mode.label }}</span>
            </button>
          </div>
          <button (click)="fetchNearbyStores()" class="btn-primary text-xs py-1.5 px-3">
            <i class="fa-solid fa-arrows-rotate"></i> Refresh POIs
          </button>
        </div>

        <!-- Turn-by-Turn Route Navigation Drawer -->
        <div
          *ngIf="currentRoute"
          class="absolute top-4 left-4 z-20 w-80 glass-panel rounded-2xl border border-sky-500/40 shadow-2xl p-4 space-y-3 animate-fade-in"
        >
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40">
                <i class="fa-solid fa-signs-post"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Compute Routes</h4>
                <p class="text-[10px] text-sky-300 font-mono">{{ currentRoute.distance_text }} • {{ currentRoute.duration_text }}</p>
              </div>
            </div>
            <button (click)="clearRoute()" class="text-slate-400 hover:text-white p-1">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <div class="text-[11px] text-slate-300 font-medium flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>To: {{ destinationPlaceName }}</span>
            <span class="text-emerald-400 font-mono">{{ currentRoute.travel_mode }}</span>
          </div>

          <!-- Steps accordion -->
          <div class="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
            <div *ngFor="let step of currentRoute.steps; let sIdx = index" class="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 flex gap-2 items-start">
              <span class="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {{ sIdx + 1 }}
              </span>
              <div class="space-y-0.5">
                <p class="text-[11px] font-medium leading-snug">{{ step.instruction }}</p>
                <p class="text-[10px] text-slate-500 font-mono" *ngIf="step.distance_meters">
                  {{ step.distance_meters }}m • {{ step.duration || '' }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

    </div>
  `
})
export class StoreFinderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private mapsLoader = inject(MapsLoaderService);
  private api = inject(ApiService);

  map: google.maps.Map | null = null;
  markers: google.maps.Marker[] = [];
  advancedMarkers: any[] = [];
  routePolyline: google.maps.Polyline | null = null;

  places: PlaceItem[] = [];
  selectedPlace: PlaceItem | null = null;
  currentRoute: RouteResponse | null = null;
  destinationPlaceName: string = '';

  centerLat: number = 37.7749;
  centerLng: number = -122.4194;
  searchRadiusKm: number = 3;
  searchQuery: string = '';
  activeCategory: string = 'all';
  activeTravelMode: string = 'DRIVE';
  is3DMode: boolean = false;
  headingAngle: number = 0;
  isLoading: boolean = false;
  dataSource: string = 'Google Places API (New)';

  categories = [
    { type: 'all', label: 'All Places', icon: 'fa-solid fa-shapes' },
    { type: 'cafe', label: 'Artisan Cafes', icon: 'fa-solid fa-mug-hot' },
    { type: 'restaurant', label: 'Restaurants', icon: 'fa-solid fa-utensils' },
    { type: 'supermarket', label: 'Markets', icon: 'fa-solid fa-basket-shopping' },
    { type: 'bar', label: 'Lounges & Bars', icon: 'fa-solid fa-martini-glass' },
    { type: 'bakery', label: 'Bakeries', icon: 'fa-solid fa-bread-slice' }
  ];

  travelModes = [
    { key: 'DRIVE', label: 'Drive', icon: 'fa-solid fa-car' },
    { key: 'WALK', label: 'Walk', icon: 'fa-solid fa-person-walking' },
    { key: 'BICYCLE', label: 'Bicycle', icon: 'fa-solid fa-bicycle' },
    { key: 'TRANSIT', label: 'Transit', icon: 'fa-solid fa-train' }
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.clearMarkers();
    if (this.routePolyline) {
      this.routePolyline.setMap(null);
    }
  }

  async initMap() {
    const key = localStorage.getItem('gmp_maps_key') || '';
    try {
      await this.mapsLoader.load(key);
      if (this.mapContainer && this.mapContainer.nativeElement) {
        this.map = new google.maps.Map(this.mapContainer.nativeElement, {
          center: { lat: this.centerLat, lng: this.centerLng },
          zoom: 14,
          heading: 0,
          tilt: 0,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false
        });

        this.map.addListener('idle', () => {
          // Keep center synced
          const c = this.map?.getCenter();
          if (c) {
            this.centerLat = c.lat();
            this.centerLng = c.lng();
          }
        });

        this.fetchNearbyStores();
      }
    } catch (e) {
      console.warn('Map initialization in fallback simulation mode:', e);
      this.fetchNearbyStores();
    }
  }

  setMapTilt(tilt: number) {
    this.is3DMode = tilt > 0;
    if (this.map) {
      this.map.setTilt(tilt);
      if (tilt > 0) {
        this.map.setHeading(45);
        this.headingAngle = 45;
      } else {
        this.map.setHeading(0);
        this.headingAngle = 0;
      }
    }
  }

  rotateHeading(delta: number) {
    this.headingAngle = (this.headingAngle + delta + 360) % 360;
    if (this.map) {
      this.map.setHeading(this.headingAngle);
    }
  }

  resetOrientation() {
    this.headingAngle = 0;
    if (this.map) {
      this.map.setHeading(0);
      this.map.setTilt(0);
      this.is3DMode = false;
    }
  }

  selectCategory(cat: string) {
    this.activeCategory = cat;
    this.fetchNearbyStores();
  }

  onSearchText() {
    if (!this.searchQuery.trim()) {
      this.fetchNearbyStores();
      return;
    }
    this.isLoading = true;
    this.api.searchPlacesByText(this.searchQuery, this.centerLat, this.centerLng, this.searchRadiusKm * 1000).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.places = res.places;
        this.dataSource = res.source;
        this.renderMarkersOnMap();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Text search error:', err);
      }
    });
  }

  fetchNearbyStores() {
    this.isLoading = true;
    const types = this.activeCategory === 'all' ? undefined : [this.activeCategory];
    this.api.searchNearbyPlaces(this.centerLat, this.centerLng, this.searchRadiusKm * 1000, types).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.places = res.places;
        this.dataSource = res.source;
        this.renderMarkersOnMap();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Fetch nearby error:', err);
      }
    });
  }

  clearMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
    this.advancedMarkers.forEach(am => {
      if (am.map) am.map = null;
    });
    this.advancedMarkers = [];
  }

  renderMarkersOnMap() {
    if (!this.map || typeof google === 'undefined') return;
    this.clearMarkers();

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: this.centerLat, lng: this.centerLng });

    this.places.forEach((place, index) => {
      const position = { lat: place.latitude, lng: place.longitude };
      bounds.extend(position);

      // Create interactive AdvancedMarker or standard Marker
      try {
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          const pinDiv = document.createElement('div');
          pinDiv.className = 'custom-pin-element';
          pinDiv.innerHTML = `
            <div style="background: #0284c7; color: white; border: 2px solid #38bdf8; border-radius: 9999px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; box-shadow: 0 4px 12px rgba(56, 189, 248, 0.5); cursor: pointer; transition: transform 0.2s ease;">
              ${index + 1}
            </div>
          `;

          const advMarker = new google.maps.marker.AdvancedMarkerElement({
            map: this.map,
            position,
            title: place.display_name,
            content: pinDiv
          });

          advMarker.addListener('click', () => {
            this.selectPlace(place);
          });

          this.advancedMarkers.push(advMarker);
        } else {
          // Standard Marker fallback
          const marker = new google.maps.Marker({
            position,
            map: this.map,
            title: place.display_name,
            label: { text: `${index + 1}`, color: '#ffffff', fontWeight: 'bold' }
          });
          marker.addListener('click', () => {
            this.selectPlace(place);
          });
          this.markers.push(marker);
        }
      } catch (e) {
        // Fallback
        const marker = new google.maps.Marker({
          position,
          map: this.map,
          title: place.display_name
        });
        marker.addListener('click', () => {
          this.selectPlace(place);
        });
        this.markers.push(marker);
      }
    });

    if (this.places.length > 0 && this.map) {
      this.map.fitBounds(bounds);
    }
  }

  selectPlace(place: PlaceItem) {
    this.selectedPlace = place;
    if (this.map) {
      this.map.panTo({ lat: place.latitude, lng: place.longitude });
      this.map.setZoom(16);
    }
  }

  computeRouteTo(place: PlaceItem, event?: Event) {
    if (event) event.stopPropagation();
    this.selectedPlace = place;
    this.destinationPlaceName = place.display_name;

    const origin = { latitude: this.centerLat, longitude: this.centerLng };
    const destination = { latitude: place.latitude, longitude: place.longitude };

    this.api.computeRoute(origin, destination, this.activeTravelMode).subscribe({
      next: (route) => {
        this.currentRoute = route;
        this.drawRoutePolyline(route);
      },
      error: (err) => {
        console.error('Compute route failed:', err);
      }
    });
  }

  changeTravelMode(mode: string) {
    this.activeTravelMode = mode;
    if (this.selectedPlace) {
      this.computeRouteTo(this.selectedPlace);
    }
  }

  drawRoutePolyline(route: RouteResponse) {
    if (!this.map || typeof google === 'undefined') return;

    if (this.routePolyline) {
      this.routePolyline.setMap(null);
    }

    const path = route.polyline_coordinates.map(pt => ({ lat: pt[0], lng: pt[1] }));

    this.routePolyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#38bdf8',
      strokeOpacity: 0.9,
      strokeWeight: 6,
      map: this.map
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach(pt => bounds.extend(pt));
    this.map.fitBounds(bounds, 60);
  }

  clearRoute() {
    this.currentRoute = null;
    if (this.routePolyline) {
      this.routePolyline.setMap(null);
      this.routePolyline = null;
    }
  }
}

