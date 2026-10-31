import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (auth.isAuthModalOpen()) {
      <div class="auth-backdrop" (click)="auth.closeAuthModal()">
        <div class="auth-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="auth-header">
            <span class="auth-badge">PETIT MAISON NURSERY ACCOUNT</span>
            <button class="close-btn" (click)="auth.closeAuthModal()">✕</button>
          </div>

          <!-- 1. Profile Mode (Logged In User) -->
          @if (auth.currentUser() && auth.authMode() === 'profile') {
            <div class="profile-view">
              <div class="avatar-row">
                <img [src]="auth.currentUser()?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'" alt="Avatar" class="avatar-img" />
                <div class="user-meta">
                  <h3>{{ auth.currentUser()?.name }}</h3>
                  <span class="email-tag">{{ auth.currentUser()?.email }}</span>
                  <div class="tier-pill" [class]="auth.currentUser()?.membership_tier?.toLowerCase()">
                    <span class="material-symbols-outlined">stars</span>
                    {{ auth.currentUser()?.membership_tier }} FAMILY CLUB
                  </div>
                </div>
              </div>

              <div class="perks-summary-card">
                <div class="perk-stat">
                  <span class="stat-num">{{ auth.currentUser()?.points || 350 }}</span>
                  <span class="stat-label">Nursery Loyalty Points</span>
                </div>
                <div class="perk-stat">
                  <span class="stat-num">{{ membership.discountPercentage() }}%</span>
                  <span class="stat-label">Storewide Discount</span>
                </div>
              </div>

              <div class="profile-actions">
                <button class="upgrade-btn" (click)="membership.openModal(); auth.closeAuthModal()">
                  <span class="material-symbols-outlined">auto_awesome</span>
                  Upgrade Family Membership
                </button>
                <button class="logout-btn" (click)="auth.logout()">Sign Out</button>
              </div>
            </div>
          }

          <!-- 2. Login Mode -->
          @if (!auth.currentUser() && auth.authMode() === 'login') {
            <div class="login-view">
              <h2>Sign In to Petit Maison</h2>
              <p class="sub">Access exclusive member baby gifts, nursery registries, and track orders.</p>

              <!-- One-Click Google Sign In -->
              <button class="google-signin-btn" (click)="auth.loginWithGoogle()">
                <svg viewBox="0 0 24 24" class="google-svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <div class="auth-divider"><span>OR PHONE OTP / EMAIL</span></div>

              <!-- Phone OTP Form -->
              <div class="phone-block">
                <label>Mobile Number (Instant OTP)</label>
                <div class="phone-input-row">
                  <span class="phone-prefix">+33</span>
                  <input type="tel" [(ngModel)]="phone" placeholder="6 12 34 56 78" class="phone-input" />
                  <button class="send-otp-btn" (click)="onSendOtp()">Send OTP</button>
                </div>
              </div>

              <!-- Email / Password Form -->
              <div class="email-block">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="email" placeholder="parent@petitmaison.kids" class="text-input" />
                <label>Password</label>
                <input type="password" [(ngModel)]="password" placeholder="••••••••" class="text-input" />
                <button class="email-login-btn" (click)="onEmailLogin()">Sign In with Email</button>
              </div>
            </div>
          }

          <!-- 3. OTP Verification Mode -->
          @if (!auth.currentUser() && auth.authMode() === 'otp') {
            <div class="otp-view">
              <h2>Verify Mobile OTP</h2>
              <p class="sub">Enter the 4-digit verification code sent to <strong>+33 {{ phone }}</strong> (Use demo code <strong>2026</strong>)</p>

              <div class="otp-box">
                <input type="text" maxlength="4" [(ngModel)]="otpCode" placeholder="2026" class="otp-input" />
                <button class="verify-btn" (click)="onVerifyOtp()">Confirm & Sign In</button>
              </div>

              <button class="back-link" (click)="auth.openAuthModal('login')">← Back to Login Options</button>
            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    .auth-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 39, 32, 0.7);
      backdrop-filter: blur(8px);
      z-index: 1250;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .auth-dialog {
      background: #FAF6EE;
      color: #2b3a32;
      width: 95vw;
      max-width: 460px;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(122, 168, 132, 0.3);
      padding: 24px;
    }

    .auth-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .auth-badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #7AA884;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #666;
      }
    }

    h2 {
      margin: 0 0 6px;
      font-size: 1.35rem;
      font-weight: 800;
    }

    .sub {
      font-size: 0.82rem;
      color: #66776e;
      margin-bottom: 20px;
      line-height: 1.4;
    }

    .google-signin-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: white;
      color: #3c4043;
      border: 1px solid #dadce0;
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
      transition: all 0.2s ease;

      &:hover {
        background: #f8f9fa;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .google-svg {
        width: 18px;
        height: 18px;
      }
    }

    .auth-divider {
      text-align: center;
      margin: 18px 0;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
      }

      span {
        position: relative;
        background: #FAF6EE;
        padding: 0 10px;
        font-size: 0.68rem;
        color: #8c9a92;
        font-weight: 700;
        letter-spacing: 0.06em;
      }
    }

    .phone-block, .email-block {
      margin-bottom: 16px;

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 6px;
        color: #2b3a32;
      }
    }

    .phone-input-row {
      display: flex;
      align-items: center;
      gap: 6px;

      .phone-prefix {
        background: #EBE6DC;
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 700;
      }

      .phone-input {
        flex: 1;
        padding: 9px 12px;
        border-radius: 8px;
        border: 1px solid #dadce0;
        font-size: 0.85rem;
        outline: none;
        &:focus { border-color: #7AA884; }
      }

      .send-otp-btn {
        background: #7AA884;
        color: white;
        border: none;
        padding: 9px 14px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        &:hover { background: #679270; }
      }
    }

    .text-input {
      width: 100%;
      box-sizing: border-box;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid #dadce0;
      font-size: 0.85rem;
      margin-bottom: 10px;
      outline: none;
      &:focus { border-color: #7AA884; }
    }

    .email-login-btn {
      width: 100%;
      background: #2b3a32;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      margin-top: 4px;
      &:hover { background: #1c2721; }
    }

    .otp-input {
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      letter-spacing: 0.5em;
      font-size: 1.6rem;
      font-weight: 800;
      padding: 12px;
      border-radius: 10px;
      border: 2px solid #7AA884;
      background: white;
      margin-bottom: 14px;
      outline: none;
    }

    .verify-btn {
      width: 100%;
      background: #7AA884;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      &:hover { background: #679270; }
    }

    .back-link {
      background: none;
      border: none;
      color: #6d7d74;
      font-size: 0.78rem;
      cursor: pointer;
      margin-top: 14px;
      text-decoration: underline;
    }

    .profile-view {
      .avatar-row {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 18px;

        .avatar-img {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #7AA884;
        }

        .user-meta {
          h3 { margin: 0; font-size: 1.15rem; font-weight: 800; }
          .email-tag { font-size: 0.75rem; color: #66776e; }
          .tier-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.68rem;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 4px;
            margin-top: 4px;
            background: #7AA884;
            color: white;

            .material-symbols-outlined { font-size: 13px; }
            &.vip { background: #FF9F1C; }
            &.premium { background: #8E7CC3; }
          }
        }
      }

      .perks-summary-card {
        background: #EBE6DC;
        border-radius: 12px;
        padding: 14px;
        display: flex;
        justify-content: space-around;
        margin-bottom: 18px;

        .perk-stat {
          text-align: center;
          .stat-num { display: block; font-size: 1.4rem; font-weight: 800; color: #2b3a32; }
          .stat-label { font-size: 0.68rem; color: #66776e; font-weight: 600; }
        }
      }

      .profile-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .upgrade-btn {
          width: 100%;
          background: #7AA884;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .logout-btn {
          background: none;
          border: 1px solid rgba(0,0,0,0.15);
          color: #666;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.78rem;
          cursor: pointer;
          &:hover { background: rgba(0,0,0,0.05); }
        }
      }
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
  }

  phone = '6 12 34 56 78';
  otpCode = '2026';
  email = '';
  password = '';

  onSendOtp(): void {
    this.auth.requestOtp(this.phone);
  }

  onVerifyOtp(): void {
    this.auth.verifyOtp(this.otpCode);
  }

  onEmailLogin(): void {
    if (this.email) {
      this.auth.loginWithEmail(this.email, this.password);
    }
  }
}
