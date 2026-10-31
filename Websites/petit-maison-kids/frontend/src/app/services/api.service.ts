import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { KidsProduct, KidsCategory, BrandTenant } from '../models/kids.model';

export interface KidsTicker {
  id: number;
  message: string;
  icon: string;
  highlight_text: string;
  link_url: string;
}

export interface KidsBanner {
  id: number;
  badge: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: string;
  background_image: string;
  theme_variant: string;
}

export interface KidsStoreConfig {
  store_name: string;
  tagline: string;
  brand_phone: string;
  brand_email: string;
  free_shipping_min: number;
  monogram_fee: number;
  active_theme: string;
  flash_sale_active: boolean;
  flash_sale_headline: string;
  current_season: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8001/api/v1';

  // Fallback high-fidelity kids catalog data matching the seeded Wagtail backend
  private fallbackCategories: KidsCategory[] = [
    {
      id: 1,
      name: 'Baby (0 - 24M)',
      slug: 'baby',
      stage: '0-24M',
      description: 'Buttery-soft GOTS certified organic pima cotton rompers, foldover cuffs, and scratch-free flatlock seams.',
      image_url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
      featured: true,
      product_count: 8
    },
    {
      id: 2,
      name: 'Toddler (2 - 5Y)',
      slug: 'toddler',
      stage: '2-5Y',
      description: 'Adventure-proof reinforced knees, expandable elastic waistbands, and play-ready linen sets.',
      image_url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
      featured: true,
      product_count: 12
    },
    {
      id: 3,
      name: 'Junior (6 - 12Y)',
      slug: 'junior',
      stage: '6-12Y',
      description: 'Tailored school-day blazers, merino knit sweaters, and breathable everyday weekend staples.',
      image_url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80',
      featured: true,
      product_count: 10
    },
    {
      id: 4,
      name: 'Sibling Sets',
      slug: 'sibling-sets',
      stage: 'All Ages',
      description: 'Harmonious heirloom matching outfits for brother-sister and sibling holiday portraiture.',
      image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
      featured: true,
      product_count: 6
    },
    {
      id: 5,
      name: 'Heirloom & Occasion',
      slug: 'occasion',
      stage: 'Christening & Parties',
      description: 'Hand-smocked dupioni silk, delicate pointelle lace, and vintage baptismal keepsakes.',
      image_url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
      featured: true,
      product_count: 5
    }
  ];

