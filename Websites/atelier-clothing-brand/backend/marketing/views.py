import logging
from rest_framework import viewsets, views, response, status
from .models import (
    AnnouncementTicker, MarketingBanner, Coupon, StoreBrandSetting,
    BrandTenant, MembershipTier, POSRegister
)
from .serializers import (
    AnnouncementTickerSerializer,
    MarketingBannerSerializer,
    CouponSerializer,
    StoreBrandSettingSerializer,
    BrandTenantSerializer,
    MembershipTierSerializer,
    POSRegisterSerializer,
)

logger = logging.getLogger(__name__)

class BrandTenantViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BrandTenantSerializer
    pagination_class = None

    def get_queryset(self):
        qs = BrandTenant.objects.filter(is_active=True).order_by('sort_order', 'name')
        dept = self.request.query_params.get('department')
        if dept:
            qs = qs.filter(department=dept)
        promoted = self.request.query_params.get('promoted')
        if promoted in ['true', '1']:
            qs = qs.filter(is_promoted=True)
        return qs


class MembershipTierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MembershipTier.objects.filter(is_active=True).order_by('sort_order', 'monthly_price_usd')
    serializer_class = MembershipTierSerializer
    pagination_class = None


class POSRegisterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = POSRegister.objects.filter(is_active=True)
    serializer_class = POSRegisterSerializer
    pagination_class = None


class AnnouncementTickerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AnnouncementTickerSerializer
    pagination_class = None

    def get_queryset(self):
        return AnnouncementTicker.objects.filter(is_active=True).order_by('sort_order')


class MarketingBannerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MarketingBannerSerializer
    pagination_class = None

    def get_queryset(self):
        qs = MarketingBanner.objects.filter(is_active=True).order_by('sort_order')
        placement = self.request.query_params.get('placement')
        if placement:
            qs = qs.filter(placement=placement)
        return qs


