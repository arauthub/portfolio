from django.contrib import admin
from .models import KidsAnnouncementTicker, KidsMarketingBanner, KidsCoupon

@admin.register(KidsAnnouncementTicker)
class KidsAnnouncementTickerAdmin(admin.ModelAdmin):
    list_display = ['message', 'promo_code', 'is_active', 'sort_order']
    list_editable = ['is_active', 'sort_order']


@admin.register(KidsMarketingBanner)
class KidsMarketingBannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'placement', 'badge', 'is_active', 'sort_order']
    list_filter = ['placement', 'is_active']
    list_editable = ['is_active', 'sort_order']


@admin.register(KidsCoupon)
class KidsCouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percent', 'flat_discount_amount', 'min_order_value', 'is_active']
    list_filter = ['is_active']
