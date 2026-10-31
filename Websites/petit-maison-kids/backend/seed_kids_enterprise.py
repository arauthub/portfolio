import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petit_backend.settings.dev')
django.setup()

from marketing.models import KidsBrandTenant, KidsMembershipTier, KidsPOSRegister, KidsStoreBrandSetting
from catalog.models import KidsProductPage
from wagtail.models import Workflow, Task, GroupApprovalTask, WorkflowTask
from django.contrib.auth.models import Group

def run_seed():
    print("--- Seeding Enterprise Features for Petit Maison Kids ---")

    # 1. Membership Tiers
    tiers = [
        {
            'tier_type': 'PLUS',
            'name': 'Petit Plus Parent',
            'badge_label': 'PETIT PLUS',
            'monthly_price_inr': 599.00,
            'monthly_price_usd': 8.00,
            'annual_price_usd': 79.00,
            'discount_percentage': 10,
            'free_shipping': True,
            'early_access_hours': 24,
            'perks_list': [
                '10% Off All Organic Baby & Toddler Collections',
                'Complimentary Eco Nursery Express Courier Delivery',
                '24-Hour Early Drop Access for Seasonal Capsules',
                'Milestone Growth Advisory & Sizing Support'
            ],
            'sort_order': 1
        },
        {
            'tier_type': 'PREMIUM',
            'name': 'Heirloom Gold Club',
            'badge_label': 'HEIRLOOM GOLD',
            'monthly_price_inr': 1499.00,
            'monthly_price_usd': 19.00,
            'annual_price_usd': 189.00,
            'discount_percentage': 15,
            'free_shipping': True,
            'early_access_hours': 48,
            'perks_list': [
                '15% Off Everything Across the Store',
                'Complimentary Embroidered Monogramming on All Rompers & Blankets',
                'Free Seasonal Nursery Keepsake Box',
                'Dedicated 1-on-1 AI & Human Nursery Stylist Concierge'
            ],
            'sort_order': 2
        },
        {
            'tier_type': 'VIP',
            'name': 'Petit VIP Family Circle',
            'badge_label': 'VIP FAMILY CIRCLE',
            'monthly_price_inr': 3499.00,
            'monthly_price_usd': 45.00,
            'annual_price_usd': 450.00,
            'discount_percentage': 25,
            'free_shipping': True,
            'early_access_hours': 72,
            'perks_list': [
                '25% Unrestricted Discount on Heirloom Occasion & Everyday Basics',
                'Bespoke Hand-Monogramming & Custom Organic Sibling Sets',
                'In-Store Paris/London/NYC Boutique Nursery Lounge Access',
                'Zero-Interest Split Payment & Dedicated Childcare Concierge'
            ],
            'sort_order': 3
        }
    ]

    for t in tiers:
        tier, created = KidsMembershipTier.objects.update_or_create(
            tier_type=t['tier_type'],
            defaults=t
        )
        print(f"Kids Membership: {tier.name} ({'Created' if created else 'Updated'})")

    # 2. Seed Brands
    brands = [
        {
            'name': 'Petit Maison Kids',
            'slug': 'petit-maison-kids',
            'tagline': 'Organic, Playful & Heirloom Childrenswear (0-12Y)',
            'story': 'Heirloom garments crafted from pure organic cotton with Room-to-Grow cuffs.',
            'logo_url': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&auto=format&fit=crop&q=80',
            'banner_url': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1600&auto=format&fit=crop&q=80',
            'origin_country': 'France',
            'founding_year': 2021,
            'subscription_tier': 'ENTERPRISE_VIP',
            'is_promoted': True,
            'promotion_tier': 'HERO_SPOTLIGHT',
            'promoted_badge': 'FLAGSHIP NURSERY',
            'brand_primary_color': '#D8A48F',
            'font_family': 'Cormorant Garamond',
            'sort_order': 1
        },
        {
            'name': 'Atelier Vogue Mini',
            'slug': 'atelier-vogue-mini',
            'tagline': 'Miniature Milanese Cashmere & Tailored Occasion',
            'story': 'Scaled-down couture pieces mirroring Atelier parent silhouettes.',
            'logo_url': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80',
            'banner_url': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
            'origin_country': 'Italy',
            'founding_year': 2022,
            'subscription_tier': 'ENTERPRISE_VIP',
            'is_promoted': True,
            'promotion_tier': 'FEATURED_COLLECTION',
            'promoted_badge': 'MINI COUTURE',
            'brand_primary_color': '#EAD8C0',
            'font_family': 'Playfair Display',
            'sort_order': 2
        }
    ]

    for b in brands:
        brand, created = KidsBrandTenant.objects.update_or_create(
            slug=b['slug'],
            defaults=b
        )
        print(f"Kids Brand: {brand.name} ({'Created' if created else 'Updated'})")

    # 3. Seed POS Registers
    registers = [
        {
            'register_code': 'POS-PAR-01',
            'store_name': 'Petit Maison Nursery Boutique Saint-Germain',
            'city': 'Paris',
            'country': 'France',
            'cashier_active': 'Camille Laurent',
            'currency': 'EUR'
        },
        {
            'register_code': 'POS-NYC-KIDS-02',
            'store_name': 'Petit Maison Soho Nursery Studio',
            'city': 'New York',
            'country': 'United States',
            'cashier_active': 'Chloe Adams',
            'currency': 'USD'
        }
    ]

    for r in registers:
        reg, created = KidsPOSRegister.objects.update_or_create(
            register_code=r['register_code'],
            defaults=r
        )
        print(f"Kids POS: {reg.register_code} ({'Created' if created else 'Updated'})")

    # 4. Barcodes for Kids Products
    products = KidsProductPage.objects.all()
    sample_barcodes = [
        '890987650001', '890987650002', '890987650003', '890987650004',
        '890987650005', '890987650006', '890987650007', '890987650008',
        '890987650009', '890987650010', '890987650011', '890987650012',
        '890987650013', '890987650014'
    ]

    for idx, p in enumerate(products):
        p.barcode = sample_barcodes[idx % len(sample_barcodes)]
        p.brand_name = 'Petit Maison Kids' if idx % 2 == 0 else 'Atelier Vogue Mini'
        p.department = 'kids'
        if p.inventory_count == 0 or p.inventory_count is None:
            p.inventory_count = random.randint(15, 60)
        p.save()
        print(f"Kids Product {p.sku}: Barcode {p.barcode}, Stock {p.inventory_count}")

    # 5. Workflows
    try:
        safety_group, _ = Group.objects.get_or_create(name='Kids Safety Officers')
        task, _ = GroupApprovalTask.objects.get_or_create(name='OEKO-TEX Class 1 Infant Safety Audit')
        task.groups.add(safety_group)
        wf, _ = Workflow.objects.get_or_create(name='Childrenswear Safety & Editorial Workflow', defaults={'active': True})
        WorkflowTask.objects.get_or_create(workflow=wf, task=task, sort_order=1)
        print("Configured Petit Maison Wagtail Safety Workflows.")
    except Exception as e:
        print(f"Workflow note: {e}")

    # 6. Store setting defaults
    setting = KidsStoreBrandSetting.load()
    setting.d3_animation_style = 'silk_flow'
    setting.brand_font_family = 'Cormorant Garamond'
    setting.store_subscription_level = 'ENTERPRISE_VIP'
    setting.ai_assistant_enabled = True
    setting.instore_pos_enabled = True
    setting.barcode_scanner_enabled = True
    setting.multi_brand_mode = True
    setting.save()
    print("KidsStoreBrandSetting updated with Enterprise Omnichannel switches.")

    print("--- Kids Seed Completed Successfully! ---")

if __name__ == '__main__':
    run_seed()
