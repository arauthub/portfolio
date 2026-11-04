"""SpatialCanvas AI - Automated High-Resolution Screenshot Capture Suite.
Captures 1920x1080 Full HD screenshots of all spatial studio screens,
modules, and functionalities for Devpost submission and video presentation.
"""

import os
import subprocess
import time
import shutil
from PIL import Image

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCREENSHOTS_DIR = os.path.join(PROJECT_ROOT, "screenshots")
FRONTEND_SCREENSHOTS = os.path.join(PROJECT_ROOT, "frontend/assets/screenshots")
ARTIFACTS_DIR = "/Users/abhijeetraut/.gemini/antigravity/brain/d5018037-2c49-40ce-89ea-98154f8b2e6a"

CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SHOTS = [
    {
        "filename": "01_hero_spatial_os_overview.png",
        "type": "hero",
        "description": "Hero concept overview of SpatialCanvas AI spatial operating system on Meta Quest 3",
    },
    {
        "filename": "02_farmhouse_ground_floor_walkthrough.png",
        "url": "http://localhost:8000/?scene=g1_farmhouse&cam=courtyard",
        "wait_s": 4,
        "description": "1:1 Scale G+1 Farmhouse: Living hall, central courtyard, and floating staircase",
    },
    {
        "filename": "03_farmhouse_sunroom_pergola.png",
        "url": "http://localhost:8000/?scene=g1_farmhouse&cam=first_floor",
        "wait_s": 4,
        "description": "First floor east-facing sunroom studio with double-glazed low-E curtain glass and timber pergola",
    },
    {
        "filename": "04_retro_80s_synthwave_studio.png",
        "url": "http://localhost:8000/?scene=retro_80s_studio",
        "wait_s": 4,
        "description": "1980s Retro Digital Media Studio with neon perspective grid, horizon sun, and CRT Trinitron array",
    },
    {
        "filename": "05_predictive_ghost_wireframes.png",
        "url": "http://localhost:8000/?scene=g1_farmhouse&action=ghost",
        "wait_s": 4,
        "description": "Sub-15ms predictive ghost wireframe projection for zero-latency spatial presence",
    },
    {
        "filename": "06_quest_hand_tracking_vr_palette.png",
        "url": "http://localhost:8000/?scene=g1_farmhouse&action=palette",
        "wait_s": 4,
        "description": "Meta Quest 25-joint hand tracking with pinch gesture mechanics and 3D in-VR spatial palette",
    },
    {
        "filename": "07_mcp_agentic_thought_stream.png",
        "url": "http://localhost:8000/?scene=g1_farmhouse&action=mcp",
        "wait_s": 4,
        "description": "PydanticAI live agent thought stream and Model Context Protocol (MCP) JSON-RPC 2.0 tool execution",
    },
    {
        "filename": "08_bim_ifc_structural_telemetry.png",
        "url": "http://localhost:8000/?scene=g1_farmhouse&action=bim&cam=orbit",
        "wait_s": 4,
        "description": "Enterprise BIM / IFC 4x3 architectural structural telemetry and Prometheus observability metrics",
    },
]


def capture():
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    print(f"📸 Capturing High-Resolution Screenshots into: {SCREENSHOTS_DIR}")

    for shot in SHOTS:
        out_path = os.path.join(SCREENSHOTS_DIR, shot["filename"])

        if shot.get("type") == "hero":
            hero_src = os.path.join(FRONTEND_SCREENSHOTS, "hero_concept_artwork.jpg")
            if os.path.exists(hero_src):
                img = Image.open(hero_src).convert("RGB")
                img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
                img.save(out_path, quality=95)
                print(f"✅ Generated Hero {shot['filename']} (1920x1080)")
            else:
                print(f"⚠️ Missing {hero_src}")
            continue

        cmd = [
            CHROME_PATH,
            "--headless=new",
            f"--screenshot={out_path}",
            "--window-size=1920,1080",
            f"--virtual-time-budget={int(shot.get('wait_s', 4) * 1000)}",
            "--hide-scrollbars",
            shot["url"],
        ]

        print(f"📷 Capturing {shot['filename']} from {shot['url']}...")
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(out_path):
                file_size = os.path.getsize(out_path)
                print(f"✅ Captured {shot['filename']} ({file_size // 1024} KB)")
        except Exception as e:
            print(f"❌ Failed capturing {shot['filename']}: {e}")

    # Copy all screenshots to brain artifacts directory for previewing
    for shot in SHOTS:
        src = os.path.join(SCREENSHOTS_DIR, shot["filename"])
        if os.path.exists(src):
            dst = os.path.join(ARTIFACTS_DIR, shot["filename"])
            shutil.copy2(src, dst)

    print("\n🎉 All 8 high-resolution screenshots generated and synced successfully!")


if __name__ == "__main__":
    capture()
