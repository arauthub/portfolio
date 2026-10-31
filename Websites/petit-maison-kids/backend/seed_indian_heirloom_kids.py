import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petit_backend.settings.dev')
django.setup()

from wagtail.models import Page
from catalog.models import KidsCategory, KidsProductPage, KidsProductReview
from marketing.models import KidsStoreBrandSetting, KidsAnnouncementTicker, KidsMarketingBanner, KidsCoupon

def run():
    print("=== Populating Indian Heirloom Childrenswear (Nanhi Maison) ===")

    # 1. Update Store Brand Settings
    setting = KidsStoreBrandSetting.load()
    setting.brand_name = "NANHI MAISON"
    setting.brand_tagline = "Pure Organic Mulmul, Festive Handlooms & Scratch-Free Craft for Little Nawabs & Paris (0 - 12Y)"
    setting.active_currency = "INR"
    setting.allow_customer_currency_switch = True
    setting.free_shipping_threshold_inr = Decimal("2499.00")
    setting.free_shipping_threshold_usd = Decimal("35.00")
    setting.contact_email = "namaste@nanhimaison.com"
    setting.support_phone = "+91 (011) 4105-8888 / +91 98100 77777"
    setting.save()
    print("✓ Updated KidsStoreBrandSetting to NANHI MAISON (Default INR)")

    # 2. Announcement Tickers (Indian Festive Kids)
    KidsAnnouncementTicker.objects.all().delete()
    tickers = [
        ("Shubh Utsav Special — Complimentary Keepsake Box & Free Express Shipping on Orders Over ₹2,499", "NANHI25", 1),
        ("100% GOTS Certified Organic Mulmul & Chemical-Free Herbal Dyes Safe for Infant Skin", "PUREMULMUL", 2),
        ("Sibling Matching Sets for Diwali & Family Celebrations — Use Code JODI500 for ₹500 Off", "JODI500", 3),
    ]
    for msg, code, order in tickers:
        KidsAnnouncementTicker.objects.create(
            message=msg,
            promo_code=code,
            link_url="/#catalog",
            is_active=True,
            sort_order=order
        )
    print("✓ Created Indian Festive Kids Announcement Tickers")

    # 3. Coupons
    KidsCoupon.objects.all().delete()
    coupons = [
        {"code": "NANHI25", "desc": "Festive 25% Off Celebration", "pct": 25, "min": Decimal("2499.00")},
        {"code": "FIRSTBABY15", "desc": "Newborn Welcome Gift 15% Off", "pct": 15, "min": Decimal("1499.00")},
        {"code": "JODI500", "desc": "Flat ₹500 Off Sibling Festive Bundles", "pct": 0, "flat": Decimal("500.00"), "min": Decimal("4999.00")},
    ]
    for c in coupons:
        KidsCoupon.objects.create(
            code=c["code"],
            description=c["desc"],
            discount_percent=c["pct"],
            flat_discount_amount=c.get("flat", Decimal("0.00")),
            min_order_value=c["min"],
            is_active=True
        )
    print("✓ Created Festive Coupons (NANHI25, FIRSTBABY15, JODI500)")

    # 4. Categories
    categories_spec = [
        {"name": "Shishu & Newborn (0 - 24M)", "slug": "baby", "stage": "baby", "desc": "Scratch-free mulmul jhablas, kimono rompers, and herbal-dyed organic swaddles.", "order": 1},
        {"name": "Chhota Nawab (2 - 5Y)", "slug": "toddler", "stage": "toddler", "desc": "Playful cotton kurta-dhotis, festive Nehru jackets, and soft elastic waistbands.", "order": 2},
        {"name": "Nanhi Pari & Lehengas (6 - 12Y)", "slug": "junior", "stage": "junior", "desc": "Gotapatti twirl lehengas, pure Chanderi anarkalis, and breezy festive drapes.", "order": 3},
        {"name": "Sibling Festive Jodi", "slug": "sibling", "stage": "sibling", "desc": "Coordinated brother-sister festive ensembles for Diwali, Rakhi and family weddings.", "order": 4},
        {"name": "Organic Mulmul & Sleep", "slug": "organic-basics", "stage": "organic_basics", "desc": "100% GOTS organic cotton pyjamas, muslin dohars, and chemical-free nightwear.", "order": 5},
    ]
    cat_objs = {}
    for c in categories_spec:
        obj, _ = KidsCategory.objects.update_or_create(
            slug=c["slug"],
            defaults={"name": c["name"], "stage": c["stage"], "description": c["desc"], "sort_order": c["order"], "featured": True}
        )
        cat_objs[c["slug"]] = obj
    print("✓ Created 5 Indian Heirloom Kids Categories")

    # 5. Products
    Page.fix_tree()
    home_page = Page.objects.filter(depth=2).first()
    if not home_page:
        home_page = Page.objects.first()

    kids_catalog = [
        {
            "title": "The Shishu Mulmul Hand-Block Angrakha Romper",
            "slug": "shishu-mulmul-hand-block-angrakha-romper",
            "sku": "NM-INF-001",
            "price": Decimal("1899.00"),
            "compare_at_price": Decimal("2499.00"),
            "category": cat_objs["baby"],
            "badge_text": "100% ORGANIC MULMUL",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 45,
            "fabric": "100% GOTS Certified Hand-Block Printed Superfine Mulmul Cotton",
            "safety_certification": "OEKO-TEX Standard 100 Class 1 (Safe for Newborn Skin)",
            "fasteners": "Flat Cotton Tie-Up Angrakha with Nickel-Free Inseam Snaps",
            "care_guide": "Gentle hand wash or delicate baby machine cycle. Sun dry. Gets softer with every wash.",
            "primary_image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "0-24M",
            "available_sizes": ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
            "color_swatches": [
                {"name": "Haldi Marigold", "hex": "#F39C12"},
                {"name": "Gulabi Rose", "hex": "#D98880"},
                {"name": "Makkhan Ivory", "hex": "#FFFDF9"}
            ],
            "sibling_matching_sku": "NM-TOD-002",
            "review": {
                "parent": "Dr. Ananya Sharma (Mom of 6M Kabir)",
                "age": "6 months old",
                "headline": "Zero rashes, so breathable in Indian summer!",
                "comment": "The mulmul is whisper-soft. We got Kabir's initials embroidered in golden zari thread. Looked so adorable for his Annaprashan ceremony.",
                "wash": "Washed 15+ times, block prints stayed crisp"
            }
        },
        {
            "title": "Chhota Nawab Raw Silk Kurta & Dhoti with Bandi Set",
            "slug": "chhota-nawab-raw-silk-kurta-dhoti-set",
            "sku": "NM-TOD-002",
            "price": Decimal("3499.00"),
            "compare_at_price": Decimal("4299.00"),
            "category": cat_objs["toddler"],
            "badge_text": "FESTIVE NAWABI",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 30,
            "fabric": "Artisanal Bhagalpuri Raw Silk Kurta with Pure Cotton Pre-Stitched Dhoti & Woven Brocade Bandi",
            "safety_certification": "Hypoallergenic 100% Cotton Lining throughout",
            "fasteners": "Mother-of-pearl buttons with soft elasticated waistband on dhoti",
            "care_guide": "Dry clean recommended for first wash. Gentle cold hand wash thereafter.",
            "primary_image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "2-5Y",
            "available_sizes": ["2-3Y", "3-4Y", "4-5Y"],
            "color_swatches": [
                {"name": "Royal Peacock Teal", "hex": "#1A5276"},
                {"name": "Kesar Saffron", "hex": "#E67E22"},
                {"name": "Pista Green", "hex": "#A3E4D7"}
            ],
            "sibling_matching_sku": "NM-JOD-004",
            "review": {
                "parent": "Priyanka & Gaurav Singhal",
                "age": "3 years old",
                "headline": "Toddler ran around for 6 hours without complaining!",
                "comment": "Normally my son tears off festive clothes within 10 minutes. The cotton lining inside the raw silk made all the difference. He looked like a miniature maharaja.",
                "wash": "Retained shape and vibrant sheen"
            }
        },
        {
            "title": "Nanhi Pari Gotapatti Twirl Lehenga & Choli Set",
            "slug": "nanhi-pari-gotapatti-twirl-lehenga-set",
            "sku": "NM-JUN-003",
            "price": Decimal("4899.00"),
            "compare_at_price": Decimal("5999.00"),
            "category": cat_objs["junior"],
            "badge_text": "JAIPUR GOTAPATTI",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 28,
            "fabric": "Pure Chanderi Silk with Hand-Stitched Jaipur Gold Gotapatti, Cotton Voile Inner Lining",
            "safety_certification": "Scratch-Free Flat Seams • Nickel-Free Hooks",
            "fasteners": "Concealed side zipper with drawstring tassels and adjustable button strap blouse",
            "care_guide": "Dry clean only. Hang on padded hanger with sheer garment cover.",
            "primary_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "6-12Y",
            "available_sizes": ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
            "color_swatches": [
                {"name": "Gulabi Rani Pink", "hex": "#E91E63"},
                {"name": "Genda Yellow", "hex": "#FFC107"},
                {"name": "Firozi Turquoise", "hex": "#00BCD4"}
            ],
            "sibling_matching_sku": "NM-JOD-004",
            "review": {
                "parent": "Meenakshi Iyer",
                "age": "7 years old",
                "headline": "The 360-degree twirl is magical!",
                "comment": "My daughter danced all night at our family sangeet. The lehenga is lightweight yet looks heavily royal. The gotapatti work is authentic Rajasthani craft.",
                "wash": "Steam ironed beautifully"
            }
        },
        {
            "title": "Sibling Diwali Shahi Matching Set (Kurta & Ghagra)",
            "slug": "sibling-diwali-shahi-matching-set",
            "sku": "NM-JOD-004",
            "price": Decimal("6999.00"),
            "compare_at_price": Decimal("8500.00"),
            "category": cat_objs["sibling"],
            "badge_text": "SIBLING JODI -15%",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 20,
            "fabric": "Matching Chanderi Tissue in Royal Kesar with Antique Zari Boota Embroidery",
            "safety_certification": "100% Breathable Organic Cotton Inner Lining on both outfits",
            "fasteners": "Adjustable tie-ups and soft elastic waistbands for both boy and girl pieces",
            "care_guide": "Dry clean for festive preservation. Includes commemorative keepsake gift box.",
            "primary_image": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "All Ages",
            "available_sizes": ["Brother 3Y + Sister 6Y", "Brother 5Y + Sister 8Y", "Custom Pairing"],
            "color_swatches": [
                {"name": "Kesar Royal Amber", "hex": "#D4AC0D"},
                {"name": "Mehendi Green", "hex": "#27AE60"}
            ],
            "sibling_matching_sku": "NM-JOD-004",
            "review": {
                "parent": "Rhea & Rohan Mathur",
                "age": "Brother 4Y, Sister 7Y",
                "headline": "Our Diwali family portrait looked straight out of a royal magazine",
                "comment": "Coordinated without being overly identical. Both kids were comfortable through the puja rituals and fireworks. Highly recommend the sibling sets!",
                "wash": "Stored in the provided muslin bag"
            }
        },
        {
            "title": "Shishu Hand-Quilted Organic Muslin Dohar & Jhabla",
            "slug": "shishu-hand-quilted-muslin-dohar-jhabla",
            "sku": "NM-INF-005",
            "price": Decimal("2199.00"),
            "compare_at_price": Decimal("2799.00"),
            "category": cat_objs["baby"],
            "badge_text": "JAIPURI RAZAI CRAFT",
            "is_bestseller": True,
            "is_new_arrival": False,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 35,
            "fabric": "Triple-Layered Pure Mulmul Cotton with Natural Cotton Fluff Infill (Hand-Stitched Tagaai)",
            "safety_certification": "Chemical-Free, Unbleached & Hypoallergenic",
            "fasteners": "Cotton Tie Jhabla with zero metal hardware",
            "care_guide": "Machine wash cold delicate. Gets fluffier with each wash.",
            "primary_image": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "0-24M",
            "available_sizes": ["Newborn - 6M", "6M - 18M"],
            "color_swatches": [
                {"name": "Peele Phool (Yellow Floral)", "hex": "#F9E79F"},
                {"name": "Neel Kamal (Blue Lotus)", "hex": "#AED6F1"}
            ],
            "sibling_matching_sku": "NM-INF-001",
            "review": {
                "parent": "Kavita Nair",
                "age": "3 months old",
                "headline": "The perfect AC blanket for Mumbai weather",
                "comment": "Lightweight, breathable, and keeps baby perfectly warm without overheating. A quintessential Indian grandmother gift, modernized.",
                "wash": "Washed multiple times, softness increases"
            }
        },
        {
            "title": "Banarasi Brocade Festive Nehru Jacket (Bandi)",
            "slug": "banarasi-brocade-festive-nehru-jacket",
            "sku": "NM-TOD-006",
            "price": Decimal("2699.00"),
            "compare_at_price": Decimal("3299.00"),
            "category": cat_objs["toddler"],
            "badge_text": "BANARASI SILK",
            "is_bestseller": False,
            "is_new_arrival": True,
            "is_monogrammable": False,
            "extendable_cuffs": False,
            "inventory_count": 22,
            "fabric": "Pure Banarasi Weave Brocade with Antiqued Gold Buttons and Cotton Slub Lining",
            "safety_certification": "Soft neck ribbing prevents chin chaffing",
            "fasteners": "Front button placket with pocket square detail",
            "care_guide": "Dry clean only. Steam press on low reverse.",
            "primary_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "2-5Y",
            "available_sizes": ["2T", "3T", "4T", "5Y"],
            "color_swatches": [
                {"name": "Deep Jamun Maroon", "hex": "#641E16"},
                {"name": "Royal Emerald", "hex": "#145A32"}
            ],
            "sibling_matching_sku": "NM-TOD-002",
            "review": {
                "parent": "Amitabh Sen",
                "age": "4 years old",
                "headline": "Instantly made his simple white kurta look wedding-ready",
                "comment": "Crisp Banarasi weave without any stiffness. He wore it for his cousin's Barat ceremony and was the center of attention.",
                "wash": "Spot clean maintained pristine finish"
            }
        },
        {
            "title": "Pure Chanderi Zari Booti Pattu Pavadai Set",
            "slug": "pure-chanderi-zari-booti-pattu-pavadai",
            "sku": "NM-JUN-007",
            "price": Decimal("3899.00"),
            "compare_at_price": Decimal("4699.00"),
            "category": cat_objs["junior"],
            "badge_text": "SOUTH HEIRLOOM",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 25,
            "fabric": "Traditional South Indian Silk with Gold Zari Border and Pure Cotton Inner Layer",
            "safety_certification": "Smooth hand-stitched borders with zero exposed metallic threads",
            "fasteners": "Back zipper on blouse with tie-back belt on skirt",
            "care_guide": "Gentle dry clean. Store wrapped in cotton cloth.",
            "primary_image": "https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "6-12Y",
            "available_sizes": ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
            "color_swatches": [
                {"name": "Temple Kumkum Red", "hex": "#922B21"},
                {"name": "Kanjeevaram Mustard", "hex": "#B7950B"}
            ],
            "sibling_matching_sku": "NM-TOD-002",
            "review": {
                "parent": "Lakshmi Ramanathan",
                "age": "5 years old",
                "headline": "Authentic temple tradition with modern child comfort",
                "comment": "Wore it for Navratri Golu and Vijayadashami. Usually silks irritate little kids, but the soft inner lining made it wearable all day.",
                "wash": "Color didn't bleed at all"
            }
        },
        {
            "title": "Kashmiri Hand-Embroidered Organic Wool Cardigan",
            "slug": "kashmiri-hand-embroidered-wool-cardigan",
            "sku": "NM-INF-008",
            "price": Decimal("3299.00"),
            "compare_at_price": Decimal("3999.00"),
            "category": cat_objs["baby"],
            "badge_text": "KASHMIR AARI WORK",
            "is_bestseller": False,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 18,
            "fabric": "100% Non-Prickly Fine Merino Wool with Hand-Embroidered Kashmiri Aari Chinar Leaves",
            "safety_certification": "Zero Synthetic Acrylic • Woolmark Certified",
            "fasteners": "Hand-carved wooden buttons",
            "care_guide": "Woolmark approved gentle hand wash in lukewarm water. Dry flat in shade.",
            "primary_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "0-24M",
            "available_sizes": ["3-6M", "6-12M", "12-18M", "18-24M"],
            "color_swatches": [
                {"name": "Kashmir Almond Cream", "hex": "#F5EEF8"},
                {"name": "Badami Taupe", "hex": "#E5E7E9"}
            ],
            "sibling_matching_sku": "NM-INF-001",
            "review": {
                "parent": "Zainab Wani",
                "age": "9 months old",
                "headline": "Incredibly warm and non-itchy wool",
                "comment": "Breathtaking Aari embroidery on the yoke. Keeps baby snug without any bulkiness under winter jackets.",
                "wash": "Maintains shape without stretching"
            }
        },
        {
            "title": "Handloom Khadi Cotton Pathani Suit with Salwar",
            "slug": "handloom-khadi-cotton-pathani-suit",
            "sku": "NM-TOD-009",
            "price": Decimal("2499.00"),
            "compare_at_price": Decimal("2999.00"),
            "category": cat_objs["toddler"],
            "badge_text": "PURE KHADI",
            "is_bestseller": True,
            "is_new_arrival": False,
            "inventory_count": 32,
            "fabric": "Handspun & Handwoven Certified Khadi Cotton with Epaulettes and Flap Pockets",
            "safety_certification": "100% Breathable Khadi • Natural Vegetable Dyes",
            "fasteners": "Front button stand collar with drawstring salwar",
            "care_guide": "Gentle hand wash. Starches crisp or steam press soft.",
            "primary_image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "2-5Y",
            "available_sizes": ["2-3Y", "3-4Y", "4-5Y"],
            "color_swatches": [
                {"name": "Safed White", "hex": "#FFFFFF"},
                {"name": "Neel Indigo", "hex": "#1F618D"},
                {"name": "Khaki Olive", "hex": "#5D6D7E"}
            ],
            "sibling_matching_sku": "NM-TOD-002",
            "review": {
                "parent": "Tariq Farooqui",
                "age": "3.5 years old",
                "headline": "Classic dignified look for Eid prayers",
                "comment": "The fabric breathability is unbeatable. Looks crisp yet feels like a soft pajama for the child.",
                "wash": "Very easy to iron and wear"
            }
        },
        {
            "title": "Jaipur Leheriya Festive Tiered Anarkali with Dupatta",
            "slug": "jaipur-leheriya-festive-tiered-anarkali",
            "sku": "NM-JUN-010",
            "price": Decimal("3699.00"),
            "compare_at_price": Decimal("4499.00"),
            "category": cat_objs["junior"],
            "badge_text": "JAIPUR LEHERIYA",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 26,
            "fabric": "Traditional Diagonal Wave Leheriya on Pure Cotton Georgette with Gotapatti Neckline",
            "safety_certification": "Azo-Free Certified Safe Colorants",
            "fasteners": "Concealed back zipper and lightweight chiffon dupatta",
            "care_guide": "Dry clean first wash. Cold wash separately afterwards.",
            "primary_image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "6-12Y",
            "available_sizes": ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
            "color_swatches": [
                {"name": "Teej Sawan Green", "hex": "#229954"},
                {"name": "Basanti Yellow", "hex": "#F4D03F"}
            ],
            "sibling_matching_sku": "NM-JOD-004",
            "review": {
                "parent": "Deepa Agarwal",
                "age": "8 years old",
                "headline": "Festive, colorful, and zero fussy handling",
                "comment": "The leheriya waves are vibrant. My daughter wore it for Teej festival and danced non-stop with her friends.",
                "wash": "Colors remained 100% intact"
            }
        },
        {
            "title": "Organic Bamboo-Cotton Cloud Ribbed Pyjama Set",
            "slug": "organic-bamboo-cotton-cloud-pyjama-set",
            "sku": "NM-SLP-011",
            "price": Decimal("1499.00"),
            "compare_at_price": Decimal("1899.00"),
            "category": cat_objs["organic-basics"],
            "badge_text": "NIGHT COMFORT",
            "is_bestseller": True,
            "is_new_arrival": False,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 50,
            "fabric": "70% Organic Bamboo Fiber, 30% GOTS Organic Cotton (Thermoregulating Rib Knit)",
            "safety_certification": "Zero Harmful Chemicals • Dermatologically Tested",
            "fasteners": "Non-pinch wide elastic waistband with tagless neckline",
            "care_guide": "Machine wash cold normal cycle, tumble dry low.",
            "primary_image": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "0-24M",
            "available_sizes": ["6-12M", "12-18M", "18-24M", "2-3Y", "4-5Y"],
            "color_swatches": [
                {"name": "Doodh Cream", "hex": "#FDFEFE"},
                {"name": "Pista Mist", "hex": "#D5F5E3"}
            ],
            "sibling_matching_sku": "NM-INF-001",
            "review": {
                "parent": "Shweta Kulkarni",
                "age": "2 years old",
                "headline": "Best pyjamas for tropical summers",
                "comment": "Bamboo stays naturally cool to touch. My toddler sleeps peacefully through hot humid nights without sweating.",
                "wash": "Stays cloud-soft wash after wash"
            }
        },
        {
            "title": "Royal Velvet Sherwani for Little Groom's Brother",
            "slug": "royal-velvet-sherwani-little-brother",
            "sku": "NM-TOD-012",
            "price": Decimal("4999.00"),
            "compare_at_price": Decimal("6200.00"),
            "category": cat_objs["toddler"],
            "badge_text": "ROYAL WEDDING",
            "is_bestseller": False,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 15,
            "fabric": "Deep Navy Silk Velvet with Antique Zari Resham Embroidery & Pre-Tied Brocade Dupatta",
            "safety_certification": "Pure Mulberry Cotton Inner Sheath against body",
            "fasteners": "Front loop buttons with concealed press studs",
            "care_guide": "Specialist velvet dry clean only.",
            "primary_image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "2-5Y",
            "available_sizes": ["2-3Y", "3-4Y", "4-5Y"],
            "color_swatches": [
                {"name": "Royal Shahi Navy", "hex": "#1B2631"},
                {"name": "Rani Wine Velvet", "hex": "#512E5F"}
            ],
            "sibling_matching_sku": "NM-JOD-004",
            "review": {
                "parent": "Jaspreet Gill",
                "age": "4 years old",
                "headline": "Stole the show at the wedding!",
                "comment": "Everyone thought he looked sharper than the groom! Impeccable tailoring and the velvet is top quality.",
                "wash": "Dry cleaned back to brand new condition"
            }
        },
        {
            "title": "Ayodhya Zari Hand-Embroidered Baby Jutti Booties",
            "slug": "ayodhya-zari-hand-embroidered-baby-jutti",
            "sku": "NM-ACC-013",
            "price": Decimal("1299.00"),
            "compare_at_price": Decimal("1699.00"),
            "category": cat_objs["baby"],
            "badge_text": "BABY JUTTI",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": False,
            "inventory_count": 40,
            "fabric": "Buttery Soft Foam-Cushioned Velvet with Lead-Free Gold Bullion Embroidery",
            "safety_certification": "Soft Sole Pediatrically Approved for Pre-Walkers",
            "fasteners": "Gentle ankle elastic grip (stay-on guarantee)",
            "care_guide": "Wipe with damp cloth. Air dry in shade.",
            "primary_image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "0-24M",
            "available_sizes": ["0-6M", "6-12M", "12-18M"],
            "color_swatches": [
                {"name": "Sona Gold", "hex": "#F1C40F"},
                {"name": "Lal Ruby", "hex": "#C0392B"}
            ],
            "sibling_matching_sku": "NM-INF-001",
            "review": {
                "parent": "Pooja Reddy",
                "age": "8 months old",
                "headline": "Actually stays on baby feet without slipping off!",
                "comment": "Most festive shoes fall off in 2 seconds. The gentle ankle elastic is brilliant. Looked adorable with his dhoti set.",
                "wash": "Cleaned easily with a baby wipe"
            }
        },
        {
            "title": "Sibling Rakhi Pastel Jamdani Festive Set",
            "slug": "sibling-rakhi-pastel-jamdani-set",
            "sku": "NM-JOD-014",
            "price": Decimal("5499.00"),
            "compare_at_price": Decimal("6800.00"),
            "category": cat_objs["sibling"],
            "badge_text": "RAKHI SPECIAL",
            "is_bestseller": True,
            "is_new_arrival": True,
            "is_monogrammable": True,
            "extendable_cuffs": True,
            "inventory_count": 24,
            "fabric": "Hand-Woven Bengal Jamdani Fine Muslin in Powder Peach and Mint Green",
            "safety_certification": "Pure Organic Breathable Weave",
            "fasteners": "Kurta button placket with matching flare skirt tie-up",
            "care_guide": "Gentle hand wash with mild baby detergent. Shadow dry.",
            "primary_image": "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=85",
            "hover_image": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=85",
            "age_stage": "All Ages",
            "available_sizes": ["Brother 2Y + Sister 5Y", "Brother 4Y + Sister 7Y", "Custom Pairing"],
            "color_swatches": [
                {"name": "Pastel Gulaab Peach", "hex": "#FADBD8"},
                {"name": "Mint Kairii", "hex": "#D1F2EB"}
            ],
            "sibling_matching_sku": "NM-JOD-004",
            "review": {
                "parent": "Bhavna Bhattacharya",
                "age": "Brother 3Y, Sister 6Y",
                "headline": "Heirloom Jamdani craft in modern pastel elegance",
                "comment": "Authentic Bengal Jamdani motifs on lightweight mulmul. The kids celebrated Raksha Bandhan feeling comfortable and looking regal.",
                "wash": "Maintained sheer beauty without any color fade"
            }
        }
    ]

    for p in kids_catalog:
        existing_prod = KidsProductPage.objects.filter(slug=p["slug"]).first()
        if not existing_prod:
            prod = KidsProductPage(
                title=p["title"],
                slug=p["slug"],
                sku=p["sku"],
                price=p["price"],
                compare_at_price=p.get("compare_at_price"),
                category=p["category"],
                badge_text=p.get("badge_text", "HEIRLOOM"),
                is_bestseller=p.get("is_bestseller", False),
                is_new_arrival=p.get("is_new_arrival", True),
                is_monogrammable=p.get("is_monogrammable", True),
                extendable_cuffs=p.get("extendable_cuffs", True),
                inventory_count=p.get("inventory_count", 30),
                fabric=p["fabric"],
                safety_certification=p.get("safety_certification", "100% Cotton"),
                fasteners=p.get("fasteners", "Mother-of-pearl buttons"),
                care_guide=p.get("care_guide", "Hand wash cold"),
                primary_image=p["primary_image"],
                hover_image=p["hover_image"],
                age_stage=p.get("age_stage", "0-24M"),
                available_sizes=p.get("available_sizes", ["0-3M", "3-6M"]),
                color_swatches=p.get("color_swatches", [{"name": "Ivory", "hex": "#FFFDF9"}]),
                sibling_matching_sku=p.get("sibling_matching_sku", "")
            )
            home_page.add_child(instance=prod)
            prod.save_revision().publish()
        else:
            prod = existing_prod

        rev_data = p.get("review")
        if rev_data:
            KidsProductReview.objects.create(
                product=prod,
                parent_name=rev_data["parent"],
                child_age=rev_data["age"],
                rating=5,
                headline=rev_data["headline"],
                comment=rev_data["comment"],
                wash_durability=rev_data["wash"],
                verified_parent=True
            )

    print(f"✓ Successfully published Nanhi Maison catalog ({KidsProductPage.objects.count()} products)!")

if __name__ == '__main__':
    run()
