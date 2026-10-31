from django.db import models
from wagtail.models import Page, Orderable
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.snippets.models import register_snippet
from wagtail.search import index
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel

@register_snippet
class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, default='')
    featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('description'),
        FieldPanel('image_url'),
        FieldPanel('featured'),
        FieldPanel('sort_order'),
    ]

    class Meta:
        verbose_name = 'Product Category'
        verbose_name_plural = 'Product Categories'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class ProductPage(Page):
    sku = models.CharField(max_length=50, unique=True, default='AT-001')
    barcode = models.CharField(max_length=64, blank=True, default='', help_text="UPC/EAN barcode for fast camera/laser scanner lookup")
    brand_name = models.CharField(max_length=100, default='Atelier Vogue', help_text="Brand or Maison name")
    department = models.CharField(max_length=50, default='adults', help_text="adults, kids, or unisex")
    
    price = models.DecimalField(max_digits=10, decimal_places=2, default=295.00)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )
    badge_text = models.CharField(max_length=50, blank=True, help_text="e.g. 'NEW ARRIVAL', 'RUNWAY EXCLUSIVE', 'LIMITED 50 PCS'")
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=True)
    inventory_count = models.IntegerField(default=25)
    
    # Fashion Specs
    fabric = models.CharField(max_length=200, default='100% Organic Silk & Cashmere Blend')
    fit = models.CharField(max_length=100, default='Tailored Italian Slim Fit')
    sustainability_rating = models.CharField(max_length=100, default='A+ Eco-Certified Vegan Dye')
    care_guide = models.TextField(default='Dry clean only. Steam with low heat. Store on cedar wood hanger.')
    
    # Media
    primary_image = models.URLField(
        default='https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
        help_text="Primary editorial photograph"
    )
    hover_image = models.URLField(
        default='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
        help_text="Back angle or movement shot"
    )
    extra_images = models.JSONField(
        default=list,
        blank=True,
        help_text="Array of image URLs for gallery showcase"
    )

    # Variants (Sizes and Swatches)
    available_sizes = models.JSONField(
        default=list,
        help_text="List of available sizes e.g. ['XS', 'S', 'M', 'L', 'XL']"
    )
    color_swatches = models.JSONField(
        default=list,
        help_text="List of color objects e.g. [{'name': 'Obsidian Noir', 'hex': '#111111'}, {'name': 'Oatmeal Melange', 'hex': '#D4CBBE'}]"
    )
    
    # AI / Matching Outfits
    paired_outfit_skus = models.JSONField(
        default=list,
        blank=True,
        help_text="SKUs of complementary items to display in 'Complete The Look' bundle"
    )

    search_fields = Page.search_fields + [
        index.SearchField('sku'),
        index.SearchField('barcode'),
        index.SearchField('brand_name'),
        index.SearchField('fabric'),
        index.SearchField('badge_text'),
    ]

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('sku'),
            FieldPanel('barcode'),
            FieldPanel('brand_name'),
            FieldPanel('department'),
            FieldPanel('price'),
            FieldPanel('compare_at_price'),
            FieldPanel('category'),
            FieldPanel('badge_text'),
            FieldPanel('is_bestseller'),
            FieldPanel('is_new_arrival'),
            FieldPanel('inventory_count'),
        ], heading="Pricing, Brand & Live Stock"),
        MultiFieldPanel([
            FieldPanel('fabric'),
            FieldPanel('fit'),
            FieldPanel('sustainability_rating'),
            FieldPanel('care_guide'),
            FieldPanel('available_sizes'),
            FieldPanel('color_swatches'),
            FieldPanel('paired_outfit_skus'),
        ], heading="Atelier Specifications & Variants"),
        MultiFieldPanel([
            FieldPanel('primary_image'),
            FieldPanel('hover_image'),
            FieldPanel('extra_images'),
        ], heading="Visual Editorial Showcase"),
    ]

    class Meta:
        verbose_name = 'Luxury Product'
        verbose_name_plural = 'Luxury Products'


@register_snippet
class ProductReview(models.Model):
    product = models.ForeignKey(ProductPage, on_delete=models.CASCADE, related_name='reviews')
    author_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(default=5)
    headline = models.CharField(max_length=200)
    comment = models.TextField()
    fit_feedback = models.CharField(max_length=50, default='True to size')
    verified_purchase = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    panels = [
        FieldPanel('product'),
        FieldPanel('author_name'),
        FieldPanel('rating'),
        FieldPanel('headline'),
        FieldPanel('comment'),
        FieldPanel('fit_feedback'),
        FieldPanel('verified_purchase'),
    ]

    def __str__(self):
        return f"{self.author_name} - {self.product.title} ({self.rating}/5)"


@register_snippet
class LookbookPage(Page):
    season_tag = models.CharField(max_length=100, default='AUTUMN / WINTER 2026')
    curator_quote = models.CharField(max_length=300, default='Architectural silhouettes crafted in regenerative cashmere.')
    hero_image = models.URLField(default='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80')
    featured_skus = models.JSONField(default=list)

    content_panels = Page.content_panels + [
        FieldPanel('season_tag'),
        FieldPanel('curator_quote'),
        FieldPanel('hero_image'),
        FieldPanel('featured_skus'),
    ]

    class Meta:
        verbose_name = 'Seasonal Lookbook'
        verbose_name_plural = 'Seasonal Lookbooks'
