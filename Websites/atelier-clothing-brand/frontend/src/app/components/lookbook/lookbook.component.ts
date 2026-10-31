import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-lookbook',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './lookbook.component.html',
  styleUrls: ['./lookbook.component.scss']
})
export class LookbookComponent {
  readonly currencyService = inject(CurrencyService);
  readonly exploreCollection = output<string>();

  readonly looks = [
    {
      id: 1,
      season: 'LOOK 01 • KASHI WEAVE RUNWAY',
      title: 'The Noor-e-Kashi Pure Banarasi Katan Silk Saree',
      description: 'Kadwa hand-woven pure mulberry silk with real gold tested zari and antique brocade pallu.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      sku: 'AR-SAR-001',
      priceUsd: 38500
    },
    {
      id: 2,
      season: 'LOOK 02 • AWADHI WEDDING DARBAR',
      title: 'The Begum Zardozi Crimson Velvet Bridal Lehenga',
      description: 'Handcrafted by 8 master zardozi karigars with semi-precious Basra pearls and dabka embroidery.',
      image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=85',
      sku: 'AR-LHG-002',
      priceUsd: 185000
    },
    {
      id: 3,
      season: 'LOOK 03 • SHEKHAWATI HAVELI',
      title: 'The Gulabi Chanderi Tissue Hand-Embroidered Anarkali',
      description: 'Weightless 28-kali tissue flair with traditional Mukesh needlework and pure gota patti accents.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      sku: 'AR-ANK-004',
      priceUsd: 28500
    }
  ];
}
