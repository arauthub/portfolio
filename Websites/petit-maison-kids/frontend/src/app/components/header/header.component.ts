import { Component, inject, signal, OnInit, OnDestroy, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ThemeService } from '../../services/theme.service';
import { ApiService, KidsTicker } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';
import { SeoMetaService } from '../../services/seo-meta.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <!-- Top Announcement Bar / Ticker -->
    <aside class="announcement-bar" role="region" aria-label="Announcement">
      <div class="announcement-content" *ngIf="currentTicker">
        <span class="ticker-badge">SPECIAL PRIVILEGE</span>
        <span class="ticker-text">{{ currentTicker.message }}</span>
        <button class="ticker-code-btn" (click)="copyCoupon(currentTicker.highlight_text)" matTooltip="Click to copy coupon code">
          <span>{{ currentTicker.highlight_text }}</span>
          <mat-icon class="copy-icon">content_copy</mat-icon>
        </button>
      </div>
      <div class="announcement-actions">
        <span class="locale-tag">
          <mat-icon class="mini-icon">eco</mat-icon> GOTS Certified Organic Cotton
        </span>
      </div>
    </aside>

    <!-- Main Navigation Header (Clean 3-Zone Architecture) -->
    <header class="main-header" [class.scrolled]="isScrolled">
      <div class="header-inner container-12">
        <!-- Mobile Menu Trigger -->
        <button mat-icon-button class="mobile-toggle" (click)="mobileNavOpen = !mobileNavOpen" aria-label="Toggle navigation">
          <mat-icon>{{ mobileNavOpen ? 'close' : 'menu' }}</mat-icon>
        </button>

        <!-- Brand Identity -->
        <div class="brand-identity" (click)="scrollTo('hero')">
          <div class="brand-crest">
            <mat-icon class="brand-icon">auto_awesome</mat-icon>
          </div>
          <div class="brand-names">
            <h1 class="brand-title">NANHI MAISON</h1>
            <p class="brand-subtitle">PURE ORGANIC MULMUL & FESTIVE HEIRLOOMS (0 - 12Y)</p>
          </div>
        </div>

        <!-- Navigation Links: Structured Mega Menu & Dropdowns -->
        <nav class="desktop-nav">
          <!-- 1. BY AGE & STAGE (Mega Menu) -->
          <div class="nav-dropdown-wrapper" (mouseenter)="openMega('age')" (mouseleave)="scheduleCloseMega()">
            <button class="nav-trigger-btn" [class.active]="activeMega() === 'age'" (click)="toggleMega('age')" aria-expanded="activeMega() === 'age'">
              <span>BY AGE & STAGE</span>
              <mat-icon class="nav-arrow">arrow_drop_down</mat-icon>
            </button>
            <div *ngIf="activeMega() === 'age'" class="megamenu-panel age-megamenu animate-dropdown-fade" (mouseenter)="openMega('age')" (mouseleave)="scheduleCloseMega()">
              <div class="megamenu-inner">
                <!-- Col 1: Shishu Baby (0-24M) -->
                <div class="megamenu-col">
                  <span class="col-title">SHISHU BABY (0 - 24M)</span>
                  <a class="megamenu-item" (click)="filterCategory('shishu-newborn')">
                    <span class="item-title">Pure Mulmul Jhablas</span>
                    <span class="item-desc">Featherlight first newborn wraps</span>
                  </a>
                  <a class="megamenu-item" (click)="filterCategory('shishu-newborn')">
                    <span class="item-title">Heirloom Swaddle Quilts</span>
                    <span class="item-desc">Hand-quilted organic dohar quilts</span>
                  </a>
                  <a class="megamenu-item" (click)="filterCategory('shishu-newborn')">
                    <span class="item-title">First Festive Kurtas</span>
                    <span class="item-desc">Zero-tag pure cotton festive sets</span>
                  </a>
                </div>

                <!-- Col 2: Chhota Nawab (2-5Y) -->
                <div class="megamenu-col">
                  <span class="col-title">CHHOTA NAWAB (2 - 5Y)</span>
                  <a class="megamenu-item" (click)="filterCategory('chhota-nawab')">
                    <span class="item-title">Miniature Silk Sherwanis</span>
                    <span class="item-desc">Royal heritage festive wear</span>
                  </a>
                  <a class="megamenu-item" (click)="filterCategory('chhota-nawab')">
                    <span class="item-title">Handblock Angrakhas</span>
                    <span class="item-desc">Natural vegetable dye prints</span>
                  </a>
                  <a class="megamenu-item" (click)="filterCategory('chhota-nawab')">
                    <span class="item-title">Pure Linen Bundis</span>
                    <span class="item-desc">Breathable festive waistcoats</span>
                  </a>
                </div>

                <!-- Col 3: Nanhi Pari (6-12Y) -->
                <div class="megamenu-col">
                  <span class="col-title">NANHI PARI (6 - 12Y)</span>
                  <a class="megamenu-item" (click)="filterCategory('nanhi-pari-lehengas')">
                    <span class="item-title">Zardozi Brocade Lehengas</span>
                    <span class="item-desc">Twirl-ready lightweight silk skirts</span>
                  </a>
                  <a class="megamenu-item" (click)="filterCategory('nanhi-pari-lehengas')">
                    <span class="item-title">Chanderi Anarkali Suits</span>
                    <span class="item-desc">Pastel heirloom party ensembles</span>
                  </a>
                  <a class="megamenu-item" (click)="filterCategory('nanhi-pari-lehengas')">
                    <span class="item-title">Handwoven Dupattas</span>
                    <span class="item-desc">Pure zari borders & gota patti</span>
                  </a>
                </div>

                <!-- Col 4: Spotlight Editorial Card -->
                <div class="megamenu-spotlight">
                  <div class="spotlight-card">
                    <div class="spotlight-tag">GOTS CERTIFIED</div>
                    <h4 class="spotlight-title">Pure Mulmul Edit</h4>
                    <p class="spotlight-desc">Non-toxic vegetable dyes, hypoallergenic fibers, and cloud-soft handloom.</p>
                    <button class="spotlight-btn" (click)="filterCategory('organic-mulmul')">
                      <span>Shop Mulmul Edit</span>
                      <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. COLLECTIONS (Dropdown) -->
          <div class="nav-dropdown-wrapper" (mouseenter)="openMega('collections')" (mouseleave)="scheduleCloseMega()">
            <button class="nav-trigger-btn" [class.active]="activeMega() === 'collections'" (click)="toggleMega('collections')" aria-expanded="activeMega() === 'collections'">
              <span>COLLECTIONS</span>
              <mat-icon class="nav-arrow">arrow_drop_down</mat-icon>
            </button>
            <div *ngIf="activeMega() === 'collections'" class="dropdown-panel collections-panel animate-dropdown-fade" (mouseenter)="openMega('collections')" (mouseleave)="scheduleCloseMega()">
              <a class="dropdown-item" (click)="filterCategory('sibling-festive-jodi')">
                <mat-icon class="drop-icon">people</mat-icon>
                <div class="drop-text">
                  <span class="drop-title">Sibling Festive Jodi</span>
                  <span class="drop-sub">Coordinated brother-sister celebration sets</span>
                </div>
                <span class="badge-accent">DIWALI</span>
              </a>
              <a class="dropdown-item" (click)="filterCategory('organic-mulmul')">
                <mat-icon class="drop-icon">eco</mat-icon>
                <div class="drop-text">
                  <span class="drop-title">Pure Organic Mulmul</span>
                  <span class="drop-sub">Gentle daily heirloom cottons</span>
                </div>
              </a>
              <a class="dropdown-item" (click)="filterCategory('all')">
                <mat-icon class="drop-icon">workspace_premium</mat-icon>
                <div class="drop-text">
                  <span class="drop-title">Heirloom Monograms & Gifts</span>
                  <span class="drop-sub">Personalized trunks & golden threads</span>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-footer" (click)="filterCategory('all')">
                <span>View Complete Kids Archive</span>
                <mat-icon>arrow_forward</mat-icon>
              </a>
            </div>
          </div>

          <!-- 3. PARTNER MAISONS (Dropdown) -->
          <div class="nav-dropdown-wrapper" (mouseenter)="openMega('maisons')" (mouseleave)="scheduleCloseMega()">
            <button class="nav-trigger-btn" [class.active]="activeMega() === 'maisons'" (click)="toggleMega('maisons')" aria-expanded="activeMega() === 'maisons'">
              <span>PARTNER MAISONS</span>
              <mat-icon class="nav-arrow">arrow_drop_down</mat-icon>
            </button>
            <div *ngIf="activeMega() === 'maisons'" class="dropdown-panel maisons-panel animate-dropdown-fade" (mouseenter)="openMega('maisons')" (mouseleave)="scheduleCloseMega()">
              <div class="dropdown-section-label">CURATED ARTISAN HOUSES</div>
              <a class="dropdown-item" (click)="filterCategory('all')">
                <mat-icon class="drop-icon">child_care</mat-icon>
                <div class="drop-text">
                  <span class="drop-title">Nanhi Karigar Guild</span>
                  <span class="drop-sub">Weavers of Chanderi & Maheshwar</span>
                </div>
              </a>
              <a class="dropdown-item" (click)="filterCategory('chhota-nawab')">
                <mat-icon class="drop-icon">military_tech</mat-icon>
                <div class="drop-text">
                  <span class="drop-title">Shahi Awadh Zari Studio</span>
                  <span class="drop-sub">Miniature royal court embroidery</span>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item partner-promo-item" (click)="closeMega(); openBrands.emit()">
                <mat-icon class="drop-icon highlight">storefront</mat-icon>
                <div class="drop-text">
                  <span class="drop-title highlight">Multi-Brand Directory</span>
                  <span class="drop-sub">Explore all hosted kids houses & promotions</span>
                </div>
                <span class="badge-pill">DIRECTORY</span>
              </a>
            </div>
          </div>

          <!-- 4. FESTIVE LOOKBOOK (Direct Link) -->
          <a class="nav-link lookbook-link" (click)="scrollTo('lookbook')">
            <mat-icon class="spark">auto_awesome</mat-icon>
            <span>Festive Lookbook</span>
          </a>
        </nav>

        <!-- Right Utility Actions: De-cluttered into 5 Clean Touchpoints -->
        <div class="header-actions">
          <!-- Client Concierge & Enterprise Suite Dropdown -->
          <button class="concierge-pill-btn" [matMenuTriggerFor]="conciergeMenu" matTooltip="Nanhi Concierge & Enterprise Services" aria-label="Nanhi Concierge">
            <mat-icon class="concierge-icon">room_service</mat-icon>
            <span class="concierge-label">CONCIERGE</span>
            <mat-icon class="drop-arrow">arrow_drop_down</mat-icon>
          </button>
          <mat-menu #conciergeMenu="matMenu" class="kids-luxury-menu">
            <div class="menu-header">NANHI MAISON CONCIERGE</div>
            <button mat-menu-item (click)="openGuide.emit()">
              <mat-icon class="menu-icon">explore</mat-icon>
              <span>First-Time Shopper Guide & Sizing</span>
            </button>
            <button mat-menu-item (click)="openBarcode.emit()">
              <mat-icon class="menu-icon">qr_code_scanner</mat-icon>
              <span>Garment Barcode Scanner & Live Stock</span>
            </button>
            <button mat-menu-item (click)="openBrands.emit()">
              <mat-icon class="menu-icon">store</mat-icon>
              <span>Hosted Brand Directory & Showcase</span>
            </button>
            <button mat-menu-item (click)="triggerShare()" id="concierge-share-btn">
              <mat-icon class="menu-icon">share</mat-icon>
              <span>Social Share & Rich Meta Cards</span>
            </button>
            <button mat-menu-item (click)="reopenGate()" id="concierge-gate-btn">
              <mat-icon class="menu-icon">lock_open</mat-icon>
              <span>VIP Privé Invitation Gate Preview</span>
            </button>
            <div class="menu-divider"></div>
            <button mat-menu-item (click)="toggleOwnerPanel.emit()">
              <span class="status-dot"></span>
              <span class="owner-menu-label">Owner Suite & Wagtail Admin</span>
              <mat-icon class="menu-icon right-icon">settings</mat-icon>
            </button>
          </mat-menu>

          <!-- Multi-Currency Selector (Default: INR ₹) -->
          <button class="currency-pill-btn" [matMenuTriggerFor]="currencyMenu" id="currency-header-pill" matTooltip="Select Store Currency" aria-label="Select Currency">
            <span class="curr-flag-symbol">{{ currency.activeSymbol() }}</span>
            <span class="curr-code-text">{{ currency.activeCurrency() }}</span>
            <mat-icon class="drop-arrow">arrow_drop_down</mat-icon>
          </button>
          <mat-menu #currencyMenu="matMenu" class="kids-luxury-menu">
            <div class="menu-header">SELECT CURRENCY</div>
            <button mat-menu-item *ngFor="let c of currency.supportedCurrencies()" (click)="setCurrency(c.code)" [id]="'curr-select-' + c.code">
              <span class="curr-symbol-badge">{{ c.symbol }}</span>
              <span class="curr-name">{{ c.name }}</span>
              <mat-icon *ngIf="currency.activeCurrency() === c.code" class="check-icon">check</mat-icon>
            </button>
          </mat-menu>

          <!-- Theme Preset Switcher -->
          <button mat-icon-button [matMenuTriggerFor]="themeMenu" class="action-btn" matTooltip="Switch Heirloom Palette" aria-label="Change theme">
            <mat-icon>palette</mat-icon>
          </button>
          <mat-menu #themeMenu="matMenu" class="kids-luxury-menu">
            <div class="menu-header">SELECT HEIRLOOM PALETTE</div>
            <button mat-menu-item *ngFor="let t of themes" (click)="setTheme(t.id)">
              <span class="theme-dot" [style.backgroundColor]="t.primary"></span>
              <span>{{ t.name }}</span>
              <mat-icon *ngIf="activeTheme() === t.id" class="check-icon">check</mat-icon>
            </button>
          </mat-menu>

          <!-- Wishlist Indicator -->
          <button mat-icon-button class="action-btn" (click)="openWishlist.emit()" [matBadge]="wishlistCount()" [matBadgeHidden]="wishlistCount() === 0" matBadgeColor="accent" matTooltip="Wishlist" aria-label="Wishlist items">
            <mat-icon>favorite_border</mat-icon>
          </button>

          <!-- Shopping Bag Button -->
          <button class="bag-pill-btn gold-shimmer-btn" id="bag-header-pill" (click)="cart.openDrawer()" aria-label="Open Shopping Bag">
            <div class="bag-icon-wrapper" [matBadge]="cart.itemCount()" [matBadgeHidden]="cart.itemCount() === 0" matBadgeColor="primary">
              <mat-icon>shopping_bag</mat-icon>
            </div>
            <span class="bag-total-label" *ngIf="cart.itemCount() > 0">
              {{ cart.formattedSubtotal() }}
            </span>
            <span class="bag-text-empty" *ngIf="cart.itemCount() === 0">Bag</span>
          </button>
        </div>
      </div>

      <!-- Mobile Drawer Menu (Organized Accordion) -->
      <div *ngIf="mobileNavOpen" class="mobile-drawer animate-fade-in">
        <nav class="mobile-nav-list">
          <!-- Accordion 1: By Age & Stage -->
          <div class="mobile-acc-group">
            <button class="mobile-acc-header" (click)="toggleMobileSection('age')">
              <span>👶 BY AGE & STAGE</span>
              <mat-icon class="acc-chevron" [class.rotated]="mobileSections()['age']">expand_more</mat-icon>
            </button>
            <div *ngIf="mobileSections()['age']" class="mobile-acc-body">
              <a (click)="filterCategory('shishu-newborn')">Shishu Newborn (0 - 24M)</a>
              <a (click)="filterCategory('chhota-nawab')">Chhota Nawab (2 - 5Y)</a>
              <a (click)="filterCategory('nanhi-pari-lehengas')">Nanhi Pari (6 - 12Y)</a>
              <a (click)="filterCategory('organic-mulmul')">Pure Organic Mulmul</a>
            </div>
          </div>

          <!-- Accordion 2: Collections -->
          <div class="mobile-acc-group">
            <button class="mobile-acc-header" (click)="toggleMobileSection('collections')">
              <span>✨ HEIRLOOM COLLECTIONS</span>
              <mat-icon class="acc-chevron" [class.rotated]="mobileSections()['collections']">expand_more</mat-icon>
            </button>
            <div *ngIf="mobileSections()['collections']" class="mobile-acc-body">
              <a (click)="filterCategory('sibling-festive-jodi')">Sibling Festive Jodi (Diwali)</a>
              <a (click)="filterCategory('organic-mulmul')">Cloud-Soft Mulmul Jhablas</a>
              <a (click)="filterCategory('all')">All 25+ Kids Heirlooms</a>
            </div>
          </div>

          <!-- Accordion 3: Partner Maisons -->
          <div class="mobile-acc-group">
            <button class="mobile-acc-header" (click)="toggleMobileSection('maisons')">
              <span>🏛️ PARTNER MAISONS</span>
              <mat-icon class="acc-chevron" [class.rotated]="mobileSections()['maisons']">expand_more</mat-icon>
            </button>
            <div *ngIf="mobileSections()['maisons']" class="mobile-acc-body">
              <a (click)="filterCategory('all')">Nanhi Karigar Guild</a>
              <a (click)="mobileNavOpen = false; openBrands.emit()">🌟 Multi-Brand Directory</a>
            </div>
          </div>

          <!-- Direct Lookbook Link -->
          <a class="mobile-direct-link" (click)="scrollTo('lookbook'); mobileNavOpen = false">
            <mat-icon>auto_awesome</mat-icon>
            <span>Festive Lookbook A/W 2026</span>
          </a>

          <!-- Accordion 4: Concierge & Services -->
          <div class="mobile-acc-group">
            <button class="mobile-acc-header" (click)="toggleMobileSection('concierge')">
              <span>🛎️ CONCIERGE & SUITE</span>
              <mat-icon class="acc-chevron" [class.rotated]="mobileSections()['concierge']">expand_more</mat-icon>
            </button>
            <div *ngIf="mobileSections()['concierge']" class="mobile-acc-body">
              <button class="mobile-action-link" (click)="openGuide.emit(); mobileNavOpen = false">
                <mat-icon>explore</mat-icon>
                First-Time Shopper Guide
              </button>
              <button class="mobile-action-link" (click)="openBarcode.emit(); mobileNavOpen = false">
                <mat-icon>qr_code_scanner</mat-icon>
                Scan Garment Barcodes
              </button>
              <button class="mobile-action-link" (click)="toggleOwnerPanel.emit(); mobileNavOpen = false">
                <mat-icon>settings</mat-icon>
                Owner Suite & Wagtail Admin
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .announcement-bar {
      background: #2D3A4B;
      color: #FFFFFF;
      padding: 6px 1.5rem;
      font-size: 0.8125rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
      z-index: 1001;
      position: relative;
    }

    .announcement-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .ticker-badge {
      background: var(--pm-accent, #E0A96D);
      color: #1A1A1A;
      font-weight: 700;
      font-size: 0.6875rem;
      padding: 2px 8px;
      border-radius: 999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .ticker-text {
      font-weight: 400;
      opacity: 0.95;
    }

    .ticker-code-btn {
      background: rgba(255,255,255,0.15);
      border: 1px dashed rgba(255,255,255,0.4);
      color: #FFFFFF;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      font-weight: 700;
      font-family: monospace;
      font-size: 0.8125rem;
      transition: all 0.2s ease;

      &:hover {
        background: #FFFFFF;
        color: #1A1A1A;
      }

      .copy-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }
    }

    .announcement-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .locale-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      opacity: 0.85;
      font-size: 0.75rem;

      .mini-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        color: #A3B18A;
      }
    }

    .main-header {
      background: var(--pm-surface, #FFFFFF);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.25s ease;

      &.scrolled {
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      }
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      padding: 0 1.5rem;
      position: relative;
    }

    .brand-identity {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }

    .brand-crest {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--pm-surface-variant, #F5F1ED);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pm-primary, #4A5859);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      .brand-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .brand-identity:hover .brand-crest {
      transform: rotate(-10deg) scale(1.08);
    }

    .brand-names {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: var(--pm-font-serif, 'Playfair Display', serif);
      font-size: 1.35rem;
      letter-spacing: 1.5px;
      font-weight: 700;
      margin: 0;
      color: var(--pm-text, #2D3A4B);
    }

    .brand-subtitle {
      font-size: 0.625rem;
      letter-spacing: 2px;
      color: #475569;
      margin: 0;
      font-weight: 600;
    }

    /* Desktop Navigation with Mega Menu */
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      .nav-dropdown-wrapper {
        position: relative;
      }

      .nav-trigger-btn {
        background: transparent;
        border: none;
        color: var(--pm-text, #2D3A4B);
        font-family: inherit;
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 6px 4px;
        transition: color 0.2s ease;

        .nav-arrow {
          font-size: 18px;
          width: 18px;
          height: 18px;
          transition: transform 0.2s ease;
        }

        &:hover, &.active {
          color: var(--pm-primary, #4A5859);

          .nav-arrow {
            transform: rotate(180deg);
          }
        }
      }

      .nav-link {
        color: var(--pm-text, #2D3A4B);
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 4px;
        transition: color 0.2s ease;

        &:hover {
          color: var(--pm-primary, #4A5859);
        }

        &.lookbook-link {
          color: var(--pm-primary, #4A5859);
          font-weight: 700;

          .spark {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: #B45309;
          }
        }
      }
    }

    /* Mega Menu and Dropdown Panels */
    .megamenu-panel {
      position: absolute;
      top: calc(100% + 14px);
      left: 50%;
      transform: translateX(-50%);
      width: 780px;
      background: #FFFFFF !important;
      background-color: #FFFFFF !important;
      opacity: 1 !important;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.16), 0 0 0 1px #E2E8F0 !important;
      padding: 24px;
      z-index: 1050;

      .megamenu-inner {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1.15fr;
        gap: 18px;
      }

      .megamenu-col {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .col-title {
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: var(--pm-primary, #4A5859);
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
          text-transform: uppercase;
        }

        .megamenu-item {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          text-decoration: none;
          padding: 4px 6px;
          border-radius: 6px;
          transition: background 0.2s ease, transform 0.15s ease;

          .item-title {
            font-size: 0.8125rem;
            font-weight: 600;
            color: #1E293B;
          }

          .item-desc {
            font-size: 0.6875rem;
            color: #64748B;
            line-height: 1.25;
            margin-top: 2px;
          }

          &:hover {
            background: #F8FAFC;
            transform: translateX(2px);

            .item-title {
              color: var(--pm-primary, #4A5859);
            }
          }
        }
      }

      .megamenu-spotlight {
        .spotlight-card {
          background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 16px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .spotlight-tag {
            font-size: 0.625rem;
            font-weight: 800;
            letter-spacing: 0.8px;
            color: #059669;
          }

          .spotlight-title {
            font-family: var(--pm-font-serif, 'Playfair Display', serif);
            font-size: 1.1rem;
            font-weight: 700;
            color: #1E293B;
            margin: 6px 0 4px;
          }

          .spotlight-desc {
            font-size: 0.72rem;
            color: #475569;
            line-height: 1.35;
            margin: 0 0 14px;
          }

          .spotlight-btn {
            background: var(--pm-primary, #4A5859);
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 0.75rem;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            transition: all 0.2s ease;

            mat-icon {
              font-size: 14px;
              width: 14px;
              height: 14px;
            }

            &:hover {
              background: #3B4647;
              transform: translateY(-1px);
            }
          }
        }
      }
    }

    .dropdown-panel {
      position: absolute;
      top: calc(100% + 14px);
      left: 0;
      width: 310px;
      background: #FFFFFF !important;
      background-color: #FFFFFF !important;
      opacity: 1 !important;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.14), 0 0 0 1px #E2E8F0 !important;
      padding: 8px;
      z-index: 1050;

      .dropdown-section-label {
        font-size: 0.625rem;
        font-weight: 800;
        letter-spacing: 0.8px;
        color: #94A3B8;
        padding: 6px 10px;
        text-transform: uppercase;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 6px;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.2s ease;

        .drop-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: var(--pm-primary, #4A5859);
          flex-shrink: 0;

          &.highlight {
            color: #D97706;
          }
        }

        .drop-text {
          display: flex;
          flex-direction: column;
          flex: 1;

          .drop-title {
            font-size: 0.8125rem;
            font-weight: 600;
            color: #1E293B;

            &.highlight {
              color: #B45309;
            }
          }

          .drop-sub {
            font-size: 0.6875rem;
            color: #475569;
            line-height: 1.2;
          }
        }

        .badge-accent {
          background: #FEF3C7;
          color: #B45309;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 999px;
        }

        .badge-pill {
          background: #E2E8F0;
          color: #334155;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        &:hover {
          background: #F8FAFC;

          .drop-title {
            color: var(--pm-primary, #4A5859);
          }
        }
      }

      .dropdown-divider {
        height: 1px;
        background: #F1F5F9;
        margin: 6px 0;
      }

      .dropdown-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--pm-primary, #4A5859);
        cursor: pointer;
        text-decoration: none;
        border-radius: 6px;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        &:hover {
          background: #F8FAFC;
        }
      }
    }

    /* Right Utility Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .concierge-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(240, 244, 248, 0.9);
      border: 1px solid #CBD5E1;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.4px;
      color: #1E293B;
      cursor: pointer;
      transition: all 0.2s ease;

      .concierge-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--pm-primary, #4A5859);
      }

      .drop-arrow {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #334155;
      }

      &:hover {
        background: #E2E8F0;
        border-color: #94A3B8;
      }
    }

    .action-btn {
      color: var(--pm-text, #2D3A4B);
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .bag-pill-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #2D3A4B !important;
      color: #FFFFFF !important;
      border: none;
      padding: 8px 16px;
      border-radius: 999px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(45, 58, 75, 0.28);

      &:hover {
        background: #1E293B !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(45, 58, 75, 0.38);
      }

      .bag-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .currency-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(240, 244, 248, 0.9);
      border: 1px solid #CBD5E1;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #1E293B;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #E2E8F0;
        border-color: #94A3B8;
      }

      .curr-flag-symbol {
        font-weight: 700;
        color: var(--pm-primary, #3D5A80);
      }

      .drop-arrow {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #334155;
      }
    }

    /* Kids Luxury Material Menu */
    ::ng-deep .kids-luxury-menu {
      padding: 8px !important;
      min-width: 220px !important;
      border-radius: 12px !important;

      .menu-header {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #64748B;
        padding: 4px 12px 6px;
        border-bottom: 1px solid #ECECEC;
        margin-bottom: 4px;
        letter-spacing: 0.5px;
      }

      .menu-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 10px;
        color: var(--pm-primary, #4A5859);
      }

      .menu-divider {
        height: 1px;
        background: #ECECEC;
        margin: 6px 0;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #10B981;
        display: inline-block;
        margin-right: 8px;
      }

      .owner-menu-label {
        font-weight: 700;
        color: var(--pm-primary, #4A5859);
      }

      .right-icon {
        margin-left: auto;
        margin-right: 0;
      }

      .theme-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 10px;
      }

      .curr-symbol-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        font-weight: 700;
        color: var(--pm-primary, #3D5A80);
        margin-right: 8px;
      }

      .check-icon {
        margin-left: auto;
        color: #10B981;
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    /* Mobile Accordion Drawer */
    .mobile-drawer {
      background: #FFFFFF;
      border-top: 1px solid #E2E8F0;
      padding: 16px 20px;
      max-height: calc(100vh - 120px);
      overflow-y: auto;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

      .mobile-nav-list {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .mobile-acc-group {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;

          .mobile-acc-header {
            width: 100%;
            background: #F8FAFC;
            border: none;
            padding: 12px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #1E293B;
            font-size: 0.825rem;
            font-weight: 700;
            letter-spacing: 0.4px;
            cursor: pointer;

            .acc-chevron {
              font-size: 20px;
              width: 20px;
              height: 20px;
              color: #64748B;
              transition: transform 0.2s ease;

              &.rotated {
                transform: rotate(180deg);
              }
            }
          }

          .mobile-acc-body {
            padding: 8px 14px 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #FFFFFF;

            a {
              color: #475569;
              font-size: 0.825rem;
              font-weight: 500;
              text-decoration: none;
              cursor: pointer;
              padding: 4px 0;

              &:hover {
                color: var(--pm-primary, #4A5859);
              }
            }

            .mobile-action-link {
              background: transparent;
              border: none;
              color: #1E293B;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.825rem;
              cursor: pointer;
              padding: 6px 0;
              text-align: left;

              mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
                color: var(--pm-primary, #4A5859);
              }

              &:hover {
                color: var(--pm-primary, #4A5859);
              }
            }
          }
        }

        .mobile-direct-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          color: var(--pm-primary, #4A5859);
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          background: #F8FAFC;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: var(--pm-accent, #E0A96D);
          }
        }
      }
    }

    .animate-dropdown-fade {
      animation: dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes dropdownFade {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .mobile-toggle {
      display: none;
    }

    @media (max-width: 1024px) {
      .desktop-nav {
        display: none;
      }

      .mobile-toggle {
        display: inline-flex;
      }

      .announcement-bar {
        font-size: 0.75rem;
        justify-content: center;
      }

      .announcement-actions {
        display: none;
      }

      .concierge-label {
        display: none;
      }

      .brand-title {
        font-size: 1.15rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  themeService = inject(ThemeService);
  api = inject(ApiService);
  currency = inject(CurrencyService);
  seo = inject(SeoMetaService);

  toggleOwnerPanel = output<void>();
  openWishlist = output<void>();
  categorySelected = output<string>();
  openBarcode = output<void>();
  openGuide = output<void>();
  openBrands = output<void>();

  tickers: KidsTicker[] = [];
  currentTicker: KidsTicker | null = null;
  private tickerIndex = 0;
  private tickerInterval: any;

  isScrolled = false;
  mobileNavOpen = false;

  // Mega menu and dropdown state
  readonly activeMega = signal<'age' | 'collections' | 'maisons' | null>(null);
  private megaCloseTimeout?: any;

  // Mobile accordion state
  readonly mobileSections = signal<{ [key: string]: boolean }>({
    age: true,
    collections: false,
    maisons: false,
    concierge: false
  });

  themes = this.themeService.availableThemes;
  activeTheme = this.themeService.currentTheme;
  wishlistCount = this.wishlist.count;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMega();
    this.mobileNavOpen = false;
  }

  openMega(menu: 'age' | 'collections' | 'maisons'): void {
    if (this.megaCloseTimeout) {
      clearTimeout(this.megaCloseTimeout);
      this.megaCloseTimeout = null;
    }
    this.activeMega.set(menu);
  }

  scheduleCloseMega(): void {
    this.megaCloseTimeout = setTimeout(() => {
      this.activeMega.set(null);
    }, 200);
  }

  closeMega(): void {
    if (this.megaCloseTimeout) clearTimeout(this.megaCloseTimeout);
    this.activeMega.set(null);
  }

  toggleMega(menu: 'age' | 'collections' | 'maisons'): void {
    this.activeMega.update(current => current === menu ? null : menu);
  }

  toggleMobileSection(section: string): void {
    this.mobileSections.update(s => ({
      ...s,
      [section]: !s[section]
    }));
  }

  ngOnInit(): void {
    this.api.getTickers().subscribe(tickers => {
      this.tickers = tickers;
      if (tickers.length > 0) {
        this.currentTicker = tickers[0];
        this.tickerInterval = setInterval(() => {
          this.tickerIndex = (this.tickerIndex + 1) % this.tickers.length;
          this.currentTicker = this.tickers[this.tickerIndex];
        }, 5000);
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 20;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
    }
  }

  setTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  setCurrency(code: string): void {
    this.currency.setCurrency(code);
  }

  copyCoupon(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    this.cart.setCoupon(code, 25);
    this.cart.openDrawer();
  }

  filterCategory(slug: string): void {
    this.closeMega();
    this.mobileNavOpen = false;
    this.categorySelected.emit(slug);
    this.scrollTo('catalog');
  }

  scrollTo(elementId: string): void {
    this.closeMega();
    this.mobileNavOpen = false;
    if (typeof document !== 'undefined') {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  triggerShare(): void {
    this.seo.openShare();
  }

  reopenGate(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('nanhi_maison_gate_unlocked');
    }
    window.location.reload();
  }
}
