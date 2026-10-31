import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../services/membership.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-membership-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (membership.isMembershipModalOpen()) {
      <div class="membership-backdrop" (click)="membership.closeModal()">
        <div class="membership-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="dialog-header">
            <div>
              <span class="badge">PETIT MAISON PRIVILEGED ACCESS</span>
              <h2>Family Club Memberships</h2>
              <p class="subtitle">Cherish your little one's milestones with exclusive nursery discounts and concierge privileges.</p>
            </div>
            <button class="close-btn" (click)="membership.closeModal()">✕</button>
          </div>

          <div class="tiers-grid">
            @for (tier of membership.availableTiers(); track tier.tier_type) {
              <div 
                class="tier-card" 
                [class.active]="membership.activeTierType() === tier.tier_type"
                [class.featured]="tier.tier_type === 'PREMIUM' || tier.tier_type === 'VIP'">
                
                @if (tier.tier_type === 'VIP') {
                  <div class="crown-badge">ROYAL PATRON</div>
                }

                <div class="tier-top">
                  <h3>{{ tier.name }}</h3>
                  <div class="price-row">
                    <span class="price">
                      {{ tier.monthly_price_usd === 0 ? 'Free' : currency.format(tier.monthly_price_usd) }}
                    </span>
                    @if (tier.monthly_price_usd > 0) {
                      <span class="cycle">/month</span>
                    }
                  </div>
                  @if (tier.discount_percentage > 0) {
                    <div class="discount-pill">
                      <strong>{{ tier.discount_percentage }}% OFF</strong> Every Garment
                    </div>
                  }
                </div>

                <ul class="perks-list">
                  @for (perk of tier.perks_list; track perk) {
                    <li>
                      <span class="material-symbols-outlined check">check_circle</span>
                      <span>{{ perk }}</span>
                    </li>
                  }
                </ul>

                <button 
                  class="select-tier-btn"
                  [class.current]="membership.activeTierType() === tier.tier_type"
                  (click)="membership.setUserTier(tier.tier_type)">
                  {{ membership.activeTierType() === tier.tier_type ? 'Current Plan' : 'Select ' + tier.name }}
                </button>
              </div>
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .membership-backdrop {
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

    .membership-dialog {
      background: #FAF6EE;
      color: #2b3a32;
      width: 95vw;
      max-width: 1080px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 20px;
      border: 1px solid rgba(122, 168, 132, 0.3);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
      padding: 30px;
    }

    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;

      .badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: #7AA884;
        text-transform: uppercase;
      }

      h2 {
        margin: 4px 0 6px;
        font-size: 1.6rem;
        font-weight: 800;
      }

      .subtitle {
        color: #66776e;
        font-size: 0.85rem;
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: #666;
      }
    }

    .tiers-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .tier-card {
      background: #FFFFFF;
      border: 2px solid #E5DFD5;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.25s ease;

      &.featured {
        border-color: #7AA884;
      }

      &.active {
        border-color: #FF9F1C;
        box-shadow: 0 10px 25px rgba(255, 159, 28, 0.18);
      }

      .crown-badge {
        position: absolute;
        top: -10px;
        right: 14px;
        background: #FF9F1C;
        color: white;
        font-size: 0.6rem;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 4px;
        letter-spacing: 0.08em;
      }

      .tier-top {
        margin-bottom: 16px;

        h3 {
          margin: 0 0 8px;
          font-size: 1.1rem;
          font-weight: 800;
        }

        .price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;

          .price {
            font-size: 1.5rem;
            font-weight: 800;
            color: #2b3a32;
          }

          .cycle {
            font-size: 0.75rem;
            color: #888;
          }
        }

        .discount-pill {
          margin-top: 8px;
          background: rgba(122, 168, 132, 0.15);
          color: #3d5a4c;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          display: inline-block;
        }
      }

      .perks-list {
        list-style: none;
        padding: 0;
        margin: 0 0 20px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        li {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 0.75rem;
          color: #4b5b52;
          line-height: 1.35;

          .check {
            color: #7AA884;
            font-size: 14px;
            margin-top: 2px;
            flex-shrink: 0;
          }
        }
      }

      .select-tier-btn {
        width: 100%;
        padding: 9px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid #7AA884;
        background: transparent;
        color: #7AA884;
        transition: all 0.2s ease;

        &:hover {
          background: #7AA884;
          color: white;
        }

        &.current {
          background: #2b3a32;
          color: white;
          border-color: #2b3a32;
        }
      }
    }

    @media (max-width: 960px) {
      .tiers-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 520px) {
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
    if (this.membership.isMembershipModalOpen()) {
      this.membership.closeModal();
    }
  }
}
