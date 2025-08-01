import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-share-shelf',
  templateUrl: './share-shelf.component.html',
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
