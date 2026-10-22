#!/usr/bin/env python3
"""
scripts/generate_og_image.py
Generates an ultra-premium 1200x630 OpenGraph / Social Preview Card for Abhijeet Raut
integrating his official profile photo, title, headline, and brief intro from his CV.
"""

import os
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO_ROOT = Path(__file__).resolve().parent.parent
PORTFOLIO_DIR = REPO_ROOT / "apps" / "jamstack-frontend"
ASSETS_DIR = PORTFOLIO_DIR / "assets"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

PROFILE_SRC = ASSETS_DIR / "profile-photo.png"
OUTPUT_OG = ASSETS_DIR / "og-image.png"

def create_og_image():
    W, H = 1200, 630
    # 1. Base dark obsidian/navy background
    base = Image.new("RGBA", (W, H), (7, 11, 22, 255))
    draw = ImageDraw.Draw(base)

    # Gradient background
    for y in range(H):
        r_ratio = y / H
        r = int(6 * (1 - r_ratio) + 12 * r_ratio)
        g = int(10 * (1 - r_ratio) + 18 * r_ratio)
        b = int(20 * (1 - r_ratio) + 36 * r_ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # 2. Ambient Colorful Glow Blooms
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    # Cyan neon orb around avatar
    gdraw.ellipse([20, 100, 480, 560], fill=(0, 245, 255, 38))
    # Purple/violet bloom top right
    gdraw.ellipse([700, -80, 1260, 480], fill=(139, 92, 246, 32))
    # Emerald accent bottom right
    gdraw.ellipse([650, 400, 1150, 700], fill=(16, 185, 129, 25))
    glow = glow.filter(ImageFilter.GaussianBlur(75))
    base = Image.alpha_composite(base, glow)

    # 3. Micro Tech Grid Pattern (Very subtle, 2% opacity)
    grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, W, 48):
        grid_draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 6), width=1)
    for y in range(0, H, 48):
        grid_draw.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)
    # Subtle dot intersections
    for x in range(0, W, 96):
        for y in range(0, H, 96):
            grid_draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=(0, 245, 255, 35))
    base = Image.alpha_composite(base, grid_layer)

    # 4. Unified Executive Glassmorphic Card Container (Vertically centered)
    card_x, card_y, card_w, card_h = 50, 75, 1100, 480
    card_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card_layer)
    card_draw.rounded_rectangle(
        [card_x, card_y, card_x + card_w, card_y + card_h],
        radius=22,
        fill=(11, 18, 33, 240),
        outline=(0, 245, 255, 110),
        width=1
    )
    base = Image.alpha_composite(base, card_layer)
    draw = ImageDraw.Draw(base)

    # 5. Load Clean System Fonts
    font_bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    font_regular = "/System/Library/Fonts/Helvetica.ttc"

    f_badge = ImageFont.truetype(font_bold, 13)
    f_company = ImageFont.truetype(font_bold, 13)
    f_name = ImageFont.truetype(font_bold, 44)
    f_title = ImageFont.truetype(font_bold, 21)
    f_exp = ImageFont.truetype(font_bold, 16)
    f_desc = ImageFont.truetype(font_regular, 15)
    f_tag = ImageFont.truetype(font_bold, 12)
    f_meta = ImageFont.truetype(font_regular, 14)
    f_loc = ImageFont.truetype(font_regular, 12)

    # 6. Card Header (Pill Badge & Company Badge)
    hdr_y = card_y + 24
    pill_x = card_x + 36
    badge_label = "12 YEARS INDUSTRY EXPERIENCE • LEAD SOLUTIONS ARCHITECT"
    bb = draw.textbbox((0, 0), badge_label, font=f_badge)
    bw = bb[2] - bb[0] + 36
    bh = 30
    draw.rounded_rectangle([pill_x, hdr_y, pill_x + bw, hdr_y + bh], radius=15, fill=(15, 23, 42, 240), outline=(0, 245, 255, 140), width=1)
    draw.ellipse([pill_x + 13, hdr_y + 11, pill_x + 21, hdr_y + 19], fill=(0, 245, 255, 255))
    draw.text((pill_x + 27, hdr_y + 7), badge_label, font=f_badge, fill=(0, 245, 255, 255))

    comp_label = "CYBAGE SOFTWARE & PERSISTENT SYSTEMS"
    cb = draw.textbbox((0, 0), comp_label, font=f_company)
    cw = cb[2] - cb[0]
    comp_x = card_x + card_w - 36 - cw
    draw.text((comp_x, hdr_y + 8), comp_label, font=f_company, fill=(192, 132, 252, 255))

    # Header Divider Line
    hdr_div_y = hdr_y + 44
    draw.line([(card_x + 36, hdr_div_y), (card_x + card_w - 36, hdr_div_y)], fill=(51, 65, 85, 150), width=1)

    # 7. Left Column: Avatar & Role Caption
    avatar_size = 230
    avatar_x = card_x + 40
    avatar_y = hdr_div_y + 22

    if PROFILE_SRC.exists():
        raw_avatar = Image.open(PROFILE_SRC).convert("RGBA")
        raw_avatar = raw_avatar.resize((avatar_size, avatar_size), Image.Resampling.LANCZOS)
        mask = Image.new("L", (avatar_size * 2, avatar_size * 2), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.ellipse([0, 0, avatar_size * 2, avatar_size * 2], fill=255)
        mask = mask.resize((avatar_size, avatar_size), Image.Resampling.LANCZOS)

        # Glowing outer rings
        ring_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        rdraw = ImageDraw.Draw(ring_layer)
        rdraw.ellipse([avatar_x - 9, avatar_y - 9, avatar_x + avatar_size + 9, avatar_y + avatar_size + 9], outline=(0, 245, 255, 60), width=7)
        rdraw.ellipse([avatar_x - 3, avatar_y - 3, avatar_x + avatar_size + 3, avatar_y + avatar_size + 3], outline=(0, 245, 255, 220), width=2)
        base = Image.alpha_composite(base, ring_layer)
        base.paste(raw_avatar, (avatar_x, avatar_y), mask)

        draw = ImageDraw.Draw(base)
        # Verified badge dot
        st_x = avatar_x + avatar_size - 34
        st_y = avatar_y + avatar_size - 34
        draw.ellipse([st_x - 3, st_y - 3, st_x + 29, st_y + 29], fill=(11, 18, 33, 255))
        draw.ellipse([st_x, st_y, st_x + 26, st_y + 26], fill=(16, 185, 129, 255))
        draw.ellipse([st_x + 6, st_y + 6, st_x + 20, st_y + 20], fill=(52, 211, 153, 255))

    # Text under Avatar (Centered)
    meta_y = avatar_y + avatar_size + 18
    center_x = avatar_x + avatar_size // 2
    st1 = "SOLUTIONS ARCHITECT"
    st1_b = draw.textbbox((0, 0), st1, font=f_badge)
    draw.text((center_x - (st1_b[2] - st1_b[0]) // 2, meta_y), st1, font=f_badge, fill=(0, 245, 255, 240))

    st2 = "PUNE, INDIA • VERIFIED"
    st2_b = draw.textbbox((0, 0), st2, font=f_loc)
    draw.text((center_x - (st2_b[2] - st2_b[0]) // 2, meta_y + 20), st2, font=f_loc, fill=(148, 163, 184, 220))

    # 8. Right Column: Content Details
    cur_x = avatar_x + avatar_size + 45
    cur_y = hdr_div_y + 16
    right_max_x = card_x + card_w - 36

    # Name: Abhijeet Raut
    draw.text((cur_x, cur_y), "Abhijeet Raut", font=f_name, fill=(255, 255, 255, 255))

    # Title & Headline
    cur_y += 52
    draw.text((cur_x, cur_y), "Lead Backend & AI/ML Engineer | Solutions Architect", font=f_title, fill=(56, 189, 248, 255))

    # Career Highlights: Cybage Software (Current) • Persistent Systems (Past)
    cur_y += 32
    draw.text((cur_x, cur_y), "Cybage Software (Current)  •  Persistent Systems (Past)", font=f_exp, fill=(192, 132, 252, 255))

    # Brief Intro Paragraphs
    cur_y += 28
    draw.text((cur_x, cur_y), "Accomplished Lead Software Engineer architecting high-concurrency backend", font=f_desc, fill=(226, 232, 240, 255))
    cur_y += 22
    draw.text((cur_x, cur_y), "services, distributed systems, and modern AI/ML solutions at enterprise scale.", font=f_desc, fill=(226, 232, 240, 255))
    cur_y += 22
    draw.text((cur_x, cur_y), "Autonomous AI Multi-Agent Swarms (Google ADK) • Vector RAG • E2EE Cloud", font=f_desc, fill=(148, 163, 184, 255))

    # Technical Arsenal Badges
    cur_y += 30
    tech_skills = ["Python (Expert)", "FastAPI", "Django", "Go", "Agentic AI", "Vector RAG", "Docker", "DevOps"]
    tag_x = cur_x
    for skill in tech_skills:
        s_bbox = draw.textbbox((0, 0), skill, font=f_tag)
        sw = s_bbox[2] - s_bbox[0] + 16
        sh = 26
        draw.rounded_rectangle([tag_x, cur_y, tag_x + sw, cur_y + sh], radius=6, fill=(17, 28, 48, 240), outline=(51, 65, 85, 220), width=1)
        draw.text((tag_x + 8, cur_y + 5), skill, font=f_tag, fill=(148, 163, 184, 255))
        tag_x += sw + 7

    # Divider Line
    cur_y += 38
    draw.line([(cur_x, cur_y), (right_max_x, cur_y)], fill=(51, 65, 85, 140), width=1)

    # Footer Metadata & Coordinates (Evenly spaced with zero overflow)
    cur_y += 14
    f_items = [
        ("REPO", "github.com/arauthub/portfolio"),
        ("SITE", "arauthub.github.io/portfolio"),
        ("AUDIT", "5/5 Presubmit Verified")
    ]
    f_x = cur_x
    for k, v in f_items:
        draw.text((f_x, cur_y), f"[{k}]", font=f_badge, fill=(0, 245, 255, 230))
        kb = draw.textbbox((f_x, cur_y), f"[{k}]", font=f_badge)
        f_x = kb[2] + 6
        draw.text((f_x, cur_y), v, font=f_meta, fill=(203, 213, 225, 255))
        vb = draw.textbbox((f_x, cur_y), v, font=f_meta)
        f_x = vb[2] + 28

    # Save final optimized PNG
    base.save(OUTPUT_OG, "PNG", optimize=True)
    print(f"🎉 Generated 1200x630 Social Preview Card: {OUTPUT_OG}")

if __name__ == "__main__":
    create_og_image()

