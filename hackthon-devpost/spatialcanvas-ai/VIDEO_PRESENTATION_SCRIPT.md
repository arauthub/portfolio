# 🎬 SpatialCanvas AI — Comprehensive Video Presentation Script & Storyboard

**Video Title:** SpatialCanvas AI: Stepping Inside Your Prompts  
**Target Duration:** 3 minutes 30 seconds (Standard Hackathon Showcase Length)  
**Tone:** Inspiring, technically authoritative, cinematic, and fast-paced.  
**Presenters:** Project Creator / AI Architect (with picture-in-picture or full-screen VR capture).

---

## Storyboard Overview & Timeline

| Scene | Timecode | Title / Focus | Primary Visual |
|---|---|---|---|
| **Scene 1** | 0:00 – 0:35 | The 2D Screen Dilemma (Problem Statement) | Frustrated creator staring at a 2D chatbot prompt vs. cinematic VR transition |
| **Scene 2** | 0:35 – 1:15 | The Solution & Architecture | High-level system diagram: Meta Quest WebXR ➔ FastAPI on GCP ➔ MCP + PydanticAI |
| **Scene 3** | 1:15 – 1:40 | The Latency Breakthrough: Predictive Ghosts | Split-screen showing sub-15ms wireframe ghost spawning vs. cloud LLM streaming |
| **Scene 4** | 1:40 – 2:25 | Live Demo 1: 1:1 Scale G+1 Farmhouse Walkthrough | Meta Quest first-person room-scale walk: Living Hall, Sunlit Courtyard, Sunroom Studio |
| **Scene 5** | 2:25 – 2:55 | Live Demo 2: 1980s Retro Digital Media Studio | Synthwave horizon, glowing CRT monitors with live phosphor scanlines, cassette visualizer |
| **Scene 6** | 2:55 – 3:15 | Google Cloud Platform & MCP Deep Dive | Code walkthrough: MCP tools, PydanticAI schemas, Cloud Run metrics |
| **Scene 7** | 3:15 – 3:30 | The Future of Spatial Computing & Call to Action | Vision statement, Meta Horizon App Lab roadmap, QR code & GitHub link |

---

## Detailed Script & Scene-by-Scene Storyboard

### Scene 1: The Problem Statement — The 2D Screen Dilemma
* **Timecode:** 0:00 – 0:35 (35 seconds)
* **Visual:**
  * Opens with a close-up of a standard laptop screen. An architect types: *"Design a modern two-story farmhouse with an interior courtyard."*
  * The AI returns a flat 2D image. The creator zooms in, but there is no sense of real-world scale, no feeling of ceiling clearance, no way to walk through the doorway.
  * *Camera pans backward and blurs into a dark void. A glowing 3D grid ignites underneath, and a Meta Quest 3 headset appears with glowing cyan laser pointers.*
* **Audio / SFX:**
  * Low ambient hum of a computer fan, keystrokes clicking.
  * Sudden low-frequency bass riser accompanied by a crisp cybernetic chime as the VR world powers up.
* **Voiceover:**
  > *"Generative AI has advanced by quantum leaps over the past two years. We can generate hyper-realistic imagery and complex structural blueprints in seconds. But there's a fundamental paradox: we are still trapped behind flat, two-dimensional rectangular glass screens.*
  > 
  > *When an architect designs a home, or an artist creates an immersive world, a 2D image cannot convey true 1:1 scale, acoustic volume, or spatial presence. How high does that 3.6-meter ceiling actually feel? How does natural sunlight flood across the courtyard?*
  > 
  > *This is why we built **SpatialCanvas AI**: an immersive spatial creation studio for the Meta Quest ecosystem that lets you step directly inside your prompts."*
* **On-Screen Text Callout:**
  * `THE PROBLEM: Flat 2D Screens Cannot Convey 1:1 Scale or Spatial Presence`

---

### Scene 2: The Solution & Agentic Architecture
* **Timecode:** 0:35 – 1:15 (40 seconds)
* **Visual:**
  * Cut to a dynamic motion-graphics architecture diagram:
    1. **Meta Quest WebXR Client** (Three.js WebGL 2.0 rendering at 90 FPS, hand tracking, Quest 3 controller rays).
    2. High-speed bidirectional **WebSockets** streaming delta packets.
    3. **FastAPI Backend** deployed serverless on **Google Cloud Platform (GCP Cloud Run)**.
    4. **Model Context Protocol (MCP)** server with 7 spatial computing tools.
    5. **PydanticAI Core** orchestrating `SpatialArchitectAgent` and `RetroMediaAgent` with structured schemas.
* **Audio / SFX:**
  * Rhythmic electronic pulse (120 BPM synth bassline building up).
