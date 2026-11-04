/**
 * SpatialCanvas AI - 1980s Retro Digital Media Procedural Renderer
 * Generates horizon neon suns, infinite perspective grids, CRT monitor arrays
 * with procedural phosphor canvas shaders, cassette decks, and holograms.
 */

class RetroRenderer {
  constructor() {
    this.animatedScreens = [];
    this.hologramNodes = [];
    this.tapeReels = [];
    this.animTime = 0;
  }

  createRetroSun(node) {
    const radius = node.transform.scale.x || 8.0;
    const group = new THREE.Group();
    group.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);

    // Draw sliced synthwave sun on canvas
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Sun gradient (Hot yellow at top to deep magenta at bottom)
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#fde047");
    grad.addColorStop(0.5, "#f97316");
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal retro shutter slices
    ctx.globalCompositeOperation = "destination-out";
    for (let y = 260; y < 500; y += 28) {
      const sliceHeight = (y - 250) * 0.08;
      ctx.fillRect(0, y, 512, sliceHeight);
    }

    const sunTex = new THREE.CanvasTexture(canvas);
    const sunGeom = new THREE.PlaneGeometry(radius * 2, radius * 2);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    group.add(sunMesh);

    // Soft outer glow sprite
    const glowGeom = new THREE.PlaneGeometry(radius * 3.5, radius * 3.5);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(glowGeom, glowMat));

    group.userData = { nodeId: node.id, type: "retro_sun" };
    return group;
  }

  createNeonGrid(node) {
    const size = node.transform.scale.x || 60.0;
    const divisions = 40;
    const grid = new THREE.GridHelper(size, divisions, 0xff007f, 0x06b6d4);
    grid.position.set(0, -0.05, 0);
    grid.material.transparent = true;
    grid.material.opacity = 0.8;
    grid.userData = { nodeId: node.id, type: "neon_grid" };
    return grid;
  }

  createCRTMonitor(node) {
    const group = new THREE.Group();
    group.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);
    if (node.transform.rotation) {
      group.rotation.y = THREE.MathUtils.degToRad(node.transform.rotation.yaw || 0);
    }

    const sw = node.transform.scale.x || 1.4;
    const sh = node.transform.scale.y || 1.0;
    const sd = node.transform.scale.z || 0.5;
    const phosphor = node.metadata?.phosphor || "#39ff14";
    const channel = node.metadata?.channel || "synthwave_sunset";

    // 1. CRT Outer Beveled Chassis (Beige / Matte Dark Grey)
    const chassisGeom = new THREE.BoxGeometry(sw, sh, sd);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.2,
    });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.castShadow = true;
    group.add(chassis);

    // 2. Procedural Canvas Screen
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");

    const screenTex = new THREE.CanvasTexture(canvas);
    const screenGeom = new THREE.PlaneGeometry(sw * 0.82, sh * 0.78);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      transparent: false,
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.z = sd / 2 + 0.01;
    group.add(screenMesh);

    // Ambient Phosphor Screen Glow Light
    const glowLight = new THREE.PointLight(new THREE.Color(phosphor), 0.8, 4.0);
    glowLight.position.set(0, 0, 0.4);
    group.add(glowLight);

    // Store animated screen object
    this.animatedScreens.push({
      canvas,
      ctx,
      texture: screenTex,
      channel,
      phosphor,
      label: node.name || "CRT-84",
      overlay: node.metadata?.overlay_text || "SYSTEM 84",
    });

    group.userData = { nodeId: node.id, type: "crt_monitor" };
    return group;
  }

  createHologram(node) {
    const group = new THREE.Group();
    group.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);

    const glowColor = new THREE.Color(node.color || "#06b6d4");
    const h = node.transform.scale.y || 2.2;
    const subject = node.metadata?.subject || "wireframe_delorean";

    // Pedestal Emitter Disk
    const pedGeom = new THREE.CylinderGeometry(0.8, 0.9, 0.15, 24);
    const pedMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
    const ped = new THREE.Mesh(pedGeom, pedMat);
    ped.position.y = 0.08;
    group.add(ped);

    // Hologram Projection Cone / Light Column
    const coneGeom = new THREE.CylinderGeometry(1.2, 0.6, h, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.y = h / 2;
    group.add(cone);

    // 3D Wireframe Target Mesh (Rotating Pyramid or Torus)
    let holoGeom;
    if (subject === "neon_pyramid") {
      holoGeom = new THREE.TetrahedronGeometry(0.9, 0);
    } else {
      holoGeom = new THREE.TorusKnotGeometry(0.55, 0.18, 64, 12);
    }

    const holoWireMat = new THREE.MeshBasicMaterial({
      color: glowColor,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const holoMesh = new THREE.Mesh(holoGeom, holoWireMat);
    holoMesh.position.y = h * 0.65;
    group.add(holoMesh);

    this.hologramNodes.push(holoMesh);

    group.userData = { nodeId: node.id, type: "hologram" };
    return group;
  }

  createCassetteDeck(node) {
    const group = new THREE.Group();
    group.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);

    const w = node.transform.scale.x || 0.8;
    const h = node.transform.scale.y || 0.3;
    const d = node.transform.scale.z || 0.5;

    // Body
    const bodyGeom = new THREE.BoxGeometry(w, h, d);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.6 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    group.add(body);

    // Cassette Window
    const winGeom = new THREE.BoxGeometry(w * 0.5, h * 0.6, 0.02);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true });
    const win = new THREE.Mesh(winGeom, winMat);
    win.position.set(0, 0, d / 2 + 0.01);
    group.add(win);

    group.userData = { nodeId: node.id, type: "cassette_deck" };
    return group;
  }

  update(delta) {
    this.animTime += delta;

    // 1. Rotate Holograms
    this.hologramNodes.forEach((mesh, idx) => {
      mesh.rotation.y += delta * (1.2 + idx * 0.3);
      mesh.rotation.x = Math.sin(this.animTime * 2 + idx) * 0.2;
    });

    // 2. Animate CRT Screens (Scanlines, Torus, Spectrum bars)
    this.animatedScreens.forEach((scr) => {
      const { ctx, canvas, texture, channel, phosphor, overlay } = scr;
      const w = 512;
      const h = 384;

      // Dark phosphor background
      ctx.fillStyle = "#05080f";
      ctx.fillRect(0, 0, w, h);

      // CRT Scanlines
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 2);
      }

      ctx.strokeStyle = phosphor;
      ctx.fillStyle = phosphor;

      // Draw Channel
      if (channel === "wireframe_torus") {
        // Rotating Lissajous / Torus pattern
        ctx.lineWidth = 3;
        ctx.beginPath();
        const cx = w / 2;
        const cy = h / 2 - 10;
        const t = this.animTime * 2.5;
        for (let a = 0; a < Math.PI * 2; a += 0.08) {
          const r = 90 + Math.sin(a * 4 + t) * 35;
          const px = cx + Math.cos(a + t * 0.5) * r;
          const py = cy + Math.sin(a * 2 + t * 0.3) * (r * 0.6);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (channel === "spectrum_analyzer") {
        // Bouncing VU Spectrum Bars
        const barCount = 18;
        const barWidth = 20;
        const spacing = 6;
        const startX = (w - (barCount * (barWidth + spacing))) / 2;
        for (let i = 0; i < barCount; i++) {
          const val = Math.abs(Math.sin(this.animTime * 4 + i * 0.4)) * 180 + 30;
          const x = startX + i * (barWidth + spacing);
          const y = h - 60 - val;
          ctx.fillRect(x, y, barWidth, val);
        }
      } else {
        // Vector Flight Horizon
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.6);
        ctx.lineTo(w, h * 0.6);
        ctx.stroke();
        for (let x = 0; x <= w; x += 64) {
          ctx.beginPath();
          ctx.moveTo(w / 2, h * 0.6);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
      }

      // CRT phosphor text header & footer
      ctx.font = "bold 20px 'SF Mono', monospace";
      ctx.fillText(`⚡ ${overlay}`, 24, 38);
      ctx.font = "14px 'SF Mono', monospace";
      ctx.fillText(`FPS: 90 | VSYNC: ON | ${new Date().toLocaleTimeString()}`, 24, h - 20);

      texture.needsUpdate = true;
    });
  }
}

window.retroRenderer = new RetroRenderer();

