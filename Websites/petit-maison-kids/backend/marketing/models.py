from django.db import models
from wagtail.snippets.models import register_snippet
from wagtail.contrib.settings.models import BaseGenericSetting, register_setting
from wagtail.admin.panels import FieldPanel, MultiFieldPanel

@register_snippet
class KidsBrandTenant(models.Model):
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
    tagline = models.CharField(max_length=255, blank=True, default='Organic & Heirloom Childrenswear')
    story = models.TextField(blank=True, default='')
    logo_url = models.URLField(blank=True, default='')
    banner_url = models.URLField(blank=True, default='')
    origin_country = models.CharField(max_length=100, default='France')
    founding_year = models.PositiveIntegerField(default=2021)
    
    subscription_tier = models.CharField(max_length=50, choices=SUBSCRIPTION_CHOICES, default='ENTERPRISE_VIP')
    is_promoted = models.BooleanField(default=False)
    promotion_tier = models.CharField(max_length=50, choices=PROMOTION_TIER_CHOICES, default='STANDARD')
    promoted_badge = models.CharField(max_length=50, blank=True, default='HEIRLOOM CURATION')
    
    brand_primary_color = models.CharField(max_length=20, default='#D8A48F')
    font_family = models.CharField(max_length=50, default='Cormorant Garamond')
    custom_domain = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(default='bonjour@petitmaisonkids.com')
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
        return f"{self.name} - {self.subscription_tier}"


@register_snippet
class KidsMembershipTier(models.Model):
    TIER_CHOICES = [
        ('FREE', 'Member (Complimentary)'),
        ('PLUS', 'Petit Plus Parent (Curated Nursery Privileges)'),
        ('PREMIUM', 'Heirloom Gold Club (15% Off & Free Keepsake Gift Box)'),
        ('VIP', 'Petit VIP Family (25% Off & Bespoke Hand-Monogramming)'),
    ]

    tier_type = models.CharField(max_length=20, choices=TIER_CHOICES, unique=True, default='PLUS')
    name = models.CharField(max_length=100, default='Petit Plus')
    badge_label = models.CharField(max_length=50, default='PETIT PLUS')
    monthly_price_inr = models.DecimalField(max_digits=10, decimal_places=2, default=599.00)
    monthly_price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=8.00)
    annual_price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=79.00)
    discount_percentage = models.PositiveIntegerField(default=10)
    free_shipping = models.BooleanField(default=True)
    early_access_hours = models.PositiveIntegerField(default=24)
    perks_list = models.JSONField(default=list)
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
class KidsPOSRegister(models.Model):
    register_code = models.CharField(max_length=50, unique=True)
    store_name = models.CharField(max_length=120, default='Petit Maison Flagship Paris')
    city = models.CharField(max_length=100, default='Paris')
    country = models.CharField(max_length=100, default='France')
    cashier_active = models.CharField(max_length=100, default='Camille Laurent')
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
class KidsAnnouncementTicker(models.Model):
    message = models.CharField(
        max_length=255,
        default='Complimentary Organic Cotton Swaddle on Orders Over $95 — Enter Code PETIT25 for 25% Off'
    )
    promo_code = models.CharField(max_length=50, blank=True, default='PETIT25')
    countdown_end_date = models.DateTimeField(null=True, blank=True)
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
class KidsMarketingBanner(models.Model):
    PLACEMENT_CHOICES = [
        ('hero_slider', 'Hero Primary Carousel'),
        ('mid_editorial', 'Mid-Page Organic Manifesto'),
        ('gifting_suite', 'Gifting & Monogramming Banner'),
        ('exit_offer_popup', 'Parent Club Welcome Modal'),
        ('promoted_brand_strip', 'Sponsored Brands Spotlight Strip'),
    ]

    title = models.CharField(max_length=150, default='Made for Play, Naps & Big Discoveries')
    subtitle = models.CharField(max_length=255, blank=True, default='Heirloom-grade GOTS organic apparel crafted to pass down between siblings.')
    badge = models.CharField(max_length=50, blank=True, default='NEW SPRING DROP')
    image_url = models.URLField(default='https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1800&q=85')
    cta_text = models.CharField(max_length=50, default='Shop Organic Essentials')
    cta_link = models.CharField(max_length=200, default='/catalog')
    placement = models.CharField(max_length=50, choices=PLACEMENT_CHOICES, default='hero_slider')
    discount_callout = models.CharField(max_length=100, blank=True, default='Free Heirloom Gift Box with Monogramming')
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
class KidsCoupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True)
    discount_percent = models.PositiveIntegerField(default=25, help_text="e.g. 25 for 25% off")
    flat_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
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
class KidsStoreBrandSetting(BaseGenericSetting):
    THEME_CHOICES = [
        ('theme-nordic-pastel', 'Nordic Pastel Nursery (Macaron Peach, Sage & Powder Blue)'),
        ('theme-sunshine-pop', 'Playful Sunshine Pop (Sunflower Yellow & Aqua)'),
        ('theme-parisian-vintage', 'Heirloom Parisian Vintage (French Lavender & Antique Ecru)'),
        ('theme-forest-adventure', 'Enchanted Forest Explorer (Sage Green & Woodland Rust)'),
    ]

    FONT_CHOICES = [
        ('Cormorant Garamond', 'Cormorant Garamond (Artisanal Heirloom)'),
        ('Playfair Display', 'Playfair Display (Haute Couture Serif)'),
        ('Montserrat', 'Montserrat (Contemporary Modern)'),
        ('Plus Jakarta Sans', 'Plus Jakarta Sans (Clean Minimalist Tech)'),
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

    brand_name = models.CharField(max_length=100, default='PETIT MAISON KIDS')
    brand_tagline = models.CharField(max_length=200, default='Organic, Playful & Heirloom Childrenswear (Ages 0 - 12Y)')
    active_theme = models.CharField(max_length=50, choices=THEME_CHOICES, default='theme-nordic-pastel')
    brand_font_family = models.CharField(max_length=50, choices=FONT_CHOICES, default='Cormorant Garamond')
    d3_animation_style = models.CharField(max_length=50, choices=D3_ANIMATION_CHOICES, default='silk_flow')
    store_subscription_level = models.CharField(max_length=50, choices=SUBSCRIPTION_TIERS, default='ENTERPRISE_VIP')

    ai_assistant_enabled = models.BooleanField(default=True, help_text="Enable Wagtail AI Nursery Stylist & Copywriter")
    instore_pos_enabled = models.BooleanField(default=True, help_text="Enable Omnichannel Retail Point of Sale Mode")
    barcode_scanner_enabled = models.BooleanField(default=True, help_text="Enable Barcode Scanner for Inventory & Checkouts")
    multi_brand_mode = models.BooleanField(default=True, help_text="Host multiple clothing brands in centralized hub")

    active_currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='INR', help_text="Store active default currency")
    allow_customer_currency_switch = models.BooleanField(default=True, help_text="Allow customers to switch currencies in storefront")
    free_shipping_threshold_inr = models.DecimalField(max_digits=10, decimal_places=2, default=5999.00, help_text="Free shipping in INR")
    free_shipping_threshold_usd = models.DecimalField(max_digits=10, decimal_places=2, default=95.00, help_text="Free shipping in USD")
    contact_email = models.EmailField(default='bonjour@petitmaisonkids.com')
    support_phone = models.CharField(max_length=100, default='+91 98200 54321 / +1 (800) 555-PETIT')
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
        verbose_name = 'Kids Brand Settings & Multi-Currency'
