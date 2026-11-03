import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreFinderComponent } from './components/store-finder/store-finder.component';
import { GeoAiAssistantComponent } from './components/geo-ai-assistant/geo-ai-assistant.component';
import { DataVisualizerComponent } from './components/data-visualizer/data-visualizer.component';
import { ApiKeyModalComponent } from './components/api-key-modal/api-key-modal.component';
import { ApiService, SystemStatus } from './services/api.service';

type AppVersion = 'version1' | 'version2' | 'version3';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    StoreFinderComponent,
    GeoAiAssistantComponent,
    DataVisualizerComponent,
    ApiKeyModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private api = inject(ApiService);

  activeVersion: AppVersion = 'version1';
  isKeyModalOpen: boolean = false;
  hasMapsKey: boolean = false;
  hasGeminiKey: boolean = false;
  gcpProjectId: string = 'gmp-demo-project-569655961';
  serverStatus: string = 'connecting';

  versions = [
    {
      id: 'version1' as AppVersion,
      name: 'Local Store Finder & 3D Routing',
      subtitle: 'Places API (New) • Compute Routes • 2D/3D Vector Rendering',
      badge: 'v1.0',
      icon: 'fa-solid fa-map-location-dot'
    },
    {
      id: 'version2' as AppVersion,
      name: 'Geospatial AI Assistant',
      subtitle: 'Maps Grounding Lite • Weather API • Geocoding API v4',
      badge: 'v2.0',
      icon: 'fa-solid fa-brain'
    },
    {
      id: 'version3' as AppVersion,
      name: 'Data Visualization & Styler',
      subtitle: 'Vector Drawing Tools • Spatial Area Analytics • JSON Themes',
      badge: 'v3.0',
      icon: 'fa-solid fa-draw-polygon'
    }
  ];

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const vParam = urlParams.get('v') as AppVersion;
    if (vParam && ['version1', 'version2', 'version3'].includes(vParam)) {
      this.activeVersion = vParam;
    }
    this.checkKeyStatus();
    this.refreshBackendStatus();
  }

  checkKeyStatus() {
    const mapsKey = localStorage.getItem('gmp_maps_key');
    const geminiKey = localStorage.getItem('gmp_gemini_key');
    this.hasMapsKey = Boolean(mapsKey && mapsKey.trim().length > 0);
    this.hasGeminiKey = Boolean(geminiKey && geminiKey.trim().length > 0);
  }

  refreshBackendStatus() {
    this.api.getSystemStatus().subscribe({
      next: (status: SystemStatus) => {
        this.serverStatus = status.status;
        this.gcpProjectId = status.gcp_project_id;
        if (status.google_maps_key_set) this.hasMapsKey = true;
        if (status.gemini_key_set) this.hasGeminiKey = true;
      },
      error: () => {
        this.serverStatus = 'offline';
      }
    });
  }

  switchVersion(versionId: AppVersion) {
    this.activeVersion = versionId;
  }

  openKeyModal() {
    this.isKeyModalOpen = true;
  }

  closeKeyModal() {
    this.isKeyModalOpen = false;
  }

  onKeysUpdated(keys: { mapsKey: string; geminiKey: string }) {
    this.hasMapsKey = Boolean(keys.mapsKey && keys.mapsKey.length > 0);
    this.hasGeminiKey = Boolean(keys.geminiKey && keys.geminiKey.length > 0);
    this.refreshBackendStatus();
  }
}
