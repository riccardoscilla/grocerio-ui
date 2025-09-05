import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-shelf-join',
  template: `
    <div style="padding: 24px 16px;">
      <div style="font-size: 32px; font-weight: 500;">Join Shelf</div>
    </div>

    <app-container [padding]="'16px'">
      <app-row>
        <p-selectButton
          [options]="shelfOptions"
          [(ngModel)]="shelfOption"
          [allowEmpty]="false"
          optionLabel="label"
          optionValue="value"
        />
      </app-row>

      <app-container *ngIf="!shelfOption">
        <app-row [label]="'Shelf Name'">
          <input #fullflex type="text" pInputText [(ngModel)]="shelfName" />
        </app-row>
        <app-row>
          <app-button #fullflex label="Create new Shelf" (onClick)="createNewShelf()" />
        </app-row>
      </app-container>

      <app-container *ngIf="shelfOption">
        <app-row [label]="'Share Id'">
          <input #fullflex type="text" pInputText [(ngModel)]="shareId" />
        </app-row>
        <app-row>
          <app-button #fullflex label="Join existing Shelf" (onClick)="joinShelf()" />
        </app-row>
      </app-container>
    </app-container>
  `,
  styles: [],
})
export class ShelfJoinComponent {
  shelfName: string;
  shareId: string;
  shelfOption: boolean = false;
  shelfOptions: any[] = [
    { label: 'New shelf', value: false },
    { label: 'Join shelf', value: true },
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  gotoLogin() {
    this.router.navigate(['login']);
  }

  createNewShelf() {
    const shelfNew = {
      name: this.shelfName,
    };
    this.apiService.saveShelf(shelfNew).subscribe({
      next: (shelf) => {
        this.shareId = shelf.shareId;
        this.joinShelf();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Create Shelf',
        });
      },
    });
  }

  joinShelf() {
    this.apiService.joinShelf(this.shareId).subscribe({
      next: (shelf) => {
        this.router.navigate(['shelf']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error Join Shelf',
        });
      },
    });
  }
}
