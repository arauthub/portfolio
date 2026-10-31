import logging
import uuid
from decimal import Decimal
from django.conf import settings
from django.db.models import F
from rest_framework import views, response, status, permissions
from .models import Order
from .serializers import OrderSerializer, CheckoutRequestSerializer
from marketing.models import Coupon, StoreBrandSetting, MembershipTier
from catalog.models import ProductPage

logger = logging.getLogger(__name__)

class ValidateCouponAPIView(views.APIView):
    """
    Validates promotional discount code against minimum basket requirement.
    """
    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        cart_total = Decimal(str(request.data.get('cart_total', 0)))

        try:
            coupon = Coupon.objects.get(code__iexact=code, is_active=True)
            if cart_total < coupon.min_order_value:
                return response.Response({
                    'valid': False,
                    'message': f"Coupon requires a minimum order of ${coupon.min_order_value}"
                }, status=status.HTTP_400_BAD_REQUEST)

            discount = Decimal('0.00')
            if coupon.discount_percent > 0:
                discount = (cart_total * Decimal(coupon.discount_percent) / Decimal(100)).quantize(Decimal('0.01'))
            elif coupon.flat_discount_amount > 0:
                discount = min(coupon.flat_discount_amount, cart_total)

            return response.Response({
                'valid': True,
                'code': coupon.code,
                'discount_percent': coupon.discount_percent,
                'discount_amount': float(discount),
                'new_total': float(cart_total - discount),
                'message': f"Promo code applied: {coupon.discount_percent}% off your luxury order"
            })
        except Coupon.DoesNotExist:
            return response.Response({
                'valid': False,
                'message': "Invalid or expired promotional code."
            }, status=status.HTTP_404_NOT_FOUND)


class CreatePaymentIntentAPIView(views.APIView):
    """
    Creates a payment intent for cards, UPI dynamic QR, or simulation.
    """
    def post(self, request):
        amount = Decimal(str(request.data.get('amount', '0.00')))
        currency = request.data.get('currency', 'usd').lower()
        gateway = request.data.get('gateway', 'STRIPE')

        if amount <= 0:
            return response.Response({'error': 'Amount must be greater than zero'}, status=status.HTTP_400_BAD_REQUEST)

        client_secret = f"pi_mock_{uuid.uuid4().hex[:16]}_secret_{uuid.uuid4().hex[:12]}"
        qr_code_data = f"upi://pay?pa=atelier.vogue@okhdfcbank&pn=AtelierVogueHauteCouture&am={amount}&cu={currency.upper()}&tn=Order_{uuid.uuid4().hex[:8]}"

        return response.Response({
            'success': True,
            'client_secret': client_secret,
            'qr_code_data': qr_code_data,
            'amount': float(amount),
            'currency': currency.upper(),
            'gateway': gateway,
            'sandbox_mode': True,
            'instructions': 'Sandbox gateway is active. In-Store POS, UPI, Cards, and BNPL are pre-authorized for demo.'
        })


