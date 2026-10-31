import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { filter } from 'rxjs';

import { TenantService } from '../../core/services/tenant.service';
import { GamificationService } from '../../core/services/gamification.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { AuthService, UserRole } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <header role="banner" class="sticky top-0 z-50 bg-[#1f1f1f]/95 dark:bg-[#1f1f1f]/95 light:bg-[#ffffff]/95 backdrop-blur-md border-b border-[var(--border-hud)] px-4 lg:px-8 py-2.5 transition-colors duration-200">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <!-- Left: Google Material Brand & Tenant Selector -->
        <div class="flex items-center gap-3 flex-shrink-0">
          
          <a routerLink="/" (click)="sound.playClick(); closeMobileMenu()" 
             aria-label="Synapse LMS Home Dashboard"
             class="flex items-center gap-2.5 group text-decoration-none flex-shrink-0">
            <!-- Google 4-Color Styled Monogram Logo -->
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--google-blue)]/15 border border-[var(--google-blue)]/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm flex-shrink-0">
              <span class="text-lg sm:text-xl font-display font-black text-[var(--google-blue)]">S</span>
            </div>
            
            <div class="flex-shrink-0">
              <div class="flex items-center gap-1.5 leading-tight">
                <span class="font-display font-bold text-base sm:text-lg tracking-wide text-[var(--text-main)]">SYNAPSE</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--google-blue)]/20 text-[var(--google-blue)] font-mono font-bold">LMS</span>
              </div>
              <div class="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1 truncate max-w-[120px] sm:max-w-[150px]">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                <span class="truncate">{{ tenantService.currentTenant().name }}</span>
              </div>
            </div>
          </a>

          <!-- Organization Switcher Dropdown (MatMenu) -->
          <div class="hidden sm:block flex-shrink-0">
            <button 
              type="button"
              [matMenuTriggerFor]="tenantMenu" 
              aria-label="Switch Active Organization Tenant"
              class="text-xs font-mono text-[var(--text-muted)] border border-[var(--border-hud)] bg-black/20 hover:bg-[var(--bg-panel-hover)] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 hover:border-[var(--google-blue)] hover:text-[var(--text-main)] transition-colors cursor-pointer flex-shrink-0">
              <span class="truncate max-w-[110px] lg:max-w-[130px]">{{ tenantService.currentTenant().name }}</span>
              <mat-icon class="text-sm scale-75 text-[var(--google-blue)] flex-shrink-0">arrow_drop_down</mat-icon>
            </button>

            <mat-menu #tenantMenu="matMenu" class="standard-dropdown-panel mat-elevation-z12">
              <div class="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-hud)]">
                Active Tenant Organizations
              </div>
              @for (org of tenantService.organizations(); track org.slug) {
                <button mat-menu-item (click)="switchTenant(org.slug); sound.playClick()" [class.font-bold]="org.slug === tenantService.currentTenant().slug">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full" [style.backgroundColor]="org.primary_color"></span>
                    <span class="text-xs text-[var(--text-main)]">{{ org.name }}</span>
                    @if (org.slug === tenantService.currentTenant().slug) {
                      <mat-icon class="text-emerald-500 text-xs scale-75 ml-auto">check</mat-icon>
                    }
                  </div>
                </button>
              }
              <mat-divider></mat-divider>
              <a mat-menu-item routerLink="/org-setup" (click)="sound.playClick()">
                <mat-icon class="text-[var(--neon-accent)] text-xs scale-75">settings</mat-icon>
                <span class="text-xs text-[var(--neon-accent)] font-medium">Provision New Tenant</span>
              </a>
            </mat-menu>
          </div>

        </div>

        <!-- Center: Standard Google Material Desktop Navigation with Dropdowns -->
        <nav aria-label="Main Navigation" class="hidden xl:flex items-center gap-1 flex-shrink-0">
          
          <!-- 1. Dashboard (Direct Route Link) -->
          <a routerLink="/dashboard" routerLinkActive="active-nav" (click)="sound.playClick()" 
             class="nav-link text-xs font-display font-medium px-2 py-1 rounded-lg transition-colors text-[var(--text-main)] hover:bg-[var(--bg-panel-hover)] flex items-center cursor-pointer">
            <span>Dashboard</span>
          </a>

          <!-- 2. Curricula Dropdown -->
          <button 
            type="button"
            [matMenuTriggerFor]="curriculaMenu"
            [class.active-nav]="isCurriculaActive()"
            aria-label="Curricula and Mission Pathways"
            class="nav-link text-xs font-display font-medium px-2 py-1 rounded-lg transition-colors text-[var(--text-main)] hover:bg-[var(--bg-panel-hover)] flex items-center gap-0.5 cursor-pointer">
            <span>Curricula</span>
            <mat-icon class="text-xs scale-75 text-[var(--text-muted)]">expand_more</mat-icon>
          </button>

          <mat-menu #curriculaMenu="matMenu" class="standard-dropdown-panel mat-elevation-z12" [overlapTrigger]="false">
            <div class="px-4 py-2 border-b border-[var(--border-hud)]">
              <div class="text-[10px] font-mono tracking-wider uppercase text-[var(--google-blue)] font-bold">
                Curriculum Catalog & Pathways
              </div>
            </div>
            
            <a mat-menu-item routerLink="/courses" (click)="sound.playClick()">
              <mat-icon class="text-[var(--google-blue)]">library_books</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Course Catalog</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">16 interactive mission modules with Python sandboxes</span>
              </div>
            </a>

            <a mat-menu-item routerLink="/skill-tree" (click)="sound.playClick()">
              <mat-icon class="text-purple-400">account_tree</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Neural Skill Web</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Interactive 4-tier competency constellation graph</span>
              </div>
            </a>

            <mat-divider></mat-divider>
            
            <div class="px-4 py-1.5 text-[10px] font-mono text-[var(--text-muted)] uppercase">
              Specialized Cognitive Tracks
            </div>

            <a mat-menu-item routerLink="/courses" [queryParams]="{ track: 'quantum' }" (click)="sound.playClick()">
              <span class="text-base mr-2" aria-hidden="true">⚛️</span>
              <span class="text-xs text-[#8ab4f8] font-bold">Quantum Computing & State Synthesis</span>
            </a>
            <a mat-menu-item routerLink="/courses" [queryParams]="{ track: 'cybersec' }" (click)="sound.playClick()">
              <span class="text-base mr-2" aria-hidden="true">🛡️</span>
              <span class="text-xs text-[#f28b82] font-bold">Zero-Trust Cyber Defense</span>
            </a>
            <a mat-menu-item routerLink="/courses" [queryParams]="{ track: 'ai' }" (click)="sound.playClick()">
              <span class="text-base mr-2" aria-hidden="true">🧠</span>
              <span class="text-xs text-[#fdd663] font-bold">Autonomous Neuromorphic AI</span>
            </a>
            <a mat-menu-item routerLink="/courses" [queryParams]="{ track: 'space' }" (click)="sound.playClick()">
              <span class="text-base mr-2" aria-hidden="true">🚀</span>
              <span class="text-xs text-[#81c995] font-bold">Aero-Space Engineering</span>
            </a>
          </mat-menu>

          <!-- 3. Learning Operations Dropdown -->
          <button 
            type="button"
            [matMenuTriggerFor]="opsMenu"
            [class.active-nav]="isOpsActive()"
            aria-label="Learning Operations and Gamification"
            class="nav-link text-xs font-display font-medium px-2 py-1 rounded-lg transition-colors text-[var(--text-main)] hover:bg-[var(--bg-panel-hover)] flex items-center gap-0.5 cursor-pointer">
            <span>Operations</span>
            <mat-icon class="text-xs scale-75 text-[var(--text-muted)]">expand_more</mat-icon>
          </button>

          <mat-menu #opsMenu="matMenu" class="standard-dropdown-panel mat-elevation-z12" [overlapTrigger]="false">
            <div class="px-4 py-2 border-b border-[var(--border-hud)]">
              <div class="text-[10px] font-mono tracking-wider uppercase text-amber-400 font-bold">
                Cadet Operations & Protocol Telemetry
              </div>
            </div>

            <a mat-menu-item routerLink="/quests" (click)="sound.playClick()">
              <mat-icon class="text-amber-400">military_tech</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Daily & Weekly Bounties</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Complete challenges, maintain streaks & claim XP</span>
              </div>
            </a>

            <a mat-menu-item routerLink="/certificate" (click)="sound.playClick()">
              <mat-icon class="text-amber-300">verified</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Verified Holographic Credentials</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Cryptographic hash verification & PDF export</span>
              </div>
            </a>

            <a mat-menu-item routerLink="/dashboard" (click)="sound.playClick()">
              <mat-icon class="text-[var(--google-blue)]">insights</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">D3 Pedagogical Velocity Matrix</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Multi-series telemetry tracking across all tracks</span>
              </div>
            </a>
          </mat-menu>

          <!-- 4. Instructor Studio Dropdown -->
          <button 
            type="button"
            [matMenuTriggerFor]="studioMenu"
            [class.active-nav]="isStudioActive()"
            aria-label="Instructor Studio"
            class="nav-link text-xs font-display font-medium px-2 py-1 rounded-lg transition-colors text-[var(--text-main)] hover:bg-[var(--bg-panel-hover)] flex items-center gap-0.5 cursor-pointer">
            <span>Studio</span>
            <mat-icon class="text-xs scale-75 text-[var(--text-muted)]">expand_more</mat-icon>
          </button>

          <mat-menu #studioMenu="matMenu" class="standard-dropdown-panel mat-elevation-z12" [overlapTrigger]="false">
            <div class="px-4 py-2 border-b border-[var(--border-hud)]">
              <div class="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold">
                Educator Command & Curriculum Engine
              </div>
            </div>

            <a mat-menu-item routerLink="/instructor" (click)="sound.playClick()">
              <mat-icon class="text-emerald-400">co_present</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Instructor Studio Command</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Manage live curriculums, pass rates & cohort telemetry</span>
              </div>
            </a>

            <a mat-menu-item routerLink="/instructor" (click)="sound.playClick()">
              <mat-icon class="text-cyan-400">add_circle</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Author Mission Module</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Deploy executable Python sandboxes & quiz benchmarks</span>
              </div>
            </a>

            <mat-divider></mat-divider>

            <a mat-menu-item href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer">
              <mat-icon class="text-[var(--google-blue)]">open_in_new</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Wagtail CMS Admin Portal ↗</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Backend PostgreSQL 18 content engine</span>
              </div>
            </a>
          </mat-menu>

          <!-- 5. Enterprise Admin Dropdown -->
          <button 
            type="button"
            [matMenuTriggerFor]="enterpriseMenu"
            [class.active-nav]="isEnterpriseActive()"
            aria-label="Enterprise Admin"
            class="nav-link text-xs font-display font-medium px-2 py-1 rounded-lg transition-colors text-[var(--neon-accent)] hover:bg-[var(--bg-panel-hover)] flex items-center gap-0.5 border border-[var(--neon-accent)]/30 cursor-pointer">
            <span>Enterprise</span>
            <mat-icon class="text-xs scale-75 text-[var(--neon-accent)]">expand_more</mat-icon>
          </button>

          <mat-menu #enterpriseMenu="matMenu" class="standard-dropdown-panel mat-elevation-z12" [overlapTrigger]="false">
            <div class="px-4 py-2 border-b border-[var(--border-hud)]">
              <div class="text-[10px] font-mono tracking-wider uppercase text-[var(--neon-accent)] font-bold">
                Multi-Tenant Architecture & Branding
              </div>
            </div>

            <a mat-menu-item routerLink="/org-setup" (click)="sound.playClick()">
              <mat-icon class="text-[var(--neon-accent)]">settings_suggest</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">White-Label Portal Wizard</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Custom neon/solar themes, subdomains & seat allocations</span>
              </div>
            </a>

            <a mat-menu-item routerLink="/org-setup" (click)="sound.playClick()">
              <mat-icon class="text-[var(--google-blue)]">domain</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Multi-Tenant Node Manager</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Provision isolated org instances with custom schemas</span>
              </div>
            </a>

            <a mat-menu-item routerLink="/org-setup" (click)="sound.playClick()">
              <mat-icon class="text-purple-400">download</mat-icon>
              <div class="flex flex-col text-left py-1">
                <span class="font-display font-bold text-xs text-[var(--text-main)]">Export Self-Hosted Package</span>
                <span class="text-[10px] font-mono text-[var(--text-muted)]">Download Docker compose & RDBMS seed bundle</span>
              </div>
            </a>
          </mat-menu>

        </nav>

        <!-- Right: Gamification HUD & Material Dropdown Controls -->
        <div class="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          
          <!-- Level & XP Indicator (Material Styled) -->
          <button 
            type="button"
            [matMenuTriggerFor]="profileMenu"
            class="flex items-center gap-2 bg-[#282a2d] dark:bg-[#282a2d] light:bg-[#ffffff] border border-[var(--border-hud)] px-2.5 py-1 rounded-xl text-left hover:border-[var(--google-blue)] transition-all cursor-pointer flex-shrink-0"
            matTooltip="View Cadet Clearance & Persona Settings">
            <div class="w-6 h-6 rounded-full bg-[var(--google-blue)] text-white flex items-center justify-center font-display font-bold text-xs shadow-sm flex-shrink-0">
              {{ gamification.profile().level }}
            </div>
            <div class="hidden sm:block text-left">
              <div class="text-[10px] font-mono text-[var(--text-muted)] flex items-center justify-between gap-2">
                <span>LVL {{ gamification.profile().level }}</span>
                <span class="text-[var(--google-blue)] font-bold">{{ gamification.profile().current_xp }} XP</span>
              </div>
              <div class="w-12 bg-slate-700/50 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div class="h-full bg-[var(--google-blue)] rounded-full transition-all duration-500"
                     [style.width.%]="gamification.profile().progress_to_next_level"></div>
              </div>
            </div>
            <mat-icon class="text-xs scale-75 text-[var(--text-muted)] hidden sm:inline-block">arrow_drop_down</mat-icon>
          </button>

          <!-- Cadet Profile & Persona Dropdown Menu -->
          <mat-menu #profileMenu="matMenu" class="standard-dropdown-panel mat-elevation-z12">
            <div class="px-4 py-3 border-b border-[var(--border-hud)] space-y-1">
              <div class="text-[10px] font-mono tracking-wider uppercase text-[var(--google-blue)] font-bold">
                Cadet Identification
              </div>
              <div class="font-display font-bold text-sm text-[var(--text-main)]">
                {{ gamification.profile().callsign }}
              </div>
              <div class="text-xs text-[var(--text-muted)] font-mono">
                Active Streak: 🔥 {{ gamification.profile().streak_days }} Days
              </div>
            </div>

            <!-- Role Switcher inside Dropdown -->
            <div class="px-3 py-2 text-[10px] font-mono uppercase text-[var(--text-muted)]">
              Switch Persona Role
            </div>
            <button mat-menu-item (click)="onRoleChange('LEARNER')">
              <div class="flex items-center justify-between w-full">
                <span>🎓 Cadet Learner</span>
                @if (auth.activeRole() === 'LEARNER') {
                  <mat-icon class="text-emerald-500 text-xs scale-75">check</mat-icon>
                }
              </div>
            </button>
            <button mat-menu-item (click)="onRoleChange('INSTRUCTOR')">
              <div class="flex items-center justify-between w-full">
                <span>👨‍🏫 Lead Instructor</span>
                @if (auth.activeRole() === 'INSTRUCTOR') {
                  <mat-icon class="text-emerald-500 text-xs scale-75">check</mat-icon>
                }
              </div>
            </button>
            <button mat-menu-item (click)="onRoleChange('ORG_ADMIN')">
              <div class="flex items-center justify-between w-full">
                <span>⚙️ Organization Admin</span>
                @if (auth.activeRole() === 'ORG_ADMIN') {
                  <mat-icon class="text-emerald-500 text-xs scale-75">check</mat-icon>
                }
              </div>
            </button>
            
            <mat-divider></mat-divider>
            <a mat-menu-item routerLink="/certificate" (click)="sound.playClick()">
              <mat-icon class="text-amber-400">verified</mat-icon>
              <span>Holographic Certificate</span>
            </a>
          </mat-menu>

          <!-- Streak Badge (Visible on sm+ screens) -->
          <div class="hidden sm:flex items-center gap-1 bg-[#282a2d] border border-amber-500/40 px-2.5 py-1 rounded-xl text-xs font-mono text-amber-400 flex-shrink-0"
               matTooltip="Active Consecutive Daily Streak">
            <span>🔥</span>
            <span class="font-bold">{{ gamification.profile().streak_days }}d</span>
          </div>

          <!-- Sound FX Button -->
          <button 
            type="button"
            (click)="sound.toggleMute()" 
            [matTooltip]="sound.isMuted() ? 'Audio Muted (Click to Unmute)' : 'Sound FX Active (Click to Mute)'"
            class="w-8 h-8 rounded-xl bg-[#282a2d] border border-[var(--border-hud)] flex items-center justify-center text-xs text-[var(--text-muted)] hover:text-white transition-colors flex-shrink-0 cursor-pointer">
            <span>{{ sound.isMuted() ? '🔇' : '🔊' }}</span>
          </button>

          <!-- Google Theme Switcher Dropdown (MatMenu) -->
          <button 
            type="button"
            [matMenuTriggerFor]="themeMenu"
            matTooltip="Toggle Theme Palette"
            class="w-8 h-8 rounded-xl bg-[#282a2d] border border-[var(--border-hud)] flex items-center justify-center text-xs hover:border-[var(--google-blue)] transition-colors flex-shrink-0 cursor-pointer">
            <span>{{ tenantService.themeMode() === 'light' ? '☀️' : '🌙' }}</span>
          </button>

          <mat-menu #themeMenu="matMenu">
            <div class="px-3 py-2 text-[10px] font-mono uppercase text-[var(--text-muted)] border-b border-[var(--border-hud)]">
              Display Theme Mode
            </div>
            <button mat-menu-item (click)="setThemeMode('light')">
              <span class="flex items-center gap-2">
                <span>☀️</span>
                <span>Google Solar Light</span>
                @if (tenantService.themeMode() === 'light') {
                  <mat-icon class="text-emerald-500 text-xs scale-75 ml-auto">check</mat-icon>
                }
              </span>
            </button>
            <button mat-menu-item (click)="setThemeMode('dark')">
              <span class="flex items-center gap-2">
                <span>🌙</span>
                <span>Google Material Dark</span>
                @if (tenantService.themeMode() === 'dark') {
                  <mat-icon class="text-emerald-500 text-xs scale-75 ml-auto">check</mat-icon>
                }
              </span>
            </button>
          </mat-menu>

          <!-- Mobile Hamburger Drawer Toggle (xl:hidden) -->
          <button 
            type="button"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Toggle Mobile Navigation Drawer"
            class="xl:hidden w-8 h-8 rounded-xl bg-[#282a2d] border border-[var(--border-hud)] flex items-center justify-center text-sm text-[var(--google-blue)] hover:border-[var(--google-blue)] transition-colors flex-shrink-0 cursor-pointer">
            <span>{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
          </button>

        </div>

      </div>

      <!-- Mobile / Tablet Navigation Drawer -->
      @if (mobileMenuOpen()) {
        <div class="xl:hidden border-t border-[var(--border-hud)] mt-3 pt-3 pb-3 space-y-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
          
          <!-- Category 0: Dashboard Direct Link -->
          <div class="px-1">
            <a routerLink="/dashboard" (click)="sound.playClick(); closeMobileMenu()" 
               class="p-2.5 rounded-xl border border-[var(--google-blue)]/40 bg-[var(--google-blue)]/10 text-xs font-display text-[var(--google-blue)] flex items-center gap-2 font-bold shadow-sm">
              <mat-icon class="text-sm scale-90">dashboard</mat-icon>
              <span>Cadet Mission Dashboard</span>
            </a>
          </div>
          
          <!-- Category 1: Curricula & Courses -->
          <div class="space-y-1.5 px-1">
            <div class="text-[10px] font-mono text-[var(--google-blue)] uppercase font-bold px-1 flex items-center gap-1.5">
              <mat-icon class="text-xs scale-75">school</mat-icon>
              <span>Curricula & Pathways</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a routerLink="/courses" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[var(--border-hud)] bg-[var(--bg-panel)] text-xs font-display text-[var(--text-main)] flex items-center gap-1.5">
                <mat-icon class="text-xs scale-75 text-[var(--google-blue)]">library_books</mat-icon>
                <span>Course Catalog</span>
              </a>
              <a routerLink="/skill-tree" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[var(--border-hud)] bg-[var(--bg-panel)] text-xs font-display text-[var(--text-main)] flex items-center gap-1.5">
                <mat-icon class="text-xs scale-75 text-purple-400">account_tree</mat-icon>
                <span>Skill Web</span>
              </a>
            </div>

            <!-- Mobile Tracks Strip -->
            <div class="grid grid-cols-2 gap-2 pt-1">
              <a routerLink="/courses" [queryParams]="{ track: 'quantum' }" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[#1a73e8]/40 bg-[#1a73e8]/10 text-xs font-display text-[#8ab4f8] flex items-center gap-1.5">
                <span>⚛️</span> Quantum
              </a>
              <a routerLink="/courses" [queryParams]="{ track: 'cybersec' }" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[#ea4335]/40 bg-[#ea4335]/10 text-xs font-display text-[#f28b82] flex items-center gap-1.5">
                <span>🛡️</span> Cybersec
              </a>
              <a routerLink="/courses" [queryParams]="{ track: 'ai' }" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[#fbbc04]/40 bg-[#fbbc04]/10 text-xs font-display text-[#fdd663] flex items-center gap-1.5">
                <span>🧠</span> AI Systems
              </a>
              <a routerLink="/courses" [queryParams]="{ track: 'space' }" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[#34a853]/40 bg-[#34a853]/10 text-xs font-display text-[#81c995] flex items-center gap-1.5">
                <span>🚀</span> Aero-Space
              </a>
            </div>
          </div>

          <!-- Category 2: Operations & Quests -->
          <div class="space-y-1.5 px-1 pt-1 border-t border-[var(--border-hud)]">
            <div class="text-[10px] font-mono text-amber-400 uppercase font-bold px-1 flex items-center gap-1.5">
              <mat-icon class="text-xs scale-75">military_tech</mat-icon>
              <span>Operations & Credentials</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a routerLink="/quests" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[var(--border-hud)] bg-[var(--bg-panel)] text-xs font-display text-[var(--text-main)] flex items-center gap-1.5">
                <mat-icon class="text-xs scale-75 text-amber-400">military_tech</mat-icon>
                <span>Bounties ({{ gamification.quests().length }})</span>
              </a>
              <a routerLink="/certificate" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[var(--border-hud)] bg-[var(--bg-panel)] text-xs font-display text-[var(--text-main)] flex items-center gap-1.5">
                <mat-icon class="text-xs scale-75 text-amber-300">verified</mat-icon>
                <span>Credentials</span>
              </a>
            </div>
          </div>

          <!-- Category 3: Studio & Enterprise -->
          <div class="space-y-1.5 px-1 pt-1 border-t border-[var(--border-hud)]">
            <div class="text-[10px] font-mono text-emerald-400 uppercase font-bold px-1 flex items-center gap-1.5">
              <mat-icon class="text-xs scale-75">settings</mat-icon>
              <span>Studio & Enterprise</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a routerLink="/instructor" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[var(--border-hud)] bg-[var(--bg-panel)] text-xs font-display text-[var(--text-main)] flex items-center gap-1.5">
                <mat-icon class="text-xs scale-75 text-emerald-400">co_present</mat-icon>
                <span>Studio</span>
              </a>
              <a routerLink="/org-setup" (click)="sound.playClick(); closeMobileMenu()" 
                 class="p-2 rounded-lg border border-[var(--neon-accent)]/40 bg-[var(--bg-panel)] text-xs font-display text-[var(--neon-accent)] flex items-center gap-1.5">
                <mat-icon class="text-xs scale-75 text-[var(--neon-accent)]">admin_panel_settings</mat-icon>
                <span>Org Portal ⚡</span>
              </a>
            </div>
          </div>

        </div>
      }

    </header>
  `,
  styles: [`
    .active-nav {
      color: var(--google-blue) !important;
      background-color: rgba(26, 115, 232, 0.12) !important;
      font-weight: 700 !important;
    }
  `]
})
export class HeaderComponent {
  public router = inject(Router);
  public tenantService = inject(TenantService);
  public gamification = inject(GamificationService);
  public sound = inject(SoundFxService);
  public auth = inject(AuthService);

  public mobileMenuOpen = signal<boolean>(false);
  public currentUrl = signal<string>(this.router.url);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentUrl.set(e.urlAfterRedirects || e.url);
    });
  }

  public isCurriculaActive = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/courses') || url.startsWith('/skill-tree');
  });

  public isOpsActive = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/quests') || url.startsWith('/certificate');
  });

  public isStudioActive = computed(() => {
    return this.currentUrl().startsWith('/instructor');
  });

  public isEnterpriseActive = computed(() => {
    return this.currentUrl().startsWith('/org-setup');
  });

  public toggleMobileMenu(): void {
    this.sound.playClick();
    this.mobileMenuOpen.update(v => !v);
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  public switchTenant(slug: string): void {
    this.tenantService.switchTenant(slug);
  }

  public setThemeMode(mode: 'dark' | 'light'): void {
    this.sound.playClick();
    this.tenantService.setThemeMode(mode);
  }

  public onRoleChange(role: UserRole): void {
    this.sound.playClick();
    this.auth.setRole(role);
  }
}
