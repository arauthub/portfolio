"""SpatialCanvas AI - Video Visuals & Presentation Video Generator.
Generates all 12 scene storyboard cuts, glassmorphic HUD lower thirds,
architecture infographics, and compiles a broadcast-ready 1080p MP4 presentation
video and optimized GIF matching VIDEO_PRESENTATION_SCRIPT.md.
"""

import os
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio.v2 as imageio

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCREENSHOTS_DIR = os.path.join(PROJECT_ROOT, "screenshots")
VIDEO_ASSETS_DIR = os.path.join(PROJECT_ROOT, "video_assets")
STORYBOARD_DIR = os.path.join(VIDEO_ASSETS_DIR, "storyboard")
ARTIFACTS_DIR = "/Users/abhijeetraut/.gemini/antigravity/brain/d5018037-2c49-40ce-89ea-98154f8b2e6a"

WIDTH, HEIGHT = 1920, 1080
GIF_WIDTH, GIF_HEIGHT = 960, 540

os.makedirs(STORYBOARD_DIR, exist_ok=True)
os.makedirs(VIDEO_ASSETS_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# ----------------- Helper Drawing Functions -----------------

def get_font(size: int, bold: bool = False):
    """Attempts to load a standard system sans-serif font or fallback."""
    font_paths = [
        "/System/Library/Fonts/SFPro-Bold.ttf" if bold else "/System/Library/Fonts/SFPro-Regular.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_title = get_font(34, bold=True)
font_sub = get_font(22, bold=False)
font_vo = get_font(20, bold=False)
font_badge = get_font(18, bold=True)
font_large = get_font(52, bold=True)
font_caption = get_font(26, bold=True)


def draw_glassmorphic_lower_third(
    img: Image.Image,
    time_badge: str,
    act_title: str,
    subtitle: str,
    voiceover_text: str,
) -> Image.Image:
    """Draws a futuristic glassmorphic HUD lower-third banner across the bottom."""
    frame = img.copy()
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Banner dimensions
    banner_h = 160
    banner_y = HEIGHT - banner_h - 40
    margin_x = 60
    banner_w = WIDTH - (margin_x * 2)

    # Dark translucent glass card
    draw.rounded_rectangle(
        [margin_x, banner_y, margin_x + banner_w, banner_y + banner_h],
        radius=18,
        fill=(8, 12, 24, 225),
        outline=(56, 189, 248, 220),  # Cyan glow
        width=2,
    )

    # Accent left indicator stripe
    draw.rounded_rectangle(
        [margin_x + 12, banner_y + 16, margin_x + 20, banner_y + banner_h - 16],
        radius=4,
        fill=(56, 189, 248, 255),
    )

    # Time pill badge
    badge_w = 170
    badge_h = 32
    draw.rounded_rectangle(
        [margin_x + 36, banner_y + 18, margin_x + 36 + badge_w, banner_y + 18 + badge_h],
        radius=8,
        fill=(14, 165, 233, 240),
    )
    draw.text((margin_x + 48, banner_y + 23), time_badge, fill=(255, 255, 255, 255), font=font_badge)

    # Act Title
    draw.text((margin_x + 225, banner_y + 18), act_title, fill=(255, 255, 255, 255), font=font_title)

    # Subtitle / Tech Spec
    draw.text((margin_x + 36, banner_y + 60), subtitle, fill=(56, 189, 248, 255), font=font_sub)

    # Voiceover caption
    vo_box_y = banner_y + 98
    draw.rounded_rectangle(
        [margin_x + 30, vo_box_y, margin_x + banner_w - 30, vo_box_y + 44],
        radius=6,
        fill=(15, 23, 42, 190),
    )
    # Quote mark
    draw.text((margin_x + 44, vo_box_y + 8), f'"{voiceover_text}"', fill=(226, 232, 240, 245), font=font_vo)

    frame = Image.alpha_composite(frame.convert("RGBA"), overlay)
    return frame.convert("RGB")


# ----------------- Custom Visual Generators -----------------

def generate_scene_01_problem():
    """Generates Cut 1: The 2D Rectangle Trap (Split-screen comparison)."""
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)

    # Left: Flat 2D Floor Plan CAD Box
    draw.rectangle([60, 100, 920, 800], fill=(15, 23, 42), outline=(100, 116, 139), width=2)
    draw.text((100, 130), "TRADITIONAL 2D GENERATIVE AI (FLAT PIXELS)", fill=(239, 68, 68), font=font_caption)
    draw.text((100, 175), "❌ Screen-Bound & Distorted Perception", fill=(148, 163, 184), font=font_sub)
    draw.text((100, 210), "❌ Cannot verify 1:1 scale before physical build", fill=(148, 163, 184), font=font_sub)
    draw.text((100, 245), "❌ Static, passive viewing without presence", fill=(148, 163, 184), font=font_sub)

    # Mock flat CAD wire lines
    for y in range(320, 750, 45):
        draw.line([(100, y), (880, y)], fill=(30, 41, 59), width=1)
    for x in range(100, 890, 60):
        draw.line([(x, 320), (x, 750)], fill=(30, 41, 59), width=1)
    draw.rectangle([160, 380, 520, 680], outline=(239, 68, 68), width=3)
    draw.rectangle([540, 380, 820, 540], outline=(239, 68, 68), width=3)
    draw.text((220, 510), "FLAT BLUEPRINT: 8.0m x 6.0m", fill=(239, 68, 68), font=font_sub)

    # Right: Spatial Operating System (SpatialCanvas AI)
    hero_p = os.path.join(SCREENSHOTS_DIR, "01_hero_spatial_os_overview.png")
    if os.path.exists(hero_p):
        right_raw = Image.open(hero_p).convert("RGB")
        right_cropped = right_raw.crop((right_raw.width // 4, 0, right_raw.width, right_raw.height))
        right_resized = right_cropped.resize((860, 700), Image.Resampling.LANCZOS)
        img.paste(right_resized, (1000, 100))
        draw.rectangle([1000, 100, 1860, 800], outline=(56, 189, 248), width=3)

    # Header Overlay
    draw.text((60, 35), "SPATIALCANVAS AI // THE PROBLEM: TRAPPED BEHIND 2D RECTANGLES", fill=(255, 255, 255), font=font_large)

    return draw_glassmorphic_lower_third(
        img,
        time_badge="0:00 - 0:13",
        act_title="ACT 1: THE 2D RECTANGLE TRAP",
        subtitle="Bridging Generative AI with Meta Quest Spatial Computing",
        voiceover_text="Generative AI has transformed creativity, but we are still trapped behind flat 2D screens. Pixels cannot convey true 1:1 scale.",
    )


def generate_scene_03_architecture():
    """Generates Cut 3: Decoupled Cloud Architecture Infographic."""
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 14, 26))
    draw = ImageDraw.Draw(img)

    # Title
    draw.text((60, 40), "SPATIALCANVAS AI // DECOUPLED CLOUD & SPATIAL AGENT ARCHITECTURE", fill=(255, 255, 255), font=font_large)
    draw.text((60, 110), "High-performance distributed pipeline powering <15ms predictive VR presence and autonomous spatial agents", fill=(148, 163, 184), font=font_sub)

    layers = [
        ("1. SPATIAL CLIENT (VR)", "#38bdf8", [
            "Meta Quest 2 / Quest 3 / Quest Pro",
            "WebXR API & Three.js 90 FPS Engine",
            "25-Joint Skeleton Hand Tracking",
            "Dual-Actuator Tactile Haptics",
            "VRAM Garbage Collection Engine",
        ]),
        ("2. TRANSPORT BUS", "#a855f7", [
            "Bi-directional WebSocket Pipeline",
            "Sub-15ms Predictive Ghost Stream",
            "Monotonic Scene Version Guard",
            "Dead-Socket Session Reaper",
            "Adaptive Jitter Exponential Backoff",
        ]),
        ("3. AGENTIC BACKEND", "#10b981", [
            "Python 3.12 + FastAPI Async Runtime",
            "PydanticAI Multi-Agent Swarm",
            "SpatialArchitectAgent (CAD Drafting)",
            "RetroMediaAgent (Synthwave Studio)",
            "Predictive Intent Heuristic Classifier",
        ]),
        ("4. STANDARDS & CLOUD", "#f59e0b", [
            "Model Context Protocol (JSON-RPC 2.0)",
            "7 Registered Spatial Computing Tools",
            "Industry Foundation Classes (IFC 4x3)",
            "Google Cloud Platform (Cloud Run)",
            "Vertex AI (Gemini 2.0 Flash) + Prometheus",
        ]),
    ]

    card_w = 400
    card_h = 580
    start_x = 60
    card_y = 170
    gap = 46

    for i, (title, color_hex, bullets) in enumerate(layers):
        x = start_x + (i * (card_w + gap))
        # Card Background
        draw.rounded_rectangle([x, card_y, x + card_w, card_y + card_h], radius=16, fill=(15, 23, 42), outline=color_hex, width=2)
        # Card Header
        draw.rounded_rectangle([x, card_y, x + card_w, card_y + 65], radius=16, fill=(30, 41, 59))
        draw.text((x + 20, card_y + 18), title, fill=color_hex, font=font_caption)

        # Bullets
        for b_idx, bullet in enumerate(bullets):
            by = card_y + 95 + (b_idx * 90)
            draw.rounded_rectangle([x + 18, by, x + card_w - 18, by + 72], radius=10, fill=(11, 15, 25), outline=(51, 65, 85), width=1)
            draw.text((x + 32, by + 22), f"• {bullet}", fill=(241, 245, 249), font=font_sub)

        # Connector Arrow (except last)
        if i < len(layers) - 1:
            arrow_x = x + card_w + 14
            arrow_y = card_y + (card_h // 2)
            draw.polygon([(arrow_x, arrow_y - 12), (arrow_x + 18, arrow_y), (arrow_x, arrow_y + 12)], fill=(148, 163, 184))

    return draw_glassmorphic_lower_third(
        img,
        time_badge="0:13 - 0:28",
        act_title="ACT 2: DECOUPLED ARCHITECTURE & MCP",
        subtitle="Python FastAPI + Google Cloud Run + PydanticAI + Model Context Protocol",
        voiceover_text="We integrated Model Context Protocol and PydanticAI to orchestrate autonomous spatial agents on Google Cloud Run.",
    )


def generate_scene_09_crt_macro():
    """Generates Cut 9: Macro close-up on curved Sony Trinitron CRT monitor."""
    base_p = os.path.join(SCREENSHOTS_DIR, "04_retro_80s_synthwave_studio.png")
    if os.path.exists(base_p):
        raw = Image.open(base_p).convert("RGB")
        # Crop center CRT screen area and zoom in
        w, h = raw.size
        crop_box = (int(w * 0.28), int(h * 0.22), int(w * 0.72), int(h * 0.78))
        cropped = raw.crop(crop_box).resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    else:
        cropped = Image.new("RGB", (WIDTH, HEIGHT), (10, 10, 20))

    # Add CRT scanline simulation overlay
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    for y in range(0, HEIGHT, 4):
        odraw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0, 75), width=1)

    # Vignette shadow
    odraw.ellipse([-100, -100, WIDTH + 100, HEIGHT + 100], outline=(0, 243, 255, 60), width=60)
    out = Image.alpha_composite(cropped.convert("RGBA"), overlay).convert("RGB")

    return draw_glassmorphic_lower_third(
        out,
        time_badge="0:52 - 0:58",
        act_title="RETRO CRT PHOSPHOR SHADERS",
        subtitle="Live Procedural Canvas Shaders & Audio Oscilloscope",
        voiceover_text="Curved CRT monitors run live procedural phosphor canvas shaders alongside spinning cassette decks and 3D holograms.",
    )


