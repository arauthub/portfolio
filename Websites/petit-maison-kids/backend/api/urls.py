from django.urls import path, include
from rest_framework.routers import DefaultRouter
from catalog.views import KidsCategoryViewSet, KidsProductPageViewSet, KidsPlaybookLookbookViewSet
from marketing.views import (
    KidsAnnouncementTickerViewSet,
    KidsMarketingBannerViewSet,
    KidsStoreConfigView,
    KidsBrandTenantViewSet,
    KidsMembershipTierViewSet,
    KidsPOSRegisterViewSet,
    KidsBrandPromotionRequestView,
    KidsWagtailAIAssistantChatView,
    KidsWagtailAICopyGeneratorView,
    KidsWagtailWorkflowsStatusView
)

router = DefaultRouter()
router.register(r'products', KidsProductPageViewSet, basename='product')
router.register(r'categories', KidsCategoryViewSet, basename='category')
router.register(r'lookbooks', KidsPlaybookLookbookViewSet, basename='lookbook')
router.register(r'tickers', KidsAnnouncementTickerViewSet, basename='ticker')
router.register(r'banners', KidsMarketingBannerViewSet, basename='banner')
router.register(r'brands', KidsBrandTenantViewSet, basename='brand')
router.register(r'memberships', KidsMembershipTierViewSet, basename='membership')
router.register(r'membership-tiers', KidsMembershipTierViewSet, basename='membership-tier')
router.register(r'pos-registers', KidsPOSRegisterViewSet, basename='pos-register')

urlpatterns = [
    path('store-config/', KidsStoreConfigView.as_view(), name='store-config'),
    path('commerce/', include('commerce.urls')),
    path('ai/chat/', KidsWagtailAIAssistantChatView.as_view(), name='ai-chat'),
    path('ai/generate-copy/', KidsWagtailAICopyGeneratorView.as_view(), name='ai-generate-copy'),
    path('workflows/status/', KidsWagtailWorkflowsStatusView.as_view(), name='workflows-status'),
    path('brands/promote/', KidsBrandPromotionRequestView.as_view(), name='brands-promote'),
    path('brands/promotion-request/', KidsBrandPromotionRequestView.as_view(), name='brands-promotion-request'),
    path('', include(router.urls)),
]
