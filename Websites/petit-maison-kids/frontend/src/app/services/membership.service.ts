import { Injectable, signal, computed } from '@angular/core';
import { MembershipTier } from '../models/kids.model';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  readonly isMembershipModalOpen = signal<boolean>(false);

  readonly availableTiers = signal<MembershipTier[]>([
    {
      tier_type: 'FREE',
      name: 'Petit Explorer',
      badge_label: 'Free Guest',
      monthly_price_usd: 0,
      monthly_price_inr: 0,
      annual_price_usd: 0,
      discount_percentage: 0,
      free_shipping: false,
      early_access_hours: 0,
      perks_list: [
        'Standard organic cotton nursery catalogue',
        'Standard ground delivery',
        'Email newsletter'
      ]
    },
    {
      tier_type: 'PLUS',
      name: 'Petit Plus Club',
      badge_label: 'Plus Member',
      monthly_price_usd: 19,
      monthly_price_inr: 1599,
      annual_price_usd: 190,
      discount_percentage: 10,
      free_shipping: true,
      early_access_hours: 12,
      perks_list: [
        '10% off all organic and heirloom garments',
        'Complimentary bespoke monogramming on 2 items/year',
        'Free expedited baby nursery shipping',
        '12h early access to seasonal capsule drops'
      ]
    },
    {
      tier_type: 'PREMIUM',
      name: 'Maison Heirloom Circle',
      badge_label: 'Heirloom Member',
      monthly_price_usd: 49,
      monthly_price_inr: 3999,
      annual_price_usd: 490,
      discount_percentage: 15,
      free_shipping: true,
      early_access_hours: 24,
      perks_list: [
        '15% off entire childrenswear collections',
        'Unlimited luxury French hand-monogramming',
        'Priority baby shower gifting packaging with silk box',
        '24h early access to private trunk shows',
        'Direct Whatsapp styling concierge with French nursery couturiers'
      ]
    },
    {
      tier_type: 'VIP',
      name: 'Royal Nursery Dynasty VIP',
      badge_label: 'Royal VIP Patron',
      monthly_price_usd: 99,
      monthly_price_inr: 7999,
      annual_price_usd: 990,
      discount_percentage: 20,
      free_shipping: true,
      early_access_hours: 48,
      perks_list: [
        '20% off all orders with zero minimum order value',
        'Bespoke custom-fitted cashmere christening & ceremony sets',
        'Hand-delivered White Glove Parisian courier in select capitals',
        '48h first-refusal on rare French archive textiles',
        'Dedicated senior childcare concierge & private atelier appointments'
      ]
    }
  ]);

  readonly activeTierType = signal<'FREE' | 'PLUS' | 'PREMIUM' | 'VIP'>('FREE');

  readonly activeTier = computed(() => {
    const type = this.activeTierType();
    return this.availableTiers().find(t => t.tier_type === type) || this.availableTiers()[0];
  });

  readonly discountPercentage = computed(() => {
    return this.activeTier().discount_percentage;
  });

  readonly hasFreeShipping = computed(() => {
    return this.activeTier().free_shipping;
  });

  openModal(): void {
    this.isMembershipModalOpen.set(true);
  }

  closeModal(): void {
    this.isMembershipModalOpen.set(false);
  }

  setUserTier(tier: 'FREE' | 'PLUS' | 'PREMIUM' | 'VIP'): void {
    this.activeTierType.set(tier);
  }

  calculateDiscount(subtotal: number): number {
    const pct = this.discountPercentage();
    if (pct <= 0) return 0;
    return Math.round(subtotal * (pct / 100) * 100) / 100;
  }
}
