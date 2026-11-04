/**
 * SpatialCanvas AI - Meta Quest WebXR Manager
 * Integrates WebXR Device API, Meta Quest 2 / Quest 3 / Quest Pro controller rays,
 * thumbstick locomotion, snap turns, and hand-tracking pinch detection.
 */

class WebXRManager {
  constructor() {
    this.session = null;
    this.controllers = [];
    this.controllerGrips = [];
    this.handTrackers = [];
    this.isSupported = false;
    this.btnEnterVR = document.getElementById("btn-enter-vr");
    this.vrPillBadge = document.getElementById("telemetry-vr");

    this.checkSupport();
    this.setupControllers();
  }

  async checkSupport() {
    if ("xr" in navigator) {
      try {
        this.isSupported = await navigator.xr.isSessionSupported("immersive-vr");
        if (this.isSupported) {
          this.btnEnterVR.style.display = "flex";
          this.btnEnterVR.addEventListener("click", () => this.toggleVR());
          if (this.vrPillBadge) {
            this.vrPillBadge.textContent = "WebXR Ready";
          }
        } else {
          this.btnEnterVR.textContent = "XR Sim Mode";
          if (this.vrPillBadge) {
            this.vrPillBadge.textContent = "Meta XR Simulator";
          }
        }
      } catch (e) {
        console.warn("XR support check failed:", e);
      }
    }
  }

  async toggleVR() {
    if (!this.session) {
      try {
        const session = await navigator.xr.requestSession("immersive-vr", {
          optionalFeatures: [
            "local-floor",
            "bounded-floor",
            "hand-tracking",
            "layers",
            "anchors",
            "mesh-detection",
            "plane-detection",
          ],
        });
        window.sceneBuilder.renderer.xr.setSession(session);
        this.session = session;
        this.btnEnterVR.innerHTML = "<span>Exit VR</span>";
        this.createVRPalette();
        session.addEventListener("end", () => {
          this.session = null;
          this.removeVRPalette();
          this.btnEnterVR.innerHTML = "<span>Enter VR (Meta Quest)</span>";
        });
      } catch (err) {
        console.error("Failed to start WebXR session:", err);
      }
    } else {
      this.session.end();
    }
  }

