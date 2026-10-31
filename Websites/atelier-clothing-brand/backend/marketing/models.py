from django.db import models
from wagtail.snippets.models import register_snippet
from wagtail.contrib.settings.models import BaseGenericSetting, register_setting
from wagtail.admin.panels import FieldPanel, MultiFieldPanel

@register_snippet
class BrandTenant(models.Model):
    DEPARTMENT_CHOICES = [
        ('all', 'Universal Multi-Department'),
        ('adult_women', 'Haute Couture & Women'),
        ('adult_men', 'Bespoke Tailoring & Men'),
        ('kids', 'Kids & Heirloom (0-12Y)'),
        ('unisex', 'Contemporary Unisex & Streetwear'),
    ]

    SUBSCRIPTION_CHOICES = [
        ('STARTER', 'Starter Boutique (Single Brand, Standard Catalog)'),
        ('GROWTH', 'Growth Designer (Multi-Brand, Barcode Sync, Live Stock)'),
        ('ENTERPRISE_VIP', 'Enterprise Luxury Maison (Unlimited Brands, In-Store POS, AI Assistant, White-Label)'),
    ]

    PROMOTION_TIER_CHOICES = [
        ('STANDARD', 'Standard Listing'),
        ('FEATURED_COLLECTION', 'Featured Ribbon & Catalog Pinned'),
        ('HERO_SPOTLIGHT', 'Hero Spotlight Carousel & Global Push'),
    ]

    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(unique=True)
    tagline = models.CharField(max_length=255, blank=True, default='Handcrafted Luxury & Timeless Craftsmanship')
    story = models.TextField(blank=True, default='')
    logo_url = models.URLField(blank=True, default='')
    banner_url = models.URLField(blank=True, default='')
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES, default='adult_women')
    origin_country = models.CharField(max_length=100, default='Italy')
    founding_year = models.PositiveIntegerField(default=2020)
    
    # Store Owner Subscription & Promotion
    subscription_tier = models.CharField(max_length=50, choices=SUBSCRIPTION_CHOICES, default='ENTERPRISE_VIP')
    is_promoted = models.BooleanField(default=False, help_text="Paid promotional spotlight active")
    promotion_tier = models.CharField(max_length=50, choices=PROMOTION_TIER_CHOICES, default='STANDARD')
    promoted_badge = models.CharField(max_length=50, blank=True, default='SPONSORED MAISON')
    
    # Branding Customization
    brand_primary_color = models.CharField(max_length=20, default='#EAD8C0')
    font_family = models.CharField(max_length=50, default='Playfair Display')
    custom_domain = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(default='partner@ateliervogue.com')
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        MultiFieldPanel([
            FieldPanel('name'),
            FieldPanel('slug'),
            FieldPanel('tagline'),
            FieldPanel('story'),
            FieldPanel('logo_url'),
            FieldPanel('banner_url'),
            FieldPanel('department'),
            FieldPanel('origin_country'),
            FieldPanel('founding_year'),
        ], heading="Brand Profile"),
        MultiFieldPanel([
            FieldPanel('subscription_tier'),
            FieldPanel('is_promoted'),
            FieldPanel('promotion_tier'),
            FieldPanel('promoted_badge'),
        ], heading="Subscription & Paid Promotion"),
        MultiFieldPanel([
            FieldPanel('brand_primary_color'),
            FieldPanel('font_family'),
            FieldPanel('custom_domain'),
            FieldPanel('contact_email'),
            FieldPanel('is_active'),
            FieldPanel('sort_order'),
        ], heading="Brand Aesthetics & Settings"),
    ]

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_department_display()}) - {self.subscription_tier}"


@register_snippet
class MembershipTier(models.Model):
    TIER_CHOICES = [
        ('FREE', 'Member (Complimentary)'),
        ('PLUS', 'Plus Member (Curated Privileges)'),
        ('PREMIUM', 'Premium Member (Signature Luxury)'),
        ('VIP', 'VIP Black Tier (Haute Couture Concierge)'),
    ]

    tier_type = models.CharField(max_length=20, choices=TIER_CHOICES, unique=True, default='PLUS')
    name = models.CharField(max_length=100, default='Atelier Plus')
    badge_label = models.CharField(max_length=50, default='PLUS MEMBER')
    monthly_price_inr = models.DecimalField(max_digits=10, decimal_places=2, default=999.00)
    monthly_price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=12.00)
    annual_price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=119.00)
    discount_percentage = models.PositiveIntegerField(default=10, help_text="Discount automatically applied at checkout")
    free_shipping = models.BooleanField(default=True)
    early_access_hours = models.PositiveIntegerField(default=24, help_text="Hours ahead of public launches")
    perks_list = models.JSONField(default=list, help_text="Array of perk strings displayed in membership comparison")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        FieldPanel('tier_type'),
        FieldPanel('name'),
        FieldPanel('badge_label'),
        FieldPanel('monthly_price_inr'),
        FieldPanel('monthly_price_usd'),
        FieldPanel('annual_price_usd'),
        FieldPanel('discount_percentage'),
        FieldPanel('free_shipping'),
        FieldPanel('early_access_hours'),
        FieldPanel('perks_list'),
        FieldPanel('is_active'),
        FieldPanel('sort_order'),
    ]

    class Meta:
        ordering = ['sort_order', 'monthly_price_usd']

    def __str__(self):
        return f"{self.name} ({self.discount_percentage}% off - {self.badge_label})"


