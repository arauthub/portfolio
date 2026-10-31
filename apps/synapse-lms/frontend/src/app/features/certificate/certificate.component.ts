import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';
import { TenantService } from '../../core/services/tenant.service';
import { SoundFxService } from '../../core/services/sound-fx.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-hud)]">
        <div>
          <div class="text-xs font-mono text-[var(--neon-primary)] tracking-widest uppercase mb-1">
            CRYPTOGRAPHIC CREDENTIAL VERIFIER
          </div>
          <h1 class="text-2xl font-display font-extrabold text-white">
            Holographic Certificate of Mastery
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="printCert()" class="cyber-btn text-xs">
            🖨️ Print / Save as PDF
          </button>
          <a routerLink="/courses" (click)="sound.playClick()" class="cyber-btn cyber-btn-secondary text-xs">
            Return to Missions
          </a>
        </div>
      </div>

      <!-- Futuristic Certificate Card -->
      <section 
        id="printable-certificate" 
        role="region"
        aria-label="Holographic Certificate of Mastery"
        class="relative p-1 bg-gradient-to-br from-[var(--neon-primary)] via-purple-600 to-[var(--neon-accent)] rounded-2xl shadow-2xl">
        
        <div class="bg-[#050811] p-5 sm:p-8 md:p-12 rounded-[14px] relative overflow-hidden space-y-6 sm:space-y-8 border border-white/10">
          
          <!-- Hologram watermark pattern -->
          <div class="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[var(--neon-primary)]/5 filter blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-[var(--neon-primary)]/10 border border-[var(--neon-primary)] flex items-center justify-center text-2xl font-display font-black text-[var(--neon-primary)]">
                S
              </div>
              <div>
                <h3 class="font-display font-bold text-lg tracking-wider text-white">SYNAPSE LMS</h3>
                <div class="text-xs font-mono text-[var(--neon-primary)]">{{ tenantService.currentTenant().name }}</div>
              </div>
            </div>

            <div class="text-right font-mono text-[10px] text-slate-400">
              <div>PROTOCOL ID: #SYN-8921-X9</div>
              <div>VERIFIABLE ON-CHAIN HASH: 0x9f4a...e12d</div>
            </div>
          </div>

          <!-- Certificate Body -->
          <div class="text-center space-y-4 py-4">
            <div class="text-xs font-mono tracking-widest uppercase text-slate-400">
              THIS RECOGNIZES THAT CYBERNETIC CADET
            </div>

            <h2 class="text-3xl sm:text-4xl font-display font-black text-white neon-glow-primary tracking-wide">
              {{ gamification.profile().callsign }}
            </h2>

            <div class="text-xs font-mono text-slate-400">
              HAS DEMONSTRATED RIGOROUS COMPETENCY AND COMPLETED THE CURRICULUM:
            </div>

            <h3 class="text-xl sm:text-2xl font-display font-bold text-[var(--neon-secondary)]">
              Quantum AI Architecture & Neural Synergies
            </h3>

            <p class="text-xs font-mono text-slate-400 max-w-xl mx-auto leading-relaxed">
              Including practical laboratory verification of superconducting transmon states,
              Bell-state entanglement matrices, and post-quantum zero-trust defense architectures.
            </p>
          </div>

          <!-- Footer Seal & Signatures -->
          <div class="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-6">
            <div class="font-mono text-xs text-slate-400 space-y-1">
              <div>ISSUANCE EPOCH: 2026-10-31</div>
              <div>AUTHORIZED BY: Lead Curriculum Council</div>
              <div class="text-[10px] text-emerald-400">STATUS: VERIFIED & CRYPTOGRAPHICALLY SIGNED</div>
            </div>

            <!-- Verification QR Mockup -->
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                <div class="w-full h-full bg-black rounded flex items-center justify-center font-mono text-[8px] text-white text-center leading-tight">
                  QR VERIFY
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

    </div>
  `
})
export class CertificateComponent {
  public gamification = inject(GamificationService);
  public tenantService = inject(TenantService);
  public sound = inject(SoundFxService);

  public printCert() {
    this.sound.playSuccess();
    window.print();
  }
}