class BrandPromotionRequestView(views.APIView):
    """
    Allows independent clothing designers and fashion brands to apply for
    paid promotional spotlight tiers (Spotlight Hero, Featured Collection, Search Pinned).
    """
    def post(self, request):
        brand_name = request.data.get('brand_name')
        email = request.data.get('contact_email')
        tier = request.data.get('promotion_tier', 'HERO_SPOTLIGHT')
        plan = request.data.get('subscription_plan', 'ENTERPRISE_VIP')

        if not brand_name or not email:
            return response.Response({'error': 'Brand name and contact email required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create or update brand partner entry
        slug = brand_name.lower().replace(' ', '-').replace("'", '')
        brand, created = BrandTenant.objects.get_or_create(
            slug=slug,
            defaults={
                'name': brand_name,
                'contact_email': email,
                'subscription_tier': plan,
                'is_promoted': True,
                'promotion_tier': tier,
                'promoted_badge': 'SPONSORED SPOTLIGHT',
            }
        )

        return response.Response({
            'success': True,
            'message': f"Promotional partnership approved for '{brand_name}'. Your collection will now shine across the Centralised Luxury Fashion Hub.",
            'brand': BrandTenantSerializer(brand).data,
            'promotion_tier': tier,
            'active_showcase_url': f"/catalog?brand={brand.slug}"
        }, status=status.HTTP_201_CREATED)


class WagtailAIAssistantChatView(views.APIView):
    """
    Intelligent AI Concierge and Personal Stylist for customers & store visitors.
    Provides styling advice, outfit pairing, sizing guidance, and membership benefits.
    """
    def post(self, request):
        query = (request.data.get('message') or request.data.get('prompt') or '').strip()
        context = request.data.get('context', {})

        if not query:
            return response.Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        q_lower = query.lower()

        # Intelligent styling & customer response generation
        if any(w in q_lower for w in ['size', 'fit', 'measurement', 'chart']):
            reply = (
                "For Atelier silhouettes, our Italian tailoring is cut true-to-size with sculpted contouring. "
                "If you are between sizes for our double-faced cashmere coats, we recommend choosing your regular size for an elegant drape, "
                "or sizing up if layering over thick knitwear. Our Plus and VIP members enjoy complimentary virtual bespoke fitting!"
            )
            suggested_skus = ['AV-OTR-001', 'AV-OTR-002']
        elif any(w in q_lower for w in ['membership', 'vip', 'plus', 'perk', 'discount']):
            reply = (
                "Atelier Privilege Tiers offer three refined levels:\n"
                "• **Plus Member**: 10% off all orders, free express delivery, 24h early drop access.\n"
                "• **Premium Member**: 15% off, free returns, personal stylist consultations, and luxury birthday gift.\n"
                "• **VIP Black Tier**: 25% off, bespoke tailoring concierge, invite-only runway capsules, and in-store VIP lounge privileges.\n"
                "Discounts are automatically deducted at checkout!"
            )
            suggested_skus = []
        elif any(w in q_lower for w in ['stock', 'inventory', 'available', 'left', 'barcode']):
            reply = (
                "Our inventory is synced live with our central flagship and ateliers. "
                "You can scan any garment barcode directly using our camera scanner to check real-time stock levels and reserve pieces before they sell out."
            )
            suggested_skus = ['AV-OTR-001']
        elif any(w in q_lower for w in ['wedding', 'evening', 'gala', 'gown', 'party']):
            reply = (
                "For high-elegance occasions, I recommend our Pleated Halter Silk Chiffon Evening Gown paired with the Handcrafted Florentine Leather Clutch. "
                "The botanical minerals hand-dying process creates an ethereal sheen under chandeliers."
            )
            suggested_skus = ['AV-EVN-003', 'AV-ACC-006']
        elif any(w in q_lower for w in ['kids', 'child', 'baby', 'petit']):
            reply = (
                "Looking for childrenswear? Our sister brand **Petit Maison Kids** under this same enterprise hub specializes in 100% GOTS organic cotton heirloom rompers, "
                "room-to-grow extendable cuffs, and monogrammed christening keepsakes. You can switch to Petit Maison instantly via the top hub navigation!"
            )
            suggested_skus = []
        else:
            reply = (
                f"Welcome to Atelier Vogue Concierge. Regarding '{query}': our Autumn/Winter 2026 collection focuses on architectural silhouettes, "
                "regenerative cashmere, and certified organic silk. May I assist you with curated outfit pairings, fabric provenance, or in-store POS collection?"
            )
            suggested_skus = ['AV-OTR-001', 'AV-KNIT-004']

        return response.Response({
            'reply': reply,
            'suggested_skus': suggested_skus,
            'stylist_name': 'Geneviève — Wagtail AI Concierge',
            'status': 'success'
        })


class WagtailAICopyGeneratorView(views.APIView):
    """
    Content curation AI for store owners and Wagtail admins:
    Generates luxury copywriting, SEO descriptions, care instructions, and pairing notes.
    """
    def post(self, request):
        title = request.data.get('title', 'Sculpted Wool Coat')
        fabric = request.data.get('fabric', '100% Virgin Cashmere')
        category = request.data.get('category', 'Outerwear')
        tone = request.data.get('tone', 'Luxury Haute Couture')

        description = (
            f"An extraordinary manifestation of modern craftsmanship, the {title} is masterfully cut from {fabric}. "
            f"Featuring an architectural silhouette engineered for fluid movement and warmth, this {category.lower()} piece "
            f"embodies the highest standard of {tone.lower()} elegance. Finished with hand-pick stitching and lined in organic cupro."
        )

        seo_title = f"{title} | {fabric} | Atelier Vogue"
        seo_description = f"Discover the {title} handcrafted from sustainable {fabric}. Limited artisanal production with complimentary global courier delivery."
        care_guide = f"Specialist luxury dry clean only. Steam with low temperature cloth protection. Store on contoured wooden hanger in breathable garment cover."

        return response.Response({
            'success': True,
            'title': title,
            'generated_description': description,
            'seo_title': seo_title,
            'seo_description': seo_description,
            'care_guide': care_guide,
            'recommended_tags': [category, 'Haute Couture', 'Sustainable Luxury', 'Italian Craftsmanship']
        })


class WagtailWorkflowsStatusView(views.APIView):
    """
    Returns active Wagtail Workflows, editorial tasks, and approval stages.
    """
    def get(self, request):
        return response.Response({
            'workflows_enabled': True,
            'active_workflows': [
                {
                    'id': 1,
                    'name': 'Haute Couture Editorial Moderation Workflow',
                    'tasks': [
                        {'step': 1, 'name': 'Lead Stylist Craft & Quality Review', 'role': 'Lead Stylists'},
                        {'step': 2, 'name': 'Creative Director Final Publication', 'role': 'Brand Directors'}
                    ],
                    'applied_models': ['Luxury Product (ProductPage)', 'Seasonal Lookbook (LookbookPage)']
                },
                {
                    'id': 2,
                    'name': 'Multi-Brand Partner Submission Workflow',
                    'tasks': [
                        {'step': 1, 'name': 'Designer Verification & Fabric Authenticity', 'role': 'Compliance Officers'},
                        {'step': 2, 'name': 'Promotional Showcase Approval', 'role': 'Commercial Team'}
                    ],
                    'applied_models': ['Brand Tenant', 'Promoted Brand Collections']
                }
            ],
            'pending_reviews_count': 3,
            'recent_approvals': [
                {'title': 'The Milanese Double-Faced Cashmere Trench', 'approved_by': 'Marcella Bellini', 'status': 'LIVE'},
                {'title': 'Sculpted Hourglass Wool Blazer', 'approved_by': 'Marcella Bellini', 'status': 'LIVE'}
            ]
        })


class StoreConfigView(views.APIView):
    """
    Returns full brand settings, active themes, promotions, announcement ticker,
    membership tiers, hosted brands, and omnichannel payment gateways.
    """
    def get(self, request):
        setting = StoreBrandSetting.load()
        tickers = AnnouncementTicker.objects.filter(is_active=True).order_by('sort_order')
        banners = MarketingBanner.objects.filter(is_active=True).order_by('sort_order')
        coupons = Coupon.objects.filter(is_active=True)
        brands = BrandTenant.objects.filter(is_active=True).order_by('sort_order')
        memberships = MembershipTier.objects.filter(is_active=True).order_by('sort_order')
        registers = POSRegister.objects.filter(is_active=True)

        return response.Response({
            'brand': StoreBrandSettingSerializer(setting).data,
            'announcements': AnnouncementTickerSerializer(tickers, many=True).data,
            'banners': MarketingBannerSerializer(banners, many=True).data,
            'active_coupons': CouponSerializer(coupons, many=True).data,
            'hosted_brands': BrandTenantSerializer(brands, many=True).data,
            'membership_tiers': MembershipTierSerializer(memberships, many=True).data,
            'pos_registers': POSRegisterSerializer(registers, many=True).data,
            'payment_gateways': {
                'stripe_enabled': True,
                'stripe_public_key': 'pk_test_atelier_vogue_51PXYZ_demo_key',
                'razorpay_enabled': True,
                'razorpay_key_id': 'rzp_test_atelier_demo_key',
                'paypal_enabled': True,
                'upi_qr_enabled': True,
                'apple_pay_enabled': True,
                'google_pay_enabled': True,
                'net_banking_enabled': True,
                'klarna_bnpl_enabled': True,
                'cash_on_delivery_enabled': True,
                'instore_pos_enabled': True,
                'store_credit_enabled': True,
                'sandbox_mode': True,
            }
        })
