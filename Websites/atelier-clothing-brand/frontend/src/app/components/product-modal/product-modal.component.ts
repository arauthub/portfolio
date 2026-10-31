import { Component, inject, signal, input, output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { Product, ColorSwatch } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CurrencyService } from '../../services/currency.service';
import { SeoMetaService } from '../../services/seo-meta.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatChipsModule, MatTooltipModule, MatTabsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly currencyService = inject(CurrencyService);
  readonly seo = inject(SeoMetaService);

  readonly product = input.required<Product>();
  readonly close = output<void>();

  selectedImage = signal<string>('');
  selectedColor = signal<ColorSwatch | null>(null);
  selectedSize = signal<string>('');
  quantity = signal<number>(1);

  // Fit Finder interactive tool state
  fitFinderOpen = signal<boolean>(false);
  clientHeight = signal<string>("5'8\" - 5'10\"");
  clientPreference = signal<'slim' | 'regular' | 'oversized'>('regular');
  fitRecommendation = signal<string>('');

  // Indian Pincode Delivery Check Widget
  pincodeInput = signal<string>('400001');
  pincodeStatus = signal<{ checked: boolean; valid: boolean; message: string }>({
    checked: true,
    valid: true,
    message: '✓ Express Air Courier available to 400001 (Mumbai). Delivery in 2-3 days via Bluedart. COD Eligible.'
  });

  // Master Darzi Video Consultation
  darziModalOpen = signal<boolean>(false);
  darziBooked = signal<boolean>(false);

  // Complete The Look bundle addition notification
  bundleAdded = signal<boolean>(false);

  ngOnInit(): void {
    const p = this.product();
    this.selectedImage.set(p.primary_image);
    this.selectedColor.set(p.color_swatches[0] || null);
    this.selectedSize.set(p.available_sizes[0] || 'M / 38');
    this.calculateFit();
    this.seo.setProductMeta(p);
  }

  shareProduct(): void {
    this.seo.openShare(this.product());
  }

  checkPincode(): void {
    const pin = this.pincodeInput().trim();
    if (/^\d{6}$/.test(pin)) {
      this.pincodeStatus.set({
        checked: true,
        valid: true,
        message: `✓ Express Air Courier available to ${pin}. Delivered in 2-3 business days via Bluedart Luxury Express. COD Eligible.`
      });
    } else {
      this.pincodeStatus.set({
        checked: true,
        valid: false,
        message: '✕ Please enter a valid 6-digit Indian Postal Pincode.'
      });
    }
  }

  bookDarziConsult(): void {
    this.darziBooked.set(true);
    setTimeout(() => {
      this.darziBooked.set(false);
      this.darziModalOpen.set(false);
    }, 3500);
  }

  changeImage(imgUrl: string): void {
    this.selectedImage.set(imgUrl);
  }

  selectColor(swatch: ColorSwatch): void {
    this.selectedColor.set(swatch);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  setQuantity(delta: number): void {
    const next = this.quantity() + delta;
    if (next >= 1 && next <= (this.product().inventory_count || 10)) {
      this.quantity.set(next);
    }
  }

  addToBag(): void {
    const p = this.product();
    const color = this.selectedColor();
    this.cartService.addItem(
      p,
      this.selectedSize(),
      color?.name || 'Classic',
      color?.hex || '#000000',
      this.quantity()
    );
    this.close.emit();
  }

  calculateFit(): void {
    const pref = this.clientPreference();
    const sizes = this.product().available_sizes;
    let rec = 'M';
    if (pref === 'slim') rec = sizes.includes('S') ? 'S' : 'M';
    else if (pref === 'oversized') rec = sizes.includes('L') ? 'L' : 'M';
    else rec = sizes.includes('M') ? 'M' : sizes[0];

    this.fitRecommendation.set(`Recommended Silhouette: Size ${rec} (96% Client Confidence)`);
  }

  applyRecommendedSize(rec: string): void {
    const match = rec.match(/Size ([A-Z0-9\/\s-]+)/);
    if (match && match[1]) {
      this.selectedSize.set(match[1].trim());
    }
  }

  addBundleLook(): void {
    this.addToBag();
    this.bundleAdded.set(true);
    setTimeout(() => this.bundleAdded.set(false), 3000);
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80';
  }
}
