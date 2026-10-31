from django.contrib import admin
from .models import ProductCategory, ProductReview

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'featured', 'sort_order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'product', 'rating', 'verified_purchase', 'created_at']
    list_filter = ['rating', 'verified_purchase']
