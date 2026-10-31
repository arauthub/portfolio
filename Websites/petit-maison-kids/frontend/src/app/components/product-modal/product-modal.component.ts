import { Component, input, output, inject, signal, computed, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KidsProduct, MonogramConfig, ColorSwatch } from '../../models/kids.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CurrencyService } from '../../services/currency.service';
import { SeoMetaService } from '../../services/seo-meta.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="modal-backdrop" *ngIf="product()" (click)="close.emit()">
      <div class="modal-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="kids-modal-title">
        <!-- Close Button -->
        <button class="close-btn" (click)="close.emit()" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>

        <div class="grid-12 dialog-body" *ngIf="product() as p">
          <!-- Left: Gallery & Monogram Preview (Col 1 to 7) -->
          <div class="col-7 gallery-col">
            <div class="main-photo-wrapper">
              <img [src]="activeImage() || p.primary_image" [alt]="p.title" class="main-photo" (error)="onImgError($event)" />

              <!-- Live Monogram Embroidery Preview Overlay -->
              <div
                class="embroidery-canvas-overlay"
                *ngIf="enableMonogram() && monogramText.trim().length > 0"
              >
                <div
                  class="embroidered-patch"
                  [style.color]="selectedThreadHex"
                  [class.font-script]="monogramFont === 'Heirloom Script'"
                  [class.font-block]="monogramFont === 'Playful Block'"
                  [class.font-french]="monogramFont === 'French Cursive'"
                >
                  <span class="thread-stitch-effect">{{ monogramText }}</span>
                </div>
              </div>

              <!-- Innovation Badge -->
              <div class="foldable-cuff-badge">
                <mat-icon class="badge-icon">shield</mat-icon>
                <span>100% Scratch-Free Lined</span>
              </div>
            </div>

            <!-- Thumbnails -->
            <div class="thumb-strip" *ngIf="allImages().length > 1">
              <button
                class="thumb-btn"
                *ngFor="let img of allImages()"
                [class.active]="activeImage() === img"
                (click)="activeImage.set(img)"
              >
                <img [src]="img" [alt]="p.title" (error)="onImgError($event)" />
              </button>
            </div>

            <!-- Certified Safety Assurance Banner -->
            <div class="safety-box">
              <div class="safety-badge-item">
                <mat-icon class="safe-icon">verified_user</mat-icon>
                <div>
                  <strong>{{ p.safety_certification }}</strong>
                  <p>Certified free of 100+ harmful chemicals, AZO dyes & rough threads.</p>
                </div>
              </div>
              <div class="safety-badge-item">
                <mat-icon class="safe-icon">soap</mat-icon>
                <div>
                  <strong>Pure Mulmul Wash Guarantee</strong>
                  <p>Pre-washed organic fibers stay ultra-soft through 50+ washes.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Customizer & Details (Col 8 to 12) -->
          <div class="col-5 details-col">
            <div class="details-header">
              <span class="category-tag">{{ p.category_name }} • {{ p.age_stage }}</span>
              <h2 id="kids-modal-title" class="dialog-title">{{ p.title }}</h2>

              <div class="rating-row" *ngIf="p.rating_average">
                <div class="stars">
                  <mat-icon class="star">star</mat-icon>
                  <span class="rate-number">{{ p.rating_average }}</span>
                </div>
                <span class="review-count">({{ p.review_count || 32 }} Verified Indian Parents)</span>
              </div>

              <div class="price-strip">
                <span class="price-val">{{ currency.format(p.price) }}</span>
                <span class="compare-val" *ngIf="p.compare_at_price">{{ currency.format(p.compare_at_price) }}</span>
                <span class="stock-pill" *ngIf="p.inventory_count > 0">In Stock for Festive Dispatch</span>
              </div>
            </div>

            <!-- Smart Growth Sizing Recommender -->
            <div class="sizing-section">
              <div class="section-label-row">
                <span class="label-title">Select Size</span>
                <button
                  class="growth-guide-toggle"
                  id="growth-calc-btn"
                  (click)="showGrowthGuide = !showGrowthGuide"
                >
                  <mat-icon class="mini-icon">straighten</mat-icon>
                  Smart Growth Calculator
                </button>
              </div>

              <!-- Growth Guide Box -->
              <div class="growth-calculator-card" *ngIf="showGrowthGuide">
                <div class="calc-header">
                  <mat-icon class="sparkle-icon">auto_awesome</mat-icon>
                  <strong>Room-To-Grow™ Fit Recommendation</strong>
                </div>
                <p>
                  Because this garment features <strong>2.5" foldable double-cuffs</strong>, choose your child's current age. Fold up while little, and unfold as they sprout for up to 3 extra months of wear!
                </p>
              </div>

              <!-- Size Buttons -->
              <div class="size-options">
                <button
                  type="button"
                  class="size-pill"
                  *ngFor="let s of p.available_sizes; let sIdx = index"
                  [id]="'size-pill-' + sIdx"
                  [class.selected]="selectedSize() === s"
                  (click)="selectedSize.set(s)"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Color Palette Selection -->
            <div class="color-section" *ngIf="p.color_swatches && p.color_swatches.length > 0">
              <span class="label-title">Color: <strong>{{ selectedColor().name }}</strong></span>
              <div class="color-swatch-list">
                <button
                  type="button"
                  class="swatch-btn"
                  *ngFor="let c of p.color_swatches; let cIdx = index"
                  [id]="'color-swatch-' + cIdx"
                  [class.selected]="selectedColor().name === c.name"
                  [style.backgroundColor]="c.hex"
                  [matTooltip]="c.name"
                  (click)="selectedColor.set(c)"
                ></button>
              </div>
            </div>

            <!-- Live Bespoke Monogram Studio -->
            <div class="monogram-studio-card" *ngIf="p.is_monogrammable">
              <div class="monogram-header">
                <div class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="mono-toggle"
                    [checked]="enableMonogram()"
                    (change)="toggleMonogram()"
                  />
                  <label for="mono-toggle" class="mono-label">
                    <span>Add Royal Zari Monogram Embroidery</span>
                    <span class="mono-fee">+ {{ currency.format(499) }}</span>
                  </label>
                </div>
              </div>

              <div class="monogram-controls" *ngIf="enableMonogram()">
                <div class="control-field">
                  <label class="field-label">Child's Name or Royal Initials</label>
                  <input
                    type="text"
                    id="monogram-input"
                    [(ngModel)]="monogramText"
                    maxlength="12"
                    placeholder="e.g. AARAV or ANANYA"
                    class="monogram-input"
                  />
                  <span class="field-hint">Max 12 letters. Custom hand-guided zari embroidery.</span>
                </div>

                <div class="control-row">
                  <!-- Thread Colors -->
                  <div class="thread-picker">
                    <label class="field-label">Zari Thread</label>
                    <div class="thread-dots">
                      <button
                        *ngFor="let t of threadColors; let tIdx = index"
                        [id]="'thread-dot-' + tIdx"
                        class="thread-dot"
                        [class.active]="selectedThreadHex === t.hex"
                        [style.backgroundColor]="t.hex"
                        [matTooltip]="t.name"
                        (click)="selectThread(t.name, t.hex)"
                      ></button>
                    </div>
                  </div>

                  <!-- Font Style -->
                  <div class="font-picker">
                    <label class="field-label">Embroidery Style</label>
                    <select [(ngModel)]="monogramFont" class="font-select">
                      <option value="Heirloom Script">Heirloom Script</option>
                      <option value="Playful Block">Playful Block</option>
                      <option value="French Cursive">Royal Cursive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Indian Postal Pincode Delivery Checker Widget -->
            <div class="pincode-widget-box">
              <label class="pincode-lbl">
                <mat-icon class="pin-icon">local_shipping</mat-icon>
                <span>Check Bluedart Dispatch & COD to Pincode:</span>
              </label>
              <div class="pincode-input-row">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  maxlength="6"
                  [ngModel]="pincodeInput()"
                  (ngModelChange)="pincodeInput.set($event)"
                  (keyup.enter)="checkPincode()"
                  class="pincode-field"
                />
                <button class="check-pin-btn" (click)="checkPincode()">CHECK</button>
              </div>
              <p *ngIf="pincodeStatus().checked" class="pincode-result" [class.success]="pincodeStatus().valid" [class.error]="!pincodeStatus().valid">
                {{ pincodeStatus().message }}
              </p>
            </div>

            <!-- Fabric and Details -->
            <div class="fabric-specs">
              <div class="spec-row">
                <span class="spec-key">Fabric:</span>
                <span class="spec-val">{{ p.fabric }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-key">Fasteners:</span>
                <span class="spec-val">{{ p.fasteners }}</span>
              </div>
              <div class="spec-row">
                <span class="spec-key">Care:</span>
                <span class="spec-val">{{ p.care_guide }}</span>
              </div>
            </div>

            <!-- Actions Bar -->
            <div class="dialog-actions">
              <button
                mat-raised-button
                class="add-bag-primary gold-shimmer-btn"
                id="add-bag-submit-btn"
                [disabled]="!selectedSize()"
                (click)="addToBag()"
              >
                <mat-icon>shopping_bag</mat-icon>
                <span>Add To Nursery Bag • {{ currency.format(calculateTotalItemPrice()) }}</span>
              </button>

              <button
                mat-icon-button
                class="wishlist-action"
                (click)="wishlist.toggle(p)"
                [matTooltip]="wishlist.isInWishlist(p.id) ? 'Remove from wishlist' : 'Save to wishlist'"
              >
                <mat-icon [style.color]="wishlist.isInWishlist(p.id) ? '#DC2626' : 'inherit'">
                  {{ wishlist.isInWishlist(p.id) ? 'favorite' : 'favorite_border' }}
                </mat-icon>
              </button>

              <button
                mat-icon-button
                class="share-action-btn"
                (click)="shareProduct()"
                matTooltip="Share this Heirloom Look & Rich Meta Card"
                aria-label="Share product"
              >
                <mat-icon>share</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(45, 58, 75, 0.65);
      backdrop-filter: blur(6px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-dialog {
      background: #FFFFFF;
      border-radius: 28px;
      max-width: 980px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
      animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.96) translateY(12px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #F4F4F5;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #71717A;
      z-index: 10;
      transition: all 0.2s;

      &:hover {
        background: #E4E4E7;
        color: #1A1A1A;
      }
    }

    .dialog-body {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 2.5rem;
      padding: 2.5rem;
    }

    .gallery-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .main-photo-wrapper {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      background: #F5F1ED;
      height: 420px;

      .main-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .embroidery-canvas-overlay {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 8px 18px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      border: 1px dashed rgba(0,0,0,0.2);
    }

    .embroidered-patch {
      font-size: 1.25rem;
      letter-spacing: 2px;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.15);

      &.font-script {
        font-family: 'Playfair Display', serif;
        font-style: italic;
      }
      &.font-block {
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        text-transform: uppercase;
      }
      &.font-french {
        font-family: 'Quicksand', cursive;
        font-weight: 700;
      }
    }

    .foldable-cuff-badge {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      padding: 6px 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #2D3A4B;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);

      .badge-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #588157;
      }
    }

    .thumb-strip {
      display: flex;
      gap: 8px;

      .thumb-btn {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid transparent;
        background: none;
        padding: 0;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &.active {
          border-color: var(--pm-primary, #4A5859);
        }
      }
    }

    .safety-box {
      background: var(--pm-surface-variant, #F5F1ED);
      padding: 1rem;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .safety-badge-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        .safe-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: #588157;
          margin-top: 2px;
        }

        strong {
          font-size: 0.8125rem;
          color: #2D3A4B;
          display: block;
        }

        p {
          font-size: 0.75rem;
          color: #71717A;
          margin: 0;
          line-height: 1.35;
        }
      }
    }

    .details-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .category-tag {
      font-size: 0.75rem;
      color: var(--pm-primary, #4A5859);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .dialog-title {
      font-family: var(--pm-font-serif, 'Playfair Display', serif);
      font-size: 1.75rem;
      color: var(--pm-text, #2D3A4B);
      margin: 6px 0 8px 0;
      font-weight: 700;
      line-height: 1.2;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .stars {
        display: flex;
        align-items: center;
        gap: 2px;
        color: #E0A96D;

        .star {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        .rate-number {
          font-weight: 700;
          color: #1A1A1A;
          font-size: 0.875rem;
        }
      }

      .review-count {
        font-size: 0.8125rem;
        color: #71717A;
      }
    }

    .price-strip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0,0,0,0.06);

      .price-val {
        font-size: 1.625rem;
        font-weight: 800;
        color: var(--pm-text, #2D3A4B);
      }

      .compare-val {
        font-size: 1.125rem;
        color: #A1A1AA;
        text-decoration: line-through;
      }

      .stock-pill {
        background: #E8F5E9;
        color: #2E7D32;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
      }
    }

    .section-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .label-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #2D3A4B;
    }

    .growth-guide-toggle {
      background: none;
      border: none;
      color: var(--pm-primary, #4A5859);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      .mini-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      &:hover {
        text-decoration: underline;
      }
    }

    .growth-calculator-card {
      background: #F0F4F8;
      border-left: 3px solid var(--pm-primary, #4A5859);
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 10px;

      .calc-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8125rem;
        color: var(--pm-primary, #4A5859);
        margin-bottom: 4px;

        .sparkle-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      p {
        font-size: 0.75rem;
        color: #475569;
        margin: 0;
        line-height: 1.4;
      }
    }

    .size-options {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .size-pill {
        background: #FFFFFF;
        border: 1.5px solid #D4D4D8;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #2D3A4B;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: var(--pm-primary, #4A5859);
        }

        &.selected {
          border-color: var(--pm-primary, #4A5859);
          background: var(--pm-primary, #4A5859);
          color: #FFFFFF;
        }
      }
    }

    .color-swatch-list {
      display: flex;
      gap: 10px;
      margin-top: 6px;

      .swatch-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 0 1px #D4D4D8;
        cursor: pointer;
        transition: transform 0.2s;

        &.selected {
          box-shadow: 0 0 0 2px var(--pm-primary, #4A5859);
          transform: scale(1.15);
        }
      }
    }

    .monogram-studio-card {
      background: var(--pm-surface-variant, #F5F1ED);
      border-radius: 14px;
      padding: 1rem;
      border: 1px solid rgba(0,0,0,0.06);

      .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;

        input[type="checkbox"] {
          accent-color: var(--pm-primary, #4A5859);
          width: 16px;
          height: 16px;
        }

        .mono-label {
          font-weight: 700;
          font-size: 0.875rem;
          color: #2D3A4B;
          display: flex;
          justify-content: space-between;
          width: 100%;
          cursor: pointer;

          .mono-fee {
            color: #B85D36;
          }
        }
      }
    }

    .monogram-controls {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;

      .field-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #71717A;
        display: block;
        margin-bottom: 4px;
      }

      .monogram-input {
        width: 100%;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid #D4D4D8;
        font-size: 0.9375rem;
        font-weight: 600;
        outline: none;

        &:focus {
          border-color: var(--pm-primary, #4A5859);
        }
      }

      .field-hint {
        font-size: 0.6875rem;
        color: #A1A1AA;
        margin-top: 2px;
        display: block;
      }

      .control-row {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .thread-dots {
        display: flex;
        gap: 8px;

        .thread-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 0 1px #A1A1AA;
          cursor: pointer;

          &.active {
            box-shadow: 0 0 0 2px #2D3A4B;
            transform: scale(1.1);
          }
        }
      }

      .font-select {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid #D4D4D8;
        font-size: 0.8125rem;
        outline: none;
      }
    }

    .fabric-specs {
      font-size: 0.8125rem;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .spec-row {
        display: flex;
        gap: 6px;

        .spec-key {
          font-weight: 700;
          color: #71717A;
          width: 80px;
        }

        .spec-val {
          color: #2D3A4B;
        }
      }
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-top: 0.5rem;

      .add-bag-primary {
        flex: 1 !important;
        background: var(--pm-primary, #4A5859) !important;
        color: #FFFFFF !important;
        padding: 14px 20px !important;
        font-size: 1rem !important;
        font-weight: 700 !important;
        border-radius: 14px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        box-shadow: 0 6px 20px rgba(74, 88, 89, 0.25) !important;

        &:disabled {
          background: #D4D4D8 !important;
          color: #71717A !important;
          box-shadow: none !important;
          cursor: not-allowed;
        }
      }

      .wishlist-action, .share-action-btn {
        width: 48px;
        height: 48px;
        border: 1.5px solid #E4E4E7;
        border-radius: 14px;
        color: #71717A;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #F1F5F9;
          color: #0F172A;
          border-color: #94A3B8;
        }
      }
    }

    .pincode-widget-box {
      background: #F8F9FA;
      border: 1px solid #E9ECEF;
      border-radius: 12px;
      padding: 12px 14px;
      margin: 10px 0;

      .pincode-lbl {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        color: #495057;
        margin-bottom: 8px;

        .pin-icon {
          font-size: 16px;
          color: #E07A5F;
        }
      }

      .pincode-input-row {
        display: flex;
        gap: 8px;

        .pincode-field {
          flex: 1;
          border: 1px solid #CED4DA;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.8125rem;
          outline: none;

          &:focus {
            border-color: #E07A5F;
          }
        }

        .check-pin-btn {
          background: #25332A;
          color: #FFFFFF;
          border: none;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;

          &:hover {
            background: #E07A5F;
          }
        }
      }

      .pincode-result {
        font-size: 0.75rem;
        margin-top: 8px;
        margin-bottom: 0;

        &.success {
          color: #2E7D32;
        }

        &.error {
          color: #D32F2F;
        }
      }
    }

    @media (max-width: 768px) {
      .dialog-body {
        grid-template-columns: 1fr;
        padding: 1.5rem;
      }
      .main-photo-wrapper {
        height: 300px;
      }
    }
  `]
})
export class ProductModalComponent implements OnInit {
  product = input<KidsProduct | null>(null);
  close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  cart = inject(CartService);
  wishlist = inject(WishlistService);
  currency = inject(CurrencyService);
  seo = inject(SeoMetaService);

  activeImage = signal<string>('');
  selectedSize = signal<string>('');
  selectedColor = signal<ColorSwatch>({ name: '', hex: '' });
  enableMonogram = signal<boolean>(false);
  monogramText = 'AARAV';
  monogramFont: 'Heirloom Script' | 'Playful Block' | 'French Cursive' = 'French Cursive';
  selectedThreadHex = '#D4AF37';
  selectedThreadName = 'Sona Gold Zari';
  showGrowthGuide = false;

  // Indian Pincode Delivery Check
  pincodeInput = signal<string>('110001');
  pincodeStatus = signal<{ checked: boolean; valid: boolean; message: string }>({
    checked: true,
    valid: true,
    message: '✓ Express Air Delivery to 110001 (Delhi). Delivery in 2-3 days via Bluedart Express. COD Available.'
  });

  threadColors = [
    { name: 'Sona Gold Zari', hex: '#D4AF37' },
    { name: 'Rani Pink Silk', hex: '#E0115F' },
    { name: 'Kesar Orange Silk', hex: '#FF7722' },
    { name: 'Peacock Indigo', hex: '#1B263B' },
    { name: 'Pure Moti Cream', hex: '#FFFDD0' }
  ];

  allImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    const list = [p.primary_image, p.hover_image, ...(p.extra_images || [])];
    return Array.from(new Set(list));
  });

  ngOnInit(): void {
    const p = this.product();
    if (p) {
      this.activeImage.set(p.primary_image);
      if (p.available_sizes && p.available_sizes.length > 0) {
        this.selectedSize.set(p.available_sizes[0]);
      }
      if (p.color_swatches && p.color_swatches.length > 0) {
        this.selectedColor.set(p.color_swatches[0]);
      }
      this.enableMonogram.set(false);
      this.seo.setProductMeta(p);
    }
  }

  shareProduct(): void {
    const p = this.product();
    if (p) {
      this.seo.openShare(p);
    }
  }

  toggleMonogram(): void {
    this.enableMonogram.set(!this.enableMonogram());
  }

  checkPincode(): void {
    const pin = this.pincodeInput().trim();
    if (/^\d{6}$/.test(pin)) {
      this.pincodeStatus.set({
        checked: true,
        valid: true,
        message: `✓ Express Air Delivery to ${pin}. Delivered in 2-3 business days via Bluedart Express. COD Eligible.`
      });
    } else {
      this.pincodeStatus.set({
        checked: true,
        valid: false,
        message: '✕ Please enter a valid 6-digit Indian Postal Pincode.'
      });
    }
  }

  selectThread(name: string, hex: string): void {
    this.selectedThreadName = name;
    this.selectedThreadHex = hex;
  }

  calculateTotalItemPrice(): number {
    const p = this.product();
    if (!p) return 0;
    const monoFee = this.enableMonogram() ? 499.0 : 0.0;
    return p.price + monoFee;
  }

  addToBag(): void {
    const p = this.product();
    if (!p || !this.selectedSize()) return;

    let monogramConfig: MonogramConfig | undefined;
    if (this.enableMonogram() && this.monogramText.trim().length > 0) {
      monogramConfig = {
        text: this.monogramText.trim(),
        threadColor: this.selectedThreadName,
        threadHex: this.selectedThreadHex,
        font: this.monogramFont
      };
    }

    this.cart.addItem(
      p,
      this.selectedSize(),
      this.selectedColor().name,
      this.selectedColor().hex,
      1,
      monogramConfig
    );

    this.close.emit();
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';
  }
}
