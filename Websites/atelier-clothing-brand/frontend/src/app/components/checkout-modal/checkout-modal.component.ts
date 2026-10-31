import { Component, inject, signal, output, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';
import { CurrencyService } from '../../services/currency.service';
import { MembershipService } from '../../services/membership.service';
import { AuthService } from '../../services/auth.service';
import { OrderConfirmation } from '../../models/product.model';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatRadioModule, MatTooltipModule],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss']
})
export class CheckoutModalComponent {
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
  readonly cartService = inject(CartService);
  readonly currencyService = inject(CurrencyService);
  readonly membershipService = inject(MembershipService);
  readonly authService = inject(AuthService);
  private api = inject(ApiService);

  readonly close = output<void>();
  readonly orderCompleted = output<OrderConfirmation>();

  step = signal<1 | 2 | 3>(1);
  submitting = signal<boolean>(false);

  // Form Fields
  customerName = signal<string>(this.authService.currentUser()?.name || 'Maharani Gayatri Sharma');
  customerEmail = signal<string>(this.authService.currentUser()?.email || 'gayatri.sharma@couture-patron.in');
  customerPhone = signal<string>(this.authService.currentUser()?.phone || '+91 98201 54321');
  addressLine = signal<string>('Bungalow 4, Altamount Road, Malabar Hill');
  city = signal<string>('Mumbai');
  state = signal<string>('Maharashtra');
  postalCode = signal<string>('400026');
  country = signal<string>('India');

  shippingMethod = signal<'complimentary' | 'same_day' | 'in_store'>('complimentary');

  // Expanded Payment Options
  paymentGateway = signal<
    'STRIPE' | 'UPI_QR' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'NET_BANKING' | 'KLARNA_BNPL' | 'COD' | 'IN_STORE_PICKUP' | 'STORE_CREDIT'
  >('UPI_QR');

  selectedBank = signal<string>('HDFC Bank');
  giftCardCode = signal<string>('');

  // Card details
  cardNumber = signal<string>('•••• •••• •••• 4242');
  cardHolder = signal<string>('ELEANOR MONTGOMERY');
  cardExpiry = signal<string>('12/28');
  cardCvv = signal<string>('888');
  cardFlipped = signal<boolean>(false);

  sandboxActive = signal<boolean>(true);

  // Membership Discount Calculation
  memberDiscountAmount = computed<number>(() => {
    const subtotal = this.cartService.subtotal();
    const tier = this.membershipService.currentTier();
    return Math.round(subtotal * (tier.discount_percentage / 100) * 100) / 100;
  });

  finalPayableAmount = computed<number>(() => {
    const base = this.cartService.finalTotal();
    const mDiscount = this.memberDiscountAmount();
    return Math.max(0, base - mDiscount);
  });

  nextStep(): void {
    if (this.step() < 3) {
      this.step.update(s => (s + 1) as any);
    }
  }

  prevStep(): void {
    if (this.step() > 1) {
      this.step.update(s => (s - 1) as any);
    }
  }

  processPayment(): void {
    this.submitting.set(true);

    const isInStore = this.shippingMethod() === 'in_store' || this.paymentGateway() === 'IN_STORE_PICKUP';

    const payload = {
      customer_name: this.customerName(),
      customer_email: this.customerEmail(),
      customer_phone: this.customerPhone(),
      address_line: this.addressLine(),
      city: this.city(),
      state: this.state(),
      postal_code: this.postalCode(),
      country: this.country(),
      shipping_method: isInStore 
        ? 'In-Store POS Flagship Collection' 
        : (this.shippingMethod() === 'complimentary' ? 'Complimentary Global Express' : 'Same-Day Eco-White-Glove'),
      payment_gateway: this.paymentGateway(),
      is_pos_order: isInStore,
      in_store_pickup: isInStore,
      membership_tier: this.membershipService.currentTier().tier_type,
      membership_discount: this.memberDiscountAmount(),
      coupon_code: this.cartService.appliedCoupon()?.code || '',
      discount_amount: this.cartService.discountAmount(),
      total_amount: this.finalPayableAmount(),
      currency: this.currencyService.activeCurrency(),
      items: this.cartService.items().map(i => ({
        sku: i.sku,
        title: i.title,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        barcode: i.sku === 'AV-OTR-001' ? '890123450001' : '890123450002'
      }))
    };

    this.api.submitOrder(payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        const confirmation: OrderConfirmation = {
          order_number: res.order.order_number,
          customer_name: res.order.customer_name,
          customer_email: res.order.customer_email,
          subtotal: res.order.subtotal,
          discount_amount: res.order.discount_amount,
          membership_tier_applied: this.membershipService.currentTier().badge_label,
          membership_discount: this.memberDiscountAmount(),
          shipping_cost: res.order.shipping_cost,
          tax_amount: res.order.tax_amount,
          total_amount: res.order.total_amount,
          shipping_method: res.order.shipping_method,
          carrier: res.order.carrier,
          tracking_number: res.order.tracking_number,
          created_at: res.order.created_at,
          items: this.cartService.items(),
          address_line: res.order.address_line,
          city: res.order.city,
          country: res.order.country,
          payment_gateway: res.order.payment_gateway,
          payment_status: res.order.payment_status
        };

        this.cartService.clearCart();
        this.close.emit();
        this.orderCompleted.emit(confirmation);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }
}
