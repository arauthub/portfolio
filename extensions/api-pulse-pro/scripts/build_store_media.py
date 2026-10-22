#!/usr/bin/env python3
import os
import subprocess
import sys

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
STAGING_DIR = os.path.join(BASE_DIR, "staging")
SHOTS_DIR = os.path.join(ROOT_DIR, "store-assets", "screenshots")
PROMO_DIR = os.path.join(ROOT_DIR, "store-assets", "promo")

os.makedirs(SHOTS_DIR, exist_ok=True)
os.makedirs(PROMO_DIR, exist_ok=True)

TASKS = [
    {
        "name": "screenshot1_studio_workbench.png",
        "html": os.path.join(ROOT_DIR, "studio", "studio.html"),
        "dest": os.path.join(SHOTS_DIR, "screenshot1_studio_workbench.png"),
        "width": 1280,
        "height": 800
    },
    {
        "name": "screenshot2_floating_hud.png",
        "html": os.path.join(STAGING_DIR, "stage_hud.html"),
        "dest": os.path.join(SHOTS_DIR, "screenshot2_floating_hud.png"),
        "width": 1280,
        "height": 800
    },
    {
        "name": "screenshot3_mock_engine.png",
        "html": os.path.join(ROOT_DIR, "studio", "studio.html") + "#mock",
        "dest": os.path.join(SHOTS_DIR, "screenshot3_mock_engine.png"),
        "width": 1280,
        "height": 800
    },
    {
        "name": "screenshot4_replay_studio.png",
        "html": os.path.join(ROOT_DIR, "studio", "studio.html") + "#tab=replay",
        "dest": os.path.join(SHOTS_DIR, "screenshot4_replay_studio.png"),
        "width": 1280,
        "height": 800
    },
    {
        "name": "screenshot5_types_security.png",
        "html": os.path.join(ROOT_DIR, "studio", "studio.html") + "#tab=types",
        "dest": os.path.join(SHOTS_DIR, "screenshot5_types_security.png"),
        "width": 1280,
        "height": 800
    },
    {
        "name": "promo_small_440x280.png",
        "html": os.path.join(STAGING_DIR, "stage_promo_small.html"),
        "dest": os.path.join(PROMO_DIR, "promo_small_440x280.png"),
        "width": 440,
        "height": 280
    },
    {
        "name": "promo_marquee_1400x560.png",
        "html": os.path.join(STAGING_DIR, "stage_promo_marquee.html"),
        "dest": os.path.join(PROMO_DIR, "promo_marquee_1400x560.png"),
        "width": 1400,
        "height": 560
    }
]

def main():
    print("🎨 Rendering Chrome Web Store visual assets using Headless Chrome...")
    for t in TASKS:
        file_url = f"file://{t['html']}"
        cmd = [
            CHROME_BIN,
            "--headless",
            "--disable-gpu",
            f"--screenshot={t['dest']}",
            f"--window-size={t['width']},{t['height']}",
            "--hide-scrollbars",
            file_url
        ]
        print(f"📸 Generating {t['name']} ({t['width']}x{t['height']})...")
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if os.path.exists(t['dest']) and os.path.getsize(t['dest']) > 0:
            print(f"  ✅ Saved: {t['dest']} ({os.path.getsize(t['dest'])} bytes)")
        else:
            print(f"  ❌ Failed to generate {t['name']}: {res.stderr}")

    print("\n🎉 All Chrome Web Store visual assets generated successfully!")

if __name__ == "__main__":
    main()
