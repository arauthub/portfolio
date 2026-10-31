export interface ProductReview {
  id: number;
  author_name: string;
  rating: number;
  headline: string;
  comment: string;
  fit_feedback: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string;
  barcode?: string;
  brand_name?: string;
  department?: string;
  price: number;
  compare_at_price?: number | null;
  category: number;
  category_name?: string;
  category_slug?: string;
  badge_text?: string;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  inventory_count: number;
  fabric: string;
  fit: string;
  sustainability_rating: string;
  care_guide: string;
  primary_image: string;
  hover_image: string;
  extra_images: string[];
  available_sizes: string[];
  color_swatches: ColorSwatch[];
  paired_outfit_skus?: string[];
  reviews?: ProductReview[];
  rating_average?: number;
  review_count?: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured: boolean;
  product_count?: number;
}

export interface Announcement {
  id: number;
  message: string;
  promo_code?: string;
  countdown_end_date?: string | null;
  link_url?: string;
  is_active: boolean;
}

export interface MarketingBanner {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  placement: string;
  discount_callout: string;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  sku: string;
  title: string;
  price: number;
  size: string;
  color: string;
  colorHex?: string;
  image: string;
  quantity: number;
  product?: Product;
  selectedSize?: string;
  selectedColor?: ColorSwatch;
}

export interface POSCartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ColorSwatch;
  quantity: number;
}

export interface MembershipTier {
  id?: number;
  tier_type: 'FREE' | 'PLUS' | 'PREMIUM' | 'VIP';
  name: string;
  badge_label: string;
  monthly_price_usd: number;
  monthly_price_inr: number;
  annual_price_usd: number;
  discount_percentage: number;
  free_shipping: boolean;
  early_access_hours: number;
  perks_list: string[];
  is_active?: boolean;
}

export interface BrandTenant {
  id?: number;
  name: string;
  slug: string;
  tagline: string;
  story: string;
  logo_url: string;
  banner_url: string;
  department: string;
  origin_country: string;
  founding_year: number;
  subscription_tier: 'STARTER' | 'GROWTH' | 'ENTERPRISE_VIP';
  is_promoted: boolean;
  promotion_tier: 'STANDARD' | 'FEATURED_COLLECTION' | 'HERO_SPOTLIGHT';
  promoted_badge: string;
  brand_primary_color: string;
  font_family: string;
  contact_email: string;
}

export interface POSRegister {
  id?: number;
  register_code: string;
  store_name: string;
  city: string;
  country: string;
  cashier_active: string;
  currency: string;
  is_active: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  membership_tier: 'FREE' | 'PLUS' | 'PREMIUM' | 'VIP';
  auth_provider: 'google' | 'phone_otp' | 'email' | 'guest';
}

export type D3AnimationType = 'silk_flow' | 'heritage_constellation' | 'aurora_pulse' | 'fabric_weave';

export interface OrderConfirmation {
  order_number: string;
  customer_name: string;
  customer_email: string;
  address_line: string;
  city: string;
  country: string;
  shipping_method: string;
  items: any[];
  subtotal: number;
  discount_amount: number;
  membership_tier_applied?: string;
  membership_discount?: number;
  coupon_applied?: string;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  payment_gateway: string;
  payment_status: string;
  is_pos?: boolean;
  pos_register_code?: string;
  cashier_name?: string;
  carrier: string;
  tracking_number: string;
  created_at: string;
}
