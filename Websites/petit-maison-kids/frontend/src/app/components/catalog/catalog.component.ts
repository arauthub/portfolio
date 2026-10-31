import { Component, OnInit, inject, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KidsProduct, KidsCategory } from '../../models/kids.model';
import { ApiService } from '../../services/api.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <section id="catalog" class="catalog-section">
      <div class="container-12">
        <!-- Section Header -->
        <div class="section-head text-center">
          <span class="subheading-accent">INDIAN HEIRLOOM WARDROBE • 0 - 12Y</span>
          <h2 class="section-title">Crafted for Festive Joy, Tailored with Scratch-Free Love</h2>
          <p class="section-desc">
            Organic mulmul angrakhas, gotapatti twirl lehengas, pure silk kurtas and sibling jodis. Engineered with 100% scratch-free cotton linings and room-to-grow cuffs.
          </p>
        </div>

        <!-- Category & Age Filter Bar -->
        <div class="filter-toolbar">
          <div class="category-tabs">
            <button
              class="tab-pill"
              [class.active]="selectedCategory() === 'all'"
              (click)="setCategory('all')"
            >
              All Heirlooms ({{ allProducts().length }})
            </button>
            <button
              class="tab-pill"
              *ngFor="let cat of categories()"
              [class.active]="selectedCategory() === cat.slug"
              (click)="setCategory(cat.slug)"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- Quick Feature Filters -->
          <div class="secondary-filters">
            <button
              class="feature-filter-btn"
              [class.active]="filterMonogramOnly()"
              (click)="toggleMonogramOnly()"
            >
              <mat-icon class="btn-icon">brush</mat-icon>
              Royal Zari Monogram
            </button>
            <button
              class="feature-filter-btn"
              [class.active]="filterGrowOnly()"
              (click)="toggleGrowOnly()"
            >
              <mat-icon class="btn-icon">shield</mat-icon>
              100% Scratch-Free Lined
            </button>

            <!-- Sort Select -->
            <div class="sort-wrapper">
              <label for="catalog-sort" class="sort-label">Sort:</label>
              <select id="catalog-sort" [(ngModel)]="sortOrder" class="sort-select">
                <option value="featured">Most Loved</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 12-Column Product Grid -->
        <div class="grid-12 products-grid" *ngIf="filteredProducts().length > 0; else noProducts">
          <article
            class="col-4 product-card luxury-card-hover"
            *ngFor="let product of filteredProducts(); let i = index"
            [id]="'product-card-' + i"
            (click)="selectProduct.emit(product)"
          >
            <!-- Media Container -->
            <div class="card-media">
              <img
                [src]="product.primary_image"
                [alt]="product.title"
                class="prod-img primary"
                loading="lazy"
                (error)="onImgError($event)"
              />
              <img
                [src]="product.hover_image"
                [alt]="product.title + ' detail'"
                class="prod-img secondary"
                loading="lazy"
                (error)="onImgError($event)"
              />

              <!-- Top Left Badges -->
              <div class="badge-cluster">
                <span class="product-badge" *ngIf="product.badge_text">
                  {{ product.badge_text }}
                </span>
                <span class="grow-cuff-badge">
                  <mat-icon class="mini-icon">shield</mat-icon> Scratch-Free Lined
                </span>
              </div>

              <!-- Wishlist Action -->
              <button
                class="wishlist-btn"
                [id]="'wishlist-btn-' + i"
                [class.favorited]="wishlist.isInWishlist(product.id)"
                (click)="toggleWishlist(product, $event)"
                matTooltip="Save to Nursery Wishlist"
                aria-label="Save to Wishlist"
              >
                <mat-icon>{{ wishlist.isInWishlist(product.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
              </button>

              <!-- Quick View / Personalize Overlay on Hover -->
              <div class="media-hover-overlay">
                <button
                  mat-raised-button
                  class="quick-personalize-btn gold-shimmer-btn"
                  [id]="'product-btn-' + i"
                  (click)="selectProduct.emit(product)"
                >
                  <mat-icon *ngIf="product.is_monogrammable">brush</mat-icon>
                  <span>{{ product.is_monogrammable ? 'Personalize Royal Monogram' : 'Select Size' }}</span>
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="card-content">
              <!-- Category and Age Stage -->
              <div class="card-meta">
                <span class="meta-stage">{{ product.age_stage }}</span>
                <span class="meta-dot">•</span>
                <span class="meta-cert">OEKO-TEX Class I</span>
              </div>

              <h3 class="product-name" (click)="selectProduct.emit(product)">
                {{ product.title }}
              </h3>

              <!-- Rating -->
              <div class="product-rating" *ngIf="product.rating_average">
                <div class="stars">
                  <mat-icon class="star-icon">star</mat-icon>
                  <span class="rate-val">{{ product.rating_average }}</span>
                </div>
                <span class="review-count">({{ product.review_count || 12 }} verified parents)</span>
              </div>

              <!-- Price -->
              <div class="price-row">
                <span class="current-price">{{ currency.format(product.price) }}</span>
                <span class="compare-price" *ngIf="product.compare_at_price">
                  {{ currency.format(product.compare_at_price) }}
                </span>
                <span class="monogram-tag" *ngIf="product.is_monogrammable">
                  <mat-icon class="mono-mini">edit</mat-icon> Monogrammable
                </span>
              </div>

              <!-- Color Swatches -->
              <div class="swatches-row" *ngIf="product.color_swatches && product.color_swatches.length > 0">
                <span
                  class="swatch-circle"
                  *ngFor="let s of product.color_swatches"
                  [style.backgroundColor]="s.hex"
                  [matTooltip]="s.name"
                ></span>
                <span class="swatch-count-text">{{ product.color_swatches.length }} shades</span>
              </div>
            </div>
          </article>
        </div>

        <!-- No Products Fallback -->
        <ng-template #noProducts>
          <div class="empty-state text-center">
            <mat-icon class="empty-icon">search_off</mat-icon>
            <h3>No garments found matching filters</h3>
            <p>Try resetting the filters or switching age categories.</p>
            <button mat-stroked-button (click)="resetFilters()">Reset All Filters</button>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .catalog-section {
      padding: 4.5rem 0;
      background: var(--pm-surface, #FDFBF7);
    }

    .section-head {
      max-width: 680px;
      margin: 0 auto 3rem auto;
    }

    .subheading-accent {
      font-size: 0.75rem;
      letter-spacing: 2px;
      color: var(--pm-primary, #4A5859);
      font-weight: 700;
      text-transform: uppercase;
      display: inline-block;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-family: var(--pm-font-serif, 'Playfair Display', serif);
      font-size: 2.25rem;
      color: var(--pm-text, #2D3A4B);
      margin: 0 0 1rem 0;
      font-weight: 700;
    }

    .section-desc {
      font-size: 1rem;
      color: var(--pm-text-muted, #71717A);
      line-height: 1.6;
      margin: 0;
    }

    .filter-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .category-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tab-pill {
      background: var(--pm-surface-variant, #F5F1ED);
      border: 1px solid transparent;
      color: var(--pm-text, #2D3A4B);
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #EAE5DF;
      }

      &.active {
        background: var(--pm-primary, #4A5859);
        color: #FFFFFF;
        box-shadow: 0 4px 12px rgba(74, 88, 89, 0.2);
      }
    }

    .secondary-filters {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .feature-filter-btn {
      background: #FFFFFF;
      border: 1px solid #E4E4E7;
      color: var(--pm-text, #2D3A4B);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease;

      .btn-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--pm-primary, #4A5859);
      }

      &:hover {
        border-color: var(--pm-primary, #4A5859);
      }

      &.active {
        background: #F0F4F8;
        border-color: var(--pm-primary, #4A5859);
        color: var(--pm-primary, #4A5859);
      }
    }

    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;

      .sort-label {
        font-size: 0.8125rem;
        color: var(--pm-text-muted, #71717A);
        font-weight: 600;
      }

      .sort-select {
        border: 1px solid #E4E4E7;
        background: #FFFFFF;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--pm-text, #2D3A4B);
        outline: none;
        cursor: pointer;

        &:focus {
          border-color: var(--pm-primary, #4A5859);
        }
      }
    }

    .products-grid {
      width: 100%;
    }

    .product-card {
      background: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0,0,0,0.04);

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);

        .prod-img.primary {
          opacity: 0;
        }
        .prod-img.secondary {
          opacity: 1;
        }
        .media-hover-overlay {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    .card-media {
      position: relative;
      height: 330px;
      overflow: hidden;
      background: #F5F1ED;
      cursor: pointer;

      .prod-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.4s ease, transform 0.5s ease;

        &.primary {
          opacity: 1;
        }
        &.secondary {
          opacity: 0;
        }
      }
    }

    .badge-cluster {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 2;
    }

    .product-badge {
      background: var(--pm-primary, #4A5859);
      color: #FFFFFF;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .grow-cuff-badge {
      background: rgba(255, 255, 255, 0.95);
      color: #2D3A4B;
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);

      .mini-icon {
        font-size: 13px;
        width: 13px;
        height: 13px;
        color: #24542B;
      }
    }

    .wishlist-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #71717A;
      transition: all 0.2s ease;
      z-index: 3;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &:hover {
        transform: scale(1.1);
        color: #DC2626;
      }

      &.favorited {
        color: #DC2626;
      }
    }

    .media-hover-overlay {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.25s ease;
      z-index: 2;

      .quick-personalize-btn {
        width: 100% !important;
        background: rgba(255, 255, 255, 0.95) !important;
        color: #2D3A4B !important;
        backdrop-filter: blur(8px) !important;
        font-size: 0.8125rem !important;
        font-weight: 700 !important;
        border-radius: 12px !important;
        padding: 10px !important;
        box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          color: var(--pm-primary, #4A5859);
        }

        &:hover {
          background: #FFFFFF !important;
        }
      }
    }

    .card-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #475569;
      margin-bottom: 6px;
      font-weight: 500;

      .meta-stage {
        font-weight: 700;
        color: var(--pm-primary, #4A5859);
      }
    }

    .product-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--pm-text, #2D3A4B);
      margin: 0 0 8px 0;
      cursor: pointer;
      line-height: 1.35;
      transition: color 0.2s;

      &:hover {
        color: var(--pm-primary, #4A5859);
      }
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;

      .stars {
        display: flex;
        align-items: center;
        gap: 2px;
        color: #B45309;

        .star-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
        }

        .rate-val {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #1A1A1A;
        }
      }

      .review-count {
        font-size: 0.75rem;
        color: #475569;
      }
    }

    .price-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;

      .current-price {
        font-size: 1.125rem;
        font-weight: 800;
        color: var(--pm-text, #2D3A4B);
      }

      .compare-price {
        font-size: 0.875rem;
        color: #4B5563;
        text-decoration: line-through;
        font-weight: 600;
      }

      .monogram-tag {
        margin-left: auto;
        font-size: 0.6875rem;
        color: #7C2D12;
        background: #FFEDD5;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 3px;

        .mono-mini {
          font-size: 12px;
          width: 12px;
          height: 12px;
        }
      }
    }

    .swatches-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px solid rgba(0,0,0,0.05);

      .swatch-circle {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid rgba(0,0,0,0.15);
      }

      .swatch-count-text {
        font-size: 0.6875rem;
        color: #475569;
        margin-left: 4px;
      }
    }

    .empty-state {
      padding: 4rem 1rem;

      .empty-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #A1A1AA;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.25rem;
        margin: 0 0 0.5rem;
      }

      p {
        color: #71717A;
        margin: 0 0 1.5rem;
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  api = inject(ApiService);
  wishlist = inject(WishlistService);
  cart = inject(CartService);
  currency = inject(CurrencyService);

  selectProduct = output<KidsProduct>();

  allProducts = signal<KidsProduct[]>([]);
  categories = signal<KidsCategory[]>([]);
  selectedCategory = signal<string>('all');
  filterMonogramOnly = signal<boolean>(false);
  filterGrowOnly = signal<boolean>(false);
  sortOrder = 'featured';

  filteredProducts = computed(() => {
    let list = [...this.allProducts()];

    // Category filter with bidirectional alias support
    const cat = this.selectedCategory();
    if (cat !== 'all') {
      const aliasMap: Record<string, string[]> = {
        'shishu-newborn': ['baby', 'shishu-newborn'],
        'baby': ['baby', 'shishu-newborn'],
        'chhota-nawab': ['toddler', 'chhota-nawab'],
        'toddler': ['toddler', 'chhota-nawab'],
        'nanhi-pari-lehengas': ['junior', 'nanhi-pari-lehengas'],
        'junior': ['junior', 'nanhi-pari-lehengas'],
        'sibling-festive-jodi': ['sibling', 'sibling-festive-jodi'],
        'sibling': ['sibling', 'sibling-festive-jodi'],
        'organic-mulmul': ['organic-basics', 'organic-mulmul'],
        'organic-basics': ['organic-basics', 'organic-mulmul'],
      };
      const allowed = aliasMap[cat] || [cat];
      list = list.filter(p => 
        allowed.includes(p.category_slug) || 
        (cat.startsWith('sibling') && p.category_slug.startsWith('sibling'))
      );
    }

    // Monogram only filter
    if (this.filterMonogramOnly()) {
      list = list.filter(p => p.is_monogrammable);
    }

    // Room to grow cuffs filter
    if (this.filterGrowOnly()) {
      list = list.filter(p => p.extendable_cuffs);
    }

    // Sorting
    switch (this.sortOrder) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
        break;
      case 'featured':
      default:
        // bestsellers first
        list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
        break;
    }

    return list;
  });

  ngOnInit(): void {
    this.api.getCategories().subscribe(cats => this.categories.set(cats));
    this.api.getProducts().subscribe(prods => this.allProducts.set(prods));
  }

  setCategory(slug: string): void {
    if (slug === 'sibling-sets' || slug === 'sibling') {
      const match = this.categories().find(c => c.slug.startsWith('sibling'));
      this.selectedCategory.set(match ? match.slug : slug);
    } else {
      this.selectedCategory.set(slug);
    }
  }

  toggleMonogramOnly(): void {
    this.filterMonogramOnly.set(!this.filterMonogramOnly());
  }

  toggleGrowOnly(): void {
    this.filterGrowOnly.set(!this.filterGrowOnly());
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.filterMonogramOnly.set(false);
    this.filterGrowOnly.set(false);
    this.sortOrder = 'featured';
  }

  toggleWishlist(product: KidsProduct, event: Event): void {
    event.stopPropagation();
    this.wishlist.toggle(product);
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';
  }
}
