from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_email', 'total_amount', 'payment_status', 'fulfillment_status', 'created_at']
    list_filter = ['payment_status', 'fulfillment_status', 'payment_gateway']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'tracking_number']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
