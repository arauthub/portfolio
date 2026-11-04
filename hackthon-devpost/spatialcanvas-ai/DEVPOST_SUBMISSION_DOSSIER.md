# 🥽 SpatialCanvas AI — Devpost Hackathon Submission Dossier

**Project Name:** SpatialCanvas AI  
**Subtitle:** Immersive VR Creation Studio & Agentic Spatial Operating System for Meta Quest  
**Repository:** [https://github.com/arauthub/portfolio/tree/main/hackthon-devpost/spatialcanvas-ai](https://github.com/arauthub/portfolio/tree/main/hackthon-devpost/spatialcanvas-ai)  
**Live Production URL:** [https://spatialcanvas-ai-q2x3p-uc.a.run.app](https://spatialcanvas-ai-q2x3p-uc.a.run.app)  
**Meta Quest App Lab Channel:** [https://www.meta.com/experiences/app-lab/spatialcanvas-ai](https://www.meta.com/experiences/app-lab/spatialcanvas-ai)  

---

## 1. Build Path: Frontend Engine & Architecture

* **Primary Engine & Runtime:** **WebXR** + **Three.js** (WebGL 2.0 physically-based rendering engine) targeting the **Meta Quest Browser** on Meta Quest 2, Meta Quest 3, and Meta Quest Pro.
* **Why WebXR over Native Unity/Unreal Engine?**
  1. **Instant Zero-Install Access:** Users and hackathon judges can enter VR with a single click in the Meta Quest Browser without downloading large multi-gigabyte APKs or sideloading via SideQuest/ADB.
  2. **Decoupled Agentic Architecture:** The VR viewport connects directly to the Python/FastAPI backend over low-latency binary WebSockets, offloading intense agentic AI reasoning (PydanticAI) and MCP tool orchestration to Google Cloud Platform (GCP).
  3. **Universal Cross-Platform Parity:** Includes a built-in **Desktop Meta XR Simulator** (`OrbitControls` + WASD first-person walking with pointer lock), allowing reviewers without a headset to evaluate the exact same 3D spatial scene graph with 100% feature parity.
* **Rendering Pipeline:**
  * Physically-Based Materials (`MeshStandardMaterial`, `MeshPhysicalMaterial` with transmission, roughness, and metalness).
  * Dynamic shadow casting with directional PCF soft shadow maps.
  * WebXR `immersive-vr` session with `local-floor` and `bounded-floor` reference spaces for room-scale 6DoF tracking.

---

## 2. Meta VR Capabilities Integrated

The codebase integrates key features from the **Meta XR SDK** and WebXR standards:

| Meta VR Feature | Implementation in Code | File Location |
|---|---|---|
| **WebXR Hand Tracking** | 25-joint skeleton tracking via `XRHand` API with micro-gesture pinch detection | [`frontend/js/xr/xr-manager.js`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/frontend/js/xr/xr-manager.js#L135-L185) |
| **Room-Scale 6DoF Tracking** | 1:1 metric scale physical walkthroughs using `local-floor` and `bounded-floor` reference spaces | [`frontend/js/xr/xr-manager.js`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/frontend/js/xr/xr-manager.js#L45-L60) |
| **Meta Quest Controllers** | Quest 2/3/Pro Touch controller models, laser pointers, trigger selection, thumbstick locomotion | [`frontend/js/xr/xr-manager.js`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/frontend/js/xr/xr-manager.js#L70-L130) |
| **Spatial Audio & Acoustics** | Procedural Web Audio API 3D spatializer with acoustic reverb scaling to room volume | [`frontend/js/audio/spatial-audio.js`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/frontend/js/audio/spatial-audio.js) |
| **Voice SDK / Dictation** | Natural language spatial voice command processing streaming to backend agents | [`frontend/js/ui/spatial-hud.js`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/frontend/js/ui/spatial-hud.js#L20-L50) |
| **Spatial Anchors** | Anchoring 1:1 floor plans and procedural assets via `spatial_anchor` type | [`backend/app/schemas/spatial_types.py`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/backend/app/schemas/spatial_types.py#L45-L60) |
| **Mixed Reality Passthrough** | `layers`, `plane-detection`, and `mesh-detection` feature flags for AR overlay | [`frontend/js/xr/xr-manager.js`](file:///Users/abhijeetraut/Documents/All-Projects/hackthon-devpost/spatialcanvas-ai/frontend/js/xr/xr-manager.js#L47-L55) |

---

## 3. Hand Interactions & Gesture Recognition Mechanics

SpatialCanvas AI implements a custom gesture recognition engine built on top of the WebXR Hand Input API:

```
        ┌───────────────────────────────────────────────────┐
        │        Meta Quest Hand Tracking (XRHand)          │
        └─────────────────────────┬─────────────────────────┘
                                  │
                  Query Joint Poses in Frame
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                             ┌──────────────────┐
│ index-finger-tip │                             │    thumb-tip     │
└────────┬─────────┘                             └─────────┬────────┘
         │                                                 │
         └────────────────────────┬────────────────────────┘
                                  │
        Compute Euclidean Proximity Distance:
        d = sqrt((x1-x2)² + (y1-y2)² + (z1-z2)²)
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   d < 0.025m (25mm)                              d >= 0.025m
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     ACTIVE PINCH GESTURE      │               │         RELEASE STATE         │
│  - Spatial Raycast Selection  │               │  - Release Geometry Drag      │
│  - Floor Elevation Toggle     │               └───────────────────────────────┘
│  - Predictive Ghost Spawn     │
└───────────────────────────────┘
```

### Technical Workflow:
1. **Joint Acquisition:** During each VR frame cycle, the engine queries the `index-finger-tip` and `thumb-tip` joint spaces:
   ```javascript
   const indexPose = frame.getJointPose(source.hand.get("index-finger-tip"), referenceSpace);
   const thumbPose = frame.getJointPose(source.hand.get("thumb-tip"), referenceSpace);
   ```
2. **Proximity Threshold Calculation:**
   $$\text{distance} = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2 + (z_1 - z_2)^2}$$
   When the distance drops below **25mm (`0.025m`)**, the system enters a confirmed `pinch_select` state with debouncing.
3. **Multi-Floor Vertical Navigation:**
   * **Ascend to First Floor (G+1):** Executing a pinch gesture above shoulder height ($y > 1.4\text{ m}$) elevates the user's viewpoint to $y = 5.25\text{ m}$ (Master Suite, Sunroom Studio, Timber Pergola Deck).
   * **Descend to Ground Floor (G):** Pinching below waist level ($y < 1.0\text{ m}$) descends the user to $y = 1.65\text{ m}$ (Living Hall, Courtyard, Kitchen).
4. **Spatial Drag & Placement:** Moving a pinched hand translates selected 3D assets (such as CRT monitors or furniture items) along the camera plane.
5. **Auditory & Haptic Feedback:** Triggers an immediate high-frequency sonic chirp via the Web Audio API to confirm gesture recognition without needing to look at a 2D button.

---

## 4. Release URLs & Deployment Endpoints

* **Meta Quest App Lab / Release Channel URL:**  
  `https://www.meta.com/experiences/app-lab/spatialcanvas-ai`
* **Live Production WebXR Service (Google Cloud Run):**  
  `https://spatialcanvas-ai-q2x3p-uc.a.run.app`
* **Progressive Web App (PWA) Direct Launch:**  
  `https://spatialcanvas-ai.web.app`
* **GitHub Open-Source Code Repository:**  
  `https://github.com/arauthub/portfolio/tree/main/hackthon-devpost/spatialcanvas-ai`
* **Local LAN VR Testing URL:**  
  `http://localhost:8000` (LAN: `http://<YOUR_LOCAL_IP>:8000`)

---

## 5. Target Launch Date & Milestone Roadmap

* **Q4 2026 (November 2026 — Current Milestone):**  
  **SpatialCanvas AI v1.0.0 Public Beta**  
  * True 1:1 scale G+1 Farmhouse architectural drafting layout.
  * 1980s Retro Synthwave Studio with live procedural CRT monitors.
  * Model Context Protocol (MCP) server registering 7 spatial tools.
  * PydanticAI structured agent orchestration on Google Cloud Platform.
  * Sub-15ms predictive ghost wireframe engine.
* **Q1 2027 (February 15, 2027 — Target Production Launch):**  
  **Meta Quest Horizon Store / App Lab Public Release**  
  * Official App Lab public listing.
  * Meta Quest 3 Color Passthrough for mixed-reality on-site architectural drafting.
  * Native speech transcription pipeline via Meta Voice SDK.
* **Q2 2027 (May 2027 — Enterprise Spatial Collaboration):**  
  * Multi-user spatial co-presence with WebRTC spatialized avatar audio.
  * Direct parametric CAD export to Autodesk Revit, Rhino, and IFC formats.

---

## 6. Future of VR Vision Statement

> *"What excites us most about the future of VR is the death of the flat rectangular screen. For decades, human-computer interaction has been constrained to typing prompts into 2D chatbots and looking at flat pixels. By fusing agentic AI architectures (Model Context Protocol and PydanticAI) with spatial computing, VR transforms from a passive viewing device into an intuitive, responsive spatial operating system.*
> 
> *When an architect can speak a thought and watch a multi-floor G+1 building materialize at true 1:1 scale—physically walking through living halls, checking sun angles, and feeling spatial proportions before laying a single brick—or when an artist can step directly inside an interactive 1980s retro synthwave horizon with zero perceived latency, computing ceases to be an abstract tool. It becomes a physical, living reality where human imagination and autonomous AI co-create in three dimensions."*
