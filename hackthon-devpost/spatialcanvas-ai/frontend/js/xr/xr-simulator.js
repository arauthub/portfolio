/**
 * SpatialCanvas AI - Desktop Meta XR Simulator
 * Emulates Meta Quest 6DoF tracking, 1:1 room-scale walking (WASD + mouse look),
 * architectural orbit inspection, and click-to-teleport raycasting.
 */

class MetaXRSimulator {
  constructor() {
    this.mode = "walk"; // "walk" (1:1 scale first-person) or "orbit"
    this.orbitControls = null;
    this.moveState = { forward: false, backward: false, left: false, right: false, up: false, down: false };
    this.isPointerLocked = false;
    this.walkSpeed = 4.2; // 4.2 m/s
    this.euler = new THREE.Euler(0, 0, 0, "YXZ");
    this.crosshair = document.getElementById("simulator-crosshair");
    this.modeBtn = document.getElementById("btn-toggle-camera-mode");

    this.initOrbitControls();
    this.bindEvents();
  }

  initOrbitControls() {
    if (typeof THREE.OrbitControls !== "undefined") {
      this.orbitControls = new THREE.OrbitControls(
        window.sceneBuilder.camera,
        window.sceneBuilder.renderer.domElement
      );
      this.orbitControls.enableDamping = true;
      this.orbitControls.dampingFactor = 0.05;
      this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep above floor
      this.orbitControls.target.set(0, 1.8, 0);
      this.orbitControls.enabled = false; // Start in walk mode
    }
  }

  bindEvents() {
    // Keyboard inputs
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));

    // Pointer Lock & Mouse Look for 1:1 walking
    const dom = window.sceneBuilder.renderer.domElement;
    dom.addEventListener("click", (e) => {
      if (this.mode === "walk" && !this.isPointerLocked) {
        dom.requestPointerLock?.();
      } else if (this.isPointerLocked) {
        this.onClickTeleport();
      }
    });

    document.addEventListener("pointerlockchange", () => {
      this.isPointerLocked = document.pointerLockElement === dom;
      if (this.crosshair) {
        if (this.isPointerLocked && this.mode === "walk") {
          this.crosshair.classList.add("active");
        } else {
          this.crosshair.classList.remove("active");
        }
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (this.isPointerLocked && this.mode === "walk") {
        const movementX = e.movementX || 0;
        const movementY = e.movementY || 0;

        this.euler.setFromQuaternion(window.sceneBuilder.camera.quaternion);
        this.euler.y -= movementX * 0.0022;
        this.euler.x -= movementY * 0.0022;
        this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));

        window.sceneBuilder.camera.quaternion.setFromEuler(this.euler);
      }
    });

    // Camera Mode Toggle Button
    if (this.modeBtn) {
      this.modeBtn.addEventListener("click", () => this.toggleMode());
    }
  }

  toggleMode() {
    if (this.mode === "walk") {
      this.mode = "orbit";
      if (document.exitPointerLock) document.exitPointerLock();
      if (this.orbitControls) {
        this.orbitControls.enabled = true;
        this.orbitControls.target.set(0, 1.8, 0);
      }
      window.sceneBuilder.camera.position.set(0, 14, 18);
      if (this.modeBtn) this.modeBtn.innerHTML = "<span>Mode: Architectural Orbit</span>";
    } else {
      this.mode = "walk";
      if (this.orbitControls) this.orbitControls.enabled = false;
      window.sceneBuilder.camera.position.set(0, 1.65, 4);
      if (this.modeBtn) this.modeBtn.innerHTML = "<span>Mode: 1:1 Scale Walk</span>";
    }
  }

  onKeyDown(e) {
    if (e.target.tagName === "INPUT") return;
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.moveState.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.moveState.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.moveState.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.moveState.right = true;
        break;
      case "KeyE":
      case "Space":
        this.moveState.up = true;
        break;
      case "KeyQ":
      case "KeyC":
        this.moveState.down = true;
        break;
      case "KeyV":
        this.toggleMode();
        break;
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.moveState.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.moveState.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.moveState.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.moveState.right = false;
        break;
      case "KeyE":
      case "Space":
        this.moveState.up = false;
        break;
      case "KeyQ":
      case "KeyC":
        this.moveState.down = false;
        break;
    }
  }

  onClickTeleport() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), window.sceneBuilder.camera);
    const intersects = raycaster.intersectObjects(window.sceneBuilder.nodesGroup.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const target = hit.point;
      const cam = window.sceneBuilder.camera;
      cam.position.x = target.x;
      cam.position.z = target.z;
      if (window.spatialAudio) {
        window.spatialAudio.playTeleportWhoosh();
      }
    }
  }

  update(delta) {
    if (this.mode === "orbit") {
      if (this.orbitControls) this.orbitControls.update();
      return;
    }

    // 1:1 Scale Walk Movement
    const cam = window.sceneBuilder.camera;
    const moveVector = new THREE.Vector3();

    if (this.moveState.forward) moveVector.z -= 1;
    if (this.moveState.backward) moveVector.z += 1;
    if (this.moveState.left) moveVector.x -= 1;
    if (this.moveState.right) moveVector.x += 1;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      moveVector.applyEuler(new THREE.Euler(0, this.euler.y, 0, "YXZ"));
      cam.position.addScaledVector(moveVector, this.walkSpeed * delta);
    }

    // Elevation (Flight/Climb)
    if (this.moveState.up) cam.position.y += this.walkSpeed * 0.7 * delta;
    if (this.moveState.down) cam.position.y = Math.max(1.2, cam.position.y - this.walkSpeed * 0.7 * delta);
  }
}

window.metaXRSimulator = new MetaXRSimulator();

