import { Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-owner-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="owner-drawer-backdrop" (click)="close.emit()">
      <div class="owner-drawer" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="owner-header">
          <div class="owner-title-box">
            <mat-icon class="crown-icon">admin_panel_settings</mat-icon>
            <div>
              <h3>Petit Maison CMS & Owner Suite</h3>
              <span class="sub">Wagtail 7.1 • Django 4.2 • Angular 22 Admin Console</span>
            </div>
          </div>
          <button class="close-btn" (click)="close.emit()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="owner-body">
          <!-- Quick Admin Direct Link -->
          <div class="wagtail-cta-card">
            <div class="cta-info">
              <span class="badge">Wagtail CMS Active</span>
              <h4>Full Brand Owner Administration</h4>
              <p>
                Add new products, manage inventory, edit copy, upload high-res nursery photos, and broadcast marketing banners.
              </p>
              <div class="creds-pill">
                Username: <code>admin</code> • Password: <code>petit2026!</code>
              </div>
            </div>
            <a
              href="http://localhost:8001/admin/"
              target="_blank"
              class="launch-admin-btn"
            >
              <mat-icon>open_in_new</mat-icon>
              Launch Wagtail Admin (Port 8001)
            </a>
          </div>

          <!-- Multi-Currency Store Engine Section -->
          <div class="section-box">
            <div class="section-head">
              <mat-icon class="sec-icon">currency_exchange</mat-icon>
              <div>
                <h4>Multi-Currency Store Engine</h4>
                <span class="sub-label">Default: INR (₹) • Switchable via Admin & Storefront</span>
              </div>
            </div>
            <p class="section-note">
              Toggle any supported currency directly. Instantly converts product prices, cart breakdown, taxes, and shipping thresholds throughout the site.
            </p>

            <div class="currency-chips-grid">
              <button
                type="button"
                class="currency-chip"
                *ngFor="let c of currency.supportedCurrencies()"
                [class.active]="currency.activeCurrency() === c.code"
                (click)="currency.setCurrency(c.code)"
                [id]="'owner-curr-' + c.code"
              >
                <span class="chip-symbol">{{ c.symbol }}</span>
                <span class="chip-code">{{ c.code }}</span>
                <span class="chip-tag" *ngIf="c.code === 'INR'">DEFAULT</span>
                <mat-icon class="check-mark" *ngIf="currency.activeCurrency() === c.code">check_circle</mat-icon>
              </button>
            </div>

            <div class="currency-meta-status">
              <div class="status-row">
                <span>Active Currency:</span>
                <strong>{{ currency.currentConfig().name }}</strong>
              </div>
              <div class="status-row">
                <span>Conversion Rate:</span>
                <code>1 USD = {{ currency.activeRate() }} {{ currency.activeCurrency() }}</code>
              </div>
              <div class="status-row">
                <span>Free Shipping Threshold:</span>
                <strong>{{ currency.formatThreshold() }}</strong>
              </div>
            </div>

            <button class="sync-backend-btn" (click)="syncBackendCurrency()" [disabled]="isSyncing">
              <mat-icon class="sync-icon" [class.spinning]="isSyncing">sync</mat-icon>
              <span>{{ isSyncing ? 'Syncing with Wagtail...' : 'Sync Active Currency from Wagtail DB' }}</span>
            </button>
          </div>

          <!-- Brand Subscription Plan & Access Levels -->
          <div class="section-box">
            <div class="section-head">
              <mat-icon class="sec-icon">verified</mat-icon>
              <div>
                <h4>Store Subscription Tier & Feature Gates</h4>
                <span class="sub-label">Controls active customization levels across store</span>
              </div>
            </div>
            <div class="subscription-selector-grid">
              <button 
                class="sub-plan-btn" 
                [class.active]="themeService.storeSubscription() === 'STARTER'"
                (click)="themeService.setSubscription('STARTER')">
                <strong>Starter Boutique</strong>
                <span>Basic themes & standard catalog</span>
              </button>
              <button 
                class="sub-plan-btn" 
                [class.active]="themeService.storeSubscription() === 'GROWTH'"
                (click)="themeService.setSubscription('GROWTH')">
                <strong>Growth Designer</strong>
                <span>+ Custom Fonts & D3 Animations</span>
              </button>
              <button 
                class="sub-plan-btn" 
                [class.active]="themeService.storeSubscription() === 'ENTERPRISE_VIP'"
                (click)="themeService.setSubscription('ENTERPRISE_VIP')">
                <strong>Enterprise VIP Maison</strong>
                <span>+ Wagtail AI, Multi-Brand & In-Store POS</span>
              </button>
            </div>
          </div>

          <!-- D3.js Background Animation Selector -->
          <div class="section-box" *ngIf="themeService.hasFeature('D3_ANIMATIONS')">
            <div class="section-head">
              <mat-icon class="sec-icon">animation</mat-icon>
              <div>
                <h4>D3.js Animated Interactive Backdrop</h4>
                <span class="sub-label">Configurable from Wagtail Admin Console</span>
              </div>
            </div>
            <div class="d3-options-grid">
              <button class="d3-btn" [class.active]="themeService.d3AnimationType() === 'silk'" (click)="themeService.setD3Animation('silk')">
                Silk Wave Ribbon
              </button>
              <button class="d3-btn" [class.active]="themeService.d3AnimationType() === 'constellation'" (click)="themeService.setD3Animation('constellation')">
                Starlit Constellation
              </button>
              <button class="d3-btn" [class.active]="themeService.d3AnimationType() === 'aurora'" (click)="themeService.setD3Animation('aurora')">
                Pastel Aurora Glow
              </button>
              <button class="d3-btn" [class.active]="themeService.d3AnimationType() === 'bubbles'" (click)="themeService.setD3Animation('bubbles')">
                Floating Soap Bubbles
              </button>
              <button class="d3-btn" [class.active]="themeService.d3AnimationType() === 'none'" (click)="themeService.setD3Animation('none')">
                None (Static)
              </button>
            </div>
          </div>

          <!-- Brand Custom Typography Selector -->
          <div class="section-box" *ngIf="themeService.hasFeature('CUSTOM_FONTS')">
            <div class="section-head">
              <mat-icon class="sec-icon">font_download</mat-icon>
              <h4>Brand Custom Typography</h4>
            </div>
            <div class="font-options-grid">
              <button 
                *ngFor="let f of themeService.availableFonts" 
                class="font-btn" 
                [class.active]="themeService.activeFont() === f.id"
                (click)="themeService.setFont(f.id)">
                {{ f.label }}
              </button>
            </div>
          </div>

          <!-- Wagtail Enterprise AI Copywriter -->
          <div class="section-box" *ngIf="themeService.hasFeature('AI_ASSISTANT')">
            <div class="section-head">
              <mat-icon class="sec-icon">auto_fix_high</mat-icon>
              <div>
                <h4>Wagtail AI Nursery Copywriter</h4>
                <span class="sub-label">Instant luxury product descriptions</span>
              </div>
            </div>
            <div class="ai-copy-form">
              <input type="text" [(ngModel)]="aiTitle" placeholder="Product Title (e.g. Organic Pima Romper)" class="ai-input" />
              <input type="text" [(ngModel)]="aiFabric" placeholder="Fabric (e.g. 100% GOTS Organic Cotton)" class="ai-input" />
              <button class="btn-gen-ai" (click)="generateCopy()" [disabled]="isGeneratingCopy()">
                {{ isGeneratingCopy() ? 'Generating with Wagtail AI...' : 'Generate AI Copy' }}
              </button>
              <div class="ai-result" *ngIf="aiGeneratedCopy()">
                <label>Generated Copy:</label>
                <p>{{ aiGeneratedCopy() }}</p>
              </div>
            </div>
          </div>

          <!-- Live Barcode Stock Quick Adjustment -->
          <div class="section-box">
            <div class="section-head">
              <mat-icon class="sec-icon">barcode_scanner</mat-icon>
              <h4>Live Barcode Stock Management</h4>
            </div>
            <div class="stock-sync-form">
              <input type="text" [(ngModel)]="quickSku" placeholder="Garment SKU (e.g. PMK-ROMP-001)" class="ai-input" />
              <div class="stock-btns-row">
                <button (click)="adjustStock(-1)">-1 Sold</button>
                <button (click)="adjustStock(+1)">+1 Return</button>
                <button (click)="adjustStock(+10)">+10 Crate Restock</button>
              </div>
              <div class="stock-alert" *ngIf="stockMsg()">{{ stockMsg() }}</div>
            </div>
          </div>

          <!-- Live Theme Palette Studio -->
          <div class="section-box">
            <div class="section-head">
              <mat-icon class="sec-icon">palette</mat-icon>
              <h4>Live Theme Palette Presets</h4>
            </div>
            <p class="section-note">Switch the entire store's color atmosphere instantaneously.</p>

            <div class="theme-grid">
              <div
                class="theme-card"
                *ngFor="let t of themes"
                [class.selected]="activeTheme() === t.id"
                (click)="setTheme(t.id)"
              >
                <div class="theme-preview-dots">
                  <span class="dot" [style.backgroundColor]="t.primary"></span>
                  <span class="dot" [style.backgroundColor]="t.accent"></span>
                  <span class="dot" [style.backgroundColor]="t.surface"></span>
                </div>
                <div class="theme-text">
                  <strong>{{ t.name }}</strong>
                  <span>{{ t.description }}</span>
                </div>
                <mat-icon class="check" *ngIf="activeTheme() === t.id">check_circle</mat-icon>
              </div>
            </div>
          </div>

          <!-- Marketing & Offers Simulation -->
          <div class="section-box">
            <div class="section-head">
              <mat-icon class="sec-icon">campaign</mat-icon>
              <h4>Marketing & Promotion Broadcast</h4>
            </div>

            <div class="quick-offers">
              <div class="offer-item">
                <div>
                  <strong>PETIT25</strong>
                  <p>25% Off Spring Carnival Promo</p>
                </div>
                <button class="btn-simulate" (click)="simulateOffer('PETIT25', 25)">
                  Simulate in Cart
                </button>
              </div>

              <div class="offer-item">
                <div>
                  <strong>FIRSTBABY15</strong>
                  <p>15% Off Newborn Welcome Special</p>
                </div>
                <button class="btn-simulate" (click)="simulateOffer('FIRSTBABY15', 15)">
                  Simulate in Cart
                </button>
              </div>

              <div class="offer-item">
                <div>
                  <strong>SIBLINGPAIR</strong>
                  <p>\$20 Off matching sibling sets</p>
                </div>
                <button class="btn-simulate" (click)="simulateOffer('SIBLINGPAIR', 0, 20)">
                  Simulate in Cart
                </button>
              </div>
            </div>
          </div>

          <!-- Store Deployment Architecture -->
          <div class="section-box">
            <div class="section-head">
              <mat-icon class="sec-icon">cloud_done</mat-icon>
              <h4>Cloud Deployment Readiness</h4>
            </div>
            <div class="deploy-specs">
              <div class="spec-chip">
                <mat-icon class="mini">cloud_queue</mat-icon>
                <span>Google App Engine: <code>deploy/app.yaml</code></span>
              </div>
              <div class="spec-chip">
                <mat-icon class="mini">dns</mat-icon>
                <span>AWS Elastic Beanstalk: <code>deploy/Dockerrun.aws.json</code></span>
              </div>
              <div class="spec-chip">
                <mat-icon class="mini">layers</mat-icon>
                <span>Docker Multi-Service: <code>docker-compose.yml</code> (8001 / 4201)</span>
              </div>
              <div class="spec-chip">
                <mat-icon class="mini">install_mobile</mat-icon>
                <span>PWA Enabled: WebManifest + ServiceWorker configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .owner-drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 58, 75, 0.65);
      backdrop-filter: blur(6px);
      z-index: 10020;
      display: flex;
      justify-content: flex-end;
    }

    .owner-drawer {
      background: #FFFFFF;
      width: 100%;
      max-width: 540px;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: -15px 0 50px rgba(0,0,0,0.25);
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .owner-header {
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid #ECECEC;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2D3A4B;
      color: #FFFFFF;

      .owner-title-box {
        display: flex;
        align-items: center;
        gap: 12px;

        .crown-icon {
          color: var(--pm-accent, #E0A96D);
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        h3 {
          font-family: var(--pm-font-serif, 'Playfair Display', serif);
          font-size: 1.15rem;
          margin: 0;
        }

        .sub {
          font-size: 0.6875rem;
          opacity: 0.8;
          display: block;
        }
      }

      .close-btn {
        background: rgba(255, 255, 255, 0.15);
        border: none;
        color: #FFFFFF;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .owner-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .wagtail-cta-card {
      background: linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%);
      border: 1px solid #CBD5E1;
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .badge {
        background: #2D3A4B;
        color: #FFFFFF;
        font-size: 0.6875rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 6px;
        display: inline-block;
        width: fit-content;
      }

      h4 {
        font-family: var(--pm-font-serif, 'Playfair Display', serif);
        font-size: 1.25rem;
        color: #1E293B;
        margin: 0;
      }

      p {
        font-size: 0.8125rem;
        color: #475569;
        margin: 0;
        line-height: 1.45;
      }

      .creds-pill {
        background: rgba(255, 255, 255, 0.8);
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 0.75rem;
        color: #334155;

        code {
          background: #E2E8F0;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }
      }

      .launch-admin-btn {
        background: var(--pm-primary, #4A5859);
        color: #FFFFFF;
        text-decoration: none;
        padding: 10px 18px;
        border-radius: 10px;
        font-size: 0.875rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(74, 88, 89, 0.25);
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-2px);
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    .section-box {
      border: 1px solid #ECECEC;
      border-radius: 16px;
      padding: 1.25rem;
      background: #FAFAFA;

      .section-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .sec-icon {
          color: var(--pm-primary, #4A5859);
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        h4 {
          font-size: 0.9375rem;
          color: #2D3A4B;
          margin: 0;
          font-weight: 700;
        }
      }

      .section-note {
        font-size: 0.75rem;
        color: #71717A;
        margin: 0 0 1rem 0;
      }

      .sub-label {
        font-size: 0.6875rem;
        color: #64748B;
        display: block;
      }
    }

    .currency-chips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 12px;

      .currency-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #FFFFFF;
        border: 1.5px solid #E2E8F0;
        border-radius: 10px;
        padding: 8px 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;

        &:hover {
          border-color: #94A3B8;
        }

        &.active {
          border-color: var(--pm-primary, #3D5A80);
          background: rgba(61, 90, 128, 0.08);
        }

        .chip-symbol {
          font-weight: 800;
          font-size: 1rem;
          color: var(--pm-primary, #3D5A80);
          min-width: 20px;
        }

        .chip-code {
          font-weight: 700;
          font-size: 0.8125rem;
          color: #1E293B;
        }

        .chip-tag {
          font-size: 0.5625rem;
          font-weight: 800;
          background: #E0E7FF;
          color: #3730A3;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .check-mark {
          margin-left: auto;
          color: #10B981;
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .currency-meta-status {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.75rem;
      margin-bottom: 10px;

      .status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span { color: #64748B; }
        strong { color: #1E293B; font-weight: 700; }
        code {
          background: #F1F5F9;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }
    }

    .sync-backend-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #F8FAFC;
        border-color: #94A3B8;
      }

      .sync-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        &.spinning {
          animation: spin 1s linear infinite;
        }
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .theme-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .theme-card {
      background: #FFFFFF;
      border: 1.5px solid #E4E4E7;
      border-radius: 12px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--pm-primary, #4A5859);
      }

      &.selected {
        border-color: var(--pm-primary, #4A5859);
        background: #F0F4F8;
      }

      .theme-preview-dots {
        display: flex;
        gap: 4px;

        .dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }
      }

      .theme-text {
        flex: 1;
        display: flex;
        flex-direction: column;

        strong {
          font-size: 0.8125rem;
          color: #2D3A4B;
        }

        span {
          font-size: 0.6875rem;
          color: #71717A;
        }
      }

      .check {
        color: var(--pm-primary, #4A5859);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .quick-offers {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .offer-item {
        background: #FFFFFF;
        border: 1px solid #E4E4E7;
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        strong {
          font-family: monospace;
          color: #2D3A4B;
          font-size: 0.8125rem;
        }

        p {
          font-size: 0.6875rem;
          color: #71717A;
          margin: 0;
        }

        .btn-simulate {
          background: #F4F4F5;
          border: 1px solid #D4D4D8;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.6875rem;
          font-weight: 700;
          cursor: pointer;

          &:hover {
            background: #E4E4E7;
          }
        }
      }
    }

    .subscription-selector-grid,
    .d3-options-grid,
    .font-options-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 10px;

      button {
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid #D4D4D8;
        background: #F4F4F5;
        font-size: 0.75rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        transition: all 0.2s ease;

        strong { font-weight: 700; color: #2D3A4B; }
        span { font-size: 0.65rem; color: #71717A; margin-top: 2px; }

        &.active {
          background: #7AA884;
          border-color: #7AA884;
          color: white;
          strong, span { color: white; }
        }
      }
    }

    .d3-options-grid,
    .font-options-grid {
      grid-template-columns: repeat(2, 1fr);
      button {
        align-items: center;
        text-align: center;
        font-weight: 700;
      }
    }

    .ai-copy-form,
    .stock-sync-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;

      .ai-input {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #D4D4D8;
        font-size: 0.8rem;
        outline: none;
        &:focus { border-color: #7AA884; }
      }

      .btn-gen-ai {
        background: #7AA884;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        &:disabled { background: #ccc; cursor: not-allowed; }
      }

      .ai-result {
        background: #F4F1EA;
        padding: 10px;
        border-radius: 6px;
        border-left: 3px solid #7AA884;
        font-size: 0.75rem;
        line-height: 1.4;
        label { font-weight: 700; display: block; margin-bottom: 4px; color: #7AA884; }
        p { margin: 0; }
      }

      .stock-btns-row {
        display: flex;
        gap: 6px;
        button {
          flex: 1;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #D4D4D8;
          background: #F4F4F5;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          &:hover { background: #E4E4E7; }
        }
      }

      .stock-alert {
        font-size: 0.75rem;
        color: #2E7D32;
        font-weight: 700;
      }
    }

    .deploy-specs {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .spec-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: #334155;

        .mini {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: #588157;
        }

        code {
          background: #E2E8F0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.6875rem;
        }
      }
    }
  `]
})
export class OwnerPanelComponent {
  themeService = inject(ThemeService);
  cart = inject(CartService);
  currency = inject(CurrencyService);
  api = inject(ApiService);

  close = output<void>();

  isSyncing = false;
  themes = this.themeService.availableThemes;
  activeTheme = this.themeService.currentTheme;

  syncBackendCurrency(): void {
    this.isSyncing = true;
    this.api.getStoreConfig().subscribe({
      next: (cfg: any) => {
        this.isSyncing = false;
        if (cfg?.brand?.active_currency) {
          this.currency.setCurrency(cfg.brand.active_currency);
          alert(`Successfully synced with Wagtail! Active Currency set to: ${cfg.brand.active_currency}`);
        }
      },
      error: () => {
        this.isSyncing = false;
        alert('Could not connect to Wagtail API.');
      }
    });
  }

  setTheme(id: string): void {
    this.themeService.setTheme(id);
  }

  aiTitle = 'Organic Cloud Romper';
  aiFabric = '100% GOTS Certified Peruvian Organic Pima Cotton';
  aiGeneratedCopy = signal<string>('');
  isGeneratingCopy = signal<boolean>(false);

  quickSku = 'PMK-ROMP-001';
  stockMsg = signal<string>('');

  generateCopy(): void {
    if (!this.aiTitle) return;
    this.isGeneratingCopy.set(true);
    this.api.generateAiCopy(this.aiTitle, this.aiFabric).subscribe(res => {
      this.isGeneratingCopy.set(false);
      this.aiGeneratedCopy.set(res.generated_copy);
    });
  }

  adjustStock(amount: number): void {
    if (!this.quickSku) return;
    this.api.updateStock(this.quickSku, amount).subscribe(res => {
      if (res.success) {
        this.stockMsg.set(res.message);
      }
    });
  }

  simulateOffer(code: string, percent: number, amount: number = 0): void {
    this.cart.setCoupon(code, percent, amount);
    this.cart.openDrawer();
    this.close.emit();
  }
}
