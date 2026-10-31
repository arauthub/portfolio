import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GamificationService } from '../../core/services/gamification.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { Quest } from '../../core/models';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hud)]">
        <div>
          <div class="text-xs font-mono text-[var(--google-blue)] tracking-widest uppercase mb-1 font-bold">
            BOUNTY & OPS PROTOCOLS
          </div>
          <h1 class="text-3xl font-display font-extrabold text-white tracking-tight">
            Cybernetic Bounties & Quests
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            Execute operational milestones across curriculum modules, terminal assessments, and streak maintenance to claim high-yield XP bounties.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-[#1f1f1f] border border-amber-500/40 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-sm">
            <span class="text-base" aria-hidden="true">🔥</span>
            <div>
              <div class="text-[10px] font-mono uppercase text-[var(--text-muted)]">Active Streak</div>
              <div class="font-display font-bold text-xs text-amber-400">{{ gamification.profile().streak_days }} Day Hack Streak</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Type Filter Pills -->
      <div class="glass-panel p-3.5 flex flex-wrap items-center justify-between gap-3 rounded-2xl">
        <div class="flex items-center gap-2 flex-wrap">
          <button 
            type="button"
            (click)="selectedType.set('ALL')"
            [class.active-all]="selectedType() === 'ALL'"
            class="bounty-pill">
            All Operations ({{ gamification.quests().length }})
          </button>
          <button 
            type="button"
            (click)="selectedType.set('DAILY')"
            [class.active-daily]="selectedType() === 'DAILY'"
            class="bounty-pill">
            ⚡ Daily Hacks
          </button>
          <button 
            type="button"
            (click)="selectedType.set('WEEKLY')"
            [class.active-weekly]="selectedType() === 'WEEKLY'"
            class="bounty-pill">
            🎯 Weekly Protocols
          </button>
          <button 
            type="button"
            (click)="selectedType.set('SPECIAL')"
            [class.active-special]="selectedType() === 'SPECIAL'"
            class="bounty-pill">
            ✨ Special Ops
          </button>
        </div>

        <span class="text-xs font-mono text-[var(--text-muted)]">
          Showing {{ filteredQuests().length }} Active Bounties
        </span>
      </div>

      <!-- Quests Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (quest of filteredQuests(); track quest.code) {
          <div class="cyber-card flex flex-col justify-between space-y-5 rounded-2xl">
            
            <div class="space-y-3.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      [class.bg-[#1a73e8]/10]="quest.quest_type === 'DAILY'"
                      [class.text-[#8ab4f8]]="quest.quest_type === 'DAILY'"
                      [class.border-[#1a73e8]/30]="quest.quest_type === 'DAILY'"
                      [class.bg-purple-500/10]="quest.quest_type === 'WEEKLY'"
                      [class.text-purple-400]="quest.quest_type === 'WEEKLY'"
                      [class.border-purple-500/30]="quest.quest_type === 'WEEKLY'"
                      [class.bg-[#ea4335]/10]="quest.quest_type === 'SPECIAL'"
                      [class.text-[#f28b82]]="quest.quest_type === 'SPECIAL'"
                      [class.border-[#ea4335]/30]="quest.quest_type === 'SPECIAL'"
                      class="border">
                  {{ quest.quest_type }} BOUNTY
                </span>

                <span class="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/40 px-2 py-0.5 rounded">
                  ★ +{{ quest.xp_reward }} XP
                </span>
              </div>

              <div>
                <h2 class="text-lg font-display font-bold text-white flex items-center gap-2">
                  <span aria-hidden="true">{{ quest.icon === 'zap' ? '⚡' : quest.icon === 'check-circle' ? '🎯' : quest.icon === 'flame' ? '🔥' : quest.icon === 'atom' ? '⚛️' : '🌐' }}</span>
                  {{ quest.title }}
                </h2>
                <p class="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  {{ quest.description }}
                </p>
              </div>

              <!-- Progress Bar (Angular Material) -->
              <div class="space-y-1.5 pt-1">
                <div class="flex justify-between text-xs font-mono">
                  <span class="text-[var(--text-muted)]">Target Progress</span>
                  <span class="text-[var(--google-blue)] font-bold">{{ quest.current_progress }} / {{ quest.target_count }}</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="((quest.current_progress || 0) / quest.target_count) * 100" class="rounded-full"></mat-progress-bar>
              </div>
            </div>

            <!-- Claim Button -->
            <div class="pt-4 border-t border-[var(--border-hud)] flex items-center justify-end">
              @if (quest.is_claimed) {
                <span class="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold w-full sm:w-auto">
                  ✓ Bounty Claimed (+{{ quest.xp_reward }} XP)
                </span>
              } @else if (quest.current_progress! >= quest.target_count) {
                <button type="button" (click)="claim(quest.code)" class="cyber-btn cyber-btn-accent text-xs w-full sm:w-auto">
                  Claim {{ quest.xp_reward }} XP Bounty 🎁
                </button>
              } @else {
                <span class="text-xs font-mono text-[var(--text-muted)] bg-[#18191c] border border-[var(--border-hud)] px-4 py-2 rounded-xl text-center w-full sm:w-auto inline-block">
                  Target Incomplete ({{ quest.target_count - (quest.current_progress || 0) }} Remaining)
                </span>
              }
            </div>

          </div>
        }
      </div>

    </div>
  `,
  styles: [`
    .bounty-pill {
      background: var(--bg-panel);
      border: 1px solid var(--border-hud);
      color: var(--text-muted);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .bounty-pill:hover {
      border-color: var(--google-blue);
      color: var(--text-main);
    }
    .active-all {
      border-color: var(--google-blue) !important;
      background: rgba(26, 115, 232, 0.15) !important;
      color: var(--google-blue) !important;
      font-weight: 700;
    }
    .active-daily {
      border-color: #1a73e8 !important;
      background: rgba(26, 115, 232, 0.2) !important;
      color: #8ab4f8 !important;
      font-weight: 700;
    }
    .active-weekly {
      border-color: #8b5cf6 !important;
      background: rgba(139, 92, 246, 0.2) !important;
      color: #c4b5fd !important;
      font-weight: 700;
    }
    .active-special {
      border-color: #ea4335 !important;
      background: rgba(234, 67, 53, 0.2) !important;
      color: #f28b82 !important;
      font-weight: 700;
    }
  `]
})
export class QuestsComponent {
  public gamification = inject(GamificationService);
  public sound = inject(SoundFxService);

  public selectedType = signal<string>('ALL');

  public filteredQuests = computed(() => {
    const type = this.selectedType();
    const list = this.gamification.quests();
    if (type === 'ALL') return list;
    return list.filter(q => q.quest_type === type);
  });

  public claim(code: string) {
    this.gamification.claimQuest(code);
  }
}