* **Voiceover:**
  > *"SpatialCanvas AI is an agentic spatial operating system. Instead of viewing AI output as a flat picture, users speak natural voice commands in VR to orchestrate autonomous agents.*
  > 
  > *Our decoupled architecture pairs a high-performance WebXR client with a Python and FastAPI backend running on Google Cloud Platform.*
  > 
  > *At the heart of the system is the **Model Context Protocol (MCP)** and **PydanticAI**. We built a dedicated MCP server that registers specialized spatial computing tools: drafting multi-floor layouts, computing metric dimensions, validating ergonomic clearances, and synthesizing 3D digital media.*
  > 
  > *Every agent decision is strictly typed using Pydantic v2 schemas, ensuring that AI-generated geometry adheres to physical structural constraints."*
* **On-Screen Text Callout:**
  * `PydanticAI + Model Context Protocol (MCP) + Google Cloud Platform`

---

### Scene 3: The Latency Breakthrough — Sub-15ms Predictive Ghost Engine
* **Timecode:** 1:15 – 1:40 (25 seconds)
* **Visual:**
  * Direct first-person VR capture in Meta Quest.
  * The presenter clicks the mic button and speaks: *"Add an east-facing sunroom studio on the first floor."*
  * **Split-Screen Comparison:**
    * *Left (Traditional LLM):* The user waits 3.8 seconds with an empty frozen screen, breaking VR presence.
    * *Right (SpatialCanvas AI):* In **under 15 milliseconds**, a translucent cyan wireframe bounding box with animated scanning rings and a glowing label *"⚡ Synthesizing Sunroom Glass Structure..."* appears exactly where the user is looking.
    * A HUD thought stream displays the agent's live reasoning: `Step 1: Parse Intent ➔ Step 2: Route to SpatialArchitectAgent ➔ Step 3: Invoke MCP Tool draft_sunroom_studio`.
    * Smoothly, the wireframe dissolves into solid low-E curtain glass, polished concrete, and an oak drafting workbench!
* **Audio / SFX:**
  * High-frequency sonic scan beep (`playPredictiveGhostPulse()`) at 15ms.
  * 3-note harmonic major chord (`playMCPToolBake()`) when the solid geometry bakes.
* **Voiceover:**
  > *"One of our greatest technical hurdles was latency. In spatial computing, low framerates or perceived lag cause motion sickness and break presence. Traditional cloud LLMs take 2 to 4 seconds to think—an eternity in VR.*
  > 
  > *To solve this, we engineered a custom **Predictive State Engine**. In less than 15 milliseconds after you speak, our heuristic parser projects a pulsating cybernetic ghost wireframe at your laser target.*
  > 
  > *While you explore the predictive wireframe, our PydanticAI agent streams thought tokens and MCP tool calls over WebSockets, baking the final physical mesh with zero perceived latency."*
* **On-Screen Text Callout:**
  * `LATENCY BREAKTHROUGH: <15ms Predictive Ghost Wireframes = Zero Motion Sickness`

---

### Scene 4: Live Demo 1 — 1:1 Scale G+1 Farmhouse Architectural Walkthrough
* **Timecode:** 1:40 – 2:25 (45 seconds)
* **Visual:**
  * Full-screen Meta Quest 6DoF walkthrough inside the **Sustainable G+1 Farmhouse**:
    * **Ground Floor:** The presenter walks physically across the room. We see the Grand Living Hall with double-height ceiling, polished concrete floors, and modern sectional sofa.
    * Camera pans to the right: the open-to-sky **Central Courtyard** features a lush Japanese maple tree with wind flutter and a reflective granite water basin.
    * Floating cyan CAD dimension labels read `8.00m Living Span`, `3.60m Headroom`, `6.00m x 6.00m Open Courtyard`.
    * The presenter demonstrates **Hand Tracking**: pinches thumb and index finger above shoulder height. The camera elevates smoothly up the floating oak staircase to the **First Floor (G+1)**!
    * We explore the Master Bedroom Suite with teak flooring, the floor-to-ceiling glass Sunroom Studio with an architectural drafting table, and the open Cedar Pergola Rooftop Terrace overlooking the garden.
* **Audio / SFX:**
  * Subtle natural breeze, acoustic spatial reverberation that expands as the user walks from the covered hall into the double-height courtyard.
* **Voiceover:**
  > *"Here is our first showcase: the G+1 Sustainable Farmhouse, rendered at true 1:1 metric scale.*
  > 
  > *Notice that we aren't looking at a miniature dollhouse. At 1.65 meters eye level, I am physically standing inside the living room. I can look up at the 3.6-meter ceiling, walk over to the quartz kitchen island, and step into this sunlit central courtyard.*
  > 
  > *Using Meta Quest Hand Tracking, a simple micro-pinch gesture above shoulder level elevates me to the first floor. Here, our agent drafted an east-facing sunroom wrapped in solar-control low-E glass, complete with a timber drafting workbench and an outdoor pergola deck.*
  > 
  > *For the first time, architects and clients can validate structural volume, daylighting, and spatial flow before pouring a single slab of concrete."*
* **On-Screen Text Callout:**
  * `TRUE 1:1 SCALE: 365 m² Multi-Floor BIM Layout with Meta Quest Hand Tracking`

---

