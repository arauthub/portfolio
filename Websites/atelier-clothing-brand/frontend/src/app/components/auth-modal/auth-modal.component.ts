import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Authentication Modal -->
    @if (auth.isAuthModalOpen()) {
      <div class="auth-backdrop" (click)="auth.closeAuthModal()">
        <div class="auth-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="dialog-top">
            <span class="auth-badge">ENTERPRISE LUXURY PASSPORT</span>
            <button class="close-x" (click)="auth.closeAuthModal()">✕</button>
          </div>

          <div class="dialog-header">
            <h3>Sign In to Atelier Vogue</h3>
            <p>Access your Haute Couture wishlist, VIP membership discounts, and live tracking.</p>
          </div>

          <!-- Auth Tab Switcher -->
          <div class="auth-tabs">
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab() === 'social'" 
              (click)="activeTab.set('social')">
              Google / Social
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab() === 'otp'" 
              (click)="activeTab.set('otp')">
              Mobile Number & OTP
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab() === 'email'" 
              (click)="activeTab.set('email')">
              Email & Password
            </button>
          </div>

          <!-- Tab 1: Google One-Tap / Social -->
          @if (activeTab() === 'social') {
            <div class="tab-pane">
              <button class="google-btn" (click)="auth.signInWithGoogle()">
                <svg class="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google (Gmail Instant)</span>
              </button>

              <div class="social-divider"><span>OR ONE-TOUCH PARTNER SIGN IN</span></div>

              <div class="quick-profiles">
                <button class="profile-demo-card" (click)="selectDemoProfile('vip')">
                  <span class="badge vip">VIP BLACK</span>
                  <strong>Eleanor Vance</strong>
                  <span class="sub">eleanor.vance&#64;vogue-society.com</span>
                </button>
                <button class="profile-demo-card" (click)="selectDemoProfile('premium')">
                  <span class="badge premium">PREMIUM</span>
                  <strong>Camille Saint-Laurent</strong>
                  <span class="sub">camille.sl&#64;gmail.com</span>
                </button>
              </div>
            </div>
          }

          <!-- Tab 2: Mobile Number & OTP -->
          @if (activeTab() === 'otp') {
            <div class="tab-pane">
              @if (!otpSent()) {
                <div class="form-group">
                  <label>Mobile Number</label>
                  <div class="phone-input-wrap">
                    <span class="prefix">+1 / +91</span>
                    <input 
                      type="tel" 
                      [(ngModel)]="phoneNumber" 
                      placeholder="98200 12345 or (555) 019-2834"
                      class="text-input" />
                  </div>
                  <span class="help-text">A 6-digit verification code will be sent via SMS.</span>
                </div>
                <button class="action-submit-btn" (click)="sendOtp()">Send Verification OTP</button>
              } @else {
                <div class="form-group">
                  <label>Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    [(ngModel)]="enteredOtp" 
                    maxlength="6"
                    placeholder="123456" 
                    class="text-input otp-field" />
                  <div class="otp-meta">
                    <span class="otp-hint">Demo test code: <code>123456</code></span>
                    <button class="resend-btn" (click)="sendOtp()">Resend OTP</button>
                  </div>
                </div>
                <button class="action-submit-btn" (click)="verifyOtp()">Verify & Sign In</button>
              }
            </div>
          }

          <!-- Tab 3: Email & Password -->
          @if (activeTab() === 'email') {
            <div class="tab-pane">
              <div class="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  [(ngModel)]="emailAddress" 
                  placeholder="concierge@luxury-atelier.com" 
                  class="text-input" />
              </div>
              <div class="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  [(ngModel)]="passwordText" 
                  placeholder="••••••••••••" 
                  class="text-input" />
              </div>
              <button class="action-submit-btn" (click)="auth.signInWithEmail(emailAddress)">Sign In / Register</button>
            </div>
          }

        </div>
      </div>
    }

    <!-- User Profile Slide-Over Drawer -->
    @if (auth.isProfileDrawerOpen() && auth.currentUser()) {
      <div class="drawer-backdrop" (click)="auth.closeProfileDrawer()">
        <div class="profile-drawer" (click)="$event.stopPropagation()">
          <div class="drawer-top">
            <span class="drawer-badge">CLIENT DOSSIER</span>
            <button class="close-x" (click)="auth.closeProfileDrawer()">✕</button>
          </div>

          <div class="profile-card">
            <img [src]="auth.currentUser()!.avatar" alt="Avatar" class="profile-avatar" />
            <div class="profile-meta">
              <h4>{{ auth.currentUser()!.name }}</h4>
              <span class="email-sub">{{ auth.currentUser()!.email }}</span>
              <div class="membership-badge-row">
                <span class="member-tag">{{ auth.currentUser()!.membership_tier }} BLACK PRIVILEGE</span>
                <button class="upgrade-link" (click)="membership.openModal(); auth.closeProfileDrawer()">Manage Plan</button>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h5>Maison Privileges</h5>
            <div class="privilege-item">
              <span class="material-symbols-outlined icon">percent</span>
              <div>
                <strong>Active Discount:</strong> {{ membership.currentTier().discount_percentage }}% Off All Runway Collections
              </div>
            </div>
            <div class="privilege-item">
              <span class="material-symbols-outlined icon">local_shipping</span>
              <div>
                <strong>Shipping Tier:</strong> Complimentary Global Express Courier
              </div>
            </div>
            <div class="privilege-item">
              <span class="material-symbols-outlined icon">schedule</span>
              <div>
                <strong>Early Access:</strong> {{ membership.currentTier().early_access_hours }} Hours Ahead of Public Launch
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h5>Saved Concierge Address</h5>
            <div class="address-box">
              <p><strong>Primary Residence:</strong></p>
              <p>Via Monte Napoleone 8, Floor 4</p>
              <p>Milan, 20121 • Italy</p>
            </div>
          </div>

          <div class="drawer-footer">
            <button class="sign-out-btn" (click)="auth.signOut()">
              <span class="material-symbols-outlined">logout</span>
              <span>Sign Out of Maison</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .auth-backdrop, .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 6, 8, 0.85);
      backdrop-filter: blur(12px);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .auth-dialog {
      background: #121419;
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.16));
      border-radius: 20px;
      max-width: 500px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
    }

    .dialog-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .auth-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(234, 216, 192, 0.2);
    }

    .close-x {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 18px;
      cursor: pointer;
    }

    .dialog-header h3 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 24px;
      margin: 0 0 6px;
      color: #F8FAFC;
    }

    .dialog-header p {
      font-size: 13px;
      color: #94A3B8;
      margin: 0 0 20px;
    }

    .auth-tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      padding: 4px;
      border-radius: 10px;
      margin-bottom: 20px;
      gap: 4px;
    }

    .tab-btn {
      flex: 1;
      padding: 8px 6px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: #94A3B8;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: rgba(234, 216, 192, 0.15);
      color: var(--accent-gold, #EAD8C0);
    }

    .google-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: #FFFFFF;
      color: #1F2937;
      border: none;
      border-radius: 12px;
      padding: 12px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.2s;
    }

    .google-btn:hover {
      background: #F3F4F6;
    }

    .google-icon {
      width: 20px;
      height: 20px;
    }

    .social-divider {
      text-align: center;
      margin: 20px 0 14px;
      position: relative;
    }

    .social-divider::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
    }

    .social-divider span {
      position: relative;
      background: #121419;
      padding: 0 10px;
      font-size: 10px;
      color: #64748B;
      letter-spacing: 1px;
      font-weight: 700;
    }

    .quick-profiles {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .profile-demo-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }

    .profile-demo-card:hover {
      border-color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.05);
    }

    .profile-demo-card .badge {
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      margin-bottom: 2px;
    }

    .profile-demo-card .badge.vip {
      background: rgba(234, 216, 192, 0.2);
      color: var(--accent-gold, #EAD8C0);
    }

    .profile-demo-card .badge.premium {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
    }

    .profile-demo-card strong {
      color: #FFF;
      font-size: 13px;
    }

    .profile-demo-card .sub {
      color: #94A3B8;
      font-size: 11px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 12px;
      color: #CBD5E1;
      margin-bottom: 6px;
      font-weight: 500;
    }

    .phone-input-wrap {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      overflow: hidden;
    }

    .prefix {
      padding: 0 12px;
      font-size: 13px;
      color: var(--accent-gold, #EAD8C0);
      font-weight: 600;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    .text-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 10px 14px;
      color: #FFF;
      font-size: 14px;
      box-sizing: border-box;
    }

    .phone-input-wrap .text-input {
      border: none;
      background: transparent;
    }

    .text-input:focus {
      outline: none;
      border-color: var(--accent-gold, #EAD8C0);
    }

    .otp-field {
      font-size: 22px;
      letter-spacing: 8px;
      text-align: center;
      font-weight: 700;
    }

    .help-text {
      display: block;
      font-size: 11px;
      color: #64748B;
      margin-top: 4px;
    }

    .otp-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
      font-size: 11px;
    }

    .otp-hint code {
      color: var(--accent-gold, #EAD8C0);
      font-weight: 700;
    }

    .resend-btn {
      background: transparent;
      border: none;
      color: var(--accent-gold, #EAD8C0);
      cursor: pointer;
      font-size: 11px;
      text-decoration: underline;
    }

    .action-submit-btn {
      width: 100%;
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      border: none;
      border-radius: 12px;
      padding: 12px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s;
    }

    /* Profile Drawer */
    .drawer-backdrop {
      justify-content: flex-end;
      padding: 0;
    }

    .profile-drawer {
      background: #121419;
      border-left: 1px solid rgba(255, 255, 255, 0.16);
      width: 380px;
      max-width: 100vw;
      height: 100vh;
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .drawer-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .drawer-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--accent-gold, #EAD8C0);
    }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 24px;
    }

    .profile-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--accent-gold, #EAD8C0);
    }

    .profile-meta h4 {
      margin: 0 0 2px;
      color: #FFF;
      font-size: 16px;
    }

    .email-sub {
      font-size: 11px;
      color: #94A3B8;
      display: block;
      margin-bottom: 6px;
    }

    .membership-badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .member-tag {
      font-size: 9px;
      font-weight: 800;
      background: rgba(234, 216, 192, 0.2);
      color: var(--accent-gold, #EAD8C0);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .upgrade-link {
      background: transparent;
      border: none;
      color: #38BDF8;
      font-size: 10px;
      cursor: pointer;
      text-decoration: underline;
    }

    .profile-section {
      margin-bottom: 24px;
    }

    .profile-section h5 {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 1px;
      margin: 0 0 10px;
      text-transform: uppercase;
    }

    .privilege-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12px;
      color: #CBD5E1;
      margin-bottom: 10px;
    }

    .privilege-item .icon {
      font-size: 16px;
      color: var(--accent-gold, #EAD8C0);
    }

    .address-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px;
      font-size: 12px;
      color: #CBD5E1;
    }

    .address-box p {
      margin: 0 0 4px;
    }

    .drawer-footer {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sign-out-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #F87171;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .sign-out-btn:hover {
      background: rgba(239, 68, 68, 0.25);
    }
  `]
})
export class AuthModalComponent {
  auth = inject(AuthService);
  membership = inject(MembershipService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.auth.isAuthModalOpen()) {
      this.auth.closeAuthModal();
    }
    if (this.auth.isProfileDrawerOpen()) {
      this.auth.closeProfileDrawer();
    }
  }

  activeTab = signal<'social' | 'otp' | 'email'>('social');
  phoneNumber = '';
  enteredOtp = '';
  otpSent = signal<boolean>(false);
  emailAddress = 'concierge@luxury-atelier.com';
  passwordText = 'atelier2026!';

  sendOtp(): void {
    if (!this.phoneNumber) {
      alert('Please enter a mobile phone number.');
      return;
    }
    this.otpSent.set(true);
  }

  verifyOtp(): void {
    const success = this.auth.loginWithPhoneOtp(this.phoneNumber, this.enteredOtp || '123456');
    if (success) {
      this.otpSent.set(false);
      this.enteredOtp = '';
    }
  }

  selectDemoProfile(type: 'vip' | 'premium'): void {
    if (type === 'vip') {
      this.auth.saveUser({
        id: 'usr_luxury_901',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@vogue-society.com',
        phone: '+1 (555) 382-9014',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        membership_tier: 'VIP',
        auth_provider: 'google'
      });
    } else {
      this.auth.saveUser({
        id: 'usr_g_2',
        name: 'Camille Saint-Laurent',
        email: 'camille.sl@gmail.com',
        phone: '+1 (800) 840-7721',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        membership_tier: 'PREMIUM',
        auth_provider: 'google'
      });
    }
    this.auth.closeAuthModal();
  }
}
