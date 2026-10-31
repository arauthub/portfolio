import { Component, inject, signal, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService, BrandTheme, BrandFont, SubscriptionPlan } from '../../services/theme.service';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { ApiService } from '../../services/api.service';
import { AiConciergeService } from '../../services/ai-concierge.service';
import { PosService } from '../../services/pos.service';
import { D3AnimationType } from '../../models/product.model';

@Component({
  selector: 'app-owner-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './owner-panel.component.html',
  styleUrls: ['./owner-panel.component.scss']
})
export class OwnerPanelComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  readonly cartService = inject(CartService);
  readonly currencyService = inject(CurrencyService);
  readonly aiService = inject(AiConciergeService);
  readonly posService = inject(PosService);
  private api = inject(ApiService);

  readonly close = output<void>();

  activeTheme = signal<BrandTheme>(this.themeService.currentTheme());
  activeFont = signal<BrandFont>(this.themeService.currentFont());
  activeD3 = signal<D3AnimationType>(this.themeService.currentD3Animation());
  activePlan = signal<SubscriptionPlan>(this.themeService.subscriptionPlan());

  announcementActive = signal<boolean>(true);
  flashSaleTicker = signal<string>('Complimentary Global Express Courier on All Orders Over $250 — Enter Code VOGUE25 for 25% Off');
  activePromoCode = signal<string>('VOGUE25');
  sandboxMode = signal<boolean>(true);
  isSyncing = signal<boolean>(false);

  // AI Copy Generation Tool in Admin
  aiTitle = 'Architectural Cashmere Trench';
  aiFabric = '100% Regenerative Mongolian Double-Faced Cashmere';
  aiCategory = 'Outerwear & Tailoring';
  aiOutput = signal<string>('');
  isGeneratingCopy = signal<boolean>(false);

  // Barcode Live Stock Tool in Admin
  barcodeCode = '890123450001';
  stockAdjustQty = 25;
  stockAdjustStatus = signal<string>('');

  // Wagtail backend link
  readonly wagtailAdminUrl = 'http://localhost:8000/admin/';
  readonly wagtailCredentials = { user: 'admin', pass: 'atelier2026!' };

  ngOnInit(): void {
    this.activeTheme.set(this.themeService.currentTheme());
    this.activeFont.set(this.themeService.currentFont());
    this.activeD3.set(this.themeService.currentD3Animation());
    this.activePlan.set(this.themeService.subscriptionPlan());
  }

  setTheme(themeId: BrandTheme): void {
    this.activeTheme.set(themeId);
    this.themeService.setTheme(themeId);
  }

  setFont(fontId: BrandFont): void {
    this.activeFont.set(fontId);
    this.themeService.setFont(fontId);
  }

  setD3(style: D3AnimationType): void {
    this.activeD3.set(style);
    this.themeService.setD3Animation(style);
  }

  setSubscription(plan: SubscriptionPlan): void {
    this.activePlan.set(plan);
    this.themeService.setSubscriptionPlan(plan);
  }

  generateAiCopy(): void {
    this.isGeneratingCopy.set(true);
    this.aiService.generateAdminCopy(this.aiTitle, this.aiFabric, this.aiCategory).subscribe(res => {
      this.isGeneratingCopy.set(false);
      this.aiOutput.set(res.generated_description);
    });
  }

  restockBarcode(): void {
    if (!this.barcodeCode) return;
    this.api.updateStock(this.barcodeCode, this.stockAdjustQty).subscribe(res => {
      if (res.success) {
        this.stockAdjustStatus.set(`Replenished! Live count: ${res.new_inventory_count} units.`);
      } else {
        this.stockAdjustStatus.set('Barcode not found in catalog.');
      }
    });
  }

  syncBackendCurrency(): void {
    this.isSyncing.set(true);
    this.api.getStoreConfig().subscribe({
      next: (cfg: any) => {
        this.isSyncing.set(false);
        const code = cfg?.brand?.active_currency;
        if (code) {
          this.currencyService.setCurrency(code);
          alert(`Successfully synced with Wagtail Admin! Active Store Currency: ${code}`);
        }
      },
      error: () => {
        this.isSyncing.set(false);
        alert('Could not connect to Wagtail API.');
      }
    });
  }

  saveQuickEdits(): void {
    this.cartService.setCoupon(this.activePromoCode(), 25);
    this.close.emit();
  }
}
