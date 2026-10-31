from rest_framework import serializers
from .models import ProductCategory, ProductPage, ProductReview, LookbookPage

class ProductCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'featured', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['id', 'author_name', 'rating', 'headline', 'comment', 'fit_feedback', 'verified_purchase', 'created_at']


class ProductPageSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    rating_average = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = ProductPage
        fields = [
            'id', 'title', 'slug', 'sku', 'barcode', 'brand_name', 'department',
            'price', 'compare_at_price',
            'category', 'category_name', 'category_slug', 'badge_text',
            'is_bestseller', 'is_new_arrival', 'inventory_count',
            'fabric', 'fit', 'sustainability_rating', 'care_guide',
            'primary_image', 'hover_image', 'extra_images',
            'available_sizes', 'color_swatches', 'paired_outfit_skus',
            'reviews', 'rating_average', 'review_count'
        ]

    def get_rating_average(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 5.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.count()


class LookbookPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LookbookPage
        fields = ['id', 'title', 'slug', 'season_tag', 'curator_quote', 'hero_image', 'featured_skus']
