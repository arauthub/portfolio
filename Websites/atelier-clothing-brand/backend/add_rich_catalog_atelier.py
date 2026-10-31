#!/usr/bin/env python
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'atelier_backend.settings.dev')
django.setup()

from wagtail.models import Page
from catalog.models import ProductCategory, ProductPage, ProductReview

def add_products():
    home_page = Page.objects.filter(depth=2).first()
    categories = {c.slug: c for c in ProductCategory.objects.all()}

    more_products = [
        {
            'title': 'The Saffron Silk Georgette Pleated Cape Gown',
            'slug': 'saffron-silk-georgette-pleated-cape-gown',
            'sku': 'AV-EVN-007',
            'price': Decimal('1480.00'),
            'compare_at_price': Decimal('1850.00'),
            'category': categories.get('evening-wear'),
            'badge_text': 'RUNWAY COUTURE',
            'is_bestseller': True,
            'is_new_arrival': True,
            'inventory_count': 8,
            'fabric': '100% Mulberry Silk Georgette (Hand-Pleated in Como, Italy)',
            'fit': 'Floor-sweeping Grecian cape silhouette with interior bustier support',
            'sustainability_rating': 'Grade A+ Certified Organic Dye Process (Zero Effluent)',
            'care_guide': 'Specialist couture dry clean only. Store in archival breathable garment bag.',
            'primary_image': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
            ],
            'available_sizes': ['36 FR (0 US)', '38 FR (2 US)', '40 FR (4 US)', '42 FR (6 US)', '44 FR (8 US)'],
            'color_swatches': [
                {'name': 'Imperial Saffron', 'hex': '#E0A96D'},
                {'name': 'Obsidian Noir', 'hex': '#1A1A1A'},
                {'name': 'Ivory Alabaster', 'hex': '#FDFBF7'}
            ]
        },
        {
            'title': 'The Regenerative Merino Ribbed Maxi Dress',
            'slug': 'regenerative-merino-ribbed-maxi-dress',
            'sku': 'AV-KNT-008',
            'price': Decimal('720.00'),
            'compare_at_price': Decimal('900.00'),
            'category': categories.get('knitwear'),
            'badge_text': 'SUSTAINABLE EDIT',
            'is_bestseller': True,
            'is_new_arrival': False,
            'inventory_count': 16,
            'fabric': '100% Non-Mulesed Extra-Fine New Zealand Merino Wool (19.5 Micron)',
            'fit': 'Sculptural column fit with subtle side-split for graceful stride',
            'sustainability_rating': 'ZQ Certified Regenerative Agriculture Wool',
            'care_guide': 'Gentle wool cycle cold, dry flat on terry towel, store folded with cedar.',
            'primary_image': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85'
            ],
            'available_sizes': ['XS (34 FR)', 'S (36 FR)', 'M (38 FR)', 'L (40 FR)'],
            'color_swatches': [
                {'name': 'Warm Camel', 'hex': '#C19A6B'},
                {'name': 'Heathered Oatmeal', 'hex': '#E8E3D9'},
                {'name': 'Midnight Navy', 'hex': '#1B263B'}
            ]
        },
        {
            'title': 'The Sovereign Architectural Double-Breasted Blazer',
            'slug': 'sovereign-architectural-double-breasted-blazer',
            'sku': 'AV-OTR-009',
            'price': Decimal('1650.00'),
            'compare_at_price': Decimal('1980.00'),
            'category': categories.get('outerwear'),
            'badge_text': 'SAVILE ROW CUT',
            'is_bestseller': False,
            'is_new_arrival': True,
            'inventory_count': 10,
            'fabric': '100% Super 160s Worsted English Wool with Full Horsehair Canvas',
            'fit': 'Sharp structured peak lapels, roped shoulders, and nipped waistline',
            'sustainability_rating': 'Heirloom Lifetime Construction (Free Atelier Repairs)',
            'care_guide': 'Press with damp cloth, seasonal dry clean only.',
            'primary_image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85'
            ],
            'available_sizes': ['36 FR (0 US)', '38 FR (2 US)', '40 FR (4 US)', '42 FR (6 US)', '44 FR (8 US)'],
            'color_swatches': [
                {'name': 'Chalk Chalkstripe', 'hex': '#2D3748'},
                {'name': 'Tuxedo Black', 'hex': '#111827'},
                {'name': 'Ecru Wool Twill', 'hex': '#FAF5EE'}
            ]
        },
        {
            'title': 'The Andalusian Hand-Tooled Saddle Messenger',
            'slug': 'andalusian-hand-tooled-saddle-messenger',
            'sku': 'AV-ACC-010',
            'price': Decimal('1290.00'),
            'compare_at_price': None,
            'category': categories.get('leather-goods'),
            'badge_text': 'LIMITED TO 50 PCS',
            'is_bestseller': True,
            'is_new_arrival': True,
            'inventory_count': 12,
            'fabric': 'Full-Grain Vegetable-Tanned Spanish Calfskin (Pelle Conciata al Vegetale)',
            'fit': 'Adjustable saddle shoulder strap, 24k gold-plated brass lock mechanism',
            'sustainability_rating': '100% Organic Bark Tannins, Biodegradable Leather',
            'care_guide': 'Condition annually with beeswax balm. Patina develops with age.',
            'primary_image': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
            ],
            'available_sizes': ['One Size (Length 26cm, Height 20cm, Depth 9cm)'],
            'color_swatches': [
                {'name': 'Saddle Cognac', 'hex': '#9A3412'},
                {'name': 'Olive Drab', 'hex': '#3F6212'},
                {'name': 'Charcoal Noir', 'hex': '#1E293B'}
            ]
        },
        {
            'title': 'The Baroque Pearl Sculpted Collar Choker',
            'slug': 'baroque-pearl-sculpted-collar-choker',
            'sku': 'AV-JWL-011',
            'price': Decimal('890.00'),
            'compare_at_price': Decimal('1150.00'),
            'category': categories.get('accessories'),
            'badge_text': 'HAUTE JOAILLERIE',
            'is_bestseller': False,
            'is_new_arrival': True,
            'inventory_count': 14,
            'fabric': 'Recycled 18K Yellow Gold Vermeil (3 Microns) & South Sea Keshi Pearl',
            'fit': 'Flexible hinged collar fits collarbones seamlessly with safety clasp',
            'sustainability_rating': 'Fairmined Certified Recycled Gold & Ethical Sea Harvesting',
            'care_guide': 'Wipe with microfiber jewel cloth. Keep away from direct perfumes.',
            'primary_image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
            ],
            'available_sizes': ['Standard Petite (36cm)', 'Standard Regular (40cm)'],
            'color_swatches': [
                {'name': '18K Yellow Gold', 'hex': '#EAB308'},
                {'name': '925 Sterling Silver', 'hex': '#E2E8F0'}
            ]
        },
        {
            'title': 'The Plissé Silk Organza Ballerina Blouse',
            'slug': 'plisse-silk-organza-ballerina-blouse',
            'sku': 'AV-BLS-012',
            'price': Decimal('680.00'),
            'compare_at_price': Decimal('850.00'),
            'category': categories.get('evening-wear'),
            'badge_text': 'PARIS ATELIER',
            'is_bestseller': True,
            'is_new_arrival': False,
            'inventory_count': 18,
            'fabric': '100% Crisp Silk Organza with Mother-of-Pearl Button Fastenings',
            'fit': 'Romantic voluminous poet sleeves with delicate high ruffled neck',
            'sustainability_rating': 'OEKO-TEX 100 Eco-Dyed Silk Weave',
            'care_guide': 'Delicate dry clean only. Cool iron over press cloth.',
            'primary_image': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85'
            ],
            'available_sizes': ['34 FR (00 US)', '36 FR (0 US)', '38 FR (2 US)', '40 FR (4 US)', '42 FR (6 US)'],
            'color_swatches': [
                {'name': 'Pristine Snow', 'hex': '#FFFFFF'},
                {'name': 'Blush Camellia', 'hex': '#FBCFE8'},
                {'name': 'Smoky Quartz', 'hex': '#78716C'}
            ]
        }
    ]

    for p_data in more_products:
        slug = p_data['slug']
        existing = ProductPage.objects.filter(slug=slug).first()
        if not existing and home_page:
            p = ProductPage(**p_data)
            home_page.add_child(instance=p)
            p.save_revision().publish()
            print(f"  ✨ Added Luxury Product: {p.title}")
            # Add review
            ProductReview.objects.create(
                product=p,
                author_name='Eleanor Vance',
                rating=5,
                headline='An absolute masterpiece of craftsmanship',
                comment='The drape, material weight, and attention to finishing rival Parisian bespoke houses. Worth every penny.',
                fit_feedback='True to size',
                verified_purchase=True
            )
        else:
            print(f"  Product {slug} already exists.")

    print(f"\nTotal Atelier Products: {ProductPage.objects.count()}")

if __name__ == '__main__':
    add_products()
