import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiConciergeService } from '../../services/ai-concierge.service';

@Component({
  selector: 'app-ai-chat-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating AI Stylist Action Button -->
    <button class="floating-ai-btn" (click)="ai.toggleChat()" title="Talk to Wagtail AI Nursery Concierge" aria-label="Talk to Wagtail AI Nursery Concierge">
      <span class="material-symbols-outlined icon" aria-hidden="true">psychology</span>
      <span class="label">AI Concierge</span>
      <span class="online-dot" aria-hidden="true"></span>
    </button>

    <!-- Slide-in AI Drawer -->
    @if (ai.isChatOpen()) {
      <div class="ai-drawer-backdrop" (click)="ai.closeChat()">
        <div class="ai-drawer" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="drawer-header">
            <div class="header-info">
              <span class="ai-badge">WAGTAIL ENTERPRISE AI</span>
              <h3>Petit Maison Nursery Concierge</h3>
              <span class="sub">Childcare styling, fabric toxicology & gifting advisor</span>
            </div>
            <button class="close-btn" (click)="ai.closeChat()">✕</button>
          </div>

          <!-- Chat Conversation Stream -->
          <div class="messages-container">
            @for (msg of ai.messages(); track msg.id) {
              <div class="chat-bubble-row" [class.user]="msg.sender === 'user'" [class.assistant]="msg.sender === 'assistant'">
                
                @if (msg.sender === 'assistant') {
                  <div class="avatar-badge">
                    <span class="material-symbols-outlined">auto_awesome</span>
                  </div>
                }

                <div class="bubble-content">
                  <p class="bubble-text">{{ msg.text }}</p>
                  <span class="time-stamp">{{ msg.timestamp }}</span>

                  @if (msg.suggestions && msg.suggestions.length > 0) {
                    <div class="suggestions-chips">
                      @for (sugg of msg.suggestions; track sugg) {
                        <button class="sugg-chip" (click)="sendQuery(sugg)">{{ sugg }}</button>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            @if (ai.isTyping()) {
              <div class="chat-bubble-row assistant">
                <div class="avatar-badge"><span class="material-symbols-outlined">auto_awesome</span></div>
                <div class="bubble-content typing-bubble">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                </div>
              </div>
            }
          </div>

          <!-- Input Footer -->
          <div class="drawer-footer">
            <div class="input-row">
              <input 
                type="text" 
                [(ngModel)]="userInput" 
                (keyup.enter)="onSend()"
                placeholder="Ask about newborn sizes, organic fabrics, gift sets..." 
                class="chat-input" />
              <button class="send-btn" (click)="onSend()" [disabled]="!userInput.trim() || ai.isTyping()">
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .floating-ai-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1100;
      background: #2b3a32;
      color: #FAF6EE;
      border: 1px solid rgba(122, 168, 132, 0.4);
      padding: 10px 18px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transition: all 0.25s ease;

      .icon { font-size: 20px; color: #A3C9AC; }
      .online-dot {
        width: 8px;
        height: 8px;
        background: #A3C9AC;
        border-radius: 50%;
        box-shadow: 0 0 6px #A3C9AC;
      }

      &:hover {
        transform: translateY(-3px) scale(1.02);
        background: #1c2721;
        border-color: #7AA884;
      }
    }

    .ai-drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      z-index: 1250;
      display: flex;
      justify-content: flex-end;
    }

    .ai-drawer {
      background: #FAF6EE;
      color: #2b3a32;
      width: 100%;
      max-width: 440px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      box-shadow: -15px 0 50px rgba(0, 0, 0, 0.35);
      animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .drawer-header {
      background: #2b3a32;
      color: #FAF6EE;
      padding: 18px 20px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .ai-badge {
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #7AA884;
        text-transform: uppercase;
      }

      h3 { margin: 2px 0 4px; font-size: 1.15rem; }
      .sub { font-size: 0.72rem; color: rgba(250, 246, 238, 0.7); }

      .close-btn {
        background: none;
        border: none;
        color: #FAF6EE;
        font-size: 1.3rem;
        cursor: pointer;
      }
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .chat-bubble-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;

      &.user {
        justify-content: flex-end;

        .bubble-content {
          background: #7AA884;
          color: white;
          border-radius: 14px 14px 2px 14px;
        }

        .time-stamp { text-align: right; color: rgba(255, 255, 255, 0.7); }
      }

      &.assistant {
        justify-content: flex-start;

        .avatar-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #2b3a32;
          color: #7AA884;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .material-symbols-outlined { font-size: 16px; }
        }

        .bubble-content {
          background: white;
          color: #2b3a32;
          border-radius: 14px 14px 14px 2px;
          border: 1px solid #E5DFD5;
        }

        .time-stamp { color: #888; }
      }

      .bubble-content {
        max-width: 80%;
        padding: 12px 14px;
        font-size: 0.82rem;
        line-height: 1.45;

        .bubble-text { margin: 0; }
        .time-stamp { display: block; font-size: 0.65rem; margin-top: 4px; }
      }

      .suggestions-chips {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 10px;

        .sugg-chip {
          text-align: left;
          background: #F4F1EA;
          border: 1px solid #7AA884;
          color: #2b3a32;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.15s ease;

          &:hover {
            background: #7AA884;
            color: white;
          }
        }
      }
    }

    .typing-bubble {
      display: flex;
      gap: 4px;
      padding: 10px 14px;

      .typing-dot {
        width: 6px;
        height: 6px;
        background: #7AA884;
        border-radius: 50%;
        animation: blink 1.4s infinite both;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    @keyframes blink {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.2); }
    }

    .drawer-footer {
      padding: 14px 16px;
      background: white;
      border-top: 1px solid #E5DFD5;

      .input-row {
        display: flex;
        gap: 8px;

        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #dadce0;
          font-size: 0.85rem;
          outline: none;
          &:focus { border-color: #7AA884; }
        }

        .send-btn {
          background: #7AA884;
          color: white;
          border: none;
          width: 40px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          &:disabled { background: #ccc; cursor: not-allowed; }
        }
      }
    }
  `]
})
export class AiChatDrawerComponent {
  ai = inject(AiConciergeService);
  userInput = '';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.ai.isChatOpen()) {
      this.ai.closeChat();
    }
  }

  onSend(): void {
    if (!this.userInput.trim()) return;
    this.ai.sendMessage(this.userInput);
    this.userInput = '';
  }

  sendQuery(text: string): void {
    this.ai.sendMessage(text);
  }
}
