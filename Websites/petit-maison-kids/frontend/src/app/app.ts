import { Component, signal, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout-modal/checkout-modal.component';
import { OrderReceiptModalComponent } from './components/order-receipt-modal/order-receipt-modal.component';
import { LookbookComponent } from './components/lookbook/lookbook.component';
import { OwnerPanelComponent } from './components/owner-panel/owner-panel.component';
import { FooterComponent } from './components/footer/footer.component';

// Enterprise Multi-Site & Innovation Components
import { CentralHubHeaderComponent } from './components/central-hub-header/central-hub-header.component';
import { D3VisualizerComponent } from './components/d3-visualizer/d3-visualizer.component';
import { UserGuideModalComponent } from './components/user-guide-modal/user-guide-modal.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { MembershipModalComponent } from './components/membership-modal/membership-modal.component';
import { BarcodeScannerModalComponent } from './components/barcode-scanner-modal/barcode-scanner-modal.component';
import { InStorePosModalComponent } from './components/in-store-pos-modal/in-store-pos-modal.component';
import { BrandPortalModalComponent } from './components/brand-portal-modal/brand-portal-modal.component';
import { AiChatDrawerComponent } from './components/ai-chat-drawer/ai-chat-drawer.component';
import { LoginGateComponent } from './components/login-gate/login-gate.component';
import { SocialShareModalComponent } from './components/social-share-modal/social-share-modal.component';

import { KidsProduct, OrderConfirmation } from './models/kids.model';
import { ThemeService } from './services/theme.service';
import { CartService } from './services/cart.service';
import { ApiService } from './services/api.service';
import { CurrencyService } from './services/currency.service';
import { AuthService } from './services/auth.service';
import { MembershipService } from './services/membership.service';
import { PosService } from './services/pos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    HeaderComponent,
    HeroComponent,
    CatalogComponent,
    ProductModalComponent,
    CartDrawerComponent,
    CheckoutModalComponent,
    OrderReceiptModalComponent,
    LookbookComponent,
    OwnerPanelComponent,
    FooterComponent,
    CentralHubHeaderComponent,
    D3VisualizerComponent,
    UserGuideModalComponent,
    AuthModalComponent,
    MembershipModalComponent,
    BarcodeScannerModalComponent,
    InStorePosModalComponent,
    BrandPortalModalComponent,
    AiChatDrawerComponent,
    LoginGateComponent,
    SocialShareModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  themeService = inject(ThemeService);
  cart = inject(CartService);
  api = inject(ApiService);
  currencyService = inject(CurrencyService);
  auth = inject(AuthService);
  membership = inject(MembershipService);
  pos = inject(PosService);

  @ViewChild(CatalogComponent) catalogRef?: CatalogComponent;
  @ViewChild(UserGuideModalComponent) guideModal?: UserGuideModalComponent;
  @ViewChild(BarcodeScannerModalComponent) barcodeModal?: BarcodeScannerModalComponent;
  @ViewChild(BrandPortalModalComponent) brandPortalModal?: BrandPortalModalComponent;

  selectedProduct = signal<KidsProduct | null>(null);
  isCheckoutOpen = signal<boolean>(false);
  confirmedOrder = signal<OrderConfirmation | null>(null);
  isOwnerPanelOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.api.getStoreConfig().subscribe(cfg => {
      const brand = (cfg as any)?.brand;
      if (brand) {
        this.currencyService.syncWithBackend(brand.active_currency, brand.supported_currencies);
      }
    });
  }

  scrollTo(sectionId: string): void {
    if (sectionId === 'catalog') {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'lookbook') {
      const el = document.getElementById('lookbook');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSelectProduct(product: KidsProduct): void {
    this.selectedProduct.set(product);
  }

  onCloseProductModal(): void {
    this.selectedProduct.set(null);
  }

  onOpenProductBySlug(slug: string): void {
    this.api.getProductBySlug(slug).subscribe(prod => {
      if (prod) {
        this.selectedProduct.set(prod);
      }
    });
  }

  onCategorySelected(slug: string): void {
    if (this.catalogRef) {
      this.catalogRef.setCategory(slug);
    }
  }

  onOpenCheckout(): void {
    this.isCheckoutOpen.set(true);
  }

  onCloseCheckout(): void {
    this.isCheckoutOpen.set(false);
  }

  onOrderCompleted(order: OrderConfirmation): void {
    this.confirmedOrder.set(order);
  }

  onCloseOrderReceipt(): void {
    this.confirmedOrder.set(null);
  }

  toggleOwnerPanel(): void {
    this.isOwnerPanelOpen.set(!this.isOwnerPanelOpen());
  }

  openUserGuide(): void {
    this.guideModal?.open();
  }

  openBarcodeScanner(): void {
    this.barcodeModal?.open();
  }

  openBrandPortal(): void {
    this.brandPortalModal?.open();
  }
}
