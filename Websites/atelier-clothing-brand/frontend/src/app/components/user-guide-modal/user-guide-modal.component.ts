import { Component, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="guide-title">
        
        <!-- Modal Top Bar -->
        <div class="modal-top">
          <div class="guide-badge">
            <span class="icon">auto_stories</span>
            <span>FIRST TIME VISITOR COMPASS</span>
          </div>
          <button class="close-btn" (click)="close.emit()" aria-label="Close Guide">✕</button>
        </div>

        <!-- Guide Header -->
        <div class="guide-header">
          <h2 id="guide-title">Welcome to the Centralised Luxury Fashion Factory</h2>
          <p class="subtitle">A master guide to exploring architectural couture, live stock lookup, VIP privileges, and omnichannel retail.</p>
        </div>

        <!-- Step Navigation Pills -->
        <div class="step-pills">
          <button 
            type="button" 
            class="pill" 
            [class.active]="activeStep() === 1" 
            (click)="activeStep.set(1)">
            1. Brand Factory & Heritage
          </button>
          <button 
            type="button" 
            class="pill" 
            [class.active]="activeStep() === 2" 
            (click)="activeStep.set(2)">
            2. Bespoke Fit & Sizing Matrix
          </button>
          <button 
            type="button" 
            class="pill" 
            [class.active]="activeStep() === 3" 
            (click)="activeStep.set(3)">
            3. Plus, Premium & VIP Club
          </button>
          <button 
            type="button" 
            class="pill" 
            [class.active]="activeStep() === 4" 
            (click)="activeStep.set(4)">
            4. Live Stock & Barcode Scanner
          </button>
          <button 
            type="button" 
            class="pill" 
            [class.active]="activeStep() === 5" 
            (click)="activeStep.set(5)">
            5. In-Store POS & All Payments
          </button>
        </div>

        <!-- Step Content Area -->
        <div class="step-content">
          @if (activeStep() === 1) {
            <div class="guide-step-body">
              <div class="step-visual">
                <span class="step-num">01</span>
                <span class="material-symbols-outlined visual-icon">factory</span>
              </div>
              <div class="step-details">
                <h3>One Centralised Roof • Single & Multi-Brand Factory</h3>
                <p>
                  This enterprise platform hosts both individual flagship Maisons (such as <strong>Atelier Vogue</strong> for adults and <strong>Petit Maison Kids</strong> for heirloom childrenswear) as well as an interconnected multi-brand directory.
                </p>
                <div class="feature-bullets">
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>Multi-Brand Directory:</strong> Browse women, men, unisex, and infants seamlessly under the same umbrella.
                    </div>
                  </div>
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>Promote Your Brand:</strong> Independent designers can opt for paid promotional sponsorship to spotlight their collection in the hero carousel.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (activeStep() === 2) {
            <div class="guide-step-body">
              <div class="step-visual">
                <span class="step-num">02</span>
                <span class="material-symbols-outlined visual-icon">straighten</span>
              </div>
              <div class="step-details">
                <h3>Bespoke Italian Tailoring & Sizing Accuracy</h3>
                <p>
                  Every garment is meticulously proportioned. Whether choosing double-faced cashmere coats or silk evening wear, our interactive size guides ensure flawless drape.
                </p>
                <div class="feature-bullets">
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>Adult Haute Couture:</strong> Cut true to Italian sizing (XS to XL) with contour seams and cupro lining.
                    </div>
                  </div>
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>Kids "Room-to-Grow":</strong> Foldable cuffs extend to accommodate growth spurts, doubling the wearable lifespan.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (activeStep() === 3) {
            <div class="guide-step-body">
              <div class="step-visual">
                <span class="step-num">03</span>
                <span class="material-symbols-outlined visual-icon">workspace_premium</span>
              </div>
              <div class="step-details">
                <h3>Exclusive Plus, Premium & VIP Black Privileges</h3>
                <p>
                  Elevate your patronage with tier-based savings and bespoke privileges automatically deducted at checkout.
                </p>
                <div class="tier-grid">
                  <div class="tier-box plus">
                    <span class="badge">PLUS MEMBER</span>
                    <h4>10% Off</h4>
                    <p>Free express delivery & 24h early access to seasonal runway drops.</p>
                  </div>
                  <div class="tier-box premium">
                    <span class="badge">PREMIUM</span>
                    <h4>15% Off</h4>
                    <p>Dedicated AI + human stylist, free courier returns, and luxury birthday gift.</p>
                  </div>
                  <div class="tier-box vip">
                    <span class="badge">VIP BLACK</span>
                    <h4>25% Off</h4>
                    <p>Bespoke custom tailoring, in-store VIP lounge invites, and private runway salon.</p>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (activeStep() === 4) {
            <div class="guide-step-body">
              <div class="step-visual">
                <span class="step-num">04</span>
                <span class="material-symbols-outlined visual-icon">barcode_scanner</span>
              </div>
              <div class="step-details">
                <h3>Real-Time Live Stock & Camera Barcode Scanner</h3>
                <p>
                  Our inventory is synced live with central ateliers and flagship registers. Never guess whether a piece is available.
                </p>
                <div class="feature-bullets">
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>Live Stock Badges:</strong> Cards display "Only X Left" or "In Stock" updated in real-time.
                    </div>
                  </div>
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>Camera Barcode Scanner:</strong> Scan any tag with your device camera to instantly view stock, specifications, or add to bag!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          @if (activeStep() === 5) {
            <div class="guide-step-body">
              <div class="step-visual">
                <span class="step-num">05</span>
                <span class="material-symbols-outlined visual-icon">point_of_sale</span>
              </div>
              <div class="step-details">
                <h3>Omnichannel In-Store POS & Universal Payments</h3>
                <p>
                  Shop online with any global payment method or visit our boutiques for instant in-store POS checkouts.
                </p>
                <div class="feature-bullets">
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>All Payment Options:</strong> Credit/Debit Cards, UPI & Dynamic QR, Apple Pay, Google Pay, Net Banking, Klarna BNPL, and Cash on Delivery.
                    </div>
                  </div>
                  <div class="bullet-item">
                    <span class="material-symbols-outlined check">check_circle</span>
                    <div>
                      <strong>In-Store POS Mode:</strong> Store associates can ring up walk-ins, scan barcodes, and generate printable thermal receipts with QR tracking!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Modal Bottom Actions -->
        <div class="modal-bottom">
          <div class="step-dots">
            @for (s of [1, 2, 3, 4, 5]; track s) {
              <span class="dot" [class.active]="activeStep() === s" (click)="activeStep.set(s)"></span>
            }
          </div>
          <div class="btn-group">
            @if (activeStep() > 1) {
              <button class="nav-btn prev" (click)="activeStep.set(activeStep() - 1)">Previous</button>
            }
            @if (activeStep() < 5) {
              <button class="nav-btn next" (click)="activeStep.set(activeStep() + 1)">Next Step →</button>
            } @else {
              <button class="nav-btn start" (click)="close.emit()">Start Exploring Maison ✦</button>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 6, 8, 0.85);
      backdrop-filter: blur(12px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      background: #121419;
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.16));
      border-radius: 20px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
      overflow: hidden;
    }

    .modal-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 24px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .guide-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.1);
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(234, 216, 192, 0.2);
    }

    .guide-badge .icon {
      font-size: 16px;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted, #64748B);
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      color: #FFF;
      background: rgba(255, 255, 255, 0.1);
    }

    .guide-header {
      padding: 16px 24px 12px;
    }

    .guide-header h2 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 26px;
      margin: 0 0 6px 0;
      color: var(--text-primary, #F8FAFC);
    }

    .subtitle {
      font-size: 13px;
      color: var(--text-secondary, #94A3B8);
      margin: 0;
    }

    .step-pills {
      display: flex;
      gap: 8px;
      padding: 0 24px 14px;
      overflow-x: auto;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-secondary, #94A3B8);
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 9999px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .pill:hover {
      color: #FFF;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .pill.active {
      background: rgba(234, 216, 192, 0.15);
      border-color: var(--accent-gold, #EAD8C0);
      color: var(--accent-gold, #EAD8C0);
      font-weight: 600;
    }

    .step-content {
      padding: 24px;
      flex: 1;
      overflow-y: auto;
    }

    .guide-step-body {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }

    .step-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 90px;
      background: rgba(234, 216, 192, 0.05);
      border: 1px solid rgba(234, 216, 192, 0.2);
      border-radius: 16px;
      flex-shrink: 0;
    }

    .step-num {
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-gold, #EAD8C0);
      letter-spacing: 1px;
    }

    .visual-icon {
      font-size: 36px;
      color: var(--accent-gold, #EAD8C0);
      margin-top: 4px;
    }

    .step-details h3 {
      font-family: var(--font-serif, 'Playfair Display', serif);
      font-size: 20px;
      color: var(--text-primary, #F8FAFC);
      margin: 0 0 8px;
    }

    .step-details p {
      font-size: 14px;
      color: var(--text-secondary, #94A3B8);
      line-height: 1.6;
      margin: 0 0 16px;
    }

    .feature-bullets {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      color: var(--text-primary, #F8FAFC);
      line-height: 1.5;
    }

    .bullet-item .check {
      color: #10B981;
      font-size: 18px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .tier-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 10px;
    }

    .tier-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }

    .tier-box.vip {
      border-color: var(--accent-gold, #EAD8C0);
      background: rgba(234, 216, 192, 0.05);
    }

    .tier-box .badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--accent-gold, #EAD8C0);
      display: inline-block;
      margin-bottom: 4px;
    }

    .tier-box h4 {
      font-size: 20px;
      margin: 4px 0;
      color: #FFF;
    }

    .tier-box p {
      font-size: 11px;
      color: var(--text-secondary, #94A3B8);
      margin: 0;
      line-height: 1.4;
    }

    .modal-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(0, 0, 0, 0.2);
    }

    .step-dots {
      display: flex;
      gap: 8px;
    }

    .step-dots .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.2s;
    }

    .step-dots .dot.active {
      width: 24px;
      border-radius: 4px;
      background: var(--accent-gold, #EAD8C0);
    }

    .btn-group {
      display: flex;
      gap: 10px;
    }

    .nav-btn {
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .nav-btn.prev {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--text-primary, #F8FAFC);
    }

    .nav-btn.next {
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      border: none;
      color: #0A0B0E;
    }

    .nav-btn.start {
      background: #10B981;
      border: none;
      color: #FFF;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    }

    /* Folding screen media query */
    @media (max-width: 600px) {
      .tier-grid {
        grid-template-columns: 1fr;
      }
      .guide-step-body {
        flex-direction: column;
      }
      .step-visual {
        width: 100%;
        height: 60px;
        flex-direction: row;
        gap: 12px;
      }
    }
  `]
})
export class UserGuideModalComponent {
  readonly close = output<void>();
  activeStep = signal<number>(1);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
