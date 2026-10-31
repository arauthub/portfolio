import { Component, output, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-barcode-scanner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="scanner-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        
        <div class="card-top">
          <div class="title-pill">
            <span class="material-symbols-outlined icon">barcode_scanner</span>
            <span>HIGH-SPEED LIVE BARCODE & SKU SCANNER</span>
          </div>
          <button class="close-x" (click)="close.emit()">✕</button>
        </div>

        <div class="viewfinder-section">
          <!-- Animated Laser Viewfinder Simulation -->
          <div class="scanner-viewport">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
            <div class="laser-beam"></div>
            
            <div class="target-indicator">
              <span class="scan-state">{{ isScanning() ? 'ACQUIRING CODE...' : 'READY FOR INPUT' }}</span>
              <span class="sub">ALIGN GARMENT UPC/EAN BARCODE OR SKU IN FRAME</span>
            </div>
          </div>
        </div>

        <!-- Barcode Manual & Quick Input -->
        <div class="scan-inputs">
          <div class="input-row">
            <input 
              type="text" 
              [(ngModel)]="manualCode" 
              placeholder="Enter Barcode e.g. 890123450001 or SKU e.g. AV-OTR-001" 
              (keyup.enter)="lookupCode(manualCode)"
              class="code-input" />
            <button class="scan-trigger-btn" (click)="lookupCode(manualCode)">
              Scan / Lookup
            </button>
          </div>

          <!-- Quick Test Barcode Chips -->
          <div class="quick-barcodes">
            <span class="lbl">Sample Tags:</span>
            <button class="chip" (click)="lookupCode('890123450001')">890123450001 (Cashmere Trench)</button>
            <button class="chip" (click)="lookupCode('890123450002')">890123450002 (Hourglass Blazer)</button>
            <button class="chip" (click)="lookupCode('890987650001')">890987650001 (Kids Romper)</button>
          </div>
        </div>

        <!-- Scanned Result Card -->
        @if (scannedProduct()) {
          <div class="scanned-result-box">
            <img [src]="scannedProduct().primary_image" alt="Product" class="result-img" />
            
            <div class="result-details">
              <div class="badge-row">
                <span class="sku-tag">SKU: {{ scannedProduct().sku }}</span>
                <span class="barcode-tag">BARCODE: {{ scannedProduct().barcode }}</span>
                @if (scannedProduct().inventory_count <= 5) {
                  <span class="stock-tag low">ONLY {{ scannedProduct().inventory_count }} LEFT</span>
                } @else {
                  <span class="stock-tag ok">{{ scannedProduct().inventory_count }} UNITS IN STOCK</span>
                }
              </div>

              <h4>{{ scannedProduct().title }}</h4>
              <div class="price-val">{{ currency.format(scannedProduct().price) }}</div>

              <div class="actions-row">
                <button class="add-cart-btn" (click)="addToBag(scannedProduct())">
                  <span class="material-symbols-outlined">shopping_bag</span>
                  <span>Add To Bag</span>
                </button>

                <!-- Admin Stock Adjustment Controls -->
                <div class="stock-adjuster">
                  <span class="adj-label">Quick Restock:</span>
                  <button class="adj-btn" (click)="adjustStock(scannedProduct().sku, 10)">+10</button>
                  <button class="adj-btn" (click)="adjustStock(scannedProduct().sku, 25)">+25</button>
                  <button class="adj-btn" (click)="adjustStock(scannedProduct().sku, 50)">+50</button>
                </div>
              </div>

              @if (stockUpdateMessage()) {
                <div class="status-msg">{{ stockUpdateMessage() }}</div>
              }
            </div>
          </div>
        }

      </div>
    </div>
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

    .scanner-card {
      background: #121419;
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.16));
      border-radius: 20px;
      max-width: 650px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .title-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 800;
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(234, 216, 192, 0.25);
    }

    .title-pill .icon {
      font-size: 16px;
    }

    .close-x {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 18px;
      cursor: pointer;
    }

    .viewfinder-section {
      background: #000;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 20px;
    }

    .scanner-viewport {
      height: 180px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .corner {
      position: absolute;
      width: 24px;
      height: 24px;
      border-color: #10B981;
      border-style: solid;
    }

    .corner.top-left { top: 16px; left: 24px; border-width: 2px 0 0 2px; }
    .corner.top-right { top: 16px; right: 24px; border-width: 2px 2px 0 0; }
    .corner.bottom-left { bottom: 16px; left: 24px; border-width: 0 0 2px 2px; }
    .corner.bottom-right { bottom: 16px; right: 24px; border-width: 0 2px 2px 0; }

    .laser-beam {
      position: absolute;
      left: 10%;
      right: 10%;
      height: 2px;
      background: #EF4444;
      box-shadow: 0 0 12px #EF4444;
      animation: scanSweep 2s ease-in-out infinite alternate;
    }

    @keyframes scanSweep {
      0% { top: 25px; opacity: 0.8; }
      100% { top: 155px; opacity: 1; }
    }

    .target-indicator {
      text-align: center;
      z-index: 2;
    }

    .scan-state {
      display: block;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #10B981;
    }

    .target-indicator .sub {
      font-size: 10px;
      color: #64748B;
      letter-spacing: 0.5px;
    }

    .scan-inputs {
      margin-bottom: 20px;
    }

    .input-row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .code-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 10px 14px;
      color: #FFF;
      font-size: 13px;
    }

    .code-input:focus {
      outline: none;
      border-color: var(--accent-gold, #EAD8C0);
    }

    .scan-trigger-btn {
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      border: none;
      padding: 0 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }

    .quick-barcodes {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
    }

    .quick-barcodes .lbl {
      font-size: 11px;
      color: #64748B;
    }

    .chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #CBD5E1;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .chip:hover {
      border-color: var(--accent-gold, #EAD8C0);
      color: #FFF;
    }

    .scanned-result-box {
      display: flex;
      gap: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 16px;
    }

    .result-img {
      width: 90px;
      height: 110px;
      object-fit: cover;
      border-radius: 8px;
    }

    .result-details {
      flex: 1;
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 6px;
    }

    .sku-tag, .barcode-tag {
      font-size: 9px;
      background: rgba(255, 255, 255, 0.08);
      color: #CBD5E1;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }

    .stock-tag {
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }

    .stock-tag.ok {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
    }

    .stock-tag.low {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }

    .result-details h4 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 16px;
      margin: 0 0 4px;
      color: #FFF;
    }

    .price-val {
      font-size: 16px;
      font-weight: 700;
      color: var(--accent-gold, #EAD8C0);
      margin-bottom: 12px;
    }

    .actions-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }

    .add-cart-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #10B981;
      color: #FFF;
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .stock-adjuster {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .adj-label {
      font-size: 11px;
      color: #94A3B8;
      margin-right: 4px;
    }

    .adj-btn {
      background: rgba(234, 216, 192, 0.12);
      border: 1px solid rgba(234, 216, 192, 0.25);
      color: var(--accent-gold, #EAD8C0);
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
    }

    .adj-btn:hover {
      background: var(--accent-gold, #EAD8C0);
      color: #0A0B0E;
    }

    .status-msg {
      margin-top: 8px;
      font-size: 11px;
      color: #10B981;
      font-weight: 600;
    }
  `]
})
export class BarcodeScannerModalComponent {
  api = inject(ApiService);
  cart = inject(CartService);
  currency = inject(CurrencyService);

  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  manualCode = '890123450001';
  isScanning = signal<boolean>(false);
  scannedProduct = signal<any | null>(null);
  stockUpdateMessage = signal<string>('');

  lookupCode(code: string): void {
    if (!code) return;
    this.isScanning.set(true);
    this.stockUpdateMessage.set('');

    setTimeout(() => {
      this.api.lookupBarcode(code.trim()).subscribe(res => {
        this.isScanning.set(false);
        if (res.found) {
          this.scannedProduct.set(res);
        } else {
          alert(`Barcode or SKU "${code}" was not found.`);
        }
      });
    }, 400);
  }

  addToBag(item: any): void {
    const dummyProduct: Product = {
      id: item.id,
      title: item.title,
      slug: item.sku.toLowerCase(),
      sku: item.sku,
      barcode: item.barcode,
      price: item.price,
      inventory_count: item.inventory_count,
      category: 1,
      is_bestseller: false,
      is_new_arrival: false,
      fabric: 'Fine Mongolian Cashmere',
      fit: 'Tailored',
      sustainability_rating: 'A+',
      care_guide: 'Dry clean',
      primary_image: item.primary_image,
      hover_image: item.primary_image,
      extra_images: [],
      available_sizes: item.available_sizes || ['M'],
      color_swatches: item.color_swatches || [{ name: 'Noir', hex: '#111' }]
    };

    const swatch = dummyProduct.color_swatches[0] || { name: 'Noir', hex: '#111111' };
    this.cart.addItem(dummyProduct, 'M', swatch.name, swatch.hex);
    this.stockUpdateMessage.set('Item added to shopping bag!');
  }

  adjustStock(sku: string, amount: number): void {
    this.api.updateStock(sku, amount).subscribe(res => {
      if (res.success) {
        this.scannedProduct.update(curr => curr ? { ...curr, inventory_count: res.new_inventory_count } : null);
        this.stockUpdateMessage.set(res.message);
      }
    });
  }
}
