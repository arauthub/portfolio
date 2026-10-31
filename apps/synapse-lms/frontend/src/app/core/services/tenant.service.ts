import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/v1/organizations/';

  // Default Organizations
  private defaultOrgs: Organization[] = [
    {
      id: 1,
      name: 'Nexus Cybernetics',
      slug: 'nexus-cybernetics',
      subdomain: 'nexus',
      slogan: 'Pioneering Quantum-Cognitive Architectures',
      primary_color: '#00f3ff',
      secondary_color: '#a855f7',
      accent_color: '#ff0055',
      theme_preset: 'cyber_neon',
      font_preset: 'orbitron',
      enable_gamification: true,
      enable_quests: true,
      enable_skill_tree: true,
      enable_sound_fx: true,
      enable_certificates: true,
      seat_capacity: 1000,
      active_learners: 128
    },
    {
      id: 2,
      name: 'Aether Space Academy',
      slug: 'aether-space',
      subdomain: 'aether',
      slogan: 'Advanced Gravitational Propulsion & Interplanetary Navigation',
      primary_color: '#a855f7',
      secondary_color: '#3b82f6',
      accent_color: '#f59e0b',
      theme_preset: 'quantum_void',
      font_preset: 'space_grotesk',
      enable_gamification: true,
      enable_quests: true,
      enable_skill_tree: true,
      enable_sound_fx: true,
      enable_certificates: true,
      seat_capacity: 500,
      active_learners: 85
    },
    {
      id: 3,
      name: 'BioSynth Bio-Computing',
      slug: 'biosynth-labs',
      subdomain: 'biosynth',
      slogan: 'Synthetic Neuromorphic Biology & Organic Circuits',
      primary_color: '#10b981',
      secondary_color: '#06b6d4',
      accent_color: '#ec4899',
      theme_preset: 'matrix_emerald',
      font_preset: 'jetbrains',
      enable_gamification: true,
      enable_quests: true,
      enable_skill_tree: true,
      enable_sound_fx: true,
      enable_certificates: true,
      seat_capacity: 750,
      active_learners: 94
    },
    {
      id: 4,
      name: 'Helios Quantum Labs',
      slug: 'helios-labs',
      subdomain: 'helios',
      slogan: 'Photonic Quantum Metrology & Holographic Systems',
      primary_color: '#0284c7',
      secondary_color: '#8b5cf6',
      accent_color: '#f43f5e',
      theme_preset: 'solar_light',
      font_preset: 'space_grotesk',
      default_mode: 'light',
      enable_gamification: true,
      enable_quests: true,
      enable_skill_tree: true,
      enable_sound_fx: true,
      enable_certificates: true,
      seat_capacity: 1200,
      active_learners: 156
    }
  ];

  public organizations = signal<Organization[]>(this.defaultOrgs);
  public currentTenant = signal<Organization>(this.defaultOrgs[0]);
  public themeMode = signal<'dark' | 'light'>('dark');

  constructor() {
    const savedMode = (typeof localStorage !== 'undefined' ? localStorage.getItem('synapse_theme_mode') : null) as 'dark' | 'light' | null;
    if (savedMode === 'light' || savedMode === 'dark') {
      this.themeMode.set(savedMode);
    }

    this.loadOrganizations();

    // Effect to apply dynamic theme variables whenever tenant or themeMode changes
    effect(() => {
      const org = this.currentTenant();
      const mode = this.themeMode();
      this.applyTheme(org, mode);
    });
  }

  public loadOrganizations() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        const results = Array.isArray(data) ? data : (data.results || []);
        if (results.length > 0) {
          this.organizations.set(results);
          const savedSlug = localStorage.getItem('synapse_active_tenant');
          const found = results.find((o: Organization) => o.slug === savedSlug);
          this.currentTenant.set(found || results[0]);
        }
      },
      error: () => {
        // Fallback to local default orgs if backend not yet running
        const savedSlug = localStorage.getItem('synapse_active_tenant');
        const found = this.defaultOrgs.find(o => o.slug === savedSlug);
        if (found) {
          this.currentTenant.set(found);
        }
      }
    });
  }

  public switchTenant(slug: string) {
    const org = this.organizations().find(o => o.slug === slug);
    if (org) {
      this.currentTenant.set(org);
      localStorage.setItem('synapse_active_tenant', slug);
      if (org.default_mode && !localStorage.getItem('synapse_theme_mode_manual')) {
        this.setThemeMode(org.default_mode, false);
      }
    }
  }

  public toggleThemeMode() {
    const next = this.themeMode() === 'dark' ? 'light' : 'dark';
    this.setThemeMode(next, true);
  }

  public setThemeMode(mode: 'dark' | 'light', isManual = true) {
    this.themeMode.set(mode);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('synapse_theme_mode', mode);
      if (isManual) {
        localStorage.setItem('synapse_theme_mode_manual', 'true');
      }
    }
    this.applyTheme(this.currentTenant(), mode);
  }

  public applyTheme(org: Organization, mode?: 'dark' | 'light') {
    if (typeof document === 'undefined') return;
    const currentMode = mode || this.themeMode();
    const root = document.documentElement;

    root.style.setProperty('--neon-primary', org.primary_color);
    root.style.setProperty('--neon-primary-rgb', this.hexToRgb(org.primary_color));

    root.style.setProperty('--neon-secondary', org.secondary_color);
    root.style.setProperty('--neon-secondary-rgb', this.hexToRgb(org.secondary_color));

    root.style.setProperty('--neon-accent', org.accent_color);
    root.style.setProperty('--neon-accent-rgb', this.hexToRgb(org.accent_color));

    if (org.font_preset === 'google_sans' || !org.font_preset) {
      root.style.setProperty('--font-display', "'Google Sans', 'Roboto', sans-serif");
      root.style.setProperty('--font-body', "'Roboto', 'Inter', sans-serif");
    } else if (org.font_preset === 'orbitron') {
      root.style.setProperty('--font-display', "'Orbitron', sans-serif");
    } else if (org.font_preset === 'space_grotesk') {
      root.style.setProperty('--font-display', "'Space Grotesk', sans-serif");
    } else if (org.font_preset === 'jetbrains') {
      root.style.setProperty('--font-display', "'Roboto Mono', monospace");
    }

    if (currentMode === 'light') {
      root.classList.add('light-theme');
      root.setAttribute('data-theme', 'light');
      root.style.setProperty('--bg-deep', '#f8f9fa');
      root.style.setProperty('--bg-panel', '#ffffff');
      root.style.setProperty('--bg-panel-hover', '#f1f3f4');
      root.style.setProperty('--border-hud', '#dadce0');
      root.style.setProperty('--text-main', '#1f1f1f');
      root.style.setProperty('--text-muted', '#444746');
      root.style.setProperty('--text-heading', '#1f1f1f');
      root.style.setProperty('--google-blue', '#0b57d0');
      root.style.setProperty('--google-red', '#b3261e');
      root.style.setProperty('--google-yellow', '#8f4700');
      root.style.setProperty('--google-green', '#137333');
    } else {
      root.classList.remove('light-theme');
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg-deep', '#1f1f1f');
      root.style.setProperty('--bg-panel', '#282a2d');
      root.style.setProperty('--bg-panel-hover', '#323639');
      root.style.setProperty('--border-hud', 'rgba(255, 255, 255, 0.14)');
      root.style.setProperty('--text-main', '#ffffff');
      root.style.setProperty('--text-muted', '#c4c7c5');
      root.style.setProperty('--text-heading', '#ffffff');
      root.style.setProperty('--google-blue', '#8ab4f8');
      root.style.setProperty('--google-red', '#f28b82');
      root.style.setProperty('--google-yellow', '#fdd663');
      root.style.setProperty('--google-green', '#81c995');
    }
  }

  public provisionNewOrganization(newOrg: Partial<Organization>): Promise<Organization> {
    const payload: Organization = {
      name: newOrg.name || 'NovaTech Cyber Academy',
      slug: (newOrg.name || 'novatech').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      subdomain: (newOrg.subdomain || 'novatech').toLowerCase(),
      slogan: newOrg.slogan || 'Next-Gen Cybernetic Competency Protocols',
      primary_color: newOrg.primary_color || '#00f3ff',
      secondary_color: newOrg.secondary_color || '#a855f7',
      accent_color: newOrg.accent_color || '#ff0055',
      theme_preset: newOrg.theme_preset || 'cyber_neon',
      font_preset: newOrg.font_preset || 'orbitron',
      default_mode: newOrg.default_mode || 'dark',
      enable_gamification: newOrg.enable_gamification ?? true,
      enable_quests: newOrg.enable_quests ?? true,
      enable_skill_tree: newOrg.enable_skill_tree ?? true,
      enable_sound_fx: newOrg.enable_sound_fx ?? true,
      enable_certificates: newOrg.enable_certificates ?? true,
      seat_capacity: newOrg.seat_capacity || 500,
      active_learners: 1,
    };

    return new Promise((resolve) => {
      this.http.post<Organization>(this.apiUrl, payload).subscribe({
        next: (created) => {
          this.organizations.update(list => [...list, created]);
          this.currentTenant.set(created);
          localStorage.setItem('synapse_active_tenant', created.slug);
          resolve(created);
        },
        error: () => {
          // Local fallback creation
          this.organizations.update(list => [...list, payload]);
          this.currentTenant.set(payload);
          localStorage.setItem('synapse_active_tenant', payload.slug);
          resolve(payload);
        }
      });
    });
  }

  public exportTenantConfig(org: Organization): string {
    const config = {
      synapse_version: '22.0.0-CYBER',
      generated_at: new Date().toISOString(),
      organization: {
        name: org.name,
        slug: org.slug,
        subdomain: org.subdomain,
        slogan: org.slogan,
        theme: {
          primary_color: org.primary_color,
          secondary_color: org.secondary_color,
          accent_color: org.accent_color,
          preset: org.theme_preset,
          font: org.font_preset,
          mode: org.default_mode || 'dark',
        },
        features: {
          gamification: org.enable_gamification,
          quests: org.enable_quests,
          skill_tree: org.enable_skill_tree,
          sound_fx: org.enable_sound_fx,
          certificates: org.enable_certificates,
        },
        deployment: {
          backend: 'Wagtail 5.2.8 LTS (Django 4.2)',
          frontend: 'Angular 22 (Standalone Signals)',
          docker_command: `docker run -d -p 8000:8000 -e TENANT_SLUG=${org.slug} synapse-lms:v2`
        }
      }
    };
    return JSON.stringify(config, null, 2);
  }

  private hexToRgb(hex: string): string {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }
}

