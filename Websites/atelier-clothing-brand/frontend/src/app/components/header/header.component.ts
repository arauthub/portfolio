import { Component, inject, signal, OnInit, OnDestroy, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ThemeService, BrandTheme } from '../../services/theme.service';
import { CurrencyService } from '../../services/currency.service';
import { AuthService } from '../../services/auth.service';
import { MembershipService } from '../../services/membership.service';
import { PosService } from '../../services/pos.service';
import { SeoMetaService } from '../../services/seo-meta.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly themeService = inject(ThemeService);
  readonly currencyService = inject(CurrencyService);
  readonly authService = inject(AuthService);
  readonly membershipService = inject(MembershipService);
  readonly posService = inject(PosService);
  readonly seoService = inject(SeoMetaService);

  readonly openAdminPanel = output<void>();
  readonly openWishlist = output<void>();
  readonly scrollToCatalog = output<string>();
  readonly openGuide = output<void>();
  readonly openBarcodeScanner = output<void>();
  readonly openBrandPortal = output<void>();

  // Countdown timer for announcement bar
  readonly countdown = signal({ days: 3, hours: 14, minutes: 28, seconds: 45 });
  private timerInterval?: any;
  readonly codeCopied = signal(false);

  mobileMenuOpen = signal(false);

  // Mega menu and dropdown state
  readonly activeMega = signal<'couture' | 'capsules' | 'maisons' | null>(null);
  private megaCloseTimeout?: any;

  // Mobile accordion state
  readonly mobileSections = signal<{ [key: string]: boolean }>({
    couture: true,
    capsules: false,
    maisons: false,
    concierge: false
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMega();
    this.mobileMenuOpen.set(false);
  }

  openMega(menu: 'couture' | 'capsules' | 'maisons'): void {
    if (this.megaCloseTimeout) {
      clearTimeout(this.megaCloseTimeout);
      this.megaCloseTimeout = null;
    }
    this.activeMega.set(menu);
  }

  scheduleCloseMega(): void {
    this.megaCloseTimeout = setTimeout(() => {
      this.activeMega.set(null);
    }, 200);
  }

  closeMega(): void {
    if (this.megaCloseTimeout) clearTimeout(this.megaCloseTimeout);
    this.activeMega.set(null);
  }

  toggleMega(menu: 'couture' | 'capsules' | 'maisons'): void {
    this.activeMega.update(current => current === menu ? null : menu);
  }

  toggleMobileSection(section: string): void {
    this.mobileSections.update(s => ({
      ...s,
      [section]: !s[section]
    }));
  }

  ngOnInit(): void {
    this.timerInterval = setInterval(() => {
      this.countdown.update(c => {
        let { days, hours, minutes, seconds } = c;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  copyPromo(code: string): void {
    navigator.clipboard?.writeText(code);
    this.codeCopied.set(true);
    setTimeout(() => this.codeCopied.set(false), 2500);
  }

  setTheme(themeId: BrandTheme): void {
    this.themeService.setTheme(themeId);
  }

  setCurrency(curr: string): void {
    this.currencyService.setCurrency(curr);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  navigate(category: string): void {
    this.closeMega();
    this.mobileMenuOpen.set(false);
    this.scrollToCatalog.emit(category);
  }

  triggerShare(): void {
    this.seoService.openShare();
  }

  reopenGate(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('atelier_prive_gate_unlocked');
    }
    window.location.reload();
  }
}
