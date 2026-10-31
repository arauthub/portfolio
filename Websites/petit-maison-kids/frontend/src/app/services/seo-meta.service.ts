import { Injectable, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface PageMetaConfig {
  title: string;
  description: string;
  image: string;
  url?: string;
  type?: string;
  keywords?: string;
  favicon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoMetaService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  readonly defaultMeta: PageMetaConfig = {
    title: 'NANHI MAISON | Royal Indian Heirloom Childrenswear (Pure Mulmul 0-12Y)',
    description: 'Nanhi Maison — Pure Organic Mulmul, Festive Handlooms & Scratch-Free Craft for Little Nawabs & Paris (0-12Y). Custom Zari Monogramming & Bluedart Dispatch.',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85',
    url: 'http://localhost:4201',
    type: 'website',
    keywords: 'organic mulmul, kids festive clothing, baby jhablas, children lehenga, sibling diwali jodi, nanhi maison',
    favicon: 'favicon.svg'
  };

  readonly currentTitle = signal(this.defaultMeta.title);
  readonly currentDescription = signal(this.defaultMeta.description);
  readonly currentOgImage = signal(this.defaultMeta.image);
  readonly currentFavicon = signal(this.defaultMeta.favicon || 'favicon.svg');
  readonly isShareModalOpen = signal(false);
  readonly activeItemForShare = signal<any>(null);

  constructor() {
    this.setPageMeta(this.defaultMeta);
  }

  setPageMeta(config: Partial<PageMetaConfig>): void {
    const meta: PageMetaConfig = { ...this.defaultMeta, ...config };

    this.currentTitle.set(meta.title);
    this.currentDescription.set(meta.description);
    this.currentOgImage.set(meta.image);
    if (meta.favicon) this.currentFavicon.set(meta.favicon);

    this.titleService.setTitle(meta.title);

    this.metaService.updateTag({ name: 'description', content: meta.description });
    if (meta.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: meta.keywords });
    }

    this.metaService.updateTag({ property: 'og:type', content: meta.type || 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'NANHI MAISON' });
    this.metaService.updateTag({ property: 'og:title', content: meta.title });
    this.metaService.updateTag({ property: 'og:description', content: meta.description });
    this.metaService.updateTag({ property: 'og:image', content: meta.image });
    if (meta.url) {
      this.metaService.updateTag({ property: 'og:url', content: meta.url });
    }

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: meta.title });
    this.metaService.updateTag({ name: 'twitter:description', content: meta.description });
    this.metaService.updateTag({ name: 'twitter:image', content: meta.image });

    if (meta.favicon) {
      this.updateFavicon(meta.favicon);
    }
  }

  setProductMeta(product: any): void {
    if (!product) return;
    const itemTitle = `${product.title} | Nanhi Maison Organic Heirloom`;
    const itemDesc = product.description || `Featherlight 100% GOTS organic mulmul ${product.title} for gentle sensitive skin. Scratch-free lined with optional royal gold zari monogramming.`;
    const itemImg = product.primary_image || this.defaultMeta.image;
    const itemUrl = `http://localhost:4201/?product=${product.id || product.slug || 'garment'}`;

    this.setPageMeta({
      title: itemTitle,
      description: itemDesc,
      image: itemImg,
      url: itemUrl,
      type: 'product',
      keywords: `${product.title}, ${product.age_stage || 'kids'}, organic mulmul, nanhi maison, childrenswear`
    });
  }

  updateFavicon(iconUrl: string): void {
    if (typeof this.document === 'undefined') return;
    this.currentFavicon.set(iconUrl);
    const head = this.document.getElementsByTagName('head')[0];
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = iconUrl;
    } else {
      link = this.document.createElement('link');
      link.rel = 'icon';
      link.href = iconUrl;
      head.appendChild(link);
    }
  }

  openShare(item?: any): void {
    this.activeItemForShare.set(item || null);
    if (item) {
      this.setProductMeta(item);
    }
    this.isShareModalOpen.set(true);
  }

  closeShare(): void {
    this.isShareModalOpen.set(false);
  }

  getShareLink(platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest', item?: any): string {
    const targetItem = item || this.activeItemForShare();
    const title = targetItem ? targetItem.title : this.currentTitle();
    const url = targetItem ? `http://localhost:4201/?product=${targetItem.id}` : window.location.href;
    const text = encodeURIComponent(`🌸 See ${title} on Nanhi Maison — Pure Organic Mulmul & Scratch-Free Heirlooms (0-12Y): `);
    const encUrl = encodeURIComponent(url);

    switch (platform) {
      case 'whatsapp':
        return `https://api.whatsapp.com/send?text=${text}%20${encUrl}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${text}&url=${encUrl}&hashtags=NanhiMaison,OrganicMulmul,KidsHeirlooms`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
      case 'pinterest':
        const img = encodeURIComponent(targetItem?.primary_image || this.currentOgImage());
        return `https://pinterest.com/pin/create/button/?url=${encUrl}&media=${img}&description=${text}`;
    }
  }

  triggerNativeShare(item?: any): Promise<boolean> {
    const targetItem = item || this.activeItemForShare();
    const title = targetItem ? targetItem.title : this.currentTitle();
    const text = targetItem ? targetItem.description : this.currentDescription();
    const url = targetItem ? `http://localhost:4201/?product=${targetItem.id}` : window.location.href;

    if (typeof navigator !== 'undefined' && navigator.share) {
      return navigator.share({ title, text, url }).then(() => true).catch(() => false);
    }
    return Promise.resolve(false);
  }
}
