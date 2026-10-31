import { Injectable, signal, computed, effect } from '@angular/core';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  free_shipping_threshold: number;
}

export const DEFAULT_ATELIER_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', rate: 1.0, free_shipping_threshold: 15000 },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', rate: 0.012, free_shipping_threshold: 180 },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', rate: 0.011, free_shipping_threshold: 165 },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', rate: 0.0095, free_shipping_threshold: 140 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', rate: 0.044, free_shipping_threshold: 660 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (S$)', rate: 0.016, free_shipping_threshold: 240 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (¥)', rate: 1.82, free_shipping_threshold: 27500 }
];

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly storageKey = 'atelier_active_currency';
  
  // Default currency is INR as requested
  readonly activeCurrency = signal<string>(this.getInitialCurrency());
  readonly supportedCurrencies = signal<CurrencyConfig[]>(DEFAULT_ATELIER_CURRENCIES);

  readonly currentConfig = computed<CurrencyConfig>(() => {
    const code = this.activeCurrency();
    const match = this.supportedCurrencies().find(c => c.code === code);
    return match || this.supportedCurrencies()[0];
  });

  readonly activeSymbol = computed<string>(() => this.currentConfig().symbol);
  readonly activeRate = computed<number>(() => this.currentConfig().rate);
  readonly freeShippingThreshold = computed<number>(() => this.currentConfig().free_shipping_threshold);

  constructor() {
    effect(() => {
      const code = this.activeCurrency();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, code);
      }
    });
  }

  private getInitialCurrency(): string {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return saved;
    }
    return 'INR';
  }

  setCurrency(code: string): void {
    const match = this.supportedCurrencies().find(c => c.code.toUpperCase() === code.toUpperCase());
    if (match) {
      this.activeCurrency.set(match.code);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, match.code);
      }
    }
  }

  syncWithBackend(backendActiveCurrency: string, backendCurrencies?: CurrencyConfig[]): void {
    if (backendCurrencies && backendCurrencies.length > 0) {
      this.supportedCurrencies.set(backendCurrencies);
    }
    if (typeof localStorage !== 'undefined') {
      const userPreference = localStorage.getItem(this.storageKey);
      if (!userPreference && backendActiveCurrency) {
        this.setCurrency(backendActiveCurrency);
        return;
      }
    }
    if (backendActiveCurrency && !this.supportedCurrencies().some(c => c.code === this.activeCurrency())) {
      this.setCurrency(backendActiveCurrency);
    }
  }

  convert(amountInInrBase: number | string | null | undefined): number {
    if (amountInInrBase == null || amountInInrBase === '') return 0;
    const val = typeof amountInInrBase === 'number' ? amountInInrBase : parseFloat(String(amountInInrBase));
    if (isNaN(val)) return 0;
    const rate = this.activeRate();
    return val * rate;
  }

  format(amountInInrBase: number | string | null | undefined): string {
    if (amountInInrBase == null || amountInInrBase === '') return '—';
    const val = typeof amountInInrBase === 'number' ? amountInInrBase : parseFloat(String(amountInInrBase));
    if (isNaN(val)) return '—';
    const cfg = this.currentConfig();
    const converted = val * cfg.rate;

    switch (cfg.code) {
      case 'INR':
        return `₹${Math.round(converted).toLocaleString('en-IN')}`;
      case 'JPY':
        return `¥${Math.round(converted).toLocaleString('ja-JP')}`;
      case 'EUR':
        return `€${converted.toFixed(2)}`;
      case 'GBP':
        return `£${converted.toFixed(2)}`;
      case 'AED':
        return `AED ${converted.toFixed(2)}`;
      case 'SGD':
        return `S$${converted.toFixed(2)}`;
      case 'USD':
      default:
        return `$${converted.toFixed(2)}`;
    }
  }

  formatThreshold(): string {
    const cfg = this.currentConfig();
    switch (cfg.code) {
      case 'INR':
        return `₹${Math.round(cfg.free_shipping_threshold).toLocaleString('en-IN')}`;
      case 'JPY':
        return `¥${Math.round(cfg.free_shipping_threshold).toLocaleString('ja-JP')}`;
      case 'EUR':
        return `€${cfg.free_shipping_threshold}`;
      case 'GBP':
        return `£${cfg.free_shipping_threshold}`;
      case 'AED':
        return `AED ${cfg.free_shipping_threshold}`;
      case 'SGD':
        return `S$${cfg.free_shipping_threshold}`;
      case 'USD':
      default:
        return `$${cfg.free_shipping_threshold}`;
    }
  }
}
