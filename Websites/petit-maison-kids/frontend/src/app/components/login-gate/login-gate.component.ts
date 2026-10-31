import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-login-gate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isGateLocked()) {
      <div class="gate-overlay animate-fade-in" role="dialog" aria-modal="true" aria-label="Nanhi Maison Heirloom Privé Invitation Gate">
        <div class="gate-backdrop"></div>

        <div class="gate-modal animate-scale-up">
          
          <!-- Crest & Prestige Badge -->
          <div class="crest-row">
            <div class="royal-crest">
              <span class="material-symbols-outlined crown-icon">child_care</span>
            </div>
            <span class="prive-badge">BY NURSERY INVITATION ONLY</span>
          </div>

          <h2 class="gate-title">NANHI MAISON PRIVÉ</h2>
          <p class="gate-tagline">ORGANIC HEIRLOOM APPAREL & NURSERY COUTURE</p>

          <p class="gate-invitation-text">
            Step inside the bespoke nursery salon of <strong>Nanhi Maison</strong>. Access our limited-batch collection of GOTS-certified organic cotton layettes, pure mulberry silk celebratory kurtas, and handcrafted heirloom quilts.
          </p>

          <!-- VIP Perks Grid -->
          <div class="perks-grid">
            <div class="perk-box">
              <span class="perk-icon">🍼</span>
              <div class="perk-text">
                <strong>Heirloom Privilege PURE25</strong>
                <span>25% royal courtesy credited on your first nursery suite</span>
              </div>
            </div>
            <div class="perk-box">
              <span class="perk-icon">🧵</span>
              <div class="perk-text">
                <strong>Bespoke Monogramming</strong>
                <span>Complimentary gold/silk thread initial embroidery</span>
              </div>
            </div>
            <div class="perk-box">
              <span class="perk-icon">🌿</span>
              <div class="perk-text">
                <strong>Hypoallergenic Guarantee</strong>
                <span>Dermatologist certified & pH balanced for tender skin</span>
              </div>
            </div>
          </div>

          <!-- Auth Actions Tabs -->
          <div class="auth-box">
            @if (!otpSent()) {
              <!-- Step 1: Email or Mobile Input -->
              <div class="input-action-group">
                <div class="input-field">
                  <span class="material-symbols-outlined input-icon">mail</span>
                  <input
                    type="text"
                    [(ngModel)]="contactInput"
                    placeholder="Parent's email or mobile (+91 / +1)..."
                    (keydown.enter)="requestOtp()"
                    aria-label="Parent email or mobile"
                  />
                </div>
                <button class="btn-unlock sage-shimmer-btn" (click)="requestOtp()" [disabled]="!contactInput.trim()">
                  <span>Request Nursery Pass</span>
                  <span class="material-symbols-outlined">east</span>
                </button>
              </div>

              <!-- Quick One-Tap Options -->
              <div class="social-unlock-row">
                <button class="social-btn google-btn" (click)="quickGoogleUnlock()">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button class="social-btn apple-btn" (click)="quickGoogleUnlock()">
                  <span class="btn-icon"></span>
                  <span>Sign in with Apple</span>
                </button>
              </div>

              <!-- Tempting Frictionless Preview Bypass -->
              <div class="guest-pass-row">
                <button class="guest-preview-btn" (click)="unlockWithGuestPass()">
                  <span>Or enter with <strong>Complimentary Maison Preview Pass</strong></span>
                  <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
                </button>
              </div>
            } @else {
              <!-- Step 2: 4-Digit OTP Entry -->
              <div class="otp-verification-box">
                <p class="otp-instruction">VIP pass code dispatched to <strong>{{ contactInput }}</strong></p>
                <div class="otp-inputs">
                  <input type="text" maxlength="4" [(ngModel)]="otpCode" placeholder="2 0 2 6" class="otp-code-input" (keydown.enter)="verifyOtp()" aria-label="Enter 4 digit verification code" />
                </div>
                <div class="otp-actions">
                  <button class="btn-unlock sage-shimmer-btn" (click)="verifyOtp()">
                    <span>Unlock Maison & Registry Privileges</span>
                    <span class="material-symbols-outlined">check_circle</span>
                  </button>
                  <button class="btn-resend" (click)="otpSent.set(false)">Change Email / Mobile</button>
                </div>
              </div>
            }
          </div>

          <!-- Trust Badges Footer -->
          <div class="gate-footer">
            <span>🛡️ GOTS Organic Certified</span>
            <span>•</span>
            <span>Non-Toxic Vegetable Dyes</span>
            <span>•</span>
            <span>Dermatologist Approved</span>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .gate-overlay {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .gate-backdrop {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%);
      backdrop-filter: blur(24px);
    }

    .gate-modal {
      position: relative;
      z-index: 10;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 20px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4), 0 0 40px rgba(45, 90, 70, 0.15);
      width: 100%;
      max-width: 620px;
      padding: 36px 32px;
      text-align: center;
      color: #0F172A;
    }

    .crest-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;

      .royal-crest {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: #F1F5F9;
        border: 2px solid #2D5A46;
        display: flex;
        align-items: center;
        justify-content: center;

        .crown-icon {
          font-size: 30px;
          color: #2D5A46;
        }
      }

      .prive-badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        color: #1E3D30;
        background: #DCFCE7;
        border: 1px solid #86EFAC;
        padding: 4px 14px;
        border-radius: 999px;
      }
    }

    .gate-title {
      font-family: var(--font-display, 'Outfit', 'Playfair Display', serif);
      font-size: clamp(1.6rem, 3.5vw, 2.2rem);
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #0F172A;
      margin: 0 0 4px;
    }

    .gate-tagline {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #2D5A46;
      margin: 0 0 16px;
    }

    .gate-invitation-text {
      font-size: 0.88rem;
      line-height: 1.6;
      color: #334155;
      margin: 0 auto 24px;
      max-width: 520px;

      strong {
        color: #0F172A;
        font-weight: 700;
      }
    }

    .perks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
      text-align: left;
    }

    .perk-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 12px 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .perk-icon {
        font-size: 1.4rem;
      }

      .perk-text {
        strong {
          display: block;
          font-size: 0.76rem;
          color: #0F172A;
          font-weight: 700;
          margin-bottom: 3px;
        }

        span {
          display: block;
          font-size: 0.68rem;
          color: #475569;
          line-height: 1.35;
        }
      }
    }

    .auth-box {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .input-action-group {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;

      .input-field {
        flex: 1;
        display: flex;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        padding: 0 12px;

        .input-icon {
          font-size: 18px;
          color: #64748B;
          margin-right: 8px;
        }

        input {
          width: 100%;
          background: transparent;
          border: none;
          color: #0F172A;
          font-size: 0.85rem;
          padding: 12px 0;
          outline: none;

          &::placeholder {
            color: #64748B;
          }
        }
      }
    }

    .btn-unlock {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .sage-shimmer-btn {
      background: #2D5A46;
      color: #FFFFFF;
      box-shadow: 0 4px 14px rgba(45, 90, 70, 0.35);

      &:hover:not(:disabled) {
        background: #1E3D30;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(45, 90, 70, 0.45);
      }
    }

    .social-unlock-row {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;

      .social-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #CBD5E1;
        background: #FFFFFF;
        color: #0F172A;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
        }

        .btn-icon {
          font-size: 1.1rem;
        }
      }
    }

    .guest-pass-row {
      .guest-preview-btn {
        background: transparent;
        border: 1px dashed #94A3B8;
        border-radius: 8px;
        color: #334155;
        font-size: 0.78rem;
        padding: 8px 16px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;

        &:hover {
          background: #E2E8F0;
          color: #0F172A;
          border-color: #2D5A46;
        }

        strong {
          color: #2D5A46;
        }
      }
    }

    .otp-verification-box {
      .otp-instruction {
        font-size: 0.85rem;
        color: #334155;
        margin-bottom: 12px;

        strong {
          color: #0F172A;
        }
      }

      .otp-inputs {
        margin-bottom: 16px;

        .otp-code-input {
          text-align: center;
          font-family: monospace;
          font-size: 1.4rem;
          letter-spacing: 0.4em;
          padding: 8px 16px;
          border-radius: 8px;
          border: 2px solid #2D5A46;
          background: #FFFFFF;
          color: #0F172A;
          width: 140px;
          outline: none;
        }
      }

      .otp-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .btn-resend {
          background: none;
          border: none;
          color: #475569;
          font-size: 0.75rem;
          text-decoration: underline;
          cursor: pointer;

          &:hover {
            color: #0F172A;
          }
        }
      }
    }

    .gate-footer {
      display: flex;
      justify-content: center;
      gap: 12px;
      font-size: 0.7rem;
      color: #64748B;
      font-weight: 500;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    .animate-scale-up {
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 640px) {
      .perks-grid {
        grid-template-columns: 1fr;
      }
      .input-action-group {
        flex-direction: column;
      }
    }
  `]
})
export class LoginGateComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly membership = inject(MembershipService);

  readonly isGateLocked = signal(false);
  contactInput = '';
  otpCode = '2026';
  readonly otpSent = signal(false);

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const unlocked = localStorage.getItem('nanhi_maison_gate_unlocked');
      if (unlocked !== 'true') {
        this.isGateLocked.set(true);
      }
    }
  }

  requestOtp(): void {
    if (!this.contactInput.trim()) return;
    this.otpSent.set(true);
  }

  verifyOtp(): void {
    this.auth.loginWithGoogle();
    this.unlockGate();
  }

  quickGoogleUnlock(): void {
    this.auth.loginWithGoogle();
    this.unlockGate();
  }

  unlockWithGuestPass(): void {
    this.unlockGate();
  }

  private unlockGate(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nanhi_maison_gate_unlocked', 'true');
    }
    this.isGateLocked.set(false);
  }

  // Public method for Concierge / Owner Suite testing
  lockGate(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('nanhi_maison_gate_unlocked');
    }
    this.isGateLocked.set(true);
  }
}
