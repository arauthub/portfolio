import { Component, inject, signal, OnInit, output } from '@angular/core';
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
      <div class="gate-overlay animate-fade-in" role="dialog" aria-modal="true" aria-label="Atelier Riwayat Privé Invitation Gate">
        <div class="gate-backdrop"></div>

        <div class="gate-modal animate-scale-up">
          
          <!-- Crest & Prestige Badge -->
          <div class="crest-row">
            <div class="royal-crest">
              <span class="material-symbols-outlined crown-icon">crown</span>
            </div>
            <span class="prive-badge">BY ROYAL INVITATION ONLY</span>
          </div>

          <h2 class="gate-title">ATELIER RIWAYAT PRIVÉ</h2>
          <p class="gate-tagline">AUTUMN / WINTER 2026 RUNWAY & FESTIVE HAUTE COUTURE</p>

          <p class="gate-invitation-text">
            Welcome to the private digital salon of <strong>Atelier Riwayat</strong>. Access our limited-production archival collection of 35+ Banarasi silk weaves, Awadhi dabka zardozi, and bespoke Italian tailoring.
          </p>

          <!-- VIP Perks Grid -->
          <div class="perks-grid">
            <div class="perk-box">
              <span class="perk-icon">👑</span>
              <div class="perk-text">
                <strong>Privé Privilege VOGUE25</strong>
                <span>25% royal courtesy credited to your cart</span>
              </div>
            </div>
            <div class="perk-box">
              <span class="perk-icon">🧵</span>
              <div class="perk-text">
                <strong>Karigar Guild Registry</strong>
                <span>Direct artisan reservations & custom sizing</span>
              </div>
            </div>
            <div class="perk-box">
              <span class="perk-icon">✈️</span>
              <div class="perk-text">
                <strong>Shahi Express Courier</strong>
                <span>Complimentary insured air courier</span>
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
                    placeholder="Enter email or mobile (+91 / +1)..."
                    (keydown.enter)="requestOtp()"
                  />
                </div>
                <button class="btn-unlock gold-shimmer-btn" (click)="requestOtp()" [disabled]="!contactInput.trim()">
                  <span>Request VIP Access Pass</span>
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
                  <span>Or enter with <strong>Complimentary Privé Preview Pass</strong></span>
                  <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
                </button>
              </div>
            } @else {
              <!-- Step 2: 4-Digit OTP Entry -->
              <div class="otp-verification-box">
                <p class="otp-instruction">VIP pass code sent to <strong>{{ contactInput }}</strong></p>
                <div class="otp-inputs">
                  <input type="text" maxlength="4" [(ngModel)]="otpCode" placeholder="2 0 2 6" class="otp-code-input" (keydown.enter)="verifyOtp()" />
                </div>
                <div class="otp-actions">
                  <button class="btn-unlock gold-shimmer-btn" (click)="verifyOtp()">
                    <span>Unlock Salon & Cart Privileges</span>
                    <span class="material-symbols-outlined">check_circle</span>
                  </button>
                  <button class="btn-resend" (click)="otpSent.set(false)">Change Email / Number</button>
                </div>
              </div>
            }
          </div>

          <!-- Trust Badges Footer -->
          <div class="gate-footer">
            <span>🔒 256-Bit Bank Encryption</span>
            <span>•</span>
            <span>Silk Mark Certified Weaves</span>
            <span>•</span>
            <span>Verified Artisan Direct</span>
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
      background: radial-gradient(circle at center, rgba(15, 17, 24, 0.94) 0%, rgba(5, 6, 8, 0.98) 100%);
      backdrop-filter: blur(24px);
    }

    .gate-modal {
      position: relative;
      z-index: 10;
      background: linear-gradient(145deg, #181b22 0%, #101217 100%);
      border: 1px solid rgba(234, 216, 192, 0.35);
      border-radius: 16px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 216, 192, 0.12);
      width: 100%;
      max-width: 620px;
      padding: 36px 32px;
      text-align: center;
      color: #f8fafc;
    }

    .crest-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;

      .royal-crest {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: rgba(234, 216, 192, 0.12);
        border: 1.5px solid var(--text-accent, #ead8c0);
        display: flex;
        align-items: center;
        justify-content: center;

        .crown-icon {
          font-size: 28px;
          color: var(--text-accent, #ead8c0);
        }
      }

      .prive-badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        color: var(--text-accent, #ead8c0);
        background: rgba(234, 216, 192, 0.08);
        border: 1px solid rgba(234, 216, 192, 0.2);
        padding: 3px 12px;
        border-radius: 999px;
      }
    }

    .gate-title {
      font-family: var(--font-display, 'Syne', sans-serif);
      font-size: clamp(1.6rem, 3.5vw, 2.2rem);
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #fff;
      margin: 0 0 4px;
    }

    .gate-tagline {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: var(--text-accent, #ead8c0);
      margin: 0 0 16px;
    }

    .gate-invitation-text {
      font-size: 0.85rem;
      color: #cbd5e1;
      line-height: 1.55;
      margin: 0 auto 24px;
      max-width: 520px;

      strong {
        color: #fff;
      }
    }

    .perks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
      text-align: left;

      .perk-box {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .perk-icon {
          font-size: 18px;
        }

        .perk-text {
          display: flex;
          flex-direction: column;
          gap: 2px;

          strong {
            font-size: 0.72rem;
            color: #fff;
          }

          span {
            font-size: 0.65rem;
            color: #cbd5e1;
            line-height: 1.25;
          }
        }
      }
    }

    .auth-box {
      margin-bottom: 20px;

      .input-action-group {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;

        .input-field {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 0 14px;

          .input-icon {
            font-size: 18px;
            color: var(--text-accent, #ead8c0);
          }

          input {
            width: 100%;
            height: 46px;
            background: transparent;
            border: none;
            color: #fff;
            font-family: inherit;
            font-size: 0.85rem;
            outline: none;

            &::placeholder {
              color: #94a3b8;
            }
          }
        }

        .btn-unlock {
          background: var(--text-accent, #ead8c0);
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 0 20px;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: filter 0.2s, transform 0.2s;

          &:hover:not(:disabled) {
            filter: brightness(1.15);
            transform: translateY(-1px);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }

      .social-unlock-row {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;

        .social-btn {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.12);
          }

          .btn-icon {
            font-size: 16px;
          }
        }
      }

      .guest-pass-row {
        .guest-preview-btn {
          background: transparent;
          border: none;
          color: var(--text-accent, #ead8c0);
          font-size: 0.78rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-decoration: underline;
          transition: opacity 0.2s;

          &:hover {
            opacity: 0.85;
          }
        }
      }

      .otp-verification-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .otp-instruction {
          font-size: 0.82rem;
          color: #cbd5e1;
          margin: 0;

          strong { color: #fff; }
        }

        .otp-code-input {
          width: 180px;
          height: 48px;
          text-align: center;
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 12px;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid var(--text-accent, #ead8c0);
          border-radius: 8px;
          color: #fff;
          outline: none;
        }

        .otp-actions {
          display: flex;
          align-items: center;
          gap: 12px;

          .btn-resend {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 0.72rem;
            cursor: pointer;
            text-decoration: underline;

            &:hover { color: #fff; }
          }
        }
      }
    }

    .gate-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 0.68rem;
      color: #94a3b8;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
    }

    .animate-scale-up {
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.92); }
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
      const unlocked = localStorage.getItem('atelier_prive_gate_unlocked');
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
    const email = this.contactInput.includes('@') ? this.contactInput : `${this.contactInput}@atelier-prive.in`;
    this.auth.signInWithGoogle(); // Quick royal sign-in simulation
    this.unlockGate();
  }

  quickGoogleUnlock(): void {
    this.auth.signInWithGoogle();
    this.unlockGate();
  }

  unlockWithGuestPass(): void {
    this.unlockGate();
  }

  private unlockGate(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('atelier_prive_gate_unlocked', 'true');
    }
    this.isGateLocked.set(false);
  }

  // Public method for Owner Suite / Concierge testing
  lockGate(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('atelier_prive_gate_unlocked');
    }
    this.isGateLocked.set(true);
  }
}
