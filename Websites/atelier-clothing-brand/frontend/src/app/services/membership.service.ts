import { Injectable, signal, inject, computed } from '@angular/core';
import { MembershipTier } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private auth = inject(AuthService);

  readonly tiers: MembershipTier[] = [
    {
      tier_type: 'FREE',
      name: 'Complimentary Guest',
      badge_label: 'STANDARD',
      monthly_price_usd: 0,
      monthly_price_inr: 0,
      annual_price_usd: 0,
      discount_percentage: 0,
      free_shipping: false,
      early_access_hours: 0,
      perks_list: [
        'Access to full ready-to-wear runway catalog',
        'Standard digital order tracking & returns',
        'Email lookbook newsletters'
      ]
    },
    {
      tier_type: 'PLUS',
      name: 'Atelier Plus',
      badge_label: 'PLUS MEMBER',
      monthly_price_usd: 12.00,
      monthly_price_inr: 999.00,
      annual_price_usd: 119.00,
      discount_percentage: 10,
      free_shipping: true,
      early_access_hours: 24,
      perks_list: [
        '10% Instant Privilege on All Atelier Garments',
        'Complimentary Global Express Courier on All Orders',
        '24-Hour Early Access to Limited Edition Runway Drops',
        'Priority Tailoring & Garment Care Advisory',
        'Exclusive Seasonal Lookbook Look-Ins'
      ]
    },
    {
      tier_type: 'PREMIUM',
      name: 'Atelier Premium',
      badge_label: 'PREMIUM MEMBER',
      monthly_price_usd: 29.00,
      monthly_price_inr: 2499.00,
      annual_price_usd: 289.00,
      discount_percentage: 15,
      free_shipping: true,
      early_access_hours: 48,
      perks_list: [
        '15% Instant Privilege on Everything',
        'Dedicated 1-on-1 Virtual Stylist via Wagtail AI & Human Concierge',
        'Unlimited Free Courier Returns & In-Store Exchanges',
        'Complimentary Monogramming & Custom Button Selections',
        'Annual Luxury Cashmere Birthday Keepsake Gift Box'
      ]
    },
    {
      tier_type: 'VIP',
      name: 'Atelier VIP Black Tier',
      badge_label: 'VIP BLACK CONCIERGE',
      monthly_price_usd: 69.00,
      monthly_price_inr: 5999.00,
      annual_price_usd: 699.00,
      discount_percentage: 25,
      free_shipping: true,
      early_access_hours: 72,
      perks_list: [
        '25% Unrestricted Atelier Discount on All Garments & Gowns',
        'Bespoke Tailoring by Milanese Artisans to Custom Measurements',
        'Access to Private In-Store VIP Lounges (Milan, NYC, Mumbai, Paris)',
        'Personal Runway Invitations & Direct Access to Head Designer',
        'Zero-Interest Split Payment & Dedicated Concierge Phone Line'
      ]
    }
  ];

  isModalOpen = signal<boolean>(false);

  currentTier = computed<MembershipTier>(() => {
    const user = this.auth.currentUser();
    const tierCode = user ? user.membership_tier : 'VIP';
    return this.tiers.find(t => t.tier_type === tierCode) || this.tiers[3];
  });

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  upgradeTo(tierType: 'FREE' | 'PLUS' | 'PREMIUM' | 'VIP'): void {
    this.auth.updateMembershipTier(tierType);
    this.closeModal();
  }

  calculateDiscount(subtotal: number): { percent: number; amount: number; tierName: string } {
    const tier = this.currentTier();
    const percent = tier.discount_percentage;
    const amount = Math.round(subtotal * (percent / 100) * 100) / 100;
    return { percent, amount, tierName: tier.name };
  }
}
