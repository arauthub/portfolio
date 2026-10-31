import { Injectable, signal, effect, computed } from '@angular/core';
import { KidsProduct } from '../models/kids.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  readonly wishlistSkus = signal<string[]>(this.loadWishlist());
  readonly count = computed(() => this.wishlistSkus().length);

  constructor() {
    effect(() => {
      const skus = this.wishlistSkus();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('petit_kids_wishlist', JSON.stringify(skus));
      }
    });
  }

  isInWishlist(identifier: number | string): boolean {
    const key = String(identifier);
    return this.wishlistSkus().some(s => s === key || s.includes(key));
  }

  isWishlisted(sku: string): boolean {
    return this.wishlistSkus().includes(sku);
  }

  toggle(item: KidsProduct | string | number): boolean {
    const sku = typeof item === 'object' ? item.sku : String(item);
    const current = this.wishlistSkus();
    if (current.includes(sku)) {
      this.wishlistSkus.set(current.filter(s => s !== sku));
      return false;
    } else {
      this.wishlistSkus.set([...current, sku]);
      return true;
    }
  }

  getCount(): number {
    return this.wishlistSkus().length;
  }

  private loadWishlist(): string[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('petit_kids_wishlist');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    return ['PMK-ROMP-001', 'PMK-SIB-005'];
  }
}
