/**
 * SpatialCanvas AI - Spatial HUD & Voice Interaction Controller
 * Manages Web Speech API, microphone streaming, preset prompt pills,
 * and telemetry updates (FPS, latency, node counts).
 */

class SpatialHUD {
  constructor() {
    this.micBtn = document.getElementById("mic-btn");
    this.promptInput = document.getElementById("prompt-input");
    this.sendBtn = document.getElementById("send-btn");
    this.fpsBadge = document.getElementById("telemetry-fps");
    this.latencyBadge = document.getElementById("telemetry-latency");
    this.nodesBadge = document.getElementById("telemetry-nodes");

    this.isRecording = false;
    this.recognition = null;
    this.fpsFrames = 0;
    this.fpsLastTime = performance.now();

    this.initSpeechRecognition();
    this.bindEvents();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.micBtn.classList.add("recording");
        if (window.spatialAudio) window.spatialAudio.playVoiceMicStart();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.promptInput) this.promptInput.value = transcript;
        this.submitPrompt(transcript);
      };

      this.recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        this.stopRecording();
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    }
  }

  bindEvents() {
    // Mic Button
    if (this.micBtn) {
      this.micBtn.addEventListener("click", () => this.toggleRecording());
    }

    // Send Button
    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => {
        const text = this.promptInput.value.trim();
        if (text) this.submitPrompt(text);
      });
    }

    // Enter Key on input
    if (this.promptInput) {
      this.promptInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const text = this.promptInput.value.trim();
          if (text) this.submitPrompt(text);
        }
      });
    }

    // Preset Pills
    document.querySelectorAll(".pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prompt = btn.getAttribute("data-prompt");
        if (prompt) {
          if (this.promptInput) this.promptInput.value = prompt;
          this.submitPrompt(prompt);
        }
      });
    });

    // Scene Switch Buttons
    const btnFarm = document.getElementById("btn-scene-farmhouse");
    const btnRetro = document.getElementById("btn-scene-retro");

    if (btnFarm) {
      btnFarm.addEventListener("click", () => {
        window.app.switchScene("g1_farmhouse");
        btnFarm.classList.add("active");
        if (btnRetro) btnRetro.classList.remove("active");
      });
    }

    if (btnRetro) {
      btnRetro.addEventListener("click", () => {
        window.app.switchScene("retro_80s_studio");
        btnRetro.classList.add("active");
        if (btnFarm) btnFarm.classList.remove("active");
      });
    }

    // Reset Scene Button
    const btnReset = document.getElementById("btn-reset-scene");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        window.app.resetCurrentScene();
      });
    }
  }

  toggleRecording() {
    if (!this.recognition) {
      // Fallback: prompt user for quick simulated voice
      const demoPrompts = [
        "Add an east-facing sunroom studio on the first floor",
        "Add a timber pergola rooftop terrace deck",
        "Transform into 1980s retro synthwave studio with CRT monitors",
        "Spawn curved Sony Trinitron CRT monitor with green phosphor",
        "Validate 1:1 architectural scale and structural headroom",
      ];
      const pick = demoPrompts[Math.floor(Math.random() * demoPrompts.length)];
      if (this.promptInput) this.promptInput.value = pick;
      this.submitPrompt(pick);
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        this.stopRecording();
      }
    }
  }

  stopRecording() {
    this.isRecording = false;
    if (this.micBtn) this.micBtn.classList.remove("recording");
  }

  submitPrompt(transcript) {
    if (!transcript) return;
    this.stopRecording();

    // Send over WebSocket
    window.app.sendVoiceCommand(transcript);
  }

  updateFPS() {
    this.fpsFrames++;
    const now = performance.now();
    if (now >= this.fpsLastTime + 1000) {
      const fps = Math.round((this.fpsFrames * 1000) / (now - this.fpsLastTime));
      if (this.fpsBadge) this.fpsBadge.textContent = `${fps} FPS`;
      this.fpsFrames = 0;
      this.fpsLastTime = now;
    }
  }

  updateLatency(latencyMs) {
    if (this.latencyBadge) {
      this.latencyBadge.textContent = `${latencyMs}ms`;
    }
  }

  updateNodeCount(count) {
    if (this.nodesBadge) {
      this.nodesBadge.textContent = `${count} nodes`;
    }
  }
}

window.spatialHUD = new SpatialHUD();