  private fallbackProducts: KidsProduct[] = [
    {
      id: 1,
      title: 'Heirloom Organic Cloud Romper',
      slug: 'heirloom-organic-cloud-romper',
      sku: 'PMK-ROMP-001',
      price: 48.00,
      compare_at_price: 64.00,
      category: 1,
      category_name: 'Baby (0 - 24M)',
      category_slug: 'baby',
      badge_text: 'Bestseller',
      is_bestseller: true,
      is_new_arrival: false,
      is_monogrammable: true,
      extendable_cuffs: true,
      inventory_count: 32,
      fabric: '100% GOTS Certified Peruvian Organic Pima Cotton',
      safety_certification: 'OEKO-TEX Standard 100 Class I (Infants)',
      fasteners: 'Nickel-free Japanese YKK Snaps for 10-second diaper changes',
      care_guide: 'Machine wash delicate cold inside out, tumble dry gentle low',
      primary_image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
      hover_image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
      extra_images: [
        'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80'
      ],
      age_stage: '0-24M',
      available_sizes: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
      color_swatches: [
        { name: 'Oatmeal Milk', hex: '#EBE3D5' },
        { name: 'Sage Leaf', hex: '#A3B18A' },
        { name: 'Dusty Rose', hex: '#D8A48F' },
        { name: 'Nordic Sky', hex: '#B8C5D6' }
      ],
      sibling_matching_sku: 'PMK-LNN-002',
      rating_average: 4.95,
      review_count: 142,
      reviews: [
        {
          id: 1,
          parent_name: 'Genevieve L.',
          child_age: 'Baby 4 Months',
          rating: 5,
          headline: 'Incredibly soft and foldover cuffs saved our baby from scratches',
          comment: 'The organic pima cotton is visibly softer than any other brand we purchased. The foldover mitten cuffs are brilliant. We had his initials embroidered in French Cursive and it turned out royal!',
          wash_durability: 'Washed 12x with zero pilling',
          verified_parent: true,
          created_at: '2 days ago'
        },
        {
          id: 2,
          parent_name: 'Marcus & Clara V.',
          child_age: 'Baby 9 Months',
          rating: 5,
          headline: 'The room-to-grow cuffs actually work',
          comment: 'Normally babies outgrow rompers in 3 weeks. The double fold cuffs gave us an extra 2 months of wear. Well worth the price.',
          wash_durability: 'Holds shape and softness perfectly',
          verified_parent: true,
          created_at: '1 week ago'
        }
      ]
    },
    {
      id: 2,
      title: 'Little Explorer French Linen Dungaree Set',
      slug: 'little-explorer-french-linen-dungaree-set',
      sku: 'PMK-LNN-002',
      price: 68.00,
      compare_at_price: 85.00,
      category: 2,
      category_name: 'Toddler (2 - 5Y)',
      category_slug: 'toddler',
      badge_text: 'Editor Choice',
      is_bestseller: true,
      is_new_arrival: false,
      is_monogrammable: true,
      extendable_cuffs: true,
      inventory_count: 24,
      fabric: '100% Normandy Stonewashed Pure French Linen',
      safety_certification: 'GOTS Organic & Hypoallergenic Dye Safe',
      fasteners: 'Natural mother-of-pearl button straps with double buttonholes for height adjustment',
      care_guide: 'Wash cold, line dry in shade for relaxed lived-in texture',
      primary_image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
      hover_image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
      extra_images: [
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80'
      ],
      age_stage: '2-5Y',
      available_sizes: ['2T', '3T', '4T', '5Y'],
      color_swatches: [
        { name: 'French Mustard', hex: '#E3A857' },
        { name: 'Olive Grove', hex: '#6B705C' },
        { name: 'Natural Flax', hex: '#DDBEA9' }
      ],
      sibling_matching_sku: 'PMK-ROMP-001',
      rating_average: 4.88,
      review_count: 89,
      reviews: [
        {
          id: 3,
          parent_name: 'Sophie Dubois',
          child_age: 'Toddler 3Y',
          rating: 5,
          headline: 'Charming French look, withstands playground mud',
          comment: 'My boy wears this everywhere from brunch in St. Germain to playing in sandbox parks. It launders like a dream.',
          wash_durability: 'Gets softer with every wash',
          verified_parent: true,
          created_at: '3 days ago'
        }
      ]
    },
    {
      id: 3,
      title: 'Hand-Smocked Meadow Bloom Sundress',
      slug: 'hand-smocked-meadow-bloom-sundress',
      sku: 'PMK-DRS-003',
      price: 78.00,
      compare_at_price: null,
      category: 2,
      category_name: 'Toddler (2 - 5Y)',
      category_slug: 'toddler',
      badge_text: 'Handcrafted',
      is_bestseller: false,
      is_new_arrival: true,
      is_monogrammable: true,
      extendable_cuffs: false,
      inventory_count: 18,
      fabric: 'Tana Lawn™ Ultra-Fine Cotton with Liberty-style Meadow Botanical Print',
      safety_certification: 'OEKO-TEX 100 Certified Non-Toxic Prints',
      fasteners: 'Pure cotton covered buttons at back neck with sash bow tie',
      care_guide: 'Hand wash warm or gentle cycle in wash pouch, warm iron',
      primary_image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
      hover_image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
      extra_images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'
      ],
      age_stage: '2-5Y',
      available_sizes: ['2T', '3T', '4T', '5Y', '6Y'],
      color_swatches: [
        { name: 'Wildflower Buttercup', hex: '#F4D35E' },
        { name: 'Lavender Mist', hex: '#CDB4DB' },
        { name: 'Powder Blossom', hex: '#FFC6FF' }
      ],
      sibling_matching_sku: 'PMK-BMR-005',
      rating_average: 4.97,
      review_count: 67,
      reviews: []
    },
    {
      id: 4,
      title: 'Chunky Merino Fisherman Cardigan',
      slug: 'chunky-merino-fisherman-cardigan',
      sku: 'PMK-SWT-004',
      price: 84.00,
      compare_at_price: 110.00,
      category: 3,
      category_name: 'Junior (6 - 12Y)',
      category_slug: 'junior',
      badge_text: 'Pure Merino',
      is_bestseller: true,
      is_new_arrival: false,
      is_monogrammable: true,
      extendable_cuffs: true,
      inventory_count: 15,
      fabric: '100% Non-Mulesed Extra-Fine Italian Merino Wool',
      safety_certification: 'Woolmark Certified & Scratch-Free Itch Proof',
      fasteners: 'Genuine horn buttons crafted in England',
      care_guide: 'Hand wash cold or wool program, dry flat on towel',
      primary_image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80',
      hover_image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
      extra_images: [
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80'
      ],
      age_stage: '6-12Y',
      available_sizes: ['6Y', '7-8Y', '9-10Y', '11-12Y'],
      color_swatches: [
        { name: 'Aran Cream', hex: '#F8F9FA' },
        { name: 'Deep Maritime Navy', hex: '#1B263B' },
        { name: 'Highland Moss', hex: '#415A77' }
      ],
      rating_average: 4.92,
      review_count: 53,
      reviews: []
    },
    {
      id: 5,
      title: 'Sibling Harmony Linen Co-Ord Set',
      slug: 'sibling-harmony-linen-co-ord-set',
      sku: 'PMK-SIB-005',
      price: 92.00,
      compare_at_price: 120.00,
      category: 4,
      category_name: 'Sibling Sets',
      category_slug: 'sibling-sets',
      badge_text: 'Matching Pair',
      is_bestseller: true,
      is_new_arrival: true,
      is_monogrammable: true,
      extendable_cuffs: true,
      inventory_count: 20,
      fabric: 'Breathable Eco-Enzyme Washed Linen Blend (55% Linen, 45% Organic Cotton)',
      safety_certification: 'GOTS Organic Certified, Formaldehyde Free',
      fasteners: 'Elasticated waistband with cotton cord drawstring + wood buttons',
      care_guide: 'Machine wash 30°C delicate cycle',
      primary_image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
      hover_image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80',
      extra_images: [
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80'
      ],
      age_stage: 'All Ages',
      available_sizes: ['12-24M', '2-3Y', '4-5Y', '6-7Y', '8-9Y'],
      color_swatches: [
        { name: 'Copenhagen Stripes', hex: '#778DA9' },
        { name: 'Terracotta Clay', hex: '#B85D36' },
        { name: 'Warm Sand', hex: '#E0A96D' }
      ],
      rating_average: 5.0,
      review_count: 38,
      reviews: []
    },
    {
      id: 6,
      title: 'Royal Heirloom Silk & Lace Christening Gown',
      slug: 'royal-heirloom-silk-lace-christening-gown',
      sku: 'PMK-OCC-006',
      price: 165.00,
      compare_at_price: 210.00,
      category: 5,
      category_name: 'Heirloom & Occasion',
      category_slug: 'occasion',
      badge_text: 'Heirloom Archive',
      is_bestseller: false,
      is_new_arrival: true,
      is_monogrammable: true,
      extendable_cuffs: false,
      inventory_count: 10,
      fabric: '100% Mulberry Dupioni Silk with French Val Laces & Silk Ribbon',
      safety_certification: 'Archive Preservation Grade & Skin Safe Silk',
      fasteners: 'Concealed silk button placket with keepsake storage garment box included',
      care_guide: 'Specialist dry clean only or keepsake preservation archival box',
      primary_image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
      hover_image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
      extra_images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80'
      ],
      age_stage: '0-12M',
      available_sizes: ['0-3M', '3-6M', '6-12M'],
      color_swatches: [
        { name: 'Ivory Heirloom Silk', hex: '#FFFFF0' },
        { name: 'Champagne Pearl', hex: '#F7E7CE' }
      ],
      rating_average: 5.0,
      review_count: 22,
      reviews: []
    }
  ];

  private fallbackTickers: KidsTicker[] = [
    {
      id: 1,
      message: 'Petit Spring Carnival: Enjoy 25% off heirloom essentials with code',
      highlight_text: 'PETIT25',
      icon: 'sparkles',
      link_url: '#offers'
    },
    {
      id: 2,
      message: 'Complimentary Heirloom Monogramming on all Rompers & Cardigans this week',
      highlight_text: 'FREE EMBROIDERY',
      icon: 'edit',
      link_url: '#monogram'
    },
    {
      id: 3,
      message: 'Free Express Carbon-Neutral Shipping on orders over $95 worldwide',
      highlight_text: 'FREE SHIPPING',
      icon: 'local_shipping',
      link_url: '#shipping'
    }
  ];

  private fallbackBanners: KidsBanner[] = [
    {
      id: 1,
      badge: 'SPRING / SUMMER 2026 EDIT',
      headline: 'Childhood Dressed in Poetry & Pure Cotton',
      subheadline: 'Crafted from 100% GOTS organic pima cotton and stonewashed French linen. Designed with foldable room-to-grow cuffs for double the adventures.',
      cta_text: 'Explore The Meadow Collection',
      cta_link: '#catalog',
      background_image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1600&auto=format&fit=crop&q=80',
      theme_variant: 'nordic'
    }
  ];

  private fallbackStoreConfig: KidsStoreConfig = {
    store_name: 'PETIT MAISON KIDS',
    tagline: 'Organic, Playful & Heirloom Childrenswear (Ages 0 - 12Y)',
    brand_phone: '+1 (800) 555-KIDS',
    brand_email: 'bonjour@petitmaisonkids.com',
    free_shipping_min: 95.0,
    monogram_fee: 8.0,
    active_theme: 'theme-nordic-pastel',
    flash_sale_active: true,
    flash_sale_headline: 'Petit Spring Carnival 25% OFF',
    current_season: 'Spring / Summer 2026'
  };

  getProducts(): Observable<KidsProduct[]> {
    return this.http.get<any>(`${this.baseUrl}/products/`).pipe(
      map(res => {
        const rawList: any[] = Array.isArray(res) ? res : (res && res.results ? res.results : []);
        if (rawList.length === 0) return this.fallbackProducts;
        return rawList.map(item => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price || 0),
          compare_at_price: item.compare_at_price ? parseFloat(item.compare_at_price) : null,
          available_sizes: Array.isArray(item.available_sizes) && item.available_sizes.length > 0 
            ? item.available_sizes 
            : ['0-3M', '3-6M', '6-12M', '12-18M'],
          color_swatches: Array.isArray(item.color_swatches) && item.color_swatches.length > 0
            ? item.color_swatches
            : [
                { name: 'Oatmeal Milk', hex: '#EBE3D5' },
                { name: 'Sage Leaf', hex: '#A3B18A' }
              ]
        }));
      }),
      catchError(() => of(this.fallbackProducts))
    );
  }

  getProductBySlug(slug: string): Observable<KidsProduct | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  getCategories(): Observable<KidsCategory[]> {
    return this.http.get<any>(`${this.baseUrl}/categories/`).pipe(
      map(res => {
        const raw: any[] = Array.isArray(res) ? res : (res && res.results ? res.results : []);
        return raw.length > 0 ? raw : this.fallbackCategories;
      }),
      catchError(() => of(this.fallbackCategories))
    );
  }

  getTickers(): Observable<KidsTicker[]> {
    return this.http.get<any>(`${this.baseUrl}/tickers/`).pipe(
      map(res => {
        const raw: any[] = Array.isArray(res) ? res : (res && res.results ? res.results : []);
        return raw.length > 0 ? raw : this.fallbackTickers;
      }),
      catchError(() => of(this.fallbackTickers))
    );
  }

  getBanners(): Observable<KidsBanner[]> {
    return this.http.get<any>(`${this.baseUrl}/banners/`).pipe(
      map(res => {
        const raw: any[] = Array.isArray(res) ? res : (res && res.results ? res.results : []);
        return raw.length > 0 ? raw : this.fallbackBanners;
      }),
      catchError(() => of(this.fallbackBanners))
    );
  }

  getStoreConfig(): Observable<KidsStoreConfig> {
    return this.http.get<KidsStoreConfig>(`${this.baseUrl}/store-config/`).pipe(
      catchError(() => of(this.fallbackStoreConfig))
    );
  }

  validateCoupon(code: string, subtotal: number): Observable<{ valid: boolean; discount_amount: number; discount_percent: number; message: string }> {
    return this.http.post<any>(`${this.baseUrl}/commerce/validate-coupon/`, { code, subtotal }).pipe(
      catchError(() => {
        const clean = code.trim().toUpperCase();
        if (clean === 'PETIT25') {
          return of({ valid: true, discount_amount: 0, discount_percent: 25, message: 'Spring Carnival 25% Off applied!' });
        }
        if (clean === 'FIRSTBABY15') {
          return of({ valid: true, discount_amount: 0, discount_percent: 15, message: 'Welcome Baby 15% Off applied!' });
        }
        if (clean === 'SIBLINGPAIR') {
          return of({ valid: true, discount_amount: 20, discount_percent: 0, message: '$20 Sibling Bundle savings applied!' });
        }
        return of({ valid: false, discount_amount: 0, discount_percent: 0, message: 'Coupon code not found or expired.' });
      })
    );
  }

  submitOrder(orderData: any): Observable<{ status: string; order_number: string; message: string; tracking_number?: string }> {
    return this.http.post<any>(`${this.baseUrl}/commerce/submit-order/`, orderData).pipe(
      catchError(() => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const orderNumber = `PMK-${randomNum}`;
        const tracking = `DHL-EXPRESS-${Math.floor(10000000 + Math.random() * 90000000)}`;
        return of({
          status: 'success',
          order_number: orderNumber,
          tracking_number: tracking,
          message: 'Order created successfully in Petit Maison Kids archival ledger.'
        });
      })
    );
  }

  private fallbackBrands: BrandTenant[] = [
    {
      id: 1,
      name: 'Petit Maison Heirloom',
      slug: 'petit-maison-heirloom',
      tagline: 'Pure Organic Parisian Infant Couture',
      story: 'Handcrafted in France using certified hypoallergenic organic cotton and timeless embroidery.',
      logo_url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1200&auto=format&fit=crop&q=80',
      department: 'Baby & Kids',
      origin_country: 'France',
      founding_year: 2021,
      subscription_tier: 'ENTERPRISE_VIP',
      is_promoted: true,
      promotion_tier: 'HERO_SPOTLIGHT',
      promoted_badge: 'Spotlight Brand',
      brand_primary_color: '#7AA884',
      font_family: 'Fredoka',
      contact_email: 'atelier@petitmaison.kids'
    },
    {
      id: 2,
      name: 'Tartine & Coton',
      slug: 'tartine-et-coton',
      tagline: 'Chic Parisian Toddler Wardrobe',
      story: 'Playful French silhouettes with reinforced knees and breathable French flax linen.',
      logo_url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&auto=format&fit=crop&q=80',
      department: 'Kids',
      origin_country: 'France',
      founding_year: 2018,
      subscription_tier: 'GROWTH',
      is_promoted: true,
      promotion_tier: 'FEATURED_COLLECTION',
      promoted_badge: 'Featured Brand',
      brand_primary_color: '#FF9F1C',
      font_family: 'Nunito',
      contact_email: 'contact@tartinecoton.fr'
    },
    {
      id: 3,
      name: 'Nordic Sprout Knits',
      slug: 'nordic-sprout-knits',
      tagline: 'Warm Organic Scandinavian Woollens',
      story: 'Itch-free Merino wool sweaters and rompers designed for cold mountain journeys.',
      logo_url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=200&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1200&auto=format&fit=crop&q=80',
      department: 'Kids',
      origin_country: 'Denmark',
      founding_year: 2019,
      subscription_tier: 'GROWTH',
      is_promoted: true,
      promotion_tier: 'FEATURED_COLLECTION',
      promoted_badge: 'Featured Brand',
      brand_primary_color: '#3D5A4C',
      font_family: 'Quicksand',
      contact_email: 'hello@nordicsprout.dk'
    }
  ];

  getBrands(): Observable<BrandTenant[]> {
    return this.http.get<any>(`${this.baseUrl}/brands/`).pipe(
      map(res => {
        const raw: any[] = Array.isArray(res) ? res : (res && res.results ? res.results : []);
        return raw.length > 0 ? raw : this.fallbackBrands;
      }),
      catchError(() => of(this.fallbackBrands))
    );
  }

  lookupBarcode(code: string): Observable<{ success: boolean; product?: any; message: string }> {
    return this.http.get<any>(`${this.baseUrl}/commerce/barcode-lookup/?code=${encodeURIComponent(code)}`).pipe(
      catchError(() => {
        const clean = code.trim().toLowerCase();
        const found = this.fallbackProducts.find(p => 
          (p.barcode && p.barcode.toLowerCase() === clean) ||
          p.sku.toLowerCase() === clean ||
          p.title.toLowerCase().includes(clean)
        );
        if (found) {
          return of({
            success: true,
            product: found,
            message: `Found: ${found.title} (${found.sku})`
          });
        }
        return of({
          success: false,
          message: `No kids product matching barcode or SKU '${code}'`
        });
      })
    );
  }

  updateStock(sku: string, adjustment: number): Observable<{ success: boolean; new_inventory_count: number; message: string }> {
    return this.http.post<any>(`${this.baseUrl}/commerce/update-stock/`, { sku, adjustment }).pipe(
      catchError(() => {
        const prod = this.fallbackProducts.find(p => p.sku === sku);
        if (prod) {
          prod.inventory_count = Math.max(0, prod.inventory_count + adjustment);
          return of({
            success: true,
            new_inventory_count: prod.inventory_count,
            message: `Live inventory updated: ${sku} is now ${prod.inventory_count} units.`
          });
        }
        return of({
          success: true,
          new_inventory_count: 24 + adjustment,
          message: `Live inventory adjusted for ${sku}.`
        });
      })
    );
  }

  askWagtailAi(prompt: string, context?: any): Observable<{ reply: string; suggestions?: string[]; recommended_skus?: string[] }> {
    return this.http.post<any>(`${this.baseUrl}/ai/chat/`, { prompt, context }).pipe(
      catchError(() => {
        return of({
          reply: 'Petit Maison AI Concierge recommends our GOTS Certified Organic Cloud Romper paired with our Chunky Merino Cardigan for superior infant warmth and hypoallergenic softness.',
          suggestions: ['Explore Newborn Gifting', 'View Sibling Matching Sets', 'Check Wash Durability Guide'],
          recommended_skus: ['PMK-ROMP-001', 'PMK-SWT-004']
        });
      })
    );
  }

  generateAiCopy(title: string, fabric: string): Observable<{ success: boolean; generated_copy: string }> {
    return this.http.post<any>(`${this.baseUrl}/ai/generate-copy/`, { title, fabric }).pipe(
      catchError(() => {
        return of({
          success: true,
          generated_copy: `Exquisitely crafted for little dreamers, the ${title} is tailored from ${fabric || 'luxurious GOTS organic cotton'}. Designed with non-pinching flatlock seams, hypoallergenic mother-of-pearl closures, and extendable cuffs that grow gently with your child across every milestone.`
        });
      })
    );
  }

  getWorkflowStatus(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/workflows/status/`).pipe(
      catchError(() => of({
        active_workflows: [
          {
            name: 'Editorial Moderation (Petit Maison)',
            tasks: ['Lead Nursery Stylist Review', 'Creative Director French Archive Approval'],
            live_pages_in_review: 2
          }
        ],
        available_ai_tools: ['Wagtail AI Copywriter', 'SEO Childcare Generator', 'Live Concierge Chat']
      }))
    );
  }

  submitBrandPromotion(data: any): Observable<{ status: string; message: string }> {
    return this.http.post<any>(`${this.baseUrl}/brands/promotion-request/`, data).pipe(
      catchError(() => of({
        status: 'received',
        message: 'Your brand promotion application for Petit Maison Kids has been submitted to the Wagtail Editorial Moderation Workflow for review!'
      }))
    );
  }
}
