import { Component, inject, signal, computed, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product, ProductCategory, BrandTenant } from '../../models/product.model';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  private api = inject(ApiService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly currencyService = inject(CurrencyService);

  readonly selectProduct = output<Product>();

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  hostedBrands = signal<BrandTenant[]>([]);
  loading = signal<boolean>(true);

  // Filters
  selectedCategorySlug = signal<string>('all');
  selectedDepartment = signal<string>('all');
  selectedBrand = signal<string>('all');
  searchQuery = signal<string>('');
  selectedSize = signal<string>('ALL');
  maxPriceFilter = signal<number>(500000);
  sortBy = signal<string>('featured');
  onlyInStock = signal<boolean>(false);

  // Active color hover preview state per product
  activeColorMap = signal<Record<number, string>>({});

  readonly availableSizes = ['ALL', 'XS / 34', 'S / 36', 'M / 38', 'L / 40', 'XL / 42', 'Custom Tailoring', '0-24M', '2-5Y'];

  readonly filteredProducts = computed(() => {
    let list = this.products();

    // 1. Department Filter (Adults vs Kids vs All)
    const dept = this.selectedDepartment();
    if (dept !== 'all') {
      list = list.filter(p => (p.department || 'adults') === dept || p.department === 'unisex');
    }

    // 2. Brand Filter
    const brand = this.selectedBrand();
    if (brand !== 'all') {
      list = list.filter(p => (p.brand_name || 'Atelier Vogue').toLowerCase() === brand.toLowerCase());
    }

    // 3. Category Filter
    const cat = this.selectedCategorySlug();
    if (cat && cat !== 'all') {
      list = list.filter(p => p.category_slug === cat);
    }

    // 4. Search Query (Title, Fabric, SKU, Barcode, Brand)
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.fabric.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.barcode && p.barcode.includes(query)) ||
        (p.brand_name && p.brand_name.toLowerCase().includes(query)) ||
        (p.category_name && p.category_name.toLowerCase().includes(query))
      );
    }

    // 5. Size Filter
    const size = this.selectedSize();
    if (size !== 'ALL') {
      list = list.filter(p => p.available_sizes.some(s => s.toLowerCase().includes(size.toLowerCase().split(' ')[0])));
    }

    // 6. Max Price Filter
    const maxP = this.maxPriceFilter();
    list = list.filter(p => p.price <= maxP);

    // 7. In Stock Only
    if (this.onlyInStock()) {
      list = list.filter(p => p.inventory_count > 0);
    }

    // 8. Sorting
    const sort = this.sortBy();
    const sorted = [...list];
    if (sort === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      sorted.sort((a, b) => (b.rating_average || 5) - (a.rating_average || 5));
    } else if (sort === 'stock') {
      sorted.sort((a, b) => b.inventory_count - a.inventory_count);
    }

    return sorted;
  });

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.loading.set(true);
    this.api.getCategories().subscribe(cats => {
      this.categories.set(Array.isArray(cats) ? cats : []);
    });

    this.api.getHostedBrands().subscribe(b => {
      this.hostedBrands.set(b);
    });

    this.api.getProducts().subscribe(prods => {
      this.products.set(Array.isArray(prods) ? prods : []);
      this.loading.set(false);
    });
  }

  setCategory(slug: string): void {
    this.selectedCategorySlug.set(slug);
  }

  setDepartment(dept: string): void {
    this.selectedDepartment.set(dept);
  }

  setBrand(brandName: string): void {
    this.selectedBrand.set(brandName);
  }

  setColorPreview(productId: number, colorName: string): void {
    this.activeColorMap.update(m => ({ ...m, [productId]: colorName }));
  }

  quickAddToCart(product: Product, event: Event): void {
    event.stopPropagation();
    const defaultSize = product.available_sizes[0] || 'M';
    const defaultColor = product.color_swatches[0]?.name || 'Classic';
    const defaultHex = product.color_swatches[0]?.hex || '#000000';
    this.cartService.addItem(product, defaultSize, defaultColor, defaultHex, 1);
  }

  toggleWishlist(sku: string, event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggle(sku);
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80';
  }
}
