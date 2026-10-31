from rest_framework import serializers
from .models import KidsOrder

class KidsOrderItemSerializer(serializers.Serializer):
    sku = serializers.CharField()
    title = serializers.CharField()
    size = serializers.CharField(required=False, default='Standard')
    color = serializers.CharField(required=False, default='Classic')
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(default=1)
    image = serializers.URLField(required=False, default='')
    barcode = serializers.CharField(required=False, allow_blank=True, default='')


class KidsOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = KidsOrder
        fields = [
            'id', 'order_number', 'customer_name', 'customer_email', 'customer_phone',
            'is_pos_order', 'pos_register_code', 'cashier_name', 'in_store_pickup',
            'child_name', 'gift_note', 'gift_wrap_selected', 'monogram_details',
            'address_line', 'city', 'state', 'postal_code', 'country', 'shipping_method',
            'items', 'currency', 'subtotal', 'discount_amount', 'coupon_applied',
            'membership_tier_applied', 'membership_discount',
            'shipping_cost', 'tax_amount', 'total_amount',
            'payment_gateway', 'payment_status', 'gateway_transaction_id',
            'fulfillment_status', 'carrier', 'tracking_number', 'created_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at']


class KidsCheckoutRequestSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    
    is_pos_order = serializers.BooleanField(required=False, default=False)
    pos_register_code = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')
    cashier_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    in_store_pickup = serializers.BooleanField(required=False, default=False)

    child_name = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    gift_note = serializers.CharField(required=False, allow_blank=True, default='')
    gift_wrap_selected = serializers.BooleanField(required=False, default=False)
    monogram_details = serializers.ListField(required=False, default=list)

    address_line = serializers.CharField(max_length=255, required=False, default='In-Store Flagship Nursery')
    city = serializers.CharField(max_length=100, required=False, default='Paris')
    state = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    postal_code = serializers.CharField(max_length=30, required=False, default='75001')
    country = serializers.CharField(max_length=100, default='United States')
    shipping_method = serializers.CharField(max_length=100, default='Complimentary Nursery Express')
    items = KidsOrderItemSerializer(many=True)
    currency = serializers.CharField(max_length=10, required=False, default='USD')
    coupon_code = serializers.CharField(required=False, allow_blank=True, default='')
    membership_tier = serializers.CharField(required=False, allow_blank=True, default='')
    payment_gateway = serializers.CharField(required=False, default='STRIPE')
    payment_token = serializers.CharField(required=False, allow_blank=True, default='')
