import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderConfirmation } from '../../models/kids.model';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-order-receipt-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="receipt-backdrop" *ngIf="order()" (click)="close.emit()">
      <div class="receipt-dialog" (click)="$event.stopPropagation()">
        <!-- Close -->
        <button class="close-btn" (click)="close.emit()" aria-label="Close receipt">
          <mat-icon>close</mat-icon>
        </button>

        <div class="receipt-container" *ngIf="order() as o">
          <!-- Heirloom Seal Header -->
          <div class="seal-header">
            <div class="heirloom-crest">
              <mat-icon class="crown-icon">child_care</mat-icon>
            </div>
            <h2 class="brand-title">PETIT MAISON KIDS</h2>
            <p class="certificate-subtitle">ARCHIVAL HEIRLOOM PURCHASE CERTIFICATE & INVOICE</p>
            <div class="order-id-badge">Order {{ o.order_number }}</div>
          </div>

          <!-- Status Message -->
          <div class="success-banner">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <div>
              <h3>Thank You, {{ o.customer_name }}!</h3>
              <p>Your little one's heirloom order has been cataloged in our nursery atelier ledger.</p>
            </div>
          </div>

          <!-- Courier Timeline Milestone Tracker -->
          <div class="courier-tracker-card">
            <div class="tracker-top">
              <div class="carrier-info">
                <span class="carrier-name">{{ o.carrier }}</span>
                <span class="track-code">Waybill # {{ o.tracking_number }}</span>
              </div>
              <button class="copy-track-btn" (click)="copyTracking(o.tracking_number)">
                <mat-icon class="mini-icon">content_copy</mat-icon> Copy Tracking
              </button>
            </div>

            <div class="timeline-nodes">
              <div class="node active">
                <div class="node-circle"><mat-icon>receipt</mat-icon></div>
                <span class="node-title">Order Confirmed</span>
                <span class="node-date">Today</span>
              </div>
              <div class="node-line active"></div>
              <div class="node active">
                <div class="node-circle"><mat-icon>brush</mat-icon></div>
                <span class="node-title">Monogram Atelier</span>
                <span class="node-date">In Process</span>
              </div>
              <div class="node-line"></div>
              <div class="node">
                <div class="node-circle"><mat-icon>local_shipping</mat-icon></div>
                <span class="node-title">Express Dispatch</span>
                <span class="node-date">Tomorrow</span>
              </div>
              <div class="node-line"></div>
              <div class="node">
                <div class="node-circle"><mat-icon>home</mat-icon></div>
                <span class="node-title">Delivered</span>
                <span class="node-date">{{ o.estimated_delivery }}</span>
              </div>
            </div>
          </div>

          <!-- Handwritten Keepsake Note Card (If Present) -->
          <div class="gift-keepsake-note-card" *ngIf="o.gift_note">
            <div class="note-top">
              <mat-icon class="quill-icon">edit_note</mat-icon>
              <span>Accompanying Handwritten Keepsake Note</span>
            </div>
            <p class="note-quote">"{{ o.gift_note }}"</p>
            <span class="child-dest" *ngIf="o.child_name">Crafted with love for <strong>{{ o.child_name }}</strong></span>
          </div>

          <!-- Itemized Breakdown -->
          <div class="items-table-section">
            <h4 class="table-head">Archived Garments</h4>
            <div class="item-receipt-row" *ngFor="let item of o.items">
              <img [src]="item.image" [alt]="item.title" class="thumb" />
              <div class="receipt-item-info">
                <strong class="item-title">{{ item.title }}</strong>
                <span class="item-sub">{{ item.size }} • {{ item.color }} (Qty: {{ item.quantity }})</span>
                <span class="item-mono" *ngIf="item.monogram">
                  Embroidered Monogram: "{{ item.monogram.text }}" in {{ item.monogram.threadColor }} ({{ item.monogram.font }})
                </span>
              </div>
              <span class="item-total-price">
                {{ currency.format((item.price + (item.monogram ? 8 : 0)) * item.quantity) }}
              </span>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="totals-summary-card">
            <div class="t-row">
              <span>Subtotal</span>
              <span>{{ currency.format(o.subtotal) }}</span>
            </div>
            <div class="t-row discount" *ngIf="o.discount_amount > 0">
              <span>Special Promotion Discount</span>
              <span>-{{ currency.format(o.discount_amount) }}</span>
            </div>
            <div class="t-row" *ngIf="o.gift_wrap_selected">
              <span>Heirloom Satin Box & Card</span>
              <span>+{{ currency.format(5.00) }}</span>
            </div>
            <div class="t-row">
              <span>Shipping & Handling ({{ o.shipping_method }})</span>
              <span>{{ o.shipping_cost === 0 ? 'FREE' : currency.format(o.shipping_cost) }}</span>
            </div>
            <div class="t-row">
              <span>Estimated Sales Tax</span>
              <span>{{ currency.format(o.tax_amount) }}</span>
            </div>
            <div class="t-row final">
              <span>Total Paid ({{ currency.activeCurrency() }})</span>
              <span>{{ currency.format(o.total_amount) }}</span>
            </div>
          </div>

          <!-- Receipt Actions -->
          <div class="receipt-actions">
            <button mat-stroked-button class="print-btn" (click)="printReceipt()">
              <mat-icon>print</mat-icon>
              Print Archival Certificate
            </button>
            <button mat-raised-button class="continue-btn" (click)="close.emit()">
              Continue Browsing Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .receipt-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 58, 75, 0.8);
      backdrop-filter: blur(8px);
      z-index: 10015;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .receipt-dialog {
      background: #FFFFFF;
      border-radius: 28px;
      max-width: 720px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      padding: 2.5rem;
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #F4F4F5;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #71717A;
    }

    .seal-header {
      text-align: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #ECECEC;
      padding-bottom: 1.5rem;

      .heirloom-crest {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #FDFBF7;
        border: 2px solid var(--pm-accent, #E0A96D);
        margin: 0 auto 10px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--pm-primary, #4A5859);

        .crown-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
      }

      .brand-title {
        font-family: var(--pm-font-serif, 'Playfair Display', serif);
        font-size: 1.5rem;
        letter-spacing: 2px;
        margin: 0 0 4px 0;
        color: #2D3A4B;
      }

      .certificate-subtitle {
        font-size: 0.6875rem;
        letter-spacing: 2px;
        color: #71717A;
        font-weight: 700;
        margin: 0 0 12px 0;
      }

      .order-id-badge {
        display: inline-block;
        background: #F0F4F8;
        color: var(--pm-primary, #4A5859);
        font-size: 0.8125rem;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 999px;
        font-family: monospace;
      }
    }

    .success-banner {
      background: #E8F5E9;
      border: 1px solid #C8E6C9;
      border-radius: 14px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.5rem;

      .success-icon {
        color: #2E7D32;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      h3 {
        font-size: 1rem;
        margin: 0 0 2px 0;
        color: #1B5E20;
      }

      p {
        font-size: 0.8125rem;
        color: #2E7D32;
        margin: 0;
      }
    }

    .courier-tracker-card {
      background: #FDFBF7;
      border: 1px solid #EAE5DF;
      border-radius: 16px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;

      .tracker-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;

        .carrier-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: #2D3A4B;
          display: block;
        }

        .track-code {
          font-size: 0.75rem;
          color: #71717A;
          font-family: monospace;
        }

        .copy-track-btn {
          background: #FFFFFF;
          border: 1px solid #D4D4D8;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;

          .mini-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .timeline-nodes {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;

          .node-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #E4E4E7;
            color: #71717A;
            display: flex;
            align-items: center;
            justify-content: center;

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
            }
          }

          .node-title {
            font-size: 0.6875rem;
            font-weight: 700;
            color: #71717A;
          }

          .node-date {
            font-size: 0.625rem;
            color: #A1A1AA;
          }

          &.active {
            .node-circle {
              background: #2E7D32;
              color: #FFFFFF;
            }
            .node-title {
              color: #2D3A4B;
            }
          }
        }

        .node-line {
          flex: 1;
          height: 2px;
          background: #E4E4E7;
          margin: 0 6px;
          margin-bottom: 24px;

          &.active {
            background: #2E7D32;
          }
        }
      }
    }

    .gift-keepsake-note-card {
      background: #FFFDF9;
      border: 1px dashed var(--pm-accent, #E0A96D);
      border-radius: 14px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;

      .note-top {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #78350F;
        margin-bottom: 6px;

        .quill-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .note-quote {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-size: 1rem;
        color: #2D3A4B;
        line-height: 1.5;
        margin: 0 0 6px 0;
      }

      .child-dest {
        font-size: 0.75rem;
        color: #71717A;
      }
    }

    .items-table-section {
      margin-bottom: 1.5rem;

      .table-head {
        font-size: 0.875rem;
        font-weight: 700;
        color: #71717A;
        text-transform: uppercase;
        margin: 0 0 10px 0;
      }

      .item-receipt-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #F4F4F5;

        .thumb {
          width: 44px;
          height: 52px;
          border-radius: 6px;
          object-fit: cover;
        }

        .receipt-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;

          .item-title {
            font-size: 0.8125rem;
            color: #2D3A4B;
          }

          .item-sub {
            font-size: 0.6875rem;
            color: #71717A;
          }

          .item-mono {
            font-size: 0.6875rem;
            color: #B85D36;
            font-weight: 600;
          }
        }

        .item-total-price {
          font-size: 0.875rem;
          font-weight: 700;
          color: #2D3A4B;
        }
      }
    }

    .totals-summary-card {
      background: #FAFAFA;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 1.5rem;

      .t-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.8125rem;
        color: #71717A;

        &.discount {
          color: #2E7D32;
        }

        &.final {
          font-size: 1.125rem;
          font-weight: 800;
          color: #2D3A4B;
          padding-top: 8px;
          margin-top: 4px;
          border-top: 1px solid #ECECEC;
        }
      }
    }

    .receipt-actions {
      display: flex;
      gap: 1rem;

      .print-btn {
        flex: 1;
        border-radius: 12px;
        padding: 12px !important;
        font-weight: 700;
      }

      .continue-btn {
        flex: 1;
        background: var(--pm-primary, #4A5859) !important;
        color: #FFFFFF !important;
        border-radius: 12px;
        padding: 12px !important;
        font-weight: 700;
      }
    }
  `]
})
export class OrderReceiptModalComponent {
  currency = inject(CurrencyService);
  order = input<OrderConfirmation | null>(null);
  close = output<void>();

  copyTracking(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      alert('Tracking waybill copied to clipboard: ' + code);
    }
  }

  printReceipt(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
