import logging
from rest_framework import viewsets, views, response, status
from .models import (
    KidsAnnouncementTicker, KidsMarketingBanner, KidsCoupon, KidsStoreBrandSetting,
    KidsBrandTenant, KidsMembershipTier, KidsPOSRegister
)
from .serializers import (
    KidsAnnouncementTickerSerializer,
    KidsMarketingBannerSerializer,
    KidsCouponSerializer,
    KidsStoreBrandSettingSerializer,
    KidsBrandTenantSerializer,
    KidsMembershipTierSerializer,
    KidsPOSRegisterSerializer,
)

logger = logging.getLogger(__name__)

class KidsBrandTenantViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = KidsBrandTenantSerializer
    pagination_class = None

    def get_queryset(self):
        qs = KidsBrandTenant.objects.filter(is_active=True).order_by('sort_order', 'name')
        promoted = self.request.query_params.get('promoted')
        if promoted in ['true', '1']:
            qs = qs.filter(is_promoted=True)
        return qs


class KidsMembershipTierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KidsMembershipTier.objects.filter(is_active=True).order_by('sort_order', 'monthly_price_usd')
    serializer_class = KidsMembershipTierSerializer
    pagination_class = None


class KidsPOSRegisterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KidsPOSRegister.objects.filter(is_active=True)
    serializer_class = KidsPOSRegisterSerializer
    pagination_class = None


class KidsAnnouncementTickerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = KidsAnnouncementTickerSerializer
    pagination_class = None

    def get_queryset(self):
        return KidsAnnouncementTicker.objects.filter(is_active=True).order_by('sort_order')


class KidsMarketingBannerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = KidsMarketingBannerSerializer
    pagination_class = None

    def get_queryset(self):
        qs = KidsMarketingBanner.objects.filter(is_active=True).order_by('sort_order')
        placement = self.request.query_params.get('placement')
        if placement:
            qs = qs.filter(placement=placement)
        return qs


class KidsBrandPromotionRequestView(views.APIView):
    def post(self, request):
        brand_name = request.data.get('brand_name')
        email = request.data.get('contact_email')
        tier = request.data.get('promotion_tier', 'FEATURED_COLLECTION')

        if not brand_name or not email:
            return response.Response({'error': 'Brand name and contact email required'}, status=status.HTTP_400_BAD_REQUEST)

        slug = brand_name.lower().replace(' ', '-').replace("'", '')
        brand, created = KidsBrandTenant.objects.get_or_create(
            slug=slug,
            defaults={
                'name': brand_name,
                'contact_email': email,
                'subscription_tier': 'GROWTH',
                'is_promoted': True,
                'promotion_tier': tier,
                'promoted_badge': 'HEIRLOOM PARTNER',
            }
        )

        return response.Response({
            'success': True,
            'message': f"Promotional partnership approved for '{brand_name}'.",
            'brand': KidsBrandTenantSerializer(brand).data,
            'promotion_tier': tier
        }, status=status.HTTP_201_CREATED)


class KidsWagtailAIAssistantChatView(views.APIView):
    def post(self, request):
        query = (request.data.get('message') or request.data.get('prompt') or '').strip()
        if not query:
            return response.Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        q_lower = query.lower()

        if any(w in q_lower for w in ['size', 'grow', 'age', 'month', 'cuff']):
            reply = (
                "All Petit Maison rompers and sleepwear feature our patented 'Room-to-Grow' extendable double cuffs. "
                "They fold up for snug fit in early months and fold down as baby grows, extending wearable life by 4-6 months! "
                "For sensitive skin, all seams are flatlock and tagless."
            )
            suggested_skus = ['PMK-ROMP-001', 'PMK-LNN-002']
        elif any(w in q_lower for w in ['gift', 'monogram', 'christening', 'baby shower']):
            reply = (
                "Our Heirloom Gifting Suite offers complimentary hand-lettered calligraphy gift notes, organic botanical gift boxes, "
                "and custom embroidered initials on all pointelle blankets and silk christening gowns."
            )
            suggested_skus = ['PMK-KNT-003', 'PMK-HEIR-005']
        elif any(w in q_lower for w in ['membership', 'club', 'plus', 'vip']):
            reply = (
                "The Petit Maison Nursery Club offers:\n"
                "• **Petit Plus Parent**: 10% off all orders, free organic courier delivery.\n"
                "• **Heirloom Gold Club**: 15% off, free quarterly nursery keepsake gift box.\n"
                "• **Petit VIP Family**: 25% off, complimentary hand-monogramming, and personal nursery concierge styling!"
            )
            suggested_skus = []
        elif any(w in q_lower for w in ['adult', 'couture', 'atelier', 'mom', 'dad']):
            reply = (
                "Looking for matching luxury attire for parents? Our sister maison **Atelier Vogue** under the same central enterprise hub "
                "features Milanese double-faced cashmere, silk chiffon evening gowns, and tailored Italian wool. Switch anytime via the top Hub switcher!"
            )
            suggested_skus = []
        else:
            reply = (
                f"Bonjour from Petit Maison Kids! Regarding '{query}': all our pieces are 100% GOTS organic certified and OEKO-TEX Standard 100 Class I tested "
                "for baby safety. How may our nursery stylist guide your selections today?"
            )
            suggested_skus = ['PMK-ROMP-001']

        return response.Response({
            'reply': reply,
            'suggested_skus': suggested_skus,
            'stylist_name': 'Amélie — Petit Maison AI Nursery Concierge',
            'status': 'success'
        })


