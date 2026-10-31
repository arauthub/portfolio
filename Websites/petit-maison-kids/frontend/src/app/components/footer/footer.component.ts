import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <footer id="craft" class="luxury-footer main-footer">
      <!-- 1. VIP Newsletter Strip (Full-Width Matching Atelier) -->
      <div class="newsletter-strip">
        <div class="strip-content container-12">
          <div class="text-block">
            <span class="sub-label">THE NANHI MAISON HEIRLOOM CIRCLE</span>
            <h4 class="font-display">Receive Private Nursery Trunk Show Invitations & 15% Heirloom Privilege</h4>
            <p>Subscribers receive seasonal festive drops, complimentary monogramming previews, and pure organic mulmul care guides.</p>
          </div>

          <div class="form-block">
            @if (!subscribed) {
              <div class="subscribe-input-group">
                <input
                  type="email"
                  placeholder="Enter parent email address..."
                  [(ngModel)]="emailInput"
                  (keyup.enter)="subscribeNewsletter()"
                  aria-label="Parent email address"
                />
                <button class="gold-shimmer-btn" (click)="subscribeNewsletter()">JOIN CIRCLE</button>
              </div>
            } @else {
              <div class="subscribed-pill">
                <mat-icon class="icon">check_circle</mat-icon>
                <span>Welcome to the Nanhi Maison Circle. Use code <strong>NANHI15</strong> at checkout for 15% off.</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- 2. Certifications & Eco Trust Ribbon (12-Column Alignment) -->
      <div class="cert-ribbon">
        <div class="container-12">
          <div class="grid-12 cert-grid">
            <div class="col-3 cert-item">
              <mat-icon class="cert-icon">eco</mat-icon>
              <div>
                <strong>100% GOTS Organic Mulmul</strong>
                <p>Pure featherlight Jaipur & Chanderi cotton</p>
              </div>
            </div>

            <div class="col-3 cert-item">
              <mat-icon class="cert-icon">shield</mat-icon>
              <div>
                <strong>100% Scratch-Free Lined</strong>
                <p>Combed cotton shields against metallic zari</p>
              </div>
            </div>

            <div class="col-3 cert-item">
              <mat-icon class="cert-icon">local_shipping</mat-icon>
              <div>
                <strong>Bluedart Luxury Air Courier</strong>
                <p>Free express delivery across India over ₹2,499</p>
              </div>
            </div>

            <div class="col-3 cert-item">
              <mat-icon class="cert-icon">brush</mat-icon>
              <div>
                <strong>Royal Zari Monogram</strong>
                <p>Custom child's name in pure gold thread</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Main Links & Flagships 12-Column Grid -->
      <div class="container-12 footer-main-content">
        <div class="grid-12 footer-main-grid">
          <!-- Col 1 to 4: Brand Manifesto -->
          <div class="col-4 brand-column">
            <div class="brand-crest-row">
              <mat-icon class="crest">auto_awesome</mat-icon>
              <h3 class="footer-logo font-display">NANHI MAISON</h3>
            </div>
            <p class="brand-manifesto">
              Royal Indian Heirloom Childrenswear & Nursery Couture (0 - 12Y). Handcrafted in pure organic mulmul and Jaipur handloom silks with certified scratch-free cotton lining.
            </p>

            <div class="tech-stack-badges">
              <span class="badge">100% GOTS Certified</span>
              <span class="badge">Scratch-Free Lined</span>
              <span class="badge">Bluedart Courier</span>
              <span class="badge">3D Secure Checkout</span>
              <span class="badge">Custom Monograms</span>
              <span class="badge">Heirloom Traceable</span>
            </div>
          </div>

          <!-- Col 5 to 6: Festive Collections -->
          <div class="col-2 links-column">
            <h5 class="col-title font-display">FESTIVE HEIRLOOMS</h5>
            <ul class="col-list">
              <li><a (click)="filterCat('shishu-newborn')">Shishu Newborn (0 - 24M)</a></li>
              <li><a (click)="filterCat('chhota-nawab')">Chhota Nawab Kurta Dhoti</a></li>
              <li><a (click)="filterCat('nanhi-pari-lehengas')">Nanhi Pari Twirl Lehengas</a></li>
              <li><a (click)="filterCat('sibling-festive-jodi')">Sibling Matching Jodi</a></li>
              <li><a (click)="filterCat('organic-mulmul')">Organic Mulmul Sleepwear</a></li>
              <li><a (click)="scrollTo('lookbook')">Festive 2026 Lookbook</a></li>
            </ul>
          </div>

          <!-- Col 7 to 9: Client Concierge -->
          <div class="col-3 links-column">
            <h5 class="col-title font-display">CLIENT CONCIERGE</h5>
            <ul class="col-list">
              <li><a (click)="scrollTo('catalog')">Royal Zari Monogramming</a></li>
              <li><a (click)="scrollTo('catalog')">Scratch-Free Certification</a></li>
              <li><a (click)="scrollTo('catalog')">Bluedart Express Tracking</a></li>
              <li><a (click)="scrollTo('catalog')">Keepsake Wooden Trunk Gifting</a></li>
              <li><a (click)="scrollTo('catalog')">Master Darzi Video Fitting</a></li>
            </ul>
          </div>

          <!-- Col 10 to 12: Flagships & Wagtail Partner Suite -->
          <div class="col-3 links-column admin-box">
            <h5 class="col-title font-display">FLAGSHIP BOUTIQUES</h5>
            <ul class="col-list flagships-list">
              <li><strong>New Delhi:</strong> Khan Market & Mehrauli</li>
              <li><strong>Mumbai:</strong> Bandra West & Kala Ghoda</li>
              <li><strong>Bengaluru:</strong> Lavelle Road</li>
              <li><strong>Jaipur:</strong> C-Scheme Heritage Quarter</li>
            </ul>

            <div class="concierge-contact-card">
              <div class="contact-item">
                <mat-icon class="icon">call</mat-icon>
                <span>+91 98200 54321 (Patron Concierge)</span>
              </div>
              <div class="contact-item">
                <mat-icon class="icon">mail</mat-icon>
                <span>concierge&#64;nanhimaison.com</span>
              </div>
            </div>

            <div class="cms-link-card" (click)="openOwner.emit()">
              <mat-icon class="lock-icon">admin_panel_settings</mat-icon>
              <div>
                <strong>Maison Partner Suite</strong>
                <span>Wagtail Admin & Multi-Store CMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Bottom Copyright & Legal Ribbon -->
      <div class="footer-bottom">
        <div class="container-12 bottom-inner">
          <span>© 2026 NANHI MAISON HEIRLOOMS PVT. LTD. ALL RIGHTS RESERVED.</span>
          <div class="payment-badges-row">
            <span class="pay-chip">VISA</span>
            <span class="pay-chip">MASTERCARD</span>
            <span class="pay-chip">RUPAY</span>
            <span class="pay-chip">UPI / QR</span>
            <span class="pay-chip">APPLE PAY</span>
            <span class="pay-chip">KLARNA</span>
          </div>
          <div class="bottom-links">
            <a>Organic Certification</a>
            <span>•</span>
            <a>Terms of Sovereign Craft</a>
            <span>•</span>
            <a>Bluedart Express Courier</a>
            <span>•</span>
            <a>Privacy & Nursery Safety</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .luxury-footer {
      background-color: #1E293B;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #CBD5E1;
    }

    .newsletter-strip {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 44px 24px;
      background: #0F172A;

      .strip-content {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 32px;

        .text-block {
          max-width: 620px;

          .sub-label {
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 0.14em;
            color: #86EFAC;
            display: block;
            margin-bottom: 8px;
          }

          h4 {
            font-size: 1.55rem;
            font-weight: 800;
            color: #FFFFFF;
            line-height: 1.25;
            margin-bottom: 6px;
          }

          p {
            font-size: 0.85rem;
            color: #CBD5E1;
            margin: 0;
            line-height: 1.5;
          }
        }

        .form-block {
          flex: 1;
          max-width: 480px;

          .subscribe-input-group {
            display: flex;
            border: 1px solid #475569;
            border-radius: 8px;
            overflow: hidden;
            background: #1E293B;

            input {
              flex: 1;
              background: transparent;
              border: none;
              padding: 14px 18px;
              color: #FFFFFF;
              font-size: 0.82rem;
              outline: none;

              &::placeholder {
                color: #94A3B8;
              }
            }

            button {
              background: #2D5A46;
              color: #FFFFFF;
              border: none;
              padding: 0 24px;
              font-size: 0.75rem;
              font-weight: 800;
              letter-spacing: 0.1em;
              cursor: pointer;
              transition: filter 0.2s ease, background 0.2s;

              &:hover {
                background: #1E3D30;
                filter: brightness(1.15);
              }
            }
          }

          .subscribed-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(16, 185, 129, 0.12);
            border: 1px solid #10B981;
            color: #ECFDF5;
            padding: 12px 18px;
            border-radius: 8px;
            font-size: 0.82rem;

            .icon {
              font-size: 20px;
              color: #10B981;
            }

            strong {
              color: #FFFFFF;
            }
          }
        }
      }
    }

    .cert-ribbon {
      background: #141E2E;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px 0;

      .cert-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }

      .cert-item {
        display: flex;
        align-items: center;
        gap: 12px;

        .cert-icon {
          color: #86EFAC;
          font-size: 28px;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        strong {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 2px;
        }

        p {
          margin: 0;
          font-size: 0.72rem;
          color: #CBD5E1;
          line-height: 1.35;
        }
      }
    }

    .footer-main-content {
      padding: 56px 24px;
    }

    .footer-main-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      gap: 32px;
      row-gap: 40px;

      .brand-column {
        .brand-crest-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;

          .crest {
            color: #86EFAC;
            font-size: 24px;
            width: 24px;
            height: 24px;
          }

          .footer-logo {
            font-size: 1.35rem;
            font-weight: 800;
            letter-spacing: 0.12em;
            color: #FFFFFF;
            margin: 0;
          }
        }

        .brand-manifesto {
          font-size: 0.82rem;
          line-height: 1.6;
          color: #CBD5E1;
          margin-bottom: 20px;
          max-width: 380px;
        }

        .tech-stack-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;

          .badge {
            background: #0F172A;
            border: 1px solid #334155;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 700;
            color: #86EFAC;
          }
        }
      }

      .links-column {
        .col-title {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          margin-bottom: 18px;
        }

        .col-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.8rem;

          li {
            color: #CBD5E1;

            strong {
              color: #FFFFFF;
              margin-right: 4px;
            }

            a {
              color: #CBD5E1;
              text-decoration: none;
              cursor: pointer;
              transition: color 0.2s ease;

              &:hover {
                color: #86EFAC;
              }
            }
          }
        }

        &.admin-box {
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 18px;

          .concierge-contact-card {
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px solid #334155;
            display: flex;
            flex-direction: column;
            gap: 8px;

            .contact-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.72rem;
              color: #CBD5E1;

              .icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
                color: #86EFAC;
              }
            }
          }

          .cms-link-card {
            margin-top: 14px;
            padding: 10px;
            background: rgba(134, 239, 172, 0.08);
            border: 1px solid rgba(134, 239, 172, 0.2);
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: rgba(134, 239, 172, 0.15);
              border-color: #86EFAC;
            }

            .lock-icon {
              color: #86EFAC;
              font-size: 20px;
              width: 20px;
              height: 20px;
            }

            strong {
              display: block;
              font-size: 0.76rem;
              color: #FFFFFF;
            }

            span {
              display: block;
              font-size: 0.68rem;
              color: #CBD5E1;
            }
          }
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px;
      font-size: 0.75rem;
      color: #CBD5E1;

      .bottom-inner {
        max-width: 1440px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;

        .payment-badges-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;

          .pay-chip {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.16);
            color: #CBD5E1;
            font-size: 0.62rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            padding: 3px 7px;
            border-radius: 3px;
          }
        }

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 10px;

          a {
            cursor: pointer;
            color: #CBD5E1;
            transition: color 0.2s;

            &:hover {
              color: #FFFFFF;
            }
          }
        }
      }
    }

    @media (max-width: 992px) {
      .footer-main-grid {
        grid-template-columns: 1fr 1fr;
      }
      .cert-ribbon .cert-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 600px) {
      .footer-main-grid {
        grid-template-columns: 1fr;
      }
      .cert-ribbon .cert-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {
  openOwner = output<void>();
  categorySelect = output<string>();

  emailInput = '';
  subscribed = false;

  subscribeNewsletter(): void {
    if (this.emailInput.trim()) {
      this.subscribed = true;
    }
  }

  filterCat(slug: string): void {
    this.categorySelect.emit(slug);
    this.scrollTo('catalog');
  }

  scrollTo(id: string): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
