import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { TenantService } from '../../core/services/tenant.service';
import { Course } from '../../core/models';

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hud)]">
        <div>
          <div class="text-xs font-mono text-[var(--neon-secondary)] tracking-widest uppercase mb-1">
            EDUCATOR & CURRICULUM COMMAND
          </div>
          <h1 class="text-3xl font-display font-extrabold text-white">
            Instructor Studio & Cohort Telemetry
          </h1>
          <p class="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Author futuristic interactive modules, deploy executable code sandboxes, and monitor real-time student cohort performance across active enterprise tenants.
          </p>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0">
          <button type="button" (click)="openAuthorModal()" class="cyber-btn text-xs">
            + Author New Mission Module 🚀
          </button>
        </div>
      </div>

      <!-- Cohort Telemetry Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-panel p-5 space-y-1">
          <div class="text-[11px] font-mono uppercase text-slate-400">Total Enrolled Cadets</div>
          <div class="text-2xl font-display font-bold text-[var(--neon-primary)]">{{ tenantService.currentTenant().active_learners }}</div>
          <div class="text-[10px] font-mono text-emerald-400">↑ 14% this epoch</div>
        </div>

        <div class="glass-panel p-5 space-y-1">
          <div class="text-[11px] font-mono uppercase text-slate-400">Average Quiz Accuracy</div>
          <div class="text-2xl font-display font-bold text-purple-400">84.6%</div>
          <div class="text-[10px] font-mono text-slate-400">Across 320 cohort evaluations</div>
        </div>

        <div class="glass-panel p-5 space-y-1">
          <div class="text-[11px] font-mono uppercase text-slate-400">Curriculum Completion Rate</div>
          <div class="text-2xl font-display font-bold text-emerald-400">76.2%</div>
          <div class="text-[10px] font-mono text-emerald-400">High engagement</div>
        </div>

        <div class="glass-panel p-5 space-y-1">
          <div class="text-[11px] font-mono uppercase text-slate-400">Total XP Distributed</div>
          <div class="text-2xl font-display font-bold text-amber-400">142,500</div>
          <div class="text-[10px] font-mono text-amber-300">Gamification active</div>
        </div>
      </div>

      <!-- Main Columns: Course Management & Cohort Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Active Curriculum Management -->
        <div class="lg:col-span-2 glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 class="font-display font-bold text-base text-white flex items-center gap-2">
              <span aria-hidden="true">📚</span> Active Curriculum Tracks
            </h2>
            <span class="text-xs font-mono text-[var(--neon-primary)] font-bold">{{ courseService.courses().length }} Modules Live</span>
          </div>

          <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            @for (course of courseService.courses(); track course.slug) {
              <div class="bg-[#060a17] border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-display font-bold text-sm text-white">{{ course.title }}</span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                      {{ course.difficulty }}
                    </span>
                    <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 uppercase">
                      {{ course.track }}
                    </span>
                  </div>
                  <div class="text-xs text-slate-400">
                    {{ course.lessons_count }} Lessons • +{{ course.xp_reward }} XP Reward • {{ course.estimated_duration }}
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <a [routerLink]="['/courses', course.slug]" (click)="sound.playClick()" class="px-3 py-1.5 rounded-lg border border-[var(--border-hud)] bg-[var(--bg-panel)] hover:border-[var(--google-blue)] text-xs font-mono text-[var(--text-main)] transition-colors text-decoration-none">
                    Preview Deck
                  </a>
                  <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-[var(--google-blue)]/10 border border-[var(--google-blue)]/40 text-xs font-mono text-[var(--google-blue)] hover:bg-[var(--google-blue)]/20 transition-colors text-decoration-none">
                    Wagtail CMS ↗
                  </a>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Real-Time Activity Feed -->
        <div class="glass-panel p-6 space-y-4">
          <h2 class="font-display font-bold text-base text-white flex items-center gap-2">
            <span aria-hidden="true">⚡</span> Live Student Telemetry
          </h2>

          <div class="space-y-3 font-mono text-xs">
            <div class="p-3 rounded-lg bg-[#070b18] border border-slate-800/80 space-y-1">
              <div class="flex justify-between text-slate-400">
                <span class="text-cyan-300 font-bold">Cyber-Adept-01</span>
                <span>2m ago</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">Completed module: Superconducting Qubit Topology (+250 XP)</p>
            </div>

            <div class="p-3 rounded-lg bg-[#070b18] border border-slate-800/80 space-y-1">
              <div class="flex justify-between text-slate-400">
                <span class="text-purple-300 font-bold">Valkyrie-7</span>
                <span>8m ago</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">Passed Quantum Mastery Assessment with 100% score (+350 XP)</p>
            </div>

            <div class="p-3 rounded-lg bg-[#070b18] border border-slate-800/80 space-y-1">
              <div class="flex justify-between text-slate-400">
                <span class="text-emerald-300 font-bold">Singularity-X</span>
                <span>15m ago</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">Unlocked Tier 4 Skill: Topological Fault-Tolerant Systems</p>
            </div>

            <div class="p-3 rounded-lg bg-[#070b18] border border-slate-800/80 space-y-1">
              <div class="flex justify-between text-slate-400">
                <span class="text-amber-300 font-bold">NeoMatrix</span>
                <span>28m ago</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">Earned Legendary Badge: Quantum Pioneer</p>
            </div>

            <div class="p-3 rounded-lg bg-[#070b18] border border-slate-800/80 space-y-1">
              <div class="flex justify-between text-slate-400">
                <span class="text-sky-300 font-bold">Aether-Pilot-04</span>
                <span>42m ago</span>
              </div>
              <p class="text-slate-300 text-[11px] leading-relaxed">Compiled Hall-Effect Ion Thruster Simulation in Aero-Space deck</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Author New Module Modal Dialog -->
      @if (showAuthorModal()) {
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="glass-panel p-6 sm:p-8 max-w-xl w-full space-y-5 my-8 border border-[var(--neon-primary)]/40 shadow-2xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <div class="flex items-center gap-2">
                <span class="text-xl" aria-hidden="true">🚀</span>
                <h3 id="modal-title" class="font-display font-bold text-lg text-white">Author New Mission Module</h3>
              </div>
              <button type="button" (click)="closeAuthorModal()" class="text-slate-400 hover:text-white text-lg p-1" aria-label="Close Authoring Modal">
                ✕
              </button>
            </div>

            <form (submit)="saveModule($event)" class="space-y-4 text-xs font-mono">
              <div class="space-y-1">
                <label for="module-title" class="text-slate-400 block">Course / Mission Title</label>
                <input id="module-title" type="text" [(ngModel)]="newModule.title" name="title" required
                       class="cyber-input w-full" placeholder="e.g. Photonic Topological Quantum Networks">
              </div>

              <div class="space-y-1">
                <label for="module-subtitle" class="text-slate-400 block">Brief Overview / Subtitle</label>
                <input id="module-subtitle" type="text" [(ngModel)]="newModule.subtitle" name="subtitle" required
                       class="cyber-input w-full" placeholder="e.g. Laser-driven coherent state routing over optical crystal matrices">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="module-track" class="text-slate-400 block">Track Domain</label>
                  <select id="module-track" [(ngModel)]="newModule.track" name="track" class="cyber-input w-full">
                    <option value="quantum">⚛️ Quantum AI</option>
                    <option value="cybersec">🛡️ Cyber Defense</option>
                    <option value="ai">🧠 Neuromorphic AI</option>
                    <option value="space">🚀 Aero-Space</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label for="module-difficulty" class="text-slate-400 block">Clearance Difficulty</label>
                  <select id="module-difficulty" [(ngModel)]="newModule.difficulty" name="difficulty" class="cyber-input w-full">
                    <option value="BEGINNER">Level 1: Cadet</option>
                    <option value="INTERMEDIATE">Level 2: Specialist</option>
                    <option value="ADVANCED">Level 3: Architect</option>
                    <option value="SINGULARITY">Level 4: Singularity</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label for="module-duration" class="text-slate-400 block">Est. Duration</label>
                  <input id="module-duration" type="text" [(ngModel)]="newModule.estimated_duration" name="duration" class="cyber-input w-full" placeholder="e.g. 8 Hours">
                </div>

                <div class="space-y-1">
                  <label for="module-xp" class="text-slate-400 block">XP Reward</label>
                  <input id="module-xp" type="number" [(ngModel)]="newModule.xp_reward" name="xp" class="cyber-input w-full" placeholder="850">
                </div>
              </div>

              <div class="space-y-1">
                <label for="module-code" class="text-slate-400 block">Interactive Python Sandbox Starter Task</label>
                <textarea id="module-code" [(ngModel)]="newModuleCode" name="code" rows="4" class="cyber-input w-full font-mono text-cyan-300"
                          placeholder="# Python 3 Code Simulation Task&#10;def run_telemetry():&#10;    return 'Quantum coherence stable'&#10;"></textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" (click)="closeAuthorModal()" class="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" class="cyber-btn">
                  ⚡ Publish to Active Curriculum
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class InstructorComponent {
  public courseService = inject(CourseService);
  public sound = inject(SoundFxService);
  public tenantService = inject(TenantService);

  public showAuthorModal = signal<boolean>(false);
  public newModule: Partial<Course> = {
    title: '',
    subtitle: '',
    track: 'quantum',
    difficulty: 'INTERMEDIATE',
    estimated_duration: '8 Hours',
    xp_reward: 850
  };
  public newModuleCode = `# Python 3 Quantum/Cyber Sandbox
import numpy as np

def execute_simulation():
    return "Simulation convergence achieved"

print(execute_simulation())
`;

  public openAuthorModal() {
    this.sound.playClick();
    this.showAuthorModal.set(true);
  }

  public closeAuthorModal() {
    this.showAuthorModal.set(false);
  }

  public saveModule(e: Event) {
    e.preventDefault();
    if (!this.newModule.title) return;

    const slug = this.newModule.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const created: Course = {
      id: Date.now(),
      title: this.newModule.title,
      slug: slug,
      subtitle: this.newModule.subtitle || 'High-dimensional cybernetic learning curriculum module.',
      track: (this.newModule.track as any) || 'quantum',
      difficulty: (this.newModule.difficulty as any) || 'INTERMEDIATE',
      estimated_duration: this.newModule.estimated_duration || '8 Hours',
      xp_reward: Number(this.newModule.xp_reward) || 850,
      neon_color: this.newModule.track === 'quantum' ? '#00f3ff' : this.newModule.track === 'cybersec' ? '#ff0055' : this.newModule.track === 'ai' ? '#10b981' : '#a855f7',
      icon_name: this.newModule.track === 'quantum' ? 'atom' : this.newModule.track === 'cybersec' ? 'shield-alert' : this.newModule.track === 'ai' ? 'brain' : 'rocket',
      organization_name: this.tenantService.currentTenant().name,
      organization_slug: this.tenantService.currentTenant().slug,
      badge_title: 'Cadet Initiate',
      lessons_count: 1,
      lessons: [
        {
          id: Date.now() + 1,
          title: this.newModule.title + ' // Hands-on Lab',
          slug: slug + '-lab',
          order: 1,
          xp_value: Number(this.newModule.xp_reward) || 850,
          lesson_type: 'CODE_LAB',
          estimated_minutes: 25,
          summary: this.newModule.subtitle || 'Interactive laboratory module.'
        }
      ]
    };

    this.courseService.courses.update(list => [created, ...list]);
    this.sound.playLevelUp();
    this.closeAuthorModal();
    this.newModule = { title: '', subtitle: '', track: 'quantum', difficulty: 'INTERMEDIATE', estimated_duration: '8 Hours', xp_reward: 850 };
  }
}
