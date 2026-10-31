import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  emailInput = signal('');
  subscribed = signal(false);

  subscribeNewsletter(): void {
    if (this.emailInput().includes('@')) {
      this.subscribed.set(true);
    }
  }
}