def generate_scene_12_outro():
    """Generates Cut 12: Grand Finale / Call To Action Outro Slide."""
    img = Image.new("RGB", (WIDTH, HEIGHT), (8, 12, 22))
    draw = ImageDraw.Draw(img)

    # Gradient background
    for y in range(HEIGHT):
        ratio = y / float(HEIGHT)
        r = int(8 + (ratio * 15))
        g = int(12 + (ratio * 25))
        b = int(22 + (ratio * 55))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

    # Center Hero Card
    card_w, card_h = 1300, 680
    cx = (WIDTH - card_w) // 2
    cy = 120
    draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=24, fill=(15, 23, 42, 230), outline=(56, 189, 248), width=3)

    # Logo / Title
    draw.text((cx + 80, cy + 60), "SPATIALCANVAS AI", fill=(56, 189, 248), font=get_font(68, bold=True))
    draw.text((cx + 80, cy + 145), "The Agentic Spatial Operating System for Meta Quest", fill=(241, 245, 249), font=get_font(34, bold=False))

    # Badges bar
    badges = [
        "🥽 Meta Quest 2 / 3 / Pro",
        "☁️ Google Cloud Platform",
        "🤖 PydanticAI Multi-Agent",
        "📡 Model Context Protocol (MCP)",
        "📐 BIM IFC 4x3 Certified",
    ]
    for b_idx, badge in enumerate(badges):
        bx = cx + 80 + (b_idx * 230)
        draw.rounded_rectangle([bx, cy + 220, bx + 215, cy + 265], radius=10, fill=(30, 41, 59), outline=(56, 189, 248), width=1)
        draw.text((bx + 14, cy + 232), badge, fill=(241, 245, 249), font=get_font(15, bold=True))

    # Key Accomplishments Box
    draw.rounded_rectangle([cx + 80, cy + 300, cx + card_w - 80, cy + 490], radius=14, fill=(11, 15, 25), outline=(51, 65, 85), width=1)
    draw.text((cx + 110, cy + 325), "🏆 Dual Flagship Showcases: 1:1 Biophilic G+1 Farmhouse & 1980s Retro Synthwave Studio", fill=(248, 250, 252), font=get_font(24, bold=True))
    draw.text((cx + 110, cy + 375), "⚡ Sub-15ms Predictive Ghost State Engine prevents VR nausea during Cloud LLM reasoning", fill=(56, 189, 248), font=get_font(24, bold=False))
    draw.text((cx + 110, cy + 425), "🛠️ Model Context Protocol (MCP) JSON-RPC 2.0 Server with 7 tools & IFC 4x3 BIM Export", fill=(148, 163, 184), font=get_font(24, bold=False))

    # CTA Button
    draw.rounded_rectangle([cx + 420, cy + 535, cx + 880, cy + 620], radius=14, fill=(14, 165, 233))
    draw.text((cx + 455, cy + 555), "🚀 EXPERIENCE SPATIALCANVAS AI", fill=(255, 255, 255), font=get_font(28, bold=True))

    return draw_glassmorphic_lower_third(
        img,
        time_badge="1:07 - 1:15",
        act_title="THE FUTURE OF COMPUTING IS SPATIAL",
        subtitle="Open Source Architecture on GCP Cloud Run & Meta Quest WebXR",
        voiceover_text="Generative AI is no longer confined to pixels on a screen—you can now step inside your creations. Experience SpatialCanvas AI today!",
    )


