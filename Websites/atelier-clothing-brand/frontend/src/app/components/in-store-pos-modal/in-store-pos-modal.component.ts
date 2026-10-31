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
              <span class="pos-badge">ATELIER RETAIL POS 2026</span>
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
                  placeholder="Scan Garment Barcode (e.g. 890123450001) or SKU..." 
                  class="barcode-input" />
                <button class="quick-add-btn" (click)="scanBarcode(barcodeInput)">+ Ring Item</button>
              </div>

              <!-- Quick Click Runway Items -->
              <div class="quick-catalog-grid">
                <button class="quick-item-card" (click)="ringPreset('AV-OTR-001')">
                  <strong>AV-OTR-001</strong>
                  <span>Cashmere Trench</span>
                  <span class="price">{{ currency.format(890) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('AV-OTR-002')">
                  <strong>AV-OTR-002</strong>
                  <span>Hourglass Blazer</span>
                  <span class="price">{{ currency.format(540) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('AV-EVN-003')">
                  <strong>AV-EVN-003</strong>
                  <span>Silk Evening Gown</span>
                  <span class="price">{{ currency.format(1180) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('AV-KNIT-004')">
                  <strong>AV-KNIT-004</strong>
                  <span>Alpaca Sweater</span>
                  <span class="price">{{ currency.format(380) }}</span>
                </button>
                <button class="quick-item-card" (click)="ringPreset('PMK-ROMP-001')">
                  <strong>PMK-ROMP-001</strong>
                  <span>Kids Romper</span>
                  <span class="price">{{ currency.format(48) }}</span>
                </button>
              </div>
            </div>

            <!-- Right Pane: Active Ticket & Tender -->
            <div class="pane-right">
              <div class="ticket-header">
                <h4>Active Register Ticket</h4>
                <button class="clear-btn" (click)="pos.clearCart()">Clear Ticket</button>
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
                  <span>Estimated Tax (8%)</span>
                  <span>{{ currency.format(pos.tax()) }}</span>
                </div>
                <div class="ledger-row total">
                  <span>TOTAL DUE</span>
                  <span class="total-val">{{ currency.format(pos.total()) }}</span>
                </div>
              </div>

              <!-- Payment Tender Selector -->
              <div class="tender-options">
                <label>Payment Tender</label>
                <div class="tender-btns">
                  <button 
                    type="button"
                    class="tender-btn" 
                    [class.active]="pos.selectedPaymentType() === 'IN_STORE_CASH'" 
                    (click)="pos.selectedPaymentType.set('IN_STORE_CASH')">
                    Cash Register
                  </button>
                  <button 
                    type="button"
                    class="tender-btn" 
                    [class.active]="pos.selectedPaymentType() === 'IN_STORE_TERMINAL'" 
                    (click)="pos.selectedPaymentType.set('IN_STORE_TERMINAL')">
                    Terminal Swipe
                  </button>
                  <button 
                    type="button"
                    class="tender-btn" 
                    [class.active]="pos.selectedPaymentType() === 'UPI_QR'" 
                    (click)="pos.selectedPaymentType.set('UPI_QR')">
                    UPI Instant QR
                  </button>
                </div>
              </div>

              @if (pos.selectedPaymentType() === 'IN_STORE_CASH') {
                <div class="cash-calc-box">
                  <div class="cash-row">
                    <label>Cash Tendered:</label>
                    <input type="number" [ngModel]="pos.cashGiven()" (ngModelChange)="pos.cashGiven.set($event)" class="cash-input" />
                  </div>
                  <div class="change-row">
                    <span>Change Due to Client:</span>
                    <strong class="change-val">{{ currency.format(pos.changeDue()) }}</strong>
                  </div>
                </div>
              }

              <button 
                class="checkout-submit-btn" 
                [disabled]="pos.posItems().length === 0"
                (click)="pos.completeTransaction()">
                Tender Payment & Print Thermal Receipt
              </button>
            </div>

          </div>

          <!-- Printable Thermal Receipt View -->
          @if (pos.lastReceipt()) {
            <div class="receipt-overlay">
              <div class="thermal-receipt">
                <div class="receipt-brand">ATELIER VOGUE</div>
                <div class="receipt-store">{{ pos.lastReceipt().register.store_name }}</div>
                <div class="receipt-meta">{{ pos.lastReceipt().timestamp }}</div>
                <div class="receipt-meta">Ticket: {{ pos.lastReceipt().receipt_number }} • Cashier: {{ pos.lastReceipt().register.cashier_active }}</div>
                
                <div class="receipt-divider">--------------------------------</div>
                
                <div class="receipt-items-list">
                  @for (it of pos.lastReceipt().items; track $index) {
                    <div class="r-item">
                      <span>{{ it.quantity }}x {{ it.product.sku }} ({{ it.selectedSize }})</span>
                      <span>{{ currency.format(it.product.price * it.quantity) }}</span>
                    </div>
                  }
                </div>

                <div class="receipt-divider">--------------------------------</div>

                <div class="r-row">
                  <span>Subtotal:</span>
                  <span>{{ currency.format(pos.lastReceipt().subtotal) }}</span>
                </div>
                <div class="r-row">
                  <span>Tax:</span>
                  <span>{{ currency.format(pos.lastReceipt().tax) }}</span>
                </div>
                <div class="r-row total-bold">
                  <span>TOTAL PAID:</span>
                  <span>{{ currency.format(pos.lastReceipt().total) }}</span>
                </div>
                
                @if (pos.lastReceipt().payment_type === 'IN_STORE_CASH') {
                  <div class="r-row">
                    <span>Cash Tendered:</span>
                    <span>{{ currency.format(pos.lastReceipt().cash_given) }}</span>
                  </div>
                  <div class="r-row">
                    <span>Change Returned:</span>
                    <span>{{ currency.format(pos.lastReceipt().change_due) }}</span>
                  </div>
                }

                <div class="receipt-barcode">
                  <div class="fake-bars">|||||| |||| ||||| ||||||| |||| |||||</div>
                  <span>{{ pos.lastReceipt().barcode }}</span>
                </div>

                <div class="receipt-footer">
                  THANK YOU FOR VISITING ATELIER MAISON
                  <br />Track & Register items at ateliervogue.com
                </div>

                <button class="print-dismiss-btn" (click)="printReceipt()">Print / Close Receipt</button>
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
      background: rgba(5, 6, 8, 0.9);
      backdrop-filter: blur(14px);
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .pos-terminal {
      background: #0d0f14;
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.16));
      border-radius: 20px;
      max-width: 1200px;
      width: 100%;
      height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9);
      overflow: hidden;
      position: relative;
    }

    .pos-header {
      background: #121419;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .pos-badge {
      font-size: 9px;
      font-weight: 800;
      color: #F59E0B;
      background: rgba(245, 158, 11, 0.15);
      padding: 2px 8px;
      border-radius: 9999px;
      letter-spacing: 1.5px;
      display: inline-block;
      margin-bottom: 4px;
    }

    .header-left h3 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 18px;
      margin: 0 0 2px;
      color: #FFF;
    }

    .sub {
      font-size: 11px;
      color: #94A3B8;
    }

    .close-btn {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #CBD5E1;
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
    }

    .terminal-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .pane-left {
      flex: 1;
      padding: 20px;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      overflow-y: auto;
    }

    .barcode-quick-add {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    .barcode-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 12px 14px;
      color: #FFF;
      font-size: 14px;
    }

    .quick-add-btn {
      background: #10B981;
      color: #FFF;
      border: none;
      padding: 0 18px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
    }

    .quick-catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }

    .quick-item-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px;
      text-align: left;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
      transition: all 0.2s;
    }

    .quick-item-card:hover {
      border-color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.05);
    }

    .quick-item-card strong {
      color: #FFF;
      font-size: 13px;
    }

    .quick-item-card span {
      font-size: 11px;
      color: #94A3B8;
    }

    .quick-item-card .price {
      color: var(--accent-gold, #EAD8C0);
      font-weight: 700;
      font-size: 13px;
    }

    .pane-right {
      width: 440px;
      background: #121419;
      padding: 20px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .ticket-header h4 {
      margin: 0;
      font-size: 15px;
      color: #FFF;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: #EF4444;
      font-size: 11px;
      cursor: pointer;
    }

    .guest-info-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .cust-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px;
      color: #FFF;
    }

    .ticket-items {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .empty-ticket {
      text-align: center;
      padding: 40px 20px;
      color: #64748B;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .empty-ticket .icon {
      font-size: 32px;
    }

    .ticket-item-row {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-name {
      font-size: 12px;
      color: #CBD5E1;
    }

    .item-name .meta {
      display: block;
      font-size: 10px;
      color: #64748B;
    }

    .item-calc {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .qty-stepper {
      display: inline-flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      overflow: hidden;
    }

    .qty-stepper button {
      background: transparent;
      border: none;
      color: #FFF;
      padding: 2px 8px;
      cursor: pointer;
    }

    .qty-stepper span {
      padding: 0 4px;
      font-size: 11px;
      font-weight: bold;
    }

    .row-total {
      font-size: 12px;
      font-weight: 700;
      color: var(--accent-gold, #EAD8C0);
    }

    .ledger-box {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 12px;
    }

    .ledger-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #94A3B8;
      margin-bottom: 4px;
    }

    .ledger-row.total {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 6px;
      font-weight: 700;
      color: #FFF;
      font-size: 14px;
    }

    .total-val {
      color: var(--accent-gold, #EAD8C0);
      font-size: 18px;
    }

    .tender-options {
      margin-bottom: 12px;
    }

    .tender-options label {
      display: block;
      font-size: 11px;
      color: #94A3B8;
      margin-bottom: 6px;
    }

    .tender-btns {
      display: flex;
      gap: 6px;
    }

    .tender-btn {
      flex: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94A3B8;
      padding: 6px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
    }

    .tender-btn.active {
      background: rgba(234, 216, 192, 0.15);
      border-color: var(--accent-gold, #EAD8C0);
      color: var(--accent-gold, #EAD8C0);
    }

    .cash-calc-box {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      padding: 8px;
      margin-bottom: 12px;
      font-size: 12px;
    }

    .cash-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .cash-input {
      width: 100px;
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #10B981;
      font-size: 14px;
      font-weight: 700;
      text-align: right;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .change-row {
      display: flex;
      justify-content: space-between;
      color: #CBD5E1;
    }

    .change-val {
      color: #10B981;
      font-size: 14px;
    }

    .checkout-submit-btn {
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .checkout-submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Thermal receipt overlay */
    .receipt-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 10;
    }

    .thermal-receipt {
      background: #FFF;
      color: #000;
      font-family: 'Courier New', Courier, monospace;
      width: 320px;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
      font-size: 11px;
      line-height: 1.4;
    }

    .receipt-brand {
      font-size: 16px;
      font-weight: 900;
      text-align: center;
      letter-spacing: 2px;
    }

    .receipt-store, .receipt-meta {
      text-align: center;
      font-size: 10px;
    }

    .receipt-divider {
      text-align: center;
      margin: 8px 0;
    }

    .r-item, .r-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .total-bold {
      font-weight: 900;
      font-size: 13px;
      margin: 6px 0;
    }

    .receipt-barcode {
      text-align: center;
      margin: 12px 0;
    }

    .fake-bars {
      font-size: 14px;
      letter-spacing: 2px;
      font-weight: bold;
    }

    .receipt-footer {
      text-align: center;
      font-size: 9px;
      margin-bottom: 12px;
    }

    .print-dismiss-btn {
      width: 100%;
      background: #000;
      color: #FFF;
      border: none;
      padding: 8px;
      font-weight: bold;
      cursor: pointer;
    }

    /* Folding devices query */
    @media (max-width: 800px) {
      .terminal-body {
        flex-direction: column;
      }
      .pane-right {
        width: 100%;
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

  scanBarcode(code: string): void {
    if (!code) return;
    this.api.lookupBarcode(code.trim()).subscribe(res => {
      if (res.found) {
        this.pos.addItemByProduct({
          id: res.id,
          title: res.title,
          sku: res.sku,
          price: res.price,
          barcode: res.barcode,
          inventory_count: res.inventory_count,
          category: 1,
          is_bestseller: false,
          is_new_arrival: false,
          fabric: 'Haute Couture',
          fit: 'Regular',
          sustainability_rating: 'A+',
          care_guide: 'Dry Clean',
          primary_image: res.primary_image,
          hover_image: res.primary_image,
          extra_images: [],
          available_sizes: ['M'],
          color_swatches: [{ name: 'Noir', hex: '#111' }],
          slug: res.sku.toLowerCase()
        });
        this.barcodeInput = '';
      } else {
        alert(`Barcode/SKU ${code} not found.`);
      }
    });
  }

  ringPreset(sku: string): void {
    this.scanBarcode(sku);
  }

  printReceipt(): void {
    this.pos.closeReceipt();
  }
}
