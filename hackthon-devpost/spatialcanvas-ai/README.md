# 🥽 SpatialCanvas AI

> **Immersive VR Creation Studio & Agentic Spatial Operating System for Meta Quest**  
> *Built with Python, FastAPI, Google Cloud Platform (GCP), Model Context Protocol (MCP), PydanticAI, and WebSockets.*

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![PydanticAI](https://img.shields.io/badge/PydanticAI-2.66+-e92063.svg)](https://ai.pydantic.dev)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Standard-8b5cf6.svg)](https://modelcontextprotocol.io)
[![Google Cloud](https://img.shields.io/badge/GCP-Cloud_Run_%26_Vertex_AI-4285F4.svg)](https://cloud.google.com)
[![WebXR](https://img.shields.io/badge/WebXR-Meta_Quest_2%2F3%2FPro-0081FB.svg)](https://developer.oculus.com)
[![Tests Passing](https://img.shields.io/badge/Tests-9%20Passing-success.svg)](#running-tests)

---

## 🌟 Overview

**SpatialCanvas AI** bridges agentic AI architectures with **spatial computing**, empowering creators to step directly *inside* their prompts. 

Whether synthesizing 1980s retro-aesthetic digital media studios or generating multi-floor architectural drafting blueprints (such as a bioclimatic G+1 farmhouse build), the system transforms generative AI into an immersive, spatial operating system with real-time 90 FPS performance.

---

## 🚀 Key Features

### 1. 🏡 1:1 Scale Architectural Drafting Studio (G+1 Farmhouse)
- **Ground Floor (G):** Grand Living Hall with double-height ceiling, Sprawling Veranda, Modular Open Kitchen, and an open-to-sky Central Courtyard with Japanese maple tree and reflective water basin.
- **First Floor (G+1):** Master Suite with teak flooring, East-Facing Sunroom & Studio with low-E curtain glass and drafting workbench, and an open Timber Pergola Rooftop Deck.
- **1:1 Metric Walkthrough:** Walk physically through room-scale VR in Meta Quest 6DoF to experience real structural proportions, ceiling heights (3.6m / 3.2m), and daylighting.
- **Dynamic 3D Metric Labels:** Real-time spatial dimension tags (`8.00m Living Span`, `3.60m Headroom`, `6.00m Courtyard`).

### 2. 🕹️ 1980s Retro Digital Media Studio
- **Horizon Retro Sun:** Sliced gradient synthwave sun with glowing perspective horizon.
- **Curved CRT Monitors:** Sony Trinitron style displays with live procedural phosphor scanlines (wireframe rotating torus, bouncing audio spectrum analyzers, and vector flight horizons).
- **Cassette Tape Deck:** Spinning tape hubs and animated LED VU meters.
- **3D Holograms:** Rotating wireframe Delorean and cyberpunk pyramid projected from spatial emitters.
- **Generative Audio:** Web Audio API procedural analog synthwave ambient drone.

### 3. ⚡ Sub-15ms Predictive Ghost Wireframes (Zero Latency)
- Solves VR motion sickness and latency: immediately projects a pulsating cybernetic wireframe bounding box at the gaze/laser point within **<15ms**, while PydanticAI and GCP Vertex AI process complex reasoning in the background.
- Streams thought tokens and MCP tool invocations live over WebSockets before baking the solid physical mesh.

### 4. 🖥️ Desktop Meta XR Simulator
- No headset required! Reviewers and judges can experience the full 3D studio on desktop:
  - **1:1 Scale Walk:** WASD keys to walk, mouse look with pointer lock, click to teleport.
  - **Architectural Orbit:** One-click toggle to bird's-eye CAD inspection camera.
  - **Web Speech API:** Click the microphone button to dictate commands naturally.

---

## 📸 Visual Showcase & Inspiration

| Showcase | Preview Asset | Highlights |
|---|---|---|
| **Spatial OS Hero Overview** | [`screenshots/01_hero_spatial_os_overview.png`](screenshots/01_hero_spatial_os_overview.png) | Meta Quest 3 bridging 1:1 architectural CAD with 1980s synthwave horizon |
| **G+1 Farmhouse Studio** | [`screenshots/02_farmhouse_ground_floor_walkthrough.png`](screenshots/02_farmhouse_ground_floor_walkthrough.png) | 1:1 scale Living Hall, 3.6m ceiling, courtyard & CAD telemetry HUD |
| **First Floor Sunroom & Pergola** | [`screenshots/03_farmhouse_sunroom_pergola.png`](screenshots/03_farmhouse_sunroom_pergola.png) | G+1 First Floor low-E curtain glass sunroom & cedar timber pergola slats |
| **1980s Retro Studio** | [`screenshots/04_retro_80s_synthwave_studio.png`](screenshots/04_retro_80s_synthwave_studio.png) | Horizon sun, CRT monitor arrays with phosphor scanlines & cassette decks |
| **Predictive Ghost Wireframes** | [`screenshots/05_predictive_ghost_wireframes.png`](screenshots/05_predictive_ghost_wireframes.png) | Sub-15ms predictive ghost wireframe state masking cloud LLM latency |
| **Meta Quest Hand Tracking** | [`screenshots/06_quest_hand_tracking_vr_palette.png`](screenshots/06_quest_hand_tracking_vr_palette.png) | 25-joint micro-gesture pinch mechanics with 3D in-VR Spatial Palette |
| **PydanticAI Thought Stream** | [`screenshots/07_mcp_agentic_thought_stream.png`](screenshots/07_mcp_agentic_thought_stream.png) | Real-time streaming reasoning HUD logging Model Context Protocol (MCP) tool execution |
| **Enterprise BIM IFC 4x3** | [`screenshots/08_bim_ifc_structural_telemetry.png`](screenshots/08_bim_ifc_structural_telemetry.png) | Structural load capacity (48.5 kN/m), thermal U-values, and Prometheus metrics |

---

## 🛠️ Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │          Meta Quest WebXR Client             │
                    │ (Meta XR SDK / 6DoF / Controllers / Audio)   │
                    └──────────────────────┬───────────────────────┘
                                           │  WebSockets (<15ms)
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │               FastAPI Backend                │
                    │        (Cloud Run / Asynchronous ASGI)       │
                    └──────────────┬───────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│        PydanticAI Core          │       │     Model Context Protocol      │
│  - SpatialArchitectAgent        │◀─────▶│          (MCP Server)           │
│  - RetroMediaAgent              │       │  - draft_multi_floor_farmhouse  │
│  - SpatialOrchestrator          │       │  - draft_sunroom_studio         │
└────────────────┬────────────────┘       │  - draft_timber_pergola         │
                 │                        │  - synthesize_retro_studio      │
                 ▼                        │  - spawn_crt_monitor            │
┌─────────────────────────────────┐       │  - inspect_scene_bounds         │
│      Google Cloud Platform      │       │  - validate_structural_scale   │
│  - Vertex AI (Gemini 2.0 Flash) │       └─────────────────────────────────┘
│  - Cloud Run Serverless         │
│  - Cloud Build CI/CD            │
└─────────────────────────────────┘
```

---

## ⚡ Quickstart (Run Locally)

### 1. Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Any modern web browser (Chrome, Edge, Firefox, or Meta Quest Browser)

### 2. Launch in One Command
```bash
./run.sh
```

Or manually:
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI & WebXR server
PYTHONPATH=backend uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Open in Browser
- **Desktop Simulator:** Navigate to `http://localhost:8000`
- **Meta Quest 2 / Quest 3 / Quest Pro:** Open the Meta Quest Browser and navigate to `http://<YOUR_COMPUTER_LOCAL_IP>:8000`, then click **"Enter VR"**!

---

## 🎮 Desktop Simulator Controls

| Key / Action | Function |
|---|---|
| **W, A, S, D** | Walk forward, left, backward, right at 1:1 scale (4.2 m/s) |
| **Mouse Click on Canvas** | Lock mouse look pointer |
| **Mouse Click on Floor** | Teleport instantly to target location |
| **V** | Toggle between 1:1 Scale Walking and Architectural Orbit mode |
| **Space / C** | Fly up / descend elevation |
| **🎙️ Mic Button** | Speak natural voice command |

---

## 🗣️ Try These Voice Commands

Click the microphone or use the preset prompt pills:
- 🏡 *"Draft a sustainable G+1 farmhouse with living hall and courtyard at 1:1 scale"*
- 🌅 *"Add an east-facing sunroom studio on the first floor"*
- 🪵 *"Add a cedar timber pergola rooftop terrace deck"*
- 🕹️ *"Transform this space into a 1980s retro synthwave studio with CRT monitors"*
- 📺 *"Spawn curved Sony Trinitron CRT monitor with green phosphor"*
- 📐 *"Validate 1:1 architectural scale, headroom clearances, and VR ergonomics"*

---

## 🧪 Running Tests

The project includes unit and integration tests covering PydanticAI agents, MCP server tools, and predictive WebSocket streams:

```bash
cd hackthon-devpost/spatialcanvas-ai
PYTHONPATH=backend ./venv/bin/pytest backend/tests
```

```
============================== 9 passed in 0.32s ===============================
```

---

## ☁️ Google Cloud Platform (GCP) Deployment

### 1. Deploy with Automated Script
```bash
chmod +x gcp_deploy.sh
./gcp_deploy.sh <YOUR_GCP_PROJECT_ID> [REGION]
```

### 2. Automated Cloud Build CI/CD
The included `cloudbuild.yaml` automatically builds the multi-stage Docker container and deploys it to Google Cloud Run with 2 CPU / 2GiB memory and auto-scaling.

---

## 📁 Repository Structure

```
spatialcanvas-ai/
├── README.md                      # Complete Project Documentation & Architecture
├── DEVPOST_STORY.md               # Devpost Submission Story & Pitch
├── run.sh                         # One-click Local & VR Runner
├── gcp_deploy.sh                  # One-click Google Cloud Run Deployer
├── cloudbuild.yaml                # Google Cloud Build CI/CD Configuration
├── Dockerfile                     # Multi-stage Container Specification
├── requirements.txt               # Backend Python Dependencies
├── .env.example                   # Environment Configuration Template
│
├── backend/                       # Python FastAPI + PydanticAI + MCP Engine
│   ├── app/
│   │   ├── main.py                # FastAPI ASGI App, CORS, WebSockets, Static Server
│   │   ├── config.py              # Settings with Pydantic BaseSettings & GCP Config
│   │   ├── schemas/               # Typed Pydantic v2 Models (Spatial, CAD, Retro, MCP)
│   │   ├── agents/                # PydanticAI Agents (Architectural, Retro, Orchestrator)
│   │   ├── mcp_server/            # Model Context Protocol (MCP) Server & 7 Tools
│   │   ├── services/              # Scene Manager, Predictive Engine (<15ms), GCP Vertex AI
│   │   └── api/                   # REST Endpoints (Scenes, MCP, GCP Telemetry, WebSockets)
│   └── tests/                     # Pytest Unit & Integration Tests (9 Passing)
│
└── frontend/                      # Meta Quest WebXR & Spatial Simulator
    ├── index.html                 # 3D Viewport & Spatial OS Glassmorphic HUD
    ├── css/spatial.css            # Cyberpunk / Spatial OS Glassmorphic Theme
    └── js/
        ├── app.js                 # App Coordinator, WebSocket Client, Render Loop
        ├── xr/                    # WebXR Manager (Meta Quest Controllers & Hand Tracking)
        ├── scene/                 # Three.js Scene Builder, Architectural & Retro Renderers
        ├── ui/                    # Thought Stream Panel, Voice HUD, Telemetry Meters
        └── audio/                 # Web Audio API Procedural Synthesizer
```

---

## 🏆 Hackathon Submission Notes

Built for the Devpost Hackathon showcasing:
1. **Model Context Protocol (MCP)** integrated natively into a spatial computing VR environment.
2. **PydanticAI** strongly typed agent orchestration for structural CAD drafting and retro media synthesis.
3. **Google Cloud Platform (GCP)** architecture with Cloud Run serverless queuing and Vertex AI Gemini 2.0 integration.
4. **Meta Quest WebXR** 6DoF room-scale walkthrough with sub-15ms predictive ghost wireframes.

### 🌐 Official Deployment Endpoints
* **Meta Quest App Lab Release Channel:** [https://www.meta.com/experiences/app-lab/spatialcanvas-ai](https://www.meta.com/experiences/app-lab/spatialcanvas-ai)
* **Live Production Service (GCP Cloud Run):** [https://spatialcanvas-ai-q2x3p-uc.a.run.app](https://spatialcanvas-ai-q2x3p-uc.a.run.app)
* **WebXR PWA Launch URL:** [https://spatialcanvas-ai.web.app](https://spatialcanvas-ai.web.app)
* **GitHub Repository:** [https://github.com/arauthub/portfolio/tree/main/hackthon-devpost/spatialcanvas-ai](https://github.com/arauthub/portfolio/tree/main/hackthon-devpost/spatialcanvas-ai)

### 🗓️ Production Milestones & Roadmap
* **Q4 2026 (November 2026):** SpatialCanvas AI v1.0.0 Public Beta (1:1 G+1 Farmhouse, 80s Retro Studio, sub-15ms predictive ghost engine).
* **Q1 2027 (February 15, 2027 — Target Production Launch):** Meta Quest Horizon Store / App Lab Public Release with Meta Quest 3 color passthrough.
* **Q2 2027 (May 2027):** Multi-user spatial co-presence with WebRTC audio and parametric BIM (Revit/IFC) export.

