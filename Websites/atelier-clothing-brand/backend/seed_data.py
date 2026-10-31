#!/usr/bin/env python
"""
Seed script for ATELIER VOGUE Luxury E-Commerce platform.
Populates realistic high-fashion clothing catalog, marketing banners,
announcements, lookbooks, coupons, and Wagtail admin settings.
"""

import os
import django
from decimal import Decimal
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'atelier_backend.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from wagtail.models import Page, Site
from catalog.models import ProductCategory, ProductPage, ProductReview, LookbookPage
from marketing.models import AnnouncementTicker, MarketingBanner, Coupon, StoreBrandSetting

User = get_user_model()

def seed():
    print("✨ Seeding Atelier Vogue platform...")

    # 1. Ensure Superuser exists
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@ateliervogue.com', 'atelier2026!')
        print("  👤 Created Superuser: admin / atelier2026!")
    else:
        print("  👤 Superuser 'admin' already exists.")

    # 2. Setup Site Root
    root_page = Page.objects.filter(depth=1).first()
    if not root_page:
        root_page = Page.add_root(title="Root")

    home_page = Page.objects.filter(depth=2).first()
    if not home_page:
        home_page = Page(title="Atelier Vogue Home", slug="home")
        root_page.add_child(instance=home_page)
        home_page.save_revision().publish()

    site = Site.objects.filter(is_default_site=True).first()
    if not site:
        Site.objects.create(hostname='localhost', port=8000, root_page=home_page, is_default_site=True, site_name='Atelier Vogue')

    # 3. Create Categories
    categories_data = [
        {
            'name': 'Outerwear & Tailoring',
            'slug': 'outerwear',
            'description': 'Architectural overcoats, structured blazers, and trench capes cut from Italian wools.',
            'image_url': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 1,
        },
        {
            'name': 'Silk Gowns & Evening',
            'slug': 'evening-wear',
            'description': 'Fluid mulberry silk gowns, sculpted corsetry, and dramatic red carpet silhouettes.',
            'image_url': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 2,
        },
        {
            'name': 'Architectural Knitwear',
            'slug': 'knitwear',
            'description': 'Featherlight baby alpaca and 100% regenerative Mongolian cashmere jumpers.',
            'image_url': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 3,
        },
        {
            'name': 'Artisanal Essentials',
            'slug': 'essentials',
            'description': 'Habotai silk shirts, structured pleated trousers, and organic supima tees.',
            'image_url': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
            'featured': True,
            'sort_order': 4,
        },
        {
            'name': 'Leather & Accessories',
            'slug': 'accessories',
            'description': 'Handcrafted vegetable-tanned Tuscan leather bags, hardware cuffs, and silk twill scarves.',
            'image_url': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
            'featured': False,
            'sort_order': 5,
        },
    ]

    cat_map = {}
    for c_data in categories_data:
        cat, _ = ProductCategory.objects.update_or_create(
            slug=c_data['slug'],
            defaults=c_data
        )
        cat_map[c_data['slug']] = cat
    print(f"  👗 Seeded {len(cat_map)} Categories")

    # 4. Create Luxury Clothing Products
    products_data = [
        {
            'title': 'The Milanese Double-Faced Cashmere Trench',
            'slug': 'milanese-double-faced-cashmere-trench',
            'sku': 'AV-OTR-001',
            'price': Decimal('890.00'),
            'compare_at_price': Decimal('1150.00'),
            'category': cat_map['outerwear'],
            'badge_text': 'RUNWAY EXCLUSIVE',
            'is_bestseller': True,
            'is_new_arrival': True,
            'inventory_count': 14,
            'fabric': '100% Regenerative Mongolian Cashmere (Double-Faced 520 GSM)',
            'fit': 'Tailored Relaxed Drop-Shoulder Trench Silhouette',
            'sustainability_rating': 'Grade A+ Certified Organic Traceable Fiber',
            'care_guide': 'Specialist dry clean only. Store on wide contour cedar hanger.',
            'primary_image': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80'
            ],
            'available_sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'color_swatches': [
                {'name': 'Camel Royale', 'hex': '#C19A6B'},
                {'name': 'Obsidian Noir', 'hex': '#1A1A1A'},
                {'name': 'Slate Melange', 'hex': '#707070'}
            ],
            'paired_outfit_skus': ['AV-ACC-006', 'AV-ESS-004']
        },
        {
            'title': 'Sculpted Hourglass Wool Blazer',
            'slug': 'sculpted-hourglass-wool-blazer',
            'sku': 'AV-OTR-002',
            'price': Decimal('540.00'),
            'compare_at_price': Decimal('680.00'),
            'category': cat_map['outerwear'],
            'badge_text': 'NEW SEASON',
            'is_bestseller': True,
            'is_new_arrival': True,
            'inventory_count': 22,
            'fabric': '100% Virgin Worsted Wool with Bemberg Cupro Lining',
            'fit': 'Couture Cinched Waist with Padded Sharp Peak Lapels',
            'sustainability_rating': 'Zero-Waste Cutting Pattern / Certified RWS Wool',
            'care_guide': 'Dry clean only. Gentle steam press.',
            'primary_image': 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80'
            ],
            'available_sizes': ['XS', 'S', 'M', 'L'],
            'color_swatches': [
                {'name': 'Midnight Obsidian', 'hex': '#0D0D11'},
                {'name': 'Ivory Bone', 'hex': '#F2EFE9'},
                {'name': 'Pinstripe Charcoal', 'hex': '#2C2F33'}
            ],
            'paired_outfit_skus': ['AV-ESS-004', 'AV-ACC-006']
        },
        {
            'title': 'Pleated Halter Silk Chiffon Evening Gown',
            'slug': 'pleated-halter-silk-evening-gown',
            'sku': 'AV-EVN-003',
            'price': Decimal('1180.00'),
            'compare_at_price': None,
            'category': cat_map['evening-wear'],
            'badge_text': 'HAUTE COUTURE',
            'is_bestseller': False,
            'is_new_arrival': True,
            'inventory_count': 8,
            'fabric': '100% Pure Mulberry Silk Chiffon with Micro-Accordion Pleating',
            'fit': 'Fluid Draped Bodice with Floor-Sweeping Cascading Train',
            'sustainability_rating': 'Hand-Dyed with Botanical Minerals',
            'care_guide': 'Delicate couture dry clean. Store in breathable garment bag.',
            'primary_image': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80'
            ],
            'available_sizes': ['XS', 'S', 'M'],
            'color_swatches': [
                {'name': 'Champagne Aura', 'hex': '#EAD8C0'},
                {'name': 'Emerald Depths', 'hex': '#0A3B2A'},
                {'name': 'Crimson Velvet', 'hex': '#7A1F2D'}
            ],
            'paired_outfit_skus': ['AV-ACC-006']
        },
        {
            'title': 'Oversized Ribbed Baby Alpaca Turtleneck',
            'slug': 'oversized-ribbed-baby-alpaca-turtleneck',
            'sku': 'AV-KNT-004',
            'price': Decimal('360.00'),
            'compare_at_price': Decimal('420.00'),
            'category': cat_map['knitwear'],
            'badge_text': 'BESTSELLER',
            'is_bestseller': True,
            'is_new_arrival': False,
            'inventory_count': 30,
            'fabric': '70% Peruvian Baby Alpaca, 30% Fine Merino Wool',
            'fit': 'Architectural Dropped Shoulder with Chunky Fold-Over Collar',
            'sustainability_rating': 'Cruelty-Free Ethical Shearing / OEKO-TEX Certified',
            'care_guide': 'Hand wash in cold water with wool balm. Dry flat on towels.',
            'primary_image': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
            ],
            'available_sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'color_swatches': [
                {'name': 'Oatmeal Heather', 'hex': '#D8D0C5'},
                {'name': 'Sage Moss', 'hex': '#8A9A86'},
                {'name': 'Burnt Terracotta', 'hex': '#A6533F'}
            ],
            'paired_outfit_skus': ['AV-OTR-001', 'AV-ACC-006']
        },
        {
            'title': 'Artisanal Silk Habotai Fluid Shirt',
            'slug': 'artisanal-silk-habotai-fluid-shirt',
            'sku': 'AV-ESS-005',
            'price': Decimal('280.00'),
            'compare_at_price': None,
            'category': cat_map['essentials'],
            'badge_text': 'LIMITED 100 PCS',
            'is_bestseller': False,
            'is_new_arrival': True,
            'inventory_count': 18,
            'fabric': '100% Sandwashed Silk Habotai (Mother of Pearl Buttons)',
            'fit': 'Relaxed Camp Collar Cut with Extended Barrel Cuffs',
            'sustainability_rating': 'Closed-Loop Water Recycling Wash Process',
            'care_guide': 'Hand wash cold or eco dry clean.',
            'primary_image': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80'
            ],
            'available_sizes': ['XS', 'S', 'M', 'L', 'XL'],
            'color_swatches': [
                {'name': 'Pearl Lustre', 'hex': '#F4F1EA'},
                {'name': 'French Truffle', 'hex': '#4A3B32'},
                {'name': 'Eucalyptus', 'hex': '#73867B'}
            ],
            'paired_outfit_skus': ['AV-OTR-002', 'AV-ACC-006']
        },
        {
            'title': 'The Sovereign Tuscan Leather Frame Bag',
            'slug': 'sovereign-tuscan-leather-frame-bag',
            'sku': 'AV-ACC-006',
            'price': Decimal('780.00'),
            'compare_at_price': Decimal('920.00'),
            'category': cat_map['accessories'],
            'badge_text': 'ARTISANAL ICON',
            'is_bestseller': True,
            'is_new_arrival': False,
            'inventory_count': 12,
            'fabric': 'Full Grain Vegetable-Tanned Italian Calfskin with 24K Gold Clasp',
            'fit': 'Structured Trapezoid Frame with Detachable Crossbody Strap',
            'sustainability_rating': 'Leather Working Group Gold Standard Tanneries',
            'care_guide': 'Wipe with soft cotton cloth. Apply organic leather balm bi-annually.',
            'primary_image': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
            'hover_image': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
            'extra_images': [
                'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80'
            ],
            'available_sizes': ['ONE SIZE'],
            'color_swatches': [
                {'name': 'Cognac Cuoio', 'hex': '#8B4513'},
                {'name': 'Obsidian Gloss', 'hex': '#1C1C1C'},
                {'name': 'Bordeaux Plum', 'hex': '#581825'}
            ],
            'paired_outfit_skus': ['AV-OTR-001', 'AV-OTR-002']
        }
    ]

    for p_data in products_data:
        existing = ProductPage.objects.filter(sku=p_data['sku']).first()
        if existing:
            for key, val in p_data.items():
                setattr(existing, key, val)
            existing.save_revision().publish()
            prod_page = existing
        else:
            prod_page = ProductPage(**p_data)
            home_page.add_child(instance=prod_page)
            prod_page.save_revision().publish()

        # Add sample reviews
        if not prod_page.reviews.exists():
            ProductReview.objects.create(
                product=prod_page,
                author_name='Camille de Vane',
                rating=5,
                headline='Exceptional craftsmanship rivaling Rue Saint-Honoré',
                comment='The weight of the material and tailoring precision is extraordinary. The drape has an unmistakable couture fluidness.',
                fit_feedback='True to size',
                verified_purchase=True
            )
            ProductReview.objects.create(
                product=prod_page,
                author_name='Marcus Sterling',
                rating=5,
                headline='Sublime luxury and sustainable execution',
                comment='Arrived in museum-quality unboxing packaging. The stitching density and finishing are impeccable.',
                fit_feedback='True to size',
                verified_purchase=True
            )

    print(f"  🧥 Seeded {len(products_data)} Luxury Products with Reviews")

    # 5. Seed Announcement Ticker
    AnnouncementTicker.objects.update_or_create(
        promo_code='VOGUE25',
        defaults={
            'message': 'Complimentary Global Express Courier on All Orders Over $250 — Enter Code VOGUE25 for 25% Off',
            'countdown_end_date': datetime.now() + timedelta(days=3, hours=14, minutes=45),
            'link_url': '/catalog',
            'is_active': True,
            'sort_order': 1
        }
    )

    # 6. Seed Marketing Banners (Hero, Editorial, Popup)
    MarketingBanner.objects.update_or_create(
        placement='hero_slider',
        sort_order=1,
        defaults={
            'title': 'THE ARCHITECTURAL WINTER CAPSULE',
            'subtitle': 'Double-faced cashmere silhouettes & sculptural Italian tailoring designed for the discerning aesthetic.',
            'badge': 'FALL / WINTER 2026',
            'image_url': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85',
            'cta_text': 'Discover The Collection',
            'cta_link': '/catalog',
            'discount_callout': 'Limited Production of 100 Pieces Worldwide',
            'is_active': True,
        }
    )

    MarketingBanner.objects.update_or_create(
        placement='mid_editorial',
        sort_order=2,
        defaults={
            'title': 'MINIMALISM MEETS HAUTE SAVOIR-FAIRE',
            'subtitle': 'Every seam is considered. Every fiber is traceable. Handcrafted by master artisans in Lombardy.',
            'badge': 'SUSTAINABLE LUXURY',
            'image_url': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=85',
            'cta_text': 'Read Our Sustainability Manifesto',
            'cta_link': '/sustainability',
            'discount_callout': 'Certified Regenerative Materials',
            'is_active': True,
        }
    )

    MarketingBanner.objects.update_or_create(
        placement='exit_offer_popup',
        sort_order=3,
        defaults={
            'title': 'JOIN THE ATELIER PRIVÉ CIRCLE',
            'subtitle': 'Enjoy 20% off your inaugural couture piece, personal styling concierge access, and private runway previews.',
            'badge': 'EXCLUSIVE INVITATION',
            'image_url': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
            'cta_text': 'Claim Private Privilege',
            'cta_link': '#',
            'discount_callout': 'Use Code: ATELIER20',
            'is_active': True,
        }
    )
    print("  📢 Seeded Marketing Banners & Announcements")

    # 7. Seed Active Coupons
    coupons = [
        {'code': 'VOGUE25', 'description': '25% Off Luxury Runway Collection', 'discount_percent': 25, 'min_order_value': Decimal('150.00'), 'is_active': True},
        {'code': 'WELCOME15', 'description': '15% Off Your First Atelier Order', 'discount_percent': 15, 'min_order_value': Decimal('100.00'), 'is_active': True},
        {'code': 'VIPLUXE', 'description': 'VIP $100 Flat Voucher for Orders Over $500', 'discount_percent': 0, 'flat_discount_amount': Decimal('100.00'), 'min_order_value': Decimal('500.00'), 'is_active': True},
    ]
    for c in coupons:
        Coupon.objects.update_or_create(code=c['code'], defaults=c)
    print("  🎟️ Seeded Active Coupons")

    # 8. Seed Store Brand Setting
    StoreBrandSetting.objects.update_or_create(
        id=1,
        defaults={
            'brand_name': 'ATELIER VOGUE',
            'brand_tagline': 'Haute Couture Silhouettes & Regenerative Modern Luxury',
            'active_theme': 'luxe_monochrome',
            'active_currency': 'INR',
            'allow_customer_currency_switch': True,
            'free_shipping_threshold_inr': Decimal('15000.00'),
            'free_shipping_threshold_usd': Decimal('250.00'),
            'contact_email': 'concierge@ateliervogue.com',
            'support_phone': '+91 98200 12345 / +1 (800) 840-VOGUE',
            'announcement_ticker_enabled': True,
            'popup_offer_enabled': True,
        }
    )
    print("  ⚙️ Seeded Store Brand Setting (Default: INR ₹)")

    print("\n✅ ATELIER VOGUE platform data seeded successfully!")

if __name__ == '__main__':
    seed()
