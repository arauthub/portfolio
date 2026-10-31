import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  readonly currencyService = inject(CurrencyService);
  readonly exploreClicked = output<void>();
  readonly lookbookClicked = output<void>();
}
