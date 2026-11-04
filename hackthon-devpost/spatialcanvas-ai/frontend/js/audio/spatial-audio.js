/**
 * SpatialCanvas AI - Web Audio API Procedural Spatial Synthesizer
 * Generates ambient synthwave harmonies, predictive ghost sonic pulses,
 * and spatial haptic audio cues.
 */

class SpatialAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientSynthNode = null;
    this.ambientGainNode = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playVoiceMicStart() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playPredictiveGhostPulse() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    // Sub-15ms cybernetic scan beep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  playMCPToolBake() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    // 3-note harmonic major chord when MCP finishes baking geometry
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.45);
    });
  }

  playTeleportWhoosh() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  startRetroSynthDrone() {
    this.ensureContext();
    if (!this.ctx || this.isMuted || this.ambientSynthNode) return;

    try {
      this.ambientGainNode = this.ctx.createGain();
      this.ambientGainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const osc1 = this.ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(98.0, this.ctx.currentTime); // G2

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGainNode);
      this.ambientGainNode.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      this.ambientSynthNode = { osc1, osc2 };
    } catch (e) {
      console.warn("Could not start retro synth drone:", e);
    }
  }

  stopRetroSynthDrone() {
    if (this.ambientSynthNode) {
      try {
        this.ambientSynthNode.osc1.stop();
        this.ambientSynthNode.osc2.stop();
      } catch (e) {}
      this.ambientSynthNode = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ambientGainNode) {
      this.ambientGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

window.spatialAudio = new SpatialAudioEngine();

