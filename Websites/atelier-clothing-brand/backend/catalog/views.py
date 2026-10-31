from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ProductCategory, ProductPage, LookbookPage, ProductReview
from .serializers import (
    ProductCategorySerializer,
    ProductPageSerializer,
    LookbookPageSerializer,
    ProductReviewSerializer
)

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all().order_by('sort_order', 'name')
    serializer_class = ProductCategorySerializer
    pagination_class = None


class ProductPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductPage.objects.live().select_related('category').prefetch_related('reviews')
    serializer_class = ProductPageSerializer
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


class LookbookPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LookbookPage.objects.live()
    serializer_class = LookbookPageSerializer
    pagination_class = None
