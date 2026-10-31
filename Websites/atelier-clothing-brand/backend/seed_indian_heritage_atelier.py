import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'atelier_backend.settings.dev')
django.setup()

from wagtail.models import Page
from catalog.models import ProductCategory, ProductPage, ProductReview
from marketing.models import StoreBrandSetting, AnnouncementTicker, MarketingBanner, Coupon

def run():
    print("=== Populating Royal Indian Haute Couture Catalog (Atelier Riwayat) ===")

    # 1. Update Store Brand Settings
    setting = StoreBrandSetting.load()
    setting.brand_name = "ATELIER RIWAYAT"
    setting.brand_tagline = "Royal Indian Haute Couture, Banarasi Handlooms & Regal Festive Heirlooms"
    setting.active_currency = "INR"
    setting.allow_customer_currency_switch = True
    setting.free_shipping_threshold_inr = 15000.00
    setting.free_shipping_threshold_usd = 180.00
    setting.contact_email = "concierge@atelierriwayat.com"
    setting.support_phone = "+91 (022) 2284-9000 / +91 98200 88888"
    setting.save()
    print("✓ Updated StoreBrandSetting to ATELIER RIWAYAT (Default INR)")

    # 2. Announcement Tickers (Indian Festive Luxury)
    AnnouncementTicker.objects.all().delete()
    tickers_data = [
        ("Festive Sovereign Edit — Complimentary Royal Express Delivery on Orders Over ₹15,000", "UTSAV25", 1),
        ("Handcrafted by Master Zari Weavers of Varanasi & Kutch — Use Code RIWAYAT15 for 15% Off", "RIWAYAT15", 2),
        ("Bespoke Bridal Consultations now open at Kala Ghoda, Mumbai & Mehrauli, Delhi Boutiques", "BRIDAL2026", 3),
    ]
    for msg, code, order in tickers_data:
        AnnouncementTicker.objects.create(message=msg, promo_code=code, sort_order=order, is_active=True)
    print("✓ Created Indian Festive Announcement Tickers")

    # 3. Coupons
    Coupon.objects.all().delete()
    coupons = [
        {"code": "UTSAV25", "description": "Royal Festive 25% Off Celebration", "discount_percent": 25, "min_order_value": 15000.00},
        {"code": "RIWAYAT15", "description": "Welcome 15% Off on Handloom Heirlooms", "discount_percent": 15, "min_order_value": 9999.00},
        {"code": "BRIDAL5000", "description": "Flat ₹5,000 Off on Bespoke Bridal Couture", "discount_percent": 0, "flat_discount_amount": 5000.00, "min_order_value": 50000.00},
    ]
    for c in coupons:
        Coupon.objects.create(
            code=c["code"],
            description=c["description"],
            discount_percent=c["discount_percent"],
            flat_discount_amount=c.get("flat_discount_amount", 0.00),
            min_order_value=c["min_order_value"],
            is_active=True
        )
    print("✓ Created Festive Coupons (UTSAV25, RIWAYAT15, BRIDAL5000)")

    # 4. Product Categories
    categories_spec = [
        {"name": "Royal Banarasi & Handloom Sarees", "slug": "royal-sarees", "desc": "Authentic Katan silk, gold zari brocades and kadwa weave handlooms from Kashi.", "order": 1},
        {"name": "Bridal & Festive Lehengas", "slug": "bridal-lehengas", "desc": "Hand-embroidered zardozi, gotapatti and fine dabka on pure mulberry raw silk & velvet.", "order": 2},
        {"name": "Nawabi Sherwanis & Bandhgalas", "slug": "nawabi-menswear", "desc": "Bespoke Awadhi raw silk sherwanis, embroidered bandhgalas and Chanderi kurtas.", "order": 3},
        {"name": "Tissue Anarkalis & Angrakhas", "slug": "anarkalis-angrakhas", "desc": "Ethereal Chanderi tissue, gotta patti drapes and Kalidar silhouettes for celebrations.", "order": 4},
        {"name": "Royal Potlis, Mojris & Jewels", "slug": "royal-accessories", "desc": "Zari-embroidered velvet batwas, hand-tooled Marwari mojris and heirloom Polki jewelry.", "order": 5},
    ]
    cat_objs = {}
    for c in categories_spec:
        obj, _ = ProductCategory.objects.update_or_create(
            slug=c["slug"],
            defaults={"name": c["name"], "description": c["desc"], "sort_order": c["order"], "featured": True}
        )
        cat_objs[c["slug"]] = obj
    print("✓ Created 5 Royal Indian Categories")

    # 5. Clear and create 12 Rich Indian Haute Couture Products
    Page.fix_tree()
    home_page = Page.objects.filter(depth=2).first()
    if not home_page:
        home_page = Page.objects.first()

    indian_catalog = [
        {
            "title": "The Noor-e-Kashi Pure Banarasi Katan Silk Saree",
            "slug": "noor-e-kashi-banarasi-katan-silk-saree",
            "sku": "AR-SAR-001",
            "price": 38500.00,
            "compare_at_price": 45000.00,
            "category": cat_objs["royal-sarees"],
            "badge_text": "GI TAGGED KASHI WEAVE",
            "is_bestseller": True,
            "is_new_arrival": True,
            "inventory_count": 14,
            "fabric": "100% Pure Mulberry Katan Silk with Real Tested Gold & Silver Zari (Kadwa Weave)",
            "fit": "6.5 Metres Drape with Running Unstitched Brocade Blouse Piece",
            "sustainability_rating": "Master Weaver Guild Certified • 180 Hours Handloom Weave",
            "care_guide": "Strictly Dry Clean Only. Wrap in pure unbleached muslin with neem leaves. Do not spray perfumes directly on zari.",
            "primary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Radhika Singhania", "comment": "The gold zari sheen is truly majestic. Wore this for my sister's Sangeet in Udaipur and received endless compliments.", "fit": "True to drape"}
            ]
        },
        {
            "title": "The Begum Zardozi Crimson Velvet Bridal Lehenga",
            "slug": "begum-zardozi-crimson-velvet-bridal-lehenga",
            "sku": "AR-LHG-002",
            "price": 185000.00,
            "compare_at_price": 220000.00,
            "category": cat_objs["bridal-lehengas"],
            "badge_text": "ROYAL BRIDAL COUTURE",
            "is_bestseller": True,
            "is_new_arrival": True,
            "inventory_count": 5,
            "fabric": "Micro-Velvet & Pure Organza with Antique Zardozi, Semi-Precious Stones & Dabka Embroidery",
            "fit": "16-Kali Flared Skirt (4.5 Metre Ghera) with Double Dupatta Styling",
            "sustainability_rating": "Crafted by 8 Master Artisans over 420 Needlework Hours",
            "care_guide": "Preserve in archival cedar wooden chest. Professional bridal dry clean only.",
            "primary_image": "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Meera Kapoor-Bansal", "comment": "My dream wedding lehenga. The weight balance is exceptional despite the dense zardozi. It felt like heirloom royalty.", "fit": "Custom Bespoke"}
            ]
        },
        {
            "title": "The Awadhi Shahi Raw Silk Embroidered Sherwani",
            "slug": "awadhi-shahi-raw-silk-sherwani",
            "sku": "AR-MEN-003",
            "price": 68500.00,
            "compare_at_price": 82000.00,
            "category": cat_objs["nawabi-menswear"],
            "badge_text": "NAWABI BESPOKE",
            "is_bestseller": True,
            "is_new_arrival": False,
            "inventory_count": 8,
            "fabric": "100% Hand-Spun Bhagalpuri Raw Silk with Tone-on-Tone Resham & Marori Embroidery",
            "fit": "Structured Royal Bandhgala Cut with Concealed Placket & Gold Gilt Buttons",
            "sustainability_rating": "Ahisma Silk Certified • Hand-tailored in Lucknow Atelier",
            "care_guide": "Specialist dry clean only. Store on wide contoured cedar hanger with cotton garment bag.",
            "primary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Devraj Rathore", "comment": "The fit and regal drape are impeccable. Looked dignified and sharp for the royal palace reception.", "fit": "Flawless"}
            ]
        },
        {
            "title": "The Gulabi Chanderi Tissue Hand-Embroidered Anarkali",
            "slug": "gulabi-chanderi-tissue-anarkali",
            "sku": "AR-ANK-004",
            "price": 28500.00,
            "compare_at_price": 35000.00,
            "category": cat_objs["anarkalis-angrakhas"],
            "badge_text": "CHANDERI HERITAGE",
            "is_bestseller": True,
            "is_new_arrival": True,
            "inventory_count": 16,
            "fabric": "Pure Chanderi Silk Tissue with Mukesh Detailing, Gotapatti Border & Mulberry Silk Lining",
            "fit": "Floor-Length 28-Kali Flared Anarkali with Churidhar & Sheer Organza Dupatta",
            "sustainability_rating": "Traditional Handloom Weavers Society of Madhya Pradesh",
            "care_guide": "Gentle dry clean only. Steam iron from reverse side on lowest setting.",
            "primary_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Ananya Sen", "comment": "Weightless and luminous tissue glow. Ideal for Diwali puja and family sangeet evenings.", "fit": "True to size"}
            ]
        },
        {
            "title": "The Rajwada Antique Zari Velvet Potli with Pearl Tassels",
            "slug": "rajwada-antique-zari-velvet-potli",
            "sku": "AR-ACC-005",
            "price": 8999.00,
            "compare_at_price": 11500.00,
            "category": cat_objs["royal-accessories"],
            "badge_text": "HANDCRAFTED HEIRLOOM",
            "is_bestseller": True,
            "is_new_arrival": False,
            "inventory_count": 30,
            "fabric": "Royal Maroon Velvet with Hand-Embroidered Zari, Cultured Basra Seed Pearls & Braided Silk Drawstring",
            "fit": "Spacious Luxury Clutch Silhouette (Fits iPhone Pro Max, Compact & Lipsticks)",
            "sustainability_rating": "Zero Plastic Craftsmanship • Reclaimed Brass Hardware",
            "care_guide": "Spot clean with dry cloth. Store in dust bag with silica pouch.",
            "primary_image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Kavita Somani", "comment": "Exquisite pearl tassels and heavy antique embroidery. It elevates any simple saree into royalty.", "fit": "Generous"}
            ]
        },
        {
            "title": "The Nizam Hand-Spun Pashmina Jamawar Shawl",
            "slug": "nizam-hand-spun-pashmina-jamawar-shawl",
            "sku": "AR-SHW-006",
            "price": 42000.00,
            "compare_at_price": 52000.00,
            "category": cat_objs["royal-sarees"],
            "badge_text": "KASHMIR PASHMINA GI",
            "is_bestseller": False,
            "is_new_arrival": True,
            "inventory_count": 9,
            "fabric": "100% Grade-A Changthangi Cashmere Wool Hand-Spun on Charkha with Sozni Needle Embroidery",
            "fit": "100 x 200 CM Full Wrap Sovereign Dimensions",
            "sustainability_rating": "Kashmir Artisan Guild Certified • Ethical Cruelty-Free Shearing",
            "care_guide": "Professional cashmere clean. Store folded with natural camphor tablets.",
            "primary_image": "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Sunita Narang", "comment": "Incredible warmth yet passes through a finger ring. True Kashmiri heritage art.", "fit": "Generous"}
            ]
        },
        {
            "title": "The Jodhpur Imperial Silk Bandhgala Jacket",
            "slug": "jodhpur-imperial-silk-bandhgala",
            "sku": "AR-MEN-007",
            "price": 48500.00,
            "compare_at_price": 58000.00,
            "category": cat_objs["nawabi-menswear"],
            "badge_text": "ROYAL RAJPUTANA",
            "is_bestseller": False,
            "is_new_arrival": True,
            "inventory_count": 11,
            "fabric": "Heavy Mulberry Matka Silk with Handcrafted Antique Brass Medallion Buttons",
            "fit": "Tailored High-Armhole Royal Military Jodhpur Silhouette with Silk Satin Lining",
            "sustainability_rating": "Handcrafted by Third-Generation Jodhpur Master Tailors",
            "care_guide": "Dry clean only. Steam press with protective press cloth.",
            "primary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Vikramaditya Varma", "comment": "Crisp shoulder line and regal collar. The Matka silk texture gives great architectural presence.", "fit": "Structured"}
            ]
        },
        {
            "title": "The Shekhawati Bandhani Georgette Draped Saree",
            "slug": "shekhawati-bandhani-georgette-saree",
            "sku": "AR-SAR-008",
            "price": 32500.00,
            "compare_at_price": 39000.00,
            "category": cat_objs["royal-sarees"],
            "badge_text": "KUTCH HAND-TIED",
            "is_bestseller": True,
            "is_new_arrival": False,
            "inventory_count": 18,
            "fabric": "Pure 60-Gram Viscose Georgette with 10,000+ Fine Rai Bandhej Knots & Gotapatti Border",
            "fit": "Pre-Draped Pleated Saree with Stitched Satin Petticoat & Embellished Blouse",
            "sustainability_rating": "Artisan Women Cooperatives of Bhuj & Jamnagar",
            "care_guide": "Dry clean only. Roll fold to maintain the distinctive crinkle texture.",
            "primary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Pooja Jhunjhunwala", "comment": "The bandhej dots are microscopic and authentic. Deep rani pink color looks sensational in candlelight.", "fit": "Effortless"}
            ]
        },
        {
            "title": "The Saffron Zari Brocade Peplum & Sharara Set",
            "slug": "saffron-zari-brocade-peplum-sharara",
            "sku": "AR-ANK-009",
            "price": 34999.00,
            "compare_at_price": 42000.00,
            "category": cat_objs["anarkalis-angrakhas"],
            "badge_text": "LUCKNOWI HERITAGE",
            "is_bestseller": True,
            "is_new_arrival": True,
            "inventory_count": 12,
            "fabric": "Varanasi Brocade Peplum Top with Pure Georgette Tiered Sharara & Crushed Organza Dupatta",
            "fit": "Cinched Empire Waistline with Dramatic Two-Tier Tiered Sharara Flare",
            "sustainability_rating": "Natural Botanical Turmeric & Saffron Dyes",
            "care_guide": "Dry clean only. Store flat in cotton casing.",
            "primary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Tanvi Chawla", "comment": "Stunning movement during Mehendi dances. Saffron color is vibrant and festive.", "fit": "True to size"}
            ]
        },
        {
            "title": "The Darbar Hand-Tooled Marwari Zari Mojri",
            "slug": "darbar-hand-tooled-marwari-zari-mojri",
            "sku": "AR-ACC-010",
            "price": 9500.00,
            "compare_at_price": 12000.00,
            "category": cat_objs["royal-accessories"],
            "badge_text": "ROYAL MOJRI",
            "is_bestseller": False,
            "is_new_arrival": True,
            "inventory_count": 22,
            "fabric": "Vegetable Tanned Camel Leather with Antique Gold Bullion Wire & Silk Cushion Insole",
            "fit": "Supple Slip-On with Molded Leather Arch Cushioning (Zero Bite Guarantee)",
            "sustainability_rating": "Cruelty-Free Reclaimed Leather Guild of Rajasthan",
            "care_guide": "Wipe with dry cotton cloth. Apply mustard oil to sole once a year for softness.",
            "primary_image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Rohan Mehra", "comment": "No shoe bites whatsoever from day one. Wore them for 8 hours of wedding rituals.", "fit": "Supremely comfortable"}
            ]
        },
        {
            "title": "The Mayura Peacock Organza Hand-Painted Saree",
            "slug": "mayura-peacock-organza-hand-painted-saree",
            "sku": "AR-SAR-011",
            "price": 26500.00,
            "compare_at_price": 32000.00,
            "category": cat_objs["royal-sarees"],
            "badge_text": "KALAMKARI ART",
            "is_bestseller": True,
            "is_new_arrival": True,
            "inventory_count": 10,
            "fabric": "Translucent Pure Silk Organza with Kalamkari Hand-Painted Peacocks & Scalloped Zari Edge",
            "fit": "Featherlight 5.5 Metre Saree with Raw Silk Unstitched Blouse",
            "sustainability_rating": "Natural Eco-Friendly Mineral Pigments • Srikalahasti Heritage",
            "care_guide": "Delicate dry clean only. Do not soak or wring.",
            "primary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Geetika Roy", "comment": "Looks like an Indian miniature painting draped around you. Incredible craftsmanship.", "fit": "Featherlight"}
            ]
        },
        {
            "title": "The Shahi Kutch Hand-Embroidered Velvet Bandhgala",
            "slug": "shahi-kutch-hand-embroidered-velvet-bandhgala",
            "sku": "AR-MEN-012",
            "price": 54000.00,
            "compare_at_price": 65000.00,
            "category": cat_objs["nawabi-menswear"],
            "badge_text": "KUTCH ROYAL COUTURE",
            "is_bestseller": False,
            "is_new_arrival": True,
            "inventory_count": 7,
            "fabric": "Midnight Obsidian Silk Velvet with Antique Marori Needlework & Mother-of-Pearl Buttons",
            "fit": "Modern Tailored Bandhgala with Soft Floating Canvas Construction",
            "sustainability_rating": "Master Craftsmen of Gujarat Heritage Revival Project",
            "care_guide": "Specialist velvet dry clean only.",
            "primary_image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
            "hover_image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
            "reviews": [
                {"author": "Sameer Deshmukh", "comment": "Rich velvet with subtle non-flashy antique zari embroidery. Wore it to a reception at Taj Mahal Palace Mumbai.", "fit": "Regal fit"}
            ]
        }
    ]

    for p in indian_catalog:
        available_sizes = p.get("available_sizes") or [
            "XS / 34", "S / 36", "M / 38", "L / 40", "XL / 42", "Custom Bespoke Tailoring"
        ]
        color_swatches = p.get("color_swatches") or [
            {"name": "Royal Crimson", "hex": "#7B1123"},
            {"name": "Antique Champagne Gold", "hex": "#D4AF37"},
            {"name": "Peacock Indigo", "hex": "#1A5276"}
        ]

        existing_prod = ProductPage.objects.filter(slug=p["slug"]).first()
        if not existing_prod:
            prod = ProductPage(
                title=p["title"],
                slug=p["slug"],
                sku=p["sku"],
                price=p["price"],
                compare_at_price=p["compare_at_price"],
                category=p["category"],
                badge_text=p["badge_text"],
                is_bestseller=p["is_bestseller"],
                is_new_arrival=p["is_new_arrival"],
                inventory_count=p["inventory_count"],
                fabric=p["fabric"],
                fit=p["fit"],
                sustainability_rating=p["sustainability_rating"],
                care_guide=p["care_guide"],
                primary_image=p["primary_image"],
                hover_image=p["hover_image"],
                available_sizes=available_sizes,
                color_swatches=color_swatches
            )
            home_page.add_child(instance=prod)
            prod.save_revision().publish()
        else:
            prod = existing_prod

        for r in p["reviews"]:
            ProductReview.objects.create(
                product=prod,
                author_name=r["author"],
                headline=r.get("headline", "Royal Heirloom Craftsmanship"),
                comment=r["comment"],
                fit_feedback=r["fit"],
                rating=5,
                verified_purchase=True
            )

    print(f"✓ Successfully published Royal Indian Haute Couture catalog ({ProductPage.objects.count()} products) in Atelier Riwayat!")

if __name__ == '__main__':
    run()
