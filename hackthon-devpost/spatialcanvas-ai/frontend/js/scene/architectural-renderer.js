/**
 * SpatialCanvas AI - Architectural 3D Procedural Renderer
 * Renders 1:1 true scale G+1 Farmhouse geometry, materials, lighting,
 * and holographic dimension labels.
 */

class ArchitecturalRenderer {
  constructor() {
    this.textureCache = {};
    this.materialCache = {};
    this._initProceduralTextures();
  }

  _initProceduralTextures() {
    // 1. Procedural Oak Wood Plank Texture
    const canvasWood = document.createElement("canvas");
    canvasWood.width = 512;
    canvasWood.height = 512;
    const ctxW = canvasWood.getContext("2d");
    ctxW.fillStyle = "#a16207";
    ctxW.fillRect(0, 0, 512, 512);
    // Draw wood grain lines
    ctxW.strokeStyle = "#854d0e";
    ctxW.lineWidth = 2;
    for (let i = 0; i < 512; i += 32) {
      ctxW.beginPath();
      ctxW.moveTo(0, i);
      ctxW.lineTo(512, i);
      ctxW.stroke();
    }
    const woodTex = new THREE.CanvasTexture(canvasWood);
    woodTex.wrapS = THREE.RepeatWrapping;
    woodTex.wrapT = THREE.RepeatWrapping;
    woodTex.repeat.set(4, 4);
    this.textureCache["wood"] = woodTex;

    // 2. Procedural Polished Concrete Texture
    const canvasConc = document.createElement("canvas");
    canvasConc.width = 512;
    canvasConc.height = 512;
    const ctxC = canvasConc.getContext("2d");
    ctxC.fillStyle = "#cbd5e1";
    ctxC.fillRect(0, 0, 512, 512);
    // Grid lines for CAD floor tiles
    ctxC.strokeStyle = "#94a3b8";
    ctxC.lineWidth = 1;
    for (let i = 0; i <= 512; i += 64) {
      ctxC.beginPath();
      ctxC.moveTo(i, 0);
      ctxC.lineTo(i, 512);
      ctxC.stroke();
      ctxC.beginPath();
      ctxC.moveTo(0, i);
      ctxC.lineTo(512, i);
      ctxC.stroke();
    }
    const concTex = new THREE.CanvasTexture(canvasConc);
    concTex.wrapS = THREE.RepeatWrapping;
    concTex.wrapT = THREE.RepeatWrapping;
    concTex.repeat.set(4, 4);
    this.textureCache["concrete"] = concTex;

    // 3. Exposed Brick Texture
    const canvasBrick = document.createElement("canvas");
    canvasBrick.width = 512;
    canvasBrick.height = 512;
    const ctxB = canvasBrick.getContext("2d");
    ctxB.fillStyle = "#9a3412";
    ctxB.fillRect(0, 0, 512, 512);
    ctxB.strokeStyle = "#431407";
    ctxB.lineWidth = 2;
    for (let y = 0; y < 512; y += 24) {
      ctxB.beginPath();
      ctxB.moveTo(0, y);
      ctxB.lineTo(512, y);
      ctxB.stroke();
      const offset = (y / 24) % 2 === 0 ? 0 : 32;
      for (let x = offset; x < 512; x += 64) {
        ctxB.beginPath();
        ctxB.moveTo(x, y);
        ctxB.lineTo(x, y + 24);
        ctxB.stroke();
      }
    }
    const brickTex = new THREE.CanvasTexture(canvasBrick);
    brickTex.wrapS = THREE.RepeatWrapping;
    brickTex.wrapT = THREE.RepeatWrapping;
    brickTex.repeat.set(3, 3);
    this.textureCache["brick"] = brickTex;
  }

  createFloorMesh(node) {
    const geom = new THREE.BoxGeometry(
      node.transform.scale.x,
      node.transform.scale.y,
      node.transform.scale.z
    );

    let map = this.textureCache["concrete"];
    if (node.color && (node.color.includes("9a") || node.color.includes("b4") || node.color.includes("78"))) {
      map = this.textureCache["wood"];
    }

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(node.color || "#e2e8f0"),
      map: map,
      roughness: node.roughness || 0.4,
      metalness: node.metalness || 0.05,
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.userData = { nodeId: node.id, type: "floor", metadata: node.metadata };
    return mesh;
  }

