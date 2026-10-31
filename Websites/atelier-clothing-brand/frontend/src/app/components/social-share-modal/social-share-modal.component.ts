import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoMetaService } from '../../services/seo-meta.service';

@Component({
  selector: 'app-social-share-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (seo.isShareModalOpen()) {
      <div class="share-backdrop" (click)="seo.closeShare()">
        <div class="share-modal animate-scale-up" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-label="Social Share & SEO Meta Controls">
          
          <!-- Header -->
          <div class="modal-header">
            <div class="header-titles">
              <span class="badge-tag">VIRAL SOCIAL & OPENGRAPH SUITE</span>
              <h3>Share & Social Media Meta Tags</h3>
              <p>Rich metadata card preview for WhatsApp, Twitter/X, Facebook & LinkedIn</p>
            </div>
            <button class="close-btn" (click)="seo.closeShare()" aria-label="Close share dialog">✕</button>
          </div>

          <!-- Social Share One-Click Buttons -->
          <div class="share-actions-row">
            <a [href]="seo.getShareLink('whatsapp')" target="_blank" rel="noopener" class="share-btn whatsapp-btn">
              <span class="btn-icon">💬</span>
              <span>WhatsApp</span>
            </a>
            <a [href]="seo.getShareLink('twitter')" target="_blank" rel="noopener" class="share-btn twitter-btn">
              <span class="btn-icon">𝕏</span>
              <span>Twitter / X</span>
            </a>
            <a [href]="seo.getShareLink('facebook')" target="_blank" rel="noopener" class="share-btn facebook-btn">
              <span class="btn-icon">f</span>
              <span>Facebook</span>
            </a>
            <a [href]="seo.getShareLink('linkedin')" target="_blank" rel="noopener" class="share-btn linkedin-btn">
              <span class="btn-icon">in</span>
              <span>LinkedIn</span>
            </a>
            <a [href]="seo.getShareLink('pinterest')" target="_blank" rel="noopener" class="share-btn pinterest-btn">
              <span class="btn-icon">📌</span>
              <span>Pinterest</span>
            </a>
            <button class="share-btn copy-btn" (click)="copyShareLink()">
              <span class="btn-icon">{{ copied() ? '✓' : '🔗' }}</span>
              <span>{{ copied() ? 'Copied!' : 'Copy Link' }}</span>
            </button>
          </div>

          <!-- Live Social Card Preview (What WhatsApp / Facebook displays) -->
          <div class="card-preview-section">
            <div class="section-label">LIVE SOCIAL CARD PREVIEW (WHAT USERS SEE ON SOCIAL APPS)</div>
            <div class="og-card-preview">
              <div class="og-media">
                <img [src]="editImage" [alt]="editTitle" (error)="onImgErr($event)" />
                <span class="og-domain">atelier-riwayat.in</span>
              </div>
              <div class="og-details">
                <span class="og-site-name">ATELIER RIWAYAT • HAUTE COUTURE</span>
                <h4 class="og-title">{{ editTitle }}</h4>
                <p class="og-desc">{{ editDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Live Meta & OG Tags Editor (Admin & Storefront Customization) -->
          <div class="meta-editor-section">
            <div class="section-label">CUSTOMIZE TITLE, DESCRIPTION, OG IMAGE & FAVICON</div>
            
            <div class="form-group">
              <label>Page / Item Title (og:title)</label>
              <input type="text" [(ngModel)]="editTitle" placeholder="Enter social share title..." />
            </div>

            <div class="form-group">
              <label>Description (og:description & meta description)</label>
              <textarea [(ngModel)]="editDesc" rows="2" placeholder="Enter share summary description..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>OG Image URL (og:image)</label>
                <input type="url" [(ngModel)]="editImage" placeholder="https://..." />
              </div>
              <div class="form-group flex-1">
                <label>Dynamic Favicon URL</label>
                <input type="text" [(ngModel)]="editFavicon" placeholder="favicon.svg" />
              </div>
            </div>

            <div class="editor-actions">
              <button class="btn-apply-meta" (click)="applyMetaChanges()">
                <span>Apply & Update Page Meta Tags Now</span>
                <span class="material-symbols-outlined" style="font-size: 16px;">check_circle</span>
              </button>
              @if (savedToast()) {
                <span class="toast-success">✓ Meta tags, OG image & Favicon updated!</span>
              }
            </div>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .share-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1300;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .share-modal {
      background: var(--bg-surface, #181b22);
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.2));
      border-radius: var(--radius-md, 12px);
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      padding: 24px;
      color: var(--text-primary, #f8fafc);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));

      .badge-tag {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        color: var(--text-accent, #ead8c0);
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 4px 0 2px;
      }

      p {
        font-size: 0.75rem;
        color: var(--text-secondary, #cbd5e1);
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary, #cbd5e1);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;

        &:hover { color: #fff; }
      }
    }

    .share-actions-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(95px, 1fr));
      gap: 8px;
      margin-bottom: 20px;

      .share-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 10px 8px;
        border-radius: var(--radius-sm, 6px);
        text-decoration: none;
        font-size: 0.72rem;
        font-weight: 700;
        color: #fff;
        cursor: pointer;
        transition: transform 0.2s ease, filter 0.2s ease;
        border: none;

        .btn-icon {
          font-size: 18px;
        }

        &:hover {
          transform: translateY(-2px);
          filter: brightness(1.15);
        }

        &.whatsapp-btn { background: #25D366; color: #fff; }
        &.twitter-btn { background: #000000; border: 1px solid #333; }
        &.facebook-btn { background: #1877F2; }
        &.linkedin-btn { background: #0A66C2; }
        &.pinterest-btn { background: #E60023; }
        &.copy-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }
      }
    }

    .section-label {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: var(--text-accent, #ead8c0);
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .og-card-preview {
      background: rgba(10, 11, 14, 0.7);
      border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.2));
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;

      .og-media {
        position: relative;
        height: 180px;
        background: #000;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .og-domain {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }

      .og-details {
        padding: 12px 14px;

        .og-site-name {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-accent, #ead8c0);
          display: block;
        }

        .og-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 4px 0;
          color: var(--text-primary, #f8fafc);
          line-height: 1.3;
        }

        .og-desc {
          font-size: 0.75rem;
          color: var(--text-secondary, #cbd5e1);
          margin: 0;
          line-height: 1.35;
        }
      }
    }

    .meta-editor-section {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
      border-radius: 8px;
      padding: 16px;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 12px;

        label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary, #cbd5e1);
        }

        input, textarea {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-medium, rgba(255, 255, 255, 0.2));
          border-radius: 4px;
          padding: 8px 10px;
          color: #fff;
          font-family: inherit;
          font-size: 0.8rem;
          outline: none;

          &:focus {
            border-color: var(--text-accent, #ead8c0);
          }
        }
      }

      .form-row {
        display: flex;
        gap: 12px;
        .flex-1 { flex: 1; }
      }

      .editor-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 14px;

        .btn-apply-meta {
          background: var(--text-accent, #ead8c0);
          color: #000;
          border: none;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: filter 0.2s;

          &:hover { filter: brightness(1.15); }
        }

        .toast-success {
          font-size: 0.75rem;
          color: #10B981;
          font-weight: 700;
        }
      }
    }

    .animate-scale-up {
      animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class SocialShareModalComponent {
  readonly seo = inject(SeoMetaService);

  editTitle = this.seo.currentTitle();
  editDesc = this.seo.currentDescription();
  editImage = this.seo.currentOgImage();
  editFavicon = this.seo.currentFavicon();

  copied = signal(false);
  savedToast = signal(false);

  constructor() {
    // Sync with service defaults
    this.editTitle = this.seo.currentTitle();
    this.editDesc = this.seo.currentDescription();
    this.editImage = this.seo.currentOgImage();
    this.editFavicon = this.seo.currentFavicon();
  }

  copyShareLink(): void {
    const url = this.seo.activeItemForShare() ? `http://localhost:4202/?product=${this.seo.activeItemForShare().id}` : window.location.href;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  applyMetaChanges(): void {
    this.seo.setPageMeta({
      title: this.editTitle,
      description: this.editDesc,
      image: this.editImage,
      favicon: this.editFavicon
    });
    this.savedToast.set(true);
    setTimeout(() => this.savedToast.set(false), 3000);
  }

  onImgErr(e: any): void {
    e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85';
  }
}
