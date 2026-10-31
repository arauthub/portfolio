import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantService } from '../../core/services/tenant.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { Organization } from '../../core/models';

@Component({
  selector: 'app-org-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hud)]">
        <div>
          <div class="text-xs font-mono text-[var(--neon-accent)] tracking-widest uppercase mb-1">
            MULTI-TENANT WHITE-LABELING PORTAL
          </div>
          <h1 class="text-3xl font-display font-extrabold text-white">
            Setup Your Organization's LMS
          </h1>
          <p class="text-sm text-slate-400 mt-1 max-w-2xl">
            Configure your enterprise tenant with custom cyberpunk neon themes, custom domains, LMS feature flags, and instant deployment export.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs font-mono px-3 py-1.5 rounded-lg bg-[var(--neon-primary)]/10 text-[var(--neon-primary)] border border-[var(--neon-primary)]/30">
            Active Tenant: {{ tenantService.currentTenant().name }}
          </span>
        </div>
      </div>

      <!-- Main Workspace: Form & Live Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Setup Wizard Form -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Step 1: Organization Profile -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span class="w-6 h-6 rounded-full bg-[var(--neon-primary)]/20 text-[var(--neon-primary)] flex items-center justify-center font-display font-bold text-xs">
                1
              </span>
              <h3 class="font-display font-bold text-sm uppercase tracking-wider text-white">
                Organization Profile & Subdomain
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400">Organization Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="orgForm.name" 
                  (ngModelChange)="onNameChange()"
                  class="cyber-input" 
                  placeholder="e.g. Cyberdyne Academies">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400">Tenant Subdomain</label>
                <div class="flex items-center">
                  <input 
                    type="text" 
                    [(ngModel)]="orgForm.subdomain" 
                    class="cyber-input rounded-r-none" 
                    placeholder="cyberdyne">
                  <span class="bg-[#0e162e] border border-l-0 border-[var(--border-hud)] px-3 py-2 text-xs font-mono text-slate-400 rounded-r-lg">
                    .synapse.io
                  </span>
                </div>
              </div>

              <div class="sm:col-span-2 space-y-1">
                <label class="text-xs font-mono text-slate-400">Organization Slogan / Motto</label>
                <input 
                  type="text" 
                  [(ngModel)]="orgForm.slogan" 
                  class="cyber-input" 
                  placeholder="e.g. Architectural Excellence in Quantum Systems">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400">Admin Contact Email</label>
                <input 
                  type="email" 
                  [(ngModel)]="orgForm.contact_email" 
                  class="cyber-input" 
                  placeholder="admin@organization.org">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400">Licensed Seat Capacity</label>
                <input 
                  type="number" 
                  [(ngModel)]="orgForm.seat_capacity" 
                  class="cyber-input" 
                  placeholder="500">
              </div>
            </div>
          </div>

          <!-- Step 2: Futuristic Theme Customizer -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span class="w-6 h-6 rounded-full bg-[var(--neon-secondary)]/20 text-[var(--neon-secondary)] flex items-center justify-center font-display font-bold text-xs">
                2
              </span>
              <h3 class="font-display font-bold text-sm uppercase tracking-wider text-white">
                Futuristic Visual Theme & Neon Branding
              </h3>
            </div>

            <!-- Theme Display Mode (Dark vs Light) -->
            <div class="space-y-2 pb-2 border-b border-slate-800">
              <label class="text-xs font-mono text-slate-400">Theme Environment Mode</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  (click)="selectMode('dark')"
                  [class.border-cyan-400]="orgForm.default_mode === 'dark'"
                  [class.bg-[var(--neon-primary)]/10]="orgForm.default_mode === 'dark'"
                  class="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-slate-600 transition-all text-xs font-display font-bold text-white">
                  <span>🌙</span> Cyber Dark Void
                </button>
                <button 
                  type="button"
                  (click)="selectMode('light')"
                  [class.border-sky-400]="orgForm.default_mode === 'light'"
                  [class.bg-sky-400/10]="orgForm.default_mode === 'light'"
                  class="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-slate-600 transition-all text-xs font-display font-bold text-white">
                  <span>☀️</span> Solar High-Tech Light
                </button>
              </div>
            </div>

            <!-- Theme Presets -->
            <div class="space-y-2">
              <label class="text-xs font-mono text-slate-400">Theme Neon & Frosted Palettes</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button 
                  (click)="applyPreset('cyber_neon', '#00f3ff', '#a855f7', '#ff0055', 'dark')"
                  [class.border-cyan-400]="orgForm.theme_preset === 'cyber_neon'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-cyan-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#00f3ff]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#a855f7]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#ff0055]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Cyber Neon</div>
                  <div class="text-[10px] font-mono text-slate-500">Dark // Cyan & Pink</div>
                </button>

                <button 
                  (click)="applyPreset('quantum_void', '#a855f7', '#3b82f6', '#f59e0b', 'dark')"
                  [class.border-purple-400]="orgForm.theme_preset === 'quantum_void'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-purple-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#a855f7]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Quantum Void</div>
                  <div class="text-[10px] font-mono text-slate-500">Dark // Purple & Amber</div>
                </button>

                <button 
                  (click)="applyPreset('matrix_emerald', '#10b981', '#06b6d4', '#ec4899', 'dark')"
                  [class.border-emerald-400]="orgForm.theme_preset === 'matrix_emerald'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-emerald-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#10b981]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#06b6d4]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#ec4899]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Matrix Emerald</div>
                  <div class="text-[10px] font-mono text-slate-500">Dark // Green & Cyan</div>
                </button>

                <button 
                  (click)="applyPreset('solar_amber', '#f59e0b', '#ef4444', '#00f3ff', 'dark')"
                  [class.border-amber-400]="orgForm.theme_preset === 'solar_amber'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-amber-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#00f3ff]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Solar Flare</div>
                  <div class="text-[10px] font-mono text-slate-500">Dark // Gold & Crimson</div>
                </button>

                <button 
                  (click)="applyPreset('solar_light', '#0284c7', '#8b5cf6', '#f43f5e', 'light')"
                  [class.border-sky-400]="orgForm.theme_preset === 'solar_light'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-sky-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#0284c7]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#8b5cf6]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#f43f5e]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Solar Light ☀️</div>
                  <div class="text-[10px] font-mono text-slate-500">Light // Sky Blue Frost</div>
                </button>

                <button 
                  (click)="applyPreset('quantum_aurora', '#0d9488', '#6366f1', '#d97706', 'light')"
                  [class.border-teal-400]="orgForm.theme_preset === 'quantum_aurora'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-teal-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#0d9488]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#6366f1]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#d97706]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Quantum Aurora ☀️</div>
                  <div class="text-[10px] font-mono text-slate-500">Light // Teal & Indigo</div>
                </button>

                <button 
                  (click)="applyPreset('google_standard', '#1a73e8', '#ea4335', '#f9ab00', 'light')"
                  [class.border-blue-400]="orgForm.theme_preset === 'google_standard'"
                  class="p-3 rounded-lg border border-slate-800 bg-[#070b18] hover:border-blue-400 text-left transition-all">
                  <div class="flex gap-1.5 mb-2">
                    <span class="w-3 h-3 rounded-full bg-[#1a73e8]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#ea4335]"></span>
                    <span class="w-3 h-3 rounded-full bg-[#f9ab00]"></span>
                  </div>
                  <div class="text-xs font-display font-bold text-white">Google Standard ☀️</div>
                  <div class="text-[10px] font-mono text-slate-500">Light // Blue, Red, Yellow</div>
                </button>
              </div>
            </div>

            <!-- Custom Color Hex Inputs -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full border border-current" [style.backgroundColor]="orgForm.primary_color"></span>
                  Primary Neon Glow
                </label>
                <input type="text" [(ngModel)]="orgForm.primary_color" class="cyber-input font-mono text-xs">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full border border-current" [style.backgroundColor]="orgForm.secondary_color"></span>
                  Secondary Neon Glow
                </label>
                <input type="text" [(ngModel)]="orgForm.secondary_color" class="cyber-input font-mono text-xs">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full border border-current" [style.backgroundColor]="orgForm.accent_color"></span>
                  Accent Alert Color
                </label>
                <input type="text" [(ngModel)]="orgForm.accent_color" class="cyber-input font-mono text-xs">
              </div>
            </div>

            <!-- Font Family Preset -->
            <div class="space-y-1 pt-2">
              <label class="text-xs font-mono text-slate-400">Typography Preset</label>
              <select [(ngModel)]="orgForm.font_preset" class="cyber-input">
                <option value="google_sans">Google Sans & Roboto (Google Standard High Readability)</option>
                <option value="orbitron">Orbitron (Cyberpunk Geometric Display)</option>
                <option value="space_grotesk">Space Grotesk (Modern Aerospace Clean)</option>
                <option value="jetbrains">JetBrains Mono (Developer Terminal Matrix)</option>
              </select>
            </div>
          </div>

          <!-- Step 3: Feature Flags -->
          <div class="glass-panel p-6 space-y-4">
            <div class="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span class="w-6 h-6 rounded-full bg-[var(--neon-accent)]/20 text-[var(--neon-accent)] flex items-center justify-center font-display font-bold text-xs">
                3
              </span>
              <h3 class="font-display font-bold text-sm uppercase tracking-wider text-white">
                LMS Workflows & Gamification Modules
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <label class="flex items-center gap-2.5 p-3 rounded-lg border border-slate-800 bg-[#070b18] cursor-pointer hover:border-slate-700">
                <input type="checkbox" [(ngModel)]="orgForm.enable_gamification" class="accent-[var(--neon-primary)] w-4 h-4">
                <span>XP & Level Progression Engine</span>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-lg border border-slate-800 bg-[#070b18] cursor-pointer hover:border-slate-700">
                <input type="checkbox" [(ngModel)]="orgForm.enable_quests" class="accent-[var(--neon-primary)] w-4 h-4">
                <span>Daily & Weekly Bounties (Quests)</span>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-lg border border-slate-800 bg-[#070b18] cursor-pointer hover:border-slate-700">
                <input type="checkbox" [(ngModel)]="orgForm.enable_skill_tree" class="accent-[var(--neon-primary)] w-4 h-4">
                <span>Interactive Neural Skill Tree Web</span>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-lg border border-slate-800 bg-[#070b18] cursor-pointer hover:border-slate-700">
                <input type="checkbox" [(ngModel)]="orgForm.enable_sound_fx" class="accent-[var(--neon-primary)] w-4 h-4">
                <span>Synthetic Web Audio Sound FX</span>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-lg border border-slate-800 bg-[#070b18] cursor-pointer hover:border-slate-700 sm:col-span-2">
                <input type="checkbox" [(ngModel)]="orgForm.enable_certificates" class="accent-[var(--neon-primary)] w-4 h-4">
                <span>Cryptographic Verifiable Certificates</span>
              </label>
            </div>
          </div>

          <!-- Actions: Deploy & Export -->
          <div class="flex flex-wrap items-center gap-4 pt-4">
            <button (click)="deployOrganization()" class="cyber-btn">
              ⚡ Deploy & Activate This Tenant
            </button>
            <button (click)="exportConfiguration()" class="cyber-btn cyber-btn-secondary">
              📥 Export Self-Hosted Package
            </button>
          </div>

        </div>

        <!-- Live Instant Preview Pane -->
        <div class="space-y-6">
          <div class="glass-panel p-6 space-y-5 sticky top-24">
            <div>
              <span class="text-[10px] font-mono tracking-wider uppercase text-[var(--neon-primary)]">
                LIVE TENANT BRANDING PREVIEW
              </span>
              <h4 class="font-display font-bold text-sm text-white mt-1">
                Real-Time Render
              </h4>
            </div>

            <!-- Preview Header Mock -->
            <div 
              [class.bg-[#050811]]="orgForm.default_mode !== 'light'"
              [class.bg-white]="orgForm.default_mode === 'light'"
              [class.shadow-md]="orgForm.default_mode === 'light'"
              class="p-3 rounded-xl border border-slate-800 space-y-3 transition-colors">
              <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm"
                       [style.backgroundColor]="orgForm.primary_color + '20'"
                       [style.borderColor]="orgForm.primary_color"
                       [style.color]="orgForm.primary_color"
                       class="border">
                    {{ orgForm.name ? orgForm.name.charAt(0) : 'S' }}
                  </div>
                  <div>
                    <div class="font-display font-bold text-xs" [class.text-white]="orgForm.default_mode !== 'light'" [class.text-slate-900]="orgForm.default_mode === 'light'">
                      {{ orgForm.name || 'Organization Name' }}
                    </div>
                    <div class="text-[9px] font-mono" [style.color]="orgForm.primary_color">
                      {{ orgForm.subdomain || 'org' }}.synapse.io
                    </div>
                  </div>
                </div>

                <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                     [style.backgroundColor]="orgForm.primary_color + '30'"
                     [style.color]="orgForm.primary_color">
                  3
                </div>
              </div>

              <!-- Preview Hero Card -->
              <div 
                [class.bg-[#080d20]]="orgForm.default_mode !== 'light'"
                [class.bg-slate-50]="orgForm.default_mode === 'light'"
                class="p-3 rounded-lg border transition-colors" 
                [style.borderColor]="orgForm.primary_color + '60'">
                <div class="text-[9px] font-mono uppercase" [style.color]="orgForm.accent_color">
                  MISSION PROTOCOL
                </div>
                <div class="font-display font-bold text-xs mt-0.5" [class.text-white]="orgForm.default_mode !== 'light'" [class.text-slate-900]="orgForm.default_mode === 'light'">
                  {{ orgForm.slogan || 'Next-Gen Learning Protocols' }}
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-[10px] font-mono" [class.text-slate-400]="orgForm.default_mode !== 'light'" [class.text-slate-600]="orgForm.default_mode === 'light'">Seats: {{ orgForm.seat_capacity }}</span>
                  <span class="text-[10px] font-display font-bold px-2 py-0.5 rounded shadow-sm"
                        [style.backgroundColor]="orgForm.primary_color"
                        style="color: #ffffff">
                    START
                  </span>
                </div>
              </div>
            </div>

            <!-- Export Config Modal / Display -->
            @if (exportedJson()) {
              <div class="space-y-2 pt-2 border-t border-slate-800">
                <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>synapse-tenant.json</span>
                  <button (click)="copyConfig()" class="text-[var(--neon-primary)] hover:underline text-[10px]">
                    {{ copied() ? '✓ Copied' : 'Copy JSON' }}
                  </button>
                </div>
                <pre class="bg-black/90 p-3 rounded-lg text-[10px] font-mono text-cyan-300 max-h-48 overflow-y-auto leading-tight">{{ exportedJson() }}</pre>
              </div>
            }

          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .cyber-input {
      width: 100%;
      background: #080d20;
      border: 1px solid rgba(0, 243, 255, 0.25);
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      color: #e2e8f0;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s ease;
    }
    .cyber-input:focus {
      border-color: var(--neon-primary);
      box-shadow: 0 0 10px rgba(var(--neon-primary-rgb), 0.25);
    }
  `]
})
export class OrgSetupComponent {
  public tenantService = inject(TenantService);
  public sound = inject(SoundFxService);

  public orgForm: Partial<Organization> = {
    name: 'Cyberdyne Advanced Technologies',
    slug: 'cyberdyne-technologies',
    subdomain: 'cyberdyne',
    slogan: 'Autonomous Cognitive Protocols & Neural Synthesis',
    contact_email: 'director@cyberdyne.io',
    seat_capacity: 500,
    primary_color: '#00f3ff',
    secondary_color: '#a855f7',
    accent_color: '#ff0055',
    theme_preset: 'cyber_neon',
    font_preset: 'orbitron',
    default_mode: 'dark',
    enable_gamification: true,
    enable_quests: true,
    enable_skill_tree: true,
    enable_sound_fx: true,
    enable_certificates: true
  };

  public exportedJson = signal<string>('');
  public copied = signal<boolean>(false);

  public onNameChange() {
    if (this.orgForm.name) {
      this.orgForm.subdomain = this.orgForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
  }

  public selectMode(mode: 'dark' | 'light') {
    this.orgForm.default_mode = mode;
    this.tenantService.setThemeMode(mode);
    this.sound.playClick();
  }

  public applyPreset(
    preset: 'cyber_neon' | 'quantum_void' | 'matrix_emerald' | 'solar_amber' | 'solar_light' | 'quantum_aurora' | 'google_standard', 
    p: string, 
    s: string, 
    a: string,
    mode: 'dark' | 'light' = 'dark'
  ) {
    this.orgForm.theme_preset = preset;
    this.orgForm.primary_color = p;
    this.orgForm.secondary_color = s;
    this.orgForm.accent_color = a;
    this.orgForm.default_mode = mode;
    this.tenantService.setThemeMode(mode);
    this.sound.playClick();
  }

  public deployOrganization() {
    this.tenantService.provisionNewOrganization(this.orgForm).then(created => {
      this.sound.playLevelUp();
      alert(`🎉 Success! Organization "${created.name}" is now live and set as the active LMS tenant.`);
    });
  }

  public exportConfiguration() {
    const configStr = this.tenantService.exportTenantConfig(this.orgForm as Organization);
    this.exportedJson.set(configStr);
    this.sound.playSuccess();
  }

  public copyConfig() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.exportedJson());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
      this.sound.playClick();
    }
  }
}

