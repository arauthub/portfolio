import { Injectable, signal, inject } from '@angular/core';
import { AuthUser, MembershipTier } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'atelier_current_user_2026';

  currentUser = signal<AuthUser | null>(this.getInitialUser());
  isAuthModalOpen = signal<boolean>(false);
  isProfileDrawerOpen = signal<boolean>(false);

  private getInitialUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        // Fallback
      }
    }
    // Pre-populate with a distinguished demo user so the VIP experience is instantly visible
    return {
      id: 'usr_luxury_901',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@vogue-society.com',
      phone: '+1 (555) 382-9014',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      membership_tier: 'VIP',
      auth_provider: 'google'
    };
  }

  saveUser(user: AuthUser | null): void {
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  openAuthModal(): void {
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }

  openProfileDrawer(): void {
    this.isProfileDrawerOpen.set(true);
  }

  closeProfileDrawer(): void {
    this.isProfileDrawerOpen.set(false);
  }

  signInWithGoogle(): void {
    const googleUser: AuthUser = {
      id: 'usr_g_' + Math.random().toString(36).substring(2, 9),
      name: 'Camille Saint-Laurent',
      email: 'camille.saintlaurent@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      phone: '+1 (800) 840-7721',
      membership_tier: 'PREMIUM',
      auth_provider: 'google'
    };
    this.saveUser(googleUser);
    this.closeAuthModal();
  }

  loginWithPhoneOtp(phoneNumber: string, otp: string): boolean {
    if (!phoneNumber || !otp) return false;
    // Demo accept: '123456' or any 6-digit OTP
    const user: AuthUser = {
      id: 'usr_phone_' + Math.random().toString(36).substring(2, 9),
      name: 'Sophia Rossi',
      email: `client.${phoneNumber.replace(/\D/g, '').slice(-4)}@ateliervogue.com`,
      phone: phoneNumber,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      membership_tier: 'PLUS',
      auth_provider: 'phone_otp'
    };
    this.saveUser(user);
    this.closeAuthModal();
    return true;
  }

  signInWithEmail(email: string): void {
    const user: AuthUser = {
      id: 'usr_email_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: '+1 (555) 720-1920',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      membership_tier: 'PLUS',
      auth_provider: 'email'
    };
    this.saveUser(user);
    this.closeAuthModal();
  }

  updateMembershipTier(tier: 'FREE' | 'PLUS' | 'PREMIUM' | 'VIP'): void {
    const curr = this.currentUser();
    if (curr) {
      const updated = { ...curr, membership_tier: tier };
      this.saveUser(updated);
    }
  }

  signOut(): void {
    this.saveUser(null);
    this.closeProfileDrawer();
  }
}
