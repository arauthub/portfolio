import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <section id="hero" class="hero-section">
      <div class="hero-container container-12">
        <div class="grid-12 hero-grid-12">
          <!-- Text Content (Col 1 to 7) -->
          <div class="col-7 hero-content">
            <div class="hero-eyebrow">
              <span class="eyebrow-pill">FESTIVE & DIWALI HEIRLOOMS 2026</span>
              <span class="eco-tag">
                <mat-icon class="pill-icon">verified</mat-icon> 100% Scratch-Free Handlooms
              </span>
            </div>

            <h1 class="hero-title">
              Childhood Dressed in <span class="highlight-serif">Royal Poetry</span> & Pure Mulmul
            </h1>

            <p class="hero-description">
              Handcrafted heirloom apparel for little Nawabs and Paris (ages 0 to 12Y). Thoughtfully designed with <strong>100% scratch-free cotton linings</strong> behind metallic gotapatti, room-to-grow foldable hems, and personalized royal zari monograms.
            </p>

            <div class="hero-actions">
              <button mat-raised-button class="cta-primary gold-shimmer-btn" (click)="exploreCollection('all')">
                Explore Festive Heirlooms
                <mat-icon>arrow_forward</mat-icon>
              </button>
              <button mat-stroked-button class="cta-secondary" (click)="exploreCollection('sibling-festive-jodi')">
                <mat-icon>family_restroom</mat-icon>
                Sibling Diwali Jodi Sets
              </button>
            </div>

            <!-- Value Pillars -->
            <div class="value-pillars">
              <div class="pillar-item">
                <div class="pillar-icon-box">
                  <mat-icon>spa</mat-icon>
                </div>
                <div>
                  <h4>100% Organic Mulmul</h4>
                  <p>Featherlight, breathable & chemical-free</p>
                </div>
              </div>

              <div class="pillar-item">
                <div class="pillar-icon-box">
                  <mat-icon>shield</mat-icon>
                </div>
                <div>
                  <h4>Scratch-Free Linings</h4>
                  <p>Soft cotton shield against metallic zari</p>
                </div>
              </div>

              <div class="pillar-item">
                <div class="pillar-icon-box">
                  <mat-icon>brush</mat-icon>
                </div>
                <div>
                  <h4>Royal Zari Monogram</h4>
                  <p>Custom child's name in gold thread</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Visual Gallery (Col 8 to 12) -->
          <div class="col-5 hero-visual">
            <div class="visual-card-primary">
              <img
                src="https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900&auto=format&fit=crop&q=80"
                alt="Baby in Organic Mulmul Angrakha"
                class="main-img"
              />
              <div class="floating-badge badge-top-right">
                <div class="badge-icon-wrap">
                  <mat-icon>shield</mat-icon>
                </div>
                <div class="badge-text-wrap">
                  <span class="badge-label">100% Safe</span>
                  <span class="badge-val">Scratch-Free Lined</span>
                </div>
              </div>

              <div class="floating-badge badge-bottom-left">
                <div class="badge-icon-wrap gold">
                  <mat-icon>military_tech</mat-icon>
                </div>
                <div class="badge-text-wrap">
                  <span class="badge-label">PURE COTTON</span>
                  <span class="badge-val">GOTS Certified Organic</span>
                </div>
              </div>
            </div>

            <div class="visual-card-secondary">
              <img
                src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80"
                alt="Toddler in Handloom Silk Kurta Dhoti"
                class="sub-img"
              />
              <div class="monogram-preview-pill">
                <span class="mono-initials">AARAV • 2026</span>
                <span class="mono-thread">Royal Zari Embroidery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(180deg, var(--pm-surface, #FDFBF7) 0%, rgba(245, 241, 237, 0.5) 100%);
      padding: 3.5rem 0 4rem;
      position: relative;
      overflow: hidden;
    }

    .hero-grid-12 {
      align-items: center;
    }

    .hero-eyebrow {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .eyebrow-pill {
      background: var(--pm-surface-variant, #F5F1ED);
      color: var(--pm-text, #2D3A4B);
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 4px 12px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,0.06);
    }

    .eco-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #24542B;
      font-size: 0.75rem;
      font-weight: 700;

      .pill-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #24542B;
      }
    }

    .hero-title {
      font-family: var(--pm-font-serif, 'Playfair Display', serif);
      font-size: 3.25rem;
      line-height: 1.15;
      color: var(--pm-text, #2D3A4B);
      margin: 0 0 1.25rem 0;
      font-weight: 700;

      .highlight-serif {
        font-style: italic;
        color: var(--pm-primary, #4A5859);
        position: relative;
        display: inline-block;
      }
    }

    .hero-description {
      font-size: 1.125rem;
      line-height: 1.6;
      color: #334155;
      margin: 0 0 2rem 0;
      max-width: 580px;

      strong {
        color: var(--pm-text, #2D3A4B);
      }
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.75rem;
      flex-wrap: wrap;
    }

    .cta-primary {
      background: var(--pm-primary, #4A5859) !important;
      color: #FFFFFF !important;
      padding: 12px 28px !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 999px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      box-shadow: 0 8px 24px rgba(74, 88, 89, 0.25) !important;
      transition: all 0.25s ease !important;

      &:hover {
        background: #384344 !important;
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(74, 88, 89, 0.35) !important;
      }
    }

    .cta-secondary {
      border: 1.5px solid var(--pm-primary, #4A5859) !important;
      color: var(--pm-primary, #4A5859) !important;
      padding: 12px 24px !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 999px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;

      &:hover {
        background: rgba(74, 88, 89, 0.05) !important;
      }
    }

    .value-pillars {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(0,0,0,0.08);

      .pillar-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        .pillar-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--pm-surface-variant, #F5F1ED);
          color: var(--pm-primary, #4A5859);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        h4 {
          font-size: 0.875rem;
          margin: 0 0 2px 0;
          color: var(--pm-text, #2D3A4B);
          font-weight: 700;
        }

        p {
          font-size: 0.75rem;
          margin: 0;
          color: #475569;
          line-height: 1.35;
        }
      }
    }

    .hero-visual {
      position: relative;
      display: flex;
      justify-content: center;
    }

    .visual-card-primary {
      width: 380px;
      height: 480px;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
      position: relative;

      .main-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;

        &:hover {
          transform: scale(1.03);
        }
      }
    }

    .visual-card-secondary {
      position: absolute;
      bottom: -30px;
      left: -40px;
      width: 200px;
      height: 250px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);
      border: 4px solid #FFFFFF;

      .sub-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .floating-badge {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      padding: 8px 14px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);

      &.badge-top-right {
        top: 20px;
        right: 20px;
      }

      &.badge-bottom-left {
        bottom: 30px;
        right: 20px;
      }

      .badge-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #E8F5E9;
        color: #2E7D32;
        display: flex;
        align-items: center;
        justify-content: center;

        &.gold {
          background: #FEF3C7;
          color: #854D0E;
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .badge-text-wrap {
        display: flex;
        flex-direction: column;

        .badge-label {
          font-size: 0.6875rem;
          color: #71717A;
          text-transform: uppercase;
          font-weight: 600;
        }

        .badge-val {
          font-size: 0.8125rem;
          color: #1A1A1A;
          font-weight: 700;
        }
      }
    }

    .monogram-preview-pill {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      background: rgba(45, 58, 75, 0.9);
      color: #FFFFFF;
      padding: 6px 10px;
      border-radius: 12px;
      text-align: center;
      backdrop-filter: blur(4px);

      .mono-initials {
        display: block;
        font-family: var(--pm-font-serif, 'Playfair Display', serif);
        letter-spacing: 2px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #FDE68A;
      }

      .mono-thread {
        display: block;
        font-size: 0.5625rem;
        color: #E2E8F0;
        opacity: 0.95;
      }
    }

    @media (max-width: 992px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .hero-title {
        font-size: 2.5rem;
      }
      .visual-card-primary {
        width: 100%;
        max-width: 340px;
        height: 420px;
      }
      .visual-card-secondary {
        display: none;
      }
      .value-pillars {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class HeroComponent {
  explore = output<string>();

  exploreCollection(slug: string): void {
    this.explore.emit(slug);
    if (typeof document !== 'undefined') {
      const el = document.getElementById('catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
