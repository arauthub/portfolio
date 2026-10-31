import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="guide-backdrop" (click)="close()">
        <div class="guide-dialog" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          
          <div class="guide-header">
            <div class="header-left">
              <span class="guide-badge">FIRST-TIME PARENT & SHOPPER COMPASS</span>
              <h2>Welcome to Petit Maison Nursery & Kids</h2>
            </div>
            <button class="close-btn" (click)="close()">✕</button>
          </div>

          <!-- Step Progress Track -->
          <div class="steps-nav">
            @for (step of steps; track $index) {
              <button 
                class="step-tab" 
                [class.active]="currentStep() === $index"
                (click)="currentStep.set($index)">
                <span class="step-num">{{ $index + 1 }}</span>
                <span class="step-title">{{ step.title }}</span>
              </button>
            }
          </div>

          <!-- Step Content Body -->
          <div class="step-body">
            <div class="step-media">
              <img [src]="steps[currentStep()].image" [alt]="steps[currentStep()].title" />
              <div class="step-badge">{{ steps[currentStep()].subtitle }}</div>
            </div>

            <div class="step-info">
              <h3>{{ steps[currentStep()].headline }}</h3>
              <p class="desc">{{ steps[currentStep()].description }}</p>

              <div class="perks-list">
                @for (perk of steps[currentStep()].highlights; track perk) {
                  <div class="perk-item">
                    <span class="material-symbols-outlined check-icon">check_circle</span>
                    <span>{{ perk }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Step Navigation Footer -->
          <div class="guide-footer">
            <button class="prev-btn" (click)="prevStep()" [disabled]="currentStep() === 0">
              ← Previous
            </button>
            <div class="dots-indicator">
              @for (step of steps; track $index) {
                <span class="dot" [class.active]="currentStep() === $index"></span>
              }
            </div>
            @if (currentStep() < steps.length - 1) {
              <button class="next-btn" (click)="nextStep()">Next Chapter →</button>
            } @else {
              <button class="finish-btn" (click)="close()">Start Exploring Collection ✨</button>
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .guide-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 39, 32, 0.7);
      backdrop-filter: blur(8px);
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .guide-dialog {
      background: #FAF6EE;
      color: #2b3a32;
      width: 95vw;
      max-width: 820px;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(122, 168, 132, 0.3);
      display: flex;
      flex-direction: column;
    }

    .guide-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #F4F1EA;

      .guide-badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #7AA884;
        text-transform: uppercase;
      }

      h2 {
        margin: 4px 0 0;
        font-size: 1.4rem;
        font-weight: 800;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #666;
        &:hover { color: #000; }
      }
    }

    .steps-nav {
      display: flex;
      background: #EBE6DC;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      overflow-x: auto;
    }

    .step-tab {
      flex: 1;
      padding: 12px 10px;
      border: none;
      background: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      font-size: 0.76rem;
      font-weight: 600;
      color: #6d7d74;
      border-bottom: 3px solid transparent;
      white-space: nowrap;

      .step-num {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
      }

      &.active {
        background: #FAF6EE;
        color: #2b3a32;
        border-bottom-color: #7AA884;

        .step-num {
          background: #7AA884;
          color: white;
        }
      }
    }

    .step-body {
      padding: 24px;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 24px;
      min-height: 310px;
      align-items: center;
    }

    .step-media {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 4/5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .step-badge {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background: rgba(43, 58, 50, 0.85);
        color: white;
        font-size: 0.68rem;
        padding: 5px 8px;
        border-radius: 6px;
        text-align: center;
        backdrop-filter: blur(4px);
      }
    }

    .step-info {
      h3 {
        margin: 0 0 10px;
        font-size: 1.25rem;
        font-weight: 800;
        color: #2b3a32;
      }

      .desc {
        color: #556b60;
        font-size: 0.88rem;
        line-height: 1.55;
        margin-bottom: 18px;
      }

      .perks-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .perk-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.82rem;
        color: #2b3a32;
        font-weight: 600;

        .check-icon {
          color: #7AA884;
          font-size: 18px;
        }
      }
    }

    .guide-footer {
      padding: 16px 24px;
      background: #F4F1EA;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .prev-btn, .next-btn, .finish-btn {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }

      .prev-btn {
        background: #EBE6DC;
        color: #556b60;
        &:disabled { opacity: 0.4; cursor: not-allowed; }
      }

      .next-btn {
        background: #7AA884;
        color: white;
        &:hover { background: #679270; }
      }

      .finish-btn {
        background: #FF9F1C;
        color: white;
        &:hover { background: #e08b15; }
      }

      .dots-indicator {
        display: flex;
        gap: 6px;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ccc;

          &.active {
            background: #7AA884;
            width: 18px;
            border-radius: 4px;
          }
        }
      }
    }

    @media (max-width: 680px) {
      .step-body {
        grid-template-columns: 1fr;
      }
      .step-media {
        display: none;
      }
    }
  `]
})
export class UserGuideModalComponent {
  readonly isOpen = signal<boolean>(false);
  readonly currentStep = signal<number>(0);

  readonly steps = [
    {
      title: 'Organic Safety',
      subtitle: 'Zero Irritants, Zero Toxins',
      headline: 'Certified Hypoallergenic Nursery Textiles',
      description: 'Every Petit Maison garment undergoes strict OEKO-TEX Standard 100 Class I infant safety certification and uses 100% GOTS organic cotton free from synthetic fertilizers or harsh bleaches.',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Scratch-free flatlock seams with zero internal tags',
        'Lead-free, nickel-free Japanese YKK safety snap buttons',
        'Botanical enzyme washes gentle on sensitive eczema-prone baby skin'
      ]
    },
    {
      title: 'Growth Cuffs',
      subtitle: 'Clothes that Grow with Baby',
      headline: 'Foldover & Extendable Smart Architecture',
      description: 'Babies grow fast. Our garments feature signature rollable 2-stage cuffs and stretch gussets that extend the wearable lifespan of rompers and pyjamas by up to 6 extra months.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Rollable cuffs that adapt across growth milestones',
        '10-second rapid diaper change two-way zipper system',
        'Reinforced knee patches for curious crawling toddlers'
      ]
    },
    {
      title: 'Sibling Sets',
      subtitle: 'Family Harmony',
      headline: 'Curated Brother & Sister Matching Capsules',
      description: 'Create memorable family portraits with coordinate palettes designed for newborns, toddlers, and juniors sharing identical heirloom French flax linen and merino knits.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Harmonized tones across all age tiers (0-24M to 12Y)',
        'Automatic $20 bundle savings when purchasing sibling pairs',
        'Matching parents heirloom shawls available in lookbook'
      ]
    },
    {
      title: 'Monogramming',
      subtitle: 'Keepsake Personalization',
      headline: 'Bespoke Parisian Hand-Monogramming',
      description: 'Turn organic garments into cherished childhood keepsakes. Add your child’s name or initials embroidered in French Cursive or Heirloom Script with metallic threads.',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Choice of 3 authentic French typography styles',
        'Gold, champagne, and soft rose silk embroidery threads',
        'Complimentary luxury hard-shell baby keepsake gift box'
      ]
    },
    {
      title: 'Family Club',
      subtitle: 'Exclusive Member Perks',
      headline: 'Tiered Family Membership Privileges',
      description: 'Join the Petit Maison Family Club for instant 10% to 20% discounts on every order, free nursery priority shipping, and bespoke baby registry concierge access.',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&auto=format&fit=crop&q=80',
      highlights: [
        'Free Explorer: Standard organic catalogue & newsletter',
        'Petit Plus: 10% off all items + 2 free monogramming credits/year',
        'VIP Royal Nursery: 20% off all orders + personal childcare stylist'
      ]
    }
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  open(): void {
    this.currentStep.set(0);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  nextStep(): void {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }
}
