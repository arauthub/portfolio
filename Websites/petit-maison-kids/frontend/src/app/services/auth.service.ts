import { Injectable, signal, inject } from '@angular/core';
import { AuthUser } from '../models/kids.model';
import { MembershipService } from './membership.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private membershipService = inject(MembershipService);

  readonly isAuthModalOpen = signal<boolean>(false);
  readonly authMode = signal<'login' | 'register' | 'otp' | 'profile'>('login');
  readonly currentUser = signal<AuthUser | null>(this.loadUser());

  readonly otpSent = signal<boolean>(false);
  readonly phoneNumber = signal<string>('');
  readonly otpCode = signal<string>('');

  constructor() {
    const user = this.currentUser();
    if (user) {
      this.membershipService.setUserTier(user.membership_tier);
    }
  }

  openAuthModal(mode: 'login' | 'register' | 'otp' | 'profile' = 'login'): void {
    if (this.currentUser() && mode === 'login') {
      this.authMode.set('profile');
    } else {
      this.authMode.set(mode);
    }
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }

  loginWithGoogle(): void {
    const dummyGoogleUser: AuthUser = {
      id: 'usr_goog_kids_' + Math.floor(1000 + Math.random() * 9000),
      name: 'Claire de Montmirail',
      email: 'claire.montmirail@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
      membership_tier: 'VIP',
      points: 480,
      auth_provider: 'google',
      saved_addresses: ['18 Rue de l’Université, 75007 Paris, France']
    };
    this.setUser(dummyGoogleUser);
    this.closeAuthModal();
  }

  requestOtp(phone: string): boolean {
    if (!phone || phone.length < 8) return false;
    this.phoneNumber.set(phone);
    this.otpSent.set(true);
    this.authMode.set('otp');
    return true;
  }

  verifyOtp(code: string): boolean {
    if (code === '2026' || code.length === 4) {
      const otpUser: AuthUser = {
        id: 'usr_otp_kids_' + Math.floor(1000 + Math.random() * 9000),
        name: 'Élodie Laurent',
        email: 'elodie.laurent@outlook.fr',
        phone: this.phoneNumber() || '+33 6 12 34 56 78',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        membership_tier: 'PREMIUM',
        points: 250,
        auth_provider: 'phone_otp',
        saved_addresses: ['45 Boulevard Saint-Germain, 75005 Paris, France']
      };
      this.setUser(otpUser);
      this.closeAuthModal();
      return true;
    }
    return false;
  }

  loginWithEmail(email: string, pass: string): boolean {
    const emailUser: AuthUser = {
      id: 'usr_mail_kids_' + Math.floor(1000 + Math.random() * 9000),
      name: email.split('@')[0],
      email: email,
      membership_tier: 'PLUS',
      points: 120,
      auth_provider: 'email_password'
    };
    this.setUser(emailUser);
    this.closeAuthModal();
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    this.membershipService.setUserTier('FREE');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('petit_kids_auth_user');
    }
  }

  private setUser(user: AuthUser): void {
    this.currentUser.set(user);
    this.membershipService.setUserTier(user.membership_tier);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('petit_kids_auth_user', JSON.stringify(user));
    }
  }

  private loadUser(): AuthUser | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('petit_kids_auth_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
