from rest_framework import serializers
from .models import (
    AnnouncementTicker, MarketingBanner, Coupon, StoreBrandSetting,
    BrandTenant, MembershipTier, POSRegister
)

class BrandTenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandTenant
        fields = [
            'id', 'name', 'slug', 'tagline', 'story', 'logo_url', 'banner_url',
            'department', 'origin_country', 'founding_year', 'subscription_tier',
            'is_promoted', 'promotion_tier', 'promoted_badge', 'brand_primary_color',
            'font_family', 'custom_domain', 'contact_email', 'is_active', 'sort_order'
        ]


class MembershipTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipTier
        fields = [
            'id', 'tier_type', 'name', 'badge_label', 'monthly_price_inr',
            'monthly_price_usd', 'annual_price_usd', 'discount_percentage',
            'free_shipping', 'early_access_hours', 'perks_list', 'is_active', 'sort_order'
        ]


class POSRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = POSRegister
        fields = ['id', 'register_code', 'store_name', 'city', 'country', 'cashier_active', 'currency', 'is_active']


class AnnouncementTickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementTicker
        fields = ['id', 'message', 'promo_code', 'countdown_end_date', 'link_url', 'is_active']


class MarketingBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingBanner
        fields = ['id', 'title', 'subtitle', 'badge', 'image_url', 'cta_text', 'cta_link', 'placement', 'discount_callout', 'is_active']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'description', 'discount_percent', 'flat_discount_amount', 'min_order_value', 'is_active']


class StoreBrandSettingSerializer(serializers.ModelSerializer):
    supported_currencies = serializers.SerializerMethodField()

    class Meta:
        model = StoreBrandSetting
        fields = [
            'brand_name', 'brand_tagline', 'active_theme', 'brand_font_family',
            'd3_animation_style', 'store_subscription_level',
            'ai_assistant_enabled', 'instore_pos_enabled', 'barcode_scanner_enabled', 'multi_brand_mode',
            'active_currency', 'allow_customer_currency_switch',
            'free_shipping_threshold_inr', 'free_shipping_threshold_usd',
            'contact_email', 'support_phone',
            'announcement_ticker_enabled', 'popup_offer_enabled',
            'supported_currencies'
        ]

    def get_supported_currencies(self, obj):
        return [
            {
                'code': 'INR',
                'symbol': '₹',
                'name': 'Indian Rupee (₹)',
                'rate': 1.0,
                'free_shipping_threshold': float(obj.free_shipping_threshold_inr)
            },
            {
                'code': 'USD',
                'symbol': '$',
                'name': 'US Dollar ($)',
                'rate': 0.012,
                'free_shipping_threshold': float(obj.free_shipping_threshold_usd)
            },
            {
                'code': 'EUR',
                'symbol': '€',
                'name': 'Euro (€)',
                'rate': 0.011,
                'free_shipping_threshold': round(float(obj.free_shipping_threshold_usd) * 0.92, 2)
            },
            {
                'code': 'GBP',
                'symbol': '£',
                'name': 'British Pound (£)',
                'rate': 0.0095,
                'free_shipping_threshold': round(float(obj.free_shipping_threshold_usd) * 0.79, 2)
            },
            {
                'code': 'AED',
                'symbol': 'AED ',
                'name': 'UAE Dirham (AED)',
                'rate': 0.044,
                'free_shipping_threshold': round(float(obj.free_shipping_threshold_usd) * 3.67, 2)
            },
            {
                'code': 'SGD',
                'symbol': 'S$',
                'name': 'Singapore Dollar (S$)',
                'rate': 0.016,
                'free_shipping_threshold': round(float(obj.free_shipping_threshold_usd) * 1.35, 2)
            },
            {
                'code': 'JPY',
                'symbol': '¥',
                'name': 'Japanese Yen (¥)',
                'rate': 1.82,
                'free_shipping_threshold': round(float(obj.free_shipping_threshold_usd) * 155.0, 2)
            }
        ]
