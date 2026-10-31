#!/usr/bin/env python
"""
Seed script for PETIT MAISON KIDS — Sustainable & Heirloom Childrenswear Platform.
Populates realistic kids catalog (Infant, Toddler, Junior, Sibling Sets),
monogrammable options, parental reviews, playful marketing banners, coupons, and brand settings.
"""

import os
import django
from decimal import Decimal
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petit_backend.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from wagtail.models import Page, Site
from catalog.models import KidsCategory, KidsProductPage, KidsProductReview, KidsPlaybookLookbook
from marketing.models import KidsAnnouncementTicker, KidsMarketingBanner, KidsCoupon, KidsStoreBrandSetting

User = get_user_model()

def seed():
    print("🧸 Seeding Petit Maison Kids Platform...")

    # 1. Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'bonjour@petitmaisonkids.com', 'petit2026!')
        print("  👤 Created Superuser: admin / petit2026!")
    else:
        print("  👤 Superuser 'admin' already exists.")

    # 2. Setup Site Root
    root_page = Page.objects.filter(depth=1).first()
    if not root_page:
        root_page = Page.add_root(title="Root")

    home_page = Page.objects.filter(depth=2).first()
    if not home_page:
        home_page = Page(title="Petit Maison Kids Home", slug="home")
        root_page.add_child(instance=home_page)
        home_page.save_revision().publish()

    site = Site.objects.filter(is_default_site=True).first()
    if not site:
        Site.objects.create(hostname='localhost', port=8001, root_page=home_page, is_default_site=True, site_name='Petit Maison Kids')

    # 3. Create Categories
    categories_data = [
        {
            'name': 'Infant & Baby (0 - 24M)',
            'slug': 'baby',
            'stage': 'baby',
            'description': 'Scratch-free organic pointelle rompers, kimono wraps, and heirloom newborn layettes.',
            'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 1,
        },
        {
            'name': 'Toddler Explorers (2 - 5Y)',
            'slug': 'toddler',
            'stage': 'toddler',
            'description': 'Puddle-proof reinforced overalls, play-durable French terry, and easy-dress elastic waists.',
            'image_url': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 2,
        },
        {
            'name': 'Junior & Big Kids (6 - 12Y)',
            'slug': 'junior',
            'stage': 'junior',
            'description': 'Artisanal chore jackets, school-ready organic twill trousers, and breezy Sunday dresses.',
            'image_url': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 3,
        },
        {
            'name': 'Mini & Me Sibling Sets',
            'slug': 'sibling',
            'stage': 'sibling',
            'description': 'Complementary outfits designed for brother & sister portraits and holiday celebrations.',
            'image_url': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 4,
        },
        {
            'name': 'Organic Basics & Sleep',
            'slug': 'organic-basics',
            'stage': 'organic_basics',
            'description': '100% GOTS rib-knit pyjamas, sleep sacks, and hypoallergenic bamboo essentials.',
            'image_url': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
            'featured': False,
            'sort_order': 5,
        },
    ]

    cat_map = {}
    for c_data in categories_data:
        cat, _ = KidsCategory.objects.update_or_create(
            slug=c_data['slug'],
            defaults=c_data
        )
        cat_map[c_data['slug']] = cat
    print(f"  🍼 Seeded {len(cat_map)} Kids Categories")

    # 4. Create Kids Products
    products_data = [
        {
            'title': 'The Heirloom Organic Pointelle Romper',
            'slug': 'heirloom-organic-pointelle-romper',
            'sku': 'PMK-INF-001',
            'price': Decimal('44.00'),
            'compare_at_price': Decimal('56.00'),
            'category': cat_map['baby'],
            'badge_text': '100% GOTS ORGANIC',
            'is_bestseller': True,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 38,
            'fabric': '100% GOTS Certified Organic Cotton Pointelle (240 GSM)',
            'safety_certification': 'OEKO-TEX Standard 100 Class 1 (Certified Infant Skin Safe)',
            'fasteners': 'Nickel-Free YKK Inseam Snaps for 10-Second Diaper Changes',
            'care_guide': 'Machine wash cold with gentle baby detergent. Tumble dry low. Foldable cuff adds +3 months wear time.',
            'primary_image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80'
            ],
            'age_stage': '0-24M',
            'available_sizes': ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
            'color_swatches': [
                {'name': 'Buttercream Oat', 'hex': '#FFF3E0'},
                {'name': 'French Sage Sprout', 'hex': '#D4E2D4'},
                {'name': 'Petal Blush', 'hex': '#FCE4EC'}
            ],
            'sibling_matching_sku': 'PMK-TOD-002'
        },
        {
            'title': 'Puddle-Jumper French Terry Overalls with Double Knee',
            'slug': 'puddle-jumper-french-terry-overalls',
            'sku': 'PMK-TOD-002',
            'price': Decimal('58.00'),
            'compare_at_price': Decimal('72.00'),
            'category': cat_map['toddler'],
            'badge_text': 'REINFORCED KNEES',
            'is_bestseller': True,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 26,
            'fabric': '100% Organic Cotton Loopback French Terry with Corduroy Knee Shields',
            'safety_certification': 'Heavy Metal Tested / Non-Toxic Low Impact Dyes',
            'fasteners': 'Adjustable Shoulder Strap Wooden Coconut Shell Buttons',
            'care_guide': 'Mud and grass stain resistant wash. Machine wash warm, line dry or tumble dry.',
            'primary_image': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80'
            ],
            'age_stage': '2-5Y',
            'available_sizes': ['2T', '3T', '4T', '5Y'],
            'color_swatches': [
                {'name': 'Caramel Toffee', 'hex': '#A07855'},
                {'name': 'Ocean Pebble', 'hex': '#7A8B99'},
                {'name': 'Forest Pine', 'hex': '#3D5A4C'}
            ],
            'sibling_matching_sku': 'PMK-INF-001'
        },
        {
            'title': 'The Sibling Meadow Matching Set (Dress & Camp Shirt)',
            'slug': 'sibling-meadow-matching-set',
            'sku': 'PMK-SIB-003',
            'price': Decimal('82.00'),
            'compare_at_price': Decimal('98.00'),
            'category': cat_map['sibling'],
            'badge_text': 'SIBLING SET -15%',
            'is_bestseller': True,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': False,
            'inventory_count': 18,
            'fabric': '60% Organic Belgian Linen, 40% GOTS Cotton Slub',
            'safety_certification': 'Hypoallergenic & Breathable for Outdoor Sunshine',
            'fasteners': 'Hand-Polished Natural Seashell Buttons',
            'care_guide': 'Gentle wash cold. Natural crinkle linen texture requires no ironing.',
            'primary_image': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=80'
            ],
            'age_stage': '2-5Y',
            'available_sizes': ['18-24M', '2T', '3T', '4-5Y', '6-7Y', '8-10Y'],
            'color_swatches': [
                {'name': 'French Lavender Check', 'hex': '#D1C4E9'},
                {'name': 'Meadow Mint Stripe', 'hex': '#C8E6C9'},
                {'name': 'Antique Ecru', 'hex': '#F5F5DC'}
            ],
            'sibling_matching_sku': 'PMK-JUN-005'
        },
        {
            'title': 'Scandi Ribbed Cloud-Soft Pyjama Set',
            'slug': 'scandi-ribbed-cloud-soft-pyjama-set',
            'sku': 'PMK-SLP-004',
            'price': Decimal('38.00'),
            'compare_at_price': None,
            'category': cat_map['organic-basics'],
            'badge_text': 'BEDTIME COMFORT',
            'is_bestseller': True,
            'is_new_arrival': False,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 50,
            'fabric': '95% Organic Bamboo Viscose, 5% Elastane for 4-Way Stretch',
            'safety_certification': 'Class 1 OEKO-TEX Standard / Flame-Retardant Free',
            'fasteners': 'Tagless Heat-Transfer Label / Zero Scratch Seams',
            'care_guide': 'Machine wash cold, delicate cycle. Keeps shape wash after wash.',
            'primary_image': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80'
            ],
            'age_stage': '0-24M',
            'available_sizes': ['6-12M', '12-18M', '2T', '3T', '4T', '5-6Y'],
            'color_swatches': [
                {'name': 'Cloud Vanilla', 'hex': '#FDFBF7'},
                {'name': 'Nordic Eucalyptus', 'hex': '#A2B9A8'},
                {'name': 'Dusty Clay', 'hex': '#D49B89'}
            ],
            'sibling_matching_sku': 'PMK-INF-001'
        },
        {
            'title': 'Junior Explorer Chore Jacket in Organic Twill',
            'slug': 'junior-explorer-chore-jacket-organic-twill',
            'sku': 'PMK-JUN-005',
            'price': Decimal('68.00'),
            'compare_at_price': Decimal('84.00'),
            'category': cat_map['junior'],
            'badge_text': 'HEIRLOOM PIECE',
            'is_bestseller': False,
            'is_new_arrival': True,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 22,
            'fabric': '100% Heavyweight Organic Cotton Twill (310 GSM)',
            'safety_certification': 'Child Safety Certified / Non-Snag Pocket Rivets',
            'fasteners': 'Antiqued Brass Snaps & Deep Treasure Pockets for Rocks & Acorns',
            'care_guide': 'Machine wash cold. Designed to fade beautifully like vintage denim.',
            'primary_image': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=80'
            ],
            'age_stage': '6-12Y',
            'available_sizes': ['6Y', '7Y', '8Y', '10Y', '12Y'],
            'color_swatches': [
                {'name': 'Canopy Forest', 'hex': '#3E503E'},
                {'name': 'Rust Acorn', 'hex': '#B75D3C'},
                {'name': 'Navy Deep', 'hex': '#2C3E50'}
            ],
            'sibling_matching_sku': 'PMK-SIB-003'
        },
        {
            'title': 'The Welcome Baby Keepsake Set & Monogram Bonnet',
            'slug': 'welcome-baby-keepsake-set-monogram-bonnet',
            'sku': 'PMK-GFT-006',
            'price': Decimal('88.00'),
            'compare_at_price': Decimal('110.00'),
            'category': cat_map['baby'],
            'badge_text': 'GIFT BOX INCLUDED',
            'is_bestseller': True,
            'is_new_arrival': False,
            'is_monogrammable': True,
            'extendable_cuffs': True,
            'inventory_count': 19,
            'fabric': '100% Organic Pima Cotton with Hand-Knitted Alpaca Booties',
            'safety_certification': 'Hospital Bag Certified / 100% Breathable & Non-Toxic',
            'fasteners': 'Satin Ribbon Ties & Magnetic Smart Snaps',
            'care_guide': 'Hand wash booties, machine wash wrap and bonnet in keepsake laundry bag.',
            'primary_image': 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=80'
            ],
            'age_stage': '0-24M',
            'available_sizes': ['NEWBORN', '0-3M', '3-6M', '6-12M'],
            'color_swatches': [
                {'name': 'Pearl Marshmallow', 'hex': '#FAF8F5'},
                {'name': 'Honey Oat', 'hex': '#EDE0CE'},
                {'name': 'Pale Lavender', 'hex': '#E6DEED'}
            ],
            'sibling_matching_sku': 'PMK-INF-001'
        }
    ]

    for p_data in products_data:
        existing = KidsProductPage.objects.filter(sku=p_data['sku']).first()
        if existing:
            for key, val in p_data.items():
                setattr(existing, key, val)
            existing.save_revision().publish()
            prod_page = existing
        else:
            prod_page = KidsProductPage(**p_data)
            home_page.add_child(instance=prod_page)
            prod_page.save_revision().publish()

        if not prod_page.reviews.exists():
            KidsProductReview.objects.create(
                product=prod_page,
                parent_name='Sophie & Baby Leo',
                child_age='11 months old',
                rating=5,
                headline='The softest organic fabric my baby has ever worn!',
                comment='Leo has sensitive eczema-prone skin and this pointelle romper has zero scratching. The extendable cuffs are genius—he has been wearing this for 4 months now as he grew!',
                wash_durability='Zero pilling after 20+ machine washes',
                verified_parent=True
            )
            KidsProductReview.objects.create(
                product=prod_page,
                parent_name='Claire Sterling (Mom of 2)',
                child_age='3 years & 8 months',
                rating=5,
                headline='Exceptional durability and stunning personalized embroidery',
                comment='Ordered the sibling matching set with custom monograms for our family portraits. Arrived in a keepsake box with dried lavender and a ribbon. 10/10 quality.',
                wash_durability='Stains came right out on normal cycle',
                verified_parent=True
            )

    print(f"  👗 Seeded {len(products_data)} Kids Apparel Products with Parent Reviews")

    # 5. Announcement Ticker
    KidsAnnouncementTicker.objects.update_or_create(
        promo_code='PETIT25',
        defaults={
            'message': 'Complimentary Organic Cotton Swaddle on Orders Over $95 — Enter Code PETIT25 for 25% Off',
            'countdown_end_date': datetime.now() + timedelta(days=2, hours=18, minutes=30),
            'link_url': '/catalog',
            'is_active': True,
            'sort_order': 1
        }
    )

    # 6. Marketing Banners
    KidsMarketingBanner.objects.update_or_create(
        placement='hero_slider',
        sort_order=1,
        defaults={
            'title': 'MADE FOR PLAY, NAPS & BIG DISCOVERIES',
            'subtitle': 'Heirloom-grade GOTS organic apparel crafted to withstand muddy knees, big laughter, and pass down between siblings.',
            'badge': 'SPRING PLAYBOOK 2026',
            'image_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1800&q=85',
            'cta_text': 'Explore Play-Proof Essentials',
            'cta_link': '/catalog',
            'discount_callout': 'Room-to-Grow Extendable Cuffs on All Pieces',
            'is_active': True,
        }
    )

    KidsMarketingBanner.objects.update_or_create(
        placement='gifting_suite',
        sort_order=2,
        defaults={
            'title': 'THE PERSONALIZED BABY GIFTING STUDIO',
            'subtitle': 'Add bespoke name or initial embroidery in 6 heirloom script fonts. Packaged in our signature keepsake box with a personalized letter.',
            'badge': 'NEWBORN & BIRTHDAY GIFTS',
            'image_url': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1800&q=85',
            'cta_text': 'Design Custom Monogram',
            'cta_link': '/catalog',
            'discount_callout': 'Free Keepsake Box on Orders $100+',
            'is_active': True,
        }
    )

    KidsMarketingBanner.objects.update_or_create(
        placement='exit_offer_popup',
        sort_order=3,
        defaults={
            'title': 'JOIN THE PETIT MAISON PARENTS CLUB',
            'subtitle': 'Enjoy 20% off your inaugural order, birthday milestone gifts for your little ones, and private seasonal pre-access.',
            'badge': 'WELCOME PRIVILEGE',
            'image_url': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=85',
            'cta_text': 'Join Parents Club',
            'cta_link': '#',
            'discount_callout': 'Use Code: PETITCLUB20',
            'is_active': True,
        }
    )
    print("  📢 Seeded Kids Marketing Banners & Announcements")

    # 7. Seed Active Coupons
    coupons = [
        {'code': 'PETIT25', 'description': '25% Off Spring Kids Collection', 'discount_percent': 25, 'min_order_value': Decimal('60.00'), 'is_active': True},
        {'code': 'FIRSTBABY15', 'description': '15% Off Your Inaugural Baby Order', 'discount_percent': 15, 'min_order_value': Decimal('40.00'), 'is_active': True},
        {'code': 'SIBLINGPAIR', 'description': 'Save $20 on Matching Sibling Sets Over $90', 'discount_percent': 0, 'flat_discount_amount': Decimal('20.00'), 'min_order_value': Decimal('90.00'), 'is_active': True},
    ]
    for c in coupons:
        KidsCoupon.objects.update_or_create(code=c['code'], defaults=c)
    print("  🎟️ Seeded Active Kids Coupons")

    # 8. Seed Store Brand Setting
    KidsStoreBrandSetting.objects.update_or_create(
        id=1,
        defaults={
            'brand_name': 'PETIT MAISON KIDS',
            'brand_tagline': 'Organic, Playful & Heirloom Childrenswear (Ages 0 - 12Y)',
            'active_theme': 'theme-nordic-pastel',
            'active_currency': 'INR',
            'allow_customer_currency_switch': True,
            'free_shipping_threshold_inr': Decimal('5999.00'),
            'free_shipping_threshold_usd': Decimal('95.00'),
            'contact_email': 'bonjour@petitmaisonkids.com',
            'support_phone': '+91 98200 54321 / +1 (800) 555-PETIT',
            'announcement_ticker_enabled': True,
            'popup_offer_enabled': True,
        }
    )
    print("  ⚙️ Seeded Kids Store Brand Setting (Default: INR ₹)")

    print("\n✅ PETIT MAISON KIDS database seeded successfully!")

if __name__ == '__main__':
    seed()
