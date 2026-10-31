import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem, KidsProduct, MonogramConfig } from '../models/kids.model';
import { CurrencyService } from './currency.service';
import { MembershipService } from './membership.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly currencyService = inject(CurrencyService);
  readonly membershipService = inject(MembershipService);

  readonly items = signal<CartItem[]>(this.loadCartFromStorage());
  readonly isDrawerOpen = signal<boolean>(false);
  readonly appliedCoupon = signal<{ code: string; percent: number; amount: number } | null>(null);
  readonly giftWrapSelected = signal<boolean>(false);
  readonly giftNote = signal<string>('');

  readonly freeShippingThresholdUsdBase = computed(() => {
    const rate = this.currencyService.activeRate();
    const threshold = this.currencyService.freeShippingThreshold();
    return threshold / (rate || 1);
  });

  readonly freeShippingThreshold = computed(() => this.currencyService.freeShippingThreshold());

  readonly itemCount = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });

  readonly rawSubtotal = computed(() => {
    return this.items().reduce((total, item) => {
      const monogramExtra = item.monogram ? 499 : 0; // ₹499 royal gold monogramming
      return total + ((item.price + monogramExtra) * item.quantity);
    }, 0);
  });

  readonly membershipDiscountAmount = computed(() => {
    return this.membershipService.calculateDiscount(this.rawSubtotal());
  });

  readonly discountAmount = computed(() => {
    const coupon = this.appliedCoupon();
    let couponDiscount = 0;
    if (coupon) {
      if (coupon.amount > 0) couponDiscount = Math.min(coupon.amount, this.rawSubtotal());
      else if (coupon.percent > 0) {
        couponDiscount = Math.round(this.rawSubtotal() * (coupon.percent / 100) * 100) / 100;
      }
    }
    return Math.min(this.rawSubtotal(), couponDiscount + this.membershipDiscountAmount());
  });

  readonly shippingCost = computed(() => {
    if (this.rawSubtotal() === 0) return 0;
    if (this.membershipService.hasFreeShipping()) return 0;
    return this.rawSubtotal() >= this.freeShippingThresholdUsdBase() ? 0 : 150;
  });

  readonly giftWrapCost = computed(() => {
    return this.giftWrapSelected() ? 250.00 : 0.00; // ₹250 royal keepsake box
  });

  readonly freeShippingRemaining = computed(() => {
    const remaining = this.freeShippingThresholdUsdBase() - this.rawSubtotal();
    return remaining > 0 ? Math.round(remaining * 100) / 100 : 0;
  });

  readonly freeShippingProgress = computed(() => {
    const thresh = this.freeShippingThresholdUsdBase();
    if (thresh <= 0 || this.rawSubtotal() >= thresh) return 100;
    return Math.min(100, Math.round((this.rawSubtotal() / thresh) * 100));
  });

  readonly estimatedTax = computed(() => {
    const taxable = Math.max(0, this.rawSubtotal() - this.discountAmount());
    return Math.round(taxable * 0.05 * 100) / 100; // 5% kids apparel tax rate
  });

  readonly finalTotal = computed(() => {
    return Math.max(0, this.rawSubtotal() - this.discountAmount() + this.shippingCost() + this.giftWrapCost() + this.estimatedTax());
  });

  readonly formattedSubtotal = computed(() => this.currencyService.format(this.rawSubtotal()));
  readonly formattedDiscount = computed(() => this.currencyService.format(this.discountAmount()));
  readonly formattedShipping = computed(() => this.shippingCost() === 0 ? 'FREE' : this.currencyService.format(this.shippingCost()));
  readonly formattedGiftWrap = computed(() => this.currencyService.format(this.giftWrapCost()));
  readonly formattedTax = computed(() => this.currencyService.format(this.estimatedTax()));
  readonly formattedTotal = computed(() => this.currencyService.format(this.finalTotal()));
  readonly formattedFreeShippingRemaining = computed(() => this.currencyService.format(this.freeShippingRemaining()));
  readonly formattedThreshold = computed(() => this.currencyService.formatThreshold());

  constructor() {
    effect(() => {
      const items = this.items();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('petit_kids_cart', JSON.stringify(items));
      }
    });
  }

  addItem(
    product: KidsProduct,
    size: string,
    color: string,
    colorHex: string = '',
    quantity: number = 1,
    monogram?: MonogramConfig
  ): void {
    const monogramTag = monogram ? `${monogram.text}-${monogram.threadColor}` : 'nomono';
    const id = `${product.sku}-${size}-${color}-${monogramTag}`;
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
        quantity,
        monogram
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
    this.giftWrapSelected.set(false);
    this.giftNote.set('');
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  private loadCartFromStorage(): CartItem[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('petit_kids_cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Keep only items with valid price
            return parsed.filter(i => i && typeof i.price === 'number' && i.price > 0);
          }
        }
      } catch (e) {
        console.error('Failed to parse cart storage', e);
      }
    }
    return [];
  }
}