class SubmitOrderAPIView(views.APIView):
    """
    Processes final order submission:
    - Calculates subtotal, coupon, and VIP/Premium/Plus membership discounts.
    - Decrements stock live in catalog.
    - Records order in Wagtail database (supports online + In-Store POS retail modes).
    """
    def post(self, request):
        serializer = CheckoutRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        items = data['items']
        currency = data.get('currency', 'USD').upper()
        is_pos = data.get('is_pos_order', False)

        # Calculate base subtotal
        subtotal = sum(Decimal(str(item['price'])) * item['quantity'] for item in items)
        
        # 1. Coupon discount
        discount_amount = Decimal('0.00')
        coupon_applied = data.get('coupon_code', '').upper()
        if coupon_applied:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_applied, is_active=True)
                if coupon.discount_percent > 0:
                    discount_amount = (subtotal * Decimal(coupon.discount_percent) / Decimal(100)).quantize(Decimal('0.01'))
                elif coupon.flat_discount_amount > 0:
                    discount_amount = min(coupon.flat_discount_amount, subtotal)
            except Coupon.DoesNotExist:
                pass

        # 2. Membership tier discount
        membership_tier = data.get('membership_tier', '').upper()
        membership_discount = Decimal('0.00')
        if membership_tier:
            try:
                tier = MembershipTier.objects.get(tier_type__iexact=membership_tier, is_active=True)
                discount_rate = Decimal(tier.discount_percentage) / Decimal(100)
                membership_discount = ((subtotal - discount_amount) * discount_rate).quantize(Decimal('0.01'))
            except MembershipTier.DoesNotExist:
                # Built-in tier fallbacks
                if membership_tier == 'VIP':
                    membership_discount = ((subtotal - discount_amount) * Decimal('0.25')).quantize(Decimal('0.01'))
                elif membership_tier == 'PREMIUM':
                    membership_discount = ((subtotal - discount_amount) * Decimal('0.15')).quantize(Decimal('0.01'))
                elif membership_tier == 'PLUS':
                    membership_discount = ((subtotal - discount_amount) * Decimal('0.05')).quantize(Decimal('0.01'))

        total_discounts = discount_amount + membership_discount

        # Shipping threshold check
        try:
            brand_setting = StoreBrandSetting.load()
            if currency == 'INR':
                free_threshold = brand_setting.free_shipping_threshold_inr
                default_shipping = Decimal('0.00') if subtotal >= free_threshold else Decimal('500.00')
            else:
                free_threshold = brand_setting.free_shipping_threshold_usd
                default_shipping = Decimal('0.00') if subtotal >= free_threshold else Decimal('25.00')
        except Exception:
            default_shipping = Decimal('0.00')

        # In-store POS has 0 shipping cost
        shipping_cost = Decimal('0.00') if (is_pos or data.get('in_store_pickup', False) or membership_tier in ['PLUS', 'PREMIUM', 'VIP']) else default_shipping
        tax_amount = ((subtotal - total_discounts) * Decimal('0.08')).quantize(Decimal('0.01'))
        total_amount = max(Decimal('0.00'), subtotal - total_discounts + shipping_cost + tax_amount)

        # Generate unique order number
        order_number = Order.generate_order_number(is_pos=is_pos)
        transaction_id = data.get('payment_token') or f"tx_{uuid.uuid4().hex[:14]}"

        # Decrement stock live for each item
        for item in items:
            sku = item.get('sku')
            qty = item.get('quantity', 1)
            if sku:
                ProductPage.objects.filter(sku=sku, inventory_count__gte=qty).update(
                    inventory_count=F('inventory_count') - qty
                )

        # Serializable items for JSONField
        serializable_items = []
        for item in items:
            it = dict(item)
            if 'price' in it:
                it['price'] = float(it['price'])
            serializable_items.append(it)

        order = Order.objects.create(
            order_number=order_number,
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data.get('customer_phone', ''),
            is_pos_order=is_pos,
            pos_register_code=data.get('pos_register_code', ''),
            cashier_name=data.get('cashier_name', ''),
            in_store_pickup=data.get('in_store_pickup', is_pos),
            address_line=data.get('address_line', 'In-Store POS Flagship Register'),
            city=data.get('city', 'Milan'),
            state=data.get('state', ''),
            postal_code=data.get('postal_code', '20121'),
            country=data.get('country', 'Italy' if is_pos else 'United States'),
            shipping_method='In-Store Instant Pickup' if is_pos else data.get('shipping_method', 'Complimentary Express Courier'),
            items=serializable_items,
            currency=currency,
            subtotal=subtotal,
            discount_amount=discount_amount,
            coupon_applied=coupon_applied,
            membership_tier_applied=membership_tier,
            membership_discount=membership_discount,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            total_amount=total_amount,
            payment_gateway=data.get('payment_gateway', 'IN_STORE_CASH' if is_pos else 'STRIPE'),
            payment_status='PAID',
            gateway_transaction_id=transaction_id,
            fulfillment_status='COLLECTED_IN_STORE' if is_pos else 'ORDER_RECEIVED',
            carrier='In-Store Handover' if is_pos else 'DHL Express Global Luxury',
            tracking_number=f"POS-RCPT-{uuid.uuid4().hex[:8].upper()}" if is_pos else f"DHL-AV-{uuid.uuid4().hex[:8].upper()}"
        )

        logger.info(f"New Order #{order.order_number} confirmed for {order.customer_email}")

        return response.Response({
            'success': True,
            'status': 'success',
            'order_number': order.order_number,
            'tracking_number': order.tracking_number,
            'message': 'In-store POS transaction completed & thermal receipt generated.' if is_pos else 'Your luxury couture order has been placed successfully.',
            'order': OrderSerializer(order).data,
            'is_pos': is_pos,
            'estimated_delivery': 'Instant In-Store Handover' if is_pos else '3-5 Business Days',
            'support_contact': 'concierge@ateliervogue.com'
        }, status=status.HTTP_201_CREATED)


class TrackOrderAPIView(views.APIView):
    def get(self, request, order_number):
        try:
            order = Order.objects.get(order_number__iexact=order_number)
            return response.Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return response.Response({'error': 'Order not found with provided tracking reference'}, status=status.HTTP_404_NOT_FOUND)


class StockBarcodeLookupAPIView(views.APIView):
    """
    Scans a barcode or SKU to look up live inventory status and product details.
    """
    def get(self, request):
        code = request.query_params.get('code', '').strip()
        if not code:
            return response.Response({'error': 'Barcode or SKU code is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Try SKU or barcode match
        product = ProductPage.objects.filter(sku__iexact=code).first() or \
                  ProductPage.objects.filter(barcode__iexact=code).first()

        if not product:
            return response.Response({'error': f"No product found for barcode/SKU '{code}'"}, status=status.HTTP_404_NOT_FOUND)

        return response.Response({
            'found': True,
            'id': product.id,
            'title': product.title,
            'sku': product.sku,
            'barcode': product.barcode or f"UPC-{product.id:08d}",
            'price': float(product.price),
            'inventory_count': product.inventory_count,
            'in_stock': product.inventory_count > 0,
            'low_stock': product.inventory_count <= 5,
            'brand_name': getattr(product, 'brand_name', 'Atelier Vogue'),
            'primary_image': product.primary_image,
            'available_sizes': product.available_sizes,
            'color_swatches': product.color_swatches,
        })


class StockUpdateAPIView(views.APIView):
    """
    Enables live stock replenishment via barcode scanner.
    """
    def post(self, request):
        code = request.data.get('code', '').strip()
        adjustment = int(request.data.get('adjustment', 0))

        if not code or adjustment == 0:
            return response.Response({'error': 'Valid code and non-zero adjustment required'}, status=status.HTTP_400_BAD_REQUEST)

        product = ProductPage.objects.filter(sku__iexact=code).first() or \
                  ProductPage.objects.filter(barcode__iexact=code).first()

        if not product:
            return response.Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        product.inventory_count = max(0, product.inventory_count + adjustment)
        product.save(update_fields=['inventory_count'])

        return response.Response({
            'success': True,
            'sku': product.sku,
            'title': product.title,
            'new_inventory_count': product.inventory_count,
            'message': f"Live inventory updated: now {product.inventory_count} units available."
        })
