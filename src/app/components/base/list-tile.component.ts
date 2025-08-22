import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-list-tile',
  template: `
    <app-row [padding]="'0'" [height]="'56px'">
      <ng-content select="[leading]"></ng-content>

      <div class="list-tile-content-container" #fullflex (click)="onClick.emit()">
        <div class="list-tile-content">
          <ng-content select="[content]"></ng-content>
        </div>
        
        <ng-content select="[subcontent]"></ng-content>
        <!-- <div class="list-tile-subcontent">
        </div> -->
      </div>
      
      <ng-content select="[trailing]"></ng-content>
      <!-- <div class="list-tile-trailing">
      </div> -->
    </app-row>
  `,
  styles: [`
    :host {
    }

    .list-tile-content-container {
      height: 100%;
      display: flex;
      flex-direction: column;    
      justify-content: center;
      gap: 4px;
    }

    .list-tile-content {
      
    }

    .list-tile-subcontent {
      font-size: 14px;
      font-weight: 200;
    }

    :host ::ng-deep [subcontent] {
      font-size: 14px;
      font-weight: 200;
    }
  `]
})
export class ListTileComponent {
  @Output() onClick = new EventEmitter<void>();
}
