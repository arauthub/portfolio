import { Component, ElementRef, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-visualizer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d3-canvas-wrapper" [class.hidden]="themeService.d3AnimationType() === 'none'">
      <svg #d3Svg class="d3-backdrop-svg"></svg>
    </div>
  `,
  styles: [`
    .d3-canvas-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      opacity: 0.45;
      transition: opacity 0.5s ease;

      &.hidden {
        display: none;
      }
    }

    .d3-backdrop-svg {
      width: 100%;
      height: 100%;
    }
  `]
})
export class D3VisualizerComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  private elementRef = inject(ElementRef);
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const type = this.themeService.d3AnimationType();
      if (typeof window !== 'undefined') {
        setTimeout(() => this.initVisualizer(type), 50);
      }
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initVisualizer(this.themeService.d3AnimationType());
      window.addEventListener('resize', this.onResize);
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private onResize = () => {
    this.initVisualizer(this.themeService.d3AnimationType());
  };

  private initVisualizer(type: string): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    const svgEl = this.elementRef.nativeElement.querySelector('svg');
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    if (type === 'none') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    if (type === 'silk') {
      this.renderSilkWaves(svg, width, height);
    } else if (type === 'constellation') {
      this.renderConstellations(svg, width, height);
    } else if (type === 'aurora') {
      this.renderAurora(svg, width, height);
    } else if (type === 'bubbles') {
      this.renderPlayfulBubbles(svg, width, height);
    }
  }

  private renderSilkWaves(svg: any, width: number, height: number): void {
    const waveCount = 5;
    const colors = ['#7AA884', '#FAD4C0', '#8E7CC3', '#FF9F1C', '#A3B18A'];
    const paths = Array.from({ length: waveCount }, (_, i) => {
      return svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', colors[i % colors.length])
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.25 - (i * 0.03));
    });

    let t = 0;
    const animate = () => {
      t += 0.012;
      paths.forEach((path, i) => {
        const points: [number, number][] = [];
        const freq = 0.002 + i * 0.0006;
        const speed = t + i * 0.8;
        const baseHeight = height * (0.3 + i * 0.12);

        for (let x = 0; x <= width; x += 30) {
          const y = baseHeight + Math.sin(x * freq + speed) * (40 + i * 15) + Math.cos(x * 0.001 - speed * 0.5) * 20;
          points.push([x, y]);
        }
        const lineGen = d3.line().curve(d3.curveBasis);
        path.attr('d', lineGen(points));
      });
      this.animFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private renderConstellations(svg: any, width: number, height: number): void {
    const numStars = Math.min(60, Math.floor(width / 25));
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.5 + 1
    }));

    const linesGroup = svg.append('g').attr('class', 'lines');
    const starsGroup = svg.append('g').attr('class', 'stars');

    const circles = starsGroup.selectAll('circle')
      .data(stars)
      .enter()
      .append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', '#7AA884')
      .attr('opacity', 0.6);

    const animate = () => {
      stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;
      });

      circles.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      const links: any[] = [];
      const maxDist = 110;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            links.push({
              source: stars[i],
              target: stars[j],
              opacity: (1 - dist / maxDist) * 0.25
            });
          }
        }
      }

      const lines = linesGroup.selectAll('line').data(links);
      lines.exit().remove();
      lines.enter()
        .append('line')
        .attr('stroke', '#FAD4C0')
        .attr('stroke-width', 0.8)
        .merge(lines)
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
        .attr('opacity', (d: any) => d.opacity);

      this.animFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private renderAurora(svg: any, width: number, height: number): void {
    const auroraGroup = svg.append('g');
    const numBands = 3;
    const colors = ['#7AA884', '#FAD4C0', '#8E7CC3'];

    const bands = Array.from({ length: numBands }, (_, i) => {
      return auroraGroup.append('path')
        .attr('fill', colors[i])
        .attr('opacity', 0.12 - (i * 0.02))
        .attr('filter', 'blur(35px)');
    });

    let t = 0;
    const animate = () => {
      t += 0.008;
      bands.forEach((band, i) => {
        const topPoints: [number, number][] = [];
        const bottomPoints: [number, number][] = [];
        const baseH = height * (0.2 + i * 0.15);

        for (let x = 0; x <= width; x += 40) {
          const yTop = baseH + Math.sin(x * 0.0015 + t + i) * 60;
          const yBottom = yTop + 140 + Math.cos(x * 0.002 - t) * 40;
          topPoints.push([x, yTop]);
          bottomPoints.unshift([x, yBottom]);
        }

        const polygonPoints = [...topPoints, ...bottomPoints];
        const lineGen = d3.line().curve(d3.curveBasis);
        band.attr('d', lineGen(polygonPoints) + 'Z');
      });
      this.animFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  private renderPlayfulBubbles(svg: any, width: number, height: number): void {
    const numBubbles = Math.min(30, Math.floor(width / 40));
    const bubbles = Array.from({ length: numBubbles }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      r: Math.random() * 18 + 8,
      speed: Math.random() * 1.2 + 0.4,
      drift: (Math.random() - 0.5) * 0.5,
      color: ['#7AA884', '#FAD4C0', '#FF9F1C', '#8E7CC3', '#FF6B6B'][Math.floor(Math.random() * 5)]
    }));

    const circles = svg.selectAll('circle')
      .data(bubbles)
      .enter()
      .append('circle')
      .attr('r', (d: any) => d.r)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.35);

    const animate = () => {
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += b.drift;
        if (b.y < -50) {
          b.y = height + 40;
          b.x = Math.random() * width;
        }
      });
      circles.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      this.animFrameId = requestAnimationFrame(animate);
    };
    animate();
  }
}