  createWallMesh(node) {
    const geom = new THREE.BoxGeometry(
      node.transform.scale.x,
      node.transform.scale.y,
      node.transform.scale.z
    );

    const isGlass = node.opacity < 1.0 || (node.metadata && node.metadata.material === "curtain_glass");
    let mat;

    if (isGlass) {
      mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.35,
        roughness: 0.05,
        transmission: 0.85,
        ior: 1.5,
        thickness: 0.1,
      });
    } else {
      let map = null;
      if (node.metadata && node.metadata.material === "exposed_brick") {
        map = this.textureCache["brick"];
      }

      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color || "#f8fafc"),
        map: map,
        roughness: node.roughness || 0.7,
        metalness: node.metalness || 0.05,
      });
    }

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);
    if (node.transform.rotation) {
      mesh.rotation.y = THREE.MathUtils.degToRad(node.transform.rotation.yaw || 0);
    }
    mesh.castShadow = !isGlass;
    mesh.receiveShadow = true;
    mesh.userData = { nodeId: node.id, type: "wall", metadata: node.metadata };
    return mesh;
  }

  createFurnitureMesh(node) {
    const group = new THREE.Group();
    group.position.set(node.transform.position.x, node.transform.position.y, node.transform.position.z);
    if (node.transform.rotation) {
      group.rotation.y = THREE.MathUtils.degToRad(node.transform.rotation.yaw || 0);
    }

    const w = node.transform.scale.x;
    const h = node.transform.scale.y;
    const d = node.transform.scale.z;
    const cat = node.metadata?.category || "fixture";

    // 1. Plants / Trees
    if (cat === "plant") {
      // Pot/Trunk
      const trunkGeom = new THREE.CylinderGeometry(0.12, 0.16, h * 0.6, 12);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.y = (h * 0.6) / 2;
      trunk.castShadow = true;
      group.add(trunk);

      // Foliage Spheres
      const folGeom = new THREE.DodecahedronGeometry(w * 0.6, 2);
      const folMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
      const fol = new THREE.Mesh(folGeom, folMat);
      fol.position.y = h * 0.75;
      fol.castShadow = true;
      group.add(fol);
    }
    // 2. Seating / Sofa / Bed
    else if (cat === "seating") {
      const baseGeom = new THREE.BoxGeometry(w, h * 0.5, d);
      const baseMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(node.color || "#475569"), roughness: 0.6 });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      // Backrest
      const backGeom = new THREE.BoxGeometry(w, h * 0.6, d * 0.25);
      const backMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(node.color || "#475569"), roughness: 0.6 });
      const back = new THREE.Mesh(backGeom, backMat);
      back.position.set(0, h * 0.35, -d * 0.35);
      back.castShadow = true;
      group.add(back);
    }
    // 3. Tables / Counters
    else {
      const tableGeom = new THREE.BoxGeometry(w, h, d);
      const tableMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color || "#334155"),
        roughness: 0.3,
        metalness: 0.1,
      });
      const table = new THREE.Mesh(tableGeom, tableMat);
      table.castShadow = true;
      table.receiveShadow = true;
      group.add(table);
    }

    group.userData = { nodeId: node.id, type: "furniture", metadata: node.metadata };
    return group;
  }

  createDimensionMarker(node) {
    const text = node.metadata?.measurement || node.name || "Scale Marker";
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    // Cyberpunk/CAD Glass Banner
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 16);
    ctx.fill();
    ctx.stroke();

    // Measurement text
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 38px 'SF Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`📐 ${text}`, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(node.transform.position.x, node.transform.position.y + 0.3, node.transform.position.z);
    sprite.scale.set(1.8, 0.45, 1.0);
    sprite.userData = { nodeId: node.id, type: "dimension" };
    return sprite;
  }
}

window.architecturalRenderer = new ArchitecturalRenderer();

