import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as d3 from 'd3';
import { TenantService } from '../../core/services/tenant.service';

interface MetricPoint {
  day: string;
  epoch: number;
  quantum: number;
  cybersec: number;
  ai: number;
  space: number;
  total: number;
}

@Component({
  selector: 'app-d3-learning-velocity',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  template: `
    <div class="glass-panel p-5 sm:p-6 space-y-4 rounded-2xl border border-[var(--border-hud)]">
      
      <!-- Chart Header with Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-hud)] pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[var(--google-blue)] animate-pulse"></span>
            <span class="text-xs font-mono tracking-wider uppercase text-[var(--google-blue)] font-bold">
              D3.js Pedagogical Telemetry Matrix
            </span>
          </div>
          <h3 class="text-lg sm:text-xl font-display font-bold text-white mt-0.5">
            Real-Time Learning Velocity & Track Mastery
          </h3>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">
            Interactive multi-dimensional progression stream rendered with D3 data-driven vectors
          </p>
        </div>

        <!-- Metric Mode Filters -->
        <div class="flex items-center gap-1.5 bg-[#0a1024] p-1 rounded-xl border border-[var(--border-hud)]">
          <button 
            type="button"
            (click)="setMetric('xp')"
            [class.bg-[var(--google-blue)]]="activeMetric() === 'xp'"
            [class.text-white]="activeMetric() === 'xp'"
            class="px-2.5 py-1 text-xs font-display rounded-lg text-[var(--text-muted)] hover:text-white transition-all">
            XP Surge
          </button>
          <button 
            type="button"
            (click)="setMetric('hours')"
            [class.bg-[var(--google-blue)]]="activeMetric() === 'hours'"
            [class.text-white]="activeMetric() === 'hours'"
            class="px-2.5 py-1 text-xs font-display rounded-lg text-[var(--text-muted)] hover:text-white transition-all">
            Lab Hours
          </button>
          <button 
            type="button"
            (click)="setMetric('accuracy')"
            [class.bg-[var(--google-blue)]]="activeMetric() === 'accuracy'"
            [class.text-white]="activeMetric() === 'accuracy'"
            class="px-2.5 py-1 text-xs font-display rounded-lg text-[var(--text-muted)] hover:text-white transition-all">
            Accuracy %
          </button>
        </div>
      </div>

      <!-- Track Legend Toggles -->
      <div class="flex flex-wrap items-center gap-3 text-xs">
        <span class="text-xs font-mono text-[var(--text-muted)]">Active Tracks:</span>

        <button 
          type="button"
          (click)="toggleTrack('quantum')"
          [class.opacity-40]="!visibleTracks().quantum"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1a73e8]/40 bg-[#1a73e8]/10 text-[#8ab4f8] hover:bg-[#1a73e8]/20 transition-all">
          <span class="w-2 h-2 rounded-full bg-[#1a73e8]"></span>
          <span class="font-bold">Quantum Computing</span>
        </button>

        <button 
          type="button"
          (click)="toggleTrack('cybersec')"
          [class.opacity-40]="!visibleTracks().cybersec"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ea4335]/40 bg-[#ea4335]/10 text-[#f28b82] hover:bg-[#ea4335]/20 transition-all">
          <span class="w-2 h-2 rounded-full bg-[#ea4335]"></span>
          <span class="font-bold">Cyber Defense</span>
        </button>

        <button 
          type="button"
          (click)="toggleTrack('ai')"
          [class.opacity-40]="!visibleTracks().ai"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#fbbc04]/40 bg-[#fbbc04]/10 text-[#fdd663] hover:bg-[#fbbc04]/20 transition-all">
          <span class="w-2 h-2 rounded-full bg-[#fbbc04]"></span>
          <span class="font-bold">Autonomous AI</span>
        </button>

        <button 
          type="button"
          (click)="toggleTrack('space')"
          [class.opacity-40]="!visibleTracks().space"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#34a853]/40 bg-[#34a853]/10 text-[#81c995] hover:bg-[#34a853]/20 transition-all">
          <span class="w-2 h-2 rounded-full bg-[#34a853]"></span>
          <span class="font-bold">Aero-Space</span>
        </button>
      </div>

      <!-- D3 Chart Render Viewport -->
      <div class="relative w-full overflow-hidden rounded-xl bg-[#080d20]/50 border border-[var(--border-hud)] p-2">
        
        <!-- Screen-reader accessible alternative table for WCAG compliance -->
        <table class="sr-only" aria-label="Learning velocity metrics table over past 7 sessions">
          <thead>
            <tr>
              <th scope="col">Session Day</th>
              <th scope="col">Quantum XP</th>
              <th scope="col">Cybersec XP</th>
              <th scope="col">AI XP</th>
              <th scope="col">Space XP</th>
            </tr>
          </thead>
          <tbody>
            @for (row of dataset; track row.day) {
              <tr>
                <td>{{ row.day }}</td>
                <td>{{ row.quantum }}</td>
                <td>{{ row.cybersec }}</td>
                <td>{{ row.ai }}</td>
                <td>{{ row.space }}</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- SVG Container -->
        <div #chartContainer class="w-full h-64 sm:h-72"></div>

        <!-- Dynamic Hover Tooltip (Clamped to avoid clipping) -->
        <div 
          #chartTooltip 
          id="chartTooltip"
          class="pointer-events-none absolute hidden z-20 bg-[#1e2025]/95 backdrop-blur-md border border-[var(--border-hud)] p-3 rounded-xl shadow-xl text-xs space-y-1 transform -translate-x-1/2 transition-all duration-75 min-w-[170px]">
          <div class="font-mono text-[10px] text-[var(--google-blue)] tracking-wider uppercase font-bold" id="tooltip-day"></div>
          <div class="space-y-0.5 font-mono text-[11px]" id="tooltip-metrics"></div>
        </div>

      </div>

      <!-- Quick Telemetry Readout -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div class="p-2.5 rounded-xl bg-[#0a1024] border border-[#1a73e8]/30">
          <div class="text-[10px] font-mono text-[#8ab4f8]">Quantum Peak</div>
          <div class="text-base font-display font-bold text-white">420 XP/d</div>
          <div class="text-[9px] text-emerald-400 font-mono">↑ 18% weekly surge</div>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0a1024] border border-[#ea4335]/30">
          <div class="text-[10px] font-mono text-[#f28b82]">Zero-Trust Defense</div>
          <div class="text-base font-display font-bold text-white">390 XP/d</div>
          <div class="text-[9px] text-emerald-400 font-mono">↑ 24% weekly surge</div>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0a1024] border border-[#fbbc04]/30">
          <div class="text-[10px] font-mono text-[#fdd663]">Neural Synapse</div>
          <div class="text-base font-display font-bold text-white">510 XP/d</div>
          <div class="text-[9px] text-emerald-400 font-mono">↑ 31% weekly surge</div>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0a1024] border border-[#34a853]/30">
          <div class="text-[10px] font-mono text-[#81c995]">Orbital Dynamics</div>
          <div class="text-base font-display font-bold text-white">350 XP/d</div>
          <div class="text-[9px] text-emerald-400 font-mono">↑ 14% weekly surge</div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class D3LearningVelocityComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chartTooltip', { static: true }) chartTooltip!: ElementRef<HTMLDivElement>;

  private tenantService = inject(TenantService);

  public activeMetric = signal<'xp' | 'hours' | 'accuracy'>('xp');
  public visibleTracks = signal<{ quantum: boolean; cybersec: boolean; ai: boolean; space: boolean }>({
    quantum: true,
    cybersec: true,
    ai: true,
    space: true
  });

  public dataset: MetricPoint[] = [
    { day: 'Mon', epoch: 1, quantum: 140, cybersec: 120, ai: 200, space: 90, total: 550 },
    { day: 'Tue', epoch: 2, quantum: 210, cybersec: 180, ai: 290, space: 160, total: 840 },
    { day: 'Wed', epoch: 3, quantum: 190, cybersec: 260, ai: 310, space: 140, total: 900 },
    { day: 'Thu', epoch: 4, quantum: 320, cybersec: 240, ai: 420, space: 220, total: 1200 },
    { day: 'Fri', epoch: 5, quantum: 280, cybersec: 350, ai: 380, space: 270, total: 1280 },
    { day: 'Sat', epoch: 6, quantum: 410, cybersec: 310, ai: 490, space: 330, total: 1540 },
    { day: 'Sun', epoch: 7, quantum: 420, cybersec: 390, ai: 510, space: 350, total: 1670 }
  ];

  private resizeObserver?: ResizeObserver;

  constructor() {
    // Re-render when theme mode changes
    effect(() => {
      this.tenantService.themeMode();
      this.renderChart();
    });
  }

  ngOnInit(): void {
    this.renderChart();
    if (typeof ResizeObserver !== 'undefined' && this.chartContainer?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.renderChart();
      });
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  public setMetric(metric: 'xp' | 'hours' | 'accuracy') {
    this.activeMetric.set(metric);
    this.renderChart();
  }

  public toggleTrack(track: 'quantum' | 'cybersec' | 'ai' | 'space') {
    this.visibleTracks.update(v => ({
      ...v,
      [track]: !v[track]
    }));
    this.renderChart();
  }

  private renderChart() {
    if (!this.chartContainer?.nativeElement) return;
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const width = element.clientWidth || 600;
    const height = element.clientHeight || 280;
    const margin = { top: 20, right: 25, bottom: 35, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', 'Interactive D3 Learning Velocity Chart')
      .attr('class', 'overflow-visible');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Multiplier based on metric
    const multiplier = this.activeMetric() === 'hours' ? 0.05 : this.activeMetric() === 'accuracy' ? 0.2 : 1;
    const unitSuffix = this.activeMetric() === 'hours' ? 'h' : this.activeMetric() === 'accuracy' ? '%' : ' XP';

    const processedData = this.dataset.map(d => ({
      day: d.day,
      epoch: d.epoch,
      quantum: Math.round(d.quantum * multiplier),
      cybersec: Math.round(d.cybersec * multiplier),
      ai: Math.round(d.ai * multiplier),
      space: Math.round(d.space * multiplier),
      total: Math.round(d.total * multiplier)
    }));

    // Scales
    const xScale = d3.scalePoint<string>()
      .domain(processedData.map(d => d.day))
      .range([0, innerWidth])
      .padding(0.2);

    const maxY = d3.max(processedData, d => Math.max(d.quantum, d.cybersec, d.ai, d.space)) || 500;
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.15])
      .range([innerHeight, 0])
      .nice();

    // Theme detection for grid & axis colors
    const isLight = this.tenantService.themeMode() === 'light';
    const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';
    const textColor = isLight ? '#5f6368' : '#9aa0a6';

    // Horizontal Grid Lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', gridColor)
      .attr('stroke-dasharray', '3,3');

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}${this.activeMetric() === 'hours' ? 'h' : ''}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', textColor)
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('font-family', 'Roboto Mono, monospace');

    g.append('g')
      .call(yAxis)
      .attr('color', textColor)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'Roboto Mono, monospace');

    // Track Configurations with Google Standard Colors
    const tracks = [
      { key: 'quantum', label: 'Quantum', color: '#1a73e8', glow: '#8ab4f8', active: this.visibleTracks().quantum },
      { key: 'cybersec', label: 'Cybersec', color: '#ea4335', glow: '#f28b82', active: this.visibleTracks().cybersec },
      { key: 'ai', label: 'Autonomous AI', color: '#fbbc04', glow: '#fdd663', active: this.visibleTracks().ai },
      { key: 'space', label: 'Aero-Space', color: '#34a853', glow: '#81c995', active: this.visibleTracks().space }
    ];

    // Linear Gradients
    const defs = svg.append('defs');
    tracks.forEach(t => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${t.key}`)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', t.color)
        .attr('stop-opacity', isLight ? 0.3 : 0.4);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', t.color)
        .attr('stop-opacity', 0);
    });

    // Draw Areas & Lines for active tracks
    tracks.filter(t => t.active).forEach(track => {
      const lineGenerator = d3.line<MetricPoint>()
        .x(d => xScale(d.day) || 0)
        .y(d => yScale(d[track.key as keyof MetricPoint] as number))
        .curve(d3.curveMonotoneX);

      const areaGenerator = d3.area<MetricPoint>()
        .x(d => xScale(d.day) || 0)
        .y0(innerHeight)
        .y1(d => yScale(d[track.key as keyof MetricPoint] as number))
        .curve(d3.curveMonotoneX);

      // Area fill
      g.append('path')
        .datum(processedData)
        .attr('fill', `url(#gradient-${track.key})`)
        .attr('d', areaGenerator);

      // Line stroke
      g.append('path')
        .datum(processedData)
        .attr('fill', 'none')
        .attr('stroke', track.color)
        .attr('stroke-width', 2.5)
        .attr('d', lineGenerator);

      // Node circles
      g.selectAll(`.dot-${track.key}`)
        .data(processedData)
        .enter()
        .append('circle')
        .attr('class', `dot-${track.key}`)
        .attr('cx', d => xScale(d.day) || 0)
        .attr('cy', d => yScale(d[track.key as keyof MetricPoint] as number))
        .attr('r', 4)
        .attr('fill', track.color)
        .attr('stroke', isLight ? '#ffffff' : '#050811')
        .attr('stroke-width', 2);
    });

    // Interactive Hover Vertical Guide & Focus Dots
    const hoverLine = g.append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', isLight ? '#1a73e8' : '#8ab4f8')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4')
      .style('opacity', 0);

    const tooltipEl = this.chartTooltip.nativeElement;

    // Transparent overlay for mouse tracking
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', (event: MouseEvent) => {
        const [mouseX] = d3.pointer(event);
        
        // Find closest point
        let closestPoint = processedData[0];
        let minDistance = Infinity;

        processedData.forEach(d => {
          const x = xScale(d.day) || 0;
          const dist = Math.abs(x - mouseX);
          if (dist < minDistance) {
            minDistance = dist;
            closestPoint = d;
          }
        });

        const activeX = xScale(closestPoint.day) || 0;
        hoverLine
          .attr('x1', activeX)
          .attr('x2', activeX)
          .style('opacity', 1);

        // Update Tooltip Content with Strict Accessible Theme Colors
        const tooltipDay = tooltipEl.querySelector('#tooltip-day');
        const tooltipMetrics = tooltipEl.querySelector('#tooltip-metrics');

        const quantumColor = isLight ? '#0b57d0' : '#8ab4f8';
        const cybersecColor = isLight ? '#b3261e' : '#f28b82';
        const aiColor = isLight ? '#8f4700' : '#fdd663';
        const spaceColor = isLight ? '#137333' : '#81c995';

        if (tooltipDay) {
          tooltipDay.textContent = `Session Epoch: ${closestPoint.day}`;
          (tooltipDay as HTMLElement).style.color = isLight ? '#0b57d0' : '#8ab4f8';
        }
        if (tooltipMetrics) {
          tooltipMetrics.innerHTML = `
            <div class="flex items-center justify-between gap-4 py-0.5" style="color: ${quantumColor}; font-weight: 600;">
              <span>⚛️ Quantum:</span> <strong>${closestPoint.quantum}${unitSuffix}</strong>
            </div>
            <div class="flex items-center justify-between gap-4 py-0.5" style="color: ${cybersecColor}; font-weight: 600;">
              <span>🛡️ Cyber Defense:</span> <strong>${closestPoint.cybersec}${unitSuffix}</strong>
            </div>
            <div class="flex items-center justify-between gap-4 py-0.5" style="color: ${aiColor}; font-weight: 600;">
              <span>🧠 Autonomous AI:</span> <strong>${closestPoint.ai}${unitSuffix}</strong>
            </div>
            <div class="flex items-center justify-between gap-4 py-0.5" style="color: ${spaceColor}; font-weight: 600;">
              <span>🚀 Aero-Space:</span> <strong>${closestPoint.space}${unitSuffix}</strong>
            </div>
          `;
        }

        // Position Tooltip with Boundary Clamping (prevents cropping by container overflow)
        tooltipEl.style.display = 'block';
        const tooltipWidth = tooltipEl.offsetWidth || 180;
        let targetX = activeX + margin.left;
        const minX = tooltipWidth / 2 + 10;
        const maxX = width - (tooltipWidth / 2) - 10;
        targetX = Math.max(minX, Math.min(maxX, targetX));
        
        tooltipEl.style.left = `${targetX}px`;
        tooltipEl.style.top = `14px`;
      })
      .on('mouseleave', () => {
        hoverLine.style('opacity', 0);
        tooltipEl.style.display = 'none';
      });
  }
}

