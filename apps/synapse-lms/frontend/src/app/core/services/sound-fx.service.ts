import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundFxService {
  private audioCtx: AudioContext | null = null;
  public isMuted = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem('synapse_sound_muted');
    if (saved !== null) {
      this.isMuted.set(saved === 'true');
    }
  }

  public toggleMute(): boolean {
    const next = !this.isMuted();
    this.isMuted.set(next);
    localStorage.setItem('synapse_sound_muted', String(next));
    if (!next) {
      this.playClick();
    }
    return next;
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Futuristic blip on button click
  public playClick() {
    if (this.isMuted()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch {
      // AudioContext policy gracefully handled
    }
  }

  // Ascending cyber chime for completing lesson/exercise
  public playSuccess() {
    if (this.isMuted()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const start = this.audioCtx.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch {}
  }

  // Level Up Fanfare
  public playLevelUp() {
    if (this.isMuted()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const chords = [
        [440, 554.37, 659.25], // A major
        [554.37, 659.25, 880],
        [659.25, 880, 1108.73],
        [880, 1108.73, 1318.51] // High fanfare
      ];

      chords.forEach((chord, cIdx) => {
        chord.forEach(freq => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const start = this.audioCtx.currentTime + cIdx * 0.12;
          const dur = cIdx === 3 ? 0.6 : 0.2;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(start);
          osc.stop(start + dur);
        });
      });
    } catch {}
  }

  // Cyber error buzz
  public playError() {
    if (this.isMuted()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(110, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch {}
  }

  // Bounty claim shimmer
  public playBounty() {
    if (this.isMuted()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.audioCtx.currentTime); // B5
      osc.frequency.exponentialRampToValueAtTime(1975.53, this.audioCtx.currentTime + 0.2); // B6

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {}
  }
}

