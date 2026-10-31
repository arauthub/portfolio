import { Component, output, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';
import { MembershipService } from '../../services/membership.service';
import { OrderConfirmation } from '../../models/kids.model';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatRadioModule],
  template: `
    <div class="checkout-backdrop" (click)="close.emit()">
      <div class="checkout-modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="kids-checkout-title">
        <!-- Modal Top Bar -->
        <div class="modal-top">
          <div class="brand-crest-box">
            <mat-icon class="brand-icon">auto_awesome</mat-icon>
            <div>
              <h3 id="kids-checkout-title">NANHI MAISON</h3>
              <span>Indian Heirloom Nursery Checkout</span>
            </div>
          </div>
          <button class="close-btn" (click)="close.emit()" aria-label="Close Checkout Dialog">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="checkout-layout">
          <!-- Left Column: Form Steps -->
          <div class="checkout-form-col">
            <!-- Step Indicators -->
            <div class="step-nav">
              <div class="step-item" [class.active]="step === 1" [class.completed]="step > 1">
                <span class="step-num">1</span>
                <span class="step-label">Parent & Little One</span>
              </div>
              <div class="step-divider"></div>
              <div class="step-item" [class.active]="step === 2" [class.completed]="step > 2">
                <span class="step-num">2</span>
                <span class="step-label">Bluedart Courier</span>
              </div>
              <div class="step-divider"></div>
              <div class="step-item" [class.active]="step === 3">
                <span class="step-num">3</span>
                <span class="step-label">Payment Mode</span>
              </div>
            </div>

            <!-- Demo 1-Click Autofill Button -->
            <div class="autofill-banner">
              <span>Testing Indian checkout flow?</span>
              <button class="autofill-btn" id="checkout-autofill-btn" (click)="autofillTestData()">
                <mat-icon class="mini-icon">auto_fix_high</mat-icon>
                1-Click Autofill Delhi / Mumbai Info
              </button>
            </div>

            <!-- STEP 1: Parent & Little One Details -->
            <div class="form-step-pane" *ngIf="step === 1">
              <h4 class="step-heading">Parent Contact & Little One Details</h4>

              <div class="form-grid">
                <div class="field full">
                  <label>Parent / Guardian Full Name *</label>
                  <input type="text" [(ngModel)]="parentName" placeholder="e.g. Ananya Sharma" required />
                </div>

                <div class="field half">
                  <label>Email Address for Tracking *</label>
                  <input type="email" [(ngModel)]="email" placeholder="e.g. ananya.sharma@example.in" required />
                </div>

                <div class="field half">
                  <label>Mobile Number (SMS delivery alerts) *</label>
                  <input type="tel" [(ngModel)]="phone" placeholder="+91 98765 43210" />
                </div>

                <div class="field half">
                  <label>Little One's Name (For Keepsake Tag)</label>
                  <input type="text" [(ngModel)]="childName" placeholder="e.g. Baby Aarav" />
                </div>

                <div class="field half">
                  <label>Child Age / Birthday (For milestone gifts)</label>
                  <input type="text" [(ngModel)]="childAge" placeholder="e.g. 8 Months" />
                </div>

                <div class="field full">
                  <label>Street Address / Apartment *</label>
                  <input type="text" [(ngModel)]="address" placeholder="Bungalow 9, Golf Links" required />
                </div>

                <div class="field third">
                  <label>City *</label>
                  <input type="text" [(ngModel)]="city" placeholder="New Delhi" required />
                </div>

                <div class="field third">
                  <label>Postal Pincode *</label>
                  <input type="text" [(ngModel)]="postalCode" placeholder="110003" required />
                </div>

                <div class="field third">
                  <label>Country *</label>
                  <select [(ngModel)]="country" class="country-select">
                    <option value="India">India</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>

              <div class="step-action-row">
                <div></div>
                <button
                  mat-raised-button
                  class="btn-continue gold-shimmer-btn"
                  id="step1-continue-btn"
                  [disabled]="!parentName || !email || !address || !city"
                  (click)="step = 2"
                >
                  Continue to Shipping
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>

            <!-- STEP 2: Courier Shipping Method -->
            <div class="form-step-pane" *ngIf="step === 2">
              <h4 class="step-heading">Select Heirloom Courier Service</h4>

              <div class="shipping-options-list">
                <label class="shipping-option-card" [class.selected]="shippingMethod === 'dhl_express'">
                  <input
                    type="radio"
                    name="shipping"
                    value="dhl_express"
                    [(ngModel)]="shippingMethod"
                  />
                  <div class="ship-details">
                    <div class="ship-header">
                      <strong>Bluedart Air Express (2 - 3 Days)</strong>
                      <span class="ship-cost">{{ cart.shippingCost() === 0 ? 'FREE' : currency.format(150.00) }}</span>
                    </div>
                    <p>Signature-required doorstep delivery across all Indian pincodes with scratch-free archival packaging.</p>
                  </div>
                </label>

                <label class="shipping-option-card" [class.selected]="shippingMethod === 'royal_white_glove'">
                  <input
                    type="radio"
                    name="shipping"
                    value="royal_white_glove"
                    [(ngModel)]="shippingMethod"
                  />
                  <div class="ship-details">
                    <div class="ship-header">
                      <strong>Same-Day Royal Chauffeur Hand-Delivery (Delhi NCR / Mumbai)</strong>
                      <span class="ship-cost">{{ currency.format(499.00) }}</span>
                    </div>
                    <p>Delivered by dressed chauffeur in bespoke wooden keepsake trunk with personal fit inspection.</p>
                  </div>
                </label>
              </div>

              <div class="step-action-row">
                <button mat-button class="btn-back" (click)="step = 1">
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button
                  mat-raised-button
                  class="btn-continue gold-shimmer-btn"
                  id="step2-continue-btn"
                  (click)="step = 3"
                >
                  Continue to Payment
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>

            <!-- STEP 3: Payment Gateway -->
            <div class="form-step-pane" *ngIf="step === 3">
              <h4 class="step-heading">Select Payment Mode</h4>

              <div class="payment-tabs">
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'razorpay'"
                  (click)="paymentType = 'razorpay'"
                >
                  <mat-icon class="pay-icon">qr_code_2</mat-icon>
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'card'"
                  (click)="paymentType = 'card'"
                >
                  <mat-icon class="pay-icon">credit_card</mat-icon>
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'apple_pay'"
                  (click)="paymentType = 'apple_pay'"
                >
                  <mat-icon class="pay-icon">phone_iphone</mat-icon>
                  <span>Apple / Google Pay</span>
                </button>
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'netbanking'"
                  (click)="paymentType = 'netbanking'"
                >
                  <mat-icon class="pay-icon">account_balance</mat-icon>
                  <span>NetBanking</span>
                </button>
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'klarna'"
                  (click)="paymentType = 'klarna'"
                >
                  <mat-icon class="pay-icon">credit_score</mat-icon>
                  <span>Klarna BNPL</span>
                </button>
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'cod'"
                  (click)="paymentType = 'cod'"
                >
                  <mat-icon class="pay-icon">payments</mat-icon>
                  <span>Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  class="pay-tab"
                  [class.active]="paymentType === 'in_store'"
                  (click)="paymentType = 'in_store'"
                >
                  <mat-icon class="pay-icon">storefront</mat-icon>
                  <span>In-Store Pickup</span>
                </button>
              </div>

              <div class="wallet-box upi-qr-box" *ngIf="paymentType === 'razorpay'">
                <div class="qr-preview-frame">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=petitmaison@icici%26pn=PetitMaison%26am=1500" alt="UPI QR Code" class="qr-img" />
                </div>
                <div>
                  <strong>Instant UPI QR & Apps</strong>
                  <p>Scan with Google Pay, PhonePe, Paytm, or BHIM. Zero surcharge and instant confirmation with 256-bit encryption.</p>
                </div>
              </div>

              <div class="wallet-box" *ngIf="paymentType === 'apple_pay'">
                <mat-icon class="wallet-icon">phone_iphone</mat-icon>
                <div>
                  <strong>Apple Pay & Google Pay</strong>
                  <p>Biometric one-touch payment authorized via Touch ID, Face ID, or Google Wallet.</p>
                </div>
              </div>

              <div class="wallet-box" *ngIf="paymentType === 'klarna'">
                <mat-icon class="wallet-icon" style="color: #ffb3c7;">credit_score</mat-icon>
                <div>
                  <strong>Klarna Pay in 3 Interest-Free Installments</strong>
                  <p>Split your nursery order into 3 monthly payments of {{ currency.format(cart.finalTotal() / 3) }} with 0% APR.</p>
                </div>
              </div>

              <div class="wallet-box" *ngIf="paymentType === 'in_store'">
                <mat-icon class="wallet-icon" style="color: #7AA884;">storefront</mat-icon>
                <div>
                  <strong>In-Store Boutique Checkout & Pickup</strong>
                  <p>Pick up garments packaged in luxury nursery boxes at Paris Flagship or Milan counter. Pay cash or POS terminal.</p>
                </div>
              </div>

              <div class="wallet-box" *ngIf="paymentType === 'cod'">
                <mat-icon class="wallet-icon" style="color: #2E7D32;">payments</mat-icon>
                <p>Cash on Delivery (COD) eligible across 19,000+ Indian pincodes. Pay cash or scan QR code on arrival.</p>
              </div>

              <div class="wallet-box" *ngIf="paymentType === 'netbanking'">
                <mat-icon class="wallet-icon">account_balance</mat-icon>
                <p>Supports all major banks: SBI, HDFC, ICICI, Axis, Kotak Mahindra, BNP Paribas, Barclays with 3D Secure OTP.</p>
              </div>

              <div class="card-details-box" *ngIf="paymentType === 'card'">
                <div class="field full">
                  <label>Cardholder Name</label>
                  <input type="text" [(ngModel)]="parentName" placeholder="Name on card" />
                </div>
                <div class="field full">
                  <label>Card Number (RuPay, Visa, Mastercard)</label>
                  <div class="card-input-wrapper">
                    <input type="text" [(ngModel)]="cardNumber" placeholder="4242 •••• •••• 4242" />
                    <mat-icon class="card-chip-icon">credit_card</mat-icon>
                  </div>
                </div>
                <div class="field half">
                  <label>Expiry Date</label>
                  <input type="text" [(ngModel)]="cardExpiry" placeholder="MM / YY" />
                </div>
                <div class="field half">
                  <label>CVC / Security Code</label>
                  <input type="text" [(ngModel)]="cardCvc" placeholder="123" />
                </div>
              </div>

              <div class="wallet-box" *ngIf="paymentType === 'apple_pay'">
                <mat-icon class="wallet-icon">account_balance</mat-icon>
                <p>Supports all major Indian banks: SBI, HDFC, ICICI, Axis, Kotak Mahindra with 3D Secure OTP.</p>
              </div>

              <div class="step-action-row">
                <button mat-button class="btn-back" (click)="step = 2">
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button
                  mat-raised-button
                  class="btn-place-order gold-shimmer-btn"
                  id="place-order-submit-btn"
                  [disabled]="isSubmitting"
                  (click)="submitOrder()"
                >
                  <mat-icon *ngIf="!isSubmitting">lock</mat-icon>
                  <span *ngIf="!isSubmitting">Place Royal Heirloom Order • {{ cart.formattedTotal() }}</span>
                  <span *ngIf="isSubmitting">Authorizing Royal Order...</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary Review -->
          <div class="checkout-summary-col">
            <h4 class="summary-head">Order Review ({{ cart.itemCount() }} pieces)</h4>

            <div class="summary-items-list">
              <div class="summary-item" *ngFor="let item of cart.items()">
                <img [src]="item.image" [alt]="item.title" class="thumb" />
                <div class="s-info">
                  <span class="s-title">{{ item.title }}</span>
                  <span class="s-meta">{{ item.size }} • {{ item.color }} • Qty {{ item.quantity }}</span>
                  <span class="s-mono" *ngIf="item.monogram">
                    Monogram: "{{ item.monogram.text }}" ({{ item.monogram.font }})
                  </span>
                </div>
                <span class="s-price">
                  {{ currency.format((item.price + (item.monogram ? 8 : 0)) * item.quantity) }}
                </span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="summary-breakdown">
              <div class="row">
                <span>Subtotal</span>
                <span>{{ cart.formattedSubtotal() }}</span>
              </div>
              <div class="row discount" *ngIf="cart.discountAmount() > 0">
                <span>Savings ({{ cart.appliedCoupon()?.code }})</span>
                <span>-{{ cart.formattedDiscount() }}</span>
              </div>
              <div class="row" *ngIf="cart.giftWrapSelected()">
                <span>Gift Wrapping & Card</span>
                <span>+{{ cart.formattedGiftWrap() }}</span>
              </div>
              <div class="row">
                <span>Courier Delivery</span>
                <span>{{ cart.formattedShipping() }}</span>
              </div>
              <div class="row">
                <span>Tax</span>
                <span>{{ cart.formattedTax() }}</span>
              </div>
              <div class="row total">
                <span>Total Due ({{ currency.activeCurrency() }})</span>
                <span>{{ cart.formattedTotal() }}</span>
              </div>
            </div>

            <div class="trust-footer">
              <div class="trust-badge">
                <mat-icon class="shield-green">verified</mat-icon>
                <span>30-Day Happiness Guarantee • Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 58, 75, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10010;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .checkout-modal {
      background: #FFFFFF;
      border-radius: 28px;
      max-width: 1020px;
      width: 100%;
      max-height: 92vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalScale {
      from { transform: scale(0.95) translateY(16px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .modal-top {
      padding: 1.25rem 2rem;
      border-bottom: 1px solid #ECECEC;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .brand-crest-box {
        display: flex;
        align-items: center;
        gap: 12px;

        .brand-icon {
          color: var(--pm-primary, #4A5859);
          font-size: 28px;
          width: 28px;
          height: 28px;
        }

        h3 {
          font-family: var(--pm-font-serif, 'Playfair Display', serif);
          font-size: 1.2rem;
          margin: 0;
          color: #2D3A4B;
        }

        span {
          font-size: 0.6875rem;
          color: #71717A;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 600;
        }
      }

      .close-btn {
        background: #F4F4F5;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #71717A;

        &:hover {
          background: #E4E4E7;
          color: #1A1A1A;
        }
      }
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
    }

    .checkout-form-col {
      padding: 2rem;
      border-right: 1px solid #ECECEC;
      display: flex;
      flex-direction: column;
    }

    .step-nav {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.5rem;

      .step-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #E4E4E7;
          color: #71717A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .step-label {
          font-size: 0.8125rem;
          color: #71717A;
          font-weight: 600;
        }

        &.active {
          .step-num {
            background: var(--pm-primary, #4A5859);
            color: #FFFFFF;
          }
          .step-label {
            color: #2D3A4B;
          }
        }

        &.completed {
          .step-num {
            background: #2E7D32;
            color: #FFFFFF;
          }
        }
      }

      .step-divider {
        flex: 1;
        height: 1px;
        background: #E4E4E7;
      }
    }

    .autofill-banner {
      background: #F0F4F8;
      border: 1px solid #DCE6F1;
      padding: 8px 14px;
      border-radius: 10px;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #475569;

      .autofill-btn {
        background: var(--pm-primary, #4A5859);
        color: #FFFFFF;
        border: none;
        padding: 4px 12px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.75rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;

        .mini-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }

        &:hover {
          background: #3B4647;
        }
      }
    }

    .step-heading {
      font-family: var(--pm-font-serif, 'Playfair Display', serif);
      font-size: 1.25rem;
      color: #2D3A4B;
      margin: 0 0 1.25rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;

        &.full { grid-column: span 6; }
        &.half { grid-column: span 3; }
        &.third { grid-column: span 2; }

        label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #71717A;
        }

        input, select {
          border: 1px solid #D4D4D8;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.875rem;
          outline: none;

          &:focus {
            border-color: var(--pm-primary, #4A5859);
          }
        }

        .card-input-wrapper {
          position: relative;

          input {
            width: 100%;
            padding-right: 36px;
          }

          .card-chip-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #71717A;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .shipping-options-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .shipping-option-card {
        border: 1.5px solid #E4E4E7;
        border-radius: 12px;
        padding: 14px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        cursor: pointer;
        transition: all 0.2s;

        input[type="radio"] {
          margin-top: 3px;
          accent-color: var(--pm-primary, #4A5859);
        }

        .ship-details {
          flex: 1;

          .ship-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;

            strong {
              font-size: 0.875rem;
              color: #2D3A4B;
            }

            .ship-cost {
              font-weight: 700;
              color: #2E7D32;
              font-size: 0.875rem;
            }
          }

          p {
            font-size: 0.75rem;
            color: #71717A;
            margin: 0;
          }
        }

        &.selected {
          border-color: var(--pm-primary, #4A5859);
          background: #F0F4F8;
        }
      }
    }

    .payment-tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 1.25rem;

      .pay-tab {
        border: 1.5px solid #E4E4E7;
        background: #FFFFFF;
        border-radius: 10px;
        padding: 10px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        color: #71717A;

        .pay-icon {
          font-size: 22px;
          width: 22px;
          height: 22px;
        }

        &.active {
          border-color: var(--pm-primary, #4A5859);
          color: var(--pm-primary, #4A5859);
          background: #F0F4F8;
        }
      }
    }

    .card-details-box {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
      background: #FAFAFA;
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid #ECECEC;

      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;

        &.full { grid-column: span 6; }
        &.half { grid-column: span 3; }

        label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #71717A;
        }

        input {
          border: 1px solid #D4D4D8;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.875rem;
          outline: none;
        }

        .card-input-wrapper {
          position: relative;
          input { width: 100%; }
          .card-chip-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #71717A;
          }
        }
      }
    }

    .wallet-box {
      background: #FAFAFA;
      padding: 2rem 1.5rem;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #ECECEC;

      .wallet-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: var(--pm-primary, #4A5859);
        margin-bottom: 8px;
      }

      p {
        font-size: 0.875rem;
        color: #71717A;
        margin: 0;
      }
    }

    .step-action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid #ECECEC;

      .btn-back {
        color: #71717A;
        font-weight: 600;
      }

      .btn-continue, .btn-place-order {
        background: var(--pm-primary, #4A5859) !important;
        color: #FFFFFF !important;
        padding: 12px 24px !important;
        border-radius: 12px !important;
        font-weight: 700 !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;

        &:disabled {
          background: #D4D4D8 !important;
          color: #71717A !important;
        }
      }

      .btn-place-order {
        background: #2D3A4B !important;
        padding: 14px 28px !important;
        font-size: 1rem !important;
        box-shadow: 0 6px 20px rgba(45, 58, 75, 0.3) !important;
      }
    }

    .checkout-summary-col {
      padding: 2rem;
      background: #FDFBF7;
      display: flex;
      flex-direction: column;
    }

    .summary-head {
      font-family: var(--pm-font-serif, 'Playfair Display', serif);
      font-size: 1.15rem;
      color: #2D3A4B;
      margin: 0 0 1rem 0;
    }

    .summary-items-list {
      max-height: 260px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 1.5rem;
      padding-right: 6px;

      .summary-item {
        display: flex;
        gap: 10px;
        align-items: center;

        .thumb {
          width: 50px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          background: #EAE5DF;
        }

        .s-info {
          flex: 1;
          display: flex;
          flex-direction: column;

          .s-title {
            font-size: 0.8125rem;
            font-weight: 700;
            color: #2D3A4B;
          }

          .s-meta {
            font-size: 0.6875rem;
            color: #71717A;
          }

          .s-mono {
            font-size: 0.6875rem;
            color: #B85D36;
            font-weight: 600;
          }
        }

        .s-price {
          font-weight: 700;
          font-size: 0.875rem;
          color: #2D3A4B;
        }
      }
    }

    .summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 1rem;
      border-top: 1px solid #ECECEC;

      .row {
        display: flex;
        justify-content: space-between;
        font-size: 0.8125rem;
        color: #71717A;

        &.discount {
          color: #2E7D32;
          font-weight: 600;
        }

        &.total {
          font-size: 1.125rem;
          font-weight: 800;
          color: #2D3A4B;
          padding-top: 8px;
          margin-top: 4px;
          border-top: 1px solid #ECECEC;
        }
      }
    }

    .trust-footer {
      margin-top: auto;
      padding-top: 1.5rem;

      .trust-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: #52525B;

        .shield-green {
          color: #2E7D32;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    @media (max-width: 850px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }
      .checkout-form-col {
        border-right: none;
        border-bottom: 1px solid #ECECEC;
      }
    }
  `]
})
export class CheckoutModalComponent {
  cart = inject(CartService);
  api = inject(ApiService);
  currency = inject(CurrencyService);
  membership = inject(MembershipService);