# ----------------- Master Storyboard Manifest -----------------

STORYBOARD_CUTS = [
    {
        "id": "scene_01_problem_2d_rectangle_trap",
        "time": "0:00 - 0:06",
        "act": "ACT 1: THE 2D RECTANGLE TRAP",
        "sub": "Screen-Bound Pixels Cannot Convey True 1:1 Scale",
        "vo": "Generative AI has revolutionized creativity, but we are still trapped behind flat 2D screens.",
        "generator": generate_scene_01_problem,
        "duration_seconds": 6,
    },
    {
        "id": "scene_02_hero_spatial_os_overview",
        "time": "0:06 - 0:13",
        "act": "SPATIALCANVAS AI // SPATIAL OS",
        "sub": "Stepping Directly Inside Your Prompts in Room-Scale VR",
        "vo": "This is SpatialCanvas AI—an agentic spatial operating system for Meta Quest that lets you step inside your prompts.",
        "src_file": "01_hero_spatial_os_overview.png",
        "duration_seconds": 7,
    },
    {
        "id": "scene_03_system_architecture_diagram",
        "time": "0:13 - 0:20",
        "act": "ACT 2: DECOUPLED CLOUD ARCHITECTURE",
        "sub": "Python FastAPI + GCP Cloud Run + PydanticAI + Model Context Protocol",
        "vo": "Cloud AI latency destroys VR immersion. We solved this with a decoupled architecture on Google Cloud Platform.",
        "generator": generate_scene_03_architecture,
        "duration_seconds": 7,
    },
    {
        "id": "scene_04_predictive_ghost_engine",
        "time": "0:20 - 0:28",
        "act": "SUB-15ms PREDICTIVE GHOST ENGINE",
        "sub": "Real-Time Holographic State Masking Cloud LLM Latency",
        "vo": "The moment you speak, our Predictive State Engine projects an animated ghost wireframe in under 15 milliseconds.",
        "src_file": "05_predictive_ghost_wireframes.png",
        "duration_seconds": 8,
    },
    {
        "id": "scene_05_farmhouse_ground_floor",
        "time": "0:28 - 0:37",
        "act": "SHOWCASE 1: 1:1 SCALE G+1 FARMHOUSE",
        "sub": "8m Living Hall, 3.6m Ceiling & Biophilic Courtyard",
        "vo": "Here is our 1:1 scale G+1 Sustainable Farmhouse. I can physically walk through this 8-meter living hall and courtyard.",
        "src_file": "02_farmhouse_ground_floor_walkthrough.png",
        "duration_seconds": 9,
    },
    {
        "id": "scene_06_farmhouse_sunroom_pergola",
        "time": "0:37 - 0:45",
        "act": "G+1 FIRST FLOOR EXTENSION",
        "sub": "Low-E Curtain Glazed Sunroom & Cedar Pergola Deck",
        "vo": "Our agent drafted the first-floor east sunroom and cedar pergola deck with exact metric scale before anything is built.",
        "src_file": "03_farmhouse_sunroom_pergola.png",
        "duration_seconds": 8,
    },
    {
        "id": "scene_07_quest_hand_tracking_palette",
        "time": "0:45 - 0:52",
        "act": "META QUEST HAND TRACKING & HAPTICS",
        "sub": "25-Joint Micro-Pinch Mechanics & 3D Spatial Palette",
        "vo": "With a natural pinch gesture and tactile controller haptics, we summon the 3D in-VR spatial palette to switch contexts.",
        "src_file": "06_quest_hand_tracking_vr_palette.png",
        "duration_seconds": 7,
    },
    {
        "id": "scene_08_retro_synthwave_studio",
        "time": "0:52 - 0:58",
        "act": "SHOWCASE 2: 1980s RETRO MEDIA STUDIO",
        "sub": "Neon Horizon Sun, Grid Void & Curved Sony Trinitron CRTs",
        "vo": "Welcome to our 1980s retro creation studio—complete with infinite neon grid, horizon sun, and floating CRT arrays.",
        "src_file": "04_retro_80s_synthwave_studio.png",
        "duration_seconds": 6,
    },
    {
        "id": "scene_09_crt_scanlines_macro",
        "time": "0:58 - 1:02",
        "act": "PROCEDURAL PHOSPHOR CRT SHADERS",
        "sub": "Real-Time WebGL Canvas Shaders & Audio Oscilloscope",
        "vo": "These curved CRT monitors run live procedural phosphor canvas shaders alongside spinning cassette decks and holograms.",
        "generator": generate_scene_09_crt_macro,
        "duration_seconds": 4,
    },
    {
        "id": "scene_10_mcp_agentic_thought_stream",
        "time": "1:02 - 1:07",
        "act": "MODEL CONTEXT PROTOCOL (JSON-RPC 2.0)",
        "sub": "PydanticAI Multi-Agent Reasoning Tokens & Tool Execution",
        "vo": "Every spatial decision is streamed in real-time through the Model Context Protocol JSON-RPC 2.0 standard.",
        "src_file": "07_mcp_agentic_thought_stream.png",
        "duration_seconds": 5,
    },
    {
        "id": "scene_11_bim_ifc_structural_telemetry",
        "time": "1:07 - 1:11",
        "act": "ENTERPRISE BIM (IFC 4x3) & PROMETHEUS",
        "sub": "Load Ratings (48.5 kN/m), F120 Fire Specs & Cloud Monitoring",
        "vo": "SpatialCanvas AI outputs mathematically sound Industry Foundation Classes BIM data models ready for Revit and ArchiCAD.",
        "src_file": "08_bim_ifc_structural_telemetry.png",
        "duration_seconds": 4,
    },
    {
        "id": "scene_12_call_to_action_outro",
        "time": "1:11 - 1:15",
        "act": "THE FUTURE OF COMPUTING IS SPATIAL",
        "sub": "Live on Google Cloud Run & Ready for Meta Quest",
        "vo": "Generative AI is no longer confined to pixels on a screen—you can now step inside your creations. Experience SpatialCanvas AI today!",
        "generator": generate_scene_12_outro,
        "duration_seconds": 4,
    },
]


