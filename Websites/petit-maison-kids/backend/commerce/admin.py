from django.contrib import admin
from .models import KidsOrder

@admin.register(KidsOrder)
class KidsOrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'child_name', 'total_amount', 'payment_status', 'fulfillment_status', 'created_at']
    list_filter = ['payment_status', 'fulfillment_status', 'payment_gateway', 'gift_wrap_selected']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'child_name', 'tracking_number']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
