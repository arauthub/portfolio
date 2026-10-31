import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { KidsProduct } from '../../models/kids.model';

@Component({
  selector: 'app-barcode-scanner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="barcode-backdrop" (click)="close()">
        <div class="barcode-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="dialog-header">
            <div>
              <span class="badge">LIVE NURSERY INVENTORY & SCANNER</span>
              <h2>Barcode Stock Manager</h2>
            </div>
            <button class="close-btn" (click)="close()">✕</button>
          </div>

          <!-- Scanner Simulation Viewport -->
          <div class="scanner-viewport">
            <div class="scanner-laser"></div>
            <div class="viewfinder-frame">
              <div class="corner tl"></div>
              <div class="corner tr"></div>
              <div class="corner bl"></div>
              <div class="corner br"></div>
            </div>
            <div class="scanner-overlay-info">
              <span class="material-symbols-outlined camera-icon">photo_camera</span>
              <span>Point Camera at Petit Maison Garment Tag Barcode</span>
            </div>
          </div>

          <!-- Fast Barcode Input & Quick Presets -->
          <div class="scan-input-row">
            <input 
              type="text" 
              [(ngModel)]="barcodeQuery" 
              (keyup.enter)="onSearch(barcodeQuery)"
              placeholder="Enter Barcode (e.g. 890987650001 or SKU)" 
              class="barcode-input" />
            <button class="scan-btn" (click)="onSearch(barcodeQuery)">Scan / Lookup</button>
          </div>

          <div class="presets-row">
            <span class="label">Sample Tags:</span>
            <button (click)="quickScan('890987650001')">890987650001 (Organic Romper)</button>
            <button (click)="quickScan('890987650002')">890987650002 (Linen Overalls)</button>
            <button (click)="quickScan('890987650003')">890987650003 (Sundress)</button>
            <button (click)="quickScan('PMK-SWT-004')">PMK-SWT-004 (Merino Cardigan)</button>
          </div>

          <!-- Scanned Product Card with Live Inventory Management -->
          @if (scannedProduct()) {
            <div class="scanned-card">
              <img [src]="scannedProduct()?.primary_image" [alt]="scannedProduct()?.title" class="product-thumb" />
              <div class="product-details">
                <div class="sku-tag">{{ scannedProduct()?.sku }} • Barcode: {{ scannedProduct()?.barcode || '890987650001' }}</div>
                <h3>{{ scannedProduct()?.title }}</h3>
                <span class="price">{{ currency.format(scannedProduct()?.price || 0) }}</span>

                <div class="stock-status-row">
                  <span class="stock-badge" [class.in-stock]="(scannedProduct()?.inventory_count || 0) > 0">
                    ● Live Inventory: <strong>{{ scannedProduct()?.inventory_count }} units</strong>
                  </span>
                </div>

                <!-- Stock Management Controls -->
                <div class="stock-actions">
                  <button class="stock-btn" (click)="adjustStock(-1)">-1 Sold</button>
                  <button class="stock-btn" (click)="adjustStock(+1)">+1 Restock</button>
                  <button class="stock-btn bulk" (click)="adjustStock(+10)">+10 Crate Delivery</button>
                  <button class="add-cart-btn" (click)="addToBag(scannedProduct())">+ Add to Bag</button>
                </div>

                @if (stockUpdateMessage()) {
                  <div class="update-msg">{{ stockUpdateMessage() }}</div>
                }
              </div>
            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .barcode-backdrop {
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

    .barcode-dialog {
      background: #FAF6EE;
      color: #2b3a32;
      width: 95vw;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 20px;
      border: 1px solid rgba(122, 168, 132, 0.3);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
      padding: 24px;
    }

    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 18px;

      .badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #7AA884;
        text-transform: uppercase;
      }

      h2 {
        margin: 4px 0 0;
        font-size: 1.4rem;
        font-weight: 800;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.3rem;
        cursor: pointer;
        color: #666;
      }
    }

    .scanner-viewport {
      background: #1a2720;
      border-radius: 14px;
      height: 180px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      border: 1px solid rgba(122, 168, 132, 0.3);
    }

    .scanner-laser {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 2px;
      background: #FF6B6B;
      box-shadow: 0 0 10px #FF6B6B, 0 0 20px #FF6B6B;
      animation: laserScan 2s infinite ease-in-out;
    }

    @keyframes laserScan {
      0% { top: 15%; opacity: 0.3; }
      50% { top: 85%; opacity: 1; }
      100% { top: 15%; opacity: 0.3; }
    }

    .viewfinder-frame {
      width: 140px;
      height: 110px;
      position: relative;

      .corner {
        position: absolute;
        width: 16px;
        height: 16px;
        border-color: #7AA884;
        border-style: solid;
        border-width: 0;

        &.tl { top: 0; left: 0; border-top-width: 3px; border-left-width: 3px; }
        &.tr { top: 0; right: 0; border-top-width: 3px; border-right-width: 3px; }
        &.bl { bottom: 0; left: 0; border-bottom-width: 3px; border-left-width: 3px; }
        &.br { bottom: 0; right: 0; border-bottom-width: 3px; border-right-width: 3px; }
      }
    }

    .scanner-overlay-info {
      position: absolute;
      bottom: 10px;
      color: rgba(250, 246, 238, 0.7);
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 6px;

      .camera-icon { font-size: 16px; }
    }

    .scan-input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;

      .barcode-input {
        flex: 1;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #dadce0;
        font-size: 0.88rem;
        outline: none;
        &:focus { border-color: #7AA884; }
      }

      .scan-btn {
        background: #7AA884;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.82rem;
        cursor: pointer;
        &:hover { background: #679270; }
      }
    }

    .presets-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      margin-bottom: 18px;

      .label { color: #888; }

      button {
        background: #EBE6DC;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        cursor: pointer;
        &:hover { background: #dad4c8; }
      }
    }

    .scanned-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #dadce0;
      padding: 14px;
      display: flex;
      gap: 16px;

      .product-thumb {
        width: 90px;
        height: 110px;
        object-fit: cover;
        border-radius: 8px;
      }

      .product-details {
        flex: 1;

        .sku-tag { font-size: 0.68rem; color: #888; font-weight: 600; }
        h3 { margin: 2px 0 6px; font-size: 1.05rem; font-weight: 800; }
        .price { font-size: 1.1rem; font-weight: 800; color: #2b3a32; }

        .stock-status-row {
          margin: 8px 0;
          .stock-badge {
            font-size: 0.75rem;
            color: #d9534f;
            &.in-stock { color: #2e7d32; }
          }
        }

        .stock-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;

          .stock-btn {
            background: #f0f0f0;
            border: 1px solid #ccc;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            &:hover { background: #e0e0e0; }
            &.bulk { background: #e8f5e9; color: #2e7d32; border-color: #a5d6a7; }
          }

          .add-cart-btn {
            background: #7AA884;
            color: white;
            border: none;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            &:hover { background: #679270; }
          }
        }

        .update-msg {
          margin-top: 8px;
          font-size: 0.72rem;
          color: #7AA884;
          font-weight: 700;
        }
      }
    }
  `]
})
export class BarcodeScannerModalComponent {
  api = inject(ApiService);
  cart = inject(CartService);
  currency = inject(CurrencyService);

  readonly isOpen = signal<boolean>(false);
  barcodeQuery = '890987650001';
  readonly scannedProduct = signal<KidsProduct | null>(null);
  readonly stockUpdateMessage = signal<string>('');

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.onSearch('890987650001');
  }

  close(): void {
    this.isOpen.set(false);
  }

  quickScan(code: string): void {
    this.barcodeQuery = code;
    this.onSearch(code);
  }

  onSearch(code: string): void {
    this.api.lookupBarcode(code).subscribe(res => {
      if (res.success && res.product) {
        this.scannedProduct.set(res.product);
        this.stockUpdateMessage.set(res.message);
      } else {
        this.stockUpdateMessage.set(res.message);
      }
    });
  }

  adjustStock(amount: number): void {
    const prod = this.scannedProduct();
    if (!prod) return;
    this.api.updateStock(prod.sku, amount).subscribe(res => {
      if (res.success) {
        this.scannedProduct.update(curr => curr ? { ...curr, inventory_count: res.new_inventory_count } : null);
        this.stockUpdateMessage.set(res.message);
      }
    });
  }

  addToBag(product: KidsProduct | null): void {
    if (!product) return;
    const swatch = product.color_swatches[0] || { name: 'Natural Oatmeal', hex: '#EBE3D5' };
    this.cart.addItem(product, product.available_sizes[0] || '12M', swatch.name, swatch.hex);
    this.stockUpdateMessage.set('Item added to shopping bag!');
  }
}
