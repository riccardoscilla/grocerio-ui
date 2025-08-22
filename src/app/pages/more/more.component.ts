import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-more',
  template: ` 
    <app-scaffold [refresh]="false">
      <app-title appbar [title]="'More'"></app-title>

      <app-container content [padding]="'16px'">
        <app-list>
          <app-list-tile>
            <div content>Items</div>
            <p-button trailing [text]="true" [rounded]="true" (onClick)="goto('/items')">
              <ng-template pTemplate="icon">
                <app-svg [color]="'black'" [size]="18" [path]="'angle-small-right.svg'"></app-svg>
              </ng-template>
            </p-button>
          </app-list-tile>

          <app-list-tile>
            <div content>Categories</div>
            <p-button trailing [text]="true" [rounded]="true" (onClick)="goto('/categories')">
              <ng-template pTemplate="icon">
                <app-svg [color]="'black'" [size]="18" [path]="'angle-small-right.svg'"></app-svg>
              </ng-template>
            </p-button>
          </app-list-tile>

          <app-list-tile>
            <div content>Share Shelf</div>
            <p-button trailing [text]="true" [rounded]="true" (onClick)="goto('/share-shelf')">
              <ng-template pTemplate="icon">
                <app-svg [color]="'black'" [size]="18" [path]="'angle-small-right.svg'"></app-svg>
              </ng-template>
            </p-button>
          </app-list-tile>

          <app-list-tile>
            <div content>Timer</div>
            <p-button trailing [text]="true" [rounded]="true" (onClick)="goto('/timer')">
              <ng-template pTemplate="icon">
                <app-svg [color]="'black'" [size]="18" [path]="'angle-small-right.svg'"></app-svg>
              </ng-template>
            </p-button>
          </app-list-tile>
        </app-list>
        
        <p-button [outlined]="true" label="Logout" (click)="logout()" />
      </app-container>
      
      <app-menu-bottom bottomtabbar />
    </app-scaffold>
    `,
})
export class MoreComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.removeAuthResponse();
    this.router.navigateByUrl('/welcome');
  }

  goto(url: string) {
    this.router.navigateByUrl(url);
  }
}
