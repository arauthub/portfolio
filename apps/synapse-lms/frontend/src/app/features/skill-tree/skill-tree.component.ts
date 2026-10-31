import { Component, inject, signal, computed, ViewChild, ElementRef, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as d3 from 'd3';

import { GamificationService } from '../../core/services/gamification.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { TenantService } from '../../core/services/tenant.service';
import { SkillNode } from '../../core/models';

@Component({
  selector: 'app-skill-tree',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatChipsModule, 
    MatTooltipModule, 
    MatIconModule, 
    MatProgressBarModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--border-hud)]">
        <div>
          <div class="text-xs font-mono text-[var(--google-blue)] tracking-widest uppercase mb-1 font-bold">
            NEURAL COMPETENCY MATRIX
          </div>
          <h1 class="text-3xl font-display font-extrabold text-white tracking-tight">
            Cybernetic Skill Web
          </h1>
          <p class="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            Invest accumulated XP to unlock high-tier competencies. Nodes in earlier tiers serve as prerequisite quantum synapses across Quantum, Cybersec, AI, and Aero-Space engineering.
          </p>
        </div>

        <div class="flex items-center gap-3 bg-[#1f1f1f] border border-[var(--border-hud)] px-4 py-2.5 rounded-xl font-mono text-xs flex-shrink-0 shadow-sm">
          <span class="text-[var(--text-muted)]">Available XP:</span>
          <span class="text-lg font-display font-bold text-[var(--google-blue)]">{{ gamification.profile().current_xp }} XP</span>
        </div>
      </div>

      <!-- D3 Interactive Skill Constellation Graph -->
      <section aria-label="Interactive D3 Skill Constellation Map" class="glass-panel p-5 space-y-3 rounded-2xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[var(--google-blue)] animate-pulse"></span>
            <span class="text-xs font-mono uppercase tracking-wider text-[var(--google-blue)] font-bold">
              D3 Interactive Synapse Constellation
            </span>
          </div>
          <span class="text-xs font-mono text-[var(--text-muted)]">
            Click any node on the D3 topological map to inspect details
          </span>
        </div>

        <div #constellationContainer class="w-full h-56 bg-[#080d20]/50 rounded-xl border border-[var(--border-hud)] overflow-hidden relative"></div>
      </section>

      <!-- Main Layout: Graph & Node Inspector Drawer -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Skill Web Visual Grid -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Track Selector with Google Standard Colors -->
          <div class="flex items-center gap-2 flex-wrap">
            <button 
              type="button"
              (click)="selectTrack('all')" 
              [class.active-all]="selectedTrack() === 'all'"
              class="track-pill">
              All Tracks
            </button>
            <button 
              type="button"
              (click)="selectTrack('quantum')" 
              [class.active-quantum]="selectedTrack() === 'quantum'"
              class="track-pill">
              ⚛️ Quantum
            </button>
            <button 
              type="button"
              (click)="selectTrack('cybersec')" 
              [class.active-cyber]="selectedTrack() === 'cybersec'"
              class="track-pill">
              🛡️ Cyber Defense
            </button>
            <button 
              type="button"
              (click)="selectTrack('ai')" 
              [class.active-ai]="selectedTrack() === 'ai'"
              class="track-pill">
              🧠 Neuromorphic AI
            </button>
            <button 
              type="button"
              (click)="selectTrack('space')" 
              [class.active-space]="selectedTrack() === 'space'"
              class="track-pill">
              🚀 Aero-Space
            </button>
          </div>

          <!-- Tiers Display -->
          @for (tier of [1, 2, 3, 4]; track tier) {
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#1f1f1f] text-[var(--text-main)] font-bold border border-[var(--border-hud)]">
                  TIER 0{{ tier }}
                </span>
                <span class="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wide">
                  {{ tier === 1 ? 'Cadet Foundations' : tier === 2 ? 'Specialist Operators' : tier === 3 ? 'Autonomous Architectures' : 'Singularity Ascension' }}
                </span>
                <div class="flex-1 h-px bg-[var(--border-hud)]"></div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                @for (node of getNodesForTier(tier); track node.slug) {
                  <button 
                    type="button"
                    (click)="selectNode(node)"
                    [attr.aria-pressed]="selectedNode()?.slug === node.slug"
                    [class.unlocked-node]="isNodeUnlocked(node.slug)"
                    [class.selected-node]="selectedNode()?.slug === node.slug"
                    class="skill-card text-left p-4 rounded-2xl border border-[var(--border-hud)] bg-[#1f1f1f] hover:border-[var(--google-blue)] transition-all relative overflow-hidden group flex flex-col justify-between min-h-[140px] focus:outline-none focus:ring-1 focus:ring-[var(--google-blue)]">
                    
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xl" aria-hidden="true">
                          {{ node.icon === 'atom' ? '⚛️' : node.icon === 'lock' ? '🔒' : node.icon === 'cpu' ? '🧠' : node.icon === 'rocket' ? '🚀' : node.icon === 'shield' ? '🛡️' : '⚡' }}
                        </span>
                        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                              [class.text-emerald-400]="isNodeUnlocked(node.slug)"
                              [class.bg-emerald-950/40]="isNodeUnlocked(node.slug)"
                              [class.border-emerald-500/40]="isNodeUnlocked(node.slug)"
                              [class.text-amber-400]="!isNodeUnlocked(node.slug)"
                              [class.bg-amber-950/40]="!isNodeUnlocked(node.slug)"
                              [class.border-amber-500/40]="!isNodeUnlocked(node.slug)"
                              class="border">
                          {{ isNodeUnlocked(node.slug) ? '✓ MASTERED' : node.xp_cost + ' XP' }}
                        </span>
                      </div>

                      <div class="font-display font-bold text-xs text-white group-hover:text-[var(--google-blue)] transition-colors leading-snug">
                        {{ node.title }}
                      </div>
                      <div class="text-[10px] font-mono text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                        {{ node.description }}
                      </div>
                    </div>

                    <div class="text-[9px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-hud)] truncate">
                      {{ node.parent_slug ? 'Requires: ' + node.parent_slug : 'Root Foundational Synapse' }}
                    </div>
                  </button>
                }
              </div>
            </div>
          }

        </div>

        <!-- Node Inspector Drawer (Sticky) -->
        <div class="glass-panel p-6 h-fit space-y-6 lg:sticky lg:top-24 rounded-2xl">
          @if (selectedNode(); as node) {
            <div>
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono tracking-wider uppercase text-[var(--google-blue)] font-bold">
                  SYNAPSE TELEMETRY // TIER 0{{ node.tier }}
                </span>
                <span class="text-xs font-mono text-[var(--text-muted)] uppercase">
                  {{ node.track }} TRACK
                </span>
              </div>

              <h2 class="text-xl font-display font-bold text-white mt-2">
                {{ node.title }}
              </h2>
              
              <div class="mt-4 p-3 bg-[#18191c] border border-[var(--border-hud)] rounded-xl text-xs font-mono text-[var(--text-main)] leading-relaxed">
                {{ node.description }}
              </div>
            </div>

            <div class="space-y-3 pt-2 border-t border-[var(--border-hud)] text-xs font-mono">
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Unlock Cost:</span>
                <span class="text-amber-400 font-bold">{{ node.xp_cost }} XP</span>
              </div>
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Prerequisite Node:</span>
                <span class="text-cyan-300 truncate max-w-[170px]">{{ node.parent_slug || 'Root Node (None)' }}</span>
              </div>
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Status:</span>
                <span [class.text-emerald-400]="isNodeUnlocked(node.slug)" [class.text-amber-400]="!isNodeUnlocked(node.slug)" class="font-bold">
                  {{ isNodeUnlocked(node.slug) ? '✓ Fully Synchronized' : '🔒 Locked Synapse' }}
                </span>
              </div>
            </div>

            <div class="pt-2">
              @if (isNodeUnlocked(node.slug)) {
                <div class="w-full py-2.5 rounded-xl text-center text-xs font-display font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40">
                  ✓ Node Synchronized in Neural Web
                </div>
              } @else {
                <button 
                  type="button"
                  (click)="unlockSelectedNode()" 
                  [disabled]="gamification.profile().current_xp < node.xp_cost"
                  class="cyber-btn w-full text-xs">
                  ⚡ Unlock Node (-{{ node.xp_cost }} XP)
                </button>
                @if (gamification.profile().current_xp < node.xp_cost) {
                  <p class="text-[10px] font-mono text-red-400 text-center mt-2">
                    Insufficient XP (Earn +{{ node.xp_cost - gamification.profile().current_xp }} XP in Courses)
                  </p>
                }
              }
            </div>
          } @else {
            <div class="text-center py-12 text-[var(--text-muted)] text-xs font-mono">
              Select any node in the matrix or D3 graph to inspect and unlock.
            </div>
          }
        </div>

      </div>

    </div>
  `,
  styles: [`
    .track-pill {
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
    .track-pill:hover {
      border-color: var(--google-blue);
      color: var(--text-main);
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
    .unlocked-node {
      border-color: rgba(16, 185, 129, 0.6) !important;
      background: rgba(16, 185, 129, 0.05) !important;
    }
    .selected-node {
      border-color: var(--google-blue) !important;
      box-shadow: 0 0 15px rgba(26, 115, 232, 0.35);
    }
  `]
})
export class SkillTreeComponent implements OnInit, OnDestroy {
  @ViewChild('constellationContainer', { static: true }) constellationContainer!: ElementRef<HTMLDivElement>;

  public gamification = inject(GamificationService);
  public sound = inject(SoundFxService);
  public tenantService = inject(TenantService);

  public selectedTrack = signal<string>('all');
  public selectedNode = signal<SkillNode | null>(null);

  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      this.tenantService.themeMode();
      this.selectedTrack();
      this.gamification.profile().unlocked_skills;
      this.renderConstellation();
    });
  }

  ngOnInit(): void {
    const nodes = this.gamification.skillTreeNodes();
    if (nodes.length > 0) {
      this.selectedNode.set(nodes[0]);
    }
    this.renderConstellation();

    if (typeof ResizeObserver !== 'undefined' && this.constellationContainer?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.renderConstellation();
      });
      this.resizeObserver.observe(this.constellationContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  public selectTrack(track: string): void {
    this.sound.playClick();
    this.selectedTrack.set(track);
  }

  public selectNode(node: SkillNode): void {
    this.sound.playClick();
    this.selectedNode.set(node);
    this.renderConstellation();
  }

  public isNodeUnlocked(slug: string): boolean {
    return this.gamification.profile().unlocked_skills.includes(slug);
  }

  public getNodesForTier(tier: number): SkillNode[] {
    const track = this.selectedTrack();
    const all: SkillNode[] = this.gamification.skillTreeNodes();
    return all.filter((n: SkillNode) => n.tier === tier && (track === 'all' || n.track === track));
  }

  public unlockSelectedNode(): void {
    const node = this.selectedNode();
    if (!node) return;
    this.gamification.unlockSkill(node.slug);
  }

  private renderConstellation(): void {
    if (!this.constellationContainer?.nativeElement) return;
    const container = this.constellationContainer.nativeElement;
    d3.select(container).selectAll('*').remove();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 220;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', 'Interactive D3 Skill Constellation Map');

    const nodes: SkillNode[] = this.gamification.skillTreeNodes().filter((n: SkillNode) => {
      return this.selectedTrack() === 'all' || n.track === this.selectedTrack();
    });

    if (nodes.length === 0) return;

    const isLight = this.tenantService.themeMode() === 'light';

    // Track colors with WCAG 2.2 AAA Contrast compliance
    const trackColors: Record<string, string> = {
      quantum: isLight ? '#0b57d0' : '#8ab4f8',
      cybersec: isLight ? '#b3261e' : '#f28b82',
      ai: isLight ? '#8f4700' : '#fdd663',
      space: isLight ? '#137333' : '#81c995'
    };

    // Layout positions: X by Tier, Y by Track & Order
    const tracksList = ['quantum', 'cybersec', 'ai', 'space'];
    const xStep = width / 5;
    const yStep = height / (tracksList.length + 1);

    const nodePositions = new Map<string, { x: number; y: number; node: SkillNode }>();

    nodes.forEach((node: SkillNode) => {
      const trackIndex = tracksList.indexOf(node.track);
      const y = (trackIndex + 1) * yStep;
      const x = node.tier * xStep;
      nodePositions.set(node.slug, { x, y, node });
    });

    // Draw connection lines between parent and child nodes
    const linksGroup = svg.append('g').attr('class', 'links');
    nodes.forEach((node: SkillNode) => {
      if (node.parent_slug && nodePositions.has(node.parent_slug) && nodePositions.has(node.slug)) {
        const source = nodePositions.get(node.parent_slug)!;
        const target = nodePositions.get(node.slug)!;
        const isTargetUnlocked = this.isNodeUnlocked(node.slug);

        linksGroup.append('path')
          .attr('d', `M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`)
          .attr('fill', 'none')
          .attr('stroke', isTargetUnlocked ? (isLight ? '#137333' : '#10b981') : (isLight ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.18)'))
          .attr('stroke-width', isTargetUnlocked ? 2 : 1)
          .attr('stroke-dasharray', isTargetUnlocked ? 'none' : '4,4');
      }
    });

    // Draw nodes
    const nodesGroup = svg.append('g').attr('class', 'nodes');
    nodePositions.forEach(({ x, y, node }) => {
      const isUnlocked = this.isNodeUnlocked(node.slug);
      const isSelected = this.selectedNode()?.slug === node.slug;
      const color = trackColors[node.track] || (isLight ? '#0b57d0' : '#8ab4f8');

      const g = nodesGroup.append('g')
        .attr('transform', `translate(${x},${y})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          this.selectNode(node);
        });

      // Pulse ring for selected node
      if (isSelected) {
        g.append('circle')
          .attr('r', 18)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('opacity', 0.6)
          .attr('class', 'animate-ping');
      }

      // Outer circle
      g.append('circle')
        .attr('r', 13)
        .attr('fill', isUnlocked ? color : (isLight ? '#ffffff' : '#1f1f1f'))
        .attr('stroke', color)
        .attr('stroke-width', 2);

      // Icon / text inside
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '10px')
        .attr('font-family', 'Roboto Mono, monospace')
        .attr('font-weight', 'bold')
        .attr('fill', isUnlocked ? '#ffffff' : color)
        .text(isUnlocked ? '✓' : `T${node.tier}`);

      // Title label below with responsive truncation to prevent overlapping
      const maxLen = width < 420 ? 9 : width < 640 ? 12 : 16;
      const displayTitle = node.title.length > maxLen ? node.title.slice(0, maxLen - 2) + '..' : node.title;

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 23)
        .attr('font-size', '9px')
        .attr('font-family', 'Roboto Mono, monospace')
        .attr('font-weight', isSelected ? '700' : '500')
        .attr('fill', isSelected ? (isLight ? '#1f1f1f' : '#ffffff') : (isLight ? '#444746' : '#9aa0a6'))
        .text(displayTitle);
    });
  }
}
