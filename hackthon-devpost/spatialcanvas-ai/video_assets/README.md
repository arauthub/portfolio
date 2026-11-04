# 🎬 SpatialCanvas AI — Video Presentation Visuals & Storyboard Suite

This directory contains the complete visual asset collection and compiled presentation video matching the master script in [`VIDEO_PRESENTATION_SCRIPT.md`](../VIDEO_PRESENTATION_SCRIPT.md).

---

## 🎥 Master Video Files

| Asset | Format | Specs | File Link |
| :--- | :--- | :--- | :--- |
| **Master Pitch Video** | MP4 (H.264) | 1920x1080 Full HD @ 30 FPS, 75s Duration, 12.2 MB | [`spatialcanvas_presentation_pitch.mp4`](spatialcanvas_presentation_pitch.mp4) |
| **Web-Optimized Demo GIF** | Animated GIF | 960x540, 1.18 MB, Smooth Loops | [`spatialcanvas_presentation_pitch.gif`](spatialcanvas_presentation_pitch.gif) |

---

## 🖼️ 1080p Master Storyboard Cuts (`storyboard/`)

Every cut features a customized glassmorphic HUD lower-third banner with precise timing indicators, act titles, technical specifications, and voiceover subtitles:

| Cut # & File | Timing | Act Title & Scene | Voiceover & Functional Highlights |
| :--- | :--- | :--- | :--- |
| **01** [`scene_01_problem_2d_rectangle_trap.png`](storyboard/scene_01_problem_2d_rectangle_trap.png) | `0:00 - 0:06` | **ACT 1: The 2D Rectangle Trap** | Split-screen showing flat, screen-bound 2D CAD vs immersive 3D spatial prompt portal. |
| **02** [`scene_02_hero_spatial_os_overview.png`](storyboard/scene_02_hero_spatial_os_overview.png) | `0:06 - 0:13` | **Spatial OS Hero Overview** | Visionary creator stepping inside the prompt, uniting 1:1 architecture and 80s synthwave media. |
| **03** [`scene_03_system_architecture_diagram.png`](storyboard/scene_03_system_architecture_diagram.png) | `0:13 - 0:20` | **ACT 2: Decoupled Cloud Architecture** | 4-layer architecture: WebXR (90 FPS) ➔ WebSockets ➔ FastAPI Cloud Run ➔ PydanticAI + MCP. |
| **04** [`scene_04_predictive_ghost_engine.png`](storyboard/scene_04_predictive_ghost_engine.png) | `0:20 - 0:28` | **Sub-15ms Predictive Ghost Engine** | Holographic cyan wireframe state masking cloud LLM latency for zero-nausea VR presence. |
| **05** [`scene_05_farmhouse_ground_floor.png`](storyboard/scene_05_farmhouse_ground_floor.png) | `0:28 - 0:37` | **Showcase 1: 1:1 Scale G+1 Farmhouse** | 8m living hall, 3.6m double-height clearance, and open-to-sky biophilic courtyard. |
| **06** [`scene_06_farmhouse_sunroom_pergola.png`](storyboard/scene_06_farmhouse_sunroom_pergola.png) | `0:37 - 0:45` | **G+1 First Floor Extension** | East-facing sunroom studio with low-E curtain glazing ($U=1.15$) and cedar pergola terrace deck. |
| **07** [`scene_07_quest_hand_tracking_palette.png`](storyboard/scene_07_quest_hand_tracking_palette.png) | `0:45 - 0:52` | **Meta Quest Hand Tracking & Haptics** | 25-joint skeleton pinch detection summoning the 3D in-VR Spatial Palette with tactile haptics. |
| **08** [`scene_08_retro_synthwave_studio.png`](storyboard/scene_08_retro_synthwave_studio.png) | `0:52 - 0:58` | **Showcase 2: 1980s Retro Media Studio** | Sliced glowing horizon sun, neon perspective grid floor, curved CRT monitors, and cassette decks. |
| **09** [`scene_09_crt_scanlines_macro.png`](storyboard/scene_09_crt_scanlines_macro.png) | `0:58 - 1:02` | **Retro CRT Phosphor Shaders** | Macro zoom into curved Sony Trinitron CRT monitor running live green/cyan phosphor scanlines. |
| **10** [`scene_10_mcp_agentic_thought_stream.png`](storyboard/scene_10_mcp_agentic_thought_stream.png) | `1:02 - 1:07` | **Model Context Protocol (JSON-RPC 2.0)** | Real-time PydanticAI streaming reasoning HUD logging spatial tool execution latencies. |
| **11** [`scene_11_bim_ifc_structural_telemetry.png`](storyboard/scene_11_bim_ifc_structural_telemetry.png) | `1:07 - 1:11` | **Enterprise BIM (IFC 4x3) & Telemetry** | Parametric structural loads ($48.5\text{ kN/m}$), $F_{120}$ fire ratings, and Prometheus `/metrics`. |
| **12** [`scene_12_call_to_action_outro.png`](storyboard/scene_12_call_to_action_outro.png) | `1:11 - 1:15` | **The Future of Computing is Spatial** | Grand finale title card with Google Cloud Run, Meta Quest, GitHub repo, and call to action. |

---

## 🛠️ Reproduction & Assembly Script

To re-render all visual storyboard slides and compile the master MP4 video:
```bash
./venv/bin/python scripts/generate_video_visuals.py
```
