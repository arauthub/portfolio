import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosService } from '../../services/pos.service';
import { AuthService } from '../../services/auth.service';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-central-hub-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hub-bar">
      <div class="hub-container">
        
        <!-- Left: Brand Hub Brand Picker -->
        <div class="hub-left">
          <span class="hub-badge">CENTRAL COMMERCE HUB</span>
          <nav class="hub-nav">
            <a href="http://localhost:4202" class="hub-link" title="Switch to Haute Couture Adults Brand">
              <span class="material-symbols-outlined icon">styler</span>
              <span>Atelier Vogue (Adults)</span>
            </a>
            <span class="hub-divider">|</span>
            <span class="hub-link active" title="Currently browsing Petit Maison Childrenswear">
              <span class="material-symbols-outlined icon">child_care</span>
              <span>Petit Maison (Kids & Nursery)</span>
              <span class="live-dot"></span>
            </span>
          </nav>
        </div>

        <!-- Center: Security & Cloud Ecosystem Status -->
        <div class="hub-center">
          <span class="secure-tag">
            <span class="material-symbols-outlined lock-icon">verified_user</span>
            Multi-Tenant Vault • Wagtail Enterprise AI Active
          </span>
        </div>

        <!-- Right: Fast Enterprise Tools & Store Actions -->
        <div class="hub-right">
          <button class="hub-tool-btn" (click)="pos.openPos()" title="Launch In-Store POS Retail Register" aria-label="Launch In-Store POS Retail Register">
            <span class="material-symbols-outlined icon" aria-hidden="true">point_of_sale</span>
            <span class="btn-label">POS Register</span>
          </button>

          <button class="hub-tool-btn" (click)="membership.openModal()" title="View VIP Membership Perks" aria-label="View VIP Family Club Privileges">
            <span class="material-symbols-outlined icon" aria-hidden="true">stars</span>
            <span class="btn-label">Family Club</span>
          </button>

          <button class="hub-tool-btn" (click)="auth.openAuthModal()" title="Account & Profile" aria-label="User Account and Profile">
            <span class="material-symbols-outlined icon" aria-hidden="true">account_circle</span>
            <span class="btn-label">{{ auth.currentUser() ? auth.currentUser()?.name?.split(' ')?.[0] : 'Sign In' }}</span>
          </button>

          <a href="http://localhost:8001/admin/" target="_blank" rel="noopener noreferrer" class="hub-admin-link" title="Open Wagtail CMS Admin" aria-label="Open Wagtail CMS Admin Panel">
            <span class="material-symbols-outlined icon" aria-hidden="true">admin_panel_settings</span>
            <span class="btn-label">Wagtail Admin</span>
          </a>
        </div>

      </div>
    </header>
  `,
  styles: [`
    .hub-bar {
      background: #2b3a32;
      color: #FAF6EE;
      font-size: 0.72rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: inherit;
    }

    .hub-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 6px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .hub-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .hub-badge {
      background: #7AA884;
      color: #1a2720;
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .hub-nav {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .hub-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: rgba(250, 246, 238, 0.75);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
      cursor: pointer;

      &:hover {
        color: #FAF6EE;
      }

      &.active {
        color: #FAF6EE;
        font-weight: 700;
      }

      .icon {
        font-size: 15px;
      }
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: #7AA884;
      border-radius: 50%;
      box-shadow: 0 0 6px #7AA884;
      display: inline-block;
    }

    .hub-divider {
      color: rgba(255, 255, 255, 0.2);
    }

    .hub-center {
      .secure-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #FAF6EE;
        letter-spacing: 0.03em;
        font-weight: 500;

        .lock-icon {
          font-size: 14px;
          color: #A3C9AC;
        }
      }
    }

    .hub-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hub-tool-btn,
    .hub-admin-link {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #FAF6EE;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.7rem;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;

      .material-symbols-outlined {
        font-size: 14px;
      }

      &:hover {
        background: #7AA884;
        color: #1a2720;
        border-color: #7AA884;
      }
    }

    .hub-admin-link {
      background: #7AA884;
      color: #1a2720;
      font-weight: 700;
      border-color: #7AA884;

      &:hover {
        background: #FAD4C0;
        color: #1a2720;
        border-color: #FAD4C0;
      }
    }

    @media (max-width: 860px) {
      .hub-center {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .hub-container {
        padding: 4px 8px;
      }
      .hub-badge {
        display: none;
      }
      .btn-label {
        display: none;
      }
      .hub-tool-btn,
      .hub-admin-link {
        padding: 4px 6px;
      }
    }
  `]
})
export class CentralHubHeaderComponent {
  pos = inject(PosService);
  auth = inject(AuthService);
  membership = inject(MembershipService);
}
