import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 16px;
      background-color: var(--bg-surface)
    }
  `]  
})
export class CardComponent {
}
