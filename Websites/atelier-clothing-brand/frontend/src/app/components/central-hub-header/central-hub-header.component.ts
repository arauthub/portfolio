import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MembershipService } from '../../services/membership.service';
import { PosService } from '../../services/pos.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-central-hub-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hub-header" aria-label="Enterprise Multi-Brand Hub Navigation">
      <div class="hub-container">
        <!-- Left: Hub Factory Branding & Brand Switcher -->
        <div class="hub-left">
          <div class="hub-logo">
            <span class="hub-pill">CENTRALISED HUB</span>
            <span class="hub-brand-name">FASHION FACTORY</span>
          </div>
          
          <nav class="hub-nav" aria-label="Brand Switcher">
            <a href="http://localhost:4202" class="brand-link active" title="Atelier Vogue Adult Couture" aria-label="Atelier Adults Haute Couture">
              <span class="material-symbols-outlined nav-icon" aria-hidden="true">styler</span>
              <span class="brand-label">ATELIER (ADULTS)</span>
              <span class="dot live"></span>
            </a>
            <a href="http://localhost:4201" class="brand-link" title="Petit Maison Heirloom Childrenswear" aria-label="Petit Maison Kids and Nursery">
              <span class="material-symbols-outlined nav-icon" aria-hidden="true">child_care</span>
              <span class="brand-label">PETIT MAISON (KIDS)</span>
              <span class="dot"></span>
            </a>
            <button class="brand-link multi-btn" (click)="openBrandPortal.emit()" title="Explore all hosted clothing brands" aria-label="Multi-Brand Mall">
              <span class="material-symbols-outlined nav-icon" aria-hidden="true">storefront</span>
              <span class="brand-label">MULTI-BRAND MALL</span>
              <span class="badge-mini">4 BRANDS</span>
            </button>
          </nav>
        </div>

        <!-- Center: Live Stock Ticker -->
        <div class="hub-center">
          <div class="live-indicator">
            <span class="pulse-beacon" aria-hidden="true"></span>
            <span class="stock-text">LIVE ATELIER INVENTORY ACTIVE • SCAN BARCODES INSTANTLY</span>
          </div>
        </div>

        <!-- Right: Membership Badge, In-Store POS Mode & Guide -->
        <div class="hub-right">
          <!-- First-time Guide Trigger -->
          <button class="action-btn guide-btn" (click)="openGuide.emit()" title="Open First-Time User Guidelines" aria-label="Open First-Time User Guidelines">
            <span class="material-symbols-outlined" aria-hidden="true">help</span>
            <span class="btn-text">USER GUIDE</span>
          </button>

          <!-- In-Store POS Retail Mode -->
          <button class="action-btn pos-btn" (click)="posService.openPos()" title="Launch In-Store Retail POS Counter" aria-label="Launch In-Store Retail POS Counter">
            <span class="material-symbols-outlined" aria-hidden="true">point_of_sale</span>
            <span class="btn-text">IN-STORE POS</span>
          </button>

          <!-- Membership Tier Pill -->
          <button class="action-btn member-pill" (click)="membershipService.openModal()" title="View Membership Privileges" aria-label="View Membership Privileges">
            <span class="crown" aria-hidden="true">👑</span>
            <span class="tier-name">{{ membershipService.currentTier().badge_label }}</span>
            <span class="discount-tag">-{{ membershipService.currentTier().discount_percentage }}%</span>
          </button>

          <!-- User Auth Profile -->
          @if (authService.currentUser()) {
            <button class="action-btn user-btn" (click)="authService.openProfileDrawer()" title="View Account Profile" aria-label="View Account Profile">
              <img [src]="authService.currentUser()!.avatar" alt="Avatar" class="avatar-img" (error)="onAvatarError($event)" />
              <span class="user-first-name">{{ authService.currentUser()!.name.split(' ')[0] }}</span>
            </button>
          } @else {
            <button class="action-btn signin-btn" (click)="authService.openAuthModal()" aria-label="Sign In to Account">
              <span class="material-symbols-outlined" aria-hidden="true">account_circle</span>
              <span class="btn-text">SIGN IN</span>
            </button>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .hub-header {
      background: #060709;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #94A3B8;
      font-size: 11px;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
      z-index: 990;
    }

    .hub-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 6px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .hub-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .hub-logo {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .hub-pill {
      background: rgba(234, 216, 192, 0.12);
      color: var(--accent-gold, #EAD8C0);
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(234, 216, 192, 0.25);
    }

    .hub-brand-name {
      font-weight: 700;
      color: #F8FAFC;
      letter-spacing: 1px;
    }

    .hub-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #94A3B8;
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 11px;
    }

    .brand-link:hover {
      color: #FFF;
      background: rgba(255, 255, 255, 0.05);
    }

    .brand-link.active {
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      border: 1px solid rgba(234, 216, 192, 0.2);
    }

    .nav-icon {
      font-size: 14px;
    }

    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #64748B;
    }

    .dot.live {
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
    }

    .badge-mini {
      font-size: 9px;
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
      padding: 1px 5px;
      border-radius: 9999px;
      margin-left: 2px;
      font-weight: 700;
    }

    .hub-center {
      display: flex;
      align-items: center;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #CBD5E1;
      background: rgba(255, 255, 255, 0.03);
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .pulse-beacon {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      animation: beaconPulse 2s infinite ease-in-out;
    }

    @keyframes beaconPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    .hub-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #CBD5E1;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFF;
    }

    .guide-btn {
      color: #38BDF8;
      border-color: rgba(56, 189, 248, 0.2);
    }

    .pos-btn {
      color: #F59E0B;
      border-color: rgba(245, 158, 11, 0.25);
    }

    .member-pill {
      background: rgba(234, 216, 192, 0.15);
      border-color: var(--accent-gold, #EAD8C0);
      color: var(--accent-gold, #EAD8C0);
    }

    .discount-tag {
      background: #065F46;
      color: #ECFDF5;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }

    .user-btn {
      padding: 2px 8px 2px 4px;
      border-radius: 9999px;
    }

    .avatar-img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      object-fit: cover;
    }

    /* Responsive & Foldable optimizations */
    @media (max-width: 900px) {
      .hub-center {
        display: none;
      }
      .hub-container {
        padding: 4px 12px;
      }
      .hub-brand-name {
        display: none;
      }
      .btn-text {
        display: none;
      }
    }

    @media (max-width: 600px) {
      .brand-label {
        display: none;
      }
      .badge-mini {
        display: none;
      }
      .tier-name {
        display: none;
      }
      .user-first-name {
        display: none;
      }
    }

    @media (max-width: 360px) {
      .hub-left {
        gap: 8px;
      }
      .hub-pill {
        display: none;
      }
      .hub-right {
        gap: 4px;
      }
      .action-btn {
        padding: 4px 6px;
      }
    }
  `]
})
export class CentralHubHeaderComponent {
  authService = inject(AuthService);
  membershipService = inject(MembershipService);
  posService = inject(PosService);
  currencyService = inject(CurrencyService);

  openGuide = output<void>();
  openBrandPortal = output<void>();

  onAvatarError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  }
}
