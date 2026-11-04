/**
 * SpatialCanvas AI - Main Application Coordinator
 * Handles WebSocket streaming, Three.js render loop, predictive ghost states,
 * and audio spatialization.
 */

class SpatialCanvasApp {
  constructor() {
    this.ws = null;
    this.pingInterval = null;
    this.lastPingTime = 0;
    this.currentSceneId = "g1_farmhouse";
    this.lastSceneVersion = 0;
    this.reconnectAttempts = 0;
    this.maxReconnectDelayMs = 20000;

    this.initWebSocket();
    this.startRenderLoop();
  }

  initWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/spatial`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("Connected to SpatialCanvas AI Enterprise WebSocket bridge.");
        this.reconnectAttempts = 0;
        this.startPingPong();
      };

      this.ws.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };

      this.ws.onerror = (err) => {
        console.warn("WebSocket error:", err);
      };

      this.ws.onclose = () => {
        clearInterval(this.pingInterval);
        this.reconnectAttempts++;
        // Exponential backoff with random jitter for enterprise Wi-Fi resilience
        const backoffMs = Math.min(
          this.maxReconnectDelayMs,
          1000 * Math.pow(1.4, this.reconnectAttempts)
        ) + Math.random() * 600;
        console.log(`WebSocket disconnected. Reconnecting in ${Math.round(backoffMs)}ms (attempt #${this.reconnectAttempts})...`);
        setTimeout(() => this.initWebSocket(), backoffMs);
      };
    } catch (e) {
      console.error("Failed to initialize WebSocket:", e);
    }
  }

  startPingPong() {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.lastPingTime = performance.now();
        this.ws.send(
          JSON.stringify({
            type: "ping",
            payload: { client_time: this.lastPingTime },
          })
        );
      }
    }, 3000);
  }

  handleWebSocketMessage(raw) {
    try {
      const msg = JSON.parse(raw);
      const type = msg.type;
      const payload = msg.payload || {};

      switch (type) {
        case "full_scene":
          if (payload.version && payload.version < this.lastSceneVersion) {
            console.warn(`Dropped stale scene packet v${payload.version} (current: v${this.lastSceneVersion})`);
            break;
          }
          this.lastSceneVersion = payload.version || (this.lastSceneVersion + 1);
          this.currentSceneId = payload.scene_id || "g1_farmhouse";
          window.sceneBuilder.buildScene(payload);
          window.spatialHUD.updateNodeCount(payload.nodes?.length || 0);

          // Audio scene drone check
          if (this.currentSceneId === "retro_80s_studio") {
            window.spatialAudio.startRetroSynthDrone();
          } else {
            window.spatialAudio.stopRetroSynthDrone();
          }
          break;

        case "predictive_ghost":
          // Sub-15ms ghost state for instant VR presence
          window.sceneBuilder.spawnPredictiveGhost(payload);
          break;

        case "agent_thought":
          window.thoughtStreamUI.addThought(payload);
          break;

        case "mcp_tool_call":
          window.thoughtStreamUI.addMCPToolCall(payload);
          break;

        case "pong":
          const roundtrip = Math.round(performance.now() - this.lastPingTime);
          window.spatialHUD.updateLatency(roundtrip);
          break;

        default:
          break;
      }
    } catch (e) {
      console.warn("Failed to parse WebSocket message:", e);
    }
  }

  sendVoiceCommand(transcript) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not open. Cannot send voice command.");
      return;
    }

    const camPos = window.sceneBuilder.camera.position;
    const msg = {
      type: "voice_input",
      payload: {
        transcript: transcript,
        user_position: { x: camPos.x, y: camPos.y, z: camPos.z },
      },
    };
    this.ws.send(JSON.stringify(msg));
  }

  switchScene(sceneId) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        type: "switch_scene",
        payload: { scene_id: sceneId },
      })
    );
  }

  resetCurrentScene() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        type: "reset_scene",
        payload: { scene_id: this.currentSceneId },
      })
    );
  }

  startRenderLoop() {
    const renderer = window.sceneBuilder.renderer;
    const scene = window.sceneBuilder.scene;
    const camera = window.sceneBuilder.camera;
    const clock = window.sceneBuilder.clock;

    // Use renderer.setAnimationLoop for VR + Desktop compatibility
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();

      // 1. Update Retro CRT and Holograms
      if (window.retroRenderer) {
        window.retroRenderer.update(delta);
      }

      // 2. Update Desktop Simulator (WASD / Orbit)
      if (window.metaXRSimulator) {
        window.metaXRSimulator.update(delta);
      }

      // 3. Update WebXR Controllers & Hand Tracking
      if (window.webxrManager) {
        const frame = renderer.xr.getFrame ? renderer.xr.getFrame() : null;
        const refSpace = renderer.xr.getReferenceSpace ? renderer.xr.getReferenceSpace() : null;
        window.webxrManager.update(frame, refSpace);
      }

      // 4. Update HUD FPS
      if (window.spatialHUD) {
        window.spatialHUD.updateFPS();
      }

      // 5. Render Three.js Scene
      renderer.render(scene, camera);
    });
  }
}

// Boot application when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.app = new SpatialCanvasApp();
});

