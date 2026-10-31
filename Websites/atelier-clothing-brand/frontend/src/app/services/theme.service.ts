import { Injectable, signal, effect } from '@angular/core';
import { D3AnimationType } from '../models/product.model';

export type BrandTheme = 
  | 'theme-luxe-monochrome' 
  | 'theme-royal-gold'
  | 'theme-neo-streetwear' 
  | 'theme-artisan-boho' 
  | 'theme-nordic-minimal';

export type BrandFont = 
  | 'Playfair Display' 
  | 'Cinzel' 
  | 'Montserrat' 
  | 'Plus Jakarta Sans' 
  | 'Cormorant Garamond';

export type SubscriptionPlan = 'STARTER' | 'GROWTH' | 'ENTERPRISE_VIP';

export interface ThemeOption {
  id: BrandTheme;
  name: string;
  tagline: string;
  paletteColors: string[];
}

export interface FontOption {
  id: BrandFont;
  name: string;
  category: string;
  previewText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly availableThemes: ThemeOption[] = [
    {
      id: 'theme-luxe-monochrome',
      name: 'Luxe Haute Couture',
      tagline: 'Monochrome Editorial & Champagne Gold',
      paletteColors: ['#0A0B0E', '#EAD8C0', '#C19A6B']
    },
    {
      id: 'theme-royal-gold',
      name: 'Royal Heritage Gold',
      tagline: 'Imperial Velvet Noir & Resplendent Gold Zari',
      paletteColors: ['#0B0807', '#E5B842', '#8C1D40']
    },
    {
      id: 'theme-neo-streetwear',
      name: 'Urban Neo-Streetwear',
      tagline: 'Cyber Dark Carbon & Electric Lime',
      paletteColors: ['#050608', '#D4FF00', '#00F0FF']
    },
    {
      id: 'theme-artisan-boho',
      name: 'Artisan Bohemian',
      tagline: 'Warm Terracotta, Sage & Natural Linen',
      paletteColors: ['#120E0C', '#D97757', '#8EA87D']
    },
    {
      id: 'theme-nordic-minimal',
      name: 'Nordic Clean',
      tagline: 'Crisp Slate & Minimalist Architectural Lines',
      paletteColors: ['#0A0F12', '#CBD5E1', '#94A3B8']
    }
  ];

  readonly availableFonts: FontOption[] = [
    {
      id: 'Playfair Display',
      name: 'Playfair Display',
      category: 'Haute Couture Editorial Serif',
      previewText: 'Architectural Cashmere Silhouettes'
    },
    {
      id: 'Cinzel',
      name: 'Cinzel',
      category: 'Imperial Luxury Roman Serif',
      previewText: 'HAUTE COUTURE MILANO'
    },
    {
      id: 'Montserrat',
      name: 'Montserrat',
      category: 'Contemporary Modern Sans',
      previewText: 'Avant-Garde Precision Tailoring'
    },
    {
      id: 'Plus Jakarta Sans',
      name: 'Plus Jakarta Sans',
      category: 'Clean Minimalist Tech Sans',
      previewText: 'Regenerative Traceable Fibers'
    },
    {
      id: 'Cormorant Garamond',
      name: 'Cormorant Garamond',
      category: 'Artisanal Heirloom Classical Serif',
      previewText: 'Handcrafted Heritage Loom & Weft'
    }
  ];

  readonly currentTheme = signal<BrandTheme>(this.getInitialTheme());
  readonly currentFont = signal<BrandFont>('Playfair Display');
  readonly currentD3Animation = signal<D3AnimationType>('silk_flow');
  readonly subscriptionPlan = signal<SubscriptionPlan>('ENTERPRISE_VIP');

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      this.applyThemeToBody(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('atelier_active_theme', theme);
      }
    });

    effect(() => {
      const font = this.currentFont();
      this.applyFontToBody(font);
      if (typeof window !== 'undefined') {
        localStorage.setItem('atelier_active_font', font);
      }
    });
  }

  setTheme(themeId: BrandTheme): void {
    this.currentTheme.set(themeId);
  }

  setFont(fontId: BrandFont): void {
    this.currentFont.set(fontId);
  }

  setD3Animation(style: D3AnimationType): void {
    this.currentD3Animation.set(style);
  }

  setSubscriptionPlan(plan: SubscriptionPlan): void {
    this.subscriptionPlan.set(plan);
  }

  isFeatureAllowed(feature: 'multi_brand' | 'd3_custom' | 'barcode' | 'pos' | 'ai_assistant'): boolean {
    const plan = this.subscriptionPlan();
    if (plan === 'ENTERPRISE_VIP') return true;
    if (plan === 'GROWTH') {
      return feature !== 'pos' && feature !== 'ai_assistant';
    }
    // STARTER:
    return false;
  }

  private getInitialTheme(): BrandTheme {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atelier_active_theme') as BrandTheme;
      if (saved && this.availableThemes.some(t => t.id === saved)) {
        return saved;
      }
    }
    return 'theme-luxe-monochrome';
  }

  private applyThemeToBody(theme: BrandTheme): void {
    if (typeof document !== 'undefined') {
      const body = document.body;
      this.availableThemes.forEach(t => body.classList.remove(t.id));
      body.classList.add(theme);
    }
  }

  private applyFontToBody(font: BrandFont): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--font-serif', `'${font}', Georgia, serif`);
      document.documentElement.style.setProperty('--font-display', `'${font}', serif`);
    }
  }
}
