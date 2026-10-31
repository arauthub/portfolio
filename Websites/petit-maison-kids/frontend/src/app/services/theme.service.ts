import { Injectable, signal, effect } from '@angular/core';
import { D3AnimationType } from '../models/kids.model';

export type KidsBrandTheme = 'theme-nordic-pastel' | 'theme-sunshine-pop' | 'theme-parisian-vintage' | 'theme-forest-adventure';

export interface ThemeOption {
  id: KidsBrandTheme;
  name: string;
  tagline: string;
  description: string;
  paletteColors: string[];
  primary: string;
  accent: string;
  surface: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly availableThemes: ThemeOption[] = [
    {
      id: 'theme-nordic-pastel',
      name: 'Nordic Pastel Nursery',
      tagline: 'Warm Buttermilk, Soft Sage & Powder Blue',
      description: 'Warm Buttermilk, Soft Sage & Powder Blue',
      paletteColors: ['#FAF6EE', '#7AA884', '#FAD4C0'],
      primary: '#7AA884',
      accent: '#FAD4C0',
      surface: '#FAF6EE'
    },
    {
      id: 'theme-sunshine-pop',
      name: 'Playful Sunshine Pop',
      tagline: 'Sunny Tangerine, Coral Poppy & Seafoam',
      description: 'Sunny Tangerine, Coral Poppy & Seafoam',
      paletteColors: ['#FFFDF7', '#FF9F1C', '#FF6B6B'],
      primary: '#FF9F1C',
      accent: '#FF6B6B',
      surface: '#FFFDF7'
    },
    {
      id: 'theme-parisian-vintage',
      name: 'Heirloom Parisian Vintage',
      tagline: 'French Storybook Lavender & Antique Ecru',
      description: 'French Storybook Lavender & Antique Ecru',
      paletteColors: ['#F9F6F0', '#8E7CC3', '#D9A05B'],
      primary: '#8E7CC3',
      accent: '#D9A05B',
      surface: '#F9F6F0'
    },
    {
      id: 'theme-forest-adventure',
      name: 'Enchanted Forest Explorer',
      tagline: 'Pine Woodland Sage & Terracotta Acorn',
      description: 'Pine Woodland Sage & Terracotta Acorn',
      paletteColors: ['#F4F1EA', '#3D5A4C', '#C86D51'],
      primary: '#3D5A4C',
      accent: '#C86D51',
      surface: '#F4F1EA'
    }
  ];

  readonly currentTheme = signal<KidsBrandTheme>(this.getInitialTheme());
  readonly d3AnimationType = signal<D3AnimationType>('silk');
  readonly activeFont = signal<string>('Fredoka');
  readonly storeSubscription = signal<'STARTER' | 'GROWTH' | 'ENTERPRISE_VIP'>('ENTERPRISE_VIP');

  readonly availableFonts = [
    { id: 'Fredoka', label: 'Fredoka Rounded', family: "'Fredoka', cursive, sans-serif" },
    { id: 'Nunito', label: 'Nunito Soft', family: "'Nunito', sans-serif" },
    { id: 'Quicksand', label: 'Quicksand Clean', family: "'Quicksand', sans-serif" },
    { id: 'Playfair', label: 'Playfair Storybook', family: "'Playfair Display', serif" },
    { id: 'Inter', label: 'Inter Universal', family: "'Inter', sans-serif" }
  ];

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      this.applyThemeToBody(theme);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('petit_kids_theme', theme);
      }
    });

    effect(() => {
      const font = this.activeFont();
      if (typeof document !== 'undefined') {
        const selected = this.availableFonts.find(f => f.id === font);
        if (selected) {
          document.documentElement.style.setProperty('--font-family-kids', selected.family);
        }
      }
    });
  }

  setTheme(themeId: string): void {
    const validTheme = this.availableThemes.find(t => t.id === themeId);
    if (validTheme) {
      this.currentTheme.set(validTheme.id);
    }
  }

  setD3Animation(anim: D3AnimationType): void {
    this.d3AnimationType.set(anim);
  }

  setFont(fontId: string): void {
    this.activeFont.set(fontId);
  }

  setSubscription(tier: 'STARTER' | 'GROWTH' | 'ENTERPRISE_VIP'): void {
    this.storeSubscription.set(tier);
  }

  hasFeature(feature: 'CUSTOM_FONTS' | 'D3_ANIMATIONS' | 'MULTI_BRAND' | 'IN_STORE_POS' | 'AI_ASSISTANT'): boolean {
    const sub = this.storeSubscription();
    if (sub === 'ENTERPRISE_VIP') return true;
    if (sub === 'GROWTH') {
      return ['CUSTOM_FONTS', 'D3_ANIMATIONS', 'IN_STORE_POS'].includes(feature);
    }
    return false;
  }

  private getInitialTheme(): KidsBrandTheme {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('petit_kids_theme') as KidsBrandTheme;
      if (saved && this.availableThemes.some(t => t.id === saved)) {
        return saved;
      }
    }
    return 'theme-nordic-pastel';
  }

  private applyThemeToBody(theme: KidsBrandTheme): void {
    if (typeof document !== 'undefined') {
      const body = document.body;
      this.availableThemes.forEach(t => body.classList.remove(t.id));
      body.classList.add(theme);
    }
  }
}
