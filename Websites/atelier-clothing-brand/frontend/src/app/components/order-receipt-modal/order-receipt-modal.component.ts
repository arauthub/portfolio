import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OrderConfirmation } from '../../models/product.model';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-order-receipt-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './order-receipt-modal.component.html',
  styleUrls: ['./order-receipt-modal.component.scss']
})
export class OrderReceiptModalComponent {
  readonly currencyService = inject(CurrencyService);
  readonly order = input.required<OrderConfirmation>();
  readonly close = output<void>();

  printInvoice(): void {
    window.print();
  }
}
