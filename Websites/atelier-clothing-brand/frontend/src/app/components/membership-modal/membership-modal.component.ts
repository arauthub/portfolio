import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../services/membership.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-membership-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (membership.isModalOpen()) {
      <div class="modal-backdrop" (click)="membership.closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="modal-top">
            <span class="club-badge">✦ MAISON PRIVILEGE PASS ✦</span>
            <button class="close-btn" (click)="membership.closeModal()">✕</button>
          </div>

          <div class="modal-head">
            <h2>Select Your Atelier Privilege Tier</h2>
            <p>Elevate your fashion journey with instant collection discounts, private runway previews, and bespoke tailoring.</p>
            
            <div class="billing-toggle">
              <button 
                class="toggle-btn" 
                [class.active]="billingCycle() === 'monthly'" 
                (click)="billingCycle.set('monthly')">
                Monthly Billing
              </button>
              <button 
                class="toggle-btn" 
                [class.active]="billingCycle() === 'annual'" 
                (click)="billingCycle.set('annual')">
                Annual Billing <span class="save-tag">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div class="tiers-grid">
            @for (tier of membership.tiers; track tier.tier_type) {
              <div 
                class="tier-card" 
                [class.active]="membership.currentTier().tier_type === tier.tier_type"
                [class.vip-glow]="tier.tier_type === 'VIP'">
                
                @if (membership.currentTier().tier_type === tier.tier_type) {
                  <div class="current-pill">YOUR CURRENT TIER</div>
                }

                <div class="card-head">
                  <span class="tier-type-badge">{{ tier.badge_label }}</span>
                  <h3>{{ tier.name }}</h3>
                  
                  <div class="pricing">
                    @if (tier.monthly_price_usd === 0) {
                      <span class="price-val">Complimentary</span>
                    } @else if (billingCycle() === 'monthly') {
                      <span class="price-val">{{ currency.format(tier.monthly_price_usd) }}</span>
                      <span class="period">/ month</span>
                    } @else {
                      <span class="price-val">{{ currency.format(tier.annual_price_usd) }}</span>
                      <span class="period">/ year</span>
                    }
                  </div>

                  <div class="discount-callout">
                    @if (tier.discount_percentage > 0) {
                      <strong>{{ tier.discount_percentage }}% Instant Off</strong> on all purchases
                    } @else {
                      <span>Standard catalog pricing</span>
                    }
                  </div>
                </div>

                <div class="perks-list">
                  @for (perk of tier.perks_list; track perk) {
                    <div class="perk-row">
                      <span class="check-icon">✓</span>
                      <span>{{ perk }}</span>
                    </div>
                  }
                </div>

                <div class="card-footer">
                  @if (membership.currentTier().tier_type === tier.tier_type) {
                    <button class="select-btn active-state" disabled>Active Privilege</button>
                  } @else {
                    <button class="select-btn" (click)="membership.upgradeTo(tier.tier_type)">
                      Upgrade to {{ tier.name }}
                    </button>
                  }
                </div>

              </div>
            }
          </div>

        </div>
      </div>
    }
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

    .modal-card {
      background: #121419;
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.16));
      border-radius: 24px;
      max-width: 1100px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 28px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85);
    }

    .modal-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .club-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--accent-gold, #EAD8C0);
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 20px;
      cursor: pointer;
    }

    .modal-head {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 28px;
    }

    .modal-head h2 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 30px;
      margin: 0 0 8px;
      color: #FFF;
    }

    .modal-head p {
      font-size: 14px;
      color: #94A3B8;
      margin: 0 0 20px;
    }

    .billing-toggle {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.05);
      padding: 4px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      gap: 4px;
    }

    .toggle-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .toggle-btn.active {
      background: rgba(234, 216, 192, 0.2);
      color: var(--accent-gold, #EAD8C0);
      font-weight: 600;
    }

    .save-tag {
      background: #10B981;
      color: #0A0B0E;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 9999px;
    }

    .tiers-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .tier-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.25s;
    }

    .tier-card:hover {
      border-color: rgba(234, 216, 192, 0.3);
      transform: translateY(-2px);
    }

    .tier-card.active {
      border-color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.04);
    }

    .tier-card.vip-glow {
      border-color: rgba(234, 216, 192, 0.4);
      box-shadow: 0 10px 30px -10px rgba(234, 216, 192, 0.15);
    }

    .current-pill {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent-gold, #EAD8C0);
      color: #0A0B0E;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 3px 10px;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .card-head {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tier-type-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--accent-gold, #EAD8C0);
      display: block;
      margin-bottom: 4px;
    }

    .card-head h3 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 18px;
      margin: 0 0 10px;
      color: #FFF;
    }

    .price-val {
      font-size: 24px;
      font-weight: 700;
      color: #FFF;
    }

    .period {
      font-size: 11px;
      color: #94A3B8;
      margin-left: 4px;
    }

    .discount-callout {
      font-size: 12px;
      color: #10B981;
      margin-top: 8px;
    }

    .perks-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
      margin-bottom: 20px;
    }

    .perk-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12px;
      color: #CBD5E1;
      line-height: 1.4;
    }

    .check-icon {
      color: #10B981;
      font-weight: bold;
    }

    .card-footer {
      margin-top: auto;
    }

    .select-btn {
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      border: none;
      transition: all 0.2s;
    }

    .select-btn.active-state {
      background: rgba(255, 255, 255, 0.1);
      color: #94A3B8;
      cursor: default;
    }

    @media (max-width: 900px) {
      .tiers-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 550px) {
      .tiers-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MembershipModalComponent {
  membership = inject(MembershipService);
  currency = inject(CurrencyService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.membership.isModalOpen()) {
      this.membership.closeModal();
    }
  }

  billingCycle = signal<'monthly' | 'annual'>('annual');
}