@register_snippet
class POSRegister(models.Model):
    register_code = models.CharField(max_length=50, unique=True)
    store_name = models.CharField(max_length=120, default='Atelier Flagship Milan')
    city = models.CharField(max_length=100, default='Milan')
    country = models.CharField(max_length=100, default='Italy')
    cashier_active = models.CharField(max_length=100, default='Marco Silvestri')
    currency = models.CharField(max_length=10, default='USD')
    is_active = models.BooleanField(default=True)

    panels = [
        FieldPanel('register_code'),
        FieldPanel('store_name'),
        FieldPanel('city'),
        FieldPanel('country'),
        FieldPanel('cashier_active'),
        FieldPanel('currency'),
        FieldPanel('is_active'),
    ]

    def __str__(self):
        return f"POS: {self.register_code} ({self.store_name})"


@register_snippet
class AnnouncementTicker(models.Model):
    message = models.CharField(max_length=255, default='Complimentary Global Express Shipping on Orders Over $250 — Use Code VOGUE25 for 25% Off')
    promo_code = models.CharField(max_length=50, blank=True, default='VOGUE25')
    countdown_end_date = models.DateTimeField(null=True, blank=True, help_text="Optional target date for countdown timer")
    link_url = models.CharField(max_length=200, blank=True, default='/catalog')
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        FieldPanel('message'),
        FieldPanel('promo_code'),
        FieldPanel('countdown_end_date'),
        FieldPanel('link_url'),
        FieldPanel('is_active'),
        FieldPanel('sort_order'),
    ]

    def __str__(self):
        return f"Ticker: {self.message[:40]}... (Active: {self.is_active})"


@register_snippet
class MarketingBanner(models.Model):
    PLACEMENT_CHOICES = [
        ('hero_slider', 'Hero Primary Carousel'),
        ('mid_editorial', 'Mid-Page Parallax Editorial'),
        ('exit_offer_popup', 'Interactive Offer Modal / Exit Intent'),
        ('cart_drawer_ad', 'Cart Drawer Upsell Banner'),
        ('promoted_brand_strip', 'Sponsored Brands Spotlight Strip'),
    ]

    title = models.CharField(max_length=150, default='The High-Winter Architectural Capsule')
    subtitle = models.CharField(max_length=255, blank=True, default='Handcrafted in Northern Italy with regenerative double-faced cashmere.')
    badge = models.CharField(max_length=50, blank=True, default='NEW COLLECTION')
    image_url = models.URLField(default='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85')
    cta_text = models.CharField(max_length=50, default='Explore The Lookbook')
    cta_link = models.CharField(max_length=200, default='/catalog')
    placement = models.CharField(max_length=50, choices=PLACEMENT_CHOICES, default='hero_slider')
    discount_callout = models.CharField(max_length=100, blank=True, default='Save 15% With Atelier Club')
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        FieldPanel('title'),
        FieldPanel('subtitle'),
        FieldPanel('badge'),
        FieldPanel('image_url'),
        FieldPanel('cta_text'),
        FieldPanel('cta_link'),
        FieldPanel('placement'),
        FieldPanel('discount_callout'),
        FieldPanel('is_active'),
        FieldPanel('sort_order'),
    ]

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return f"{self.title} [{self.placement}]"


@register_snippet
class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True)
    discount_percent = models.PositiveIntegerField(default=15, help_text="e.g. 15 for 15% off")
    flat_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(null=True, blank=True)

    panels = [
        FieldPanel('code'),
        FieldPanel('description'),
        FieldPanel('discount_percent'),
        FieldPanel('flat_discount_amount'),
        FieldPanel('min_order_value'),
        FieldPanel('is_active'),
        FieldPanel('valid_until'),
    ]

    def __str__(self):
        return f"{self.code} (-{self.discount_percent}% / min ${self.min_order_value})"


