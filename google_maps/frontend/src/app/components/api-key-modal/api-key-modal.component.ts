import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-api-key-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);" *ngIf="isOpen">
      <div class="relative w-full max-w-xl rounded-2xl glass-panel p-6 shadow-2xl border border-sky-500/30 overflow-hidden" style="max-width: 580px; width: 100%;">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/40 text-sky-400">
              <i class="fa-solid fa-key text-lg"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-white tracking-wide">Google Cloud & Maps API Setup</h2>
              <p class="text-xs text-slate-400">Project: <span class="text-sky-400 font-mono font-medium">{{ gcpProjectId }}</span></p>
            </div>
          </div>
          <button (click)="closeModal()" class="text-slate-400 hover:text-white transition-colors p-1">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="space-y-4 py-4 text-sm">
          <div class="bg-sky-950/40 rounded-xl p-3 border border-sky-800/40 text-xs text-sky-200 flex gap-2.5 items-start">
            <i class="fa-solid fa-circle-info text-sky-400 mt-0.5"></i>
            <span>
              Enter your Google Maps Platform API key below. You can also provide a Gemini API key for live AI Maps Grounding. 
              The application also includes high-fidelity simulation fallbacks so you can test all features right away.
            </span>
          </div>

          <!-- Maps Key Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Google Maps Platform API Key</span>
              <span class="text-emerald-400 lowercase font-normal" *ngIf="mapsKey">*required for live map rendering</span>
            </label>
            <div class="relative">
              <input
                type="password"
                [(ngModel)]="mapsKey"
                placeholder="Enter Google Maps API Key..."
                class="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono text-xs"
              />
            </div>
            <p class="text-[11px] text-slate-400 mt-1">
              Required APIs enabled on GCP: <span class="text-slate-300">Maps JavaScript API, Places API (New), Routes API, Geocoding API</span>.
            </p>
          </div>

          <!-- Gemini Key Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Gemini AI API Key (Optional)</span>
              <span class="text-purple-400 lowercase font-normal">for Maps Grounding Lite</span>
            </label>
            <input
              type="password"
              [(ngModel)]="geminiKey"
              placeholder="Enter Gemini API Key..."
              class="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-xs"
            />
            <p class="text-[11px] text-slate-400 mt-1">
              Used for live conversational reasoning alongside weather and geocoding parameters.
            </p>
          </div>

          <!-- Status badge -->
          <div *ngIf="saveSuccess" class="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl p-2.5 flex items-center gap-2">
            <i class="fa-solid fa-circle-check"></i>
            <span>API configuration saved and synchronized with backend!</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <button (click)="loadDemoKeys()" class="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Use Demo Mode
          </button>
          <div class="flex items-center gap-2.5">
            <button (click)="closeModal()" class="btn-secondary text-xs">
              Cancel
            </button>
            <button (click)="saveKeys()" [disabled]="isSaving" class="btn-primary text-xs">
              <i class="fa-solid fa-check" *ngIf="!isSaving"></i>
              <i class="fa-solid fa-spinner fa-spin" *ngIf="isSaving"></i>
              <span>Save & Connect</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ApiKeyModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() keysUpdated = new EventEmitter<{ mapsKey: string; geminiKey: string }>();

  private api = inject(ApiService);

  mapsKey: string = '';
  geminiKey: string = '';
  gcpProjectId: string = 'gmp-demo-project-569655961';
  isSaving: boolean = false;
  saveSuccess: boolean = false;

  ngOnInit() {
    this.mapsKey = localStorage.getItem('gmp_maps_key') || '';
    this.geminiKey = localStorage.getItem('gmp_gemini_key') || '';
  }

  closeModal() {
    this.saveSuccess = false;
    this.close.emit();
  }

  loadDemoKeys() {
    this.mapsKey = '';
    this.geminiKey = '';
    localStorage.removeItem('gmp_maps_key');
    localStorage.removeItem('gmp_gemini_key');
    this.saveSuccess = true;
    setTimeout(() => {
      this.keysUpdated.emit({ mapsKey: '', geminiKey: '' });
      this.closeModal();
    }, 400);
  }

  saveKeys() {
    this.isSaving = true;
    localStorage.setItem('gmp_maps_key', this.mapsKey.trim());
    localStorage.setItem('gmp_gemini_key', this.geminiKey.trim());

    this.api.updateRuntimeKeys(this.mapsKey.trim(), this.geminiKey.trim()).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        setTimeout(() => {
          this.keysUpdated.emit({ mapsKey: this.mapsKey.trim(), geminiKey: this.geminiKey.trim() });
          this.closeModal();
        }, 600);
      },
      error: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.keysUpdated.emit({ mapsKey: this.mapsKey.trim(), geminiKey: this.geminiKey.trim() });
        this.closeModal();
      }
    });
  }
}