class KidsWagtailAICopyGeneratorView(views.APIView):
    def post(self, request):
        title = request.data.get('title', 'Organic Cloud Romper')
        fabric = request.data.get('fabric', '100% GOTS Organic Cotton')
        stage = request.data.get('stage', '0-24 Months')

        description = (
            f"Lovingly crafted for gentle naps and joyful discoveries, the {title} is spun from {fabric}. "
            f"Tailored for {stage} with scratch-free flatlock seams and extendable growth cuffs, this heirloom piece "
            f"passes OEKO-TEX Standard 100 infant skin safety certifications with flying colors."
        )

        return response.Response({
            'success': True,
            'title': title,
            'generated_description': description,
            'safety_statement': 'OEKO-TEX Standard 100 Class 1 (Safe for Infant Skin)',
            'care_guide': 'Machine wash cold with gentle organic detergent. Air dry or tumble gentle low.'
        })


class KidsWagtailWorkflowsStatusView(views.APIView):
    def get(self, request):
        return response.Response({
            'workflows_enabled': True,
            'active_workflows': [
                {
                    'id': 1,
                    'name': 'Childrenswear Safety & Editorial Moderation Workflow',
                    'tasks': [
                        {'step': 1, 'name': 'OEKO-TEX Skin Safety & Fastener Compliance', 'role': 'Safety Officers'},
                        {'step': 2, 'name': 'Head of Childrenswear Design Sign-off', 'role': 'Design Directors'}
                    ],
                    'applied_models': ['Kids Apparel Product (KidsProductPage)', 'Kids Playbook Story']
                }
            ],
            'pending_reviews_count': 2
        })


class KidsStoreConfigView(views.APIView):
    def get(self, request):
        setting = KidsStoreBrandSetting.load()
        tickers = KidsAnnouncementTicker.objects.filter(is_active=True).order_by('sort_order')
        banners = KidsMarketingBanner.objects.filter(is_active=True).order_by('sort_order')
        coupons = KidsCoupon.objects.filter(is_active=True)
        brands = KidsBrandTenant.objects.filter(is_active=True).order_by('sort_order')
        memberships = KidsMembershipTier.objects.filter(is_active=True).order_by('sort_order')
        registers = KidsPOSRegister.objects.filter(is_active=True)

        return response.Response({
            'brand': KidsStoreBrandSettingSerializer(setting).data,
            'announcements': KidsAnnouncementTickerSerializer(tickers, many=True).data,
            'banners': KidsMarketingBannerSerializer(banners, many=True).data,
            'active_coupons': KidsCouponSerializer(coupons, many=True).data,
            'hosted_brands': KidsBrandTenantSerializer(brands, many=True).data,
            'membership_tiers': KidsMembershipTierSerializer(memberships, many=True).data,
            'pos_registers': KidsPOSRegisterSerializer(registers, many=True).data,
            'payment_gateways': {
                'stripe_enabled': True,
                'stripe_public_key': 'pk_test_petit_kids_51XYZ_demo_key',
                'razorpay_enabled': True,
                'razorpay_key_id': 'rzp_test_petit_demo_key',
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
