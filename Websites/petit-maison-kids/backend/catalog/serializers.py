from rest_framework import serializers
from .models import KidsCategory, KidsProductPage, KidsProductReview, KidsPlaybookLookbook

class KidsCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = KidsCategory
        fields = ['id', 'name', 'slug', 'stage', 'description', 'image_url', 'featured', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()


class KidsProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = KidsProductReview
        fields = ['id', 'parent_name', 'child_age', 'rating', 'headline', 'comment', 'wash_durability', 'verified_parent', 'created_at']


class KidsProductPageSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    reviews = KidsProductReviewSerializer(many=True, read_only=True)
    rating_average = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = KidsProductPage
        fields = [
            'id', 'title', 'slug', 'sku', 'barcode', 'brand_name', 'department',
            'price', 'compare_at_price',
            'category', 'category_name', 'category_slug', 'badge_text',
            'is_bestseller', 'is_new_arrival', 'is_monogrammable', 'extendable_cuffs',
            'inventory_count', 'fabric', 'safety_certification', 'fasteners', 'care_guide',
            'primary_image', 'hover_image', 'extra_images',
            'age_stage', 'available_sizes', 'color_swatches', 'sibling_matching_sku',
            'reviews', 'rating_average', 'review_count'
        ]

    def get_rating_average(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 5.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.count()


class KidsPlaybookLookbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = KidsPlaybookLookbook
        fields = ['id', 'title', 'slug', 'theme_title', 'age_group_label', 'curator_story', 'hero_image', 'featured_skus']
