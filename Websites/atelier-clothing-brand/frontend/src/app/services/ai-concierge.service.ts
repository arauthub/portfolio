import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedSkus?: string[];
  stylistName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiConciergeService {
  private http = inject(HttpClient);
  private readonly baseUrl = (typeof window !== 'undefined' && window.location.port === '4200')
    ? 'http://localhost:8000/api/v1/ai'
    : 'http://localhost:8002/api/v1/ai';

  isOpen = signal<boolean>(false);
  isThinking = signal<boolean>(false);

  messages = signal<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: 'Bonjour & Welcome to Atelier Vogue. I am Geneviève, your Wagtail AI Personal Stylist. How may I assist you today with architectural tailoring, silk draping, VIP privileges, or in-store POS collection?',
      timestamp: 'Just now',
      stylistName: 'Geneviève — Wagtail AI Concierge',
      suggestedSkus: ['AV-OTR-001', 'AV-EVN-003']
    }
  ]);

  openDrawer(): void {
    this.isOpen.set(true);
  }

  closeDrawer(): void {
    this.isOpen.set(false);
  }

  toggleDrawer(): void {
    this.isOpen.set(!this.isOpen());
  }

  sendMessage(userQuery: string): void {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: userQuery,
      timestamp: 'Just now'
    };

    this.messages.update(list => [...list, userMsg]);
    this.isThinking.set(true);

    this.http.post<any>(`${this.baseUrl}/chat/`, { message: userQuery }).pipe(
      catchError(() => {
        // Resilient fallback logic
        const q = userQuery.toLowerCase();
        let reply = "Atelier Vogue silhouettes combine architectural structure with certified regenerative fibers. Would you like me to curate complementary garments or check in-store fitting availability?";
        let skus: string[] = ['AV-OTR-001'];

        if (q.includes('size') || q.includes('fit')) {
          reply = "Our Italian tailoring is sculpted true to size. For our double-faced cashmere coats, we advise choosing your standard sizing. VIP and Premium members receive complimentary bespoke alterations!";
          skus = ['AV-OTR-001', 'AV-OTR-002'];
        } else if (q.includes('vip') || q.includes('membership') || q.includes('plus')) {
          reply = "Atelier Memberships unlock exclusive privileges: Plus (10% off), Premium (15% off + luxury birthday gift), and VIP Black Tier (25% off + private runway access). All discounts apply automatically at checkout!";
          skus = [];
        } else if (q.includes('kids') || q.includes('baby') || q.includes('child')) {
          reply = "Looking for heirloom childrenswear? Visit our sister maison Petit Maison Kids under this same enterprise hub for 100% GOTS organic cotton and Room-to-Grow extendable cuffs!";
        } else if (q.includes('barcode') || q.includes('stock')) {
          reply = "You can use our live Barcode Scanner to instantly check real-time stock at our Milan, New York, or Mumbai flagships!";
        }

        return of({
          reply,
          suggested_skus: skus,
          stylist_name: 'Geneviève — Wagtail AI Concierge'
        });
      })
    ).subscribe(res => {
      this.isThinking.set(false);
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: res.reply || 'May I assist you with curated runway styling?',
        timestamp: 'Just now',
        suggestedSkus: res.suggested_skus || [],
        stylistName: res.stylist_name || 'Geneviève — Wagtail AI Concierge'
      };
      this.messages.update(list => [...list, aiMsg]);
    });
  }

  generateAdminCopy(title: string, fabric: string, category: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/generate-copy/`, { title, fabric, category }).pipe(
      catchError(() => of({
        success: true,
        generated_description: `Masterfully crafted from ${fabric}, this exquisite ${category.toLowerCase()} piece represents the pinnacle of modern Italian couture. Architectural lines merge seamlessly with ethical craftsmanship.`,
        seo_title: `${title} | Atelier Vogue`,
        care_guide: 'Specialist dry clean only. Steam with low temperature cloth protection. Store on contoured wooden hanger.'
      }))
    );
  }
}
