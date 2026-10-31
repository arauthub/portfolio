import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'atelier_backend.settings.dev')
django.setup()

from marketing.models import BrandTenant, MembershipTier, POSRegister, StoreBrandSetting
from catalog.models import ProductPage, LookbookPage
from wagtail.models import Workflow, Task, GroupApprovalTask, WorkflowTask
from django.contrib.auth.models import Group

def run_seed():
    print("--- Seeding Enterprise Features for Atelier Vogue ---")

    # 1. Seed Membership Tiers
    tiers = [
        {
            'tier_type': 'PLUS',
            'name': 'Atelier Plus',
            'badge_label': 'PLUS MEMBER',
            'monthly_price_inr': 999.00,
            'monthly_price_usd': 12.00,
            'annual_price_usd': 119.00,
            'discount_percentage': 10,
            'free_shipping': True,
            'early_access_hours': 24,
            'perks_list': [
                '10% Instant Discount on All Atelier Collections',
                'Complimentary Global Express Courier on All Orders',
                '24-Hour Early Access to Limited Edition Runway Drops',
                'Priority Tailoring & Garment Care Advisory',
                'Exclusive Seasonal Lookbook Look-Ins'
            ],
            'sort_order': 1
        },
        {
            'tier_type': 'PREMIUM',
            'name': 'Atelier Premium',
            'badge_label': 'PREMIUM MEMBER',
            'monthly_price_inr': 2499.00,
            'monthly_price_usd': 29.00,
            'annual_price_usd': 289.00,
            'discount_percentage': 15,
            'free_shipping': True,
            'early_access_hours': 48,
            'perks_list': [
                '15% Instant Member Privilege on Everything',
                'Dedicated 1-on-1 Virtual Stylist via Wagtail AI & Human Concierge',
                'Unlimited Free Returns & In-Store Courier Exchanges',
                'Complimentary Monogramming & Custom Button Selections',
                'Annual Luxury Cashmere Birthday Keepsake Gift Box'
            ],
            'sort_order': 2
        },
        {
            'tier_type': 'VIP',
            'name': 'Atelier VIP Black Tier',
            'badge_label': 'VIP BLACK CONCIERGE',
            'monthly_price_inr': 5999.00,
            'monthly_price_usd': 69.00,
            'annual_price_usd': 699.00,
            'discount_percentage': 25,
            'free_shipping': True,
            'early_access_hours': 72,
            'perks_list': [
                '25% Unrestricted Atelier Discount on All Garments & Gowns',
                'Bespoke Tailoring by Milanese Artisans to Custom Measurements',
                'Access to Private In-Store VIP Lounges (Milan, NYC, Mumbai, Paris)',
                'Personal Runway Invitations & Direct Access to Head Designer',
                'Zero-Interest Split Payment & Dedicated Concierge Phone Line'
            ],
            'sort_order': 3
        }
    ]

    for t_data in tiers:
        tier, created = MembershipTier.objects.update_or_create(
            tier_type=t_data['tier_type'],
            defaults=t_data
        )
        print(f"Membership Tier: {tier.name} ({'Created' if created else 'Updated'})")

    # 2. Seed Hosted Brands (Multi-Brand Fashion Hub)
    brands = [
        {
            'name': 'Atelier Vogue',
            'slug': 'atelier-vogue',
            'tagline': 'Haute Couture Silhouettes & Sustainable Italian Luxury',
            'story': 'Founded in Milan, Atelier Vogue merges architectural draping with regenerative cashmere and ethical botanical dyes.',
            'logo_url': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80',
            'banner_url': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
            'department': 'adult_women',
            'origin_country': 'Italy',
            'founding_year': 2018,
            'subscription_tier': 'ENTERPRISE_VIP',
            'is_promoted': True,
            'promotion_tier': 'HERO_SPOTLIGHT',
            'promoted_badge': 'FLAGSHIP MAISON',
            'brand_primary_color': '#EAD8C0',
            'font_family': 'Playfair Display',
            'sort_order': 1
        },
        {
            'name': 'Petit Maison Kids',
            'slug': 'petit-maison-kids',
            'tagline': 'Organic, Playful & Heirloom Childrenswear (0-12Y)',
            'story': 'Peruvian organic pima cotton, OEKO-TEX certified skin safety, and room-to-grow extendable cuffs for little explorers.',
            'logo_url': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=200&q=80',
            'banner_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=80',
            'department': 'kids',
            'origin_country': 'France',
            'founding_year': 2021,
            'subscription_tier': 'ENTERPRISE_VIP',
            'is_promoted': True,
            'promotion_tier': 'FEATURED_COLLECTION',
            'promoted_badge': 'HEIRLOOM KIDS',
            'brand_primary_color': '#D8A48F',
            'font_family': 'Cormorant Garamond',
            'sort_order': 2
        },
        {
            'name': 'Verve Studio Milan',
            'slug': 'verve-studio-milan',
            'tagline': 'Avant-Garde Tailored Neo-Streetwear',
            'story': 'Deconstructed tailoring crafted from deadstock Japanese selvedge denim and technical silk ripstop.',
            'logo_url': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&q=80',
            'banner_url': 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=1600&q=80',
            'department': 'unisex',
            'origin_country': 'Italy',
            'founding_year': 2023,
            'subscription_tier': 'GROWTH',
            'is_promoted': True,
            'promotion_tier': 'FEATURED_COLLECTION',
            'promoted_badge': 'SPONSORED DESIGNER',
            'brand_primary_color': '#10B981',
            'font_family': 'Montserrat',
            'sort_order': 3
        },
        {
            'name': 'Loom & Silk Heritage',
            'slug': 'loom-silk-heritage',
            'tagline': 'Hand-Spun Mulberry Silk & Royal Zari Weaves',
            'story': 'Centuries-old artisanal Banarasi and Chanderi weaving techniques reimagined into fluid modern evening wear.',
            'logo_url': 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80',
            'banner_url': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=80',
            'department': 'adult_women',
            'origin_country': 'India',
            'founding_year': 2019,
            'subscription_tier': 'GROWTH',
            'is_promoted': False,
            'promotion_tier': 'STANDARD',
            'promoted_badge': 'ARTISAN GUILD',
            'brand_primary_color': '#C19A6B',
            'font_family': 'Cinzel',
            'sort_order': 4
        }
    ]

    for b_data in brands:
        brand, created = BrandTenant.objects.update_or_create(
            slug=b_data['slug'],
            defaults=b_data
        )
        print(f"Brand Tenant: {brand.name} ({'Created' if created else 'Updated'})")

    # 3. Seed In-Store POS Registers
    registers = [
        {
            'register_code': 'POS-MIL-01',
            'store_name': 'Atelier Flagship Via Monte Napoleone',
            'city': 'Milan',
            'country': 'Italy',
            'cashier_active': 'Matteo Rossi',
            'currency': 'EUR'
        },
        {
            'register_code': 'POS-NYC-02',
            'store_name': 'Atelier Madison Avenue Maison',
            'city': 'New York',
            'country': 'United States',
            'cashier_active': 'Elena Vance',
            'currency': 'USD'
        },
        {
            'register_code': 'POS-BOM-03',
            'store_name': 'Atelier Bandra West Flagship Studio',
            'city': 'Mumbai',
            'country': 'India',
            'cashier_active': 'Priya Sharma',
            'currency': 'INR'
        }
    ]

    for r_data in registers:
        reg, created = POSRegister.objects.update_or_create(
            register_code=r_data['register_code'],
            defaults=r_data
        )
        print(f"POS Register: {reg.register_code} ({'Created' if created else 'Updated'})")

    # 4. Seed Barcodes and Brands for Products
    products = ProductPage.objects.all()
    sample_barcodes = [
        '890123450001', '890123450002', '890123450003', '890123450004',
        '890123450005', '890123450006', '890123450007', '890123450008',
        '890123450009', '890123450010', '890123450011', '890123450012'
    ]

    for idx, p in enumerate(products):
        p.barcode = sample_barcodes[idx % len(sample_barcodes)]
        p.brand_name = 'Atelier Vogue' if idx % 3 != 0 else 'Verve Studio Milan'
        p.department = 'adults'
        if p.inventory_count == 0 or p.inventory_count is None:
            p.inventory_count = random.randint(12, 45)
        p.save()
        print(f"Product {p.sku}: Barcode {p.barcode}, Stock {p.inventory_count}")

    # 5. Set up Wagtail Workflows
    try:
        editors_group, _ = Group.objects.get_or_create(name='Fashion Editors & Stylists')
        directors_group, _ = Group.objects.get_or_create(name='Brand Creative Directors')

        task1, _ = GroupApprovalTask.objects.get_or_create(
            name='Lead Stylist Editorial & Quality Review'
        )
        task1.groups.add(editors_group)

        task2, _ = GroupApprovalTask.objects.get_or_create(
            name='Creative Brand Director Final Publication'
        )
        task2.groups.add(directors_group)

        workflow, _ = Workflow.objects.get_or_create(
            name='Haute Couture Editorial Moderation Workflow',
            defaults={'active': True}
        )

        WorkflowTask.objects.get_or_create(workflow=workflow, task=task1, sort_order=1)
        WorkflowTask.objects.get_or_create(workflow=workflow, task=task2, sort_order=2)
        print("Configured Wagtail Workflows with 2-stage Moderation Tasks.")
    except Exception as e:
        print(f"Note on workflow setup: {e}")

    # 6. Update StoreBrandSetting defaults
    setting = StoreBrandSetting.load()
    setting.d3_animation_style = 'silk_flow'
    setting.brand_font_family = 'Playfair Display'
    setting.store_subscription_level = 'ENTERPRISE_VIP'
    setting.ai_assistant_enabled = True
    setting.instore_pos_enabled = True
    setting.barcode_scanner_enabled = True
    setting.multi_brand_mode = True
    setting.save()
    print("StoreBrandSetting updated with Enterprise Omnichannel switches.")

    print("--- Seed Completed Successfully! ---")

if __name__ == '__main__':
    run_seed()
