import { Injectable, signal, inject } from '@angular/core';
import { POSRegister, POSCartItem, KidsProduct } from '../models/kids.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PosService {
  private api = inject(ApiService);

  isPosModalOpen = signal<boolean>(false);
  activeRegister = signal<POSRegister>({
    register_code: 'POS-PAR-KIDS-01',
    store_name: 'Petit Maison Flagship Rue Saint-Honoré',
    city: 'Paris',
    country: 'France',
    cashier_active: 'Amélie Poulain',
    currency: 'USD',
    is_active: true
  });

  posItems = signal<POSCartItem[]>([]);
  customerName = signal<string>('Boutique In-Store Guest');
  customerPhone = signal<string>('+33 1 42 68 55 00');
  cashGiven = signal<number>(500);
  selectedPaymentType = signal<string>('IN_STORE_CASH');
  lastReceipt = signal<any | null>(null);

  openPos(): void {
    this.isPosModalOpen.set(true);
  }

  closePos(): void {
    this.isPosModalOpen.set(false);
  }

  setRegister(reg: POSRegister): void {
    this.activeRegister.set(reg);
  }

  addItemByProduct(product: KidsProduct, size: string = '12M'): void {
    this.posItems.update((items: POSCartItem[]) => {
      const existing = items.find(i => i.product?.id === product.id && i.selectedSize === size);
      if (existing) {
        return items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, {
        product,
        selectedSize: size,
        selectedColor: product.color_swatches[0] || { name: 'Pastel Rose', hex: '#FAD4C0' },
        quantity: 1
      }];
    });
  }

  updateQuantity(index: number, delta: number): void {
    this.posItems.update(items => {
      const copy = [...items];
      copy[index].quantity += delta;
      if (copy[index].quantity <= 0) {
        copy.splice(index, 1);
      }
      return copy;
    });
  }

  clearCart(): void {
    this.posItems.set([]);
  }

  subtotal(): number {
    return this.posItems().reduce((s, i) => s + ((i.product?.price || 0) * i.quantity), 0);
  }

  tax(): number {
    return Math.round(this.subtotal() * 0.05 * 100) / 100; // 5% reduced tax for childrenswear
  }

  total(): number {
    return this.subtotal() + this.tax();
  }

  changeDue(): number {
    const given = this.cashGiven() || 0;
    return Math.max(0, Math.round((given - this.total()) * 100) / 100);
  }

  completeTransaction(): void {
    const total = this.total();
    const reg = this.activeRegister();
    const orderData = {
      customer_name: this.customerName(),
      customer_email: 'boutique.guest@petitmaison.kids',
      customer_phone: this.customerPhone(),
      is_pos_order: true,
      pos_register_code: reg.register_code,
      cashier_name: reg.cashier_active,
      in_store_pickup: true,
      address_line: `${reg.store_name}, Checkout Desk A`,
      city: reg.city,
      country: reg.country,
      items: this.posItems().map(i => ({
        sku: i.product?.sku || 'PMK-GEN-001',
        title: i.product?.title || 'Children Garment',
        size: i.selectedSize,
        color: i.selectedColor?.name || 'Pastel',
        price: i.product?.price || 0,
        quantity: i.quantity,
        barcode: i.product?.barcode || '890987650001'
      })),
      currency: reg.currency,
      total_amount: total,
      payment_gateway: this.selectedPaymentType()
    };

    this.api.submitOrder(orderData).subscribe((res: any) => {
      const receipt = {
        receipt_number: res.order_number || res.order?.order_number || `POS-KID-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString(),
        register: reg,
        customer_name: this.customerName(),
        customer_phone: this.customerPhone(),
        items: this.posItems(),
        subtotal: this.subtotal(),
        tax: this.tax(),
        total: total,
        payment_gateway: this.selectedPaymentType(),
        cash_given: this.selectedPaymentType() === 'IN_STORE_CASH' ? this.cashGiven() : null,
        change_due: this.selectedPaymentType() === 'IN_STORE_CASH' ? this.changeDue() : null
      };
      this.lastReceipt.set(receipt);
      this.clearCart();
    });
  }
}
