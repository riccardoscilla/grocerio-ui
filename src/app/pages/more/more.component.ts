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
            <app-button trailing variant="text" icon="angle-small-right.svg" iconSize="18" (onClick)="goto('/items')" />
          </app-list-tile>

          <app-list-tile>
            <div content>Categories</div>
            <app-button trailing variant="text" icon="angle-small-right.svg" iconSize="18" (onClick)="goto('/categories')" />
          </app-list-tile>

          <app-list-tile>
            <div content>Share Shelf</div>
            <app-button trailing variant="text" icon="angle-small-right.svg" iconSize="18" (onClick)="goto('/share-shelf')" />
          </app-list-tile>

          <app-list-tile>
            <div content>Timer</div>
            <app-button trailing variant="text" icon="angle-small-right.svg" iconSize="18" (onClick)="goto('/timer')" />
          </app-list-tile>

          <app-list-tile>
            <div content>test</div>
            <app-button trailing variant="text" icon="angle-small-right.svg" iconSize="18" (onClick)="goto('/test')" />
          </app-list-tile>
        </app-list>

        <app-row>
          <app-button #fullflex variant="outlined" label="Logout" (onClick)="logout()" />
        </app-row>
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
