/**
 * SpatialCanvas AI - Master Three.js Scene Builder & Graph Manager
 * Integrates physically based lighting, WebXR shadow maps,
 * predictive ghost wireframes, and scene synchronization.
 */

class SceneBuilder {
  constructor() {
    this.container = document.getElementById("canvas-container");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.activeGhostMesh = null;
    this.clock = new THREE.Clock();
    this.currentSceneData = null;
    this.lightsGroup = new THREE.Group();
    this.nodesGroup = new THREE.Group();

    this.initThree();
  }

  initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#090a0f");

    // 2. Camera (default 1:1 scale eye-height at 1.65m)
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.65, 5);

    // 3. WebGL Renderer with WebXR support
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.xr.enabled = true; // Enables Meta Quest WebXR
    this.container.appendChild(this.renderer.domElement);

    this.scene.add(this.lightsGroup);
    this.scene.add(this.nodesGroup);

    window.addEventListener("resize", () => this.onWindowResize());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setupLighting(envType, ambientColor, ambientIntensity) {
    // Clear old lights
    while (this.lightsGroup.children.length > 0) {
      this.lightsGroup.remove(this.lightsGroup.children[0]);
    }

    if (envType === "synthwave_void") {
      this.scene.background = new THREE.Color("#0c0714");
      this.scene.fog = new THREE.FogExp2("#0c0714", 0.02);

      const amb = new THREE.AmbientLight(0x3b0764, 0.8);
      this.lightsGroup.add(amb);

      const dirLight = new THREE.DirectionalLight(0xff007f, 1.2);
      dirLight.position.set(0, 15, -25);
      this.lightsGroup.add(dirLight);

      const cyanPoint = new THREE.PointLight(0x06b6d4, 2.0, 30);
      cyanPoint.position.set(0, 6, 0);
      this.lightsGroup.add(cyanPoint);
    } else {
      // Modern Farmhouse: Natural warm sunlight
      this.scene.background = new THREE.Color("#f1f5f9");
      this.scene.fog = new THREE.FogExp2("#f1f5f9", 0.008);

      const amb = new THREE.AmbientLight(ambientColor || 0xffffff, ambientIntensity || 0.7);
      this.lightsGroup.add(amb);

      const sun = new THREE.DirectionalLight(0xfffbeb, 1.4);
      sun.position.set(12, 22, 10);
      sun.castShadow = true;
      sun.shadow.mapSize.width = 2048;
      sun.shadow.mapSize.height = 2048;
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far = 60;
      sun.shadow.camera.left = -20;
      sun.shadow.camera.right = 20;
      sun.shadow.camera.top = 20;
      sun.shadow.camera.bottom = -20;
      this.lightsGroup.add(sun);

      const fill = new THREE.DirectionalLight(0x93c5fd, 0.4);
      fill.position.set(-10, 15, -10);
      this.lightsGroup.add(fill);
    }
  }

  buildScene(sceneData) {
    this.currentSceneData = sceneData;

    // Enterprise VRAM Cleanup: Dispose all geometries, materials, and textures
    while (this.nodesGroup.children.length > 0) {
      const child = this.nodesGroup.children[0];
      this.disposeHierarchy(child);
      this.nodesGroup.remove(child);
    }
    retroRenderer.animatedScreens = [];
    retroRenderer.hologramNodes = [];

    // Lighting
    this.setupLighting(
      sceneData.environment,
      sceneData.ambient_light_color,
      sceneData.ambient_light_intensity
    );

    // Build Nodes
    sceneData.nodes.forEach((node) => {
      let mesh = null;
      switch (node.node_type) {
        case "floor":
          mesh = architecturalRenderer.createFloorMesh(node);
          break;
        case "wall":
        case "ceiling":
          mesh = architecturalRenderer.createWallMesh(node);
          break;
        case "furniture":
        case "staircase":
        case "pergola":
          mesh = architecturalRenderer.createFurnitureMesh(node);
          break;
        case "dimension_label":
          mesh = architecturalRenderer.createDimensionMarker(node);
          break;
        case "retro_sun":
          mesh = retroRenderer.createRetroSun(node);
          break;
        case "neon_grid":
          mesh = retroRenderer.createNeonGrid(node);
          break;
        case "crt_monitor":
          mesh = retroRenderer.createCRTMonitor(node);
          break;
        case "hologram_emitter":
          mesh = retroRenderer.createHologram(node);
          break;
        case "cassette_deck":
          mesh = retroRenderer.createCassetteDeck(node);
          break;
        default:
          break;
      }
      if (mesh) {
        this.nodesGroup.add(mesh);
      }
    });

    // Remove any predictive ghost
    this.clearPredictiveGhost();
  }

  spawnPredictiveGhost(ghostData) {
    this.clearPredictiveGhost();

    const w = ghostData.dimensions?.x || 4.0;
    const h = ghostData.dimensions?.y || 3.0;
    const d = ghostData.dimensions?.z || 4.0;
    const colorHex = ghostData.wireframe_color || "#38bdf8";

    const group = new THREE.Group();
    group.position.set(
      ghostData.position.x || 0,
      ghostData.position.y || 1.5,
      ghostData.position.z || -3
    );

    // 1. Neon Wireframe Bounding Box
    const boxGeom = new THREE.BoxGeometry(w, h, d);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const wireMesh = new THREE.Mesh(boxGeom, wireMat);
    group.add(wireMesh);

    // 2. Translucent Volume
    const fillMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const fillMesh = new THREE.Mesh(boxGeom, fillMat);
    group.add(fillMesh);

    // 3. Floating Holographic Predictive Label
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colorHex;
    ctx.font = "bold 26px 'SF Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`⚡ ${ghostData.label}`, 256, 64);

    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(0, h / 2 + 0.6, 0);
    sprite.scale.set(2.4, 0.6, 1.0);
    group.add(sprite);

    this.scene.add(group);
    this.activeGhostMesh = group;

    // Trigger audio feedback
    if (window.spatialAudio) {
      window.spatialAudio.playPredictiveGhostPulse();
    }
  }

  clearPredictiveGhost() {
    if (this.activeGhostMesh) {
      this.disposeHierarchy(this.activeGhostMesh);
      this.scene.remove(this.activeGhostMesh);
      this.activeGhostMesh = null;
    }
  }

  disposeHierarchy(obj) {
    if (!obj) return;
    obj.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => this.disposeMaterial(mat));
        } else {
          this.disposeMaterial(child.material);
        }
      }
    });
  }

  disposeMaterial(mat) {
    if (!mat) return;
    if (mat.map) mat.map.dispose();
    if (mat.lightMap) mat.lightMap.dispose();
    if (mat.bumpMap) mat.bumpMap.dispose();
    if (mat.normalMap) mat.normalMap.dispose();
    if (mat.specularMap) mat.specularMap.dispose();
    if (mat.envMap) mat.envMap.dispose();
    mat.dispose();
  }
}

window.sceneBuilder = new SceneBuilder();

