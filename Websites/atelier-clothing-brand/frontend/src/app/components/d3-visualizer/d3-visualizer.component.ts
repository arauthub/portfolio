import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { ThemeService } from '../../services/theme.service';
import { D3AnimationType } from '../../models/product.model';

@Component({
  selector: 'app-d3-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="d3-visualizer-container" aria-label="Interactive Luxury D3 Visualizer">
      <div class="visualizer-header">
        <div class="header-left">
          <span class="badge">D3.JS LIVING FASHION CANVAS</span>
          <h3>Artisan Fabric Motion & Sensory Dynamics</h3>
          <p>Powered by mathematical curves and D3.js real-time physics. Select animation preset below:</p>
        </div>

        <!-- Animation Preset Controller (Controllable by user & synced with Wagtail CMS) -->
        <div class="animation-switcher">
          <button 
            type="button" 
            class="anim-btn" 
            [class.active]="themeService.currentD3Animation() === 'silk_flow'"
            (click)="setAnimation('silk_flow')">
            <span class="dot"></span> Silk Drape Waves
          </button>
          <button 
            type="button" 
            class="anim-btn" 
            [class.active]="themeService.currentD3Animation() === 'heritage_constellation'"
            (click)="setAnimation('heritage_constellation')">
            <span class="dot"></span> Gold Constellation
          </button>
          <button 
            type="button" 
            class="anim-btn" 
            [class.active]="themeService.currentD3Animation() === 'aurora_pulse'"
            (click)="setAnimation('aurora_pulse')">
            <span class="dot"></span> Aurora Luxury Pulse
          </button>
          <button 
            type="button" 
            class="anim-btn" 
            [class.active]="themeService.currentD3Animation() === 'fabric_weave'"
            (click)="setAnimation('fabric_weave')">
            <span class="dot"></span> Loom Warp & Weft
          </button>
        </div>
      </div>

      <!-- Canvas SVG Target Container -->
      <div class="svg-stage" #stageContainer (mousemove)="onMouseMove($event)" (mouseleave)="onMouseLeave()">
        <svg #d3Svg class="d3-svg" width="100%" height="280"></svg>
        <div class="interactive-hint">
          <span class="pulse-icon">✦</span> Hover or glide cursor to sculpt luxury fabric tension
        </div>
      </div>
    </section>
  `,
  styles: [`
    .d3-visualizer-container {
      margin: 40px auto;
      max-width: 1400px;
      padding: 0 24px;
      position: relative;
    }

    .visualizer-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 16px;
    }

    .header-left .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 6px;
      text-transform: uppercase;
      border: 1px solid rgba(234, 216, 192, 0.2);
    }

    .header-left h3 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 24px;
      margin: 0 0 6px 0;
      color: var(--text-primary, #F8FAFC);
      font-weight: 600;
    }

    .header-left p {
      font-size: 13px;
      color: var(--text-secondary, #94A3B8);
      margin: 0;
    }

    .animation-switcher {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background: rgba(255, 255, 255, 0.03);
      padding: 6px;
      border-radius: 9999px;
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
    }

    .anim-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary, #94A3B8);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s ease;
    }

    .anim-btn .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-muted, #64748B);
      transition: all 0.25s ease;
    }

    .anim-btn:hover {
      color: var(--text-primary, #F8FAFC);
    }

    .anim-btn.active {
      background: rgba(234, 216, 192, 0.15);
      color: var(--accent-gold, #EAD8C0);
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .anim-btn.active .dot {
      background: var(--accent-gold, #EAD8C0);
      box-shadow: 0 0 8px var(--accent-gold, #EAD8C0);
    }

    .svg-stage {
      position: relative;
      background: linear-gradient(180deg, rgba(18, 20, 25, 0.9) 0%, rgba(10, 11, 14, 0.98) 100%);
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.12));
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    }

    .d3-svg {
      display: block;
      width: 100%;
      height: 280px;
    }

    .interactive-hint {
      position: absolute;
      bottom: 12px;
      right: 16px;
      font-size: 11px;
      color: var(--text-secondary, #94A3B8);
      background: rgba(10, 11, 14, 0.7);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      pointer-events: none;
    }

    .pulse-icon {
      color: var(--accent-gold, #EAD8C0);
      margin-right: 4px;
      display: inline-block;
      animation: spinSlow 8s linear infinite;
    }

    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Folding & Mobile Responsive adjustments */
    @media (max-width: 768px) {
      .visualizer-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .animation-switcher {
        width: 100%;
        overflow-x: auto;
        border-radius: 8px;
      }
      .anim-btn {
        flex-shrink: 0;
      }
      .d3-svg {
        height: 220px;
      }
    }
  `]
})
export class D3VisualizerComponent implements AfterViewInit, OnDestroy {
  themeService = inject(ThemeService);

  @ViewChild('d3Svg', { static: false }) svgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('stageContainer', { static: false }) stageRef!: ElementRef<HTMLDivElement>;

  private animTimer: any = null;
  private mouseX = 0;
  private mouseY = 0;
  private hasMouse = false;
  private frameCount = 0;

  constructor() {
    effect(() => {
      // Re-initialize animation on preset change
      const current = this.themeService.currentD3Animation();
      if (this.svgRef) {
        this.startSelectedAnimation(current);
      }
    });
  }

  ngAfterViewInit(): void {
    this.startSelectedAnimation(this.themeService.currentD3Animation());
  }

  ngOnDestroy(): void {
    if (this.animTimer) {
      this.animTimer.stop();
    }
  }

  setAnimation(style: D3AnimationType): void {
    this.themeService.setD3Animation(style);
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.stageRef) return;
    const rect = this.stageRef.nativeElement.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.hasMouse = true;
  }

  onMouseLeave(): void {
    this.hasMouse = false;
  }

  private startSelectedAnimation(type: D3AnimationType): void {
    if (this.animTimer) {
      this.animTimer.stop();
      this.animTimer = null;
    }

    const svg = d3.select(this.svgRef.nativeElement);
    svg.selectAll('*').remove();

    switch (type) {
      case 'silk_flow':
        this.renderSilkFlow(svg);
        break;
      case 'heritage_constellation':
        this.renderConstellation(svg);
        break;
      case 'aurora_pulse':
        this.renderAuroraPulse(svg);
        break;
      case 'fabric_weave':
        this.renderFabricWeave(svg);
        break;
      default:
        this.renderSilkFlow(svg);
    }
  }

  /**
   * 1. SILK FLOW: Fluid luxury drapery ribbons with floating particles
   */
  private renderSilkFlow(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
    const width = this.svgRef.nativeElement.clientWidth || 1000;
    const height = 280;

    // Define gradients
    const defs = svg.append('defs');
    const grad1 = defs.append('linearGradient')
      .attr('id', 'silkGrad1')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    grad1.append('stop').attr('offset', '0%').attr('stop-color', '#EAD8C0').attr('stop-opacity', 0.6);
    grad1.append('stop').attr('offset', '100%').attr('stop-color', '#C19A6B').attr('stop-opacity', 0.1);

    const grad2 = defs.append('linearGradient')
      .attr('id', 'silkGrad2')
      .attr('x1', '100%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    grad2.append('stop').attr('offset', '0%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 0.4);
    grad2.append('stop').attr('offset', '100%').attr('stop-color', '#EAD8C0').attr('stop-opacity', 0.05);

    const ribbonCount = 5;
    const paths = Array.from({ length: ribbonCount }, (_, i) => {
      return svg.append('path')
        .attr('fill', i % 2 === 0 ? 'url(#silkGrad1)' : 'url(#silkGrad2)')
        .attr('stroke', '#EAD8C0')
        .attr('stroke-width', 0.8)
        .attr('opacity', 0.6 + i * 0.08);
    });

    // Stardust floating particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2.5,
      speedX: -0.3 + Math.random() * 0.6,
      speedY: -0.2 + Math.random() * 0.4,
      opacity: 0.2 + Math.random() * 0.8
    }));

    const particleElements = svg.append('g').selectAll('circle')
      .data(particles)
      .enter()
      .append('circle')
      .attr('r', d => d.size)
      .attr('fill', '#EAD8C0')
      .attr('opacity', d => d.opacity);

    this.animTimer = d3.timer((elapsed) => {
      this.frameCount++;
      const t = elapsed * 0.001;

      // Update paths
      paths.forEach((path, rIdx) => {
        const points: [number, number][] = [];
        const steps = 30;
        const stepSize = width / steps;

        for (let i = 0; i <= steps; i++) {
          const x = i * stepSize;
          const mouseDist = this.hasMouse ? Math.abs(x - this.mouseX) : 500;
          const mouseLift = Math.max(0, 40 - mouseDist * 0.15);

          const baseWave = Math.sin(x * 0.005 + t * 1.5 + rIdx * 0.7) * 45;
          const secondaryWave = Math.cos(x * 0.01 - t * 0.8 + rIdx) * 20;
          const y = (height / 2) + baseWave + secondaryWave + (rIdx * 18 - 40) - (this.hasMouse ? mouseLift : 0);
          points.push([x, y]);
        }

        const area = d3.area<[number, number]>()
          .x(d => d[0])
          .y0(height)
          .y1(d => d[1])
          .curve(d3.curveBasis);

        path.attr('d', area(points) || '');
      });

      // Update particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      particleElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }

  /**
   * 2. HERITAGE CONSTELLATION: Interconnected craft nodes reacting to mouse
   */
  private renderConstellation(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
    const width = this.svgRef.nativeElement.clientWidth || 1000;
    const height = 280;

    const nodeCount = 45;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: 2 + Math.random() * 3
    }));

    const linesGroup = svg.append('g').attr('class', 'constellation-lines');
    const nodesGroup = svg.append('g').attr('class', 'constellation-nodes');

    const circles = nodesGroup.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', '#EAD8C0')
      .attr('opacity', 0.8);

    this.animTimer = d3.timer(() => {
      // Move nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Attract lightly to mouse if nearby
        if (this.hasMouse) {
          const dx = this.mouseX - node.x;
          const dy = this.mouseY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 10) {
            node.x += (dx / dist) * 0.8;
            node.y += (dy / dist) * 0.8;
          }
        }
      });

      circles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      // Draw connection filaments
      linesGroup.selectAll('line').remove();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            linesGroup.append('line')
              .attr('x1', nodes[i].x)
              .attr('y1', nodes[i].y)
              .attr('x2', nodes[j].x)
              .attr('y2', nodes[j].y)
              .attr('stroke', '#EAD8C0')
              .attr('stroke-width', 0.6)
              .attr('stroke-opacity', 1 - (dist / 100));
          }
        }
      }
    });
  }

  /**
   * 3. AURORA PULSE: Luxury atmospheric waves
   */
  private renderAuroraPulse(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
    const width = this.svgRef.nativeElement.clientWidth || 1000;
    const height = 280;

    const defs = svg.append('defs');
    const radialGrad = defs.append('radialGradient')
      .attr('id', 'auroraGlow')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radialGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.5);
    radialGrad.append('stop').attr('offset', '60%').attr('stop-color', '#EAD8C0').attr('stop-opacity', 0.2);
    radialGrad.append('stop').attr('offset', '100%').attr('stop-color', 'transparent').attr('stop-opacity', 0);

    const orb1 = svg.append('circle').attr('r', 160).attr('fill', 'url(#auroraGlow)');
    const orb2 = svg.append('circle').attr('r', 120).attr('fill', 'url(#auroraGlow)');

    this.animTimer = d3.timer((elapsed) => {
      const t = elapsed * 0.001;
      const x1 = (width / 2) + Math.cos(t) * (width * 0.25);
      const y1 = (height / 2) + Math.sin(t * 1.4) * 50;

      const x2 = (width / 2) + Math.sin(t * 0.8) * (width * 0.3);
      const y2 = (height / 2) + Math.cos(t * 1.1) * 60;

      orb1.attr('cx', this.hasMouse ? (this.mouseX * 0.6 + x1 * 0.4) : x1).attr('cy', y1);
      orb2.attr('cx', x2).attr('cy', y2);
    });
  }

  /**
   * 4. FABRIC WEAVE: Micro-loom warp & weft textile physics
   */
  private renderFabricWeave(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
    const width = this.svgRef.nativeElement.clientWidth || 1000;
    const height = 280;

    const spacing = 18;
    const warpLines = Math.floor(width / spacing);
    const weftLines = Math.floor(height / spacing);

    const gWarp = svg.append('g').attr('class', 'warp-threads');
    const gWeft = svg.append('g').attr('class', 'weft-threads');

    const warps = Array.from({ length: warpLines }, (_, i) => {
      return gWarp.append('path')
        .attr('stroke', i % 4 === 0 ? '#C19A6B' : 'rgba(234, 216, 192, 0.25)')
        .attr('stroke-width', i % 4 === 0 ? 1.5 : 0.8)
        .attr('fill', 'none');
    });

    const wefts = Array.from({ length: weftLines }, (_, i) => {
      return gWeft.append('path')
        .attr('stroke', i % 3 === 0 ? '#EAD8C0' : 'rgba(255, 255, 255, 0.12)')
        .attr('stroke-width', 0.8)
        .attr('fill', 'none');
    });

    this.animTimer = d3.timer((elapsed) => {
      const t = elapsed * 0.0015;

      warps.forEach((path, i) => {
        const x = i * spacing;
        const mouseDist = this.hasMouse ? Math.abs(x - this.mouseX) : 500;
        const wave = Math.sin(i * 0.3 + t * 2) * (mouseDist < 100 ? 12 : 4);
        path.attr('d', `M ${x + wave} 0 L ${x - wave} ${height}`);
      });

      wefts.forEach((path, i) => {
        const y = i * spacing;
        const mouseDist = this.hasMouse ? Math.abs(y - this.mouseY) : 500;
        const wave = Math.cos(i * 0.3 + t * 2) * (mouseDist < 80 ? 8 : 2);
        path.attr('d', `M 0 ${y + wave} L ${width} ${y - wave}`);
      });
    });
  }
}
