from django.urls import path
from .views import (
    ValidateCouponAPIView,
    CreatePaymentIntentAPIView,
    SubmitOrderAPIView,
    TrackOrderAPIView,
    StockBarcodeLookupAPIView,
    StockUpdateAPIView,
)

urlpatterns = [
    path('validate-coupon/', ValidateCouponAPIView.as_view(), name='validate-coupon'),
    path('create-payment-intent/', CreatePaymentIntentAPIView.as_view(), name='create-payment-intent'),
    path('submit-order/', SubmitOrderAPIView.as_view(), name='submit-order'),
    path('track-order/<str:order_number>/', TrackOrderAPIView.as_view(), name='track-order'),
    path('barcode-lookup/', StockBarcodeLookupAPIView.as_view(), name='barcode-lookup'),
    path('stock-update/', StockUpdateAPIView.as_view(), name='stock-update'),
]
