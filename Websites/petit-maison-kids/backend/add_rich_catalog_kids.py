#!/usr/bin/env python
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petit_backend.settings.dev')
django.setup()

from wagtail.models import Page
from catalog.models import KidsCategory, KidsProductPage, KidsProductReview

def add_products():
    home_page = Page.objects.filter(depth=2).first()
    categories = {c.slug: c for c in KidsCategory.objects.all()}

    more_products = [
        {
            'title': 'The Little Bear Chunky Seed-Stitch Cardigan',
            'slug': 'little-bear-chunky-seed-stitch-cardigan',
            'sku': 'PMK-INF-007',
            'price': Decimal('52.00'),
            'compare_at_price': Decimal('68.00'),
            'category': categories.get('baby'),
            'badge_text': 'HAND-KNIT FEEL',
            'is_bestseller': True,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 32,
            'fabric': '100% GOTS Certified Organic Merino & Combed Cotton Blend',
            'safety_certification': 'OEKO-TEX Standard 100 Class 1 (Hypoallergenic)',
            'fasteners': 'Sustainably Harvested Natural Corozo Nut Buttons',
            'care_guide': 'Hand wash or gentle wool cycle cold. Lay flat to dry.',
            'primary_image': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '0-24M',
            'available_sizes': ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
            'color_swatches': [
                {'name': 'Oatmeal Heather', 'hex': '#E5DFD7'},
                {'name': 'Warm Cinnamon', 'hex': '#B86F52'},
                {'name': 'Pine Needle', 'hex': '#3D5A45'}
            ],
            'sibling_matching_sku': 'PMK-JUN-011'
        },
        {
            'title': 'The Woodland Corduroy Explorer Overalls',
            'slug': 'woodland-corduroy-explorer-overalls',
            'sku': 'PMK-TOD-008',
            'price': Decimal('58.00'),
            'compare_at_price': Decimal('72.00'),
            'category': categories.get('toddler'),
            'badge_text': 'REINFORCED KNEES',
            'is_bestseller': True,
            'is_new_arrival': False,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 45,
            'fabric': '100% Organic Cotton Fine-Wale Velvet Corduroy',
            'safety_certification': 'OEKO-TEX Class 1 (Skin Friendly)',
            'fasteners': 'Solid Antiqued Brass Adjustable Buckles + Snap Inseam',
            'care_guide': 'Machine wash cold inside out with like colors. Tumble dry low.',
            'primary_image': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '2-5Y',
            'available_sizes': ['2T', '3T', '4T', '5Y'],
            'color_swatches': [
                {'name': 'Acorn Tan', 'hex': '#A06D3B'},
                {'name': 'French Navy', 'hex': '#273C58'},
                {'name': 'Forest Moss', 'hex': '#4A5B43'}
            ],
            'sibling_matching_sku': 'PMK-INF-001'
        },
        {
            'title': 'The Little Breton Sailor Stripe Organic Tee',
            'slug': 'little-breton-sailor-stripe-organic-tee',
            'sku': 'PMK-TOD-009',
            'price': Decimal('32.00'),
            'compare_at_price': Decimal('42.00'),
            'category': categories.get('toddler'),
            'badge_text': 'EVERYDAY ESSENTIAL',
            'is_bestseller': False,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': False,
            'inventory_count': 60,
            'fabric': '100% GOTS Ring-Spun Combed Cotton Interlock (200 GSM)',
            'safety_certification': 'GOTS Certified Non-Toxic Dyes',
            'fasteners': 'Shoulder Coconut Buttons for Easy Over-the-Head Dressing',
            'care_guide': 'Wash cold, warm iron on reverse, line dry in shade.',
            'primary_image': 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '2-5Y',
            'available_sizes': ['2T', '3T', '4T', '5Y'],
            'color_swatches': [
                {'name': 'Navy & Ecru', 'hex': '#1E293B'},
                {'name': 'Rouge & Cream', 'hex': '#991B1B'},
                {'name': 'Clover & Oat', 'hex': '#166534'}
            ],
            'sibling_matching_sku': 'PMK-SIB-012'
        },
        {
            'title': 'The Provençal Smocked Floral Sundress',
            'slug': 'provencal-smocked-floral-sundress',
            'sku': 'PMK-JUN-010',
            'price': Decimal('68.00'),
            'compare_at_price': Decimal('86.00'),
            'category': categories.get('junior'),
            'badge_text': 'HAND-SMOCKED',
            'is_bestseller': True,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': False,
            'inventory_count': 26,
            'fabric': '100% Organic Lawn Cotton with French Botanical Print',
            'safety_certification': 'OEKO-TEX Standard 100 Class 1',
            'fasteners': 'Mother of Pearl Back Buttons with Wide Bow Sash',
            'care_guide': 'Hand or delicate cycle, hang dry, gentle steam iron.',
            'primary_image': 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '6-12Y',
            'available_sizes': ['6Y', '7Y', '8Y', '10Y', '12Y'],
            'color_swatches': [
                {'name': 'Lavender Fields', 'hex': '#C4B5FD'},
                {'name': 'Wild Rose', 'hex': '#FDA4AF'},
                {'name': 'Sunlit Marigold', 'hex': '#FDE047'}
            ],
            'sibling_matching_sku': 'PMK-INF-001'
        },
        {
            'title': 'The Nordic Wool-Blend Duffle Pea Coat',
            'slug': 'nordic-wool-blend-duffle-pea-coat',
            'sku': 'PMK-JUN-011',
            'price': Decimal('94.00'),
            'compare_at_price': Decimal('125.00'),
            'category': categories.get('junior'),
            'badge_text': 'HEIRLOOM OUTERWEAR',
            'is_bestseller': False,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 20,
            'fabric': '80% Recycled Boiled Wool, 20% Organic Cotton Twill Lining',
            'safety_certification': 'Hypoallergenic Quilted Lining',
            'fasteners': 'Genuine Wooden Toggles with Hand-Knotted Rope Loops',
            'care_guide': 'Spot clean or eco dry clean. Hand me down for generations.',
            'primary_image': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '6-12Y',
            'available_sizes': ['6Y', '7Y', '8Y', '10Y', '12Y'],
            'color_swatches': [
                {'name': 'Camel Heather', 'hex': '#C19A6B'},
                {'name': 'Midnight Navy', 'hex': '#1E293B'},
                {'name': 'Forest Pine', 'hex': '#2D4A3E'}
            ],
            'sibling_matching_sku': 'PMK-INF-007'
        },
        {
            'title': 'The Meadow Gingham Twin Holiday Set',
            'slug': 'meadow-gingham-twin-holiday-set',
            'sku': 'PMK-SIB-012',
            'price': Decimal('88.00'),
            'compare_at_price': Decimal('115.00'),
            'category': categories.get('sibling'),
            'badge_text': 'MINI & ME COORDINATED',
            'is_bestseller': True,
            'is_new_arrival': False,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 28,
            'fabric': '100% Yarn-Dyed Organic Linen & Cotton Weave',
            'safety_certification': 'OEKO-TEX Standard 100 Class 1',
            'fasteners': 'Wooden Button Front with Stretch Waistband',
            'care_guide': 'Machine wash cold delicate. Hang dry or tumble low.',
            'primary_image': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '0-8Y',
            'available_sizes': ['0-12M Set', '2-3Y Set', '4-5Y Set', '6-7Y Set'],
            'color_swatches': [
                {'name': 'Sage Check', 'hex': '#94A3B8'},
                {'name': 'Honey Check', 'hex': '#F59E0B'},
                {'name': 'Berry Check', 'hex': '#BE185D'}
            ],
            'sibling_matching_sku': 'PMK-TOD-009'
        },
        {
            'title': 'The Cloud-Soft Bamboo 2-Way Zip Sleepsuit',
            'slug': 'cloud-soft-bamboo-2-way-zip-sleepsuit',
            'sku': 'PMK-SLP-013',
            'price': Decimal('38.00'),
            'compare_at_price': Decimal('48.00'),
            'category': categories.get('organic-basics'),
            'badge_text': '2-WAY DIAPER ZIP',
            'is_bestseller': True,
            'is_new_arrival': True,
            'is_monogrammable': False,
            'extendable_cuffs': True,
            'inventory_count': 55,
            'fabric': '95% Bamboo Viscose, 5% Spandex (Silky & Breathable)',
            'safety_certification': 'Hypoallergenic Eczema-Soothing Certified',
            'fasteners': 'Concealed 2-Way Zipper with Chin Safety Guard',
            'care_guide': 'Wash delicate cold inside out, tumble dry low.',
            'primary_image': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '0-24M',
            'available_sizes': ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
            'color_swatches': [
                {'name': 'Cloud White', 'hex': '#F8FAFC'},
                {'name': 'Misty Lavender', 'hex': '#E0E7FF'},
                {'name': 'Eucalyptus', 'hex': '#D1FAE5'}
            ],
            'sibling_matching_sku': 'PMK-INF-001'
        },
        {
            'title': 'The Little Prince Velvet Bow-Tie Tuxedo Set',
            'slug': 'little-prince-velvet-bow-tie-tuxedo-set',
            'sku': 'PMK-OCC-014',
            'price': Decimal('78.00'),
            'compare_at_price': Decimal('98.00'),
            'category': categories.get('toddler'),
            'badge_text': 'CEREMONY & WEDDING',
            'is_bestseller': False,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 22,
            'fabric': '100% Organic Silk Velvet & Poplin Shirt with Pre-Tied Satin Bow',
            'safety_certification': 'Formal Skin Comfort Tested',
            'fasteners': 'Magnetic Snap Quick-Fasteners for Stress-Free Dressing',
            'care_guide': 'Delicate dry clean or spot clean gently with soft brush.',
            'primary_image': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85'
            ],
            'age_stage': '2-5Y',
            'available_sizes': ['2T', '3T', '4T', '5Y'],
            'color_swatches': [
                {'name': 'Royal Navy Velvet', 'hex': '#1E3A8A'},
                {'name': 'Burgundy Wine', 'hex': '#881337'},
                {'name': 'Forest Emerald', 'hex': '#064E3B'}
            ],
            'sibling_matching_sku': 'PMK-JUN-010'
        }
    ]

    for p_data in more_products:
        slug = p_data['slug']
        existing = KidsProductPage.objects.filter(slug=slug).first()
        if not existing and home_page:
            p = KidsProductPage(**p_data)
            home_page.add_child(instance=p)
            p.save_revision().publish()
            print(f"  🍼 Added Kids Product: {p.title}")
            # Add parent review
            KidsProductReview.objects.create(
                product=p,
                parent_name='Clara Dupont',
                child_age='2 years old',
                rating=5,
                headline='Incredible heirloom quality that survives active play',
                comment='The attention to comfort seams and extendable cuffs is genius. After dozens of washes, colors are vibrant and softness is unreal.',
                wash_durability='Zero shrinking, gets softer every cycle',
                verified_parent=True
            )
        else:
            print(f"  Kids Product {slug} already exists.")

    print(f"\nTotal Kids Products: {KidsProductPage.objects.count()}")

if __name__ == '__main__':
    add_products()
