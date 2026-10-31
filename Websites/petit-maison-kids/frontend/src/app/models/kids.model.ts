export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface KidsReview {
  id: number;
  parent_name: string;
  child_age: string;
  rating: number;
  headline: string;
  comment: string;
  wash_durability: string;
  verified_parent: boolean;
  created_at: string;
}

export interface MonogramConfig {
  text: string;
  threadColor: string;
  threadHex: string;
  font: 'Heirloom Script' | 'Playful Block' | 'French Cursive';
}

export interface KidsProduct {
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
  category_name: string;
  category_slug: string;
  badge_text: string;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_monogrammable: boolean;
  extendable_cuffs: boolean;
  inventory_count: number;
  fabric: string;
  safety_certification: string;
  fasteners: string;
  care_guide: string;
  primary_image: string;
  hover_image: string;
  extra_images: string[];
  age_stage: string;
  available_sizes: string[];
  color_swatches: ColorSwatch[];
  sibling_matching_sku?: string;
  reviews?: KidsReview[];
  rating_average?: number;
  review_count?: number;
}

export interface KidsCategory {
  id: number;
  name: string;
  slug: string;
  stage: string;
  description: string;
  image_url: string;
  featured: boolean;
  product_count: number;
}

export interface CartItem {
  id: string; // unique key (e.g. sku-size-color-monogram)
  sku: string;
  title: string;
  price: number;
  size: string;
  color: string;
  colorHex?: string;
  image: string;
  quantity: number;
  monogram?: MonogramConfig;
}

export interface POSCartItem {
  product: KidsProduct;
  selectedSize: string;
  selectedColor: ColorSwatch;
  quantity: number;
}

export interface OrderConfirmation {
  order_number: string;
  customer_name: string;
  customer_email: string;
  child_name?: string;
  gift_note?: string;
  gift_wrap_selected?: boolean;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  shipping_method: string;
  carrier: string;
  tracking_number: string;
  created_at: string;
  items: CartItem[];
  estimated_delivery?: string;
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
  points: number;
  saved_addresses?: string[];
  auth_provider: 'google' | 'phone_otp' | 'email_password';
}

export type D3AnimationType = 'silk' | 'constellation' | 'aurora' | 'bubbles' | 'none';
