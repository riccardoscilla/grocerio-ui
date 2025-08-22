import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-share-shelf',
  template: `
    <app-scaffold [refresh]="false">
      <app-title appbar [title]="'Share Shelf'" [back]="'/more'"></app-title>
      
      <app-container content [padding]="'16px'">
        <app-row [label]="'Share Id'">
          <p-inputGroup>
            <input type="text" pInputText [(ngModel)]="shareId"/>
            <button type="button" pButton label="Generate" (click)="getShareId()"></button>
          </p-inputGroup>
        </app-row>

        <app-row [label]="'Join Shelf'">
          <p-inputGroup>
            <input type="text" pInputText [(ngModel)]="joinShareId"/>
            <button type="button" pButton label="Join" (click)="joinShelf()"></button>
          </p-inputGroup>
        </app-row>
      </app-container>

      <app-menu-bottom bottomtabbar />
  </app-scaffold>
  `,
})
export class ShareShelfComponent {
  shareId: string;
  joinShareId: string;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}

  getShareId() {
    this.apiService.getShelf().subscribe({
      next: (shelf) => {
        this.shareId = shelf.shareId;
        this.copyToClipboard();
      },
      error: (error) => {
        this.toastService.handleError(error, 'Error get share id');
      },
    });
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.shareId as string)
      .then(() => this.toastService.handleSuccess('Share Id copied!'));
  }

  joinShelf() {
    this.apiService.joinShelf(this.joinShareId).subscribe({
      next: () => {
        this.toastService.handleSuccess('Shelf changed!');
        this.router.navigateByUrl(`/shelf`);
      },
      error: (error) => {
        this.toastService.handleError(error, 'Error join shelf');
      },
    });
  }
}
