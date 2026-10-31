from django.contrib import admin
from .models import KidsCategory, KidsProductReview

@admin.register(KidsCategory)
class KidsCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'stage', 'featured', 'sort_order']
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ['stage', 'featured']


@admin.register(KidsProductReview)
class KidsProductReviewAdmin(admin.ModelAdmin):
    list_display = ['parent_name', 'child_age', 'product', 'rating', 'wash_durability', 'verified_parent', 'created_at']
    list_filter = ['rating', 'verified_parent']
