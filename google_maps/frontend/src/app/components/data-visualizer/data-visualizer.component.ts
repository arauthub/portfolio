import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapsLoaderService } from '../../services/maps-loader.service';
import { MAP_THEMES, MapTheme } from '../../models/map-themes';

interface DrawnShapeStat {
  id: string;
  type: string;
  areaText?: string;
  perimeterText?: string;
  coordsCount: number;
}

@Component({
  selector: 'app-data-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full h-full flex overflow-hidden">
      
      <!-- Left Sidebar: Map Styling Studio & JSON Themes -->
      <aside class="w-96 h-full flex flex-col glass-panel border-r border-slate-800 z-20 flex-shrink-0" style="width: 384px; min-width: 384px; height: 100%; display: flex; flex-direction: column;">
        
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-slate-800/80 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 text-sm">
                <i class="fa-solid fa-draw-polygon"></i>
              </div>
              <div>
                <h2 class="text-sm font-bold text-white tracking-wide">Data Visualization Tool</h2>
                <p class="text-[10px] text-emerald-400">Drawing Tools & Map Styling Themes</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              Vector + GeoJSON
            </span>
          </div>

          <!-- Tab: Themes vs Live JSON Editor -->
          <div class="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              (click)="activeSubTab = 'themes'"
              [class.bg-emerald-600]="activeSubTab === 'themes'"
              [class.text-white]="activeSubTab === 'themes'"
              [class.text-slate-400]="activeSubTab !== 'themes'"
              class="flex-1 py-1.5 rounded-lg font-medium transition-all text-center"
            >
              <i class="fa-solid fa-palette mr-1 text-[11px]"></i> JSON Themes
            </button>
            <button
              (click)="activeSubTab = 'editor'"
              [class.bg-emerald-600]="activeSubTab === 'editor'"
              [class.text-white]="activeSubTab === 'editor'"
              [class.text-slate-400]="activeSubTab !== 'editor'"
              class="flex-1 py-1.5 rounded-lg font-medium transition-all text-center"
            >
              <i class="fa-solid fa-code mr-1 text-[11px]"></i> Live Styler
            </button>
            <button
              (click)="activeSubTab = 'analytics'"
              [class.bg-emerald-600]="activeSubTab === 'analytics'"
              [class.text-white]="activeSubTab === 'analytics'"
              [class.text-slate-400]="activeSubTab !== 'analytics'"
              class="flex-1 py-1.5 rounded-lg font-medium transition-all text-center"
            >
              <i class="fa-solid fa-chart-area mr-1 text-[11px]"></i> Shapes ({{ drawnShapes.length }})
            </button>
          </div>
        </div>

        <!-- Tab 1: JSON Themes Selector -->
        <div *ngIf="activeSubTab === 'themes'" class="flex-1 overflow-y-auto p-4 space-y-3">
          <p class="text-xs text-slate-400">Select a curated Google Maps JSON theme:</p>

          <div
            *ngFor="let theme of themes"
            (click)="applyTheme(theme)"
            [class.border-emerald-400]="currentTheme.id === theme.id"
            [class.bg-slate-800]="currentTheme.id === theme.id"
            class="p-3.5 rounded-xl glass-card border border-slate-800/80 cursor-pointer transition-all hover:border-emerald-500/60 space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3.5 h-3.5 rounded-full" [style.backgroundColor]="theme.accentColor"></span>
                <h4 class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {{ theme.name }}
                </h4>
              </div>
              <span *ngIf="currentTheme.id === theme.id" class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> Active
              </span>
            </div>
            <p class="text-[11px] text-slate-400 leading-snug">{{ theme.description }}</p>
          </div>
        </div>

        <!-- Tab 2: Live JSON Style Editor -->
        <div *ngIf="activeSubTab === 'editor'" class="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-300">Raw MapStyle JSON:</span>
            <button (click)="copyStyleJson()" class="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
          <textarea
            [(ngModel)]="customStyleJson"
            class="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 resize-none"
            spellcheck="false"
          ></textarea>
          <button (click)="applyCustomJsonStyle()" class="btn-primary text-xs py-2 justify-center bg-emerald-600 hover:bg-emerald-500">
            <i class="fa-solid fa-play"></i> Apply Live Style to Canvas
          </button>
        </div>

        <!-- Tab 3: Drawn Boundary Analytics -->
        <div *ngIf="activeSubTab === 'analytics'" class="flex-1 overflow-y-auto p-4 space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <span class="text-xs font-bold text-white">Spatial Telemetry</span>
            <button (click)="exportGeoJSON()" class="btn-secondary text-[11px] py-1 px-2.5 text-emerald-400">
              <i class="fa-solid fa-download"></i> Export GeoJSON
            </button>
          </div>

          <div *ngIf="drawnShapes.length === 0" class="p-6 text-center text-slate-500 text-xs space-y-2">
            <i class="fa-solid fa-pen-ruler text-2xl text-slate-600"></i>
            <p>No shapes drawn yet. Use the drawing toolbar above the map to sketch boundaries.</p>
          </div>

          <div *ngFor="let s of drawnShapes; let sIdx = index" class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-emerald-300 flex items-center gap-1.5">
                <i class="fa-solid fa-draw-polygon text-[10px]"></i>
                Shape #{{ sIdx + 1 }} ({{ s.type }})
              </span>
              <span class="text-slate-400 font-mono text-[10px]">{{ s.coordsCount }} vertices</span>
            </div>
            <div *ngIf="s.areaText" class="text-[11px] text-slate-300 flex justify-between">
              <span class="text-slate-500">Enclosed Area:</span>
              <span class="font-mono font-bold text-white">{{ s.areaText }}</span>
            </div>
            <div *ngIf="s.perimeterText" class="text-[11px] text-slate-300 flex justify-between">
              <span class="text-slate-500">Perimeter / Length:</span>
              <span class="font-mono text-white">{{ s.perimeterText }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
          <button (click)="clearAllShapes()" class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-trash-can"></i> Clear All Shapes
          </button>
          <span class="text-[11px] font-mono text-slate-500">{{ currentTheme.name }}</span>
        </div>
      </aside>

      <!-- Center Map Area -->
      <main class="flex-1 h-full relative overflow-hidden">
        <div #vizMapContainer class="map-canvas-container bg-slate-950"></div>

        <!-- Floating Drawing Toolbar -->
        <div class="absolute top-4 left-6 z-10 glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-1.5">
          <span class="text-xs font-bold text-slate-300 px-2 flex items-center gap-1.5">
            <i class="fa-solid fa-pen-nib text-emerald-400"></i> Draw:
          </span>

          <button
            (click)="setDrawingTool('null')"
            [class.bg-emerald-600]="activeTool === 'null'"
            [class.text-white]="activeTool === 'null'"
            [class.text-slate-400]="activeTool !== 'null'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
            title="Pan / Navigate"
          >
            <i class="fa-solid fa-hand"></i> Pan
          </button>

          <button
            (click)="setDrawingTool('polygon')"
            [class.bg-emerald-600]="activeTool === 'polygon'"
            [class.text-white]="activeTool === 'polygon'"
            [class.text-slate-400]="activeTool !== 'polygon'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
            title="Draw Polygon Boundary"
          >
            <i class="fa-solid fa-draw-polygon"></i> Polygon
          </button>

          <button
            (click)="setDrawingTool('rectangle')"
            [class.bg-emerald-600]="activeTool === 'rectangle'"
            [class.text-white]="activeTool === 'rectangle'"
            [class.text-slate-400]="activeTool !== 'rectangle'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
            title="Draw Rectangle Geofence"
          >
            <i class="fa-regular fa-square"></i> Rectangle
          </button>

          <button
            (click)="setDrawingTool('circle')"
            [class.bg-emerald-600]="activeTool === 'circle'"
            [class.text-white]="activeTool === 'circle'"
            [class.text-slate-400]="activeTool !== 'circle'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
            title="Draw Radius Circle"
          >
            <i class="fa-regular fa-circle"></i> Circle
          </button>

          <button
            (click)="setDrawingTool('polyline')"
            [class.bg-emerald-600]="activeTool === 'polyline'"
            [class.text-white]="activeTool === 'polyline'"
            [class.text-slate-400]="activeTool !== 'polyline'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
            title="Draw Linear Path"
          >
            <i class="fa-solid fa-bezier-curve"></i> Polyline
          </button>

          <button
            (click)="setDrawingTool('marker')"
            [class.bg-emerald-600]="activeTool === 'marker'"
            [class.text-white]="activeTool === 'marker'"
            [class.text-slate-400]="activeTool !== 'marker'"
            class="px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 transition-all"
            title="Drop Marker Pin"
          >
            <i class="fa-solid fa-location-dot"></i> Marker
          </button>
        </div>

        <!-- Quick instructions overlay banner -->
        <div class="absolute bottom-6 left-6 z-10 glass-panel px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-3 text-xs text-slate-300">
          <i class="fa-solid fa-circle-info text-emerald-400"></i>
          <span>Click on the map to define polygon vertices. Double-click or close the polygon to finish calculating boundary area.</span>
        </div>

      </main>

    </div>
  `
})
export class DataVisualizerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vizMapContainer', { static: false }) mapContainer!: ElementRef;

  private mapsLoader = inject(MapsLoaderService);

  map: google.maps.Map | null = null;
  drawingManager: any = null;
  overlays: any[] = [];
  drawnShapes: DrawnShapeStat[] = [];

  themes: MapTheme[] = MAP_THEMES;
  currentTheme: MapTheme = MAP_THEMES[0];
  customStyleJson: string = '';
  activeSubTab: 'themes' | 'editor' | 'analytics' = 'themes';
  activeTool: string = 'null';

  centerLat: number = 37.7749;
  centerLng: number = -122.4194;

  ngOnInit() {
    this.customStyleJson = JSON.stringify(this.currentTheme.styles, null, 2);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.clearAllShapes();
  }

  async initMap() {
    const key = localStorage.getItem('gmp_maps_key') || '';
    try {
      await this.mapsLoader.load(key);
      if (this.mapContainer && this.mapContainer.nativeElement) {
        this.map = new google.maps.Map(this.mapContainer.nativeElement, {
          center: { lat: this.centerLat, lng: this.centerLng },
          zoom: 14,
          styles: this.currentTheme.styles,
          disableDefaultUI: false
        });

        this.initDrawingManager();
      }
    } catch (e) {
      console.warn('Map visualizer init error:', e);
    }
  }

  initDrawingManager() {
    if (!this.map || typeof google === 'undefined' || !google.maps.drawing) return;

    const DrawingMgr = (google.maps as any).drawing?.DrawingManager || (window as any).google?.maps?.drawing?.DrawingManager;
    this.drawingManager = new DrawingMgr({
      drawingMode: null,
      drawingControl: false, // Using our custom UI toolbar
      polygonOptions: {
        fillColor: '#10b981',
        fillOpacity: 0.35,
        strokeColor: '#34d399',
        strokeWeight: 2,
        editable: true,
        draggable: true
      },
      rectangleOptions: {
        fillColor: '#06b6d4',
        fillOpacity: 0.35,
        strokeColor: '#22d3ee',
        strokeWeight: 2,
        editable: true
      },
      circleOptions: {
        fillColor: '#8b5cf6',
        fillOpacity: 0.35,
        strokeColor: '#a78bfa',
        strokeWeight: 2,
        editable: true
      },
      polylineOptions: {
        strokeColor: '#f59e0b',
        strokeWeight: 4
      }
    });

    this.drawingManager.setMap(this.map);

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
      this.handleOverlayComplete(event);
    });
  }

  setDrawingTool(tool: string) {
    this.activeTool = tool;
    if (!this.drawingManager || typeof google === 'undefined') return;

    switch (tool) {
      case 'polygon':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        break;
      case 'rectangle':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
        break;
      case 'circle':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
        break;
      case 'polyline':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        break;
      case 'marker':
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
        break;
      default:
        this.drawingManager.setDrawingMode(null);
    }
  }

  handleOverlayComplete(event: any) {
    const overlay = event.overlay;
    this.overlays.push(overlay);

    let areaText = '';
    let perimeterText = '';
    let coordsCount = 0;

    if (event.type === 'polygon' && google.maps.geometry) {
      const path = overlay.getPath();
      coordsCount = path.getLength();
      const area = google.maps.geometry.spherical.computeArea(path);
      const perimeter = google.maps.geometry.spherical.computeLength(path);

      areaText = area > 1000000 ? `${(area / 1000000).toFixed(2)} km²` : `${Math.round(area)} m²`;
      perimeterText = perimeter > 1000 ? `${(perimeter / 1000).toFixed(2)} km` : `${Math.round(perimeter)} m`;
    } else if (event.type === 'circle') {
      const r = overlay.getRadius();
      const area = Math.PI * r * r;
      areaText = area > 1000000 ? `${(area / 1000000).toFixed(2)} km²` : `${Math.round(area)} m²`;
      perimeterText = `Radius: ${Math.round(r)} m`;
      coordsCount = 1;
    } else if (event.type === 'rectangle' && google.maps.geometry) {
      const bounds = overlay.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const nw = new google.maps.LatLng(ne.lat(), sw.lng());
      const se = new google.maps.LatLng(sw.lat(), ne.lng());
      const path = [ne, se, sw, nw];
      const area = google.maps.geometry.spherical.computeArea(path);
      areaText = area > 1000000 ? `${(area / 1000000).toFixed(2)} km²` : `${Math.round(area)} m²`;
      coordsCount = 4;
    } else if (event.type === 'polyline' && google.maps.geometry) {
      const path = overlay.getPath();
      coordsCount = path.getLength();
      const len = google.maps.geometry.spherical.computeLength(path);
      perimeterText = len > 1000 ? `${(len / 1000).toFixed(2)} km` : `${Math.round(len)} m`;
    }

    this.drawnShapes.push({
      id: `shape_${Date.now()}`,
      type: event.type,
      areaText,
      perimeterText,
      coordsCount
    });

    // Reset to pan tool
    this.setDrawingTool('null');
  }

  applyTheme(theme: MapTheme) {
    this.currentTheme = theme;
    this.customStyleJson = JSON.stringify(theme.styles, null, 2);
    if (this.map) {
      this.map.setOptions({ styles: theme.styles });
    }
  }

  applyCustomJsonStyle() {
    try {
      const parsed = JSON.parse(this.customStyleJson);
      if (this.map) {
        this.map.setOptions({ styles: parsed });
      }
    } catch (e) {
      alert('Invalid JSON in custom style editor.');
    }
  }

  copyStyleJson() {
    navigator.clipboard.writeText(this.customStyleJson);
    alert('MapStyle JSON copied to clipboard!');
  }

  exportGeoJSON() {
    const featureCollection = {
      type: 'FeatureCollection',
      features: this.drawnShapes.map((s, idx) => ({
        type: 'Feature',
        id: s.id,
        properties: {
          name: `Drawn Boundary ${idx + 1}`,
          type: s.type,
          area: s.areaText || null,
          perimeter: s.perimeterText || null
        },
        geometry: {
          type: s.type === 'polygon' ? 'Polygon' : 'Point',
          coordinates: [this.centerLng, this.centerLat]
        }
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(featureCollection, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `spatial_export_${Date.now()}.geojson`);
    dlAnchorElem.click();
  }

  clearAllShapes() {
    this.overlays.forEach(o => o.setMap(null));
    this.overlays = [];
    this.drawnShapes = [];
  }
}
