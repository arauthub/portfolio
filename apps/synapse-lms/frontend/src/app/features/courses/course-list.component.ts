import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CourseService } from '../../core/services/course.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { TenantService } from '../../core/services/tenant.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- Header Banner -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[var(--border-hud)]">
        <div>
          <div class="text-xs font-mono text-[var(--google-blue)] tracking-widest uppercase mb-1 font-bold">
            WAGTAIL-DRIVEN CURRICULUM ARCHIVE
          </div>
          <h1 class="text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight">
            High-Dimensional Mission Tracks
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-2 max-w-2xl leading-relaxed">
            Select a specialized track to earn XP, upgrade your clearance tier, and unlock cryptographic verifiable certifications across quantum, zero-trust cyber, neuromorphic AI, and deep space engineering.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="w-full lg:w-80 relative">
          <label for="course-search" class="sr-only">Search Mission Tracks</label>
          <div class="relative">
            <input 
              id="course-search"
              type="text" 
              [ngModel]="courseService.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search missions, topics, tracks..." 
              class="w-full bg-[#1f1f1f] border border-[var(--border-hud)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--google-blue)] transition-all">
            <span class="absolute left-3 top-2.5 text-[var(--text-muted)] text-xs" aria-hidden="true">🔍</span>
            @if (courseService.searchQuery()) {
              <button 
                type="button"
                (click)="clearSearch()"
                aria-label="Clear Search Input"
                class="absolute right-2.5 top-2 text-[var(--text-muted)] hover:text-white text-xs p-1">
                ✕
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Filter Controls Strip -->
      <div class="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl">
        
        <!-- Track Filter Pills with Google Colors -->
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span class="text-[10px] font-mono uppercase text-[var(--text-muted)] mr-1 hidden sm:inline">Track:</span>
          
          <button 
            type="button"
            (click)="setTrack('all')" 
            [class.active-all]="courseService.selectedTrack() === 'all'"
            class="filter-pill">
            All Tracks ({{ courseService.courses().length }})
          </button>
          
          <button 
            type="button"
            (click)="setTrack('quantum')" 
            [class.active-quantum]="courseService.selectedTrack() === 'quantum'"
            class="filter-pill">
            ⚛️ Quantum AI
          </button>
          
          <button 
            type="button"
            (click)="setTrack('cybersec')" 
            [class.active-cyber]="courseService.selectedTrack() === 'cybersec'"
            class="filter-pill">
            🛡️ Cyber Defense
          </button>
          
          <button 
            type="button"
            (click)="setTrack('ai')" 
            [class.active-ai]="courseService.selectedTrack() === 'ai'"
            class="filter-pill">
            🧠 Neuromorphic AI
          </button>
          
          <button 
            type="button"
            (click)="setTrack('space')" 
            [class.active-space]="courseService.selectedTrack() === 'space'"
            class="filter-pill">
            🚀 Aero-Space
          </button>
        </div>

        <!-- Difficulty Level Dropdown & Filter Actions -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] font-mono uppercase text-[var(--text-muted)]">Clearance Level:</span>
            <select 
              [value]="courseService.selectedDifficulty()"
              (change)="onDifficultyChange($event)"
              aria-label="Filter by Clearance Difficulty Level"
              class="bg-[#1f1f1f] border border-[var(--border-hud)] text-xs text-[var(--text-main)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--google-blue)] cursor-pointer">
              <option value="all">All Difficulties</option>
              <option value="BEGINNER">Level 1: Cadet</option>
              <option value="INTERMEDIATE">Level 2: Specialist</option>
              <option value="ADVANCED">Level 3: Architect</option>
              <option value="SINGULARITY">Level 4: Singularity</option>
            </select>
          </div>

          @if (hasActiveFilters()) {
            <button 
              type="button"
              (click)="resetAllFilters()"
              class="text-xs font-mono text-[var(--neon-accent)] hover:underline flex items-center gap-1 px-2.5 py-1 bg-[var(--neon-accent)]/10 border border-[var(--neon-accent)]/30 rounded-lg">
              <span>✕</span> Reset
            </button>
          }
        </div>

      </div>

      <!-- Results Count Status -->
      <div class="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1">
        <span>Showing <strong class="text-white">{{ filteredCourses().length }}</strong> of {{ courseService.courses().length }} Mission Modules</span>
        <span class="text-[var(--text-muted)]">Live RDBMS PostgreSQL 18 Engine</span>
      </div>

      <!-- Course Grid -->
      @if (filteredCourses().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (course of filteredCourses(); track course.slug) {
            <div class="cyber-card flex flex-col justify-between space-y-5 group hover:border-[var(--google-blue)] transition-all rounded-2xl">
              
              <div class="space-y-4">
                <!-- Top Metadata Row -->
                <div class="flex items-center justify-between gap-2">
                  <span [ngClass]="{
                    'border-[#1a73e8]/40 bg-[#1a73e8]/10 text-[#8ab4f8]': course.track === 'quantum',
                    'border-[#ea4335]/40 bg-[#ea4335]/10 text-[#f28b82]': course.track === 'cybersec',
                    'border-[#fbbc04]/40 bg-[#fbbc04]/10 text-[#fdd663]': course.track === 'ai',
                    'border-[#34a853]/40 bg-[#34a853]/10 text-[#81c995]': course.track === 'space'
                  }" class="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold truncate">
                    {{ course.track | uppercase }}
                  </span>
                  <span class="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/40 px-2 py-0.5 rounded flex-shrink-0">
                    ★ +{{ course.xp_reward }} XP
                  </span>
                </div>

                <!-- Title & Subtitle -->
                <div>
                  <h3 class="text-lg font-display font-bold text-white group-hover:text-[var(--google-blue)] transition-colors leading-snug">
                    {{ course.title }}
                  </h3>
                  <p class="text-xs text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed">
                    {{ course.subtitle }}
                  </p>
                </div>

                <!-- Organization & Badge Link -->
                <div class="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-hud)]">
                  <span class="truncate">Org: {{ course.organization_name || tenantService.currentTenant().name }}</span>
                  @if (course.badge_title) {
                    <span class="text-amber-400 font-bold flex-shrink-0">🏆 {{ course.badge_title }}</span>
                  }
                </div>

                <!-- Module breakdown -->
                <div class="bg-[#1f1f1f] border border-[var(--border-hud)] rounded-xl p-3 space-y-2">
                  <div class="text-[10px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                    <span>Curriculum Syllabus:</span>
                    <span class="text-slate-300 font-bold">{{ course.lessons_count }} Lessons</span>
                  </div>
                  <div class="space-y-1.5 max-h-24 overflow-y-auto">
                    @for (lesson of course.lessons; track lesson.id) {
                      <div class="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                        <span class="text-[var(--google-blue)] font-bold">0{{ lesson.order }}.</span>
                        <span class="text-[var(--text-main)] truncate flex-1">{{ lesson.title }}</span>
                        <span class="text-[9px] text-[var(--text-muted)] px-1 rounded bg-[#282a2d] border border-[var(--border-hud)] flex-shrink-0">
                          {{ lesson.lesson_type === 'CODE_LAB' ? '💻 CODE' : lesson.lesson_type === 'HOLOGRAPHIC_SIM' ? '🔮 3D SIM' : '📝 CONCEPT' }}
                        </span>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Footer Action Row -->
              <div class="pt-4 border-t border-[var(--border-hud)] flex items-center justify-between gap-3">
                <div class="text-xs font-mono text-[var(--text-muted)] flex items-center gap-2 min-w-0 truncate">
                  <span class="flex-shrink-0">⏱ {{ course.estimated_duration }}</span>
                  <span aria-hidden="true" class="flex-shrink-0">•</span>
                  <span [ngClass]="{
                    'text-emerald-400': course.difficulty === 'BEGINNER',
                    'text-cyan-400': course.difficulty === 'INTERMEDIATE',
                    'text-purple-400': course.difficulty === 'ADVANCED',
                    'text-pink-400': course.difficulty === 'SINGULARITY'
                  }" class="font-bold text-[11px] truncate">
                    {{ course.difficulty }}
                  </span>
                </div>

                <a [routerLink]="['/courses', course.slug]" (click)="sound.playClick()" 
                   aria-label="Enter Mission Deck for {{ course.title }}"
                   class="cyber-btn text-xs flex-shrink-0">
                  Enter Deck →
                </a>
              </div>

            </div>
          }
        </div>
      } @else {
        <!-- Clean Empty State -->
        <div class="cyber-card py-16 text-center space-y-4 max-w-xl mx-auto rounded-2xl">
          <div class="w-16 h-16 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-3xl">
            🛸
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-display font-bold text-white">No Matching Mission Tracks Found</h3>
            <p class="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              No curriculums match your search or filter criteria. Try resetting your filters.
            </p>
          </div>
          <button (click)="resetAllFilters()" class="cyber-btn text-xs">
            Reset Filters & Show All
          </button>
        </div>
      }

    </div>
  `,
  styles: [`
    .filter-pill {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      border: 1px solid var(--border-hud);
      background: var(--bg-panel);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-pill:hover {
      color: var(--text-main);
      border-color: var(--google-blue);
    }
    .active-all {
      border-color: var(--google-blue) !important;
      background: rgba(26, 115, 232, 0.15) !important;
      color: var(--google-blue) !important;
      font-weight: 700;
    }
    .active-quantum {
      border-color: #1a73e8 !important;
      background: rgba(26, 115, 232, 0.2) !important;
      color: #8ab4f8 !important;
      font-weight: 700;
    }
    .active-cyber {
      border-color: #ea4335 !important;
      background: rgba(234, 67, 53, 0.2) !important;
      color: #f28b82 !important;
      font-weight: 700;
    }
    .active-ai {
      border-color: #fbbc04 !important;
      background: rgba(251, 188, 4, 0.2) !important;
      color: #fdd663 !important;
      font-weight: 700;
    }
    .active-space {
      border-color: #34a853 !important;
      background: rgba(52, 168, 83, 0.2) !important;
      color: #81c995 !important;
      font-weight: 700;
    }
  `]
})
export class CourseListComponent {
  public courseService = inject(CourseService);
  public sound = inject(SoundFxService);
  public tenantService = inject(TenantService);

  public filteredCourses = computed(() => {
    let result = this.courseService.courses();
    const track = this.courseService.selectedTrack();
    const diff = this.courseService.selectedDifficulty();
    const query = this.courseService.searchQuery().toLowerCase().trim();

    if (track !== 'all') {
      result = result.filter(c => c.track === track);
    }
    if (diff !== 'all') {
      result = result.filter(c => c.difficulty === diff);
    }
    if (query) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.subtitle.toLowerCase().includes(query) ||
        c.track.toLowerCase().includes(query)
      );
    }
    return result;
  });

  public hasActiveFilters = computed(() => {
    return this.courseService.selectedTrack() !== 'all' || 
           this.courseService.selectedDifficulty() !== 'all' ||
           this.courseService.searchQuery().trim() !== '';
  });

  public setTrack(track: string) {
    this.sound.playClick();
    this.courseService.selectedTrack.set(track);
  }

  public onDifficultyChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sound.playClick();
    this.courseService.selectedDifficulty.set(value);
  }

  public onSearchChange(query: string) {
    this.courseService.searchQuery.set(query);
  }

  public clearSearch() {
    this.sound.playClick();
    this.courseService.searchQuery.set('');
  }

  public resetAllFilters() {
    this.sound.playClick();
    this.courseService.resetFilters();
  }
}
