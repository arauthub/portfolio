import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-lookbook',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <section id="lookbook" class="lookbook-section">
      <div class="container">
        <!-- Header -->
        <div class="lookbook-head text-center">
          <span class="sub-pill">SPRING / SUMMER 2026 PLAYBOOK</span>
          <h2 class="title">Adventures in the Sunlit Orchard</h2>
          <p class="description">
            Interactive outfit journal capturing sibling laughter, treehouse explorations, and seaside picnics. Click any golden badge to inspect the outfit.
          </p>
        </div>

        <!-- Editorial Lookbook Grid -->
        <div class="editorial-grid">
          <!-- Main Hero Look with Interactive Hotspots -->
          <div class="look-feature-card">
            <div class="media-container">
              <img
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&auto=format&fit=crop&q=80"
                alt="Siblings in Matching Outfits"
                class="lookbook-img"
              />

              <!-- Hotspot 1: Sibling Harmony Linen Co-Ord -->
              <div
                class="hotspot hotspot-1"
                (click)="viewProductBySlug('sibling-harmony-linen-co-ord-set')"
                [matTooltip]="'Sibling Harmony Linen Co-Ord (' + currency.format(92) + ')'"
              >
                <div class="pulse-ring"></div>
                <div class="spot-center"><mat-icon>shopping_bag</mat-icon></div>
              </div>

              <!-- Hotspot 2: French Linen Dungarees -->
              <div
                class="hotspot hotspot-2"
                (click)="viewProductBySlug('little-explorer-french-linen-dungaree-set')"
                [matTooltip]="'Little Explorer Dungarees (' + currency.format(68) + ')'"
              >
                <div class="pulse-ring"></div>
                <div class="spot-center"><mat-icon>brush</mat-icon></div>
              </div>
            </div>

            <div class="look-caption">
              <span class="scene-tag">SCENE 01 • PROVENCE ORCHARD</span>
              <h3>The Sibling Harmony Collection</h3>
              <p>
                Dyed with botanical olive and clay pigments. Designed so older siblings and little toddlers can dress in visual symmetry without sacrificing play-ready comfort.
              </p>
            </div>
          </div>

          <!-- Secondary Look Cards -->
          <div class="secondary-looks">
            <div class="look-sub-card">
              <div class="sub-media">
                <img
                  src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=700&auto=format&fit=crop&q=80"
                  alt="Meadow Sundress"
                />
                <div
                  class="hotspot hotspot-sub"
                  (click)="viewProductBySlug('hand-smocked-meadow-bloom-sundress')"
                  [matTooltip]="'Hand-Smocked Meadow Bloom Sundress (' + currency.format(78) + ')'"
                >
                  <div class="pulse-ring"></div>
                  <div class="spot-center"><mat-icon>local_florist</mat-icon></div>
                </div>
              </div>
              <div class="sub-caption">
                <h4>Hand-Smocked Meadow Sundress</h4>
                <p>Pure Tana Lawn cotton with wildflower botanical print.</p>
              </div>
            </div>

            <div class="look-sub-card">
              <div class="sub-media">
                <img
                  src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&auto=format&fit=crop&q=80"
                  alt="Merino Knit Fisherman"
                />
                <div
                  class="hotspot hotspot-sub"
                  (click)="viewProductBySlug('chunky-merino-fisherman-cardigan')"
                  [matTooltip]="'Chunky Merino Fisherman Cardigan (' + currency.format(84) + ')'"
                >
                  <div class="pulse-ring"></div>
                  <div class="spot-center"><mat-icon>straighten</mat-icon></div>
                </div>
              </div>
              <div class="sub-caption">
                <h4>Chunky Merino Fisherman Knit</h4>
                <p>Extra-fine Italian merino with horn buttons & turnback cuffs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lookbook-section {
      padding: 5rem 0;
      background: var(--pm-surface-variant, #F5F1ED);
    }

    .lookbook-head {
      max-width: 650px;
      margin: 0 auto 3rem auto;

      .sub-pill {
        font-size: 0.75rem;
        letter-spacing: 2px;
        font-weight: 700;
        color: var(--pm-primary, #4A5859);
        text-transform: uppercase;
        display: inline-block;
        margin-bottom: 0.5rem;
      }

      .title {
        font-family: var(--pm-font-serif, 'Playfair Display', serif);
        font-size: 2.5rem;
        color: var(--pm-text, #2D3A4B);
        margin: 0 0 1rem 0;
        font-weight: 700;
      }

      .description {
        font-size: 1rem;
        color: #334155;
        line-height: 1.6;
      }
    }

    .editorial-grid {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 2rem;
      align-items: stretch;
    }

    .look-feature-card {
      background: #FFFFFF;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;

      .media-container {
        position: relative;
        height: 520px;
        background: #EAE5DF;

        .lookbook-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .look-caption {
        padding: 1.75rem;

        .scene-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--pm-primary, #4A5859);
          display: block;
          margin-bottom: 6px;
        }

        h3 {
          font-family: var(--pm-font-serif, 'Playfair Display', serif);
          font-size: 1.5rem;
          color: #2D3A4B;
          margin: 0 0 8px 0;
        }

        p {
          font-size: 0.875rem;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }
      }
    }

    .secondary-looks {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .look-sub-card {
      background: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.05);

      .sub-media {
        position: relative;
        height: 230px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .sub-caption {
        padding: 1rem 1.25rem;

        h4 {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #2D3A4B;
          margin: 0 0 4px 0;
        }

        p {
          font-size: 0.75rem;
          color: #475569;
          margin: 0;
        }
      }
    }

    /* Hotspots Animation */
    .hotspot {
      position: absolute;
      width: 38px;
      height: 38px;
      cursor: pointer;
      z-index: 5;

      .pulse-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(224, 169, 109, 0.4);
        animation: pulseEffect 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
      }

      .spot-center {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #FFFFFF;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--pm-primary, #4A5859);
        transition: transform 0.2s;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      &:hover .spot-center {
        transform: scale(1.2);
        background: var(--pm-primary, #4A5859);
        color: #FFFFFF;
      }

      &.hotspot-1 {
        top: 35%;
        left: 38%;
      }

      &.hotspot-2 {
        bottom: 30%;
        right: 32%;
      }

      &.hotspot-sub {
        top: 25%;
        right: 25%;
      }
    }

    @keyframes pulseEffect {
      0% {
        transform: scale(0.9);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.2;
      }
      100% {
        transform: scale(1.8);
        opacity: 0;
      }
    }

    @media (max-width: 900px) {
      .editorial-grid {
        grid-template-columns: 1fr;
      }
      .look-feature-card .media-container {
        height: 380px;
      }
    }
  `]
})
export class LookbookComponent {
  currency = inject(CurrencyService);
  openProductBySlug = output<string>();

  viewProductBySlug(slug: string): void {
    this.openProductBySlug.emit(slug);
  }
}