def render_all_storyboard_cuts():
    """Renders all 12 scene cuts into video_assets/storyboard/ at 1920x1080."""
    print("🎬 Rendering 12 Master Storyboard Scene Cuts (1920x1080)...")
    rendered_images = []

    for cut in STORYBOARD_CUTS:
        filename = f"{cut['id']}.png"
        out_path = os.path.join(STORYBOARD_DIR, filename)

        if "generator" in cut:
            img = cut["generator"]()
        else:
            src_path = os.path.join(SCREENSHOTS_DIR, cut["src_file"])
            if os.path.exists(src_path):
                raw = Image.open(src_path).convert("RGB")
                raw_resized = raw.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
                img = draw_glassmorphic_lower_third(
                    raw_resized,
                    time_badge=cut["time"],
                    act_title=cut["act"],
                    subtitle=cut["sub"],
                    voiceover_text=cut["vo"],
                )
            else:
                print(f"⚠️ Missing source {src_path}, using placeholder")
                img = Image.new("RGB", (WIDTH, HEIGHT), (15, 23, 42))

        img.save(out_path, quality=95)
        rendered_images.append((out_path, cut["duration_seconds"], cut["id"]))
        print(f"  ✅ Rendered Cut: {filename} ({cut['time']})")

        # Copy to artifacts directory
        artifact_path = os.path.join(ARTIFACTS_DIR, filename)
        shutil.copy2(out_path, artifact_path)

    return rendered_images