### Scene 5: Live Demo 2 — 1980s Retro Digital Media Studio
* **Timecode:** 2:25 – 2:55 (30 seconds)
* **Visual:**
  * The presenter clicks the quick-preset button or dictates: *"Transform this space into a 1980s retro synthwave studio."*
  * The environment transitions into a cyberpunk neon horizon:
    * A massive sliced synthwave sun glows in orange and hot magenta at the horizon.
    * An infinite cyan and magenta neon perspective grid ripples outward.
    * In the center stands a curved array of vintage **Sony Trinitron CRT monitors**.
    * Close-up on the CRT monitors: they are running **live procedural canvas shaders** showing rotating wireframe toruses, bouncing green LED audio spectrum analyzers, and vector flight horizons with real CRT phosphor scanlines!
    * A vintage cassette deck spins twin tape wheels with active VU meters.
    * Rotating wireframe holograms of a Delorean and cyberpunk pyramid project glowing particle pillars into the air.
* **Audio / SFX:**
  * Deep, lush analog synthwave pad drone (`startRetroSynthDrone()`) swelling into stereo reverb.
* **Voiceover:**
  > *"Now, let's switch contexts. We speak: 'Transform into a 1980s retro synthwave studio.'*
  > 
  > *Our RetroMediaAgent takes over, orchestrating MCP tools to generate a vintage media environment. Look at these curved CRT monitors: they aren't static textures. They are live procedural canvas displays rendering CRT phosphor scanlines, 3D rotating toruses, and bouncing audio spectrum analyzers.*
  > 
  > *With our Web Audio synthesizer pumping generative analog synth chords, users can manipulate vintage tape decks and 3D holograms in real time."*
* **On-Screen Text Callout:**
  * `PROCEDURAL RETRO SHADERS: Live Phosphor Scanlines, Cassette VU Meters & 3D Holograms`

---

### Scene 6: Google Cloud Platform & Technical Deep Dive
* **Timecode:** 2:55 – 3:15 (20 seconds)
* **Visual:**
  * Rapid montage of code and cloud telemetry:
    1. Terminal running `pytest` with **9 passed tests**.
    2. `backend/app/agents/architectural_agent.py` showing `@agent.tool` decorators and PydanticAI schemas.
    3. `backend/app/mcp_server/server.py` showing MCP tool definitions.
    4. Google Cloud Run console showing 90 FPS streaming telemetry, sub-15ms latency metrics, and Vertex AI Gemini 2.0 connection badge.
* **Audio / SFX:**
  * Crisp rhythmic percussion with ascending keyboard arpeggios.
* **Voiceover:**
  > *"Under the hood, SpatialCanvas AI is enterprise-ready. Our backend deploys seamlessly to **Google Cloud Run** with automated Cloud Build CI/CD pipelines.*
  > 
  > *By leveraging Gemini 2.0 Flash on Vertex AI and adhering strictly to the Model Context Protocol, the platform remains fully extensible. Any new MCP tool—whether for structural load simulation or energy modeling—can be plugged in with zero frontend rewrites."*
* **On-Screen Text Callout:**
  * `GCP Cloud Run + Vertex AI Gemini 2.0 + Standard Model Context Protocol`

---

### Scene 7: Future Vision & Call to Action
* **Timecode:** 3:15 – 3:30 (15 seconds)
* **Visual:**
  * Wide cinematic shot of the user standing on the first-floor farmhouse balcony, looking out at the mountains as the sun sets.
  * Screen transitions to final title card:
    * **SpatialCanvas AI**
    * *Step Inside Your Prompts*
    * Meta Quest Horizon Store / App Lab Badge
    * Live URL: `spatialcanvas-ai-q2x3p-uc.a.run.app`
    * GitHub: `github.com/arauthub/portfolio`
* **Audio / SFX:**
  * Triumphant synthesizer finale chord, fading gracefully into silence.
* **Voiceover:**
  > *"SpatialCanvas AI proves that the future of computing isn't flat. It is spatial, agentic, and alive.*
  > 
  > *Experience SpatialCanvas AI today in your Meta Quest browser or on desktop. Thank you!"*
* **On-Screen Text Callout:**
  * `Try it now: spatialcanvas-ai-q2x3p-uc.a.run.app | Target Launch: Q1 2027`

---

## 🎙️ Recording & Production Tips for Video Creator

1. **Screen Capture Setup:**
   * **Meta Quest Capture:** Use the Meta Quest developer hub (`mqdh`) or Meta Quest Browser built-in recording (1080p, 60 FPS, 16:9 aspect ratio).
   * **Desktop Simulator Capture:** Use OBS Studio or QuickTime Player capturing at 1920x1080 at 60 FPS.
2. **Audio Voiceover Track:**
   * Record with a clear USB/XLR microphone (e.g. Shure SM7B, Blue Yeti).
   * Apply light compression and normalize audio to -14 LUFS.
3. **Live Demonstration Flow:**
   * Keep mouse movements smooth during the desktop recording.
   * In 1:1 walk mode, press `V` once to show the transition to the architectural orbit view, demonstrating both first-person walk and CAD bird's-eye review!