  close = output<void>();
  orderCompleted = output<OrderConfirmation>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  step = 1;
  isSubmitting = false;

  // Form Fields
  parentName = '';
  email = '';
  phone = '';
  childName = '';
  childAge = '';
  address = '';
  city = '';
  postalCode = '';
  country = 'India';

  shippingMethod = 'dhl_express';
  paymentType: 'card' | 'apple_pay' | 'razorpay' | 'cod' | 'netbanking' | 'klarna' | 'in_store' = 'razorpay';

  cardNumber = '4242 •••• •••• 4242';
  cardExpiry = '08 / 28';
  cardCvc = '888';

  autofillTestData(): void {
    this.parentName = 'Ananya Sharma';
    this.email = 'ananya.sharma@couture-patron.in';
    this.phone = '+91 98765 43210';
    this.childName = 'Baby Aarav';
    this.childAge = '8 Months (Shishu)';
    this.address = 'Bungalow 9, Golf Links';
    this.city = 'New Delhi';
    this.postalCode = '110003';
    this.country = 'India';
  }

  submitOrder(): void {
    this.isSubmitting = true;

    const orderPayload = {
      customer_name: this.parentName,
      customer_email: this.email,
      customer_phone: this.phone,
      child_name: this.childName,
      shipping_address: `${this.address}, ${this.city}, ${this.postalCode}, ${this.country}`,
      gift_wrap_selected: this.cart.giftWrapSelected(),
      gift_note: this.cart.giftNote(),
      coupon_code: this.cart.appliedCoupon()?.code || '',
      subtotal: this.cart.rawSubtotal(),
      discount_amount: this.cart.discountAmount(),
      shipping_cost: this.shippingMethod === 'royal_white_glove' ? 499.00 : this.cart.shippingCost(),
      tax_amount: this.cart.estimatedTax(),
      total_amount: this.cart.finalTotal() + (this.shippingMethod === 'royal_white_glove' ? 499.00 : 0),
      items: this.cart.items().map(i => ({
        product_sku: i.sku,
        product_title: i.title,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unit_price: i.price,
        monogram_text: i.monogram?.text || '',
        monogram_thread: i.monogram?.threadColor || '',
        monogram_font: i.monogram?.font || ''
      }))
    };

    this.api.submitOrder(orderPayload).subscribe({
      next: (res) => {
        const confirmation: OrderConfirmation = {
          order_number: res.order_number,
          customer_name: this.parentName,
          customer_email: this.email,
          child_name: this.childName,
          gift_note: this.cart.giftNote(),
          gift_wrap_selected: this.cart.giftWrapSelected(),
          subtotal: this.cart.rawSubtotal(),
          discount_amount: this.cart.discountAmount(),
          shipping_cost: this.shippingMethod === 'royal_white_glove' ? 499.00 : this.cart.shippingCost(),
          tax_amount: this.cart.estimatedTax(),
          total_amount: this.cart.finalTotal() + (this.shippingMethod === 'royal_white_glove' ? 499.00 : 0),
          shipping_method: this.shippingMethod === 'royal_white_glove' ? 'Same-Day Royal Chauffeur Delivery' : 'Bluedart Air Express (2 - 3 Days)',
          carrier: 'Bluedart Luxury Express',
          tracking_number: res.tracking_number || `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`,
          created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          estimated_delivery: '2-3 Business Days (Express)',
          items: [...this.cart.items()]
        };

        this.cart.clearCart();
        this.isSubmitting = false;
        this.orderCompleted.emit(confirmation);
        this.close.emit();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
