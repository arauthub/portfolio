import { Component, inject, signal, output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss']
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  readonly currencyService = inject(CurrencyService);
  private api = inject(ApiService);

  readonly openCheckout = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.cartService.isDrawerOpen()) {
      this.cartService.closeDrawer();
    }
  }

  couponInput = signal<string>('');
  couponFeedback = signal<string>('');
  couponLoading = signal<boolean>(false);

  applyCoupon(): void {
    const code = this.couponInput().trim();
    if (!code) return;

    this.couponLoading.set(true);
    this.couponFeedback.set('');

    this.api.validateCoupon(code, this.cartService.subtotal()).subscribe(res => {
      this.couponLoading.set(false);
      if (res.valid) {
        this.cartService.setCoupon(res.code, res.discount_percent, res.discount_amount);
        this.couponFeedback.set(`✓ ${res.message}`);
        this.couponInput.set('');
      } else {
        this.couponFeedback.set(`✕ ${res.message}`);
      }
    });
  }

  removeCoupon(): void {
    this.cartService.removeCoupon();
    this.couponFeedback.set('');
  }

  proceedToCheckout(): void {
    this.cartService.closeDrawer();
    this.openCheckout.emit();
  }
}
