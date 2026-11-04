"""SpatialCanvas AI - Automated Presentation Video/GIF Generator.
Compiles captured 1080p spatial studio screenshots into an animated,
multi-scene demo walkthrough with crossfades and title lower-thirds.
"""

import os
from PIL import Image, ImageDraw, ImageFont

SCREENSHOTS_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../frontend/assets/screenshots")
)
OUTPUT_GIF = os.path.join(SCREENSHOTS_DIR, "spatialcanvas_presentation_demo.gif")

TARGET_SIZE = (960, 540)

SCENES = [
    {
        "filename": "hero_concept_artwork.jpg",
        "title": "SPATIALCANVAS AI :: AGENTIC VR CREATION STUDIO",
        "subtitle": "Bridging Agentic AI (MCP + PydanticAI) with Meta Quest Spatial Computing",
        "hold_frames": 22,
    },
    {
        "filename": "screenshot_farmhouse_studio.png",
        "title": "SHOWCASE 1 :: 1:1 SCALE G+1 FARMHOUSE WALKTHROUGH",
        "subtitle": "Living Hall (3.6m Headroom) & Sunlit Central Courtyard with CAD Metrics",
        "hold_frames": 24,
    },
    {
        "filename": "screenshot_sunroom_pergola.png",
        "title": "SHOWCASE 1 :: G+1 FIRST FLOOR EXTENSION",
        "subtitle": "Synthesized East Sunroom Studio & Cedar Pergola Rooftop Deck",
        "hold_frames": 24,
    },
    {
        "filename": "screenshot_retro_studio.png",
        "title": "SHOWCASE 2 :: 1980s RETRO DIGITAL MEDIA STUDIO",
        "subtitle": "Horizon Sun, Neon Grid & Curved CRT Monitors with Live Phosphor Scanlines",
        "hold_frames": 26,
    },
]


def create_banner_frame(img: Image.Image, title: str, subtitle: str) -> Image.Image:
    """Draws a futuristic glassmorphic lower-third HUD banner on the frame."""
    frame = img.copy()
    draw = ImageDraw.Draw(frame, "RGBA")

    w, h = frame.size
    banner_h = 70
    banner_y = h - banner_h - 15

    # Glassmorphism dark banner
    draw.rectangle([30, banner_y, w - 30, banner_y + banner_h], fill=(9, 10, 15, 215))
    # Glowing cyan border
    draw.rectangle([30, banner_y, w - 30, banner_y + banner_h], outline=(6, 182, 212, 230), width=2)
    # Accent pill indicator
    draw.rectangle([38, banner_y + 12, 44, banner_y + banner_h - 12], fill=(6, 182, 212, 255))

    # Text
    draw.text((56, banner_y + 14), title, fill=(255, 255, 255, 255))
    draw.text((56, banner_y + 40), subtitle, fill=(148, 163, 184, 255))

    return frame


def crossfade(img1: Image.Image, img2: Image.Image, steps=6):
    """Generates crossfade transition frames between two images."""
    fades = []
    for step in range(1, steps):
        alpha = step / float(steps)
        blended = Image.blend(img1, img2, alpha)
        fades.append(blended)
    return fades


def main():
    print(f"🎬 Compiling SpatialCanvas AI presentation demo walkthrough...")
    loaded_scenes = []

    for item in SCENES:
        p = os.path.join(SCREENSHOTS_DIR, item["filename"])
        if not os.path.exists(p):
            print(f"⚠️ Warning: Missing {p}")
            continue

        raw = Image.open(p).convert("RGB")
        resized = raw.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        annotated = create_banner_frame(resized, item["title"], item["subtitle"])
        loaded_scenes.append((annotated, item["hold_frames"]))

    if not loaded_scenes:
        print("❌ No scenes loaded.")
        return

    all_frames = []
    for i in range(len(loaded_scenes)):
        current_img, hold = loaded_scenes[i]
        next_img, _ = loaded_scenes[(i + 1) % len(loaded_scenes)]

        # Hold current frame
        for _ in range(hold):
            all_frames.append(current_img)

        # Crossfade to next scene
        fades = crossfade(current_img, next_img, steps=5)
        all_frames.extend(fades)

    # Save animated GIF
    all_frames[0].save(
        OUTPUT_GIF,
        save_all=True,
        append_images=all_frames[1:],
        duration=90,  # ~11 FPS
        loop=0,
        optimize=True,
    )

    size_mb = os.path.getsize(OUTPUT_GIF) / (1024 * 1024)
    print(f"✅ Generated presentation GIF: {OUTPUT_GIF} ({size_mb:.2f} MB, {len(all_frames)} frames)")


if __name__ == "__main__":
    main()

