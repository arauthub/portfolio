import uuid
from django.db import models
from wagtail.snippets.models import register_snippet
from wagtail.admin.panels import FieldPanel, MultiFieldPanel

@register_snippet
class Order(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('PAID', 'Payment Succeeded'),
        ('FAILED', 'Payment Failed'),
        ('REFUNDED', 'Refunded'),
    ]

    FULFILLMENT_STATUS_CHOICES = [
        ('ORDER_RECEIVED', 'Order Confirmed & Placed'),
        ('TAILORING', 'Atelier Tailoring / Assembly'),
        ('QUALITY_CHECK', 'Artisanal Inspection Passed'),
        ('DISPATCHED', 'Dispatched with Courier'),
        ('DELIVERED', 'Delivered to Client'),
        ('COLLECTED_IN_STORE', 'Collected at Store POS Counter'),
    ]

    GATEWAY_CHOICES = [
        ('STRIPE', 'Stripe Credit / Debit Card'),
        ('UPI_QR', 'Instant UPI & Dynamic QR (Google Pay, PhonePe, Paytm, BHIM)'),
        ('APPLE_PAY', 'Apple Pay 1-Click Biometric'),
        ('GOOGLE_PAY', 'Google Pay 1-Click'),
        ('NET_BANKING', 'Direct Net Banking (All Major Banks)'),
        ('KLARNA_BNPL', 'Klarna / Afterpay Pay in 4 Interest-Free'),
        ('CASH_ON_DELIVERY', 'Cash on Delivery (COD) with SMS Verification'),
        ('IN_STORE_CASH', 'In-Store Retail Cash Checkout (POS)'),
        ('IN_STORE_TERMINAL', 'In-Store Physical Card Terminal Swipe (POS)'),
        ('STORE_CREDIT', 'Atelier Luxury Store Credit / Gift Card'),
        ('RAZORPAY', 'Razorpay UPI / Cards'),
        ('PAYPAL', 'PayPal Express Checkout'),
        ('SIMULATION', 'Enterprise Demo Sandbox Gateway'),
    ]

    order_number = models.CharField(max_length=64, unique=True, db_index=True)
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50, blank=True)

    # In-Store POS Support
    is_pos_order = models.BooleanField(default=False, help_text="True if order was placed via retail in-store POS register")
    pos_register_code = models.CharField(max_length=50, blank=True, default='')
    cashier_name = models.CharField(max_length=100, blank=True, default='')
    in_store_pickup = models.BooleanField(default=False)

    # Shipping Details
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=30)
    country = models.CharField(max_length=100, default='United States')
    shipping_method = models.CharField(max_length=100, default='Complimentary Express Courier')

    # Line Items snapshot
    items = models.JSONField(default=list, help_text="List of purchased items with sku, title, size, color, quantity, price, barcode")

    # Financials
    currency = models.CharField(max_length=10, default='USD')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    coupon_applied = models.CharField(max_length=50, blank=True)
    membership_tier_applied = models.CharField(max_length=50, blank=True, default='', help_text="PLUS, PREMIUM, or VIP")
    membership_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Payment Gateway Data
    payment_gateway = models.CharField(max_length=50, choices=GATEWAY_CHOICES, default='STRIPE')
    payment_status = models.CharField(max_length=50, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    gateway_transaction_id = models.CharField(max_length=255, blank=True)
    
    # Fulfillment
    fulfillment_status = models.CharField(max_length=50, choices=FULFILLMENT_STATUS_CHOICES, default='ORDER_RECEIVED')
    carrier = models.CharField(max_length=100, default='DHL Express Luxury')
    tracking_number = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel([
            FieldPanel('order_number'),
            FieldPanel('customer_name'),
            FieldPanel('customer_email'),
            FieldPanel('customer_phone'),
            FieldPanel('is_pos_order'),
            FieldPanel('pos_register_code'),
            FieldPanel('cashier_name'),
        ], heading="Client & In-Store POS Register Details"),
        MultiFieldPanel([
            FieldPanel('address_line'),
            FieldPanel('city'),
            FieldPanel('state'),
            FieldPanel('postal_code'),
            FieldPanel('country'),
            FieldPanel('shipping_method'),
            FieldPanel('in_store_pickup'),
        ], heading="Delivery Destination / In-Store Collection"),
        MultiFieldPanel([
            FieldPanel('currency'),
            FieldPanel('subtotal'),
            FieldPanel('discount_amount'),
            FieldPanel('coupon_applied'),
            FieldPanel('membership_tier_applied'),
            FieldPanel('membership_discount'),
            FieldPanel('shipping_cost'),
            FieldPanel('tax_amount'),
            FieldPanel('total_amount'),
        ], heading="Financial Ledger & Membership Savings"),
        MultiFieldPanel([
            FieldPanel('payment_gateway'),
            FieldPanel('payment_status'),
            FieldPanel('gateway_transaction_id'),
            FieldPanel('fulfillment_status'),
            FieldPanel('carrier'),
            FieldPanel('tracking_number'),
        ], heading="Payment & Fulfillment Tracking"),
        FieldPanel('items'),
    ]

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        prefix = "[POS] " if self.is_pos_order else ""
        return f"{prefix}Order #{self.order_number} - {self.customer_name} ({self.total_amount} {self.currency})"

    @classmethod
    def generate_order_number(cls, is_pos=False):
        import random
        prefix = "POS-AV" if is_pos else "AV"
        return f"{prefix}-{random.randint(100000, 999999)}"
