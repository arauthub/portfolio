import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiConciergeService } from '../../services/ai-concierge.service';

@Component({
  selector: 'app-ai-chat-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating AI Stylist Trigger Button -->
    <button class="ai-floating-trigger" (click)="ai.toggleDrawer()" title="Consult Wagtail AI Personal Stylist" aria-label="Consult Wagtail AI Personal Stylist">
      <span class="ai-halo" aria-hidden="true"></span>
      <span class="ai-sparkle" aria-hidden="true">✦</span>
      <span class="lbl">AI STYLIST</span>
    </button>

    <!-- Slide-Over Drawer -->
    @if (ai.isOpen()) {
      <div class="ai-backdrop" (click)="ai.closeDrawer()">
        <div class="ai-drawer" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="ai-drawer-title">
          
          <!-- Drawer Header -->
          <div class="drawer-header">
            <div class="header-left">
              <div class="ai-avatar" aria-hidden="true">✦</div>
              <div>
                <h4 id="ai-drawer-title">Wagtail AI Personal Stylist</h4>
                <span class="sub">Geneviève • Architectural Haute Couture Concierge</span>
              </div>
            </div>
            <button class="close-btn" (click)="ai.closeDrawer()" aria-label="Close AI Stylist Drawer">✕</button>
          </div>

          <!-- Quick Suggestion Prompts -->
          <div class="quick-prompts">
            <button class="prompt-chip" (click)="sendPreset('What are the privileges of VIP Black membership?')">
              VIP Privileges
            </button>
            <button class="prompt-chip" (click)="sendPreset('How does sizing work for cashmere trench coats?')">
              Sizing & Fit Guide
            </button>
            <button class="prompt-chip" (click)="sendPreset('Recommend a silk evening gown for a gala')">
              Gala Styling
            </button>
            <button class="prompt-chip" (click)="sendPreset('Where are Petit Maison kids clothes located?')">
              Kids Clothing
            </button>
          </div>

          <!-- Messages Stream -->
          <div class="messages-stream">
            @for (msg of ai.messages(); track msg.id) {
              <div class="msg-bubble" [class.user]="msg.sender === 'user'" [class.ai]="msg.sender === 'ai'">
                @if (msg.sender === 'ai') {
                  <span class="sender-label">{{ msg.stylistName || 'Geneviève' }}</span>
                }
                <div class="text-content">{{ msg.text }}</div>
                
                @if (msg.suggestedSkus && msg.suggestedSkus.length > 0) {
                  <div class="sku-recs">
                    <span class="rec-title">Curated Pieces:</span>
                    @for (sku of msg.suggestedSkus; track sku) {
                      <span class="sku-chip">{{ sku }}</span>
                    }
                  </div>
                }

                <span class="timestamp">{{ msg.timestamp }}</span>
              </div>
            }

            @if (ai.isThinking()) {
              <div class="thinking-bubble">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                <span>Geneviève is tailoring recommendations...</span>
              </div>
            }
          </div>

          <!-- Chat Input -->
          <div class="input-area">
            <input 
              type="text" 
              [(ngModel)]="chatText" 
              (keyup.enter)="submitQuery()"
              placeholder="Ask Geneviève about fabrics, sizing, VIP perks..." 
              class="chat-input" />
            <button class="send-btn" (click)="submitQuery()">Send</button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .ai-floating-trigger {
      position: fixed;
      bottom: 84px;
      right: 20px;
      z-index: 900;
      background: #121419;
      border: 1px solid var(--accent-gold, #EAD8C0);
      color: var(--accent-gold, #EAD8C0);
      border-radius: 9999px;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 1px;
      transition: all 0.3s;
    }

    .ai-floating-trigger:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(234, 216, 192, 0.2);
    }

    .ai-sparkle {
      font-size: 14px;
      color: #FFF;
      animation: sparkleRotate 4s linear infinite;
    }

    @keyframes sparkleRotate {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1); }
    }

    .ai-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 6, 8, 0.85);
      backdrop-filter: blur(10px);
      z-index: 1250;
      display: flex;
      justify-content: flex-end;
    }

    .ai-drawer {
      background: #121419;
      border-left: 1px solid rgba(255, 255, 255, 0.16);
      width: 440px;
      max-width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
    }

    .drawer-header {
      padding: 18px 20px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ai-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
    }

    .header-left h4 {
      margin: 0;
      font-size: 14px;
      color: #FFF;
      font-weight: 600;
    }

    .header-left .sub {
      font-size: 11px;
      color: #94A3B8;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 18px;
      cursor: pointer;
    }

    .quick-prompts {
      display: flex;
      gap: 6px;
      padding: 10px 16px;
      overflow-x: auto;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .prompt-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #CBD5E1;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 9999px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .prompt-chip:hover {
      border-color: var(--accent-gold, #EAD8C0);
      color: var(--accent-gold, #EAD8C0);
    }

    .messages-stream {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .msg-bubble {
      max-width: 85%;
      padding: 12px 14px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.5;
    }

    .msg-bubble.ai {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
    }

    .msg-bubble.user {
      align-self: flex-end;
      background: rgba(234, 216, 192, 0.15);
      border: 1px solid var(--accent-gold, #EAD8C0);
      color: #FFF;
    }

    .sender-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-gold, #EAD8C0);
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .text-content {
      white-space: pre-wrap;
    }

    .sku-recs {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .rec-title {
      font-size: 10px;
      color: #94A3B8;
    }

    .sku-chip {
      background: rgba(234, 216, 192, 0.2);
      color: var(--accent-gold, #EAD8C0);
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }

    .timestamp {
      display: block;
      font-size: 9px;
      color: #64748B;
      margin-top: 4px;
      text-align: right;
    }

    .thinking-bubble {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #94A3B8;
      padding: 8px 14px;
    }

    .thinking-bubble .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent-gold, #EAD8C0);
      animation: blinkDot 1.4s infinite both;
    }

    .thinking-bubble .dot:nth-child(2) { animation-delay: 0.2s; }
    .thinking-bubble .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blinkDot {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }

    .input-area {
      padding: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      gap: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    .chat-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 10px 14px;
      color: #FFF;
      font-size: 13px;
    }

    .chat-input:focus {
      outline: none;
      border-color: var(--accent-gold, #EAD8C0);
    }

    .send-btn {
      background: var(--brand-gradient, linear-gradient(135deg, #EAD8C0 0%, #C19A6B 100%));
      color: #0A0B0E;
      border: none;
      padding: 0 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .ai-floating-trigger {
        bottom: calc(74px + env(safe-area-inset-bottom, 0px));
        right: 14px;
        padding: 8px 12px;
        font-size: 10px;
      }
      .ai-drawer {
        width: 100vw;
      }
    }
  `]
})
export class AiChatDrawerComponent {
  ai = inject(AiConciergeService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.ai.isOpen()) {
      this.ai.closeDrawer();
    }
  }

  chatText = '';

  submitQuery(): void {
    if (!this.chatText.trim()) return;
    this.ai.sendMessage(this.chatText);
    this.chatText = '';
  }

  sendPreset(text: string): void {
    this.ai.sendMessage(text);
  }
}
