from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import KidsCategory, KidsProductPage, KidsPlaybookLookbook, KidsProductReview
from .serializers import (
    KidsCategorySerializer,
    KidsProductPageSerializer,
    KidsPlaybookLookbookSerializer,
    KidsProductReviewSerializer
)

class KidsCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KidsCategory.objects.all().order_by('sort_order', 'name')
    serializer_class = KidsCategorySerializer
    pagination_class = None


class KidsProductPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KidsProductPage.objects.live().select_related('category').prefetch_related('reviews')
    serializer_class = KidsProductPageSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'sku', 'barcode', 'brand_name', 'fabric', 'badge_text', 'category__name']
    ordering_fields = ['price', 'title', 'inventory_count', 'id']

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category__slug=category)

        brand = self.request.query_params.get('brand')
        if brand and brand != 'all':
            qs = qs.filter(brand_name__icontains=brand)

        department = self.request.query_params.get('department')
        if department and department != 'all':
            qs = qs.filter(department__iexact=department)

        min_price = self.request.query_params.get('min_price')
        if min_price:
            qs = qs.filter(price__gte=min_price)

        max_price = self.request.query_params.get('max_price')
        if max_price:
            qs = qs.filter(price__lte=max_price)

        is_bestseller = self.request.query_params.get('is_bestseller')
        if is_bestseller in ['true', '1']:
            qs = qs.filter(is_bestseller=True)

        is_new_arrival = self.request.query_params.get('is_new_arrival')
        if is_new_arrival in ['true', '1']:
            qs = qs.filter(is_new_arrival=True)

        return qs


class KidsPlaybookLookbookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KidsPlaybookLookbook.objects.live()
    serializer_class = KidsPlaybookLookbookSerializer
    pagination_class = None