def compile_presentation_video(rendered_cuts):
    """Compiles the rendered storyboard cuts into an MP4 video (1080p, 30fps) and animated GIF."""
    mp4_out = os.path.join(VIDEO_ASSETS_DIR, "spatialcanvas_presentation_pitch.mp4")
    gif_out = os.path.join(VIDEO_ASSETS_DIR, "spatialcanvas_presentation_pitch.gif")
    fps = 30

    print(f"\n🎥 Compiling Master Video: {mp4_out} (1080p @ 30 FPS)...")
    gif_frames = []

    # Pre-build GIF sample frames
    for idx, (img_path, duration_s, cut_id) in enumerate(rendered_cuts):
        base_img = Image.open(img_path).convert("RGB")
        gif_sample = base_img.resize((GIF_WIDTH, GIF_HEIGHT), Image.Resampling.LANCZOS)
        gif_frames.append((gif_sample, int(duration_s * 1000)))

    # 1. Compile MP4 Video
    try:
        writer = imageio.get_writer(
            mp4_out,
            fps=fps,
            codec="libx264",
            quality=8,
            pixelformat="yuv420p",
        )

        for idx, (img_path, duration_s, cut_id) in enumerate(rendered_cuts):
            base_img = Image.open(img_path).convert("RGB")
            frame_np = np.array(base_img)

            # Hold frames
            hold_count = int(duration_s * fps)
            has_next = idx < len(rendered_cuts) - 1
            fade_count = 12 if has_next else 0
            static_count = max(1, hold_count - fade_count)

            # Write static frames
            for _ in range(static_count):
                writer.append_data(frame_np)

            # Crossfade transition
            if has_next:
                next_path = rendered_cuts[idx + 1][0]
                next_img = Image.open(next_path).convert("RGB")
                for f_step in range(1, fade_count + 1):
                    alpha = f_step / float(fade_count)
                    blended = Image.blend(base_img, next_img, alpha)
                    writer.append_data(np.array(blended))

        writer.close()
        file_size_mb = os.path.getsize(mp4_out) / (1024 * 1024)
        print(f"🎉 Master 1080p MP4 Presentation Video generated: {mp4_out} ({file_size_mb:.2f} MB)")
        shutil.copy2(mp4_out, os.path.join(ARTIFACTS_DIR, "spatialcanvas_presentation_pitch.mp4"))

    except Exception as e:
        print(f"⚠️ Error compiling MP4: {e}")

    # Compile animated GIF
    print(f"\n🎞️ Compiling Web-Optimized Demo GIF: {gif_out} ({GIF_WIDTH}x{GIF_HEIGHT})...")
    try:
        first_frame, first_dur = gif_frames[0]
        rest_frames = [f[0] for f in gif_frames[1:]]
        durations = [f[1] for f in gif_frames]

        first_frame.save(
            gif_out,
            save_all=True,
            append_images=rest_frames,
            duration=durations,
            loop=0,
            optimize=True,
        )
        gif_size_mb = os.path.getsize(gif_out) / (1024 * 1024)
        print(f"🎉 Animated Presentation Demo GIF generated: {gif_out} ({gif_size_mb:.2f} MB)")
        shutil.copy2(gif_out, os.path.join(ARTIFACTS_DIR, "spatialcanvas_presentation_pitch.gif"))

    except Exception as e:
        print(f"⚠️ Error compiling GIF: {e}")


def main():
    print("🚀 SpatialCanvas AI — Generating All Presentation Video Visuals & Storyboard Suite...")
    cuts = render_all_storyboard_cuts()
    compile_presentation_video(cuts)
    print("\n✨ All video visuals, 1080p storyboard cuts, MP4 video, and presentation GIF created successfully!")


if __name__ == "__main__":
    main()
