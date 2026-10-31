from django.urls import path
from .views import (
    ValidateKidsCouponAPIView,
    CreateKidsPaymentIntentAPIView,
    SubmitKidsOrderAPIView,
    TrackKidsOrderAPIView,
    KidsStockBarcodeLookupAPIView,
    KidsStockUpdateAPIView,
)

urlpatterns = [
    path('validate-coupon/', ValidateKidsCouponAPIView.as_view(), name='validate-coupon'),
    path('create-payment-intent/', CreateKidsPaymentIntentAPIView.as_view(), name='create-payment-intent'),
    path('submit-order/', SubmitKidsOrderAPIView.as_view(), name='submit-order'),
    path('track-order/<str:order_number>/', TrackKidsOrderAPIView.as_view(), name='track-order'),
    path('barcode-lookup/', KidsStockBarcodeLookupAPIView.as_view(), name='barcode-lookup'),
    path('stock-update/', KidsStockUpdateAPIView.as_view(), name='stock-update'),
]
