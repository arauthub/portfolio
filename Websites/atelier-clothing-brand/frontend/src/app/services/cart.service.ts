import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem, Product } from '../models/product.model';
import { CurrencyService } from './currency.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly currencyService = inject(CurrencyService);

  readonly items = signal<CartItem[]>(this.loadCartFromStorage());
  readonly isDrawerOpen = signal<boolean>(false);
  readonly appliedCoupon = signal<{ code: string; percent: number; amount: number } | null>(null);

  readonly freeShippingThresholdUsdBase = computed(() => {
    const rate = this.currencyService.activeRate();
    const threshold = this.currencyService.freeShippingThreshold();
    return threshold / (rate || 1);
  });

  readonly freeShippingThreshold = computed(() => this.currencyService.freeShippingThreshold());

  // Computed signals
  readonly itemCount = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  readonly discountAmount = computed(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;
    if (coupon.amount > 0) return Math.min(coupon.amount, this.subtotal());
    if (coupon.percent > 0) {
      return Math.round(this.subtotal() * (coupon.percent / 100) * 100) / 100;
    }
    return 0;
  });

  readonly shippingCost = computed(() => {
    if (this.subtotal() === 0) return 0;
    return this.subtotal() >= this.freeShippingThresholdUsdBase() ? 0 : 500;
  });

  readonly freeShippingRemaining = computed(() => {
    const remaining = this.freeShippingThresholdUsdBase() - this.subtotal();
    return remaining > 0 ? remaining : 0;
  });

  readonly freeShippingProgress = computed(() => {
    const thresh = this.freeShippingThresholdUsdBase();
    if (thresh <= 0 || this.subtotal() >= thresh) return 100;
    return Math.min(100, Math.round((this.subtotal() / thresh) * 100));
  });

  readonly estimatedTax = computed(() => {
    const taxable = Math.max(0, this.subtotal() - this.discountAmount());
    return Math.round(taxable * 0.08 * 100) / 100; // 8% luxury sales tax
  });

  readonly finalTotal = computed(() => {
    return Math.max(0, this.subtotal() - this.discountAmount() + this.shippingCost() + this.estimatedTax());
  });

  readonly formattedSubtotal = computed(() => this.currencyService.format(this.subtotal()));
  readonly formattedDiscount = computed(() => this.currencyService.format(this.discountAmount()));
  readonly formattedShipping = computed(() => this.shippingCost() === 0 ? 'FREE' : this.currencyService.format(this.shippingCost()));
  readonly formattedTax = computed(() => this.currencyService.format(this.estimatedTax()));
  readonly formattedTotal = computed(() => this.currencyService.format(this.finalTotal()));
  readonly formattedFreeShippingRemaining = computed(() => this.currencyService.format(this.freeShippingRemaining()));
  readonly formattedThreshold = computed(() => this.currencyService.formatThreshold());

  constructor() {
    effect(() => {
      const items = this.items();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('atelier_cart_items', JSON.stringify(items));
      }
    });
  }

  addItem(product: Product, size: string, color: string, colorHex: string = '', quantity: number = 1): void {
    const id = `${product.sku}-${size}-${color}`;
    const current = this.items();
    const existingIndex = current.findIndex(i => i.id === id);

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex].quantity += quantity;
      this.items.set(updated);
    } else {
      const newItem: CartItem = {
        id,
        sku: product.sku,
        title: product.title,
        price: product.price,
        size,
        color,
        colorHex,
        image: product.primary_image,
        quantity
      };
      this.items.set([...current, newItem]);
    }

    this.isDrawerOpen.set(true);
  }

  removeItem(id: string): void {
    this.items.set(this.items().filter(i => i.id !== id));
  }

  updateQuantity(id: string, delta: number): void {
    const current = this.items();
    const index = current.findIndex(i => i.id === id);
    if (index === -1) return;

    const newQty = current[index].quantity + delta;
    if (newQty <= 0) {
      this.removeItem(id);
    } else {
      const updated = [...current];
      updated[index] = { ...updated[index], quantity: newQty };
      this.items.set(updated);
    }
  }

  setCoupon(code: string, percent: number, amount: number = 0): void {
    this.appliedCoupon.set({ code, percent, amount });
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
  }

  clearCart(): void {
    this.items.set([]);
    this.appliedCoupon.set(null);
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update(v => !v);
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('atelier_cart_items');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Keep only items from the authentic Indian couture collection (minimum price ₹5000)
            return parsed.filter(i => i && typeof i.price === 'number' && i.price >= 5000);
          }
        }
      } catch (e) {
        console.error('Failed to parse cart storage', e);
      }
    }
    return [];
  }
}
