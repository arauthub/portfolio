from django.db import models
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.snippets.models import register_snippet
from wagtail.search import index

@register_snippet
class KidsCategory(models.Model):
    STAGE_CHOICES = [
        ('baby', 'Infant & Baby (0 - 24 Months)'),
        ('toddler', 'Toddler Adventures (2 - 5 Years)'),
        ('junior', 'Junior & Kids (6 - 12 Years)'),
        ('sibling', 'Mini & Me Sibling Sets'),
        ('organic_basics', 'Organic Essentials & Sleepwear'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='baby')
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, default='')
    featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('stage'),
        FieldPanel('description'),
        FieldPanel('image_url'),
        FieldPanel('featured'),
        FieldPanel('sort_order'),
    ]

    class Meta:
        verbose_name = 'Kids Category'
        verbose_name_plural = 'Kids Categories'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_stage_display()})"


class KidsProductPage(Page):
    sku = models.CharField(max_length=50, unique=True, default='PMK-001')
    barcode = models.CharField(max_length=64, blank=True, default='', help_text="UPC/EAN barcode for instant camera/laser scan")
    brand_name = models.CharField(max_length=100, default='Petit Maison Kids')
    department = models.CharField(max_length=50, default='kids')

    price = models.DecimalField(max_digits=10, decimal_places=2, default=48.00)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(
        KidsCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )
    badge_text = models.CharField(max_length=50, blank=True, help_text="e.g. 'GOTS ORGANIC', 'ROOM-TO-GROW', 'BESTSELLER'")
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=True)
    is_monogrammable = models.BooleanField(default=True, help_text="Can customer personalize with embroidered initials/name?")
    extendable_cuffs = models.BooleanField(default=True, help_text="Foldable cuffs that extend to fit through growth spurts")
    inventory_count = models.IntegerField(default=45)

    # Fabric, Skin Safety & Care
    fabric = models.CharField(max_length=200, default='100% GOTS Certified Organic Cotton Rib Knit')
    safety_certification = models.CharField(max_length=150, default='OEKO-TEX Standard 100 Class 1 (Safe for Sensitive Infant Skin)')
    fasteners = models.CharField(max_length=100, default='Lead-Free & Nickel-Free YKK Snaps / Natural Coconut Buttons')
    care_guide = models.TextField(default='Gentle machine wash cold with baby-safe detergent. Tumble dry delicate or air dry. Tagless neckline prevents scratching.')

    # Visual Media
    primary_image = models.URLField(
        default='https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80',
        help_text="Primary product photo"
    )
    hover_image = models.URLField(
        default='https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=80',
        help_text="Active play angle or back view"
    )
    extra_images = models.JSONField(
        default=list,
        blank=True,
        help_text="List of gallery images"
    )

    # Sizing matrix & Color swatches
    age_stage = models.CharField(max_length=50, default='0-24M', help_text="e.g. '0-24M', '2-5Y', '6-12Y'")
    available_sizes = models.JSONField(
        default=list,
        help_text="List of kids sizes e.g. ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'] or ['2T', '3T', '4T', '5Y']"
    )
    color_swatches = models.JSONField(
        default=list,
        help_text="List of color objects e.g. [{'name': 'Buttercream Oat', 'hex': '#FFF3E0'}, {'name': 'Sage Sprout', 'hex': '#D4E2D4'}]"
    )

    # Sibling / Bundle Matching
    sibling_matching_sku = models.CharField(max_length=50, blank=True, help_text="SKU of matching toddler/older sibling outfit")

    search_fields = Page.search_fields + [
        index.SearchField('sku'),
        index.SearchField('barcode'),
        index.SearchField('brand_name'),
        index.SearchField('fabric'),
        index.SearchField('safety_certification'),
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
            FieldPanel('is_monogrammable'),
            FieldPanel('extendable_cuffs'),
            FieldPanel('inventory_count'),
        ], heading="Pricing, Category, Brand & Stock"),
        MultiFieldPanel([
            FieldPanel('fabric'),
            FieldPanel('safety_certification'),
            FieldPanel('fasteners'),
            FieldPanel('care_guide'),
            FieldPanel('age_stage'),
            FieldPanel('available_sizes'),
            FieldPanel('color_swatches'),
            FieldPanel('sibling_matching_sku'),
        ], heading="Kids Specifications, Skin Safety & Sizing"),
        MultiFieldPanel([
            FieldPanel('primary_image'),
            FieldPanel('hover_image'),
            FieldPanel('extra_images'),
        ], heading="Playful Photography Showcase"),
    ]

    class Meta:
        verbose_name = 'Kids Apparel Product'
        verbose_name_plural = 'Kids Apparel Products'


@register_snippet
class KidsProductReview(models.Model):
    product = models.ForeignKey(KidsProductPage, on_delete=models.CASCADE, related_name='reviews')
    parent_name = models.CharField(max_length=100)
    child_age = models.CharField(max_length=50, default='14 months old')
    rating = models.PositiveSmallIntegerField(default=5)
    headline = models.CharField(max_length=200)
    comment = models.TextField()
    wash_durability = models.CharField(max_length=50, default='Washes like a dream, zero shrinking')
    verified_parent = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    panels = [
        FieldPanel('product'),
        FieldPanel('parent_name'),
        FieldPanel('child_age'),
        FieldPanel('rating'),
        FieldPanel('headline'),
        FieldPanel('comment'),
        FieldPanel('wash_durability'),
        FieldPanel('verified_parent'),
    ]

    def __str__(self):
        return f"{self.parent_name} (Mom/Dad of {self.child_age}) - {self.product.title} ({self.rating}/5)"


@register_snippet
class KidsPlaybookLookbook(Page):
    theme_title = models.CharField(max_length=150, default='Spring Meadow Picnics & Little Explorers')
    age_group_label = models.CharField(max_length=100, default='Ages 6M - 8Y')
    curator_story = models.CharField(max_length=300, default='Clothes crafted for tumbling in wild clover, puddle jumps, and cozy afternoon naps.')
    hero_image = models.URLField(default='https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1600&q=80')
    featured_skus = models.JSONField(default=list)

    content_panels = Page.content_panels + [
        FieldPanel('theme_title'),
        FieldPanel('age_group_label'),
        FieldPanel('curator_story'),
        FieldPanel('hero_image'),
        FieldPanel('featured_skus'),
    ]

    class Meta:
        verbose_name = 'Kids Playbook Story'
        verbose_name_plural = 'Kids Playbook Stories'
