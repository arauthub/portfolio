import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PosService } from '../../services/pos.service';
import { CurrencyService } from '../../services/currency.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-in-store-pos-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (pos.isPosModalOpen()) {
      <div class="pos-backdrop" (click)="pos.closePos()">
        <div class="pos-terminal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <!-- Terminal Header -->
          <div class="pos-header">
            <div class="header-left">
              <span class="pos-badge">PETIT MAISON RETAIL POS 2026</span>
              <h3>{{ pos.activeRegister().store_name }}</h3>
              <span class="sub">Register: <strong>{{ pos.activeRegister().register_code }}</strong> • Cashier: <strong>{{ pos.activeRegister().cashier_active }}</strong></span>
            </div>
            
            <div class="header-actions">
              <button class="close-btn" (click)="pos.closePos()">✕ Close Terminal</button>
            </div>
          </div>

          <!-- Main Terminal Layout: Two Panes (Folding & Desktop Friendly) -->
          <div class="terminal-body">
            
            <!-- Left Pane: Catalog Fast-Add & Barcode Input -->
            <div class="pane-left">
              <div class="barcode-quick-add">
                <input 
                  type="text" 
                  [(ngModel)]="barcodeInput" 
                  (keyup.enter)="scanBarcode(barcodeInput)"
                  placeholder="Scan Garment Barcode (e.g. 890987650001) or SKU..." 
                  class="barcode-input" />
                <button class="quick-add-btn" (click)="scanBarcode(barcodeInput)">+ Ring Item</button>
              </div>

              <!-- Quick Click Items -->
              <div class="quick-catalog-grid">
                <button class="quick-item-card" (click)="ringPreset('PMK-ROMP-001')">
                  <strong>PMK-ROMP-001</strong>
                  <span>Organic Cloud Romper</span>
                  <span class="price">{{ currency.format(48) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('PMK-SIB-005')">
                  <strong>PMK-SIB-005</strong>
                  <span>Sibling Linen Set</span>
                  <span class="price">{{ currency.format(92) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('PMK-SWT-004')">
                  <strong>PMK-SWT-004</strong>
                  <span>Merino Cardigan</span>
                  <span class="price">{{ currency.format(84) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('PMK-DRS-003')">
                  <strong>PMK-DRS-003</strong>
                  <span>Meadow Bloom Dress</span>
                  <span class="price">{{ currency.format(78) }}</span>
                </button>
              </div>

              @if (scanStatusMsg) {
                <div class="scan-status-alert">{{ scanStatusMsg }}</div>
              }
            </div>

            <!-- Right Pane: Live Transaction Ticket & Checkout Ledger -->
            <div class="pane-right">
              <div class="ticket-header">
                <h4>Active Register Ticket</h4>
                <button class="clear-btn" (click)="pos.clearCart()" [disabled]="pos.posItems().length === 0">Clear Ticket</button>
              </div>

              <!-- Customer Info -->
              <div class="guest-info-row">
                <input type="text" [ngModel]="pos.customerName()" (ngModelChange)="pos.customerName.set($event)" placeholder="Customer Name" class="cust-input" />
                <input type="tel" [ngModel]="pos.customerPhone()" (ngModelChange)="pos.customerPhone.set($event)" placeholder="Phone (Receipt SMS)" class="cust-input" />
              </div>

              <!-- Ticket Items List -->
              <div class="ticket-items">
                @if (pos.posItems().length === 0) {
                  <div class="empty-ticket">
                    <span class="material-symbols-outlined icon">receipt_long</span>
                    <span>No garments rung up. Scan barcode to begin retail checkout.</span>
                  </div>
                }

                @for (item of pos.posItems(); track $index) {
                  <div class="ticket-item-row">
                    <div class="item-name">
                      <strong>{{ item.product?.sku }}</strong> • {{ item.product?.title }}
                      <span class="meta">Size {{ item.selectedSize }}</span>
                    </div>
                    <div class="item-calc">
                      <div class="qty-stepper">
                        <button (click)="pos.updateQuantity($index, -1)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button (click)="pos.updateQuantity($index, 1)">+</button>
                      </div>
                      <span class="row-total">{{ currency.format((item.product?.price || 0) * item.quantity) }}</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Totals Ledger -->
              <div class="ledger-box">
                <div class="ledger-row">
                  <span>Subtotal</span>
                  <span>{{ currency.format(pos.subtotal()) }}</span>
                </div>
                <div class="ledger-row">
                  <span>Reduced Nursery Tax (5%)</span>
                  <span>{{ currency.format(pos.tax()) }}</span>
                </div>
                <div class="ledger-row total">
                  <span>Total Due</span>
                  <span>{{ currency.format(pos.total()) }}</span>
                </div>
              </div>

              <!-- Payment Method Selection -->
              <div class="payment-types-bar">
                <button [class.active]="pos.selectedPaymentType() === 'IN_STORE_CASH'" (click)="pos.selectedPaymentType.set('IN_STORE_CASH')">Cash</button>
                <button [class.active]="pos.selectedPaymentType() === 'IN_STORE_TERMINAL'" (click)="pos.selectedPaymentType.set('IN_STORE_TERMINAL')">POS Terminal</button>
                <button [class.active]="pos.selectedPaymentType() === 'UPI_QR'" (click)="pos.selectedPaymentType.set('UPI_QR')">UPI QR</button>
                <button [class.active]="pos.selectedPaymentType() === 'STRIPE'" (click)="pos.selectedPaymentType.set('STRIPE')">Card</button>
              </div>

              @if (pos.selectedPaymentType() === 'IN_STORE_CASH') {
                <div class="cash-calc-row">
                  <label>Cash Tendered:</label>
                  <input type="number" [ngModel]="pos.cashGiven()" (ngModelChange)="pos.cashGiven.set($event)" class="cash-input" />
                  <span class="change-tag">Change Due: <strong>{{ currency.format(pos.changeDue()) }}</strong></span>
                </div>
              }

              <!-- Checkout Submit Button -->
              <button 
                class="complete-order-btn" 
                (click)="pos.completeTransaction()" 
                [disabled]="pos.posItems().length === 0">
                Complete In-Store Checkout ({{ currency.format(pos.total()) }})
              </button>

            </div>
          </div>

          <!-- Printable Thermal Receipt Modal -->
          @if (pos.lastReceipt()) {
            <div class="receipt-overlay" (click)="pos.lastReceipt.set(null)">
              <div class="receipt-paper" (click)="$event.stopPropagation()">
                <div class="receipt-header">
                  <h3>PETIT MAISON NURSERY</h3>
                  <p>{{ pos.lastReceipt().register.store_name }}</p>
                  <p>{{ pos.lastReceipt().register.city }}, {{ pos.lastReceipt().register.country }}</p>
                  <p>Receipt: <strong>{{ pos.lastReceipt().receipt_number }}</strong></p>
                  <p>Date: {{ pos.lastReceipt().timestamp }}</p>
                  <p>Cashier: {{ pos.lastReceipt().register.cashier_active }}</p>
                </div>

                <div class="receipt-divider">--------------------------------</div>

                <div class="receipt-items-list">
                  @for (it of pos.lastReceipt().items; track $index) {
                    <div class="r-item-line">
                      <span>{{ it.quantity }}x {{ it.product?.title }} ({{ it.selectedSize }})</span>
                      <span>{{ currency.format((it.product?.price || 0) * it.quantity) }}</span>
                    </div>
                  }
                </div>

                <div class="receipt-divider">--------------------------------</div>

                <div class="receipt-totals">
                  <div class="r-row"><span>Subtotal:</span><span>{{ currency.format(pos.lastReceipt().subtotal) }}</span></div>
                  <div class="r-row"><span>Tax (5%):</span><span>{{ currency.format(pos.lastReceipt().tax) }}</span></div>
                  <div class="r-row total"><span>TOTAL:</span><span>{{ currency.format(pos.lastReceipt().total) }}</span></div>
                  <div class="r-row"><span>Method:</span><span>{{ pos.lastReceipt().payment_gateway }}</span></div>
                  @if (pos.lastReceipt().cash_given) {
                    <div class="r-row"><span>Tendered:</span><span>{{ currency.format(pos.lastReceipt().cash_given) }}</span></div>
                    <div class="r-row"><span>Change:</span><span>{{ currency.format(pos.lastReceipt().change_due) }}</span></div>
                  }
                </div>

                <div class="receipt-footer">
                  <p>Merci for cherishing your family at Petit Maison!</p>
                  <p>30-Day Pure Organic Guarantee</p>
                </div>

                <div class="receipt-buttons">
                  <button class="print-btn" (click)="printReceipt()">Print Receipt</button>
                  <button class="dismiss-btn" (click)="pos.lastReceipt.set(null)">New Sale</button>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .pos-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 39, 32, 0.85);
      backdrop-filter: blur(10px);
      z-index: 1300;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .pos-terminal {
      background: #FAF6EE;
      color: #2b3a32;
      width: 95vw;
      max-width: 1040px;
      max-height: 92vh;
      overflow-y: auto;
      border-radius: 20px;
      border: 1px solid rgba(122, 168, 132, 0.3);
      box-shadow: 0 35px 90px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
    }

    .pos-header {
      background: #2b3a32;
      color: #FAF6EE;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .pos-badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #7AA884;
        text-transform: uppercase;
      }

      h3 { margin: 2px 0; font-size: 1.25rem; }
      .sub { font-size: 0.75rem; color: rgba(250, 246, 238, 0.7); }

      .close-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.78rem;
        cursor: pointer;
        &:hover { background: rgba(255, 255, 255, 0.2); }
      }
    }

    .terminal-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 24px;
    }

    .barcode-quick-add {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;

      .barcode-input {
        flex: 1;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 0.85rem;
        outline: none;
        &:focus { border-color: #7AA884; }
      }

      .quick-add-btn {
        background: #7AA884;
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.8rem;
        cursor: pointer;
        &:hover { background: #679270; }
      }
    }

    .quick-catalog-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 16px;

      .quick-item-card {
        background: white;
        border: 1px solid #E5DFD5;
        border-radius: 10px;
        padding: 12px;
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        transition: all 0.2s ease;

        &:hover {
          border-color: #7AA884;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        strong { font-size: 0.78rem; color: #7AA884; }
        span { font-size: 0.82rem; margin: 2px 0 6px; color: #2b3a32; font-weight: 600; }
        .price { font-size: 0.9rem; font-weight: 800; color: #2b3a32; }
      }
    }

    .scan-status-alert {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
    }

    .pane-right {
      display: flex;
      flex-direction: column;
      background: white;
      border: 1px solid #E5DFD5;
      border-radius: 14px;
      padding: 16px;

      .ticket-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        h4 { margin: 0; font-size: 1rem; font-weight: 800; }
        .clear-btn {
          background: none;
          border: none;
          color: #d9534f;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          &:disabled { color: #ccc; cursor: not-allowed; }
        }
      }

      .guest-info-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;

        .cust-input {
          padding: 7px 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 0.78rem;
          outline: none;
          &:focus { border-color: #7AA884; }
        }
      }

      .ticket-items {
        flex: 1;
        min-height: 140px;
        max-height: 220px;
        overflow-y: auto;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 8px 0;
        margin-bottom: 12px;

        .empty-ticket {
          text-align: center;
          color: #999;
          font-size: 0.78rem;
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          .icon { font-size: 28px; }
        }

        .ticket-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 0.78rem;

          .item-name {
            strong { color: #7AA884; }
            .meta { display: block; font-size: 0.7rem; color: #888; }
          }

          .item-calc {
            display: flex;
            align-items: center;
            gap: 10px;

            .qty-stepper {
              display: flex;
              align-items: center;
              gap: 4px;

              button {
                width: 22px;
                height: 22px;
                border-radius: 4px;
                border: 1px solid #ccc;
                background: #f7f7f7;
                cursor: pointer;
                font-size: 0.8rem;
              }

              span { font-weight: 700; width: 16px; text-align: center; }
            }

            .row-total {
              font-weight: 800;
              width: 50px;
              text-align: right;
            }
          }
        }
      }

      .ledger-box {
        margin-bottom: 12px;
        .ledger-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          padding: 3px 0;
          color: #666;

          &.total {
            font-size: 1rem;
            font-weight: 800;
            color: #2b3a32;
            border-top: 1px solid #eee;
            padding-top: 6px;
            margin-top: 4px;
          }
        }
      }

      .payment-types-bar {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        margin-bottom: 12px;

        button {
          padding: 7px 4px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          border: 1px solid #ddd;
          background: #f9f9f9;
          cursor: pointer;

          &.active {
            background: #2b3a32;
            color: white;
            border-color: #2b3a32;
          }
        }
      }

      .cash-calc-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 0.78rem;

        .cash-input {
          width: 80px;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 0.85rem;
        }

        .change-tag {
          font-size: 0.8rem;
          color: #2e7d32;
          strong { font-weight: 800; }
        }
      }

      .complete-order-btn {
        width: 100%;
        background: #FF9F1C;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-weight: 800;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover { background: #e08b15; }
        &:disabled { background: #ccc; cursor: not-allowed; }
      }
    }

    .receipt-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 1400;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .receipt-paper {
      background: white;
      color: #111;
      width: 300px;
      padding: 24px 20px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.78rem;
      border-radius: 6px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

      .receipt-header {
        text-align: center;
        h3 { margin: 0 0 4px; font-size: 1rem; }
        p { margin: 2px 0; font-size: 0.72rem; }
      }

      .receipt-divider {
        text-align: center;
        margin: 8px 0;
        color: #888;
      }

      .receipt-items-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        .r-item-line {
          display: flex;
          justify-content: space-between;
        }
      }

      .receipt-totals {
        display: flex;
        flex-direction: column;
        gap: 3px;
        .r-row {
          display: flex;
          justify-content: space-between;
          &.total { font-weight: 800; font-size: 0.95rem; }
        }
      }

      .receipt-footer {
        text-align: center;
        margin-top: 14px;
        font-size: 0.7rem;
        p { margin: 2px 0; }
      }

      .receipt-buttons {
        display: flex;
        gap: 8px;
        margin-top: 16px;

        .print-btn, .dismiss-btn {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .print-btn {
          background: #2b3a32;
          color: white;
          border: none;
        }

        .dismiss-btn {
          background: #eee;
          border: 1px solid #ccc;
        }
      }
    }

    @media (max-width: 820px) {
      .terminal-body {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InStorePosModalComponent {
  pos = inject(PosService);
  currency = inject(CurrencyService);
  api = inject(ApiService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.pos.isPosModalOpen()) {
      this.pos.closePos();
    }
  }

  barcodeInput = '';
  scanStatusMsg = '';

  scanBarcode(code: string): void {
    if (!code) return;
    this.api.lookupBarcode(code).subscribe(res => {
      if (res.success && res.product) {
        this.pos.addItemByProduct(res.product);
        this.scanStatusMsg = `Rung up: ${res.product.title}`;
        this.barcodeInput = '';
      } else {
        this.scanStatusMsg = `Garment '${code}' not found.`;
      }
    });
  }

  ringPreset(sku: string): void {
    this.scanBarcode(sku);
  }

  printReceipt(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
