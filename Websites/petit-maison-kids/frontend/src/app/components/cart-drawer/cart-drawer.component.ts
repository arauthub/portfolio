import { Component, inject, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="drawer-backdrop" *ngIf="cart.isDrawerOpen()" (click)="cart.closeDrawer()">
      <div class="drawer-panel" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-label="Nursery Shopping Bag">
        <!-- Header -->
        <div class="drawer-header">
          <div class="header-title-box">
            <mat-icon class="bag-icon">shopping_bag</mat-icon>
            <h3>Nursery Bag</h3>
            <span class="item-count-badge">({{ cart.itemCount() }})</span>
          </div>
          <button class="close-icon-btn" (click)="cart.closeDrawer()" aria-label="Close bag">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Free Shipping Meter -->
        <div class="shipping-meter-card">
          <div class="meter-text">
            <span *ngIf="cart.freeShippingRemaining() > 0">
              Add <strong>{{ cart.formattedFreeShippingRemaining() }}</strong> more for <strong>FREE Express Courier across India</strong>
            </span>
            <span *ngIf="cart.freeShippingRemaining() === 0" class="shipping-unlocked">
              <mat-icon class="sparkle-icon">celebration</mat-icon>
              <strong>You've unlocked FREE Bluedart Express Delivery!</strong>
            </span>
          </div>
          <mat-progress-bar
            mode="determinate"
            [value]="cart.freeShippingProgress()"
            class="shipping-progress"
          ></mat-progress-bar>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items-scroll" *ngIf="cart.items().length > 0; else emptyBag">
          <div class="cart-item-card" *ngFor="let item of cart.items()">
            <img [src]="item.image" [alt]="item.title" class="item-thumb" />

            <div class="item-info">
              <div class="info-top">
                <h4 class="item-title">{{ item.title }}</h4>
                <button class="remove-btn" (click)="cart.removeItem(item.id)" matTooltip="Remove">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>

              <div class="item-meta">
                <span class="meta-pill">Size: {{ item.size }}</span>
                <span class="meta-pill" *ngIf="item.color">Color: {{ item.color }}</span>
              </div>

              <!-- Monogram Details Tag -->
              <div class="item-monogram-tag" *ngIf="item.monogram">
                <mat-icon class="mini-icon">brush</mat-icon>
                <span>Royal Zari Monogram: "<strong>{{ item.monogram.text }}</strong>" ({{ item.monogram.font }}) • +{{ currency.format(499) }}</span>
              </div>

              <div class="qty-price-row">
                <div class="qty-stepper">
                  <button class="step-btn" (click)="cart.updateQuantity(item.id, -1)">-</button>
                  <span class="step-val">{{ item.quantity }}</span>
                  <button class="step-btn" (click)="cart.updateQuantity(item.id, 1)">+</button>
                </div>
                <div class="price-val">
                  {{ currency.format((item.price + (item.monogram ? 499 : 0)) * item.quantity) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Gift Packaging Option -->
          <div class="gift-packaging-card">
            <div class="gift-option-header">
              <input
                type="checkbox"
                id="cart-gift-wrap-check"
                [checked]="cart.giftWrapSelected()"
                (change)="toggleGiftWrap()"
              />
              <label for="cart-gift-wrap-check" class="gift-label">
                <mat-icon class="gift-icon">card_giftcard</mat-icon>
                <div>
                  <strong>Royal Shahi Gift Box & Keepsake Card</strong>
                  <p>Hand-tied golden dori in an archival wooden keepsake box (+ {{ currency.format(250) }})</p>
                </div>
              </label>
            </div>

            <div class="gift-note-wrapper" *ngIf="cart.giftWrapSelected()">
              <label class="note-label">Handwritten Nursery Message</label>
              <textarea
                rows="2"
                id="cart-gift-note"
                placeholder="Write your blessing note for the child..."
                class="gift-textarea"
                [ngModel]="cart.giftNote()"
                (ngModelChange)="cart.giftNote.set($event)"
              ></textarea>
            </div>
          </div>

          <!-- Coupon Promo Code Section -->
          <div class="coupon-section">
            <div class="coupon-input-group" *ngIf="!cart.appliedCoupon()">
              <input
                type="text"
                id="cart-coupon-input"
                placeholder="Festive Code (e.g. DIWALI25)"
                [(ngModel)]="couponCodeInput"
                class="coupon-input"
              />
              <button
                class="apply-coupon-btn"
                id="cart-coupon-apply-btn"
                (click)="applyCoupon()"
              >
                Apply
              </button>
            </div>

            <div class="applied-coupon-pill" *ngIf="cart.appliedCoupon() as coupon">
              <div class="coupon-tag-info">
                <mat-icon class="check-icon">check_circle</mat-icon>
                <span>Coupon: <strong>{{ coupon.code }}</strong> applied (-{{ cart.formattedDiscount() }})</span>
              </div>
              <button class="remove-coupon-btn" (click)="cart.removeCoupon()">Remove</button>
            </div>

            <!-- Quick coupon suggestions -->
            <div class="quick-coupons" *ngIf="!cart.appliedCoupon()">
              <span class="suggest-label">Festive offers:</span>
              <button class="chip-code" id="chip-diwali25" (click)="useCoupon('DIWALI25')">DIWALI25 (25% off)</button>
              <button class="chip-code" id="chip-nanhi15" (click)="useCoupon('NANHI15')">NANHI15 (15% off)</button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <ng-template #emptyBag>
          <div class="empty-bag-body">
            <mat-icon class="empty-icon">shopping_basket</mat-icon>
            <h4>Your nursery bag is empty</h4>
            <p>Discover our organic mulmul kurtas, angrakhas, and gotapatti festive pieces.</p>
            <button mat-raised-button class="start-shopping-btn gold-shimmer-btn" (click)="cart.closeDrawer()">
              Explore Heirlooms
            </button>
          </div>
        </ng-template>

        <!-- Footer / Checkout Breakdown -->
        <div class="drawer-footer" *ngIf="cart.items().length > 0">
          <div class="summary-line">
            <span>Subtotal</span>
            <span>{{ cart.formattedSubtotal() }}</span>
          </div>

          <div class="summary-line discount" *ngIf="cart.discountAmount() > 0">
            <span>Festive Savings</span>
            <span>-{{ cart.formattedDiscount() }}</span>
          </div>

          <div class="summary-line" *ngIf="cart.giftWrapSelected()">
            <span>Shahi Gift Packaging</span>
            <span>+{{ cart.formattedGiftWrap() }}</span>
          </div>

          <div class="summary-line">
            <span>Express Courier</span>
            <span>{{ cart.formattedShipping() }}</span>
          </div>

          <div class="summary-line">
            <span>GST (5% Handloom)</span>
            <span>{{ cart.formattedTax() }}</span>
          </div>

          <div class="total-line">
            <span>Total Payable ({{ currency.activeCurrency() }})</span>
            <span class="final-price">{{ cart.formattedTotal() }}</span>
          </div>

          <!-- Supported Payment Modes -->
          <div class="supported-payment-methods" style="display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 14px;">
            <span style="background: #F4ECE0; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
              <mat-icon style="font-size: 13px; width: 13px; height: 13px; color: #558B62;">qr_code_2</mat-icon> UPI / GPay
            </span>
            <span style="background: #F4ECE0; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
              <mat-icon style="font-size: 13px; width: 13px; height: 13px; color: #558B62;">credit_card</mat-icon> RuPay / Cards
            </span>
            <span style="background: #F4ECE0; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
              <mat-icon style="font-size: 13px; width: 13px; height: 13px; color: #558B62;">account_balance</mat-icon> NetBanking
            </span>
            <span style="background: #F4ECE0; font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
              <mat-icon style="font-size: 13px; width: 13px; height: 13px; color: #558B62;">payments</mat-icon> COD Available
            </span>
          </div>

          <button
            mat-raised-button
            class="checkout-btn gold-shimmer-btn"
            id="cart-checkout-proceed-btn"
            (click)="proceedToCheckout()"
          >
            <mat-icon>lock</mat-icon>
            <span>Proceed to Royal Checkout • {{ cart.formattedTotal() }}</span>
          </button>

          <p class="security-guarantee">
            <mat-icon class="shield-mini">security</mat-icon>
            Bluedart Luxury Courier • 100% Scratch-Free Guarantee • Easy Exchanges
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 58, 75, 0.6);
      backdrop-filter: blur(4px);
      z-index: 10005;
      display: flex;
      justify-content: flex-end;
    }

    .drawer-panel {
      background: #FFFFFF;
      width: 100%;
      max-width: 480px;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 40px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .drawer-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #ECECEC;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-title-box {
        display: flex;
        align-items: center;
        gap: 8px;

        .bag-icon {
          color: var(--pm-primary, #4A5859);
        }

        h3 {
          font-family: var(--pm-font-serif, 'Playfair Display', serif);
          font-size: 1.25rem;
          margin: 0;
          color: #2D3A4B;
        }

        .item-count-badge {
          color: #71717A;
          font-size: 0.875rem;
          font-weight: 600;
        }
      }

      .close-icon-btn {
        background: none;
        border: none;
        color: #71717A;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 50%;

        &:hover {
          background: #F4F4F5;
        }
      }
    }

    .shipping-meter-card {
      background: #F0F4F8;
      padding: 12px 1.5rem;
      border-bottom: 1px solid #E2E8F0;

      .meter-text {
        font-size: 0.8125rem;
        color: #334155;
        margin-bottom: 6px;

        .shipping-unlocked {
          color: #2E7D32;
          display: flex;
          align-items: center;
          gap: 6px;

          .sparkle-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      .shipping-progress {
        height: 6px;
        border-radius: 4px;
      }
    }

    .cart-items-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .cart-item-card {
      display: flex;
      gap: 12px;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #F4F4F5;

      .item-thumb {
        width: 80px;
        height: 95px;
        object-fit: cover;
        border-radius: 12px;
        background: #F5F1ED;
      }

      .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .info-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .item-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #2D3A4B;
          margin: 0;
          line-height: 1.3;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #A1A1AA;
          cursor: pointer;
          padding: 2px;

          &:hover {
            color: #DC2626;
          }
        }
      }

      .item-meta {
        display: flex;
        gap: 6px;
        margin: 4px 0 6px 0;

        .meta-pill {
          background: #F4F4F5;
          font-size: 0.6875rem;
          color: #52525B;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }

      .item-monogram-tag {
        background: #FFF8E1;
        border: 1px dashed #FFE082;
        padding: 3px 6px;
        border-radius: 6px;
        font-size: 0.6875rem;
        color: #795548;
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;

        .mini-icon {
          font-size: 12px;
          width: 12px;
          height: 12px;
          color: #B85D36;
        }
      }

      .qty-price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;

        .qty-stepper {
          display: flex;
          align-items: center;
          border: 1px solid #E4E4E7;
          border-radius: 6px;

          .step-btn {
            background: none;
            border: none;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 0.875rem;
            color: #2D3A4B;
          }

          .step-val {
            font-size: 0.8125rem;
            font-weight: 700;
            padding: 0 6px;
          }
        }

        .price-val {
          font-weight: 800;
          font-size: 0.9375rem;
          color: #2D3A4B;
        }
      }
    }

    .gift-packaging-card {
      background: #FDFBF7;
      border: 1px solid #EAE5DF;
      border-radius: 12px;
      padding: 12px;

      .gift-option-header {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        input[type="checkbox"] {
          accent-color: var(--pm-primary, #4A5859);
          margin-top: 3px;
        }

        .gift-label {
          display: flex;
          gap: 8px;
          cursor: pointer;

          .gift-icon {
            color: var(--pm-primary, #4A5859);
            font-size: 20px;
            width: 20px;
            height: 20px;
          }

          strong {
            font-size: 0.8125rem;
            color: #2D3A4B;
            display: block;
          }

          p {
            font-size: 0.6875rem;
            color: #71717A;
            margin: 0;
          }
        }
      }

      .gift-note-wrapper {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed #E2DED9;

        .note-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #71717A;
          display: block;
          margin-bottom: 4px;
        }

        .gift-textarea {
          width: 100%;
          border: 1px solid #D4D4D8;
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 0.8125rem;
          outline: none;
        }
      }
    }

    .coupon-section {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .coupon-input-group {
        display: flex;
        gap: 6px;

        .coupon-input {
          flex: 1;
          border: 1px solid #D4D4D8;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.8125rem;
          font-weight: 600;
          outline: none;
        }

        .apply-coupon-btn {
          background: #2D3A4B;
          color: #FFFFFF;
          border: none;
          padding: 0 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8125rem;
          cursor: pointer;
        }
      }

      .applied-coupon-pill {
        background: #E8F5E9;
        border: 1px solid #A5D6A7;
        padding: 6px 10px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .coupon-tag-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #2E7D32;

          .check-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }

        .remove-coupon-btn {
          background: none;
          border: none;
          color: #D32F2F;
          font-size: 0.6875rem;
          font-weight: 700;
          cursor: pointer;
        }
      }

      .quick-coupons {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;

        .suggest-label {
          font-size: 0.6875rem;
          color: #71717A;
        }

        .chip-code {
          background: #F4F4F5;
          border: 1px dashed #D4D4D8;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.6875rem;
          color: #2D3A4B;
          cursor: pointer;
          font-family: monospace;

          &:hover {
            background: #E4E4E7;
          }
        }
      }
    }

    .empty-bag-body {
      padding: 4rem 1.5rem;
      text-align: center;

      .empty-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
        color: #D4D4D8;
        margin-bottom: 1rem;
      }

      h4 {
        font-size: 1.125rem;
        margin: 0 0 0.5rem 0;
        color: #2D3A4B;
      }

      p {
        font-size: 0.875rem;
        color: #71717A;
        margin: 0 0 1.5rem 0;
      }

      .start-shopping-btn {
        background: var(--pm-primary, #4A5859) !important;
        color: #FFFFFF !important;
        border-radius: 999px !important;
        padding: 8px 24px !important;
      }
    }

    .drawer-footer {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid #ECECEC;
      background: #FAFAFA;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .summary-line {
        display: flex;
        justify-content: space-between;
        font-size: 0.8125rem;
        color: #71717A;

        &.discount {
          color: #2E7D32;
          font-weight: 600;
        }
      }

      .total-line {
        display: flex;
        justify-content: space-between;
        font-size: 1.125rem;
        font-weight: 800;
        color: #2D3A4B;
        padding-top: 8px;
        margin-top: 4px;
        border-top: 1px solid #ECECEC;

        .final-price {
          color: var(--pm-primary, #4A5859);
        }
      }

      .checkout-btn {
        background: var(--pm-primary, #4A5859) !important;
        color: #FFFFFF !important;
        padding: 14px 20px !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        border-radius: 14px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        margin-top: 8px !important;
        box-shadow: 0 8px 24px rgba(74, 88, 89, 0.25) !important;
      }

      .security-guarantee {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 0.6875rem;
        color: #71717A;
        margin: 6px 0 0 0;

        .shield-mini {
          font-size: 14px;
          width: 14px;
          height: 14px;
          color: #2E7D32;
        }
      }
    }
  `]
})
export class CartDrawerComponent {
  cart = inject(CartService);
  api = inject(ApiService);
  currency = inject(CurrencyService);

  openCheckout = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.cart.isDrawerOpen()) {
      this.cart.closeDrawer();
    }
  }

  couponCodeInput = '';

  toggleGiftWrap(): void {
    this.cart.giftWrapSelected.set(!this.cart.giftWrapSelected());
  }

  applyCoupon(): void {
    if (!this.couponCodeInput.trim()) return;
    this.api.validateCoupon(this.couponCodeInput, this.cart.rawSubtotal()).subscribe(res => {
      if (res.valid) {
        this.cart.setCoupon(this.couponCodeInput.trim().toUpperCase(), res.discount_percent, res.discount_amount);
        this.couponCodeInput = '';
      } else {
        alert(res.message);
      }
    });
  }

  useCoupon(code: string): void {
    this.couponCodeInput = code;
    this.applyCoupon();
  }

  proceedToCheckout(): void {
    this.cart.closeDrawer();
    this.openCheckout.emit();
  }
}
