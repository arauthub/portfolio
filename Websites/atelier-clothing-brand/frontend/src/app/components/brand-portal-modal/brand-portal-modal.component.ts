import { Component, output, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BrandTenant } from '../../models/product.model';

@Component({
  selector: 'app-brand-portal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="portal-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        
        <div class="card-top">
          <div class="portal-badge">
            <span class="material-symbols-outlined icon">hub</span>
            <span>CENTRALISED FASHION BRAND FACTORY</span>
          </div>
          <button class="close-x" (click)="close.emit()">✕</button>
        </div>

        <div class="portal-head">
          <h2>Host Any Clothing Brand & Paid Promotional Tiers</h2>
          <p>
            An enterprise mall where independent ateliers and global fashion houses live under the same roof.
            Opt for paid promotional spotlight tiers to showcase your collections front and center.
          </p>
        </div>

        <!-- Hosted Brands Directory -->
        <div class="brands-list-section">
          <h4>Active Hosted Brands in Platform Directory</h4>
          <div class="brands-grid">
            @for (brand of hostedBrands(); track brand.slug) {
              <div class="brand-item" [class.promoted]="brand.is_promoted">
                @if (brand.is_promoted) {
                  <span class="promoted-ribbon">{{ brand.promoted_badge || 'SPONSORED' }}</span>
                }
                <div class="brand-top-row">
                  <img [src]="brand.logo_url" alt="{{ brand.name }}" class="brand-logo" (error)="onImgError($event)" />
                  <div>
                    <h5>{{ brand.name }}</h5>
                    <span class="origin">{{ brand.origin_country }} • Est. {{ brand.founding_year }}</span>
                  </div>
                </div>
                <p class="tagline">{{ brand.tagline }}</p>
                <div class="tier-badge-pill">Plan: {{ brand.subscription_tier }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Paid Brand Promotion Submission Suite -->
        <div class="promotion-suite-box">
          <div class="suite-header">
            <h4>Opt for Paid Services & Promote Your Brand</h4>
            <span class="sub">Instant spotlight placement in the luxury hero carousel and multi-brand directory.</span>
          </div>

          <div class="promo-tiers-row">
            <div 
              class="promo-card" 
              [class.active]="selectedTier() === 'HERO_SPOTLIGHT'"
              (click)="selectedTier.set('HERO_SPOTLIGHT')">
              <span class="ribbon">MOST POPULAR</span>
              <h5>Hero Spotlight Package</h5>
              <div class="price">$299 <span>/ month</span></div>
              <ul>
                <li>Featured on Homepage Editorial Hero</li>
                <li>Global Push Notification Alert</li>
                <li>Wagtail AI Copywriter Included</li>
              </ul>
            </div>

            <div 
              class="promo-card" 
              [class.active]="selectedTier() === 'FEATURED_COLLECTION'"
              (click)="selectedTier.set('FEATURED_COLLECTION')">
              <h5>Featured Collection</h5>
              <div class="price">$199 <span>/ month</span></div>
              <ul>
                <li>Pinned Top in Catalog Filters</li>
                <li>Sponsored Brand Ribbon Tag</li>
                <li>In-Store POS Register Support</li>
              </ul>
            </div>

            <div 
              class="promo-card" 
              [class.active]="selectedTier() === 'STANDARD'"
              (click)="selectedTier.set('STANDARD')">
              <h5>Designer Starter</h5>
              <div class="price">$99 <span>/ month</span></div>
              <ul>
                <li>Standard Directory Placement</li>
                <li>Live Stock Sync & Barcodes</li>
                <li>Multi-Currency Checkout</li>
              </ul>
            </div>
          </div>

          <!-- Application Form -->
          <div class="promo-form">
            <div class="form-row">
              <input type="text" [(ngModel)]="brandName" placeholder="Your Fashion Brand / Maison Name" class="input-field" />
              <input type="email" [(ngModel)]="contactEmail" placeholder="Designer Contact Email" class="input-field" />
            </div>

            <button class="submit-promo-btn" (click)="submitBrandPromotion()">
              Activate Paid Sponsorship & Launch Brand
            </button>
            
            @if (successMessage()) {
              <div class="success-alert">{{ successMessage() }}</div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 6, 8, 0.85);
      backdrop-filter: blur(12px);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .portal-card {
      background: #121419;
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.16));
      border-radius: 24px;
      max-width: 980px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 28px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .portal-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(234, 216, 192, 0.25);
    }

    .portal-badge .icon {
      font-size: 14px;
    }

    .close-x {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 20px;
      cursor: pointer;
    }

    .portal-head {
      margin-bottom: 24px;
    }

    .portal-head h2 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 26px;
      margin: 0 0 6px;
      color: #FFF;
    }

    .portal-head p {
      font-size: 13px;
      color: #94A3B8;
      margin: 0;
      line-height: 1.5;
    }

    .brands-list-section h4 {
      font-size: 13px;
      color: #CBD5E1;
      margin: 0 0 12px;
      letter-spacing: 0.5px;
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }

    .brand-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 14px;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .brand-item.promoted {
      border-color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.03);
    }

    .promoted-ribbon {
      position: absolute;
      top: -8px;
      right: 12px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1px;
      background: #10B981;
      color: #0A0B0E;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .brand-top-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand-top-row h5 {
      margin: 0;
      font-size: 13px;
      color: #FFF;
    }

    .origin {
      font-size: 10px;
      color: #94A3B8;
    }

    .tagline {
      font-size: 11px;
      color: #CBD5E1;
      margin: 0 0 10px;
      line-height: 1.4;
      flex: 1;
    }

    .tier-badge-pill {
      font-size: 9px;
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      width: fit-content;
    }

    /* Promotion Suite */
    .promotion-suite-box {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
    }

    .suite-header h4 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 18px;
      color: #FFF;
      margin: 0 0 4px;
    }

    .suite-header .sub {
      font-size: 12px;
      color: #94A3B8;
    }

    .promo-tiers-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 18px 0;
    }

    .promo-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }

    .promo-card:hover {
      border-color: rgba(234, 216, 192, 0.3);
    }

    .promo-card.active {
      border-color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.05);
    }

    .promo-card .ribbon {
      position: absolute;
      top: -8px;
      right: 12px;
      background: var(--accent-gold, #EAD8C0);
      color: #0A0B0E;
      font-size: 8px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .promo-card h5 {
      margin: 0 0 6px;
      font-size: 14px;
      color: #FFF;
    }

    .promo-card .price {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent-gold, #EAD8C0);
      margin-bottom: 10px;
    }

    .promo-card .price span {
      font-size: 11px;
      color: #94A3B8;
    }

    .promo-card ul {
      margin: 0;
      padding-left: 16px;
      font-size: 11px;
      color: #CBD5E1;
      line-height: 1.5;
    }

    .promo-form {
      margin-top: 14px;
    }

    .form-row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .input-field {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 10px 14px;
      color: #FFF;
      font-size: 13px;
    }

    .input-field:focus {
      outline: none;
      border-color: var(--accent-gold, #EAD8C0);
    }

    .submit-promo-btn {
      width: 100%;
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .success-alert {
      margin-top: 10px;
      padding: 8px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10B981;
      color: #10B981;
      border-radius: 8px;
      font-size: 12px;
      text-align: center;
      font-weight: 600;
    }

    @media (max-width: 700px) {
      .promo-tiers-row {
        grid-template-columns: 1fr;
      }
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class BrandPortalModalComponent implements OnInit {
  api = inject(ApiService);
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  hostedBrands = signal<BrandTenant[]>([]);
  selectedTier = signal<string>('HERO_SPOTLIGHT');
  brandName = '';
  contactEmail = '';
  successMessage = signal<string>('');

  ngOnInit(): void {
    this.api.getHostedBrands().subscribe(list => {
      this.hostedBrands.set(list);
    });
  }

  submitBrandPromotion(): void {
    if (!this.brandName || !this.contactEmail) {
      alert('Please enter your brand name and designer contact email.');
      return;
    }

    this.api.requestBrandPromotion({
      brand_name: this.brandName,
      contact_email: this.contactEmail,
      promotion_tier: this.selectedTier()
    }).subscribe(res => {
      this.successMessage.set(res.message);
      this.api.getHostedBrands().subscribe(list => this.hostedBrands.set(list));
    });
  }

  onImgError(e: any): void {
    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
  }
}
