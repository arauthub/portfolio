import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralHubHeaderComponent } from './components/central-hub-header/central-hub-header.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { D3VisualizerComponent } from './components/d3-visualizer/d3-visualizer.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { LookbookComponent } from './components/lookbook/lookbook.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { OrderReceiptModalComponent } from './components/order-receipt-modal/order-receipt-modal.component';
import { OwnerPanelComponent } from './components/owner-panel/owner-panel.component';
import { UserGuideModalComponent } from './components/user-guide-modal/user-guide-modal.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { MembershipModalComponent } from './components/membership-modal/membership-modal.component';
import { BarcodeScannerModalComponent } from './components/barcode-scanner-modal/barcode-scanner-modal.component';
import { InStorePosModalComponent } from './components/in-store-pos-modal/in-store-pos-modal.component';
import { AiChatDrawerComponent } from './components/ai-chat-drawer/ai-chat-drawer.component';
import { BrandPortalModalComponent } from './components/brand-portal-modal/brand-portal-modal.component';
import { LoginGateComponent } from './components/login-gate/login-gate.component';
import { SocialShareModalComponent } from './components/social-share-modal/social-share-modal.component';
import { Product, OrderConfirmation } from './models/product.model';
import { CartService } from './services/cart.service';
import { ApiService } from './services/api.service';
import { CurrencyService } from './services/currency.service';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { MembershipService } from './services/membership.service';
import { PosService } from './services/pos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CentralHubHeaderComponent,
    HeaderComponent,
    HeroComponent,
    D3VisualizerComponent,
    CatalogComponent,
    LookbookComponent,
    FooterComponent,
    ProductModalComponent,
    CartDrawerComponent,
    CheckoutModalComponent,
    OrderReceiptModalComponent,
    OwnerPanelComponent,
    UserGuideModalComponent,
    AuthModalComponent,
    MembershipModalComponent,
    BarcodeScannerModalComponent,
    InStorePosModalComponent,
    AiChatDrawerComponent,
    BrandPortalModalComponent,
    LoginGateComponent,
    SocialShareModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly cartService = inject(CartService);
  readonly api = inject(ApiService);
  readonly currencyService = inject(CurrencyService);
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  readonly membershipService = inject(MembershipService);
  readonly posService = inject(PosService);
  readonly catalogComp = viewChild(CatalogComponent);

  selectedProduct = signal<Product | null>(null);
  checkoutModalOpen = signal<boolean>(false);
  confirmedOrder = signal<OrderConfirmation | null>(null);
  ownerPanelOpen = signal<boolean>(false);

  // New Modals
  userGuideOpen = signal<boolean>(false);
  barcodeScannerOpen = signal<boolean>(false);
  brandPortalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.api.getStoreConfig().subscribe(cfg => {
      const brand = cfg?.brand;
      if (brand) {
        this.currencyService.syncWithBackend(brand.active_currency, brand.supported_currencies);
        if (brand.active_theme) {
          this.themeService.setTheme(brand.active_theme);
        }
        if (brand.brand_font_family) {
          this.themeService.setFont(brand.brand_font_family);
        }
        if (brand.d3_animation_style) {
          this.themeService.setD3Animation(brand.d3_animation_style);
        }
        if (brand.store_subscription_level) {
          this.themeService.setSubscriptionPlan(brand.store_subscription_level);
        }
      }
    });
  }

  // PWA install banner state
  pwaInstallPrompt = signal<any>(null);
  pwaBannerVisible = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.pwaInstallPrompt.set(e);
        this.pwaBannerVisible.set(true);
      });
    }
  }

  installPwa(): void {
    const prompt = this.pwaInstallPrompt();
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then(() => {
        this.pwaInstallPrompt.set(null);
        this.pwaBannerVisible.set(false);
      });
    } else {
      alert('Atelier Vogue PWA is installed and running with offline service-worker caching.');
      this.pwaBannerVisible.set(false);
    }
  }

  onSelectProduct(product: Product): void {
    this.selectedProduct.set(product);
  }

  onCloseProductModal(): void {
    this.selectedProduct.set(null);
  }

  onOpenCheckout(): void {
    this.checkoutModalOpen.set(true);
  }

  onCloseCheckout(): void {
    this.checkoutModalOpen.set(false);
  }

  onOrderCompleted(order: OrderConfirmation): void {
    this.confirmedOrder.set(order);
  }

  onCloseReceipt(): void {
    this.confirmedOrder.set(null);
  }

  onOpenAdminPanel(): void {
    this.ownerPanelOpen.set(true);
  }

  onCloseAdminPanel(): void {
    this.ownerPanelOpen.set(false);
  }

  scrollToCatalog(categorySlug: string = 'all'): void {
    const el = document.getElementById(categorySlug === 'lookbook' ? 'lookbook-section' : 'catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    const comp = this.catalogComp();
    if (comp && categorySlug !== 'lookbook') {
      if (categorySlug === 'kids') {
        comp.setDepartment('kids');
        comp.setCategory('all');
      } else {
        comp.setDepartment('all');
        comp.setCategory(categorySlug);
      }
    }
  }
}
