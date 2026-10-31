import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BrandTenant } from '../../models/kids.model';

@Component({
  selector: 'app-brand-portal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="brand-backdrop" (click)="close()">
        <div class="brand-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="dialog-header">
            <div>
              <span class="badge">CENTRAL SHOPPING HUB • MULTI-BRAND ECOSYSTEM</span>
              <h2>Hosted Childrenswear Brands & Paid Promotion</h2>
              <p class="sub">Host your nursery brand under the Petit Maison umbrella with enterprise Wagtail AI curation.</p>
            </div>
            <button class="close-btn" (click)="close()">✕</button>
          </div>

          <!-- Tabs: Directory vs Paid Promotion Packages -->
          <div class="tabs-bar">
            <button [class.active]="activeTab() === 'directory'" (click)="activeTab.set('directory')">
              Hosted Brand Directory ({{ brands().length }})
            </button>
            <button [class.active]="activeTab() === 'promote'" (click)="activeTab.set('promote')">
              Paid Promotion & Brand Onboarding
            </button>
          </div>

          <!-- Tab 1: Hosted Brands Directory -->
          @if (activeTab() === 'directory') {
            <div class="brands-grid">
              @for (brand of brands(); track brand.slug) {
                <div class="brand-card" [class.promoted]="brand.is_promoted">
                  <div class="brand-banner" [style.backgroundImage]="'url(' + brand.banner_url + ')'">
                    @if (brand.is_promoted) {
                      <span class="promo-badge">{{ brand.promoted_badge || 'Spotlight Brand' }}</span>
                    }
                  </div>
                  <div class="brand-content">
                    <div class="logo-row">
                      <img [src]="brand.logo_url" [alt]="brand.name" class="brand-logo" />
                      <div>
                        <h3>{{ brand.name }}</h3>
                        <span class="origin">{{ brand.origin_country }} • Est. {{ brand.founding_year }}</span>
                      </div>
                    </div>
                    <p class="tagline">{{ brand.tagline }}</p>
                    <p class="story">{{ brand.story }}</p>
                    <div class="brand-footer">
                      <span class="tier-tag">{{ brand.subscription_tier }} TIER</span>
                      <a [href]="'mailto:' + brand.contact_email" class="contact-link">Contact Atelier</a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Tab 2: Paid Promotion System & Onboarding -->
          @if (activeTab() === 'promote') {
            <div class="promotion-plans">
              <h3>Boost Your Brand Visibility on Petit Maison Hub</h3>
              <p class="plans-intro">Choose an enterprise promotion package to place your garments front-and-center across global parents and retail buyers.</p>

              <div class="packages-grid">
                <div class="package-card standard">
                  <h4>Standard Partner</h4>
                  <div class="plan-price">$99<span>/mo</span></div>
                  <ul class="features">
                    <li>Indexed in Central Commerce Hub directory</li>
                    <li>Standard live stock sync via Barcode Scanner</li>
                    <li>In-Store POS register readiness</li>
                  </ul>
                  <button class="apply-plan-btn" (click)="selectPackage('STANDARD')">Select Standard</button>
                </div>

                <div class="package-card featured">
                  <div class="pop-pill">POPULAR</div>
                  <h4>Featured Collection</h4>
                  <div class="plan-price">$399<span>/mo</span></div>
                  <ul class="features">
                    <li>Pinned top-row in Sibling & Baby Catalogs</li>
                    <li>Editorial Curated badge in Wagtail Workflows</li>
                    <li>Wagtail AI Childcare Concierge recommendations</li>
                    <li>Priority customer care & marketing inclusion</li>
                  </ul>
                  <button class="apply-plan-btn" (click)="selectPackage('FEATURED_COLLECTION')">Select Featured</button>
                </div>

                <div class="package-card spotlight">
                  <div class="pop-pill gold">MAX REACH</div>
                  <h4>Hero Spotlight</h4>
                  <div class="plan-price">$799<span>/mo</span></div>
                  <ul class="features">
                    <li>Homepage Hero Stage Carousel Spotlight</li>
                    <li>Full lookbook editorial narrative & video showcase</li>
                    <li>Dedicated custom brand theme colors & fonts</li>
                    <li>White Glove VIP customer promotion emails</li>
                  </ul>
                  <button class="apply-plan-btn" (click)="selectPackage('HERO_SPOTLIGHT')">Select Hero Spotlight</button>
                </div>
              </div>

              <!-- Application Submission Form -->
              <div class="promo-application-form">
                <h4>Submit Brand Promotion Application</h4>
                <div class="form-grid">
                  <input type="text" [(ngModel)]="appName" placeholder="Brand Name" class="f-input" />
                  <input type="email" [(ngModel)]="appEmail" placeholder="Official Business Email" class="f-input" />
                  <input type="text" [(ngModel)]="appCountry" placeholder="Country of Origin" class="f-input" />
                  <select [(ngModel)]="selectedPackage" class="f-input">
                    <option value="STANDARD">Standard Partner ($99/mo)</option>
                    <option value="FEATURED_COLLECTION">Featured Collection ($399/mo)</option>
                    <option value="HERO_SPOTLIGHT">Hero Spotlight ($799/mo)</option>
                  </select>
                </div>
                <textarea [(ngModel)]="appStory" placeholder="Describe your brand craftsmanship, organic certifications, and catalog..." class="f-textarea"></textarea>
                <button class="submit-app-btn" (click)="submitPromotion()">
                  Submit to Wagtail Editorial Moderation Workflow →
                </button>

                @if (submissionResponse) {
                  <div class="submission-success">
                    <span class="material-symbols-outlined icon">check_circle</span>
                    <span>{{ submissionResponse }}</span>
                  </div>
                }
              </div>
            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .brand-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 39, 32, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .brand-dialog {
      background: #FAF6EE;
      color: #2b3a32;
      width: 95vw;
      max-width: 960px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 20px;
      border: 1px solid rgba(122, 168, 132, 0.3);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
      padding: 26px;
    }

    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;

      .badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #7AA884;
        text-transform: uppercase;
      }

      h2 { margin: 4px 0; font-size: 1.5rem; font-weight: 800; }
      .sub { margin: 0; font-size: 0.85rem; color: #66776e; }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: #666;
      }
    }

    .tabs-bar {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid #E5DFD5;
      margin-bottom: 20px;

      button {
        padding: 10px 16px;
        background: none;
        border: none;
        font-size: 0.85rem;
        font-weight: 700;
        color: #66776e;
        cursor: pointer;
        border-bottom: 3px solid transparent;

        &.active {
          color: #2b3a32;
          border-bottom-color: #7AA884;
        }
      }
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .brand-card {
      background: white;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #E5DFD5;
      display: flex;
      flex-direction: column;

      &.promoted {
        border-color: #7AA884;
      }

      .brand-banner {
        height: 110px;
        background-size: cover;
        background-position: center;
        position: relative;
        padding: 8px;

        .promo-badge {
          background: #7AA884;
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
        }
      }

      .brand-content {
        padding: 14px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;

          .brand-logo {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid #eee;
          }

          h3 { margin: 0; font-size: 0.95rem; font-weight: 800; }
          .origin { font-size: 0.7rem; color: #888; }
        }

        .tagline { font-size: 0.78rem; font-weight: 700; color: #7AA884; margin: 0 0 6px; }
        .story { font-size: 0.75rem; color: #555; line-height: 1.4; flex: 1; margin: 0 0 12px; }

        .brand-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #eee;
          padding-top: 10px;

          .tier-tag {
            font-size: 0.65rem;
            font-weight: 800;
            background: #EBE6DC;
            padding: 2px 6px;
            border-radius: 4px;
          }

          .contact-link {
            font-size: 0.75rem;
            font-weight: 700;
            color: #7AA884;
            text-decoration: none;
            &:hover { text-decoration: underline; }
          }
        }
      }
    }

    .packages-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 18px 0 24px;
    }

    .package-card {
      background: white;
      border-radius: 14px;
      padding: 20px;
      border: 1px solid #E5DFD5;
      position: relative;
      display: flex;
      flex-direction: column;

      &.featured { border-color: #7AA884; }
      &.spotlight { border-color: #FF9F1C; }

      .pop-pill {
        position: absolute;
        top: -10px;
        right: 14px;
        background: #7AA884;
        color: white;
        font-size: 0.6rem;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        &.gold { background: #FF9F1C; }
      }

      h4 { margin: 0 0 6px; font-size: 1.1rem; }
      .plan-price {
        font-size: 1.5rem;
        font-weight: 800;
        color: #2b3a32;
        margin-bottom: 12px;
        span { font-size: 0.8rem; color: #888; font-weight: normal; }
      }

      .features {
        list-style: disc;
        padding-left: 18px;
        font-size: 0.76rem;
        color: #555;
        flex: 1;
        margin-bottom: 16px;
        li { margin-bottom: 6px; }
      }

      .apply-plan-btn {
        background: #7AA884;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.78rem;
        cursor: pointer;
        &:hover { background: #679270; }
      }
    }

    .promo-application-form {
      background: white;
      border-radius: 14px;
      padding: 20px;
      border: 1px solid #E5DFD5;

      h4 { margin: 0 0 12px; font-size: 1rem; }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 10px;

        .f-input {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 0.82rem;
          outline: none;
          &:focus { border-color: #7AA884; }
        }
      }

      .f-textarea {
        width: 100%;
        box-sizing: border-box;
        height: 70px;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #ddd;
        font-size: 0.82rem;
        margin-bottom: 12px;
        outline: none;
        &:focus { border-color: #7AA884; }
      }

      .submit-app-btn {
        background: #2b3a32;
        color: white;
        border: none;
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        &:hover { background: #1c2721; }
      }

      .submission-success {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        background: #e8f5e9;
        color: #2e7d32;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;

        .icon { font-size: 20px; }
      }
    }

    @media (max-width: 820px) {
      .brands-grid, .packages-grid {
        grid-template-columns: 1fr;
      }
      .promo-application-form .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BrandPortalModalComponent implements OnInit {
  api = inject(ApiService);

  readonly isOpen = signal<boolean>(false);
  readonly activeTab = signal<'directory' | 'promote'>('directory');
  readonly brands = signal<BrandTenant[]>([]);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  appName = 'Nordic Sprout Kids';
  appEmail = 'contact@nordicsprout.dk';
  appCountry = 'Denmark';
  selectedPackage = 'FEATURED_COLLECTION';
  appStory = 'Certified organic Nordic infant apparel designed with natural dye botanical palettes.';
  submissionResponse = '';

  ngOnInit(): void {
    this.api.getBrands().subscribe(b => this.brands.set(b));
  }

  open(): void {
    this.isOpen.set(true);
    this.api.getBrands().subscribe(b => this.brands.set(b));
  }

  close(): void {
    this.isOpen.set(false);
  }

  selectPackage(pkg: string): void {
    this.selectedPackage = pkg;
    this.activeTab.set('promote');
  }

  submitPromotion(): void {
    const payload = {
      brand_name: this.appName,
      contact_email: this.appEmail,
      country: this.appCountry,
      package: this.selectedPackage,
      story: this.appStory
    };

    this.api.submitBrandPromotion(payload).subscribe(res => {
      this.submissionResponse = res.message;
    });
  }
}
