from django.contrib import admin
from .models import AnnouncementTicker, MarketingBanner, Coupon

@admin.register(AnnouncementTicker)
class AnnouncementTickerAdmin(admin.ModelAdmin):
    list_display = ['message', 'promo_code', 'is_active', 'sort_order']
    list_editable = ['is_active', 'sort_order']


@admin.register(MarketingBanner)
class MarketingBannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'placement', 'badge', 'is_active', 'sort_order']
    list_filter = ['placement', 'is_active']
    list_editable = ['is_active', 'sort_order']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percent', 'flat_discount_amount', 'min_order_value', 'is_active']
    list_filter = ['is_active']