@register_setting
class StoreBrandSetting(BaseGenericSetting):
    THEME_CHOICES = [
        ('luxe_monochrome', 'Luxe Haute Couture (Monochrome & Champagne)'),
        ('royal_heritage_gold', 'Royal Heritage (Gold Embroidery & Velvet Noir)'),
        ('neo_streetwear', 'Urban Neo-Streetwear (Dark Cyber & Electric Lime)'),
        ('artisan_boho', 'Artisan Bohemian (Terracotta & Natural Linen)'),
        ('nordic_minimal', 'Nordic Clean (Sage, Slate & Architectural Lines)'),
    ]

    FONT_CHOICES = [
        ('Playfair Display', 'Playfair Display (Haute Couture Serif)'),
        ('Cinzel', 'Cinzel (Classical Luxury Roman)'),
        ('Montserrat', 'Montserrat (Contemporary Modern)'),
        ('Plus Jakarta Sans', 'Plus Jakarta Sans (Clean Minimalist Tech)'),
        ('Cormorant Garamond', 'Cormorant Garamond (Artisanal Heirloom)'),
    ]

    D3_ANIMATION_CHOICES = [
        ('silk_flow', 'Silk Drape Waves (Fluid D3 Ribbons & Particle Shimmer)'),
        ('heritage_constellation', 'Golden Star Constellation (Interactive Particle Mesh)'),
        ('aurora_pulse', 'Aurora Luxury Pulse (Atmospheric Color Waves)'),
        ('fabric_weave', 'Textile Warp & Weft (Loom Weave Animation)'),
    ]

    SUBSCRIPTION_TIERS = [
        ('STARTER', 'Starter Boutique Plan (Basic Catalog & Single Brand)'),
        ('GROWTH', 'Growth Designer Plan (Multi-Brand, Barcode Sync, D3 Visuals)'),
        ('ENTERPRISE_VIP', 'Enterprise Luxury Maison Plan (Full Omnichannel, In-Store POS, AI Assistant, White-Label)'),
    ]

    CURRENCY_CHOICES = [
        ('INR', '₹ INR - Indian Rupee (Default)'),
        ('USD', '$ USD - US Dollar'),
        ('EUR', '€ EUR - Euro'),
        ('GBP', '£ GBP - British Pound'),
        ('AED', 'AED - UAE Dirham'),
        ('SGD', 'S$ SGD - Singapore Dollar'),
        ('JPY', '¥ JPY - Japanese Yen'),
    ]

    brand_name = models.CharField(max_length=100, default='ATELIER VOGUE')
    brand_tagline = models.CharField(max_length=200, default='Haute Couture Silhouettes & Sustainable Modern Luxury')
    active_theme = models.CharField(max_length=50, choices=THEME_CHOICES, default='luxe_monochrome')
    brand_font_family = models.CharField(max_length=50, choices=FONT_CHOICES, default='Playfair Display')
    d3_animation_style = models.CharField(max_length=50, choices=D3_ANIMATION_CHOICES, default='silk_flow')
    store_subscription_level = models.CharField(max_length=50, choices=SUBSCRIPTION_TIERS, default='ENTERPRISE_VIP')

    # Feature Toggles based on Enterprise Capabilities
    ai_assistant_enabled = models.BooleanField(default=True, help_text="Enable Wagtail AI Stylist & Copywriter")
    instore_pos_enabled = models.BooleanField(default=True, help_text="Enable Omnichannel Retail Point of Sale Mode")
    barcode_scanner_enabled = models.BooleanField(default=True, help_text="Enable Barcode Scanner for Inventory & Checkouts")
    multi_brand_mode = models.BooleanField(default=True, help_text="Host multiple clothing brands in centralized hub")

    active_currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='INR', help_text="Store active default currency")
    allow_customer_currency_switch = models.BooleanField(default=True, help_text="Allow customers to switch currencies in storefront")
    free_shipping_threshold_inr = models.DecimalField(max_digits=10, decimal_places=2, default=15000.00, help_text="Free shipping in INR")
    free_shipping_threshold_usd = models.DecimalField(max_digits=10, decimal_places=2, default=250.00, help_text="Free shipping in USD")
    contact_email = models.EmailField(default='concierge@ateliervogue.com')
    support_phone = models.CharField(max_length=100, default='+91 98200 12345 / +1 (800) 840-ATELIER')
    announcement_ticker_enabled = models.BooleanField(default=True)
    popup_offer_enabled = models.BooleanField(default=True)

    panels = [
        MultiFieldPanel([
            FieldPanel('brand_name'),
            FieldPanel('brand_tagline'),
            FieldPanel('active_theme'),
            FieldPanel('brand_font_family'),
            FieldPanel('d3_animation_style'),
            FieldPanel('store_subscription_level'),
        ], heading="Brand Identity, Font, D3 Animation & Subscription"),
        MultiFieldPanel([
            FieldPanel('ai_assistant_enabled'),
            FieldPanel('instore_pos_enabled'),
            FieldPanel('barcode_scanner_enabled'),
            FieldPanel('multi_brand_mode'),
        ], heading="Enterprise Modules & Omnichannel Feature Toggles"),
        MultiFieldPanel([
            FieldPanel('active_currency'),
            FieldPanel('allow_customer_currency_switch'),
            FieldPanel('free_shipping_threshold_inr'),
            FieldPanel('free_shipping_threshold_usd'),
            FieldPanel('contact_email'),
            FieldPanel('support_phone'),
        ], heading="Multi-Currency & Commerce Configuration"),
        MultiFieldPanel([
            FieldPanel('announcement_ticker_enabled'),
            FieldPanel('popup_offer_enabled'),
        ], heading="Marketing Switches"),
    ]

    class Meta:
        verbose_name = 'Brand Aesthetics & Multi-Currency Settings'
