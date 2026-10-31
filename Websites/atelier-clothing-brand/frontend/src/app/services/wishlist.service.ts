import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  readonly wishlistSkus = signal<string[]>(this.loadWishlist());

  constructor() {
    effect(() => {
      const skus = this.wishlistSkus();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('atelier_wishlist', JSON.stringify(skus));
      }
    });
  }

  isWishlisted(sku: string): boolean {
    return this.wishlistSkus().includes(sku);
  }

  has(sku: string): boolean {
    return this.isWishlisted(sku);
  }

  toggle(sku: string): boolean {
    const current = this.wishlistSkus();
    if (current.includes(sku)) {
      this.wishlistSkus.set(current.filter(s => s !== sku));
      return false;
    } else {
      this.wishlistSkus.set([...current, sku]);
      return true;
    }
  }

  count(): number {
    return this.wishlistSkus().length;
  }

  private loadWishlist(): string[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('atelier_wishlist');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    return ['AV-OTR-001'];
  }
}
