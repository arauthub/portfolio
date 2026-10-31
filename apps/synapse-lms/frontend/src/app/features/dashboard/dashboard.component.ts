import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

import { GamificationService } from '../../core/services/gamification.service';
import { TenantService } from '../../core/services/tenant.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { D3LearningVelocityComponent } from '../../shared/components/d3-learning-velocity.component';
import { Badge, Course } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatIconModule,
    MatBadgeModule,
    D3LearningVelocityComponent
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- 1. Hero & Welcome Action Banner -->
      <section aria-label="Cadet Command Banner" class="glass-panel p-6 rounded-2xl border-l-4 border-l-[var(--google-blue)] space-y-4">
        
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Avatar Monogram with Level Badge -->
            <div class="relative flex-shrink-0">
              <div class="w-14 h-14 rounded-2xl bg-[var(--google-blue)]/15 border border-[var(--google-blue)]/40 flex items-center justify-center text-2xl font-display font-black text-[var(--google-blue)] shadow-md">
                {{ auth.currentPersona().callsign.charAt(0) }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--google-blue)] text-white text-[10px] font-mono font-bold flex items-center justify-center border-2 border-[var(--bg-deep)]">
                {{ gamification.profile().level }}
              </div>
            </div>

            <!-- Callsign & Status -->
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h1 class="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                  Welcome back, {{ auth.currentPersona().callsign }}
                </h1>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-[var(--google-blue)]/15 text-[var(--google-blue)] border border-[var(--google-blue)]/30 font-mono font-bold">
                  {{ auth.currentPersona().rank }}
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Synchronized
                </span>
              </div>
              <p class="text-xs text-[var(--text-muted)] mt-1">
                Active Tenant Node: <strong class="text-[var(--text-main)]">{{ tenantService.currentTenant().name }}</strong> ({{ tenantService.currentTenant().subdomain }}.synapse.net)
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap pt-2 md:pt-0">
            <a routerLink="/courses/quantum-ai-architecture" (click)="sound.playClick()" class="cyber-btn text-xs">
              ⚡ Resume Mission Lab
            </a>
            <a routerLink="/quests" (click)="sound.playClick()" class="cyber-btn cyber-btn-secondary text-xs">
              🎯 Daily Quests ({{ gamification.quests().length }})
            </a>
          </div>
        </div>

        <!-- Micro-habit Streak & Daily Goal Indicator -->
        <div class="pt-3 border-t border-[var(--border-hud)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div class="flex items-center gap-2 text-amber-400">
            <span class="text-base" aria-hidden="true">🔥</span>
            <span><strong>{{ gamification.profile().streak_days }}-Day Consecutive Streak!</strong> Complete 1 module today to extend to Day 7.</span>
          </div>

          <div class="flex items-center gap-3 text-[var(--text-muted)]">
            <span>Daily XP Velocity: <strong class="text-[var(--google-blue)]">300 / 500 XP</strong></span>
            <div class="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div class="h-full bg-[var(--google-blue)] rounded-full" style="width: 60%"></div>
            </div>
          </div>
        </div>

      </section>

      <!-- 2. Four Key Performance Indicator (KPI) Cards -->
      <section aria-label="Learner Key Telemetry" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <!-- KPI 1: Total XP -->
        <div class="glass-panel p-4 sm:p-5 space-y-2 rounded-2xl border-t-2 border-t-[var(--google-blue)]">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[10px] sm:text-xs font-mono uppercase text-[var(--text-muted)] truncate">Experience Points</span>
            <span class="text-[10px] sm:text-xs font-mono text-emerald-400 font-bold flex-shrink-0">↑ +18%</span>
          </div>
          <div class="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {{ gamification.profile().current_xp }}
          </div>
          <div class="text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] truncate">
            Clearance: Level {{ gamification.profile().level }} Cadet
          </div>
        </div>

        <!-- KPI 2: Active Streak -->
        <div class="glass-panel p-4 sm:p-5 space-y-2 rounded-2xl border-t-2 border-t-amber-400">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[10px] sm:text-xs font-mono uppercase text-[var(--text-muted)] truncate">Active Hack Streak</span>
            <span class="text-xs flex-shrink-0">🔥</span>
          </div>
          <div class="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
            {{ gamification.profile().streak_days }} Days
          </div>
          <div class="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold truncate">
            ✓ Streak Protection Active
          </div>
        </div>

        <!-- KPI 3: Skills Mastered -->
        <div class="glass-panel p-4 sm:p-5 space-y-2 rounded-2xl border-t-2 border-t-purple-400">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[10px] sm:text-xs font-mono uppercase text-[var(--text-muted)] truncate">Skills Mastered</span>
            <span class="text-[10px] sm:text-xs font-mono text-purple-400 flex-shrink-0">Tier 1-4</span>
          </div>
          <div class="text-2xl sm:text-3xl font-display font-extrabold text-purple-400">
            {{ gamification.profile().unlocked_skills.length }} Nodes
          </div>
          <div class="text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] truncate">
            Across 4 Curriculum Webs
          </div>
        </div>

        <!-- KPI 4: Cyber Badges -->
        <div class="glass-panel p-4 sm:p-5 space-y-2 rounded-2xl border-t-2 border-t-[#ea4335]">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[10px] sm:text-xs font-mono uppercase text-[var(--text-muted)] truncate">Earned Trophies</span>
            <span class="text-[10px] sm:text-xs font-mono text-[#ea4335] font-bold flex-shrink-0">Verified</span>
          </div>
          <div class="text-2xl sm:text-3xl font-display font-extrabold text-[#f28b82]">
            {{ gamification.allBadges().length }}
          </div>
          <div class="text-[10px] sm:text-[11px] font-mono text-[var(--text-muted)] truncate">
            1 On-Chain Verified Hash
          </div>
        </div>

      </section>

      <!-- 3. Primary Learning Pathway: "Jump Back In" with Track Switcher -->
      <section aria-labelledby="active-mission-heading" class="cyber-card p-6 rounded-2xl space-y-6">
        
        <!-- Track Tabs Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-hud)] pb-4">
          <div>
            <div class="text-xs font-mono text-[var(--google-blue)] uppercase tracking-wider font-bold">
              CONTINUE LEARNING PATHWAY
            </div>
            <h2 id="active-mission-heading" class="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
              Current Enrollment Modules
            </h2>
          </div>

          <!-- Track Selector Tabs with Google Colors -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <button 
              type="button"
              (click)="activeTrackTab.set('quantum')"
              [class.bg-[#1a73e8]/20]="activeTrackTab() === 'quantum'"
              [class.text-[#8ab4f8]]="activeTrackTab() === 'quantum'"
              [class.border-[#1a73e8]]="activeTrackTab() === 'quantum'"
              class="px-3 py-1.5 rounded-xl border border-[var(--border-hud)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-all">
              ⚛️ Quantum
            </button>
            <button 
              type="button"
              (click)="activeTrackTab.set('cybersec')"
              [class.bg-[#ea4335]/20]="activeTrackTab() === 'cybersec'"
              [class.text-[#f28b82]]="activeTrackTab() === 'cybersec'"
              [class.border-[#ea4335]]="activeTrackTab() === 'cybersec'"
              class="px-3 py-1.5 rounded-xl border border-[var(--border-hud)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-all">
              🛡️ Cybersec
            </button>
            <button 
              type="button"
              (click)="activeTrackTab.set('ai')"
              [class.bg-[#fbbc04]/20]="activeTrackTab() === 'ai'"
              [class.text-[#fdd663]]="activeTrackTab() === 'ai'"
              [class.border-[#fbbc04]]="activeTrackTab() === 'ai'"
              class="px-3 py-1.5 rounded-xl border border-[var(--border-hud)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-all">
              🧠 AI
            </button>
            <button 
              type="button"
              (click)="activeTrackTab.set('space')"
              [class.bg-[#34a853]/20]="activeTrackTab() === 'space'"
              [class.text-[#81c995]]="activeTrackTab() === 'space'"
              [class.border-[#34a853]]="activeTrackTab() === 'space'"
              class="px-3 py-1.5 rounded-xl border border-[var(--border-hud)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-all">
              🚀 Space
            </button>
          </div>
        </div>

        <!-- Active Track Mission Details -->
        @if (selectedCourse(); as course) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div class="lg:col-span-2 space-y-4">
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono px-2.5 py-0.5 rounded-full uppercase font-bold border"
                      [class.border-[#1a73e8]/40]="course.track === 'quantum'"
                      [class.bg-[#1a73e8]/10]="course.track === 'quantum'"
                      [class.text-[#8ab4f8]]="course.track === 'quantum'"
                      [class.border-[#ea4335]/40]="course.track === 'cybersec'"
                      [class.bg-[#ea4335]/10]="course.track === 'cybersec'"
                      [class.text-[#f28b82]]="course.track === 'cybersec'"
                      [class.border-[#fbbc04]/40]="course.track === 'ai'"
                      [class.bg-[#fbbc04]/10]="course.track === 'ai'"
                      [class.text-[#fdd663]]="course.track === 'ai'"
                      [class.border-[#34a853]/40]="course.track === 'space'"
                      [class.bg-[#34a853]/10]="course.track === 'space'"
                      [class.text-[#81c995]]="course.track === 'space'">
                  {{ course.track | uppercase }} TRACK
                </span>
                <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">
                  {{ course.difficulty }} TIER
                </span>
              </div>

              <div>
                <h3 class="text-2xl font-display font-bold text-white tracking-tight">
                  {{ course.title }}
                </h3>
                <p class="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  {{ course.subtitle }}
                </p>
              </div>

              <!-- Module Progress Bar -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-[var(--text-muted)]">Curriculum Completion:</span>
                  <span class="text-[var(--google-blue)] font-bold">2 of {{ course.lessons_count || 3 }} Lessons Mastered (66%)</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="66" class="rounded-full"></mat-progress-bar>
              </div>

              <!-- Next Lesson Quick Link -->
              <div class="p-3 rounded-xl bg-[#1f1f1f] border border-[var(--border-hud)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-amber-400 flex-shrink-0">▶ Next Lab:</span>
                  <span class="text-white font-bold truncate">Holographic Quantum Gate Simulation</span>
                </div>
                <span class="text-[var(--text-muted)] flex-shrink-0">⏱ 20 mins</span>
              </div>
            </div>

            <!-- CTA Card Column -->
            <div class="bg-[#1f1f1f] border border-[var(--border-hud)] p-5 rounded-2xl space-y-4 text-center">
              <div class="text-4xl" aria-hidden="true">
                {{ course.track === 'quantum' ? '⚛️' : course.track === 'cybersec' ? '🛡️' : course.track === 'ai' ? '🧠' : '🚀' }}
              </div>
              <div>
                <div class="text-xs font-mono text-[var(--text-muted)] uppercase">Next Milestone XP</div>
                <div class="text-2xl font-display font-bold text-amber-400">+{{ course.xp_reward }} XP</div>
              </div>

              <a [routerLink]="['/courses', course.slug]" (click)="sound.playClick()" class="cyber-btn w-full text-center text-xs justify-center">
                Launch Code Sandbox 🚀
              </a>
              <a routerLink="/courses" (click)="sound.playClick()" class="text-xs font-mono text-[var(--google-blue)] hover:underline block">
                Browse All 16 Missions →
              </a>
            </div>

          </div>
        }

      </section>

      <!-- 4. D3 Pedagogical Telemetry Matrix -->
      <section aria-label="Interactive Telemetry Visualization">
        <app-d3-learning-velocity></app-d3-learning-velocity>
      </section>

      <!-- 5. Operational Quests & Peer Leaderboard -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Daily Bounties & Ops -->
        <section aria-labelledby="quests-heading" class="glass-panel p-6 space-y-4 rounded-2xl">
          <div class="flex items-center justify-between">
            <h2 id="quests-heading" class="font-display font-bold text-base text-white flex items-center gap-2">
              <span aria-hidden="true">🎯</span> DAILY BOUNTIES & OPS
            </h2>
            <a routerLink="/quests" (click)="sound.playClick()" class="text-xs font-mono text-[var(--google-blue)] hover:underline">
              View All Bounties →
            </a>
          </div>

          <div class="space-y-3">
            @for (quest of gamification.quests().slice(0, 3); track quest.code) {
              <div class="bg-[#1f1f1f] border border-[var(--border-hud)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[var(--google-blue)]/50 transition-colors">
                <div class="space-y-1.5 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-display font-bold text-white">{{ quest.title }}</span>
                    <span class="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold">
                      +{{ quest.xp_reward }} XP
                    </span>
                  </div>
                  <p class="text-xs text-[var(--text-muted)] leading-relaxed">{{ quest.description }}</p>
                  
                  <div class="flex items-center gap-3 pt-1">
                    <div class="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div class="h-full bg-[var(--google-blue)]" 
                           [style.width.%]="(quest.current_progress! / quest.target_count) * 100"></div>
                    </div>
                    <span class="text-[10px] font-mono text-[var(--text-muted)]">
                      {{ quest.current_progress }} / {{ quest.target_count }}
                    </span>
                  </div>
                </div>

                <div class="flex-shrink-0 pt-1 sm:pt-0">
                  @if (quest.is_claimed) {
                    <span class="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold">
                      ✓ Claimed
                    </span>
                  } @else if (quest.current_progress! >= quest.target_count) {
                    <button (click)="onClaimQuest(quest.code)" class="cyber-btn cyber-btn-accent text-xs">
                      Claim Bounty 🎁
                    </button>
                  } @else {
                    <span class="text-xs font-mono text-[var(--text-muted)] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg inline-block">
                      In Progress
                    </span>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Live Cohort Leaderboard & Peer Pulse -->
        <section aria-labelledby="leaderboard-heading" class="glass-panel p-6 space-y-4 rounded-2xl">
          <div class="flex items-center justify-between">
            <h2 id="leaderboard-heading" class="font-display font-bold text-base text-white flex items-center gap-2">
              <span aria-hidden="true">🎖️</span> COHORT LEADERBOARD
            </h2>
            <span class="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Synchronized
            </span>
          </div>

          <div class="space-y-2.5">
            @for (cadet of gamification.leaderboard(); track cadet.callsign) {
              <div 
                [class.border-[var(--google-blue)]]="cadet.callsign === gamification.profile().callsign"
                [class.bg-[var(--google-blue)]/5]="cadet.callsign === gamification.profile().callsign"
                class="p-3 rounded-xl bg-[#1f1f1f] border border-[var(--border-hud)] flex items-center justify-between gap-3 text-xs font-mono transition-colors">
                
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Rank Circle -->
                  <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                       [class.bg-amber-400]="cadet.rank === 1"
                       [class.text-black]="cadet.rank === 1"
                       [class.bg-slate-300]="cadet.rank === 2"
                       [class.text-slate-900]="cadet.rank === 2"
                       [class.bg-amber-700]="cadet.rank === 3"
                       [class.text-white]="cadet.rank === 3"
                       [class.bg-slate-800]="cadet.rank > 3"
                       [class.text-slate-400]="cadet.rank > 3">
                    {{ cadet.rank }}
                  </div>

                  <div class="min-w-0">
                    <div class="font-display font-bold text-white flex items-center gap-1.5 truncate">
                      <span class="truncate">{{ cadet.callsign }}</span>
                      @if (cadet.callsign === gamification.profile().callsign) {
                        <span class="text-[9px] px-1.5 py-0.2 rounded bg-[var(--google-blue)] text-white font-mono flex-shrink-0">YOU</span>
                      }
                    </div>
                    <div class="text-[10px] text-[var(--text-muted)] truncate">
                      Level {{ cadet.level }} • {{ cadet.streak }}d Streak
                    </div>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <div class="font-bold text-[var(--google-blue)]">{{ cadet.xp }} XP</div>
                  <div class="text-[10px] text-slate-500">{{ cadet.badges }} Badges</div>
                </div>
              </div>
            }
          </div>
        </section>

      </div>

      <!-- 6. Holographic Trophy Case with Interactive Inspector -->
      <section aria-labelledby="trophy-heading" class="glass-panel p-6 space-y-4 rounded-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="trophy-heading" class="font-display font-bold text-base text-white flex items-center gap-2">
              <span aria-hidden="true">🏆</span> HOLOGRAPHIC TROPHY CASE
            </h2>
            <p class="text-xs text-[var(--text-muted)] mt-0.5">Click any badge to inspect cryptographic credentials and unlocked metadata</p>
          </div>
          
          <!-- Rarity Filter Pills -->
          <div class="flex items-center gap-1 flex-wrap">
            <button 
              type="button"
              (click)="selectedBadgeRarity.set('ALL')"
              [class.bg-[var(--google-blue)]/20]="selectedBadgeRarity() === 'ALL'"
              [class.text-[var(--google-blue)]]="selectedBadgeRarity() === 'ALL'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] hover:text-white transition-colors">
              All
            </button>
            <button 
              type="button"
              (click)="selectedBadgeRarity.set('LEGENDARY')"
              [class.bg-amber-500/20]="selectedBadgeRarity() === 'LEGENDARY'"
              [class.text-amber-400]="selectedBadgeRarity() === 'LEGENDARY'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] hover:text-white transition-colors">
              Legendary
            </button>
            <button 
              type="button"
              (click)="selectedBadgeRarity.set('EPIC')"
              [class.bg-purple-500/20]="selectedBadgeRarity() === 'EPIC'"
              [class.text-purple-400]="selectedBadgeRarity() === 'EPIC'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] hover:text-white transition-colors">
              Epic
            </button>
            <button 
              type="button"
              (click)="selectedBadgeRarity.set('RARE')"
              [class.bg-cyan-500/20]="selectedBadgeRarity() === 'RARE'"
              [class.text-cyan-400]="selectedBadgeRarity() === 'RARE'"
              class="px-2.5 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] hover:text-white transition-colors">
              Rare
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          @for (badge of filteredBadges(); track badge.code) {
            <button 
              type="button"
              (click)="inspectBadge(badge)"
              [ngClass]="'badge-' + badge.rarity.toLowerCase()"
              class="rounded-xl p-3 flex flex-col items-center text-center space-y-1.5 relative overflow-hidden group cursor-pointer hover:scale-105 transition-all focus:outline-none focus:ring-1 focus:ring-[var(--google-blue)]">
              
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-black/40 border border-current shadow-lg">
                {{ badge.icon_name === 'atom' ? '⚛️' : badge.icon_name === 'shield-check' ? '🛡️' : badge.icon_name === 'cpu' ? '🧠' : badge.icon_name === 'sparkles' ? '✨' : '💻' }}
              </div>

              <div>
                <div class="font-display font-bold text-xs leading-tight text-white">{{ badge.title }}</div>
                <div class="text-[9px] font-mono tracking-wider uppercase opacity-80 mt-0.5">{{ badge.rarity }}</div>
              </div>

              <div class="text-[9px] font-mono font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded-full">
                +{{ badge.xp_bonus }} XP
              </div>
            </button>
          }
        </div>
      </section>

      <!-- 7. Interactive Badge Inspector Dialog Modal -->
      @if (inspectedBadge(); as b) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
             role="dialog" aria-modal="true" aria-labelledby="badge-modal-title">
          <div class="glass-panel p-6 sm:p-8 max-w-md w-full space-y-5 rounded-2xl border border-[var(--google-blue)]/50 shadow-2xl">
            
            <div class="flex items-center justify-between pb-2 border-b border-[var(--border-hud)]">
              <span class="text-xs font-mono uppercase tracking-wider text-[var(--google-blue)] font-bold">
                Cryptographic Badge Verification
              </span>
              <button (click)="closeBadgeInspector()" class="text-slate-400 hover:text-white text-lg">✕</button>
            </div>

            <div class="text-center space-y-3 py-2">
              <div class="w-16 h-16 mx-auto rounded-full bg-[var(--google-blue)]/15 border border-[var(--google-blue)]/40 flex items-center justify-center text-3xl shadow-lg">
                {{ b.icon_name === 'atom' ? '⚛️' : b.icon_name === 'shield-check' ? '🛡️' : b.icon_name === 'cpu' ? '🧠' : b.icon_name === 'sparkles' ? '✨' : '💻' }}
              </div>

              <div>
                <h3 id="badge-modal-title" class="text-xl font-display font-bold text-white">{{ b.title }}</h3>
                <span class="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold inline-block mt-1">
                  {{ b.rarity }} ACHIEVEMENT
                </span>
              </div>

              <p class="text-xs text-[var(--text-muted)] leading-relaxed">
                {{ b.description }}
              </p>
            </div>

            <div class="p-3 bg-[#18191c] rounded-xl border border-[var(--border-hud)] font-mono text-xs space-y-1.5 text-[var(--text-muted)]">
              <div class="flex justify-between">
                <span>XP Bonus Awarded:</span>
                <span class="text-amber-400 font-bold">+{{ b.xp_bonus }} XP</span>
              </div>
              <div class="flex justify-between">
                <span>On-Chain Verification:</span>
                <span class="text-emerald-400">0x7f9a...e12c (Verified)</span>
              </div>
              <div class="flex justify-between">
                <span>Authorized Authority:</span>
                <span class="text-slate-200">Curriculum Council</span>
              </div>
            </div>

            <div class="pt-2">
              <button (click)="closeBadgeInspector()" class="cyber-btn w-full justify-center text-xs">
                Close Verification
              </button>
            </div>

          </div>
        </div>
      }

      <!-- 8. Accelerated Portal Navigation Cards -->
      <section aria-label="Portal Shortcuts" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a routerLink="/skill-tree" (click)="sound.playClick()" 
           class="glass-panel p-6 group hover:border-[var(--google-blue)] transition-all cursor-pointer block text-decoration-none rounded-2xl">
          <div class="text-3xl mb-3" aria-hidden="true">🕸️</div>
          <h3 class="font-display font-bold text-lg text-white group-hover:text-[var(--google-blue)] transition-colors">
            Neural Skill Tree
          </h3>
          <p class="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
            Interact with the visual 4-tier node graph to master quantum computing, zero-trust protocols, neuromorphic circuits, and warp flight.
          </p>
          <div class="mt-4 text-xs font-display text-[var(--google-blue)] flex items-center gap-1 font-bold">
            Explore Graph Nodes →
          </div>
        </a>

        <a routerLink="/courses" (click)="sound.playClick()" 
           class="glass-panel p-6 group hover:border-purple-500 transition-all cursor-pointer block text-decoration-none rounded-2xl">
          <div class="text-3xl mb-3" aria-hidden="true">🌌</div>
          <h3 class="font-display font-bold text-lg text-white group-hover:text-purple-400 transition-colors">
            Mission Tracks (16 Courses)
          </h3>
          <p class="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
            Browse 16 interactive curriculum tracks across Quantum, Cybersec, AI, and Space with hands-on code sandboxes and assessments.
          </p>
          <div class="mt-4 text-xs font-display text-purple-400 flex items-center gap-1 font-bold">
            Launch Course Catalog →
          </div>
        </a>

        <a routerLink="/org-setup" (click)="sound.playClick()" 
           class="glass-panel p-6 group hover:border-[var(--neon-accent)] transition-all cursor-pointer block text-decoration-none rounded-2xl">
          <div class="text-3xl mb-3" aria-hidden="true">⚡</div>
          <h3 class="font-display font-bold text-lg text-white group-hover:text-[var(--neon-accent)] transition-colors">
            White-Label Deployment
          </h3>
          <p class="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
            Self-hosted setup wizard for enterprises: customize theme palettes (Dark Cyber Void & Solar High-Tech Light) and export container configs.
          </p>
          <div class="mt-4 text-xs font-display text-[var(--neon-accent)] flex items-center gap-1 font-bold">
            Launch Setup Wizard →
          </div>
        </a>
      </section>

    </div>
  `
})
export class DashboardComponent {
  public gamification = inject(GamificationService);
  public tenantService = inject(TenantService);
  public sound = inject(SoundFxService);
  public courseService = inject(CourseService);
  public auth = inject(AuthService);

  public activeTrackTab = signal<'quantum' | 'cybersec' | 'ai' | 'space'>('quantum');
  public selectedBadgeRarity = signal<string>('ALL');
  public inspectedBadge = signal<Badge | null>(null);

  public selectedCourse = computed<Course | undefined>(() => {
    const track = this.activeTrackTab();
    const courses = this.courseService.courses();
    return courses.find(c => c.track === track) || courses[0];
  });

  public filteredBadges = computed(() => {
    const rarity = this.selectedBadgeRarity();
    const all = this.gamification.allBadges();
    if (rarity === 'ALL') return all;
    return all.filter(b => b.rarity === rarity);
  });

  public inspectBadge(badge: Badge): void {
    this.sound.playClick();
    this.inspectedBadge.set(badge);
  }

  public closeBadgeInspector(): void {
    this.inspectedBadge.set(null);
  }

  public onClaimQuest(code: string) {
    this.gamification.claimQuest(code);
  }
}
