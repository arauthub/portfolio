import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  productSkus?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiConciergeService {
  private api = inject(ApiService);

  readonly isChatOpen = signal<boolean>(false);
  readonly isTyping = signal<boolean>(false);
  readonly messages = signal<ChatMessage[]>([
    {
      id: 'msg-init-kids',
      sender: 'assistant',
      text: 'Bonjour! I am your Petit Maison AI Nursery Concierge & Childcare Stylist. How may I assist you today with heirloom newborn gifts, sibling matching ensembles, or organic fabric guidance?',
      timestamp: 'Just now',
      suggestions: [
        'Curate a baby shower luxury gift set',
        'Recommend sibling matching outfits for age 2 & 5',
        'Explain GOTS certified organic cotton safety',
        'Which garments offer extendable cuffs for growth spurts?'
      ]
    }
  ]);

  openChat(): void {
    this.isChatOpen.set(true);
  }

  closeChat(): void {
    this.isChatOpen.set(false);
  }

  toggleChat(): void {
    this.isChatOpen.update(v => !v);
  }

  sendMessage(userQuery: string): void {
    if (!userQuery.trim() || this.isTyping()) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.isTyping.set(true);

    this.api.askWagtailAi(userQuery).subscribe({
      next: (res) => {
        const assistantMsg: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'assistant',
          text: res.reply || 'Petit Maison recommends our signature organic heirloom rompers with hypoallergenic mother-of-pearl buttons for the softest nursery comfort.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: res.suggestions || ['View Monogram Options', 'Check Age Sizing Guide', 'Talk to Human Stylist'],
          productSkus: res.recommended_skus || ['PMK-ROMP-001', 'PMK-SIB-005']
        };
        this.messages.update(msgs => [...msgs, assistantMsg]);
        this.isTyping.set(false);
      },
      error: () => {
        const fallbackMsg: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'assistant',
          text: 'For exquisite baby shower gifting, we recommend our Pure Cashmere Knit Romper and Peter Pan Collar Blouse. Both feature extendable cuffs designed to accommodate fast infant growth milestones gracefully.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Explore Gifting Sets', 'Add Gift Wrapping to Order']
        };
        this.messages.update(msgs => [...msgs, fallbackMsg]);
        this.isTyping.set(false);
      }
    });
  }
}
