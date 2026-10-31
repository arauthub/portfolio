from django.urls import path, include
from rest_framework.routers import DefaultRouter
from catalog.views import ProductCategoryViewSet, ProductPageViewSet, LookbookPageViewSet
from marketing.views import (
    AnnouncementTickerViewSet,
    MarketingBannerViewSet,
    StoreConfigView,
    BrandTenantViewSet,
    MembershipTierViewSet,
    POSRegisterViewSet,
    BrandPromotionRequestView,
    WagtailAIAssistantChatView,
    WagtailAICopyGeneratorView,
    WagtailWorkflowsStatusView
)

router = DefaultRouter()
router.register(r'products', ProductPageViewSet, basename='product')
router.register(r'categories', ProductCategoryViewSet, basename='category')
router.register(r'lookbooks', LookbookPageViewSet, basename='lookbook')
router.register(r'tickers', AnnouncementTickerViewSet, basename='ticker')
router.register(r'banners', MarketingBannerViewSet, basename='banner')
router.register(r'brands', BrandTenantViewSet, basename='brand')
router.register(r'memberships', MembershipTierViewSet, basename='membership')
router.register(r'membership-tiers', MembershipTierViewSet, basename='membership-tier')
router.register(r'pos-registers', POSRegisterViewSet, basename='pos-register')

urlpatterns = [
    path('store-config/', StoreConfigView.as_view(), name='store-config'),
    path('commerce/', include('commerce.urls')),
    path('ai/chat/', WagtailAIAssistantChatView.as_view(), name='ai-chat'),
    path('ai/generate-copy/', WagtailAICopyGeneratorView.as_view(), name='ai-generate-copy'),
    path('workflows/status/', WagtailWorkflowsStatusView.as_view(), name='workflows-status'),
    path('brands/promote/', BrandPromotionRequestView.as_view(), name='brands-promote'),
    path('brands/promotion-request/', BrandPromotionRequestView.as_view(), name='brands-promotion-request'),
    path('', include(router.urls)),
]