  setupControllers() {
    const renderer = window.sceneBuilder.renderer;
    const scene = window.sceneBuilder.scene;

    // Laser Ray Material & Line
    const rayGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -4),
    ]);
    const rayMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
    });

    for (let i = 0; i < 2; i++) {
      const controller = renderer.xr.getController(i);
      controller.addEventListener("selectstart", (e) => this.onSelectStart(e));
      controller.addEventListener("selectend", (e) => this.onSelectEnd(e));
      scene.add(controller);

      // Add laser pointer line
      const rayLine = new THREE.Line(rayGeom, rayMat);
      rayLine.name = "laser_ray";
      controller.add(rayLine);

      // Laser reticle dot at 4 meters
      const reticleGeom = new THREE.RingGeometry(0.02, 0.04, 16);
      const reticleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
      const reticle = new THREE.Mesh(reticleGeom, reticleMat);
      reticle.position.z = -4;
      controller.add(reticle);

      this.controllers.push(controller);
    }
  }

  createVRPalette() {
    this.removeVRPalette();
    const group = new THREE.Group();
    group.name = "world_space_vr_palette";

    // Position floating palette 1.8m in front of user, 1.2m high, tilted 15 degrees
    group.position.set(0, 1.25, -1.6);
    group.rotation.x = THREE.MathUtils.degToRad(-15);

    // Canvas Background
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 240, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px 'SF Mono', monospace";
    ctx.fillText("🥽 SPATIALCANVAS VR OS", 32, 45);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px 'SF Mono', monospace";
    ctx.fillText("Aim laser pointer & pull trigger to interact", 32, 75);

    const bgTex = new THREE.CanvasTexture(canvas);
    const bgGeom = new THREE.PlaneGeometry(1.4, 0.7);
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTex, transparent: true, side: THREE.DoubleSide });
    const bgMesh = new THREE.Mesh(bgGeom, bgMat);
    group.add(bgMesh);

    // Interactive Buttons in 3D
    const buttons = [
      { label: "🏡 Farmhouse", action: "scene_farmhouse", x: -0.45, y: -0.05, color: "#0284c7" },
      { label: "🕹️ 80s Studio", action: "scene_retro", x: 0.0, y: -0.05, color: "#ec4899" },
      { label: "🌅 Sunroom", action: "add_sunroom", x: 0.45, y: -0.05, color: "#38bdf8" },
      { label: "🪵 Pergola", action: "add_pergola", x: -0.25, y: -0.22, color: "#f59e0b" },
      { label: "📐 Validate", action: "validate_scale", x: 0.25, y: -0.22, color: "#22c55e" },
    ];

    buttons.forEach((btn) => {
      const btnCanvas = document.createElement("canvas");
      btnCanvas.width = 256;
      btnCanvas.height = 80;
      const bCtx = btnCanvas.getContext("2d");

      bCtx.fillStyle = btn.color;
      bCtx.beginPath();
      bCtx.roundRect(4, 4, 248, 72, 12);
      bCtx.fill();

      bCtx.fillStyle = "#ffffff";
      bCtx.font = "bold 26px sans-serif";
      bCtx.textAlign = "center";
      bCtx.textBaseline = "middle";
      bCtx.fillText(btn.label, 128, 40);

      const bTex = new THREE.CanvasTexture(btnCanvas);
      const bGeom = new THREE.PlaneGeometry(0.38, 0.12);
      const bMat = new THREE.MeshBasicMaterial({ map: bTex, transparent: true });
      const bMesh = new THREE.Mesh(bGeom, bMat);
      bMesh.position.set(btn.x, btn.y, 0.02);
      bMesh.userData = { action: btn.action, type: "vr_button" };
      group.add(bMesh);
    });

    window.sceneBuilder.scene.add(group);
    this.vrPaletteGroup = group;
  }

  removeVRPalette() {
    if (this.vrPaletteGroup) {
      if (window.sceneBuilder && window.sceneBuilder.disposeHierarchy) {
        window.sceneBuilder.disposeHierarchy(this.vrPaletteGroup);
      }
      window.sceneBuilder.scene.remove(this.vrPaletteGroup);
      this.vrPaletteGroup = null;
    }
  }
    if (!this.session) return;
    const inputSources = this.session.inputSources;
    if (inputSources && inputSources[controllerIndex]) {
      const gamepad = inputSources[controllerIndex].gamepad;
      if (gamepad && gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
        try {
          gamepad.hapticActuators[0].pulse(strength, durationMs);
        } catch (e) {}
      }
    }
  }

  onSelectStart(event) {
    const controller = event.target;
    this.triggerHaptic(0, 0.7, 30);
    this.triggerHaptic(1, 0.7, 30);

    // Perform Raycast into scene for floor teleportation, VR palette buttons, or node selection
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);

    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    // Check VR Palette UI buttons first
    if (this.vrPaletteGroup) {
      const uiHits = raycaster.intersectObjects(this.vrPaletteGroup.children, true);
      if (uiHits.length > 0) {
        const action = uiHits[0].object.userData?.action;
        if (action) {
          this.executeVRAction(action);
          this.triggerHaptic(0, 0.9, 50);
          return;
        }
      }
    }

    const intersects = raycaster.intersectObjects(window.sceneBuilder.nodesGroup.children, true);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const pt = hit.point;

      // If clicked on floor, perform smooth snap teleport
      if (hit.object.userData.type === "floor" || hit.point.y <= 0.2) {
        const cam = window.sceneBuilder.camera;
        cam.position.x = pt.x;
        cam.position.z = pt.z;
        if (window.spatialAudio) {
          window.spatialAudio.playTeleportWhoosh();
        }
        this.triggerHaptic(0, 0.4, 20);
      }
    }
  }

  executeVRAction(action) {
    console.log(`[Enterprise WebXR] Executing Spatial Action in VR: ${action}`);
    if (action === "scene_farmhouse") {
      window.app.switchScene("g1_farmhouse");
    } else if (action === "scene_retro") {
      window.app.switchScene("retro_80s_studio");
    } else if (action === "add_sunroom") {
      window.app.sendVoiceCommand("Add an east-facing sunroom studio on the first floor");
    } else if (action === "add_pergola") {
      window.app.sendVoiceCommand("Add a cedar timber pergola rooftop terrace deck");
    } else if (action === "validate_scale") {
      window.app.sendVoiceCommand("Validate 1:1 architectural scale, headroom clearances, and VR ergonomics");
    }
  }

  onSelectEnd(event) {}

  update(frame, referenceSpace) {
    // Process thumbstick locomotion & hand tracking if session active
    if (!this.session) return;

    for (const source of this.session.inputSources) {
      // 1. Meta Quest Hand Tracking & Micro-Gesture Pinch Recognition
      if (source.hand && frame && referenceSpace) {
        const indexTip = source.hand.get("index-finger-tip");
        const thumbTip = source.hand.get("thumb-tip");

        if (indexTip && thumbTip) {
          const indexPose = frame.getJointPose ? frame.getJointPose(indexTip, referenceSpace) : null;
          const thumbPose = frame.getJointPose ? frame.getJointPose(thumbTip, referenceSpace) : null;

          if (indexPose && thumbPose) {
            const p1 = indexPose.transform.position;
            const p2 = thumbPose.transform.position;
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dz = p1.z - p2.z;
            const pinchDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Active Pinch threshold: 25mm (0.025m)
            const isPinching = pinchDistance < 0.025;
            if (isPinching && !source._wasPinching) {
              source._wasPinching = true;
              this.onHandPinchStart(source, p1);
            } else if (!isPinching && source._wasPinching) {
              source._wasPinching = false;
              this.onHandPinchEnd(source);
            }
          }
        }
      }

      // 2. Thumbstick Locomotion
      if (source.gamepad && source.gamepad.axes) {
        const axes = source.gamepad.axes;
        if (axes.length >= 4) {
          const moveX = axes[2];
          const moveZ = axes[3];
          if (Math.abs(moveX) > 0.15 || Math.abs(moveZ) > 0.15) {
            const cam = window.sceneBuilder.camera;
            cam.position.x += moveX * 0.05;
            cam.position.z += moveZ * 0.05;
          }
        }
      }
    }
  }

  onHandPinchStart(source, position) {
    console.log(`[Meta XR Hand Tracking] Pinch Gesture Detected at [${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}]`);
    if (window.spatialAudio) {
      window.spatialAudio.playPredictiveGhostPulse();
    }
    // Trigger raycast selection or multi-floor elevation toggle
    const cam = window.sceneBuilder.camera;
    if (position.y > 1.4 && cam.position.y < 3.0) {
      // Elevate to First Floor (G+1)
      cam.position.y = 5.25;
      console.log("[Spatial Layout] Elevated to First Floor (G+1) via hand pinch gesture.");
    } else if (position.y < 1.0 && cam.position.y > 3.0) {
      // Descend to Ground Floor (G)
      cam.position.y = 1.65;
      console.log("[Spatial Layout] Descended to Ground Floor (G) via hand pinch gesture.");
    }
  }

  onHandPinchEnd(source) {
    // Release spatial grab
  }
}

window.webxrManager = new WebXRManager();

